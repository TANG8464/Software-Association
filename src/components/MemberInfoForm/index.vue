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
    <el-form-item
      v-if="show.includes('memberName')"
      label="名称"
      prop="memberName"
      :style="{'max-width':`${maxWidth('memberName')}px`}"
    >
      <el-input v-model="info.memberName"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('gender')"
      label="性别"
      prop="gender"
      :style="{'max-width':`${maxWidth('gender')}px`}"
    >
      <el-radio v-model="info.gender" label="男">男</el-radio>
      <el-radio v-model="info.gender" label="女">女</el-radio>
    </el-form-item>
    <el-form-item
      v-if="show.includes('startYear')"
      label="届数"
      prop="startYear"
      :style="{'max-width':`${maxWidth('startYear')}px`}"
    >
      <el-input v-model="info.memberName"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('cascadeClass')"
      label="班级"
      :style="{'max-width':`${maxWidth('cascadeClass')}px`}"
    >
      <el-cascader
        v-model="info.cascadeClass"
        :options="cascadeClass"
        :props="{ expandTrigger: 'hover' }"
        @change="handleChangeCascadeClass"
      ></el-cascader>
    </el-form-item>
    <el-form-item
      v-if="show.includes('stu_num')"
      label="学号"
      prop="stu_num"
      :style="{'max-width':`${maxWidth('stu_num')}px`}"
    >
      <el-input v-model="info.stu_num"></el-input>
    </el-form-item>

    <el-form-item
      v-if="show.includes('nation')"
      label="国籍"
      prop="nation"
      :style="{'max-width':`${maxWidth('nation')}px`}"
    >
      <el-input v-model="info.nation" value="中国"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('nativePlace')"
      label="家乡"
      prop="nativePlace"
      :style="{'max-width':`${maxWidth('nativePlace')}px`}"
    >
      <provincial-linkage :place.sync="info.nativePlace"></provincial-linkage>
    </el-form-item>
    <el-form-item
      v-if="show.includes('address')"
      label="所在地"
      prop="address"
      :style="{'max-width':`${maxWidth('address')}px`}"
    >
      <provincial-linkage :place.sync="info.address"></provincial-linkage>
    </el-form-item>
    <el-form-item
      v-if="show.includes('education')"
      label="学历"
      prop="education"
      :style="{'max-width':`${maxWidth('education')}px`}"
    >
      <el-select placeholder="请选择" v-model="info.education">
        <el-option
          v-for="item in educations"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="show.includes('politicalOutlook')"
      label="政治面貌"
      prop="politicalOutlook"
      :style="{'max-width':`${maxWidth('politicalOutlook')}px`}"
    >
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
      v-if="show.includes('cardID')"
      label="身份证"
      prop="cardID"
      :style="{'max-width':`${maxWidth('cardID')}px`}"
    >
      <el-input v-model="info.cardID"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('phoneNum')"
      label="手机号"
      prop="phoneNum"
      :style="{'max-width':`${maxWidth('phoneNum')}px`}"
    >
      <el-input v-model="info.phoneNum"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('email')"
      label="邮箱"
      prop="email"
      :style="{'max-width':`${maxWidth('email')}px`}"
    >
      <el-input v-model="info.email"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('description')"
      label="个人说明"
      prop="description"
      :style="{'max-width':`1080px`}"
    >
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
import {
  userNameVerify,
  phoneVerify,
  cardIdVerify,
  stuNumVerify,
  emailVerify,
} from '@/utils/verify'
import { searchCascadeClass } from '@/api/institutes'
export default {
  name: 'memberInfoForm',
  components: {
    ProvincialLinkage,
  },
  props: {
    show: {
      type: Array,
      require: true,
    },
    personalInfo: {
      type: Object,
      deafult: {},
    },
    col: {
      type: Number,
      deafult: 2,
    },
    colW: {
      type: Number,
      deafult: 300,
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
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      } else if (!emailVerify(value)) {
        callback(new Error('请输入正确的邮箱'))
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
    maxWidth(value) {
      const len = (this.show.length - 1) % this.col
      const index = this.show.indexOf(value) + 2
      const plus = (this.col - 1) * 10
      switch (this.col) {
        case 1:
          return this.colW
        case 2:
          if (len === 0 || index !== this.show.length) return this.colW
          else return this.size.isSmallSize ? this.colW : this.colW * 2 + plus
        case 3:
          if (len === 0) {
            return this.colW
          } else if (index === this.show.length) {
            return this.size.isSmallSize ? this.colW : this.colW * 2 + plus
          } else if (index + 1 === this.show.length) {
            return this.size.isSmallSize ? this.colW : this.colW * 2 + plus
          }
          return this.colW
      }
    },
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
          // this.resetForm('info')
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
.member-info-form .el-form-item {
  padding: 3px 0;
}
</style>