<template>
  <div>
    <h4 class="safe-title">修改密码</h4>
    <el-form
      :model="safeForm"
      status-icon
      :rules="rules"
      ref="safeForm"
      label-width="100px"
      class="demo-safeForm"
    >
    <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="safeForm.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newsPassword">
        <el-input type="password" v-model="safeForm.newsPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="safeForm.checkPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item style="text-align:right;">
        <el-button type="primary" @click="submitForm('safeForm')">提交</el-button>
        <el-button @click="resetForm('safeForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
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
      } else if (value !== this.safeForm.newsPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      safeForm: {
        oldPassword: '',
        newsPassword: '',
        checkPassword: '',
      },
      rules: {
        oldPassword: [{ validator: validatorOld, trigger: 'blur' }],
        newsPassword: [{ validator: validatorNew, trigger: 'blur' }],
        checkPassword: [{ validator: validatorCheck, trigger: 'blur' }],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style>
.safe-title {
  background-color: #f8f8f8;
  border-radius: 5px;
  text-align: center;
}
</style>