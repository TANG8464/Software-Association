<template>
  <div class="achievement">
    <div class="title">
      <p :style="{ 'font-size': 18 + fontSize + 'px', margin: 0 }">主要成就</p>
      <span>Main Achievements</span>
    </div>
    <div class="achievement-content" ref="achievement-content" style="padding: 0 20px">
      <ul
        class="date-line"
        ref="date-line"
        :style="{ width: width + 'px', transform: `translate3d(${tx}px, 0px, 0px)` }"
        @mouseover="mouseover"
      >
        <li
          class="date-line-item"
          v-for="(item, index) in dateLine"
          :key="index"
          :style="{ width: `${100 / dateLine.length}%` }"
        >
          <span
            class="date-line_line"
            :style="{
              left: index === 0 ? '25%' : null,
              right: index === dateLine.length - 1 ? '25%' : null,
              width: index === 0 || index === dateLine.length - 1 ? '50%' : '100%',
            }"
          ></span>
          <span class="date-line_doc"></span>
          <div style="padding: 0 10px">
            <h4>{{ item.year }}</h4>
            <span class="date-line_content">{{ item.content }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateLine: [
        {
          year: '2011',
          content:
            '获“国信蓝点杯”全国总决赛JAVA软件开发高职高专组一等奖、二等奖、三等奖和优先奖,C语言程序设计高职高专组优秀奖。',
        },
        {
          year: '2013',
          content: '获湖南工业职业院校技能竞赛高职移动互联网应用（APPS)开发项目二等奖',
        },
        {
          year: '2014',
          content:
            '获全国职业院校技能大赛高职组“联想杯”移动互联网应用软件开发比赛一等奖、二等奖、湖南工业职业技术学院大学生科技创新创业大赛三等奖。',
        },
        {
          year: '2015',
          content:
            '获全国职业院校技能大赛高职组“联想杯”移动互联网应用软件开发比赛二等奖，第四届“中国软件杯”大学生软件设计大赛高职组决赛优秀奖。',
        },
        {
          year: '2016',
          content:
            '获第五届"中国软件杯"大学生软件设计大赛初赛本科组优秀奖，湖南省职业院校技能竞赛高职移动互联应用软件开发项目二等奖，湖南工业职院第三届大学生科技创新创业大赛三等奖、优胜奖。',
        },
        {
          year: '2017',
          content:
            '获湖南省职业院校技能竞赛高职组移动互联网应用软件开发项目三等奖，湖南省职业院校技能竞赛高职组云计算技术与应用项目荣获三等奖，湖南工业职业技术学院第四届大学生科技创新创业大赛二等奖。',
        },
        {
          year: '2018',
          content: '获湖南省职业院校技能竞赛高职组移动互联网应用软件开发项目三等奖',
        },
        {
          year: '2019',
          content:
            '获AIIA杯人工智能巡回赛及专项赛_星环科技Sophon_赛点中荣获专科高职组一等奖、优秀个人奖，技能竞赛高职组Web应用软件开发项目三等奖、移动互联网应用软件开发项目三等奖、云计算技术与应用项目一等奖和二等奖',
        },
        {
          year: '2020',
          content:
            '获湖南省职业院校技能竞赛高职组移动互联网应用软件开发赛项团体一等奖和二等奖、人工智能技术与应用项目三等奖。',
        },
      ],
      tx: 0,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    fontSize() {
      return this.size.maxW * 0.01
    },
    width() {
      return (this.dateLine.length - 1) * 230
    },
  },
  methods: {
    mouseover(e) {
      const offsetWidth = this.$refs['achievement-content'].offsetWidth
      const middle = offsetWidth / 4
      if (e.clientX > offsetWidth - middle && -this.tx + offsetWidth < this.width) {
        this.tx -= 230
      } else if (e.clientX < middle && this.tx < 0) {
        this.tx += 230
      }
    },
  },
}
</script>

<style lang="scss">
.achievement {
  ::-webkit-scrollbar {
    // width: 0px;
    // height: 0px;
    // background-color: black;
  }
  ::-webkit-scrollbar-thumb {
    // border-radius: 4px;
    // background: rgba(0, 0, 0, 0.3);
  }
  .date-line {
    transition: all 0.8s;
    overflow: hidden;
    .date-line-item {
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      text-align: center;
      vertical-align: top;

      .date-line_doc {
        width: 15px;
        height: 15px;
        display: inline-block;
        background: white;
        border-radius: 50%;
        position: absolute;
        left: 0px;
        right: 0px;
        margin: auto;
      }

      .date-line_line {
        width: 100%;
        height: 1px;
        background: white;
        display: inline-block;
        position: relative;
        top: -8px;
      }
    }
  }
  .achievement-content {
    overflow: hidden;
    //   transition: all 1s;
  }
  //   .achievement-content:hover {
  //     overflow: auto;
  //   }
}
</style>
