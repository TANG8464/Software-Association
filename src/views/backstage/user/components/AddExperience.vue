<template>
  <div class="add-experience">
    <el-dialog title="成员经历" :visible.sync="isOpen" width="30%" center>
      <span>
        <el-form
          :model="experience"
          ref="experience"
          label-width="100px"
          class="demo-dynamic"
          label-position="top"
        >
          <el-form-item prop="memberName" label="成员名">
            <el-input v-model="experience.memberName" disabled></el-input>
          </el-form-item>
          <el-form-item prop="categoryID" label="经历分类">
            <el-select v-model="experience.categoryID" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in category"
                :key="item.id"
                :label="item.expCategoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="experienceDes" label="个人经历">
            <el-input v-model="experience.experienceDes"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span class="error-tip">{{ errorTip }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="addExperience()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchMemberExperience, addMemberExperience } from '@/api/member/experience'
import { searchMemberExperienceCategory } from '@/api/member/experience-category'
export default {
  props: {
    isOpenAddExperience: {
      type: Boolean,
      require: true,
    },
    memberId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      isOpen: false,
      experience: {},
      category: [],
      errorTip: null,
    }
  },
  watch: {
    isOpenAddExperience(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenAddExperience', newVal)
    },
    memberId(newVal) {
      if (newVal !== 0) {
        this.searchMemberExperience()
      }
    },
  },
  mounted() {
    this.searchMemberExperienceCategory()
  },
  methods: {
    async searchMemberExperience() {
      const data = await searchMemberExperience(this.memberId)
      if (data.code === 200) {
        this.experience = Object.assign(data.data, {
          memberID: this.memberId,
        })
        delete this.experience.id
      } else this.$message.error(data.message)
    },
    async searchMemberExperienceCategory() {
      const data = await searchMemberExperienceCategory()
      if (data.code === 200) {
        this.category = data.data
      }
    },
    async addExperience() {
      if (!this.experience.categoryID) {
        this.errorTip = '请选择经历分类'
      } else if (!this.experience.experienceDes) {
        this.errorTip = '请填写经历'
      } else {
        this.errorTip = null
        const data = await addMemberExperience(this.experience)
        if (data.code === 200) {
          this.$message.success('添加成功')
          this.isOpen = false
          this.experience = {}
          this.$emit('update:memberId', 0)
        } else this.$message.error(data.message)
      }
    },
  },
}
</script>
