<template>
  <div class="header">
    <!--<el-menu
      :default-active="index"
      class="el-menu-demo"
      mode="horizontal"
      text-color="#e0e0e0"
      router
      background-color="rgba(200,255,255,0)"
      active-text-color="#fff"
    >
      <el-menu-item>
        <div class="logo-box">
           <img src="../../assets/img/newLogo.png" alt class="logo" />
        </div>
      </el-menu-item>
      <el-menu-item index="/siae/homePage">首页</el-menu-item>
      <el-menu-item index="/siae/joinIn">申请入会</el-menu-item>
      <el-menu-item index="/siae/notice">协会公告</el-menu-item>
      <el-menu-item index="/siae/dataDownload">资料下载</el-menu-item>
      <el-menu-item style="float:right;" v-if="loginShow">
        <el-button type="primary" @click="open()" plain round>登录</el-button>
        <login ref="login"></login>
      </el-menu-item>
      <el-menu-item style="float:right;" v-else>
        <account ref="account" :accountName="accountName" @isLogin="isLogin()"></account>
      </el-menu-item>
    </el-menu>-->

    <ul class="siae-menu" style="list-style:none;" ref="menu" @click="choose">
      <li class="siae-menu-item" data-not-choose="true">
        <div class="logo-box">
          <img src="../../assets/img/newLogo.png" alt class="logo" />
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
      <li class="siae-menu-item" style="float:right;" data-not-choose="true" v-if="loginShow">
        <el-button type="primary" @click="open()" plain round>登录</el-button>
        <login ref="login"></login>
      </li>
      <li class="siae-menu-item" style="float:right;" data-not-choose="true" v-else>
        <account ref="account" :accountName="accountName" @isLogin="isLogin()"></account>
      </li>
    </ul>
  </div>
</template>

<script>
import login from "@/components/siae/header/login.vue";
import account from "@/components/siae/header/account.vue";
export default {
  name: "Header",
  data() {
    return {
      loginShow: true,
      accountName: "",
      index: ""
    };
  },
  created() {
    this.isLogin();
    this.index = this.$router.currentRoute.path;
  },
  watch: {
    "$route.fullPath": function (newVal, oldVal) {
      this.index = newVal;
    }
  },
  mounted() {
    this.activeMenu();
  },
  methods: {
    isLogin() {
      let activeUser = this.$cookies.get("activeUser");
      if (activeUser) {
        this.loginShow = false;
        this.accountName = activeUser.split("&")[1];
      } else {
        this.loginShow = true;
        this.$cookies.remove("activeUser");
      }
    },
    open() {
      this.$refs.login.dialog = true;
    },
    activeMenu() {
      const allMenu = this.$refs.menu.children;
      const currentRoute = this.$route.fullPath;
      console.log(currentRoute);
      allMenu.forEach(item => {
        console.log(item.dataset);
        if (item.dataset.index === currentRoute) {
          item.classList.add("siae-menu-active");
        }
      })
    },
    choose(e) {
      const allMenu = this.$refs.menu.children;
      e.path.forEach(item => {
        const className = item.className;
        const isNotChoose = item.dataset && item.dataset.notChoose;
        if (className && className.indexOf("siae-menu-item") >= 0 && !isNotChoose) {
          allMenu.forEach(item => {
            if (item.className.indexOf("siae-menu-active") >= 0) {
              item.classList.remove("siae-menu-active");
            }
          });
          setTimeout(() => {
            item.classList.add("siae-menu-active")
          }, 200)
          console.log(item);
        }
      })

    }
  },
  components: {
    login,
    account
  }
};
</script>

<style scoped>
.header {
  min-width: 700px;
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
