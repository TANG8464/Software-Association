<template>
  <div class="notice-edit">
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="18">
        <div>
          <el-input style="margin: 10px 0" v-model="news.title" placeholder="标题"></el-input>
          <edit
            ref="edit"
            v-model="news.content"
            :toolbarButtons="toolbarButtons"
            placeholderText="请在此输入公告内容"
          ></edit>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <el-card class="box-card" style="margin: 10px 0">
          <div slot="header" class="clearfix" style="text-align: left; font-weight: bold">
            <span>操作</span>
          </div>
          <div>
            <eidt-sidebar ref="sidebar" :isTiming.sync="isTiming"></eidt-sidebar>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="padding: 20px 0; width: 100%; clear: both; text-align: right">
      <div>
        <el-button v-if="!isTiming && (!isReEdit || (isReEdit && flag === 1))" @click="putOut(1)"
          >保存草稿</el-button
        >
        <el-button type="primary" @click="putOut(0)" v-if="!isReEdit || (isReEdit && flag != 1)">{{
          isReEdit && flag != 1 ? '保存修改' : '发布公告'
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Edit from '@/components/FroalaEdit'
import EidtSidebar from './components/EidtSidebar'
import { getActiveUserInfo } from '@/api/active-user'
import { searchNoticeById, operatingNotice } from '@/api/notice'
import { BACKSTAGE_ROUTERS } from '@/constant'
export default {
  components: {
    Edit,
    EidtSidebar,
  },
  data() {
    return {
      adminId: null, //当前管理员id
      news: {
        //公告的标题及内容
        title: null,
        content: null,
      },
      operation: {
        //公告的操作部分
        top: 0,
        categoryId: null,
        newsLabel: [],
      },
      isTiming: false, //是否定时发布
      isReEdit: false, //是否重新编辑
      flag: 0, //公告类型(发布，草稿)
      toolbarButtons: [
        //froala编辑器操作栏按钮
        'fontFamily',
        'fontSize',
        'color',
        'bold',
        'italic',
        'underline',
        'strikeThrough',
        '|',
        'subscript',
        'superscript',
        'inlineClass',
        'inlineStyle',
        'paragraphStyle',
        'lineHeight',
        '|',
        'paragraphFormat',
        'align',
        'formatOL',
        'formatUL',
        'outdent',
        'indent',
        'quote',
        'insertLink',
        'insertImage',
        'insertVideo',
        'embedly',
        'insertFile',
        'insertTable',
        '|',
        'emoticons',
        'fontAwesome',
        'specialCharacters',
        'insertHR',
        'selectAll',
        'clearFormatting',
        '|',
        'print',
        'getPDF',
        'spellChecker',
        'help',
        'html',
        'fullscreen',
        '|',
        'undo',
        'redo',
      ],
    }
  },
  async created() {
    //获取当前用户id
    const { data: res } = await getActiveUserInfo()
    this.adminId = res.data.id
    const id = this.$route.query.id //获取重新编辑公告id
    if (!id) return
    this.isReEdit = true
    this.setPage(id)
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (!e) return
      e.retrunValue = '关闭提示'
      return '关闭提示'
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null
  },
  methods: {
    async setPage(id) {
      const res = await searchNoticeById(id)
      if (res.code === 200) {
        const { flag, title, content } = res.data
        this.flag = flag //公告类型
        this.news.title = title //公告标题
        this.$refs.edit.setHtml(content) //公告内容
        //编辑公告的右侧操作栏属性
        this.$refs.sidebar.operation = (({ top, flag, publishTime, newsCategory, newsLabel }) => {
          return {
            top,
            isTiming: flag === 2,
            date: publishTime,
            categoryId: newsCategory.id,
            newsLabel: newsLabel ? newsLabel.split(',') : [],
          }
        })(res.data)
      } else this.$message.error(res.message)
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
          confirmButtonText: '是',
          cancelButtonText: '否',
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
      // console.log(this.news)
      const label = this.operation.newsLabel
      this.operation.newsLabel = label ? label.join(',') : ''
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
      } else method = 'post'
      const res = await operatingNotice(method, uploadData)
      if (res.code === 200) {
        let msg = ''
        if (this.isReEdit) msg = '修改成功'
        if (flag === 1) msg = '保存成功'
        if (!this.isReEdit && flag !== 1) msg = '发布成功'
        this.$message.success(msg)
        this.$router.push(BACKSTAGE_ROUTERS.NOTICE.MENAGE)
      } else this.$message.error(res.message)
    },
  },
}
</script>
