<template>
  <div class="manage">
    <el-divider content-position="left">角色管理</el-divider>
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
      <!--角色展示与管理-->
      <li
        class="roleMenu"
        data-active="角色展示与管理"
        v-for="(item,index) in allRole"
        :key="item.roleId"
        :data-index="index"
      >
        <div style=" border-bottom:1px solid rgb(63,172,236);margin:0 5px;">
          <span>{{item.roleName}}</span>
          <div style="float:right;padding:0;">
            <svg
              @click="openUpdate(item)"
              t="1591344678985"
              class="icon update-role"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7017"
              width="20"
              height="20"
            >
              <path
                d="M799.5 927.3H156.3c-32.3 0-58.5-26.3-58.5-58.5V225.7c0-32.3 26.3-58.5 58.5-58.5h517.4c11.4 0 20.7 9.3 20.7 20.7s-9.3 20.7-20.7 20.7H156.3c-9.4 0-17.1 7.7-17.1 17.1v643.1c0 9.4 7.7 17.1 17.1 17.1h643.1c9.4 0 17.1-7.7 17.1-17.1v-493c0-11.4 9.3-20.7 20.7-20.7s20.7 9.3 20.7 20.7v493c0.1 32.3-26.1 58.5-58.4 58.5z"
                fill="#409eff"
                p-id="7018"
              />
              <path
                d="M552 493.6c-5.3 0-10.6-2-14.6-6.1-8.1-8.1-8.1-21.2 0-29.3l355.3-355.3c8.1-8.1 21.2-8.1 29.3 0 8.1 8.1 8.1 21.2 0 29.3L566.6 487.5c-4.1 4.1-9.4 6.1-14.6 6.1z"
                fill="#409eff"
                p-id="7019"
              />
            </svg>
            <svg
              t="1591344818079"
              class="icon del-role"
              viewBox="0 0 1235 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8791"
              width="20"
              height="20"
              @click="delTip(item.roleId,item.roleName)"
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
        <small>{{item.createTime}}</small>
      </li>
    </transition-group>
    <!--添加角色弹出框-->
    <el-popover
      data-active="添加角色弹出框"
      placement="bottom"
      width="300"
      trigger="click"
      v-model="isOpenAdd"
      @close="role={}"
    >
      <!--添加角色表单-->
      <div>
        <p>添加角色</p>
        <el-form :model="role">
          <el-form-item>
            <el-input v-model="role.roleName" autocomplete="off" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="role.remark" autocomplete="off" placeholder="角色描述"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" style="float:right;">
          <el-button @click="isOpenAdd = false">取 消</el-button>
          <el-button type="primary" @click="addRole()">确 定</el-button>
        </span>
      </div>
      <!--添加角色按钮-->
      <div class="add-box" slot="reference">
        <div
          class="add"
          ref="add"
          @mouseout="$refs.add.style.transform = 'rotate(-90deg)'"
          @mouseover="$refs.add.style.transform = 'rotate(0deg)'"
        >
          <!--添加角色图标-->
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
      </div>
    </el-popover>
    <!--修改角色弹出框-->
    <el-dialog title="修改角色" :visible.sync="isopenUpdate" width="25%" @close="role={}">
      <el-form :model="role">
        <el-form-item>
          <el-input v-model="role.roleId" autocomplete="off" placeholder="角色ID" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="role.roleName" autocomplete="off" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="role.remark" autocomplete="off" placeholder="角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isopenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // allRole: [], //所有角色
      isOpenAdd: false, //是否打开添加角色弹出框
      isopenUpdate: false, //是否打开修改角色弹出框
      role: {}, //存储添加或修改角色的数据
      formLabelWidth: "120px" //表单文字标签宽度
    };
  },
  props: {
    //所有角色
    allRole: {
      type: Array,
      default: []
    }
  },
  watch: {
    allRole: function(newVal) {
      //监听获取到所有元素之后动态展示添加按钮
      setTimeout(() => {
        this.$refs.add.style.opacity = 1;
        this.$refs.add.style.transform = "rotate(90deg)";
      }, newVal.length * 200);
    }
  },
  methods: {
    //动态效果初始样式
    beforeEnter: function(el) {
      //展示与管理角色动画效果开始前
      //设置每个元素样式
      el.style.opacity = 0.1; //透明度为0
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
    //添加角色
    async addRole() {
      try {
        let res = await this.$axios.post("sys/role/", this.role);
        if (res.data.code === 200) {
          this.$message.success({
            message: "添加成功"
          });
          this.isOpenAdd = false;
          this.role = {};
          this.$emit("setAllRole");
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
    //删除角色提示
    delTip(id, name) {
      this.$confirm(`此操作将永久删除"${name}", 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRole(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //删除角色
    async delRole(id) {
      try {
        let ids = [];
        ids.push(id);
        let res = await this.$axios.delete("sys/role/", {
          data: ids
        });
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: "删除成功"
            });
            this.$emit("setAllRole");
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
    //打开修改角色菜单框
    openUpdate(item) {
      let role = item;
      this.role = {
        roleId: role.roleId,
        roleName: role.roleName,
        remark: role.remark
      };
      this.isopenUpdate = true;
    },
    //修改角色
    async updateRole() {
      try {
        let res = await this.$axios.put(
          "sys/role/" + this.role.roleId,
          this.role
        );
        if (res.data.code === 200) {
          this.$message.success({
            message: "修改成功"
          });
          this.isopenUpdate = false;
          this.$emit("setAllRole");
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
设置role卡片样式
*/
.roleMenu {
  width: 300px;
  height: 120px;
  border: 1px solid #d4eaff;
  color: #666666;
  border-radius: 10px;
  background-color: #ecf5ff;
  margin: 5px;
  float: left;
  text-align: left;
}
.roleMenu div,
.roleMenu p,
.roleMenu small {
  margin: 0;
  padding: 10px;
  color: #409eff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.roleMenu small {
  display: block;
  text-align: right;
  font-size: 12px;
}
/*
设置添加按钮样式
*/
.add-box {
  height: 110px;
  width: 110px;
  float: left;
  display: flex;
  align-items: center;
  margin: 5px;
}
.add {
  width: 80px;
  height: 80px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: all 1s;
  opacity: 0;
  margin: auto auto;
  transform: rotate(0deg);
}
.addIcon {
  fill: #83c0fd;
}
.add:hover .addIcon {
  fill: #409eff;
}
</style>