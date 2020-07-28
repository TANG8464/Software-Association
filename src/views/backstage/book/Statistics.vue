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
        :style="{'display':size.isSmallSize?'block':'inline','text-align':'right'}"
        style="width:100%"
      >
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          class="magrin"
          @click="query()"
        >查询</el-button>
      </span>
    </div>
    <div class="table">
      <el-table
        :data="bookData"
        style="width: 100%"
        :default-sort="{prop: 'bdate', order: 'descending'}"
        max-height="300"
        min-height="300"
      >
        <el-table-column prop="bdate" label="借出日期" width="150" align="center" sortable></el-table-column>
        <el-table-column prop="dueDate" label="应还日期" width="150" align="center"></el-table-column>
        <el-table-column prop="rdate" label="归还日期" width="150" align="center"></el-table-column>
        <el-table-column prop="overday" label="逾期天数" width="100" align="center"></el-table-column>
        <el-table-column prop="book.bookName" label="书刊名称" width="170" align="center"></el-table-column>
        <el-table-column prop="book.id" label="书刊条码" width="120" align="center"></el-table-column>
        <el-table-column prop="member.memberName" fixed="right" label="借书人姓名" width="120" align="center"></el-table-column>
        <el-table-column prop="member.id" label="借书人用户名" width="120" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <p id="title">借阅统计图</p>
    <div id="chart" style="height:400px;width:100%"></div>
  </div>
</template>
<script>
import { timeDate } from '../../../tools/transformationDate'
let echarts = require('echarts')
let myChart
export default {
  async created() {
    this.getToken()
    let end = new Date(new Date().toLocaleDateString())
    let start = new Date(new Date().toLocaleDateString()).getTime()

    this.date.push(start)
    this.date.push(end)
    this.getData()
  },
  data() {
    return {
      pagenum: 1,
      pagesize: 10,
      total: 10,
      orgOptions: {},
      date: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '当天',
            onClick(picker) {
              const end = parseInt(
                (new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000) / 1000
              )
              const start = parseInt(new Date(new Date().toLocaleDateString()).getTime() / 1000)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: ' 最近一月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '本年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              let day
              const year = start.getFullYear
              if (year % 4 == 0 && year % 100 != 0 && year % 400 == 0) {
                day = 366
              } else {
                day = 365
              }
              start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
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
            rotate: -20, //角度顺时针计算的
            textStyle: {
              color: '#000', //更改坐标轴文字颜色
              fontSize: 14, //更改坐标轴文字大小
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
          },
        ],
      },
    }
  },
  watch: {
    size(newVal) {
      this.init()
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  methods: {
    async handleCurrentChange(val) {
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
        params: { curPage: val },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
        this.pagenum = res.data.current
        this.bookData = res.data.records

        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).date
          i.book.inDate = timeDate(i.book.inDate * 1000).date
          date1.setDate(date1.getDate() + 15)

          let y = date1.getFullYear()
          let m = date1.getMonth() < 9 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1
          let d = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()
          i.dueDate = y + '-' + m + '-' + d
          if (i.rdate == '' || i.rdate == null) {
            i.rdate = '未归还'
            if (Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
          } else {
            if (Math.round((date1 - new Date(i.rdate)) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
            i.rdate = timeDate(i.rdate * 1000).date
          }
        })
      }
    },
    getToken() {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = localStorage.getItem('HEADER_TOKEN')
    },
    async query() {
      let name = []
      const end = parseInt((this.date[1] + 1000) / 1000)
      const start = parseInt(this.date[0] / 1000)
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
        params: { startDay: start, endDay: end },
      })
      if (res.code == 200) {
        this.getChartData(end, start)
        this.pagenum = res.data.current
        this.total = res.data.total
        this.bookData = res.data.records
        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).date
          i.book.inDate = timeDate(i.book.inDate * 1000).date
          date1.setDate(date1.getDate() + 15)

          let y = date1.getFullYear()
          let m = date1.getMonth() < 9 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1
          let d = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()
          i.dueDate = y + '-' + m + '-' + d
          if (i.rdate == '' || i.rdate == null) {
            i.rdate = '未归还'
            if (Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
          } else {
            if (Math.round((date1 - new Date(i.rdate)) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
            i.rdate = timeDate(i.rdate * 1000).date
          }
        })
      }
    },
    async getData() {
      const end = parseInt(
        (new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000) / 1000
      )
      const start = parseInt(new Date(new Date().toLocaleDateString()).getTime() / 1000)
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
        params: { startDay: start, endDay: end },
      })
      if (res.code == 200) {
        this.getChartData(end, start)
        let name = []
        this.pagenum = res.data.current
        this.total = res.data.total
        this.bookData = res.data.records
        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).date
          i.book.inDate = timeDate(i.book.inDate * 1000).date
          date1.setDate(date1.getDate() + 15)
          let y = date1.getFullYear()
          let m = date1.getMonth() < 9 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1
          let d = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()
          i.dueDate = y + '-' + m + '-' + d
          if (i.rdate == '' || i.rdate == null) {
            i.rdate = '未归还'
            if (Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
          } else {
            if (Math.round((date1 - new Date(i.rdate)) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
              i.overday = 0
            } else {
              i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
            }
            i.rdate = timeDate(i.rdate * 1000).date
          }
        })
      }
    },
    init() {
      let statistics = this.$refs.statistics
      statistics.removeChild(document.getElementById('chart'))
      let chart = document.createElement('div')
      chart.style.width = this.size.isSmallSize ? 400 + 'px' : 1000 + 'px'
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
      const { data: res } = await this.$http.get('bookborrow/loanCount', {
        headers: this.token,
        params: { endDay: end, startDay: start },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
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
      }
    },
  },
  mounted() {
    this.init()
  },
}
</script>
<style scoped>
.book-statistics .date * {
  margin: 5px;
}
.book-statistics .date .el-input__inner{
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