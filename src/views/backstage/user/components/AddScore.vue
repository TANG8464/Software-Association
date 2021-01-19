<template>
  <el-dialog
    title="添加考核信息"
    :visible.sync="isOpenAdd"
    width="30%"
    :fullscreen="size.isSmallSize"
  >
    <span v-if="!isBulk">
      <score-form :scoreForm.sync="addData" ref="addData" :datetime.sync="datetime"></score-form>
    </span>
    <span v-else>
      <bulk-import-score @uploadSuccess="uploadSuccess"></bulk-import-score>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-link
        type="primary"
        style="font-size: 13px; margin: 0 10px"
        @click="$emit('update:isBulk', !isBulk)"
        >{{ isBulk ? '单个添加' : '批量导入' }}</el-link
      >
      <el-button @click="resetForm('addData')">重 置</el-button>
      <el-button type="primary" @click="addScore()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BulkImportScore from './BulkImport/ImportScore'
import ScoreForm from './ScoreForm'
export default {
  components: {
    BulkImportScore,
    ScoreForm,
  },
  props: {
    data: {
      type: Object,
      require: true,
    },
    isOpen: {
      type: Boolean,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    isBulk: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    const validateScore = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入成绩'))
      } else {
        if (value < 0 && value > 100) {
          callback(new Error('成绩需在0-100之间'))
        }
        callback()
      }
    }
    return {
      addData: {
        memberID: null,
        remark: '',
        score: null,
        testDateTimeStamp: null,
        testName: null,
      },
      isOpenAdd: false,
      datetime: null,
      rules: {
        score: [
          {
            validator: validateScore,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    data(newVal) {
      this.addData = newVal
    },
    isOpen(newVal) {
      this.isOpenAdd = newVal
    },
    date(newVal) {
      this.datetime = newVal
    },
    isOpenAdd(newVal) {
      this.$emit('update:isOpen', this.isOpenAdd)
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetForm()
      this.datetime = null
      this.$emit('update:data', this.addData)
      this.$emit('update:isOpen', this.isOpenAdd)
      this.$emit('update:date', this.datetime)
    },
    addScore() {
      if (!this.isBulk) {
        this.$emit('update:data', this.addData)
        this.$emit('update:isOpen', this.isOpenAdd)
        this.$emit('update:date', this.datetime)
        this.$emit('addScore')
      } else this.isOpenAdd = false
    },
    uploadSuccess() {
      this.$emit('uploadSuccess')
    },
  },
}
</script>
<style lang="scss">
</style>
