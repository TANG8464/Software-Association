<template>
  <div class="account-security" v-if="personalInfo">
    <p class="tip" :class="'tip-estate-' + personalInfo.safeEstate">
      安全系数：
      <el-rate
        v-model="personalInfo.safeEstate"
        show-text
        :texts="safetyFactor"
        :colors="colors"
        disabled
        :text-color="colors[personalInfo.safeEstate]"
        score-template="{value}"
        :max="5"
      ></el-rate>
    </p>

    <p
      class="item"
      :class="{ success: personalInfo.githubStatus, warning: !personalInfo.githubStatus }"
    >
      <span> <icon name="github" scale="20" width="20"></icon>绑定Github </span>
      <span>{{ personalInfo.githubStatus ? `已绑定:${personalInfo.githubId}` : '未绑定' }}</span>
      <span @click="boundClick('github', !personalInfo.githubStatus)">{{
        personalInfo.githubStatus ? '解除绑定' : '绑定Github'
      }}</span>
    </p>
    <p
      class="item"
      :class="{ success: personalInfo.giteeStatus, warning: !personalInfo.giteeStatus }"
    >
      <span> <icon name="gitee" scale="20" width="20"></icon>绑定码云 </span>
      <span>{{ personalInfo.giteeStatus ? `已绑定:${personalInfo.giteeId}` : '未绑定' }}</span>
      <span @click="boundClick('gitee', !personalInfo.giteeStatus)">{{
        personalInfo.giteeStatus ? '解除绑定' : '绑定码云'
      }}</span>
    </p>
    <p class="item">
      <span> <icon name="email" scale="20" width="20"></icon>绑定邮箱 </span>
      <span>{{ personalInfo.emailStatus ? `${personalInfo.email}` : '未绑定' }}</span>
      <span @click="isOpenVerifyCode = true">{{
        personalInfo.emailStatus ? '修改邮箱' : '绑定邮箱'
      }}</span>
    </p>
    <p class="item">
      <span> <icon name="lock" scale="21" width="21"></icon>设置密码 </span>
      <span>已设置</span>
      <router-link to="/personal-center/update-password" tag="span">修改密码</router-link>
    </p>

    <div class="pop-up-box" v-if="isOpenVerifyCode">
      <div class="verify-code">
        <verify-code ref="verify" :isSuccess.sync="isSuccess"></verify-code>
      </div>
    </div>
    <el-dialog title="修改邮箱" :visible.sync="isOpenUpdate" width="30%" center>
      <el-form ref="updateEmailFrom" :model="updateEmailFrom" label-position="top">
        <el-form-item prop="newEmail">
          <siae-input
            v-model="updateEmailFrom.email"
            :status="updateEmailFrom.emailStatus"
            label="新账户邮箱"
            :disabled="isSendVerify"
          ></siae-input>
        </el-form-item>
        <el-form-item prop="verify">
          <span style="width: 70%; max-width: 350px; display: inline-block">
            <siae-input
              v-model="updateEmailFrom.verify"
              :status="updateEmailFrom.emailStatus"
              label="验证码"
            ></siae-input>
          </span>
          <span>
            <send-verify-btn
              @send-verify="sendVerify()"
              :disabled.sync="isSendVerify"
            ></send-verify-btn>
          </span>
        </el-form-item>
      </el-form>
      <div class="error-tip">{{ errorTip }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpenUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateEmail()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detailedInformation } from '@/api/active-user'
