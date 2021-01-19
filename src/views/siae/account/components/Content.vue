<template>
  <div class="login-content">
    <div :class="{ 'sm-landsape': lessThenMedium && size.isLandscape }">
      <el-row :gutter="24" style="margin: 0">
        <el-col
          :lg="24"
          :sm="lessThenMedium && size.isLandscape ? 12 : 24"
          :xs="size.isLandscape ? 12 : 24"
        >
          <div class="logo">
            <img :src="logo" alt height="100px" />
          </div>
          <div v-if="lessThenMedium && size.isLandscape">
            <!-- 第三方登录，在login里面 -->
            <slot name="actions"></slot>
          </div>
        </el-col>
        <el-col
          :lg="24"
          :sm="lessThenMedium && size.isLandscape ? 12 : 24"
          :xs="size.isLandscape ? 12 : 24"
        >
          <el-form :model="form">
            <el-form-item>
              <siae-input type="text" v-model="form.username" label="邮箱"></siae-input>
            </el-form-item>
            <el-form-item>
              <siae-input
                type="password"
                v-model="form.password"
                label="密码"
                :lock="true"
              ></siae-input>
            </el-form-item>
            <el-form-item>
              <siae-input
                type="text"
                v-model="form.verifyCode"
                label="验证码"
                :width="verifyW"
                :height="48"
                @keyup.enter.native="login"
              ></siae-input>
              <div
                class="verify-img-box"
                @mouseover="cut = true"
                @mouseout="cut = false"
                style="display: inline"
              >
                <div
                  class="verify-img"
                  :style="{ backgroundImage: 'url(' + this.form.verifyImg + ')' }"
                >
                  <span class="verify-img_isLanding">{{ !form.verifyImg ? '加载中...' : '' }}</span>
                  <div class="bg-cut" v-show="cut" @click="getVerifyCode()">
                    <span>换一张</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-checkbox-group v-model="form.rememberMe" style="text-align: left; margin: 25px 0">
              <el-checkbox label="记住我" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form>
          <div class="demo-drawer__footer">
            <el-button type="primary" style="width: 100%" @click="login()">
              {{ isLanding ? '登录中 ...' : '登 录' }}
            </el-button>
          </div>
          <p class="error-tip">{{ errorTip }}</p>
          <div v-if="!(lessThenMedium && size.isLandscape)">
             <!-- 第三方登录，在login里面 -->
            <slot name="actions"></slot>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import token from '@/utils/token'
import { JSEncrypt } from 'jsencrypt'
import { getPublicKey, getVerifyCode, login } from '@/api/login'
import { encryptionObj, decryptionObj } from '@/utils/encryption'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        verifyCode: '',
        verifyImg: '',
        rememberMe: false,
      },
      publicKey: null,
      cut: false,
      isLanding: false, //是否登录中
      logo: require('@/assets/img/logo.png'),
      errorTip: null, //错误提示
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    lessThenMedium() {
      return this.size.isSmallSize || this.size.isMediumSize
    },
    verifyW() {
      return this.size.isSmallSize ? 45 + this.size.maxW * 0.01 : 56
    },
  },
  created() {
    this.init()
    this.getVerifyCode() //获取验证码
    this.getPublicKey()
  },
  methods: {
    //页面初始化
    async init() {
      const user = localStorage.getItem('user')
      if (user) this.form = await this.decryptionObj(JSON.parse(user))
      const headerToken = token.getHeaderToken()
      if (headerToken) this.$router.push('/')
    },
    //获取验证码
    async getVerifyCode() {
      this.form.verifyImg = await getVerifyCode()
      console.log(this.form.verifyImg);
      
      //引起页面渲染
      this.cut = true
      this.cut = false
    },
    //获取RSA公钥
    async getPublicKey() {
      const data = await getPublicKey()
      if (data.code === 200) {
        this.publicKey = data.data
      } else this.$message.error(data.message)
    },
    async login() {
      let type
      this.isLanding = true
      const form = Object.assign({}, this.form) //重新建立对象为了不影响原来的值
      form.rememberMe = Number(form.rememberMe) //适应后端
      delete form.verifyImg
      if (form.username && form.password) {
        form.password = await this.RSAEncrypt(form.password) //密码使用RSA加密
        const data = await login(form)
        if (data.code === 200) {
          //登录成功
          token.setHeaderToken(data.headerToken)
          form.rememberMe = Boolean(form.rememberMe) //转换后存储到localStorage
          if (form.rememberMe) {
            delete form.verifyCode
            form.password = this.form.password
            localStorage.setItem('user', JSON.stringify(await this.encryptionObj(form)))
          } else localStorage.removeItem('user')
          let url = this.$route.query.redirect
          url = url ? url : '/'
          this.$router.push(url)
          this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
          type = 0
          const { data: info } = await getActiveUserInfo()
          this.$store.commit('setActiveUserInfo', info.data)
        } else {
          //登录失败
          this.isLanding = false
          this.errorTip = data.error
        }
        this.getVerifyCode() //更新验证码
      } else type = 1
      const typeMap = [
        {
          title: '成功',
          message: '登录成功',
        },
        {
          title: '失败',
          message: '用户名密码不能为空',
        },
      ]
      this.$notify(
        Object.assign(typeMap[type], {
          showClose: true,
          type,
        })
      )
    },
    //RSA加密
    RSAEncrypt(str) {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.publicKey)
      return encrypt.encrypt(str)
    },
    
  },
}
</script>

<style lang="scss">
.login-content {
  .logo {
    margin: 10px auto;
    text-align: center;
  }

  .sm-landsape {
    position: absolute;
    top: 0;
    left: 20px;
    bottom: 0;
    right: 20px;
    height: 300px;
    margin: auto auto;
  }

  .bg-cut {
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    line-height: 48px;
    text-align: center;
    color: white;
    border-radius: 5px;
  }

  .el-input {
    height: 40px;
  }

  .el-input__inner {
    height: 100% !important;
  }

  .forget {
    text-align: right;
    font-size: 14px;

    span:hover {
      border-bottom: 1px solid #333333;
    }

    .small-forget {
      position: fixed;
      bottom: 0;
      box-sizing: border-box;
      width: 88%;
    }
  }

  .verify-img {
    float: right;
    border-radius: 5px;
    text-align: center;
    position: relative;
    height: 48px;
    width: 130px;

    .verify-img_isLanding {
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
</style>
