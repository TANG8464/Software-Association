<template>
  <div class="notice-manage">
    <div style="width: 100%">
      <div style="float: right">
        <el-select size="small" v-model="categoryId" style="width: 120px">
          <el-option label="所有分类" :value="-1"></el-option>
          <el-option
            v-for="item in categoryData"
            :key="item.id"
            :label="item.newsCategoryName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          style="width: 200px; margin: 8px"
          v-model="title"
          size="small"
          placeholder="请输入标题搜索"
        ></el-input>
      </div>
    </div>
    <div style="width: 100%; clear: both">
      <el-row :gutter="24">
        <el-col :span="24">
          <div style="position: absolute; right: 0; z-index: 9999">
            <router-link :to="editPage" tag="span" class="operationBtn">
              <el-link type="primary" style="margin: 9px 15px">
                <i class="el-icon-edit"></i>
                写个公告
              </el-link>
            </router-link>
          </div>
          <div class="badge" v-if="draftBadge !== 0">{{ draftBadge }}</div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="已发布" name="0"></el-tab-pane>
            <el-tab-pane label="定时发布" name="2"></el-tab-pane>
            <el-tab-pane label="草稿箱" name="1"></el-tab-pane>
            <notice-data ref="newsData" @setDraftBadge="setDraftBadge"></notice-data>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import NoticeData from './components/NoticeData'
import { searchAllNotieCategiry } from '@/api/notice/category'
import { adminSearchAllNotice } from '@/api/notice'
import { BACKSTAGE_ROUTERS } from '@/constant'
export default {
  components: {
    NoticeData,
  },
  data() {
    return {
      draftBadge: 0, //草稿数量
      activeName: '0', //活动菜单
      timingFlag: 0, //是否定时
      categoryData: '', //所有分类
      timeout: null,
      title: '',
      categoryId: -1,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    editPage() {
      return BACKSTAGE_ROUTERS.NOTICE.EDIT
    },
  },
  watch: {
    title(newVal) {
      this.setNotice(Number(this.activeName))
    },
    categoryId() {
      this.setNotice(Number(this.activeName))
    },
  },
  created() {
    this.setDraftBadge()
    this.setCategoryData()
  },
  methods: {
    setNotice(index) {
      this.$refs.newsData.newsFlag = index
      this.$refs.newsData.title = this.title
      this.$refs.newsData.categoryId = this.categoryId
      this.$refs.newsData.setNotice()
    },
    async setCategoryData() {
      const res = await searchAllNotieCategiry({
        limit: 1000,
      })
      if (res.code === 200) {
        this.categoryData = res.data.records
      } else this.$message.error(res.message)
    },
    //设置草稿总条数
    async setDraftBadge() {
      const res = await adminSearchAllNotice({
        newsFlag: 1,
        currPage: 1,
        title: '',
      })
      if (res.code === 200) {
        this.draftBadge = res.data.total
        if (this.draftBadge > 99) this.draftBadge = '99+'
      } else this.$message.error(res.message)
    },
    openEdit() {
      this.$parent.openEdit()
    },
    handleClick(tab) {
      this.setNotice(Number(tab.name))
    },
    createStateFilter(queryString) {
      return (state) => state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    },
  },
}
</script>

<style lang="scss" scoped>
.notice-manage {
  .search-input {
    min-width: 200px;
    width: 35%;
    float: left;
    margin: 10px 0;
  }
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
}
</style>
<style lang="scss">
.notice-manage {
  .el-table .cell {
    line-height: normal !important;
  }
}
</style>