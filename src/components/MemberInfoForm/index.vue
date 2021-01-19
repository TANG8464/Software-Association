<template>
  <!-- 这是一个memberInfo的共同form 分别出现在添加成员、修改成员信息、个人中心修改资料 -->
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
      :style="{ 'max-width': `${maxWidth('memberName')}px` }"
    >
      <el-input v-model="info.memberName"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('gender')"
      label="性别"
      prop="gender"
      :style="{ 'max-width': `${maxWidth('gender')}px` }"
    >
      <el-radio v-model="info.gender" label="男">男</el-radio>
      <el-radio v-model="info.gender" label="女">女</el-radio>
    </el-form-item>
    <el-form-item
      v-if="show.includes('startYear')"
      label="届数"
      prop="startYear"
      :style="{ 'max-width': `${maxWidth('startYear')}px` }"
    >
      <el-select v-model="info.startYear" placeholder="请选择">
        <el-option
          v-for="item in startYearList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="show.includes('cascadeClass')"
      label="班级"
      :style="{ 'max-width': `${maxWidth('cascadeClass')}px` }"
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
      :style="{ 'max-width': `${maxWidth('stu_num')}px` }"
    >
      <el-input v-model="info.stu_num"></el-input>
    </el-form-item>

    <el-form-item
      v-if="show.includes('nation')"
      label="民族"
      prop="nation"
      :style="{ 'max-width': `${maxWidth('nation')}px` }"
    >
      <!-- <el-input v-model="info.nation" value="中国"></el-input> -->
      <el-select v-model="info.nation" placeholder="请选择">
        <el-option v-for="item in nations" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="show.includes('nativePlace')"
      label="家乡"
      prop="nativePlace"
      :style="{ 'max-width': `${maxWidth('nativePlace')}px` }"
    >
      <provincial-linkage :place.sync="info.nativePlace"></provincial-linkage>
    </el-form-item>
    <el-form-item
      v-if="show.includes('address')"
      label="所在地"
      prop="address"
      :style="{ 'max-width': `${maxWidth('address')}px` }"
    >
      <provincial-linkage :place.sync="info.address"></provincial-linkage>
    </el-form-item>
    <el-form-item
      v-if="show.includes('education')"
      label="学历"
      prop="education"
      :style="{ 'max-width': `${maxWidth('education')}px` }"
    >
      <el-select placeholder="请选择" v-model="info.education" style="width: 100%">
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
      :style="{ 'max-width': `${maxWidth('politicalOutlook')}px` }"
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
      label="身份证号"
      prop="cardID"
      :style="{ 'max-width': `${maxWidth('cardID')}px` }"
    >
      <el-input v-model="info.cardID"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('phoneNum')"
      label="手机号"
      prop="phoneNum"
      :style="{ 'max-width': `${maxWidth('phoneNum')}px` }"
    >
      <el-input v-model="info.phoneNum"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('qq')"
      label="QQ"
      prop="QQ"
      :style="{ 'max-width': `${maxWidth('qq')}px` }"
    >
      <el-input v-model="info.qq"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('email')"
      label="邮箱"
      prop="email"
      :style="{ 'max-width': `${maxWidth('email')}px` }"
    >
      <el-input v-model="info.email"></el-input>
    </el-form-item>
    <el-form-item
      v-if="show.includes('description')"
      label="个人说明"
      prop="description"
      :style="{ 'max-width': `${maxWidth('description')}px` }"
    >
      <el-input
        type="textarea"
        maxlength="150"
        show-word-limit
        v-model="info.description"
        :rows="5"
        resize="none"
      ></el-input>
    </el-form-item>
    <div style="text-align: right; margin: 15px">
      <el-button @click="resetInfo()">重 置</el-button>
      <el-button type="primary" @click="submitForm('info')">确 定</el-button>
    </div>
  </el-form>
</template>

