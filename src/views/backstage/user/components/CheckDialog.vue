<template>
  <el-dialog title="审核框" :visible.sync="isOpen" width="30%" center>
    <span>
      <el-form label-position="left" label-width="80px" :model="info">
        <el-form-item label="是否通过">
          <el-select v-model="info.pass" style="width: 100%" placeholder="请选择">
            <el-option label="通过" :value="1" :disabled="activePane != 0 && activePane != -1">
            </el-option>
            <el-option label="不通过" :value="-1" :disabled="activePane != 0 && activePane != 1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮件内容">
          <el-input v-model="info.content" type="textarea" rows="5" resize="none"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOpen = false">取 消</el-button>
      <el-button type="primary" @click="update()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      require: true,
    },
    isOpenCheck: {
      type: Boolean,
      require: true,
    },
    activePane: {
      type: String,
      require: true,
    },
  },
  data() {
    return { isOpen: false, info: {} }
  },
  watch: {
    checkInfo(newVal) {
      this.info = newVal
    },
    isOpenCheck(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenCheck', newVal)
    },
    info(newVal) {
      this.$emit('update:checkInfo', newVal)
    },
  },
  mounted() {
    this.info = this.checkInfo
  },
  methods: {
    update() {
      this.$emit('update')
    },
  },
}
</script>