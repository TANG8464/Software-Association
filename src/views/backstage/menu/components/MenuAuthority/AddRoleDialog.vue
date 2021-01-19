<template>
  <el-popover
    data-active="添加角色弹出框"
    placement="bottom"
    width="300"
    trigger="click"
    v-model="isOpenAdd"
    @close="roleInfo = {}"
  >
    <!--添加角色表单-->
    <div>
      <p>添加角色</p>
      <el-form :model="roleInfo">
        <el-form-item>
          <el-input
            v-model="roleInfo.roleName"
            autocomplete="off"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="roleInfo.remark" autocomplete="off" placeholder="角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="float: right">
        <el-button @click="isOpenAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRole()" @keypress.enter.native="addRole()"
          >确 定</el-button
        >
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
        <span style="margin: auto auto">
          <icon name="add" scale="40" width="40"></icon>
        </span>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      require: true,
    },
    role: {
      type: Object,
      require: true,
    },
    loaded: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      isOpenAdd: false,
      roleInfo: {},
    }
  },
  watch: {
    isOpen(newVal) {
      this.isOpenAdd = newVal
    },
    isOpenAdd(newVal) {
      this.$emit('update:isOpen', newVal)
    },
    role(newVal) {
      this.roleInfo = newVal
    },
    roleInfo(newVal) {
      this.$emit('update:role', newVal)
    },
    loaded(newVal) {
      if (!newVal) return
      const el = this.$refs.add
      setTimeout(() => {
        el.style.opacity = 1
        el.style.left = 0
      }, (this.$parent.allRole.length | 1) * 300)
    },
  },
  methods: {
    addRole() {
      this.$emit('addRole')
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