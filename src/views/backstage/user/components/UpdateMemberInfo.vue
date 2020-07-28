<template>
  <div class="update-member-info">
    <el-dialog title="修改成员信息" :visible.sync="isOpen" width="50%" :fullscreen="size.isSmallSize">
      <el-row :gutter="24">
        <el-col :xs="24">
          <el-form
            inline
            ref="memberInfo"
            label-width="100px"
            v-if="memberInfo"
            :model="memberInfo"
            label-position="left"
          >
            <el-form-item label="姓名" prop="memberName">
              <el-input v-model="memberInfo.memberName"></el-input>
            </el-form-item>
            <el-form-item label="学号" prop="stu_num">
              <el-input v-model="memberInfo.stu_num"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-select placeholder="请选择" v-model="memberInfo.gender">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话号码" prop="phoneNum">
              <el-input v-model="memberInfo.phoneNum"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="memberInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
              <el-input v-model="memberInfo.qq"></el-input>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-select placeholder="请选择" v-model="memberInfo.nation" filterable>
                <el-option
                  v-for="item in nations"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input v-model="memberInfo.nativePlace"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
              <el-input v-model="memberInfo.address"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌" prop="politicalOutlook">
              <el-select placeholder="请选择" v-model="memberInfo.politicalOutlook">
                <el-option
                  v-for="item in politicalOutlooks"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学历" prop="education">
              <el-select placeholder="请选择" v-model="memberInfo.education">
                <el-option
                  v-for="item in educations"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="cardID">
              <el-input v-model="memberInfo.cardID"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="positionID">
              <el-input v-model="memberInfo.positionID"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOpen=false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import memberInfo from '@/utils/memberInfo'
export default {
  name: 'updateMemberInfo',
  props: {
    isOpenUpdateInfo: {
      type: Boolean,
      require: true,
    },
    updateMemberInfo: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      memberInfo: null,
      isOpen: false,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    nations() {
      console.log(memberInfo.nations)

      return memberInfo.nations
    },
    politicalOutlooks() {
      return memberInfo.politicalOutlooks
    },
    educations() {
      return memberInfo.educations
    },
  },
  watch: {
    isOpenUpdateInfo(newVal) {
      this.isOpen = newVal
    },
    updateMemberInfo(newVal) {
      this.memberInfo = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenUpdateInfo', newVal)
    },
  },
  methods: {
    update() {
      this.isOpen = false
      this.$emit('update:updateMemberInfo', memberInfo)
    },
  },
}
</script>
<style>
.update-member-info .el-form-item {
  width: 350px;
}
.update-member-info .el-form-item .el-input{
    width: 200px;
}
</style>