<template>
  <el-dialog title="修改职位" :visible.sync="isOpenUpdate" width="25%" @close="positionInfo = {}">
    <el-form :model="positionInfo">
      <el-form-item>
        <el-input
          v-model="positionInfo.positionId"
          autocomplete="off"
          placeholder="职位ID"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="positionInfo.positionName"
          autocomplete="off"
          placeholder="职位名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-tooltip
          :disabled="true"
          content="点击关闭 tooltip 功能"
          placement="bottom"
          effect="light"
        >
          <el-input
            v-model="positionInfo.remark"
            autocomplete="off"
            placeholder="职位描述"
          ></el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOpenUpdate = false">取 消</el-button>
      <el-button type="primary" @click="updatePosition()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    //职位信息
    position: {
      type: Object,
      require: true,
    },
    //是否打开修改菜单
    isOpen: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      positionInfo: {},
      isOpenUpdate: false, //是否打开修改菜单
    }
  },
  watch: {
    position(newVal) {
      this.positionInfo = newVal
    },
    positionInfo(newVal) {
      this.$emit('update:position', newVal)
    },
    isOpen(newVal) {
      this.isOpenUpdate = newVal
    },
    isOpenUpdate(newVal) {
      this.$emit('update:isOpen', newVal)
    },
  },
  methods: {
    updatePosition() {
      this.$emit('updatePosition')
    },
  },
}
</script>