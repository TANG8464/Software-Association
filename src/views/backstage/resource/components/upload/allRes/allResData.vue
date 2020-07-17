<template>
  <div class="allRes_table">
    <el-table
      ref="singleTable"
      :data="allRes"
      style="width: 100%;text-aligin:center;min-height:500px;"
      @row-contextmenu="more"
      @row-dblclick="more"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.5)"
    >
      <el-table-column
        label="文件"
        show-overflow-tooltip
        width="300"
        style="display: flex;align-items: center;"
      >
        <template slot-scope="scope">
          <img
            class="resImg"
            v-if="scope.row.resourceLogo"
            :src="scope.row.resourceLogo"
            alt
            width="40"
            height="40"
          />
          <span v-text="scope.row.resourceName" style="margin: 0 5px;"></span>
        </template>
      </el-table-column>
      <el-table-column property="resourceCategory.resourceCategoryName" label="资源分类" width="100"></el-table-column>

      <el-table-column property="uploadDate" label="上传日期"></el-table-column>
      <el-table-column property="member.memberName" label="上传者"></el-table-column>
      <el-table-column property="status" label="是否可下载">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="updateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column property="type" label="存储位置"></el-table-column>
      <el-table-column label width="80">
        <template slot-scope="scope">
          <a id="downloadRes" style="text-align: right;" @click="downloadRes(scope.row)">
            <down-load-icon :status="scope.row.status"></down-load-icon>
          </a>
        </template>
      </el-table-column>
    </el-table>
    <!--右击弹出更多设置-->
    <ul class="contentMenu" ref="contentMenu" :style="{opacity:moreOpacity}">
      <li class="contentMenu_item" @click="openDetails()">详细信息</li>
      <li class="contentMenu_item" @click="openUpdate()">修改</li>
      <li class="contentMenu_item" @click="openAffirm()">删除</li>
    </ul>
    <el-dialog title="详细信息" :visible.sync="isOpenDetails" width="30%" @close="Details={}">
      <res-details :Details="Details"></res-details>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
    <el-dialog title="修改信息" :visible.sync="isOpenUpdate" width="40%" @close="update={}">
      <update-res
        :update="update"
        :isOpenUpdate="isOpenUpdate"
        :fileType="fileType"
        @setLogo="setLogo"
      ></update-res>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateRes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moreIcon from "@/views/backstage/resource/components/upload/allRes/allResData/moreIcon.vue";
import downLoadIcon from "@/views/backstage/resource/components/upload/allRes/allResData/downLoadIcon.vue";
import resDetails from "@/views/backstage/resource/components/upload/allRes/allResData/resDetails.vue";
import updateRes from "@/views/backstage/resource/components/upload/allRes/allResData/updateRes.vue";

export default {
  data() {
    return {
      moreOpacity: 0, //更多设置框透明度
      isOpenDetails: false,
      isOpenUpdate: false,
      Details: {}, //当前选择项的详细信息
      update: {}, //当前选择项的修改信息
      selected: {}, //当前选中项
      fileType: null
    };
  },
  props: {
    allRes: {
      type: Array,
      default: function () {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    moreOpacity: function (newVal) {
      //将contentMenu消除以防误触
      let _this = this;
      if (newVal == 0) {
        setTimeout(function () {
          _this.$refs.contentMenu.style.display = "none";
        }, 1000);
      }
    }
  },
  methods: {
    setLogo(val) {
      this.update.resourceLogo = val;
    },
    more(row, column, event) {
      //打开更多选项设置
      event.preventDefault(); //阻止弹出默认窗
      let _this = this;
      this.$refs.contentMenu.style.display = "inline-block"; //先将其展示防止动画无效
      setTimeout(function () {
        //再将透明度变为1
        _this.moreOpacity = 1;
      }, 100);
      this.$refs.contentMenu.style.top = event.clientY + "px";
      this.$refs.contentMenu.style.left = event.clientX + "px";
      this.selected = row;
    },
    async openDetails() {
      //打开详细信息
      this.isOpenDetails = true;
      try {
        let res = await this.$axios.get(`/resources/${this.selected.id}`); //获取详细信息
        console.log(res);
        if (res.data.code === 200) {
          this.Details = res.data.data;
          console.log(this.Details);
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    openUpdate() {
      //打开修改
      let selected = this.selected;
      console.log(this.selected);
      this.isOpenUpdate = true;
      this.update = {
        author: selected.author,
        description: selected.description,
        resourceCategoryID: selected.resourceCategory.id,
        resourceLogo: selected.resourceLogo,
        resourceName: selected.resourceName
      };
      this.fileType = selected.fileType
        ? selected.fileType.split("/")[1]
        : "";
    },
    openAffirm() {
      //打开删除确认框
      this.$confirm(
        `此操作将永久删除"${this.selected.resourceName}", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.delRes();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async updateStatus(row) {
      //修改状态
      try {
        let res = await this.$axios.put(
          `resources/${row.id}/status?status=${row.status}`
        );
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: "修改成功"
            });
            this.$emit("setAllRes"); //重新渲染所有数据
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    //修改保存信息
    async updateRes() {
      try {
        let res = await this.$axios.put(
          `resources/${this.selected.id}`,
          this.update
        );
        if (res.data.code === 200) {
          this.isOpenUpdate = false;
          this.$message.success({
            message: "修改成功"
          });
          this.$emit("setAllRes"); //重新渲染所有数据
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async delRes() {
      //删除资源
      let ids = [];
      ids.push(this.selected.id);
      try {
        let res = await this.$axios.delete("resources/", {
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(ids)
        });
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: "删除成功"
            });
            this.$emit("setAllRes"); //重新渲染所有数据
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async downloadRes(row) {
      //下载文件
      try {
        if (row.status) {
          let res = await this.$axios.get(`/resources/download/${row.id}`, {
            params: {
              fileKey: row.fileKey,
              id: row.id
            }
          });
          if (res.status === 200) {
            if (res.data.code === 200) {
              console.log(res.data.data);
              let link = document.createElement("a");
              let blobUrl = res.data.data;
              link.href = blobUrl;
              link.download = `${row.resourceName}`;
              link.id = "downLink";
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              this.$message.error({
                message: res.data.message
              });
            }
          } else {
            this.$message.error({
              message: "请求错误"
            });
          }
        } else {
          this.$message.warning({
            message: "不可下载"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  components: {
    moreIcon,
    downLoadIcon,
    resDetails,
    updateRes
  }
};
</script>
<style scoped>
.contentMenu {
  list-style: none;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  display: inline-block;
  box-shadow: 0px 0px 10px 1px #e0e0e0;
  position: fixed;
  z-index: 100;
  transition: all 0.3s;
  padding: 10px 0;
}
.contentMenu_item {
  padding: 10px 15px;
  font-size: 13px;
  cursor: pointer;
}
.contentMenu_item:hover {
  background-color: rgb(221, 243, 255);
  color: rgb(81, 193, 253);
}
.resImg {
  border-radius: 3px;
}
</style>
<style>
.el-table .cell.el-tooltip {
  display: flex;
  align-items: center;
}
</style>