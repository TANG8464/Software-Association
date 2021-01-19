<template>
  <div class="register">
    <div class="main">
      <h2 style="margin: 5px 0">账号注册</h2>
      <p class="tip">请填写正确的邮箱，将会用于接收通知</p>

      <div class="content">
        <div class="active" v-if="isRegisterSuccess">
          <div class="finish">
            <h2 class="success"><icon name="success" scale="40" width="40"></icon>注册成功</h2>
            <p class="wait">等待跳转至登录页({{ time }})</p>
            <el-link type="primary" @click="$router.push('/account/login')">立即跳转</el-link>
          </div>
        </div>
        <div class="active" v-else>
          <el-form ref="registerFrom" :model="registerFrom" label-position="top">
            <el-form-item prop="memberName">
              <siae-input
                v-model="registerFrom.memberName"
                :status="registerFrom.memberNameStatus"
                label="姓名"
              ></siae-input>
            </el-form-item>
            <el-form-item prop="password">
              <siae-input
                type="password"
                :lock="true"
                v-model="registerFrom.password"
                :status="registerFrom.passwordStatus"
                label="密码"
              ></siae-input>
            </el-form-item>
            <el-form-item prop="email">
              <siae-input
                v-model="registerFrom.email"
                :status="registerFrom.emailStatus"
                label="账户邮箱"
                :disabled="isClickSendVerify"
              ></siae-input>
            </el-form-item>
            <el-form-item prop="verify">
              <span style="width: 70%; max-width: 350px; display: inline-block">
                <siae-input
                  v-model="registerFrom.verify"
                  :status="registerFrom.emailStatus"
                  label="验证码"
                ></siae-input>
              </span>
              <span>
                <send-verify-btn
                  @send-verify="sendVerify()"
                  :disabled.sync="isClickSendVerify"
                ></send-verify-btn>
              </span>
            </el-form-item>
          </el-form>
          <el-button class="btn-full" type="primary" @click="submitForm()">注册</el-button>
          <div class="pop-up-box" v-if="isOpenVerifyCode">
            <div class="verify-code">
              <verify-code ref="verify" :isSuccess.sync="isSuccess"></verify-code>
            </div>
          </div>
          <div class="error-tip" v-if="error">{{ error }}</div>
        </div>
      </div>
      <p class="tip" style="text-align: center">
        <small v-if="day != -1">注册通道将在{{ day }}天后关闭</small>
        <small v-else>
          注册通道已关闭，如有特殊原因需注册请
          <el-link type="primary" class="link" @click="$router.push('/homepage-last/contact-us')">
            联系我们
          </el-link>
        </small>
      </p>
      <div class="link" :class="{ 'small-link': size.isSmallSize }">
        <p>
          <el-link type="primary" @click="$router.push('/account/login')">去登陆</el-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode'
import SendVerifyBtn from '@/components/SendVerifyBtn'
import { userNameVerify, pwdVerify, emailVerify } from '@/utils/verify'
import { forgetPassword, updatePassword } from '@/api/active-user'
import { verifyEmail } from '@/api/email'
import { register } from '@/api/login'
import { remainTime } from '@/api/join-apply'
export default {
  components: {
    VerifyCode,
    SendVerifyBtn,
  },
  data() {
    return {
      registerFrom: {
        memberName: null,
        email: null,
        password: null,
      },
      cascadeClass: null,
      isOpenVerifyCode: false,
      isOpenInfoConfirm: false,
      isSuccess: false,
      error: '',
      isRegisterSuccess: false,
      isClickSendVerify: false,
      time: 5,
      day: 0, //剩余多少天注册通道关闭
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    isSuccess(newVal) {
      if (newVal) {
        setTimeout(async () => {
          this.isOpenVerifyCode = false
          this.isSuccess = false
          this.register()
        }, 1000)
      }
    },
    isRegisterSuccess(newVal) {
      if (newVal) this.skip()
    },
  },
  created() {
    this.setRemainTime()
  },
  methods: {
    //发送邮件验证码
    async sendVerify() {
      const email = this.registerFrom.email
      if (!email) {
        this.error = '邮箱不能为空'
      } else if (!emailVerify(email)) {
        this.error = '邮箱格式不正确'
      } else {
        const data = await verifyEmail(this.registerFrom.email)
        if (data.code === 200) {
          this.isClickSendVerify = true
          this.$message.success('发送成功，如果收不到邮件，可能发送的邮件在垃圾箱里哦')
        } else this.$message.error(data.message)
      }
    },
    //监测数据正确性
    submitForm() {
      const name = this.registerFrom.memberName
      const pwd = this.registerFrom.password
      const email = this.registerFrom.email
      this.error = ''
      if (!emailVerify(email)) {
        this.error = '邮箱格式不正确'
      } else if (!userNameVerify(name)) {
        this.error = '用户名长度需在4 ~ 10之间'
      } else if (!pwd || pwd.length < 6 || pwd.length > 24) {
        this.error = '密码长度需在6 ~ 24之间'
      } else if (!pwdVerify(pwd)) {
        this.error = '密码必须包含大小写字母和数字'
      } else this.isOpenVerifyCode = true
    },
    //注册
    async register() {
      this.isOpenVerifyCode = false
      const data = await register(this.registerFrom)
      if (data.code === 200) {
        this.isRegisterSuccess = true
      } else this.error = data.message
    },
    //跳转到登录
    skip() {
      const timing = setInterval(() => {
        this.time--
        if (this.time === 0) {
          clearInterval(timing)
          this.$router.push('/account/login')
        }
      }, 1000)
    },
    async setRemainTime() {
      const { data } = await remainTime()
      this.day = data
    },
  },
}
</script>

<style lang="scss">
.register {
  min-height: 500px;

  .main {
    margin: auto;
    max-width: 800px;
    width: 100%;

    .tip {
      margin: 5px 0;
      color: #aaaaaa;
    }

    .content {
      margin: auto;
      max-width: 500px;
      width: 100%;

      .active {
        margin-top: 60px;
        min-height: 300px;

        .btn-full {
          margin: 20px 0;
          width: 100%;
        }

        .pop-up-box {
          .not-show {
            transition: all 1s;
            opacity: 0;
          }

          .show {
            opacity: 1;
          }
        }

        .error-tip {
          color: #ed5a5a;
          font-size: 13px;
        }

        .finish {
          text-align: center;

          .wait {
            font-size: 13px;
            color: #999999;
          }
        }

        .el-cascader {
          width: 100%;
        }
      }
    }
  }

  .link {
    text-align: right;
  }
}
</style>
