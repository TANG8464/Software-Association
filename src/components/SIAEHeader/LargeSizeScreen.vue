<template>
  <div class="header">
    <ul class="siae-menu" style="list-style:none;" ref="menu" @click="choose">
      <li class="siae-menu-item" data-not-choose="true">
        <div class="logo-box">
          <img src="@/assets/img/newLogo.png" alt class="logo" />
        </div>
      </li>
      <router-link
        class="siae-menu-item"
        tag="li"
        to="/siae/homePage"
        data-index="/siae/homePage"
      >首页</router-link>
      <router-link class="siae-menu-item" tag="li" to="/siae/joinIn" data-index="/siae/joinIn">申请入会</router-link>
      <router-link class="siae-menu-item" tag="li" to="/siae/notice" data-index="/siae/notice">协会公告</router-link>
      <router-link
        class="siae-menu-item"
        tag="li"
        to="/siae/dataDownload"
        data-index="/siae/dataDownload"
      >资料下载</router-link>
      <router-link class="siae-menu-item" tag="li" to="/siae/notice" data-index="/siae/notice">在线咨询</router-link>
      <li class="siae-menu-item" style="float:right;" data-not-choose="true">
        <header-account ref="account"></header-account>
      </li>
    </ul>
  </div>
</template>

<script>
import HeaderAccount from './RightAccount'
export default {
  name: 'Header',
  components: {
    HeaderAccount,
  },
  data() {
    return {
      loginShow: true,
      accountName: '',
      index: '',
    }
  },
  created() {
    this.index = this.$router.currentRoute.path
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
  mounted() {
    this.activeMenu()
  },
  methods: {
    open() {
      this.$refs.login.dialog = true
    },
    activeMenu() {
      const allMenu = this.$refs.menu.children
      const currentRoute = this.$route.fullPath
      allMenu.forEach((item) => {
        if (item.dataset.index === currentRoute) {
          item.classList.add('siae-menu-active')
        }
      })
    },
    choose(e) {
      const allMenu = this.$refs.menu.children
      e.path.forEach((item) => {
        const className = item.className
        const isNotChoose = item.dataset && item.dataset.notChoose
        if (className && className.indexOf('siae-menu-item') >= 0 && !isNotChoose) {
          allMenu.forEach((item) => {
            if (item.className.indexOf('siae-menu-active') >= 0) {
              item.classList.remove('siae-menu-active')
            }
          })
          setTimeout(() => {
            item.classList.add('siae-menu-active')
          }, 200)
        }
      })
    },
  },
}
</script>

<style scoped>
.header {
  min-width: 700px;
  text-align: center;
}
.logo-box {
}
.logo {
  height: 60px;
}

.menu-right {
  float: right;
}
.el-menu,
.el-menu-item {
  border: none;
}
.el-menu-item:hover {
  background-color: white !important;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.siae-menu {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
}
.siae-menu-item {
  display: inline-block;
  min-width: 90px;
  color: white;
  cursor: pointer;
  padding: 10px 0;
}
.siae-menu-item:last-child {
  position: absolute;
  right: 10px;
}
.siae-menu-active {
  border-bottom: 2px solid white;
}
</style>
