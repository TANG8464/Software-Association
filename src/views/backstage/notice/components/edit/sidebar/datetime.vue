<template>
  <div class="datetime">
    <el-date-picker
      v-model="time.date"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
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
      time: {
        date: null,
        hours: null,
        minutes: null,
      },
      reEditTime: null,
      datetime: null,
      minHours: null,
      minMinutes: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  mounted() {
    console.log(this.$parent.$parent);
    if(this.$route.query.id)this.reEditTime = this.$parent.$parent.operation;
    this.dataInit();
  },
  methods: {
    dataInit() {
      console.log(this.reEditTime);
      let reEditTime = this.reEditTime;
      let date = null;
      if (reEditTime && reEditTime.isTiming) date = new Date(reEditTime.date);
      else date = new Date();
      console.log(date);
      this.time = {
        date: date,
        hours: date.getHours(),
        minutes: date.getMinutes(),
      };
      this.datetime = date;
      this.handleChange();
      if (reEditTime && !reEditTime.isTiming) this.$emit('setDate', this.datetime.getTime());
    },
    handleChangeDate(val) {
      this.handleChange();
      this.$emit('setDate', this.datetime.getTime());
    },
    handleChangeHours(val) {
      this.handleChange();
      this.$emit('setDate', this.datetime.getTime());
    },
    handleChangeMinutes(val) {
      this.datetime.setMinutes(val);
      this.$emit('setDate', this.datetime.getTime());
    },
    handleChange() {
      let date = this.time.date;
      let nowDate = new Date();
      if (date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth() && date.getDate() === nowDate.getDate()) {
        this.minHours = nowDate.getHours();
        if (this.time.hours === nowDate.getHours()) {
          this.minMinutes = nowDate.getMinutes();
          if (this.time.minutes < this.minMinutes) this.time.minutes = nowDate.getMinutes();
        }
        else {
          this.minMinutes = 0;
        }
      } else {
        this.minHours = 0;
        this.minMinutes = 0;
      }
      let datetime = new Date();
      datetime.setTime(date.getTime());
      datetime.setHours(this.time.hours);
      datetime.setMinutes(this.time.minutes);
      this.datetime = datetime;
      console.log('handleChange');
      console.log(this.minHours);
      console.log(this.minMinutes);
      this.$emit('setDate', datetime.getTime());
    }
  }
};
</script>