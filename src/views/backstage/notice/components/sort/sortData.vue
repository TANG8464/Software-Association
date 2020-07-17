<template>
  <div class="sortData">
    <!--分类数据-->
    <transition-group
      name="sortArr"
      mode="out-in"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
    >
      <li class="sortArr" v-for="(item,index) in allSort" :key="item.id" :data-index="index">
        <el-row :gutter="24" style="width:100%;text-align:center;">
          <el-col :span="3">
            <p>
              <el-checkbox :label="item.id" v-model="dels"></el-checkbox>
            </p>
          </el-col>
          <el-col :span="7">
            <h4 style="margin:16px 0">{{item.newsCategoryName}}</h4>
          </el-col>
          <el-col :span="8" v-if="!isVertical">
            <p style="text-overflow: ellipsis;white-space: nowrap;overflow:hidden;">{{item.remark}}</p>
          </el-col>
          <el-col :span="lastSpan" style="text-align:right;">
            <p>
              <span class="update-span" @click="openUpdate(item)">
                <update-icon></update-icon>
              </span>
              <span class="del-span" @click="delTip(item.id)">
                <del-icon></del-icon>
              </span>
            </p>
          </el-col>
        </el-row>
      </li>
    </transition-group>
    <!--修改分类-->
    <el-dialog
      title="修改分类"
      v-if="isOpenUpdate"
      :visible.sync="isOpenUpdate"
      width="25%"
      style="text-align:left;"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form :model="updateSort">
        <el-form-item label="分类ID">
          <el-input v-model="updateSort.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="updateSort.newsCategoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input type="textarea" v-model="updateSort.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="update(updateSort.id)">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import updateIcon from "@/views/backstage/notice/components/sort/sortData/updateIcon.vue";
import delIcon from "@/views/backstage/notice/components/sort/sortData/delIcon.vue";
export default {
  data() {
    return {
      allSort: [], //所有分类
      dels: [], //删除项
      isCheckAll: false, //是否全选
      isIndeterminate: false, //是否不全选
      isOpenUpdate: false, //是否打开修改菜单
      updateSort: {} //修改分类时上传给服务端的数据
    };
  },
  //响应式用到的属性
  props: {
    isVertical: {
      //是否展示remark
      type: Boolean,
      default: true
    },
    lastSpan: {
      //最后一列的宽度
      type: Number,
      default: 6
    }
  },
  watch: {
    //监听选中值,改变全选样式
    dels(newVal) {
      let asLen = this.allSort.length;
      if (newVal.length === asLen) {
        this.$emit("setIsCheckAll", true);
        this.$emit("setIsIndeterminate", false);
      } else if (newVal.length === 0) {
        this.$emit("setIsCheckAll", false);
        this.$emit("setIsIndeterminate", false);
      } else if (newVal.length < asLen) {
        this.$emit("setIsIndeterminate", true);
      }
      this.$emit("setDels", newVal.length);
    },
    //监听是否全选,改变选中数据
    isCheckAll: function(newVal) {
      if (newVal) {
        this.allSort.forEach(item => {
          if (this.dels.indexOf(item.id) == -1) this.dels.push(item.id);
        });
      } else {
        this.dels = [];
      }
      this.$emit("setIsCheckAll", newVal);
    }
  },
  methods: {
    //动画效果初始状态
    beforeEnter: function(el) {
      el.style.opacity = 0;
      el.style.position = "relative";
      el.style.height = "1.6em";
      el.style.top = "100px";
      el.style.left = 0;
    },
    //动画效果进入动画
    enter: function(el, done) {
      var delay = el.dataset.index * 100;
      setTimeout(function() {
        Velocity(el, { top: 0, opacity: 1 }, { complete: done });
      }, delay);
    },
    //动画效果离开动画
    leave: function(el, done) {
      var delay = el.dataset.index * 80;
      setTimeout(function() {
        Velocity(el, { opacity: 0, left: "-100px" }, { complete: done });
      }, delay);
    },
    //删除
    async delSort(ids) {
      try {
        let res = await this.$axios.delete("newscategory/", {
          data: ids
        });
       
          let type = "";
          if (res.data.code === 200) type = "success";
          else type = "error";
          this.$message({
            type: type,
            message: res.data.message
          });
          //重新渲染所有数据
          await this.$emit("setAllSort", this.allSort.pageNo);
          //解决选中全选时，点击了删除按钮
          if (ids.length === 1) {
            let index = this.dels.indexOf(ids[0]);
            if (index != -1) this.dels.splice(index, 1);
          } else {
            this.dels = [];
          }
      } catch (err) {
        console.log(err);
      }
    },
    //删除提示
    delTip(dels) {
      let ids = [];
      if (!dels) {
        ids = this.dels;
      } else {
        ids.push(dels);
      }
      if (ids.length === 0) {
        this.$message({
          message: "您还没有选择删除项哦",
          center: true,
          customClass: "noChecked",
          iconClass: "el-icon-warning"
        });
      } else {
        this.$confirm(
          `此操作将永久删除这${ids.length}条分类, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.delSort(ids);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
     //打开修改分类菜单框
    openUpdate(item) {
      this.updateSort = item;
      this.isOpenUpdate = true;
    },
    //修改分类
    async update(id) {
      try {
        let res = await this.$axios.put("newscategory/" + id, this.updateSort);
        if (res.status === 200) {
          let type = "";
          if (res.data.code === 200) type = "success";
          else type = "error";
          this.$message({
            type: type,
            message: res.data.message
          });
          await this.$emit("setAllSort", this.allSort.pageNo);
          this.isOpenUpdate = false;
        } else {
          this.$message.error({
            message: "请求出错！"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  components: {
    updateIcon,
    delIcon
  }
};
</script>