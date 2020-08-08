<template>
  <div class="siae-notice">
    <el-container>
      <el-header>
        <div class="content" :style="{width}">
          <span style="font-size:18px" @click="upOneLevel()">协会公告</span>
          <span v-if="isLoadingDetails" style="margin:0 5px">>&nbsp;{{details.title}}</span>
          <div v-else class="search" ref="search" :style="{width:(searchWidth+25)+'px'}">
            <input
              v-model="title"
              type="text"
              placeholder="请输入标题关键字"
              :style="{width:searchWidth+'px'}"
              @keypress.enter="setAllNotice()"
            />
            <span @click="setAllNotice()">
              <icon name="search" ref="search-icon" scale="20" width="20"></icon>
            </span>
          </div>
        </div>
        <span></span>
      </el-header>
      <div class="el-main" style="padding:0">
        <line-loading :isLoading="isLoadingDetails"></line-loading>
      </div>
      <el-main>
        <div class="content" ref="main-content" :style="{'height':size.maxH-150+'px',width}">
          <notice-details v-if="isLoadingDetails" :notice="details"></notice-details>
          <div v-else>
            <p>
              <span v-if="isSearch">"{{searchData}}",</span>
              <span>共查询到{{total}}条公告</span>
            </p>
            <notice-list :notice="allNotice" @itemClick="noticeDetails"></notice-list>
            <p class="tip" style="text-align:center">
              <span v-if="isLoading">加载中...</span>
              <span v-if="isAllLoad">{{total!==0?'已全部加载':'没有相关公告'}}</span>
            </p>
          </div>
        </div>
      </el-main>
    </el-container>
    <div class="top" v-if="isOpenToTop" @click="toTop()">
      <icon name="top" scale="20" width="20"></icon>
    </div>
  </div>
</template>
<script>
import NoticeList from '@/components/NoticeList'
import { searchAllNotice } from '@/api/notice'
import LineLoading from '@/components/PageLoading/LineLoading'
import NoticeDetails from './components/NoticeDetails'
export default {
  components: { NoticeList, LineLoading, NoticeDetails },
  data() {
    return {
      allNotice: [],
      currPage: 1, //当前页
      limit: 10, //每次展示多少条数据
      title: null, //用于查找的标题
      total: 0, //用于展示搜索到多少项
      time: 0, //计算短时间内多次触发到达底部事件
      scrollTop: -1, //用于计算是否到达底部
      isSearch: false, //是否处于标题查询
      isLoading: false, //是否正在加载数据
      isAllLoad: false, //是否加载完所有数据
      searchData: null, //用于展示的搜索内容
      details: {},
      isLoadingDetails: false,
      isOpenToTop: false,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    width() {
      return this.size.isSmallSize ? '100%' : '70%'
    },
    searchWidth() {
      return this.size.isSmallSize ? 130 : 415
    },
  },
  watch: {
    title(newVal) {
      //取消搜索时需要init的项
      if (!newVal) {
        this.allNotice = []
        this.total = 0
        this.isSearch = false
        this.setAllNotice()
        this.isAllLoad = false
      }
    },
  },
  created() {
    this.setAllNotice()
  },
  mounted() {
    //添加到达底部触发事件
    const elM = this.$refs['main-content']
    elM.onmousewheel = () => {
      if (this.isAllLoad) {
        return
      }
      const newDateTime = new Date().getTime()
      //解决数据未加载前多次调用
      if (this.scrollTop === elM.scrollTop && newDateTime - this.time > 1500) {
        this.currPage++
        this.setAllNotice()
        this.time = newDateTime
      } else this.scrollTop = elM.scrollTop
      if (elM.scrollTop !== 0) this.isOpenToTop = true
      else this.isOpenToTop = false
    }
  },
  methods: {
    async setAllNotice() {
      //查询时init一些数据
      if (this.title) {
        this.currPage = 1
        this.isAllLoad = false
        this.allNotice = []
        this.isSearch = true
        this.searchData = this.title
      }
      //提示用户正在加载中
      this.isLoading = true
      const data = await searchAllNotice(this.currPage, this.limit, this.title)
      if (data.code === 200) {
        const moreData = data.data.records
        //延迟加载，更好的展示正在加载
        setTimeout(() => {
          let arr
          if (this.title) arr = moreData
          else arr = this.allNotice.concat(moreData)
          //判断是否全部加载
          if (arr.length >= data.data.total) this.isAllLoad = true
          if (arr.length <= data.data.total) this.allNotice = arr
          this.total = data.data.total
          this.isLoading = false
        }, 800)
      } else this.$message.error(data.message)
    },
    noticeDetails(notice) {
      this.details = notice
      this.isLoadingDetails = true
      console.log(notice)
    },
    upOneLevel() {
      this.details = {}
      this.isLoadingDetails = false
    },
    toTop() {
      const elM = this.$refs['main-content']
      const toTop = setInterval(() => {
        elM.scrollTop -= 600
        if (elM.scrollTop === 0) clearInterval(toTop)
      }, 50)
    },
  },
}
</script>
<style>
.siae-notice .el-container {
  position: fixed;
  width: 100%;
}
.siae-notice .el-container .el-header {
  color: white;
  display: flex;
  align-items: center;
}
.siae-notice .el-container .el-main {
  background-color: white;
}
.siae-notice .el-container .content {
  margin: auto;
  overflow: auto;
}
.siae-notice .search {
  border: 1px solid #999999;
  border-radius: 15px;
  padding: 3px 10px;
  float: right;
  width: 40%;
}
.siae-notice .search input {
  background: none;
  border: none;
  color: #999999;
}
.siae-notice .top {
  position: absolute;
  right: 100px;
  bottom: 100px;
}
</style>