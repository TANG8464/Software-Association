<template>
  <div class="member">
    <div ref="member-chart-box">
      <div id="member-chart" ref="chart"></div>
    </div>
  </div>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入饼图
require('echarts/lib/chart/pie')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  props: {
    member: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      option: {
        title: {
          text: '成员分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          top: '8%',
          left: 'right',
          orient: 'vertical',
        },
        series: [
          {
            name: '成员分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      memberFlag: ['协会成员', '非协会成员', '黑名单成员'],
    }
  },
  watch: {
    member(newVal) {
      this.init()
    },
  },
  methods: {
    init() {
      let member = []
      this.member.forEach((item) => {
        const { count: value, flag } = item
        const name = this.memberFlag[flag]
        member.push({ value, name })
      })
      this.option.series[0].data = member
      const statistics = this.$refs['member-chart-box']
      statistics.removeChild(document.getElementById('member-chart'))
      const chart = document.createElement('div')
      chart.style.height = 300 + 'px'
      chart.id = 'member-chart'
      statistics.appendChild(chart)
      //   // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('member-chart'))
      //   // 绘制图表
      myChart.setOption(this.option)
    },
  },
}
</script>