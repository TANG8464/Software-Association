<template>
  <div class="resUpload-upload_frame">
    <div v-if="!uploadProgress.isUpload">
      <div style="margin:20px 0;text-align:left;">
        <span>选择存放位置：</span>
        <p>
          <el-radio v-model="serverType" label="1">本地服务器</el-radio>
          <el-radio v-model="serverType" label="2">七牛云</el-radio>
        </p>
      </div>
      <!--上传资源入口-->
      <el-upload
        class="upload-demo"
        drag
        :action="serverLink[serverType]"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :before-upload="beforeAvatarUpload"
        :data="data[serverType]"
        :headers="headers"
      >
        <div class="el-default" :style="{'padding':`${size.maxH*0.08}px ${size.maxW*0.12}px`}">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </div>
        <div class="el-upload__tip" slot="tip">为节省服务器资源请尽量上传容量小的文件，最大不可超过5GB（尽量选择本地服务器，七牛云作为备用存储）</div>
      </el-upload>
    </div>

    <!--上传时进度条-->
    <div v-else style="text-align:left;">
      <el-row :gutter="24" style="display:flex;align-items:flex-end;">
        <el-col :xs="6" :lg="3">
          <icon name="resource" scale="60" width="60"></icon>
        </el-col>
        <el-col :xs="18" :lg="21">
          <p>
            <span
              v-text="data['2'].key"
              :style="{'display':size.isSmallSize?'block':'inline'}"
              style="margin: 0 3px;"
            ></span>
            <small
              class="progress_tip"
              v-text="toVisualFileSize(uploadProgress.loaded)+'/'+toVisualFileSize(uploadProgress.fsize)"
            ></small>
            <small
              class="progress_tip"
              v-if="uploadProgress.percentage!=100"
              v-text="toVisualFileSize(uploadProgress.nSpeed)"
            ></small>
            <small class="progress_tip" v-text="uploadProgress.tip"></small>
          </p>
          <el-progress :percentage="uploadProgress.percentage" :status="uploadProgress.status"></el-progress>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import token from '@/utils/token'
export default {
  data() {
    return {
      //存储位置
      serverType: '1',
      //上传凭证
      data: {
        //本地
        '1': {
          filekey: '',
        },
        //七牛云
        '2': {
          key: '',
          token: '',
        },
      },
      //上传到本地服务器需要用到的headers
      headers: {},
      //上传的链接地址，本地和七牛云
      serverLink: {
        '1': 'http://120.26.177.203/resources/upload/local',
        '2': 'http://upload-z2.qiniup.com',
      },
      //上传进度
      uploadProgress: {
        isUpload: false, //是否执行上传
        percentage: 0, //上传进度百分比
        loaded: 0, //已上传大小
        // byteloaded:0,//已上传字节
        nSpeed: 0, //上传网速
        status: null, //上传状态图标
        tip: '上传中', //上传文字提示
        fsize: '',
      },
    }
  },
  watch: {
    serverType(newVal) {
      //将存储类型传给父组件
      this.$emit('update:serverType', newVal)
      //判断是否携带headers
      if (newVal === '1') {
        this.headers = {
          'HEADER-TOKEN': token.getHeaderToken(),
        }
      } else {
        this.headers = {}
      }
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    //页面载入前获取七牛云上传凭证
    this.getQiniuToken()
  },
  methods: {
    dataInit() {
      Object.assign(this.$data, this.$options.data()) //重设data为初始值
      this.getQiniuToken()
    },
    getQiniuToken() {
      //获取七牛云上传凭证
      let nowDate = new Date()
      let month = nowDate.getMonth() + 1
      if (month < 10) month = '0' + month
      //生成临时文件名
      let fileName = `${nowDate.getFullYear()}${month}${nowDate.getDate()}${nowDate.getHours()}${nowDate.getMinutes()}${nowDate.getSeconds()}`
      this.data['1'].fileKey = fileName
      this.headers = {
        'HEADER-TOKEN': token.getHeaderToken(),
      }
      this.data['2'].key = fileName
      this.$emit('update:resourceName', fileName) //传递临时文件名给父组件
      this.$axios
        .get('resources/token', {
          params: {
            fileKey: fileName,
          },
        })
        .then((res) => {
          this.data['2'].token = res.data.data
        })
    },
    toVisualFileSize(fsize) {
      //变为可视性的文件大小
      let size
      let unit = 1024 * 1024 * 1024 //1GB
      let pos
      if (fsize > unit) {
        size = fsize / unit
        pos = 'GB'
      } else {
        unit /= 1024 //1MB
        if (fsize > unit) {
          size = fsize / unit
          pos = 'MB'
        } else {
          unit /= 1024 //1KB
          if (fsize > unit) {
            size = fsize / unit
            pos = 'KB'
          } else {
            unit /= 1024 //1B
            size = fsize / unit
            pos = 'B'
          }
        }
      }
      return size.toFixed(2) + pos
    },
    beforeAvatarUpload: function (file) {
      let filenameArr = file.name.split('.')
      let fileType = filenameArr[filenameArr.length - 1] //文件类型
      this.$emit('update:fileType', fileType) //将文件类型传给父组件,用作绘制封面
      let size = 1024 * 1024 * 1024 * 5 //1GB
      if (file.size < size) {
        this.uploadProgress.isUpload = true //上传资源前，设置是否执行上传为true
        return true
      } else {
        this.$message.warning('上传文件已达到最大限制,不可超过5GB')
        return false
      }
    },
    handleProgress(event, file, fileList) {
      //文件上传时调用（会随着文件上传一直被调用）
      this.uploadProgress.fsize = event.total //存储文件大小,用于展示
      this.uploadProgress.nSpeed = event.loaded - this.uploadProgress.loaded
      this.uploadProgress.loaded = event.loaded //计算已上传文件大小
      this.uploadProgress.percentage = Math.floor((event.loaded / event.total) * 100)
    },
    handleAvatarSuccess: function (res, file) {
      if (res.code === 200) {
        this.uploadProgress.status = 'success'
        this.uploadProgress.tip = '上传成功'
        this.$emit('uploadScs')
      } else {
        this.$message.error(res.message)
      }
    },
    handleError: function (res) {
      this.uploadProgress.status = 'exception'
      this.uploadProgress.tip = '上传失败'
      setTimeout(() => {
        this.uploadProgress.isUpload = false
        this.uploadProgress.status = null
        this.uploadProgress.tip = ''
      }, 1000)
      this.$message({
        message: '上传失败',
        duration: 2000,
        type: 'warning',
      })
    },
  },
}
</script>

<style>
.el-upload-dragger {
  width: 100%;
  height: 100%;
}
.resUpload-upload_frame {
  margin: 30px auto;
}
/*
给进度提示加样式
*/
.progress_tip {
  color: #999999;
  margin: 0 3px;
  font-size: 14px;
}
</style>