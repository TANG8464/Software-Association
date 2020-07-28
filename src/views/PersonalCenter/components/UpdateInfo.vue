<template>
  <el-dialog title="修改个人资料" :visible.sync="isOpen" width="30%" :fullscreen="size.isSmallSize">
    <el-form label-position="right" label-width="80px" v-if="personalInfo" :model="updateData">
      <el-form-item label="名称">
        <el-input v-model="personalInfo.memberName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="personalInfo.phoneNum"></el-input>
      </el-form-item>
      <el-form-item label="所在地">
        <el-input v-model="personalInfo.address"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="personalInfo.cardID"></el-input>
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="personalInfo.iclass.class_name"></el-input>
      </el-form-item>
      <el-form-item label="学历">
        <el-input v-model="personalInfo.education"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="personalInfo.gender"></el-input>
      </el-form-item>
       <el-form-item label="国籍">
        <el-input v-model="personalInfo.nation"></el-input>
      </el-form-item>
       <el-form-item label="家乡">
        <el-input v-model="personalInfo.nativePlace"></el-input>
      </el-form-item>
       <el-form-item label="政治面貌">
        <el-input v-model="personalInfo.politicalOutlook"></el-input>
      </el-form-item>
       <el-form-item label="学号">
        <el-input v-model="personalInfo.stu_num"></el-input>
      </el-form-item>
      <el-form-item label="个人说明">
        <el-input type="textarea" v-model="personalInfo.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isOpen = false">取 消</el-button>
      <el-button type="primary" @click="isOpen = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { detailedInformation } from '@/api/active-user'
export default {
  name: 'updateInfo',
  props: {
    isOpenUpdate: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      isOpen: null,
      personalInfo: null,
      updateData: {
        address: 'string',
        avatarUrl: 'string',
        cardID: 'string',
        classID: 0,
        description: 'string',
        education: 'string',
        gender: 'string',
        memberName: 'string',
        nation: 'string',
        nativePlace: 'string',
        phoneNum: 'string',
        politicalOutlook: 'string',
        stu_num: 0,
      },
    }
  },
  watch: {
    isOpenUpdate(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenUpdate', newVal)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.setPersonalInfo()
  },
  methods: {
    setPersonalInfo() {
      detailedInformation().then((res) => {
        this.personalInfo = res.data.data
        console.log(this.personalInfo)
      })
    },
  },
}
</script>