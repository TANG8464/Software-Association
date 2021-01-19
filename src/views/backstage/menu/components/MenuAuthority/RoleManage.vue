<template>
  <div class="manage">
    <el-divider content-position="left">角色管理</el-divider>
    <!--动画效果-->
    <transition-group
      style="list-style: none"
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
        v-for="(item, index) in allRole"
        :key="item.roleId"
        :data-index="index"
      >
        <div style="border-bottom: 1px solid rgb(63, 172, 236); margin: 0 5px">
          <span>{{ item.roleName }}</span>
          <div style="float: right; padding: 0">
            <span @click="openUpdate(item)">
              <icon name="edit" scale="22" width="20"></icon>
            </span>
            <span @click="delTip(item.roleId, item.roleName)">
              <icon name="close" scale="22" width="20"></icon>
            </span>
          </div>
        </div>
        <p>{{ item.remark }}</p>
        <small>{{ item.createTime }}</small>
      </li>
    </transition-group>
    <!--添加角色弹出框-->
    <add-role-dialog
      :isOpen.sync="isOpenAdd"
      :role.sync="role"
      @addRole="addRole"
      :loaded="loaded"
    ></add-role-dialog>
    <!--修改角色弹出框-->
    <update-role-dialog
      :isOpen.sync="isOpenUpdate"
      :role.sync="role"
      @updateRole="updateRole"
    ></update-role-dialog>
  </div>
</template>

<script>
import AddRoleDialog from './AddRoleDialog'
import UpdateRoleDialog from './UpdateRoleDialog'
import { addRole, deleteRole, updateRole } from '@/api/menu/role'
export default {
  components: {
    AddRoleDialog,
    UpdateRoleDialog,
  },
  data() {
    return {
      loaded: false,
      isOpenAdd: false, //是否打开添加角色弹出框
      isOpenUpdate: false, //是否打开修改角色弹出框
      role: {}, //存储添加或修改角色的数据
      formLabelWidth: '120px', //表单文字标签宽度
    }
  },
  props: {
    //所有角色
    allRole: {
      type: Array,
      default: [],
    },
  },
  watch: {
    allRole() {
      this.loaded = true
    },
  },
  methods: {
    //动态效果初始样式
    beforeEnter: function (el) {
      //展示与管理角色动画效果开始前
      //设置每个元素样式
      el.style.opacity = 0.1 //透明度为0
      el.style.position = 'relative' //设置以本来位置
      el.style.left = '80px' //往做偏差50px
    },
    //动态效果进入动画
    enter: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 1, left: 0 }, { complete: done })
      }, delay)
    },
    //动态效果离开动画
    leave: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        Velocity(el, { opacity: 0, left: '50px' }, { complete: done })
      }, delay)
    },
    //添加角色
    async addRole() {
      const res = await addRole(this.role)
      if (res.code === 200) {
        this.$message.success('添加成功')
        this.isOpenAdd = false
        this.role = {}
        this.$emit('setAllRole')
      } else this.$message.error(res.message)
    },
    //删除角色提示
    delTip(id, name) {
      this.$confirm(`此操作将永久删除"${name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delRole(id)
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //删除角色
    async delRole(id) {
      const ids = [id]
      const res = await deleteRole(ids)
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.$emit('setAllRole')
      } else this.$message.error(res.message)
    },
    //打开修改角色菜单框
    openUpdate(item) {
      const { roleId, roleName, remark } = item
      this.role = { roleId, roleName, remark }
      this.isOpenUpdate = true
    },
    //修改角色
    async updateRole() {
      const res = await updateRole(this.role.roleId, this.role)
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.isOpenUpdate = false
        this.$emit('setAllRole')
      } else this.$message.error(res.message)
    },
  },
}
</script>

<style scoped>
/*
设置role卡片样式
*/
.roleMenu {
  max-width: 350px;
  width: 100%;
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
  color: #83c0fd;
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

.add-box:hover {
  color: #409eff;
}
</style>
