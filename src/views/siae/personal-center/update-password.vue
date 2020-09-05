<template>
  <div class="update-password">
    <div class="header">
      <router-link to="/personal-center/home" tag="span">
        <el-link type="info">返回</el-link>
      </router-link>
      <span style="margin:0 8px;color:#e0e0e0"></span>
      <span style="font-weight:600">修改密码</span>
    </div>
    <el-form
      :model="safeForm"
      status-icon
      :rules="rules"
      :label-position="labelPosition"
      ref="safeForm"
      label-width="100px"
      class="demo-safeForm"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="safeForm.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="safeForm.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="safeForm.checkPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="验证">
        <verify-code ref="verify" :isSuccess.sync="isSuccess"></verify-code>
      </el-form-item>
      <el-form-item style="text-align:right;">
        <el-button type="primary" @click="submitForm('safeForm')" :disabled="!isSuccess">确认修改</el-button>
        <el-button @click="resetForm('safeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import VerifyCode from './components/PersonalData/Verify'
import { pwdVerify } from '@/utils/verify'
import token from '@/utils/token'
export default {
  components: {
    VerifyCode,
  },
  data() {
    var validatorOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.safeForm.checkPass !== '') {
          this.$refs.safeForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatorNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.safeForm.oldPassword) {
        callback(new Error('新密码不可与旧密码相同'))
      } else if (value.length < 6 || value.length > 24) {
        callback(new Error('新密码长度需在6 ~ 24之间'))
      } else if (!pwdVerify(value)) {
        callback(new Error('新密码必须包含大小写字母和数字'))
      } else {
        if (this.safeForm.checkPass !== '') {
          this.$refs.safeForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatorCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.safeForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      safeForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: '',
      },
      rules: {
        oldPassword: [{ validator: validatorOld, trigger: 'blur' }],
        newPassword: [{ validator: validatorNew, trigger: 'blur' }],
        checkPassword: [{ validator: validatorCheck, trigger: 'blur' }],
      },
      isSuccess: false,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    labelPosition() {
      return this.size.isSmallSize ? 'top' : 'left'
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.isSuccess) {
          this.updatePassword()
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.verify.reset()
    },
    async updatePassword() {
      const { data } = await this.$axios.put('member/password', this.safeForm)

      if (data.code !== 200) {
        this.$message.error(data.message)
      } else {
        this.$message.success('修改成功')
        token.removeHeaderToken()
        this.resetForm('safeForm')
      }
    },
  },
}
</script>
<style lang="scss">
.update-password {
  .demo-safeForm {
    padding: 60px;
  }
  .header {
    border-bottom: 1px solid #e0e0e0;
    font-size: 16px;
    padding: 10px 0;
  }
  .safe-title {
    background-color: #f8f8f8;
    border-radius: 5px;
    text-align: center;
  }
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
}
</style>