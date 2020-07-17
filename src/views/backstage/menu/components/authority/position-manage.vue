<template>
  <div class="manage">
    <el-divider content-position="left">职位管理</el-divider>
    <!--动画效果-->
    <transition-group
      style="list-style:none"
      name="staggered-fade"
      tag="ul"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      data-active="动画效果"
    >
      <!--职位展示与管理-->
      <li
        class="positionMenu"
        data-active="职位展示与管理"
        v-for="(item,index) in allPosition"
        :key="index"
        :data-index="index"
      >
        <div style="margin:0 5px;">
          <span>{{item.positionName}}</span>
          <div style="float:right;padding:0;">
            <svg
              @click="openUpdate(item)"
              t="1591344678985"
              class="icon update-position"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7017"
              width="20"
              height="20"
            >
              <path
                d="M799.5 927.3H156.3c-32.3 0-58.5-26.3-58.5-58.5V225.7c0-32.3 26.3-58.5 58.5-58.5h517.4c11.4 0 20.7 9.3 20.7 20.7s-9.3 20.7-20.7 20.7H156.3c-9.4 0-17.1 7.7-17.1 17.1v643.1c0 9.4 7.7 17.1 17.1 17.1h643.1c9.4 0 17.1-7.7 17.1-17.1v-493c0-11.4 9.3-20.7 20.7-20.7s20.7 9.3 20.7 20.7v493c0.1 32.3-26.1 58.5-58.4 58.5z"
                class="update-position_icon"
                p-id="7018"
              />
              <path
                d="M552 493.6c-5.3 0-10.6-2-14.6-6.1-8.1-8.1-8.1-21.2 0-29.3l355.3-355.3c8.1-8.1 21.2-8.1 29.3 0 8.1 8.1 8.1 21.2 0 29.3L566.6 487.5c-4.1 4.1-9.4 6.1-14.6 6.1z"
                class="update-position_icon"
                p-id="7019"
              />
            </svg>
            <svg
              t="1591344818079"
              class="icon del-position"
              viewBox="0 0 1235 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8791"
              width="20"
              height="20"
              @click="delTip(item.id,item.positionName)"
            >
              <path
                d="M572.323537 512L892.148793 831.825256c11.656766 11.656766 11.656766 30.55665 0 42.213416s-30.55665 11.656766-42.213416 0L530.110121 554.213416 210.284865 874.038672c-11.656766 11.656766-30.55665 11.656766-42.213416 0s-11.656766-30.55665 0-42.213416L487.896705 512 168.071449 192.174744c-11.656766-11.656766-11.656766-30.55665 0-42.213416s30.55665-11.656766 42.213416 0l319.825256 319.825256L849.935377 149.961328c11.656766-11.656766 30.55665-11.656766 42.213416 0s11.656766 30.55665 0 42.213416l-319.825256 319.825256z"
                p-id="8792"
                fill="#d81e06"
              />
            </svg>
          </div>
        </div>
        <p>{{item.remark}}</p>
      </li>
    </transition-group>
    <!--添加职位弹出框-->
    <el-popover
      data-active="添加职位弹出框"
      placement="bottom"
      width="300"
      trigger="click"
      v-model="isOpenAdd"
      @close="position={}"
    >
      <!--添加职位表单-->
      <div>
        <p>添加职位</p>
        <el-form :model="position">
          <el-form-item>
            <el-input v-model="position.positionName" autocomplete="off" placeholder="职位名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="position.remark" autocomplete="off" placeholder="职位描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="float:right;">
          <el-button @click="isOpenAdd = false">取 消</el-button>
          <el-button type="primary" @click="addPosition()">确 定</el-button>
        </span>
      </div>
      <!--添加职位按钮-->
      <div slot="reference" class="add-box" ref="addBox">
        <div class="add gradual-change" ref="add">
          <!--添加职位图标-->
        </div>
        <svg
          style="margin:auto auto;"
          t="1591326168698"
          class="icon"
          viewBox="0 0 1077 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2811"
          width="50"
          height="50"
        >
          <path
            d="M139.636364 531.948052h797.922078c25.666494 0 25.666494-39.896104 0-39.896104h-797.922078c-25.666494 0-25.666494 39.896104 0 39.896104z"
            p-id="2812"
            class="addIcon"
          />
          <path
            d="M518.649351 113.038961v797.922078c0 25.666494 39.896104 25.666494 39.896104 0V641.263377 211.449351 113.038961c0-25.666494-39.896104-25.666494-39.896104 0z"
            p-id="2813"
            class="addIcon"
          />
        </svg>
      </div>
    </el-popover>
    <!--修改职位弹出框-->
    <el-dialog title="修改职位" :visible.sync="isopenUpdate" width="25%" @close="position={}">
      <el-form :model="position">
        <el-form-item>
          <el-input v-model="position.positionId" autocomplete="off" placeholder="职位ID" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="position.positionName" autocomplete="off" placeholder="职位名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tooltip :disabled="true" content="点击关闭 tooltip 功能" placement="bottom" effect="light">
            <el-input v-model="position.remark" autocomplete="off" placeholder="职位描述"></el-input>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isopenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updatePosition()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allPosition: [], //所有职位
      isOpenAdd: false, //是否打开添加职位弹出框
      isopenUpdate: false, //是否打开修改职位弹出框
      position: {}, //存储添加或修改职位的数据
      formLabelWidth: "120px" //表单文字标签宽度
    };
  },
  created() {
    this.setAllPosition();
  },
  mounted() {},
  allPosition: function(newVal) {
    //监听获取到所有元素之后动态展示添加按钮
  },
  methods: {
    //动态效果初始样式
    beforeEnter: function(el) {
      //展示与管理职位动画效果开始前
      //设置每个元素样式
      el.style.opacity = 0; //透明度为0
      el.style.position = "relative"; //设置以本来位置
      el.style.left = "80px"; //往做偏差50px
    },
    //动态效果进入动画
    enter: function(el, done) {
      var delay = el.dataset.index * 200;
      setTimeout(function() {
        Velocity(el, { opacity: 1, left: 0 }, { complete: done });
      }, delay);
    },
    //动态效果离开动画
    leave: function(el, done) {
      var delay = el.dataset.index * 200;
      setTimeout(function() {
        Velocity(el, { opacity: 0, left: "50px" }, { complete: done });
      }, delay);
    },
    async setAllPosition() {
      try {
        let res = await this.$axios.get("member/position/page");
        if (res.data.code === 200) {
          this.allPosition = res.data.data.records;
          let el = this.$refs.addBox;
          setTimeout(() => {
            el.style.opacity = 1;
            el.style.left = 0;
          }, this.allPosition.length * 200);
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    //添加职位
    async addPosition() {
      try {
        let res = await this.$axios.post("member/position/", this.position);
        if (res.data.code === 200) {
          this.$message.success({
            message: "添加成功"
          });
          this.isOpenAdd = false;
          this.position = {};
          this.setAllPosition();
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
    },
    //删除职位提示
    delTip(id, name) {
      this.$confirm(`此操作将永久删除"${name}", 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delPosition(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除职位
    async delPosition(id) {
      try {
        let ids = [];
        ids.push(id);
        let res = await this.$axios.delete("member/position/", {
          data: ids
        });
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: "删除成功"
            });
            this.setAllPosition();
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
        this.$message.error({
          message: err
        });
      }
    },
    //打开修改职位菜单框
    openUpdate(item) {
      let position = item;
      this.position = {
        id: position.id,
        positionName: position.positionName,
        remark: position.remark
      };
      this.isopenUpdate = true;
    },
    //修改职位
    async updatePosition() {
      try {
        let res = await this.$axios.put("member/position/", this.position);
        if (res.data.code === 200) {
          this.$message.success({
            message: "修改成功"
          });
          this.isopenUpdate = false;
          this.setAllPosition();
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
    }
  }
};
</script>
<style scoped>
/*
设置position卡片样式
*/
.positionMenu,
.add-box {
  width: 300px;
  height: 80px;
  border: 1px solid #fdc6a7;
  border-radius: 10px;
  background-color: #ffefe2;
  margin: 5px;
  float: left;
  text-align: left;
}
.add-box {
  transition: all 1s;
  opacity: 0;
  position: relative;
  left: 80px;
  display: flex;
  align-items: center;
}
.positionMenu div,
.positionMenu p,
.positionMenu small {
  margin: 0;
  padding: 10px;
  color: #fa7528;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.positionMenu p {
  width: 100%;
}
.positionMenu small {
  display: block;
  text-align: right;
  font-size: 12px;
}
.add {
  transition: 0.2s linear;
  width: 0;
  border-radius: 10px 150px 10px 10px;
  height: 80px;
  background: linear-gradient(to right, #ffb78d, #ffe3cd, #ffb78d);
  overflow: hidden;
  opacity: 0;
}
.add-box:hover .add {
  border-radius: 10px;
  width: 100%;
  opacity: 1;
  background-size: 200% 100%;
  animation: slide 3s forwards linear alternate-reverse infinite;
}
@keyframes slide {
  0% {
    background-size: 200% 100%;
  }
  50% {
    background-size: 100% 100%;
  }
  100% {
    background-size: 200% 100%;
  }
}
.add-box svg {
  position: absolute;
  left: 40%;
}
.addIcon {
  fill: #fa7528;
}
.add-box:hover .addIcon {
  fill: #ffffff;
}
.update-position_icon {
  fill: #fa7528;
}
</style>