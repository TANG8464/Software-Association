<template>
  <div class="forget-password">
    <div class="main">
      <h2 style="margin: 5px 0">找回密码</h2>
      <p class="tip" v-if="active === 0">为确认是否为本人，将会为所输入邮箱发送验证码</p>
      <p class="tip">{{ emailInfo }}</p>
      <div class="content">
        <div class="active" v-if="active === 0">
          <el-input v-model="forget.email" placeholder="输入需要找回的账户邮箱"></el-input>
          <el-button class="next" type="primary" @click="next()">下一步</el-button>
          <p class="error-tip">{{ error }}</p>
          <div class="verify-code-box" v-if="isOpenVerifyCode">
            <div class="verify-code">
              <verify-code ref="verify" :isSuccess.sync="isSuccess"></verify-code>
            </div>
          </div>
        </div>
        <div class="active" v-if="active === 1">
          <el-form :model="forget" status-icon :rules="rules" ref="forget">
            <el-form-item prop="email">
              <el-input v-model="forget.email" placeholder="需要找回的账户邮箱" disabled></el-input>
            </el-form-item>
            <el-form-item prop="newPassword">
              <el-input
                type="password"
                v-model="forget.newPassword"
                placeholder="重置密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                type="password"
                v-model="forget.confirmPassword"
                placeholder="确认密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="verify">
              <el-input v-model="forget.verify" placeholder="邮箱验证码"></el-input>
            </el-form-item>
          </el-form>
          <el-button class="next" type="primary" @click="submitForm('forget')">下一步</el-button>
          <p class="error-tip">{{ error }}</p>
        </div>
        <div class="active" v-if="active === 2">
          <div class="finish">
            <h2 class="success"><icon name="success" scale="40" width="40"></icon>重置成功</h2>
            <p class="wait">等待跳转至登录页({{ time }})</p>
            <el-link type="primary" @click="$router.push('/account/login')">立即跳转</el-link>
          </div>
        </div>
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="确认身份"></el-step>
          <el-step title="重置密码"></el-step>
          <el-step title="完成重置"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
import VerifyCode from '@/components/VerifyCode'
import { emailVerify, pwdVerify } from '@/utils/verify'
import { forgetPassword, updatePassword } from '@/api/active-user'
import elementFormVerify from '@/utils/elementFormVerify'
export default {
  components: {
    VerifyCode,
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入重置密码'))
      } else if (value.length < 6 || value.length > 24) {
        callback(new Error('密码长度需在6 ~ 24之间'))
      } else if (!pwdVerify(value)) {
        callback(new Error('密码必须包含大小写字母和数字'))
      } else {
        if (value !== '') {
          this.$refs.forget.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.forget.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateEmail = elementFormVerify.validateEmail
    return {
      active: 0,
      forget: {
        email: '',
        newPassword: '',
        confirmPassword: '',
        verify: '',
      },
      error: '',
      emailInfo: '',
      isOpenVerifyCode: false,
      isSuccess: false,
      time: 5,
      rules: {
        email: [
          {
            validator: validateEmail,
            trigger: 'blur',
          },
        ],
        newPassword: [
          {
            validator: validateNewPassword,
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          {
            validator: validateConfirmPassword,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  watch: {
    isSuccess(newVal) {
      if (newVal) {
        setTimeout(async () => {
          this.isOpenVerifyCode = false
          this.sendVerify()
        }, 1000)
      }
    },
    active(newVal) {
      if (newVal === 2) this.skip()
    },
  },
  methods: {
    submitForm(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.next()
        } else {
          return false
        }
      })
    },
    async next() {
      switch (this.active) {
        case 0:
          const email = this.forget.email
          if (!email) this.error = '邮箱不能为空'
          else if (!emailVerify(email)) this.error = '请输入正确的邮箱能为空'
          else {
            this.error = ''
            this.isOpenVerifyCode = true
          }
          break
        case 1:
          if (!this.forget.verify) {
            this.error = '验证码不能为空'
            return
          }
          const data = await updatePassword(this.forget)
          if (data.code === 200) {
            this.active++
            this.error = ''
          } else this.error = data.message
          break
      }
    },
    async sendVerify() {
      const data = await forgetPassword(this.forget.email)
      if (data.code === 200 || data.code === 5051) {
        this.active++
        if (data.code === 5051) this.emailInfo = data.message
      } else this.error = data.message
    },
    skip() {
      const timing = setInterval(() => {
        this.time--
        if (this.time === 0) {
          clearInterval(timing)
          this.$router.push('/account/login')
        }
      }, 1000)
    },
  },
}
</script>

<style lang="scss">
.forget-password {
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

        .next {
          margin: 20px 0;
          width: 100%;
        }

        .verify-code-box {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba($color: #000000, $alpha: 0.5);
          z-index: 200;
          display: flex;
          align-items: center;

          .verify-code {
            margin: auto;
            width: 300px;
            height: 200px;
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
      }
    }
  }
}
</style>
