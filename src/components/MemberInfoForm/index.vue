<template>
  <el-form
    label-position="top"
    label-width="80px"
    status-icon
    :rules="rules"
    v-if="info"
    :model="info"
    ref="info"
    class="member-info-form"
  >
    <el-form-item label="名称" prop="memberName">
      <el-input v-model="info.memberName"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="gender">
      <el-radio v-model="info.gender" label="男">男</el-radio>
      <el-radio v-model="info.gender" label="女">女</el-radio>
    </el-form-item>
    <el-form-item label="班级">
      <el-cascader
        v-model="info.cascadeClass"
        :options="cascadeClass"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChangeCascadeClass"
      ></el-cascader>
    </el-form-item>
    <el-form-item label="学号" prop="stu_num">
      <el-input v-model="info.stu_num"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phoneNum">
      <el-input v-model="info.phoneNum"></el-input>
    </el-form-item>
    <el-form-item label="国籍" prop="nation">
      <el-input v-model="info.nation" value="中国"></el-input>
    </el-form-item>
    <el-form-item label="家乡" prop="nativePlace">
      <provincial-linkage :place.sync="info.nativePlace"></provincial-linkage>
    </el-form-item>
    <el-form-item label="所在地" prop="address">
      <provincial-linkage :place.sync="info.address"></provincial-linkage>
    </el-form-item>
    <el-form-item label="学历" prop="education">
      <el-select placeholder="请选择" v-model="info.education">
        <el-option
          v-for="item in educations"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="政治面貌" prop="politicalOutlook">
      <el-select placeholder="请选择" v-model="info.politicalOutlook">
        <el-option
          v-for="item in politicalOutlooks"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="身份证"
      prop="cardID"
      :style="{'max-width':`${col!==3?maxWidth:cardIDMax}px`}"
    >
      <el-input v-model="info.cardID"></el-input>
    </el-form-item>
    <el-form-item label="个人说明" prop="description" :style="{'max-width':`${maxWidth}px`}">
      <el-input type="textarea" v-model="info.description" :rows="5" resize="none"></el-input>
    </el-form-item>
    <div style="text-align:right;margin:15px">
      <el-button @click="resetForm('info')">重 置</el-button>
      <el-button type="primary" @click="submitForm('info')">确 定</el-button>
    </div>
  </el-form>
</template>
<script>
import ProvincialLinkage from '@/components/ProvincialLinkage'
import memberInfo from '@/utils/memberInfo'
import { userNameVerify, phoneVerify, cardIdVerify, stuNumVerify } from '@/utils/verify'
import { searchCascadeClass } from '@/api/searchData'
export default {
  name: 'memberInfoForm',
  components: {
    ProvincialLinkage,
  },
  props: {
    personalInfo: {
      type: Object,
      deafult: {},
    },
    col: {
      type: Number,
      deafult: 2,
    },
  },
  data() {
    const validateCardID = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证不能为空'))
      } else if (!cardIdVerify(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!phoneVerify(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateStuNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('学号不能为空'))
      } else if (!stuNumVerify(value)) {
        callback(new Error('请输入正确的学号'))
      } else {
        callback()
      }
    }
    const validateMemberName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      } else if (!userNameVerify(value)) {
        callback(new Error('名称只能在4-10位之间'))
      } else {
        callback()
      }
    }
    return {
      info: null,
      cascadeClass: null,
      rules: {
        cardID: [{ validator: validateCardID, trigger: 'blur' }],
        phoneNum: [{ validator: validatePhoneNum, trigger: 'blur' }],
        stu_num: [{ validator: validateStuNum, trigger: 'blur' }],
        memberName: [{ validator: validateMemberName, trigger: 'blur' }],
      },
      options: [],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    maxWidth() {
      switch (this.col) {
        case 1:
          return 300
        case 2:
          return this.size.isSmallSize ? 300 : 610
        case 3:
          return this.size.isSmallSize ? 350 : 1080
      }
    },
    cardIDMax() {
      return this.size.isSmallSize ? 350 : 720
    },
    educations() {
      return memberInfo.educations
    },
    politicalOutlooks() {
      return memberInfo.politicalOutlooks
    },
  },
  mounted() {
    this.setCascadeClass()
    this.info = this.personalInfo
    this.info.cascadeClass = this.info.iclass
      ? [this.info.institute.id, this.info.specialty.id, this.info.iclass.id]
      : []
  },
  methods: {
    async setCascadeClass() {
      const res = await searchCascadeClass()
      this.cascadeClass = res
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.info.classID = this.info.cascadeClass[this.info.cascadeClass.length - 1]
          this.$emit('update:personalInfo', this.info)
          this.$emit('submitForm')
          this.resetForm('info')
        } else {
          return false
        }
      })
    },
    handleChangeCascadeClass(cascadeClass) {
      this.info.classID = cascadeClass[cascadeClass.length - 1]
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style>
.member-info-form .el-form--label-top .el-form-item__label {
  padding-top: 5px;
}
</style>