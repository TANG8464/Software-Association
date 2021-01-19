<template>
  <div class="system-log">
    <p class="intro" :style="{ margin: `${size.maxH * 0.02}px 10px` }">
      记录所有操作日志，防止异常操作的出现，便于核查。
    </p>

    <el-link type="primary" style="float: right" @click="downLoadLog('')">下载操作日志</el-link>

    <ul class="log-box" style ref="logBox">
      <li
        class="log"
        v-for="item in allLog"
        :key="item.id"
        :style="{ margin: `${size.maxW * 0.01}px 0` }"
        style="clear: both"
      >
        <el-divider
          v-if="item.isDateTitle"
          content-position="left"
          :style="{ margin: `${size.maxW * 0.1}px 0` }"
          >{{ item.dateTitle | dateTitleFormat }}</el-divider
        >

        <span class="text-info">{{ item.createDate | dateFormat }}</span>
        <span class="text-primary">{{ item.username | isempty }}</span>
        <span style="overflow: hidden; text-overflow: ellipsis">{{
          item.operation | isempty
        }}</span>
        <span v-if="isShow">{{ item.url | isempty }}</span>
        <span v-if="size.isLandscape" :class="item.msgStyle">{{
          item.message | isempty | messageFormart
        }}</span>
        <span v-if="size.isLandscape" class="text-info">{{ item.ip | isempty }}</span>

        <span class="text-info" style="float: right">
          <el-dropdown trigger="click" size="mini" style="position: relative; top: -10px">
            <span class="el-dropdown-link el-icon-more"></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="downLoadLog(item.username)"
                >仅下载此用户的操作日志</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </li>
    </ul>
    <el-button plain style="width: 100%" v-if="isLoad" @click="setAllLog()"
      >点击加载更早访问日志</el-button
    >
    <p class="text-info" v-else>没有更多了...</p>
    <a ref="downLoadLink"></a>
  </div>
</template>
<script>
import { searchLog, downloadLog } from '@/api/log'
export default {
  data() {
    return {
      allLog: [],
      limit: 100,
      isLoad: true,
      isShow: true,
    }
  },
  watch: {
    size(newVal) {
      this.isShow = !(newVal.isMediumSize || newVal.isSmallSize)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  mounted() {
    this.isShow = !(this.size.isMediumSize || this.size.isSmallSize)
    this.setAllLog()
  },
  methods: {
    async setAllLog() {
      const res = await searchLog({
        limit: this.limit,
      })
      if (res.code === 200) {
        this.allLog = res.data.records
        //将同一日期的放置一处
        let date = ''
        this.allLog.forEach((item) => {
          const d = item.createDate.split('T')[0]
          if (date !== d) {
            item.dateTitle = d //标题内容为
            item.isDateTitle = true //将第一个不一样的日期作为头部标题
            date = d
          } else item.isDateTitle = false
          item.msgStyle = item.status === 200 ? 'text-success' : 'text-error'
        })

        this.isLoad = this.limit <= res.data.total
        this.limit += 50
        this.$refs.logBox.style.opacity = 1
      } else this.$message.error(res.message)
    },
    async downLoadLog(logName) {
      const res = await downloadLog({ limit: 999999, logName })
      //设置下载链接与名称
      const blobUrl = window.URL.createObjectURL(res)
      this.$refs.downLoadLink.href = blobUrl
      this.$refs.downLoadLink.download = logName ? '访问记录.xlsx' : `${logName}的访问记录.xlsx`
      this.$refs.downLoadLink.click()
    },
  },
  filters: {
    isempty(val) {
      if (!val) return '——'
      else return val
    },
    messageFormart(val) {
      if (val === 'SUCCESS') return val
      else {
        return 'ERROR'
      }
    },
    dateFormat(val) {
      const dateTime = val.split('T')[1].split(':')
      return `${dateTime[0]}:${dateTime[1]}`
    },
    dateTitleFormat(val) {
      const date = new Date(val)
      const newDate = new Date()
      const YearAreEqual = date.getFullYear() === newDate.getFullYear()
      const MonthAreEqual = date.getMonth() === newDate.getMonth()
      const dateDay = date.getDate()
      const newDateDay = newDate.getDate()
      const week = ['日', '一', '二', '三', '四', '五', '六']
      const day = `星期${week[date.getDay()]}`
      if (YearAreEqual && MonthAreEqual && dateDay === newDateDay) {
        return `今天  ${day}`
      } else if (YearAreEqual && MonthAreEqual && dateDay + 1 === newDateDay) {
        return `昨天  ${day}`
      }
      return `${val}  ${day}`
    },
  },
}
</script>
<style>
.system-log .log-box {
  color: #555555;
  list-style: none;
  transition: all 1s;
  opacity: 0;
}
.system-log .log {
  clear: both;
  margin: 15px 0;
  text-align: left;
}
.system-log span {
  margin: 8px;
}
.system-log .text-success {
  color: #a2d4a2;
}
.system-log .text-error {
  color: #ff9090;
}
.system-log .text-primary {
  color: rgb(63, 171, 235);
}
.system-log .text-info {
  color: #999999;
}
.system-log .intro {
  color: #666f80;
  width: 70%;
  text-align: left;
  font-size: 14px;
}
</style>