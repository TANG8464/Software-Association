<template>
  <ul class="siae-phone-header">
    <li class="logo-box">
      <img src="@/assets/img/newLogo.png" alt class="logo" />
    </li>
    <li>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link" style="color:white;">
          <icon name="menu-nav" scale="25" width="25"></icon>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="/siae/homePage">首页</el-dropdown-item>
          <el-dropdown-item command="/siae/joinIn">申请入会</el-dropdown-item>
          <el-dropdown-item command="/siae/notice">协会公告</el-dropdown-item>
          <el-dropdown-item command="/siae/dataDownload">资料下载</el-dropdown-item>
          <el-dropdown-item command="/siae/books-borrow">在线咨询</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <li>
      <header-account ref="account"></header-account>
    </li>
  </ul>
</template>

<script>
import HeaderAccount from './RightAccount'
export default {
  name: 'phoneHeader',
  components: {
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
.siae-phone-header {
  width: 100%;
  text-align: right;
  margin:5px 0;
}
.siae-phone-header li {
  display: inline;
  vertical-align: middle;
  margin: 8px;
}
.siae-phone-header .logo-box {
  position: fixed;
  display: block;
  margin: 0;
}
.siae-phone-header .logo {
  height: 50px;
}
</style>
