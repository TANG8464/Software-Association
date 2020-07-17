<template>
  <div class="system-log">
    <div style="margin:23px 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item style="font-size:18px;">操作日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="24">
      <el-col :span="24">
        <p class="intro" :style="{'margin':`${maxH*0.02}px 10px`}">记录所有操作日志，防止异常操作的出现，便于核查。</p>
      </el-col>
    </el-row>
    <el-link type="primary" style="float:right;" @click="downLoadLog('')">下载操作日志</el-link>

    <ul
      class="log-box"
      style="list-style:none;"
      ref="logBox"
      :style="{'font-size':(7+maxW*0.005)+'px'}"
    >
      <li
        class="log"
        v-for="item in allLog"
        :key="item.id"
        :style="{'margin':`${maxW*0.01}px 0`}"
        style="clear:both;"
      >
        <el-divider
          content-position="left"
          v-if="item.isDateTitle"
          :style="{'margin':`${maxW*0.1}px 0`}"
        >{{item.dateTitle|dateTitleFormat}}</el-divider>
        <span class="text-info">{{item.createDate|dateFormat}}</span>
        <span class="text-primary">{{item.username|isempty}}</span>
        <span>{{item.operation|isempty}}</span>
        <span v-if="!isMedium&&!isSmall">{{item.url|isempty}}</span>
        <span
          v-if="!isMedium&&!isSmall"
          :class="item.msgStyle"
        >{{item.message|isempty|messageFormart}}</span>
        <span class="text-info" v-if="!isSmall">{{item.ip|isempty}}</span>
        <span class="text-info" style="float:right;">
          <el-dropdown trigger="click" size="mini">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="downLoadLog(item.username)">仅下载此用户的操作日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </li>
    </ul>
    <el-button plain style="width:100%;" v-if="isLoad" @click="setAllLog()">点击加载更早访问日志</el-button>
    <p class="text-info" v-else>没有更多了...</p>
    <a ref="downLoadLink"></a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allLog: [],
      limit: 100,
      isLoad: true,
      maxH: 0,
      maxW: 0,
      isMedium: false,
      isSmall: false
    };
  },
  created() {
    this.setAllLog();
  },
  mounted() {
    this.maxH = this.$parent.$data.maxH;
    this.maxW = this.$parent.$data.maxW;
    this.init();
  },
  watch: {
    "$parent.$data.maxH": function(newVal) {
      this.maxH = newVal;
    },
    "$parent.$data.maxW": function(newVal) {
      this.maxW = newVal;
      this.init();
    }
  },
  methods: {
    init() {
      if (this.maxW < 800) {
        this.isMedium = false;
        this.isSmall = true;
      } else if (this.maxW < 1000) {
        this.isMedium = true;
        this.isSmall = false;
      } else {
        this.isMedium = false;
        this.isSmall = false;
      }
    },
    async setAllLog() {
      try {
        let res = await this.$axios.get("log/page", {
          params: {
            limit: this.limit
          }
        });
        console.log(res);
        if (res.status === 200) {
          if (res.data.code === 200) {
            this.allLog = res.data.data.records;
            let date = "";
            this.allLog.forEach(item => {
              let d = item.createDate.split("T")[0];
              if (date != d) {
                item.dateTitle = d;
                item.isDateTitle = true;
                date = d;
              } else {
                item.isDateTitle = false;
              }
              if (item.status === 200) {
                item.msgStyle = "text-success";
              } else item.msgStyle = "text-error";
            });
            if (this.allLog.length === this.limit) {
              this.isLoad = true;
            } else {
              this.isLoad = false;
            }
            this.limit += 50;
            this.$refs.logBox.style.opacity = 1;
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async downLoadLog(userName) {
      try {
        let res = await this.$axios.get("log/downloadLog", {
          params: {
            limit: 999999,
            logName: userName
          },
          responseType: "blob"
        });
        if (res.status === 200) {
          let blobUrl = window.URL.createObjectURL(res.data);
          this.$refs.downLoadLink.href = blobUrl;
          if (userName != "") {
            this.$refs.downLoadLink.download = `${userName}的访问记录.xlsx`;
          } else {
            this.$refs.downLoadLink.download = `访问记录.xlsx`;
          }
          this.$refs.downLoadLink.click();
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  filters: {
    isempty(val) {
      if (!val) return "——";
      else return val;
    },
    messageFormart(val) {
      if (val === "SUCCESS") return val;
      else {
        return "ERROR";
      }
    },
    dateFormat(val) {
      let dateTime = val.split("T")[1].split(":");
      return `${dateTime[0]}:${dateTime[1]}`;
    },
    dateTitleFormat(val) {
      let date = new Date(val);
      let newDate = new Date();
      let dateYear = date.getFullYear();
      let dateMonth = date.getMonth();
      let dateDay = date.getDate();
      let newDateYear = newDate.getFullYear();
      let newDateMonth = newDate.getMonth();
      let newDateDay = newDate.getDate();
      let day = "星期";
      switch (date.getDay()) {
        case 0:
          day += "日";
          break;
        case 1:
          day += "一";
          break;
        case 2:
          day += "二";
          break;
        case 3:
          day += "三";
          break;
        case 4:
          day += "四";
          break;
        case 5:
          day += "五";
          break;
        case 6:
          day += "六";
          break;
      }
      if (
        dateYear === newDateYear &&
        dateMonth === newDateMonth &&
        dateDay === newDateDay
      ) {
        return `今天  ${val}  ${day}`;
      } else if (
        dateYear === newDateYear &&
        dateMonth === newDateMonth &&
        dateDay + 1 === newDateDay
      ) {
        return `昨天  ${val}  ${day}`;
      }
      return `${val}  ${day}`;
    }
  }
};
</script>
<style scoped>
ul {
  color: #555555;
}
.log-box {
  transition: all 1s;
  opacity: 0;
}
.log {
  margin: 15px 0;
  text-align: left;
}
span {
  margin: 8px;
}
.text-success {
  color: #a2d4a2;
}
.text-error {
  color: #ff9090;
}
.text-primary {
  color: rgb(63, 171, 235);
}
.text-info {
  color: #999999;
}
.intro {
  color: #666f80;
  width: 70%;
  text-align: left;
  font-size: 14px;
}
</style>