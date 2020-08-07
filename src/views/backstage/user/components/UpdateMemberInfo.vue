<template>
  <div class="update-member-info">
    <el-dialog title="修改成员信息" :visible.sync="isOpen" width="45%" :fullscreen="size.isSmallSize">
      <member-info-form :personalInfo.sync="info" @submitForm="update" :col="2"></member-info-form>
    </el-dialog>
  </div>
</template>
<script>
import MemberInfoForm from '@/components/MemberInfoForm'
import memberInfo from '@/utils/memberInfo'
import { searchCascadeClass } from '@/api/searchData'
export default {
  name: 'updateMemberInfo',
  props: {
    isOpenUpdateInfo: {
      type: Boolean,
      require: true,
    },
    memberInfo: {
      type: Object,
      require: true,
    },
  },
  components: {
    MemberInfoForm,
  },
  data() {
    return {
      info: null,
      isOpen: false,
      cascadeClass: [],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    isOpenUpdateInfo(newVal) {
      this.isOpen = newVal
    },
    memberInfo(newVal) {
      this.info = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenUpdateInfo', newVal)
    },
  },
  methods: {
    async setCascadeClass() {
      const res = await searchCascadeClass()
      console.log(res)

      this.cascadeClass = res
    },
    update() {
      this.isOpen = false
      this.$emit('update:memberInfo', this.info)
      this.$emit('updateMemberInfo')
    },
  },
}
</script>
<style>
.update-member-info .el-select {
  max-width: 300px;
  width: 100%;
}
.update-member-info .el-form-item {
  max-width: 300px;
  width: 100%;
  display: inline-block;
  margin: 0 5px;
}
.update-member-info .el-form--label-top .el-form-item__label {
  padding: 0;
  padding-top: 5px;
}
.update-member-info .el-form-item__label {
  color: #909399;
}
</style>