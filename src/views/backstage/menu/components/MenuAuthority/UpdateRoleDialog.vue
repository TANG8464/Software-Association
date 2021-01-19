<template>
  <el-dialog title="修改角色" :visible.sync="isOpenUpdate" width="25%" @close="roleInfo = {}">
    <el-form :model="roleInfo">
      <el-form-item>
        <el-input
          v-model="roleInfo.roleId"
          autocomplete="off"
          placeholder="角色ID"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="roleInfo.roleName"
          autocomplete="off"
          placeholder="角色名称"
          @keypress.enter.native="updateRole()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="roleInfo.remark"
          autocomplete="off"
          placeholder="角色描述"
          @keypress.enter.native="updateRole()"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOpenUpdate = false">取 消</el-button>
      <el-button type="primary" @click="updateRole()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    role: {
      type: Object,
      require: true,
    },
    isOpen: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      roleInfo: {},
      isOpenUpdate: false,
    }
  },
  watch: {
    role(newVal) {
      this.roleInfo = newVal
    },
    roleInfo(newVal) {
      this.$emit('update:role', newVal)
    },
    isOpen(newVal) {
      this.isOpenUpdate = newVal
    },
    isOpenUpdate(newVal) {
      this.$emit('update:isOpen', newVal)
    },
  },
  methods: {
    updateRole() {
      this.$emit('updateRole')
    },
  },
}
</script>