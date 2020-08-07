<template>
  <div class="add-member">
    <div class="add-mode" style="text-align:right;margin:10px 15px">
      <el-link type="primary" @click="isBulk=!isBulk">{{isBulk?'单个添加':'批量导入'}}</el-link>
    </div>
    <div v-if="isBulk">
      <bulk-import></bulk-import>
    </div>
    <div v-else>
      <member-info-form :personalInfo.sync="memberData" @submitForm="addMember" :col="3"></member-info-form>
    </div>
  </div>
</template>
<script>
import MemberInfoForm from '@/components/MemberInfoForm'
import BulkImport from './components/BulkImport'
export default {
  components: {
    MemberInfoForm,
    BulkImport,
  },
  data() {
    return {
      memberData: {
        address: null,
        avatarUrl: null,
        cardID: null,
        classID: null,
        description: null,
        education: null,
        email: null,
        flag: 0,
        gender: '男',
        memberName: null,
        nation: '中国',
        nativePlace: null,
        phoneNum: null,
        politicalOutlook: null,
        positionID: null,
        qq: null,
        stu_num: null,
        startYear: 2020,
      },
      isBulk: false,
    }
  },
  methods: {
    async addMember() {
      console.log(this.memberData)
      const { data } = await this.$axios.post('member/', this.memberData)
      if (data.code === 200) {
        this.$message.success('添加成功')
        Object.assign(this.$data, this.$options.data())
      } else {
        this.$message.error(data.message)
      }
    },
  },
}
</script>
<style>
.add-member .el-form,
.add-member .add-mode {
  max-width: 1100px;
  margin: auto;
}
.add-member .el-form .el-form-item,
.add-member .el-form .el-select {
  max-width: 350px;
  width: 100%;
  display: inline-block;
  margin: 0 5px;
}
.cardId .el-input,
.description .el-input {
  max-width: 600px;
  width: 100%;
  display: inline-block;
  margin: 0 5px;
}
</style>