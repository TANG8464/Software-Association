<template>
  <div class="notice-manage">
    <div style="width:100%">
      <div style="float:right;">
        <router-link to="/backstage/notice/edit" tag="div" class="operationBtn">
          <el-button type="primary" round style="padding:9px 15px;">
            <i class="el-icon-edit"></i>
            写个公告
          </el-button>
        </router-link>
        <el-input
          style="min-width:200px;width:35%; float:left;margin:10px 0;"
          v-model="state"
          size="small"
          placeholder="请输入标题搜索"
        ></el-input>
      </div>
    </div>
    <div style="width:100%;clear:both;">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="badge" v-if="draftBadge!==0">{{draftBadge}}</div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="已发布" name="0"></el-tab-pane>
            <el-tab-pane label="定时发布" name="2"></el-tab-pane>
            <el-tab-pane label="草稿箱" name="1"></el-tab-pane>
            <notice-data
              ref="newsData"
              @setDraftBadge="setDraftBadge"
            ></notice-data>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import NoticeData from './components/NoticeData'
export default {
  components: {
    NoticeData
  },
  data() {
    return {
      draftBadge: 0,
      activeName: '0',
      activeFlag: 0,
      timingFlag: 0,
      allSort: '',
      restaurants: [],
      state: '',
      timeout: null
    }
  },
  created() {
    this.setDraftBadge()
    this.setAllSort()
  },
  watch: {
    state: function(newVal) {
      this.title = newVal
      this.setNotice(this.activeFlag)
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    }
  },
  methods: {
    setNotice(index) {
      this.$refs.newsData.newsFlag = index
      this.$refs.newsData.title = this.title
      this.$refs.newsData.setNotice()
    },
    setAllSort() {
      this.$axios('newscategory/', {
        method: 'get'
      }).then(res => {
        this.allSort = res.data.data.records
      })
    },
    //设置草稿总条数
    async setDraftBadge() {
      let res = await this.$axios.get('news/', {
        credentials: 'include',
        params: {
          newsFlag: 1,
          pageNo: 1,
          title: ''
        }
      })
      if (res.data.code === 200) {
        this.draftBadge = res.data.data.total
        if (this.draftBadge > 99) this.draftBadge = '99+'
      } else {
        this.$message.error({
          message: res.data.message
        })
      }
    },
    openEdit() {
      this.$parent.openEdit()
    },
    handleClick(tab) {
      this.activeFlag = Number(tab.name)
      this.setNotice(this.activeFlag)
    },
    createStateFilter(queryString) {
      return state => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelect(item) {}
  }
}
</script>
<style scoped>
.operationBtn {
  float: left;
  margin: 8px;
}
.badge {
  width: 15px;
  height: 15px;
  background-color: #409eff;
  font-size: 12px;
  position: absolute;
  left: 265px;
  border-radius: 50%;
  padding: 3px;
  color: white;
  z-index: 9;
  text-align: center;
}
</style>

