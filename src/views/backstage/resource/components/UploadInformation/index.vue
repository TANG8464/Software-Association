<template>
  <div class="resUpload-upload_information">
    <h3>基本信息</h3>
    <p class="info-title">
      <span style="color:red;margin:0;font-size:18px;">*</span>
      <span>上传封面:</span>(格式jpeg、png，文件大小≤6MB，建议尺寸≥178px*178px)
    </p>
    <upload-cover
      @setLogo="setLogo"
      :imageUrl="res.resourceLogo"
      :isOpenSelectable="true"
      :fileType="fileType"
    ></upload-cover>
    <p class="info-title" style="clear:both;">
      <span style="color:red;margin:0;font-size:18px;">*</span>
      <span>作者：</span>
    </p>
    <p>
      <el-radio v-model="author" label="1">本人</el-radio>
      <el-radio v-model="author" label="2">他人</el-radio>
    </p>
    <el-input v-model="res.author" placeholder="请输入作者姓名" v-if="author==='2'"></el-input>
    <p class="info-title" style="clear:both;">
      <span style="color:red;margin:0;font-size:18px;">*</span>
      <span>资源名称:</span>
    </p>
    <el-input v-model="res.resourceName" placeholder="键入资源名称"></el-input>
    <p class="info-title" style="clear:both;">
      <span style="color:red;margin:0;font-size:18px;">*</span>
      <span>资源类别:</span>
    </p>
    <el-select v-model="res.resourceCategoryID" placeholder="请选择">
      <el-option
        v-for="item in resourceCategory"
        :key="item.id"
        :label=" item.resourceCategoryName"
        :value="item.id"
      ></el-option>
    </el-select>
    <p class="info-title" style="clear:both;">
      <span style="color:red;margin:0;font-size:18px;">*</span>
      <span>是否可下载:</span>
    </p>
    <el-switch v-model="res.status"></el-switch>
    <p class="info-title" style="clear:both;">
      <span>资源描述:</span>
    </p>
    <el-input
      type="textarea"
      placeholder="输入更多资源信息"
      v-model="res.description"
      maxlength="30"
      show-word-limit
      resize
      rows="4"
    />
    <div style="margin: 10px;">
      <el-button type="primary" plain @click="uploadResInfo()">
        <i class="el-icon-upload"></i> 立即上传
      </el-button>
      <!--取消上传提示-->
      <el-popover placement="top" width="160" v-model="isOpenClearTip">
        <p>
          <i class="el-icon-info" style="color:red"></i> 取消后将不会保留您输入的数据
        </p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="isOpenClearTip = false">点错了</el-button>
          <el-button type="primary" size="mini" @click="clearUpload()">好的</el-button>
        </div>
        <el-button slot="reference" type="text" style="color:#666666;" round>取消上传</el-button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import UploadCover from '@/components/UploadResourceCover'
export default {
  components: {
    UploadCover
  },
  data() {
    return {
      author: '1', //用于判定选择为本人还是他人
      res: {
        //上传给服务器的数据
        resourceName: '',
        author: null,
        fileKey: '',
        type: '1', //存储类型
        resourceCategoryID: null, //分类id
        resourceLogo: null, //封面地址
        status: true, //是否可下载
        description: null //其他描述
      },
      resourceCategory: [], //所有分类
      isOpenClearTip: false //是否打开取消上传提示
    }
  },
  props: {
    resName: {
      //上传时的key作为默认资源名称
      type: String,
      default: ''
    },
    serverType: {
      //上传时选择的存储类型
      type: String,
      default: '1'
    },
    fileType: {
      //文件类型
      type: String,
      default: ''
    }
  },
  created() {
    this.setResSort()
    this.res.resourceName = this.resName
    this.res.fileKey = this.resName
  },
  methods: {
    setLogo(val) {
      //设置上传资源封面链接
      this.res.resourceLogo = val
    },
    async setResSort() {
      //设置展示的分类
      let { data } = await this.$axios.get('resocategory/page', {
        params: {
          limit: 1000
        }
      })
      if (data.code === 200) {
        this.resourceCategory = data.data.records
      } else {
        this.$message.error({
          message: data.message
        })
      }
    },
    async uploadResInfo() {
      //上传资源信息
      this.res.type = this.serverType
      if (this.author === '1') {
        //设置本人用户名
        if (!this.$cookies.get('activeUser')) {
          //如果cookies被恶意清除了则加上
          await this.$axios.get('member/info').then(res => {
            this.$cookies.set('activeUser', res.data.data.id + '&' + res.data.data.memberName)
          })
        }
        this.res.author = this.$cookies.get('activeUser').split('&')[1]
      }
      const { data } = await this.$axios.post('resources/', this.res)
      if (data.code === 200) {
        this.$message.success({
          message: '上传成功'
        })
        this.$emit('init')
      } else {
        this.$message.error({
          message: data.message
        })
      }
    },
    async clearUpload() {
      //取消上传
      const { data } = await this.$axios.delete('resources/cancel', {
        params: { key: this.res.fileKey, type: this.serverType }
      })
      if (data.code === 200) {
        this.$emit('init')
      } else {
        this.$message.error({
          message: data.message
        })
      }
    },
    $_handleUnload(e) {
      e = e || window.event
      console.log(e)
      if (e) {
        e.retrunValue = '关闭提示'
      }
      return '关闭提示'
    }
  },
  mounted() {
    //离开监听
    window.addEventListener('beforeunload', this.$_handleUnload)
    window.addEventListener('unload', () => {
      this.clearUpload()
    })
  },
  //data已经更新，但还未同步到页面
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  //实例处于销毁状态，但是data,methods还处于可用状态
  beforeDestory() {
    window.removeEventListener('beforeunload', this.$_handleUnload)
    window.removeEventListener('unload')
  }
}
</script>
<style>
.resUpload-upload_information {
  text-align: left;
}
.info-title {
  color: #888888;
  font-size: 13px;
}
.info-titlespan {
  color: #666666;
  font-size: 16px;
  margin: 10px;
}
.el-input {
  margin: 15px 0;
}
</style>