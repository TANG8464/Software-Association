<template>
  <div class="login">
    <el-container :style="{backgroundImage:'url('+backs[backIndex]+')'}" ref="loginCon">
      <div class="loginBack" :style="{'max-width':maxW+'px','max-height':maxH+'px'}">
        <login-content :logo="logo" data-active="登录框"></login-content>
      </div>
      <login-change-back
        ref="changeBack"
        :backs="backs"
        @changeBack="changeBack"
        data-active="设置登录页背景"
      ></login-change-back>
    </el-container>
  </div>
</template>
<script>
import loginContent from "@/views/login/content.vue";
import loginChangeBack from "@/views/login/changeBack.vue";

export default {
  data() {
    return {
      backIndex: 0,
      backs: [
        require("@/assets/img/loginBacks/1.jpg"),
        require("@/assets/img/loginBacks/2.jpg"),
        require("@/assets/img/loginBacks/3.jpg"),
        require("@/assets/img/loginBacks/4.jpg"),
        require("@/assets/img/loginBacks/5.jpg"),
        require("@/assets/img/loginBacks/6.jpg"),
        require("@/assets/img/loginBacks/7.jpg"),
        require("@/assets/img/loginBacks/8.jpg")
      ],
      logo: require("@/assets/img/logo.png"),
      maxH: 0,
      maxW: 0
    };
  },
  created() {
    if (!localStorage.getItem("backIndex"))
      //如果没有则加上背景
      localStorage.setItem("backIndex", 0);
    this.backIndex = localStorage.getItem("backIndex");
  },
  mounted() {
    this.init();
    let that = this;
    window.onresize = function() {
      that.init();
    };
  },
  watch: {
    backIndex(newVal) {
      this.$refs.changeBack.backIndex = newVal;
    }
  },
  methods: {
    init() {
      this.maxW = window.outerWidth; //获取网页外部窗体宽
      this.maxH = window.outerHeight; //获取网页外部窗体高
      document.getElementsByClassName("el-form-item").forEach(item => {
        item.style.marginBottom = this.maxH * 0.02 + "px";
      });
      document.getElementsByClassName("el-checkbox-group").forEach(item => {
        item.style.margin = this.maxH * 0.02 + "px";
      });
    },
    changeBack(Val) {
      this.backIndex = Val;
    }
  },
  components: {
    loginContent,
    loginChangeBack
  }
};
</script>
<style scoped>
.el-container {
  position: fixed;
  top: 0;
  bottom: 0;
  margin: 0;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
}

.el-main {
  background: none;
}

.loginBack {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 318px;
  height: 450px;
  margin: auto auto;
  background-color: rgba(255, 255, 255, 0.93);
  padding: 30px;
  border-radius: 10px;
}
</style>