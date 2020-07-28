<template>
  <div class="phone-header">
    <span class="logo-box">
      <img src="../../assets/img/newLogo.png" alt class="logo" />
    </span>
    <span style="float:right;">
      <header-account ref="account"></header-account>
    </span>
    <span style="float:right;margin:10px 0;">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" style="color:white;">
          <icon name="menu-nav" scale="25" width="25"></icon>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/siae/homePage">首页</el-dropdown-item>
          <el-dropdown-item command="/siae/joinIn">申请入会</el-dropdown-item>
          <el-dropdown-item command="/siae/notice">协会公告</el-dropdown-item>
          <!-- <el-dropdown-item command="/siae/dataDownload">资料下载</el-dropdown-item> -->
          <el-dropdown-item command="/siae/notice">在线咨询</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </div>
</template>

<script>
import login from '@/components/siae/header/login.vue'
import HeaderAccount from '@/components/siae/header/HeaderAccount.vue'

export default {
  name: 'phoneHeader',
  components: {
    login,
    HeaderAccount,
  },
  data() {
    return {
      accountName: '',
      index: '',
    }
  },
  watch: {
    '$route.fullPath': function (newVal, oldVal) {
      this.index = newVal
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.index = this.$router.currentRoute.path
  },
  methods: {
    handleCommand(index) {
      this.$router.push(index)
    },
  },
}
</script>

<style scoped>
.phone-header {
  width: 100%;
  position: relative;
  margin: auto;
}
.phone-header span {
  padding: 10px;
}
.phone-header .logo-box {
  padding: 0;
}
.phone-header .logo {
  height: 60px;
}
</style>