import { verifyEmail, updateEmail } from '@/api/email'
import { binding, unbind } from '@/api/oauth'
import { getBaseURL } from '@/utils/url'
import VerifyCode from '@/components/VerifyCode'
import SendVerifyBtn from '@/components/SendVerifyBtn'
import { emailVerify } from '@/utils/verify'
import token from '@/utils/token'
export default {
  components: {
    VerifyCode,
    SendVerifyBtn,
  },
  data() {
    return {
      personalInfo: null,
      safetyFactor: ['不安全', '低', '中', '良好', '高'],
      colors: {
        0: '#ed5a5a',
        1: '#ed5a5a',
        2: '#ffad4f',
        3: '#f1d622',
        4: '#9ad642',
        5: '#05c212',
      },
      isOpenVerifyCode: false,
      isSuccess: false,
      isOpenUpdate: false,
      updateEmailFrom: {},
      errorTip: '',
      isSendVerify: false,
    }
  },
  computed: {
    changeMyInfo() {
      return this.$store.state.myInfo
    },
  },
  watch: {
    changeMyInfo() {
      this.setPersonalInfo()
    },
    isSuccess(newVal) {
      console.log(newVal)
      if (newVal) {
        setTimeout(() => {
          this.isOpenVerifyCode = false
          this.isOpenUpdate = true
          this.isSuccess = false
        }, 1000)
      }
    },
  },
  created() {
    this.setPersonalInfo()
  },
  methods: {
    async setPersonalInfo() {
      const { data } = await detailedInformation()
      this.personalInfo = data.data
      if (this.personalInfo) {
        this.personalInfo.safeEstate = 2
        if (this.personalInfo.email) {
          this.personalInfo.emailStatus = true
          this.personalInfo.safeEstate++
        } else this.personalInfo.emailStatus = false
        if (this.personalInfo.giteeId) {
          this.personalInfo.giteeStatus = true
          this.personalInfo.safeEstate++
        } else this.personalInfo.giteeStatus = false
        if (this.personalInfo.githubId) {
          this.personalInfo.githubStatus = true
          this.personalInfo.safeEstate++
        } else this.personalInfo.githubStatus = false
      }
    },
    async boundClick(source, status) {
      if (status) {
        const { data } = await binding(source)
        console.log(data)
        localStorage.setItem('key', data.key)
        window.location.href = data.url
      } else {
        this.$confirm('解绑后将不能使用该账号登录', '解绑提醒', {
          confirmButtonText: '确认解绑',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
          .then(async () => {
            const data = await unbind(source)
            if (data.code === 200) {
              this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
              this.$message.success('解绑成功')
            } else this.$message.error(data.message)
          })
          .catch(() => {})
      }
    },
    async sendVerify() {
      if (!this.updateEmailFrom.email) {
        this.errorTip = '请输入邮箱'
      } else if (!emailVerify) {
        this.errorTip = '邮箱格式不正确'
      } else {
        this.errorTip = ''
        const data = await verifyEmail(this.updateEmailFrom.email)
        if (data.code === 200) {
          this.isSendVerify = true
        } else this.errorTip = data.message
      }
    },
    async updateEmail() {
      const data = await updateEmail(this.updateEmailFrom)
      if (data.code === 200) {
        this.isOpenUpdate = false
        this.$message.success('修改成功')
        token.removeHeaderToken()
      } else this.errorTip = data.message
    },
  },
}
</script>

<style lang="scss">
.account-security {
  padding: 20px 0;

  .tip {
    .el-rate {
      display: inline-block;
    }
  }

  .tip-estate-1 {
    color: #ed5a5a;
  }

  .tip-estate-2 {
    color: #ffad4f;
  }

  .tip-estate-3 {
    color: #f1d622;
  }

  .tip-estate-4 {
    color: #9ad642;
  }

  .tip-estate-5 {
    color: #05c212;
  }

  .item {
    margin: 0;
    padding: 15px 0;
    border-top: 1px dashed #e0e0e0;
    border-bottom: 1px dashed #e0e0e0;

    span:first-child {
      text-align: left;
    }

    span {
      width: 33%;
      display: inline-block;
      text-align: center;
    }

    span:last-child {
      color: #409eff;
      text-align: right;
    }

    span[data-disabled] {
      color: #c0c0c0;
      font-size: 12px;
    }
  }

  .success {
    span:first-child {
      color: #000000;
    }

    span {
      color: #05c212;
    }

    span:last-child {
      color: #ed5a5a;
    }
  }

  .item:last-child {
    border-top: none;
  }
}
</style>
