<template>
  <div class="add-member">
    <div class="add-mode" style="text-align: right; margin: 10px 15px">
      <el-link type="primary" @click="isBulk = !isBulk">{{
        isBulk ? '单个添加' : '批量导入'
      }}</el-link>
    </div>
    <div v-if="isBulk">
      <bulk-import-member></bulk-import-member>
    </div>
    <div v-else>
      <member-info-form
        :personalInfo.sync="memberData"
        @submitForm="addMember"
        :col="3"
        :colW="350"
        :show="[
          'memberName',
          'gender',
          'startYear',
          'cascadeClass',
          'stu_num',
          'phoneNum',
          'nation',
          'nativePlace',
          'address',
          'education',
          'politicalOutlook',
          'cardID',
          'email',
          'description',
        ]"
      ></member-info-form>
    </div>
  </div>
</template>

<script>
import MemberInfoForm from '@/components/MemberInfoForm'
import BulkImportMember from './components/BulkImport/ImportMember'
import { addMember } from '@/api/member'
export default {
  components: {
    MemberInfoForm,
    BulkImportMember,
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
      const res =await addMember(this.memberData)
      if (res.code === 200) {
        this.$message.success('添加成功')
        Object.assign(this.$data, this.$options.data())
      } else this.$message.error(res.message)
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
