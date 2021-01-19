<template>
  <div class="login">
    <login-content>
      <div slot="actions">
        <!-- 第三方登录 -->
        <div class="other" style="text-align: center">
          <p class="title">其他登录方式</p>
          <p class="actions">
            <span @click="oauthLogin('github')">
              <icon name="github" scale="30" width="30"></icon>
            </span>
            <span @click="oauthLogin('gitee')">
              <icon name="gitee" scale="30" width="30"></icon>
            </span>
          </p>
        </div>
        <div class="forget" :class="{ 'small-forget': size.isSmallSize }">
          <p>
            <el-link type="primary" @click="$router.push('/account/register')">去注册</el-link>
            <span style="margin: 0 5px" @click="toForgetPwd()">忘记密码</span>
          </p>
        </div>
      </div>
    </login-content>
  </div>
</template>

<script>
import { oauthLogin } from '@/api/oauth'
import LoginContent from './components/Content'

export default {
  components: {
    LoginContent,
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  methods: {
    async oauthLogin(source) {
      const res = await oauthLogin(source)
      if (res.code === 200) {
        const { data } = res
        localStorage.setItem('key', data.key)
        window.location.href = data.url
      } else this.$message.error(data.message)
    },
    toForgetPwd() {
      this.$router.push('/account/forget-pwd')
    },
  },
}
</script>
