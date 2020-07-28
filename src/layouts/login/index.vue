<template>
  <div class="login">
    <el-container :style="{backgroundImage:'url('+backs[backIndex]+')'}" ref="loginBack">
      <div
        class="login-content-box"
        :style="{'width':size.isSmallSize?size.maxW:'320px','height':size.isSmallSize?size.maxW:'450px','border-radius':size.isSmallSize?0:'10px'}"
      >
        <login-content :logo="logo" data-active="登录框"></login-content>
      </div>
      <login-change-back
        v-show="!size.isSmallSize"
        ref="changeBack"
        :backs="backs"
        :backIndex.sync="backIndex"
        data-active="设置登录页背景"
      ></login-change-back>
    </el-container>
  </div>
</template>
<script>
import LoginContent from '@/views/login/LoginContent.vue'
import LoginChangeBack from '@/views/login/LoginChangeBack.vue'
export default {
  components: {
    LoginContent,
    LoginChangeBack,
  },
  data() {
    return {
      backIndex: 0,
      backs: [
        require('@/assets/img/loginBacks/1.jpg'),
        require('@/assets/img/loginBacks/2.jpg'),
        require('@/assets/img/loginBacks/3.jpg'),
        require('@/assets/img/loginBacks/4.jpg'),
        require('@/assets/img/loginBacks/5.jpg'),
        require('@/assets/img/loginBacks/6.jpg'),
        require('@/assets/img/loginBacks/7.jpg'),
        require('@/assets/img/loginBacks/8.jpg'),
      ],
      logo: require('@/assets/img/logo.png'),
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    size() {
      this.init()
    },
  },
  created() {
    const backIndex = localStorage.getItem('backIndex')

    if (!backIndex)
      //如果没有则加上背景
      localStorage.setItem('backIndex', 0)
    this.backIndex = Number(backIndex)
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      document.getElementsByClassName('el-form-item').forEach((item) => {
        item.style.marginBottom = this.size.maxH * 0.02 + 'px'
      })
      document.getElementsByClassName('el-checkbox-group').forEach((item) => {
        item.style.margin = this.size.maxH * 0.02 + 'px'
      })
    },
  },
}
</script>
<style>
.login .el-container {
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

.login .el-main {
  background: none;
}

.login-content-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  background-color: rgba(255, 255, 255, 0.93);
  padding: 30px;
}
</style>