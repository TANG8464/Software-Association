<template>
  <el-collapse accordion>
    <el-collapse-item>
      <template slot="title">
        <i>
          <icon name="personal-info" scale="23" width="23"></icon>
        </i>
        我的信息
      </template>
      <my-info></my-info>
    </el-collapse-item>
    <el-collapse-item>
      <template slot="title">
        <i>
          <icon name="dynamic-state" scale="20" width="20"></icon>
        </i>
        个人动态
      </template>
      <dynamic-state></dynamic-state>
    </el-collapse-item>
    <el-collapse-item>
      <template slot="title">
        <i>
          <icon name="experience" scale="23" width="23"></icon>
        </i>
        我的历程
      </template>
      <my-experience></my-experience>
    </el-collapse-item>
    <el-collapse-item>
      <template slot="title">
        <i>
          <icon name="safe" scale="20" width="20"></icon>
        </i>
        账号安全
      </template>
      <account-security></account-security>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import { detailedInformation } from '@/api/active-user'
import MyInfo from './MyInfo'
import DynamicState from './DynamicState'
import MyExperience from './MyExperience'
import AccountSecurity from './AccountSecurity'
export default {
  name: 'personalData',
  components: {
    MyInfo,
    DynamicState,
    MyExperience,
    AccountSecurity,
  },
  data() {
    return {
      personalInfo: null,
    }
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