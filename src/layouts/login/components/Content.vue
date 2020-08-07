<template>
  <div class="login-content">
    <div style="margin:10px auto;text-align:center;">
      <img :src="logo" alt height="100px" />
    </div>
    <el-form :model="form">
      <el-form-item>
        <el-input
          type="text"
          style="width:100%"
          v-model="form.username"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          style="width:100%"
          v-model="form.password"
          autocomplete="off"
          show-password
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          class="vf-img"
          ref="vfImg"
          v-model="form.verifyCode"
          autocomplete="off"
          placeholder="验证码"
          :style="{'width':(size.isSmallSize? 45+size.maxW*0.01:58) +'%!important'}"
          @keyup.enter.native="login"
        ></el-input>
        <div id="verifyImg" @mouseover="cut=true" @mouseout="cut=false" style="display: inline;">
          <div
            :style="{backgroundImage:'url('+form.verifyImg+')',height: '48px',width:'130px'}"
            style="float:right;border-radius: 5px;text-align:center;"
          >
            <span style="position:absolute;">{{!form.verifyImg?'加载中...':''}}</span>
            <div class="bg-cut" v-show="cut" @click="getVertifyCode()">
              <span>换一张</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-checkbox-group v-model="form.rememberMe" style="text-align:left;margin:25px 0;">
        <el-checkbox label="记住我" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form>
    <div class="demo-drawer__footer">
      <el-button
        type="primary"
        style="width:100%"
        @click="login()"
      >{{ loading ? '登录中 ...' : '登 录' }}</el-button>
    </div>
  </div>
</template>
<script>
import token from '@/utils/token'
export default {
  props: {
    logo: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        username: '',
        password: '',
        verifyCode: '',
        verifyImg: '',
        rememberMe: false,
      },
      cut: false,
      loading: false,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.pageShow()
    this.getVertifyCode()
  },
  methods: {
    pageShow() {
      const user = localStorage.getItem('user')
      if (user) this.form = JSON.parse(user)

      const headerToken = token.getHeaderToken()
      if (headerToken) {
        this.$router.push('/backstage')
      }
    },
    //获取验证码
    async getVertifyCode() {
      const { data } = await this.$axios.get('verifyImage/', {
        responseType: 'arraybuffer',
      })
      this.form.verifyImg =
        'data:image/png;base64,' +
        btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      this.cut = true
      this.cut = false
    },
    async login() {
      this.loading = true
      const rememberMe = this.form.rememberMe
      const form = this.form
      form.rememberMe = Number(rememberMe)
      delete form.verifyImg

      let title = null,
        msg = null,
        type = null
      if (form.username && form.password) {
        let { data } = await this.$axios.post('login', form)
        if (data.code === 200) {
          localStorage.setItem('HEADER-TOKEN', data.headerToken)
          this.form.rememberMe = rememberMe
          if (this.form.rememberMe) {
            delete this.form.verifyCode
            delete this.form.verifyImg
            localStorage.setItem('user', JSON.stringify(this.form))
          } else {
            localStorage.removeItem('user')
          }
          let url = this.$route.query.redirect
          console.log(url);
          
          if (!url) {
            url = '/backstage'
          }
          this.$router.push(url)
          title = '成功'
          msg = '登录成功'
          type = 'success'
        } else {
          this.getVertifyCode() //更新验证码
          this.loading = false
          title = '失败'
          msg = data.error
          type = 'error'
        }
      } else {
        title = '失败'
        msg = '用户名密码不能为空'
        type = 'error'
      }
      this.$notify({
        title: title,
        message: msg,
        type: type,
        duration: 2000,
        showClose: false,
      })
    },
  },
}
</script>
<style>
.login-content .bg-cut {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  line-height: 48px;
  text-align: center;
  color: white;
  border-radius: 5px;
}

.login-content .el-input {
  height: 40px;
}
.login-content .vf-img {
  height: 48px !important;
  line-height: 48px !important;
}
.login-content .el-input__inner {
  height: 100% !important;
}
</style>