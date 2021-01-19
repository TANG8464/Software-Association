<template>
  <div class="newsData remove" ref="newsData">
    <el-table
      :data="noticeData"
      style="width: 100%; min-height: 500px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column
        v-if="isShowDels"
        fill="#fbc4c4"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column label="标题" show-overflow-tooltip align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.isTop" class="badge" :class="scope.row.topBadge.type">{{
            scope.row.topBadge.label
          }}</span>
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" width="80" align="center" v-if="!isSmall">
        <template slot-scope="scope">
          <span v-if="scope.row.newsCategory">{{ scope.row.newsCategory.newsCategoryName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签" width="300" align="center" v-if="!isMedium && !isSmall">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              size="medium"
              style="margin: 0 3px"
              v-for="tag in scope.row.Label"
              :key="tag.id"
              :type="tag.type"
              >{{ tag.name }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!isSmall" label="发布日期" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" v-if="scope.row.flag != 1"></i>
          <span>{{ date(scope.row) | timeFormat(scope.row.flag) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="150">
        <template slot="header">
          <el-button
            type="danger"
            size="mini"
            round
            plain
            v-if="!isShowDels"
            @click="isShowDels = true"
          >
            <i class="el-icon-delete"></i>
            批量删除
          </el-button>
          <div v-if="isShowDels">
            <el-button type="danger" size="mini" round plain @click="deleteNotice(dels)"
              >确认</el-button
            >
            <el-button type size="mini" round plain @click="isShowDels = false">取消</el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="putOutNotice(scope.row)" v-if="scope.row.flag != 0">
                <i class="el-icon-s-promotion" style="font-size: 20px"></i>立即发布
              </el-dropdown-item>
              <el-dropdown-item @click.native="reEditNotice(scope.row.id)">
                <i class="el-icon-edit" style="font-size: 20px"></i>重新编辑
              </el-dropdown-item>
              <el-dropdown-item @click.native="deleteNotice(scope.row.id)">
                <i class="el-icon-delete" style="font-size: 20px"></i>删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <paging style="float: right" ref="paging" :paging="paging" @cutPage="cutPage"></paging>
  </div>
</template>

<script>
import paging from '../NoticeDataPading'
import { adminSearchAllNotice, deleteNotice, publishNotice } from '@/api/notice'
import { BACKSTAGE_ROUTERS } from '@/constant'
export default {
  components: {
    paging,
  },
  data() {
    return {
      noticeData: [], //所有公告
      loading: true, //是否载入中
      //分页参数
      paging: {
        limit: 10,
        pageNo: 1,
        totalPage: 0,
        totalCount: 0,
      },
      newsFlag: 0, //是否为草稿
      title: '', //搜索标题
      categoryId: null, //分类id
      timingFlag: 0, //是否未发布
      isShowDels: false, //是否点击批量删除
      dels: [], //删除项
      isCheckedAll: false, //是否全选
    }
  },
  watch: {
    isCheckedAll: function (newVal) {
      //监听全选
      if (newVal) {
        this.noticeData.forEach((item) => {
          this.dels.push(item.id)
        })
      } else this.dels = []
    },
  },
  computed: {
    isMedium() {
      return this.$store.state.resize.isMediumSize
    },
    isSmall() {
      return this.$store.state.resize.isSmallSize
    },
  },
  created() {
    this.setNotice()
  },
  methods: {
    cutPage(val) {
      this.paging.pageNo = val
      this.setNotice()
    },
    date(row) {
      const map = [row.deplDate, '——', row.publishTime]
      return map[row.flag]
    },
    checkedAll() {
      this.isCheckedAll = !this.isCheckedAll
    },
    async setNotice() {
      //设置所有公告
      this.loading = true //开启载入中动画
      const [newsFlag, currPage, title, limit, categoryId] = [
        this.newsFlag,
        this.paging.pageNo,
        this.title,
        this.paging.limit,
        this.categoryId,
      ]
      const res = await adminSearchAllNotice({ newsFlag, currPage, title, limit: 10, categoryId })

      if (res.code === 200) {
        //延时，为了展示载入动画
        setTimeout(() => {
          this.noticeData = res.data.records
          if (this.noticeData && this.noticeData.length !== 0) {
            this.noticeData.forEach(function (item) {
              const topBadgeMap = [
                {},
                { type: 'badge-primary', label: '置顶' },
                { type: 'badge-danger', label: '高级置顶' },
              ]
              //置顶样式
              if (item.top !== 0) {
                item.isTop = true
                item.topBadge = topBadgeMap[item.top]
              } else item.isTop = false
              //标签样式
              if (item.newsLabel) {
                let l = item.newsLabel.split(',')
                for (let i = 0; i < l.length; i++) {
                  const p = { id: i, name: l[i], type: '' }
                  l[i] = p
                }
                item.Label = l
              }
            })
          }
          const { size, current, pages, total } = res.data
          //分页数据
          this.paging = { pageSize: size, pageNo: current, totalPage: pages, totalCount: total }
          this.loading = false //加载动画
        }, 800)
      }
    },
    //重新编辑公告
    reEditNotice(id) {
      this.$router.push({
        path: BACKSTAGE_ROUTERS.NOTICE.EDIT,
        query: { id },
      })
    },
    //删除提示
    deleteNotice(dels) {
      let ids = []
      if (Array.isArray(dels)) {
        dels.forEach((item) => {
          ids.push(item.id)
        })
      } else ids.push(dels)

      if (ids.length <= 0) {
        this.$message({
          type: 'warnning',
          message: '您还没有选择删除项哦',
          customClass: 'noChecked',
        })
        return
      }
      this.$confirm(`此操作将永久删除这${ids.length}条公告, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.del(ids)
        })
        .catch(() => {})
    },
    //删除公告
    async del(ids) {
      const res = await deleteNotice(ids)
      if (res.code === 200) {
        if (!Array.isArray(ids)) {
          //解决批量删除时选中已被删除项
          const index = this.dels.indexOf(ids)
          if (index !== -1) this.dels.splice(index, 1)
          this.$message.success('删除成功')
        }
        this.isShowDels = false
        this.setNotice()
        this.$emit('setDraftBadge')
      } else this.$message.error(res.message)
    },
    //立即发布功能
    async putOutNotice(row) {
      const res = await publishNotice(row.id)
      if (res.code === 200) {
        this.$message.success('发布成功')
        this.setNotice()
        this.$emit('setDraftBadge')
      } else this.$message.error(res.message)
    },
    //批量删除的选择功能
    handleSelectionChange(val) {
      this.dels = val
    },
  },
  filters: {
    //定时发布的发布样式
    timeFormat(val, flag) {
      if (flag === 2) {
        const date = new Date(val) //转换成日期格式
        const formatNum = (val) => (val < 9 ? '0' + val : val)
        const month = formatNum(date.getMonth() + 1)
        const day = formatNum(date.getDate())
        const hours = formatNum(date.getHours())
        const minutes = formatNum(date.getMinutes())
        const seconds = formatNum(date.getSeconds())
        return `预计${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}发送`
      } else return val
    },
  },
}
</script>

<style lang="scss">
.newsData {
  margin: 0 10px;
  transition: all 0.5s;
  /*
置顶样式
*/

  .badge {
    margin: 0 3px;
    border-radius: 5px;
    padding: 3px;
    font-size: 12px;
  }

  .badge-primary {
    background-color: #409eff;
    color: white;
  }

  .badge-danger {
    background-color: #f56c6c;
    color: white;
  }
}
</style>
