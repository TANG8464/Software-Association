<template>
  <div class="datetime">
    <el-date-picker
      v-model="time.date"
      align="right"
      type="date"
      placeholder="选择日期"
      @change="handleChangeDate"
    ></el-date-picker>
    <div style="margin:10px 0;">
      <span>时：</span>
      <el-input-number
        v-model="time.hours"
        size="mini"
        controls-position="right"
        @change="handleChangeHours"
        :min="minHours"
        :max="23"
      ></el-input-number>
    </div>
    <div style="margin:10px 0;">
      <span>分：</span>
      <el-input-number
        v-model="time.minutes"
        size="mini"
        controls-position="right"
        @change="handleChangeMinutes"
        :min="minMinutes"
        :max="59"
      ></el-input-number>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: {}, //用于展示的时间数据
      reEdit: null, //重新编辑的数据
      datetime: null, //传递给服务器的时间
      minHours: null, //设置最小Hours
      minMinutes: null //设置最小Minutes
    }
  },
  mounted() {
    if (this.$route.query.id) this.reEdit = this.$parent.$parent.operation
    this.dataInit()
  },
  methods: {
    dataInit() {
      let reEdit = this.reEdit
      if (reEdit && reEdit.isTiming) this.datetime = new Date(reEdit.date)
      else this.datetime = new Date()
      this.time = {
        date: this.datetime,
        hours: this.datetime.getHours(),
        minutes: this.datetime.getMinutes()
      }
      this.handleChange()
      if (reEdit && !reEdit.isTiming) this.$emit('setDate', this.datetime.getTime())
    },
    handleChangeDate(val) {
      this.handleChange()
      this.$emit('setDate', this.datetime.getTime())
    },
    handleChangeHours(val) {
      this.handleChange()
      this.$emit('setDate', this.datetime.getTime())
    },
    handleChangeMinutes(val) {
      this.datetime.setMinutes(val)
      this.$emit('setDate', this.datetime.getTime())
    },
    handleChange() {
      let date = this.time.date
      let nowDate = new Date()
      const yearAreEqual = date.getFullYear() === nowDate.getFullYear()
      const monthAreEqual = date.getMonth() === nowDate.getMonth()
      const dateAreEqual = date.getDate() === nowDate.getDate()

      if (yearAreEqual && monthAreEqual && dateAreEqual) {
        this.minHours = nowDate.getHours()
        if (this.time.hours === nowDate.getHours()) {
          this.minMinutes = nowDate.getMinutes()
          if (this.time.minutes < this.minMinutes) this.time.minutes = nowDate.getMinutes()
        } else {
          this.minMinutes = 0
        }
      } else {
        this.minHours = 0
        this.minMinutes = 0
      }
      let datetime = new Date()
      datetime.setTime(date.getTime())
      datetime.setHours(this.time.hours)
      datetime.setMinutes(this.time.minutes)
      this.datetime = datetime
      this.$emit('setDate', datetime.getTime())
    }
  }
}
</script>