<script>
import ProvincialLinkage from '@/components/ProvincialLinkage'
import memberInfo from '@/utils/info'
import elementFormVerify from '@/utils/elementFormVerify'
import { searchCascadeClass } from '@/api/member/institutes'
export default {
  name: 'memberInfoForm',
  components: {
    ProvincialLinkage,
  },
  props: {
    show: {
      //用于标记是否展示该元素
      type: Array,
      require: true,
    },
    personalInfo: {
      //传入默认数据
      type: Object,
      default: {},
    },
    col: {
      //需要多少列
      type: Number,
      default: 2,
    },
    colW: {
      //列宽多少px
      type: Number,
      default: 300,
    },
  },
  data() {
    //element验证函数
    const validateCardID = elementFormVerify.validateCardID
    const validatePhoneNum = elementFormVerify.validatePhoneNum
    const validateStuNum = elementFormVerify.validateStuNum
    const validateMemberName = elementFormVerify.validateMemberName
    const validateEmail = elementFormVerify.validateEmail
    return {
      info: null, //memberInfo
      cascadeClass: null, //级联班级
      rules: {
        //element验证规则
        cardID: [
          {
            validator: validateCardID,
            trigger: 'blur',
          },
        ],
        phoneNum: [
          {
            validator: validatePhoneNum,
            trigger: 'blur',
          },
        ],
        stu_num: [
          {
            validator: validateStuNum,
            trigger: 'blur',
          },
        ],
        memberName: [
          {
            validator: validateMemberName,
            trigger: 'blur',
          },
        ],
        email: [
          {
            validator: validateEmail,
            trigger: 'blur',
          },
        ],
      },
      startYearList: [], //届数
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    educations() {
      //学历
      return memberInfo.educations()
    },
    politicalOutlooks() {
      //政治面貌
      return memberInfo.politicalOutlooks()
    },
    nations() {
      return memberInfo.nations()
    },
  },
  watch: {
    personalInfo(newVal) {
      this.resetInfo() //重置信息
      this.setCascadeClass() //设置级联
      this.initStartYear() //初始化届数数据
    },
  },
  mounted() {
    this.resetInfo() //重置信息
    this.setCascadeClass() //设置级联
    this.initStartYear() //初始化届数数据
  },
  methods: {
    //初始化届数
    initStartYear() {
      this.startYearList = memberInfo.startYear()
      if (!this.info.startYear) this.info.startYear = this.startYearList[0]
    },
    //设置每个input的maxW
    maxWidth(value) {
      /*
            实现一列，两列，三列布局
            最后一个一直100 
            两列时，（总数量-1）%2=1时，倒数第二个100，其余50
            三列时，（总数量-1）%3=1时，倒数第二个66.66，其余33.33
            三列时，（总数量-1）%3=2时，倒数第二个66.66，倒数第四个66.66，其余33.33
            */
      const showLen = this.show.length - 1
      const len = showLen % this.col
      const index = this.show.indexOf(value) + 1
      const plus = (this.col - 1) * 10
      const width3 = this.size.isSmallSize ? this.colW : this.colW * 3 + plus
      const width2 = this.size.isSmallSize ? this.colW : this.colW * 2 + plus
      switch (this.col) {
        case 1:
          return this.colW
        case 2:
          if (index >= this.show.length || (len === 1 && index === showLen)) {
            return width2
          } else return this.colW
        case 3:
          const isLast = len === 1 && (index === showLen || index + 1 === showLen) //余1
          const isLastButone = len === 2 && (index === showLen || index + 2 === showLen) //余2
          if (index >= this.show.length) {
            //最后一个
            return width3
          } else if (len === 0) {
            //当无余数时
            return this.colW
          } else if (isLast || isLastButone) {
            return width2
          }
          return this.colW
      }
    },
    //查询级联班级
    async setCascadeClass() {
      const res = await searchCascadeClass()
      this.cascadeClass = res
    },
    //提交表单数据
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.info.classID = this.info.cascadeClass[this.info.cascadeClass.length - 1]
          this.$emit('update:personalInfo', this.info) //更改父组件的personalInfo
          this.$emit('submitForm') //执行父组件的提交表单
        } else {
          return false
        }
      })
    },
    //设置info的classId
    handleChangeCascadeClass(cascadeClass) {
      this.info.classID = cascadeClass[cascadeClass.length - 1]
    },
    //重置info
    resetInfo() {
      const info = {}
      Object.keys(this.personalInfo).forEach((item) => {
        info[item] = this.personalInfo[item]
      })
      this.info = info
      this.info.cascadeClass = this.info.iclass
        ? [this.info.institute.id, this.info.specialty.id, this.info.iclass.id]
        : []
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
