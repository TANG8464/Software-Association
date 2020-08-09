<template>
  <div class="notice-edit">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="18">
        <div>
          <el-input style="margin:10px 0;" v-model="news.title" placeholder="标题"></el-input>
          <edit ref="edit" v-model="news.content"></edit>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <el-card class="box-card" style="margin:10px 0;">
          <div slot="header" class="clearfix" style="text-align:left;font-weight:bold;">
            <span>操作</span>
          </div>
          <div>
            <eidt-sidebar ref="sidebar" :isTiming.sync="isTiming"></eidt-sidebar>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="padding:20px 0;width:100%;clear:both;text-align:right;">
      <div>
        <el-button v-if="!isTiming&&(!isReEdit||(isReEdit&&flag===1))" @click="putOut(1)">保存草稿</el-button>
        <el-button
          type="primary"
          @click="putOut(0)"
          v-if="!isReEdit ||(isReEdit&&flag != 1) "
        >{{isReEdit && flag != 1 ? "保存修改" : "发布公告"}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Edit from '@/components/FroalaEdit'
import EidtSidebar from './components/EidtSidebar'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  components: {
    Edit,
    EidtSidebar,
  },
  data() {
    return {
      adminId: null,
      news: {
        title: null,
        content: null,
      },
      operation: {
        top: 0,
        categoryId: null,
        newsLabel: [],
      },
      isTiming: false,
      isReEdit: false,
      flag: 0,
    }
  },
  created() {
    //获取当前用户id
    getActiveUserInfo().then((res) => {
      const { data } = res
      this.adminId = data.data.id
    })
    let id = this.$route.query.id //获取重新编辑公告id
    if (id) {
      this.isReEdit = true
      this.setPage(id)
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.retrunValue = '关闭提示'
      }
      return '关闭提示'
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
  methods: {
    async setPage(id) {
      const { data } = await this.$axios.get('news/' + id)
      if (data.code === 200) {
        this.flag = data.data.flag //公告类型

        this.news.title = data.data.title //公告标题
        this.$refs.edit.setHtml(data.data.content) //公告内容

        const operation = {
          //公告操作
          top: data.data.top,
          isTiming: data.data.flag === 2,
          date: data.data.publishTime,
          categoryId: data.data.newsCategory.id,
          newsLabel: data.data.newsLabel ? data.data.newsLabel.split(',') : [],
        }
        this.$refs.sidebar.operation = operation
      } else {
        this.$message.error({
          message: data.message,
        })
      }
    },
    async putOut(flag) {
      this.operation = this.$refs.sidebar.operation //操作数据
      const isTiming = this.operation.isTiming //是否开启定时上传
      const timeDifference = isTiming
        ? new Date(this.operation.date).getTime() - new Date().getTime()
        : 5 * 60 * 1000 //计算定时上传时间距离当前时间
      let isTimingUpload = false //是否定时上传
      if (!isTiming) isTimingUpload = false
      else if (timeDifference < 5 * 60 * 1000) {
        await this.$confirm('定时发布时间过于接近当前时间是否立即发布', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {})
          .catch(() => {
            isTimingUpload = true
          })
      } else isTimingUpload = true

      if (isTimingUpload) {
        this.uploadNotice(2, this.operation.date)
      } else {
        this.uploadNotice(flag, null) //如果非定时发送公告，则直接上传
      }
    },
    async uploadNotice(flag, publishTime) {
      this.operation.newsLabel = this.operation.newsLabel.join(',')
      const uploadData = Object.assign(
        this.operation,
        this.news,
        { adminId: this.adminId },
        { publishTime },
        { flag }
      )
      //判断是修改还是发布
      let method = null
      if (this.isReEdit) {
        method = 'put'
        uploadData.newsId = this.$route.query.id
      } else {
        method = 'post'
      }
      let { data } = await this.$axios('news/', {
        method: method,
        data: uploadData,
      })
      if (data.code === 200) {
        let msg = ''
        if (this.isReEdit) msg = '修改成功'
        if (!this.isReEdit && flag === 1) msg = '保存成功'
        if (!this.isReEdit && flag !== 1) msg = '发布成功'

        this.$message.success(msg)
        this.$router.push('/backstage/notice/manage')
      } else {
        this.$message.error(data.message)
      }
    },
  },
}
</script>

