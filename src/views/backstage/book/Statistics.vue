<template>
  <div ref="statistics" class="book-statistics">
    <div class="date">
      <el-date-picker
        v-model="date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="timestamp"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
      <span
        :style="{ display: size.isSmallSize ? 'block' : 'inline', 'text-align': 'right' }"
        style="width: 100%"
      >
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          class="magrin"
          @click="query()"
          >查询</el-button
        >
      </span>
    </div>
    <div class="table">
      <statistics-table :bookData="bookData"></statistics-table>
      <p>
        <el-pagination
          style="float: right"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </p>
    </div>
    <p id="title">借阅统计图</p>
    <div id="chart" style="height: 400px; width: 100%"></div>
  </div>
</template>

<script>
import { timeDate } from '../../../tools/transformationDate'
import token from '@/utils/token'
import dataInfo from '@/utils/dateInfo'
import { borrowSearch, borrowCount } from '@/api/book/borrow'
import StatisticsTable from './components/StatisticsTable'
const echarts = require('echarts')
let myChart
export default {
  components: {
    StatisticsTable,
  },

  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 10,
      orgOptions: {},
      date: [],
      pickerOptions: dataInfo.pickerOptions,
      bookData: [],
      token: {},
      x: [],
      data: [],
      startDate: '',
      endDate: '',
      options: {
        title: {
          text: '',
        },
        tooltip: {},
        legend: {
          data: ['被借次数'],
        },
        xAxis: {
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 0, //角度顺时针计算的
            textStyle: {
              color: '#000', //更改坐标轴文字颜色
              fontSize: 12, //更改坐标轴文字大小
            },
          },
        },
        yAxis: {},
        series: [
          {
            name: '被借次数',
            type: 'bar',
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: 'black',
                    fontSize: 16,
                  },
                },
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            color: '#409EFF',
            barWidth: '50px',
          },
        ],
      },
    }
  },
  watch: {
    date(newVal) {
      if (newVal) this.query()
    },
    isSmallSize() {
      this.init()
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    isSmallSize() {
      return this.size.isSmallSize
    },
  },
  async created() {
    this.getToken()
    const endDay = new Date(new Date().toLocaleDateString())
    const startDay = new Date(new Date().toLocaleDateString()).getTime()

    this.date.push(startDay)
    this.date.push(endDay)
    this.getData()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const statistics = this.$refs.statistics
      statistics.removeChild(document.getElementById('chart'))
      const chart = document.createElement('div')
      chart.style.boxSizing="border-box"
      chart.style.width = '100%'
      chart.style.height = 300 + this.size.maxH * 0.1 + 'px'
      chart.id = 'chart'
      statistics.appendChild(chart)
      // 基于准备好的dom，初始化echarts实例
      myChart = echarts.init(document.getElementById('chart'))
      // 绘制图表
      myChart.setOption(this.options)
    },
    async getChartData(end, start) {
      this.x = []
      this.data = []
      const res = await borrowCount(start, end)
      if (res.code !== 200) return
      res.data.forEach((i) => {
        this.x.push(i.bookName)
        this.data.push(i.loanCount)
      })
      myChart.setOption({
        xAxis: {
          data: this.x,
        },
        series: [
          {
            // 根据名字对应到相应的系列
            name: '被借次数',
            data: this.data,
          },
        ],
      })
    },
    async handleCurrentChange(val) {
      const res = await borrowSearch({
        curPage: val,
      })
      if (res.code !== 200) return

      ;[this.pagenum, this.bookData] = [res.data.current, res.data.records]
      this.setBookData()
    },
    getToken() {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = token.getHeaderToken()
    },
    async query() {
      const endDay = parseInt((this.date[1] + 1000) / 1000)
      const startDay = parseInt(this.date[0] / 1000)
      const res = await borrowSearch({
        startDay,
        endDay,
      })
      if (res.code === 200) {
        this.getChartData(endDay, startDay)
        ;[this.pagenum, this.total, this.bookData] = [
          res.data.current,
          res.data.total,
          res.data.records,
        ]
        this.setBookData()
      }
    },
    async getData() {
      const currentTime = new Date(new Date().toLocaleDateString()).getTime()
      const endDay = parseInt((currentTime + 24 * 60 * 60 * 1000) / 1000)
      const startDay = parseInt(currentTime / 1000)
      const res = await borrowSearch({
        startDay,
        endDay,
      })
      if (res.code === 200) {
        this.getChartData(endDay, startDay)
        ;[this.pagenum, this.total, this.bookData] = [
          res.data.current,
          res.data.total,
          res.data.records,
        ]
        this.setBookData()
      }
    },
    setBookData() {
      this.bookData.forEach((i) => {
        const date = new Date(i.bdate * 1000)
        i.bdate = timeDate(i.bdate * 1000).date
        i.book.inDate = timeDate(i.book.inDate * 1000).date
        date.setDate(date.getDate() + 15)

        const y = date.getFullYear()
        const m = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        i.dueDate = y + '-' + m + '-' + d
        if (i.rdate == '' || i.rdate == null) {
          i.rdate = '未归还'
          const days = Math.round((date - new Date()) / (1 * 24 * 60 * 60 * 1000)) //相隔天数
          if (days >= 0) i.overday = 0
          else i.overday = -days
          return
        }
        if (Math.round((date - new Date(i.rdate)) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
          i.overday = 0
        } else {
          i.overday = -days
        }
        i.rdate = timeDate(i.rdate * 1000).date
      })
    },
  },
}
</script>

<style scoped>
.book-statistics .date * {
  margin: 5px;
}

.book-statistics .date .el-input__inner {
  width: 100%;
  max-width: 400px;
}

.main {
  padding: 40px 80px;
  text-align: left;
}

.charts {
  width: 100%;
  height: 300px;
  margin-top: 2%;
}

button {
  margin-left: 2%;
}

.table {
  margin-top: 2%;
}

#title {
  margin-top: 5%;
  color: #696969;
}
</style>
