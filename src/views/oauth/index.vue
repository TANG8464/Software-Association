<template>
  <div class="oauth">
    <div class="content" :style="{ margin }">
      <div class="logo-box">
        <img src="@/assets/img/logo.png" class="logo" />
      </div>
      <div v-if="loadingSkip">
        <h3 style="text-align: center">等待跳转...</h3>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getSuccessInfo } from '@/api/oauth'
import token from '@/utils/token'
export default {
  data() {
    return {
      loadingSkip: false,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    margin() {
      return this.size.isSmallSize ? '10px' : '100px'
    },
  },
  created() {
    const key = localStorage.getItem('key')
    if (key) {
      this.loadingSkip = true
      this.oauthLogin(key)
    }
  },
  methods: {
    async oauthLogin(key) {
      const data = await getSuccessInfo(key)
      if (data.code === 200) {
        if (data.headerToken) {
          localStorage.setItem('HEADER-TOKEN', data.headerToken)
          let url = this.$route.query.redirect
          if (!url) {
            url = '/'
          }
          this.$router.push(url)
        } else this.$router.push('/personal-center/home')
        this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
        this.$notify.success({
          title: '成功',
          message: data.headerToken ? '登录成功' : '绑定成功',
        })
        localStorage.removeItem('key')
      } else {
        this.$message.error(data.message)
        this.$router.push('account/login')
      }
    },
  },
}
</script>

<style lang="scss">
.oauth {
  .content {
    text-align: center;
  }

  .logo {
    height: 100px;
  }

  .logo-box {
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 10%;
  }
}
</style>
