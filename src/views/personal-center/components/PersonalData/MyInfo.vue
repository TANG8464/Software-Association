<template>
  <div class="my-info">
    <div v-if="personalInfo">
      <h4 class="info-title">基本信息</h4>
      <p>
        <span>ID：</span>
        <span>{{personalInfo.id}}</span>
      </p>
      <p>
        <span>名称：</span>
        <span>{{personalInfo.memberName}}</span>
      </p>
      <p>
        <span>性别：</span>
        <span>{{personalInfo.gender}}</span>
      </p>
      <p>
        <span>QQ：</span>
        <span>{{personalInfo.qq}}</span>
      </p>
      <p>
        <span>邮箱：</span>
        <span>{{personalInfo.email}}</span>
      </p>
      <p>
        <span>手机号：</span>
        <span>{{personalInfo.phoneNum}}</span>
      </p>
      <p>
        <span>身份证：</span>
        <span>{{personalInfo.cardID}}</span>
      </p>
      <p>
        <span>职位：</span>
        <span>{{personalInfo.position?`${personalInfo.position.positionName}(${personalInfo.position.remark})`:'无'}}</span>
      </p>
      <p>
        <span>政治面貌：</span>
        <span>{{personalInfo.politicalOutlook}}</span>
      </p>
      <p>
        <span>个人说明：</span>
        <span>{{personalInfo.description}}</span>
      </p>
      <h4 class="info-title">教育经历</h4>
      <p>
        <span>所在学院：</span>
        <span>{{personalInfo.institute.institute_name}}</span>
      </p>
      <p>
        <span>所学专业：</span>
        <span>{{personalInfo.specialty.specialty_name}}</span>
      </p>
      <p>
        <span>所在班级：</span>
        <span>{{personalInfo.iclass.class_name}}</span>
      </p>
      <p>
        <span>学历：</span>
        <span>{{personalInfo.education}}</span>
      </p>
      <p>
        <span>学号：</span>
        <span>{{personalInfo.stu_num}}</span>
      </p>
      <h4 class="info-title">联系地址</h4>
      <p>
        <span>国籍：</span>
        <span>{{personalInfo.nation}}</span>
      </p>
      <p>
        <span>家乡：</span>
        <span>{{personalInfo.nativePlace}}</span>
      </p>
      <p>
        <span>所在地：</span>
        <span>{{personalInfo.address}}</span>
      </p>
    </div>
    <div v-else style="text-align:center;">暂无数据</div>
  </div>
</template>
<script>
import { detailedInformation } from '@/api/active-user'
export default {
  data() {
    return {
      personalInfo: null,
    }
  },
  computed: {
    changeMyInfo() {
      return this.$store.state.myInfo
    },
  },
  watch: {
    changeMyInfo() {
      this.setPersonalInfo()
    },
  },
  created() {
    this.setPersonalInfo()
  },
  methods: {
    setPersonalInfo() {
      detailedInformation().then((res) => {
        this.personalInfo = res.data.data
      })
    },
  },
}
</script>
<style>
.my-info {
  margin: 10px 0;
}
.info-title {
  background-color: #f8f8f8;
  border-radius: 5px;
  text-align: center;
}
.my-info p span:first-child {
  color: #909399;
}
</style>