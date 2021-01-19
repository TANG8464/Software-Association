<template>
  <div class="data-monitor">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-row :gutter="24" style="text-align: center">
          <el-col :span="24" v-if="book">
            <div><icon name="book" scale="40" width="40"></icon></div>
            <p style="padding: 0 45px 0 70px">
              {{ book[0].count }}/{{ book[1].count }}
              <el-progress
                :percentage="Number(((book[0].count / book[1].count) * 100).toFixed(1))"
                :color="customColorMethod"
              ></el-progress>
            </p>
          </el-col>
          <el-col :span="24">
            <p>
              <el-row :gutter="24">
                <el-col :span="8" v-for="(item, index) in news" :key="index">
                  <div class="notice-item">
                    <p>{{ newsFlag[item.flag] }}</p>
                    <span style="font-weight: bold; font-size: 18px">{{ item.count }}</span>
                  </div>
                </el-col>
              </el-row>
            </p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <member-pie :member="member"></member-pie>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div style="display: inline-block; padding-bottom: 20px">
          <!-- <el-date-picker
            v-model="dataTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker> -->
          <el-date-picker
            v-model="start"
            align="right"
            type="date"
            placeholder="选择开始日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <p v-if="start && end" style="color: #666666">
            当前查询时间段：
            {{ start.toLocaleDateString() }}-{{ end.toLocaleDateString() }}
          </p>
        </div>
        <website-count :websiteCountList="websiteCountList"></website-count>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getMonitorBook, getMonitorMember, getMonitorNews, getMonitorWebsite } from '@/api/monitor'
import MemberPie from './components/Member'
import WebsiteCount from './components/WebsiteCount'
import { getPickerOptions } from '@/utils/dateInfo'
export default {
  components: { MemberPie, WebsiteCount },
  data() {
    return {
      book: null,
      member: null,
      news: null,
      websiteCountList: null,
      dataTime: [],
      newsFlag: ['已发布', '草稿', '定时发布'],
      pickerOptions: getPickerOptions(),
      start: null,
      end: null,
      oneDay: 24 * 60 * 60 * 1000,
    }
  },
  watch: {
    // dataTime(newVal) {
    //   this.getMonitorWebsite()
    // },
    start(newVal) {
      this.end = new Date(newVal.getTime() + this.oneDay * 10)
      this.getMonitorWebsite()
    },
  },
  created() {
    // const start = new Date()
    // const end = new Date()
    // start.setFullYear(start.getFullYear() - 1)
    // this.dataTime = [start, end]
    this.start = new Date(new Date().getTime() - this.oneDay * 10)
    this.getMonitorBook()
    this.getMonitorMember()
    this.getMonitorNews()
    this.pickerOptions.disabledDate = (time) => {
      //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
      const newDate = new Date().getTime() - this.oneDay * 10
      // return time.getTime() > Date.now() - 8.64e7
      return time.getTime() > newDate
    }
  },
  methods: {
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#909399'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#67c23a'
      }
    },
    async getMonitorBook() {
      const { data } = await getMonitorBook()
      this.book = data
    },
    async getMonitorMember() {
      const { data } = await getMonitorMember()
      this.member = data
    },
    async getMonitorNews() {
      const { data } = await getMonitorNews()
      this.news = data
    },
    async getMonitorWebsite() {
      // const start = this.dataTime[0].getTime() / 1000
      // const end = this.dataTime[1].getTime() / 1000
      const start = this.start.getTime() / 1000
      const end = this.end.getTime() / 1000
      const data = await getMonitorWebsite(start.toFixed(0), end.toFixed(0))
      this.websiteCountList = data
    },
  },
}
</script>
<style lang="scss">
.data-monitor {
  .notice-item {
    border: 1px solid #e0e0e0;
    padding: 20px 0;
    margin: 0 10px;
    color: #666666;
    border-radius: 5px;
  }
}
</style>