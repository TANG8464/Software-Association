<template>
  <div class="website">
    <div ref="website-chart-box">
      <div id="website-chart" ref="chart"></div>
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入饼图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  props: {
    websiteCountList: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      option: {
        title: {
          text: '网站访问量统计',
          subtext: '次数统计',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['网站访问量'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '网站访问量',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            color: '#2166ac',
          },
        ],
      },
    }
  },
  watch: {
    websiteCountList(newVal) {
      this.init()
    },
  },
  methods: {
    init() {
      let dateList = []
      let countList = []
      this.websiteCountList.visitDateList.forEach((item) => {
        dateList.push(new Date(item.date * 1000).toLocaleDateString())
        countList.push(item.count)
      })
      this.option.title.subtext = `${this.websiteCountList.visitToDay}/${this.websiteCountList.totalVisit}`
      this.option.series[0].data = countList
      this.option.xAxis.data = dateList
      const statistics = this.$refs['website-chart-box']
      statistics.removeChild(document.getElementById('website-chart'))
      const chart = document.createElement('div')
      chart.style.height = 400 + 'px'
      chart.id = 'website-chart'
      statistics.appendChild(chart)
      //   // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('website-chart'))
      //   // 绘制图表
      myChart.setOption(this.option)
    },
  },
}
</script>