<template>
  <div class="member-info">
    <el-form label-position="left" inline class="demo-table-expand" label-width="100px">
      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form-item label="学院:">
            <span>{{ memberInfo.institute?memberInfo.institute.institute_name:'-' }}</span>
          </el-form-item>
          <el-form-item label="专业:">
            <span>{{ memberInfo.specialty?memberInfo.specialty.specialty_name:'-' }}</span>
          </el-form-item>
          <el-form-item label="班级:">
            <span>{{ memberInfo.iclass?memberInfo.iclass.class_name:'-' }}</span>
          </el-form-item>
          <el-form-item label="职位:">
            <span>{{ memberInfo.position?memberInfo.position.positionName:'-' }}</span>
          </el-form-item>
          <el-form-item label="学号:">
            <span>{{ memberInfo.stu_num }}</span>
          </el-form-item>
          <el-form-item label="姓名:">
            <span>{{ memberInfo.memberName }}</span>
          </el-form-item>
          <el-form-item label="性别:">
            <span>{{ memberInfo.gender }}</span>
          </el-form-item>
          <el-form-item label="手机号:">
            <span>{{ memberInfo.phoneNum }}</span>
          </el-form-item>
          <el-form-item label="邮箱:">
            <span>{{ memberInfo.email }}</span>
          </el-form-item>
          <el-form-item label="QQ:">
            <span>{{ memberInfo.qq }}</span>
          </el-form-item>
          <el-form-item label="国籍:">
            <span>{{ memberInfo.nation }}</span>
          </el-form-item>
          <el-form-item label="家乡:">
            <span>{{ memberInfo.nativePlace}}</span>
          </el-form-item>
          <el-form-item label="所在地:">
            <span>{{ memberInfo.address}}</span>
          </el-form-item>
          <el-form-item label="政治面貌：">
            <span>{{ memberInfo.politicalOutlook}}</span>
          </el-form-item>
          <el-form-item label="学历：">
            <span>{{ memberInfo.education}}</span>
          </el-form-item>
          <el-form-item label="身份证号：">
            <span>{{ memberInfo.cardID}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="个人说明：">
            <span>{{ memberInfo.description}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    memberInfo: {
      type: Object,
      require: true,
    },
  },
}
</script>
<style>
.member-info .el-form-item {
  min-width: 280px;
}
.member-info .el-form-item__label {
  color: #99a9bf;
}
</style>