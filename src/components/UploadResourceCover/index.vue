<template>
  <div class="upload-information_cover">
    <!--自选封面-->
    <el-row :gutter="24">
      <el-col :xs="10" :lg="8">
        <el-upload
          class="avatar-uploader"
          action="http://120.26.177.203/news/picturesUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload"
          :on-progress="handleProgress"
          :headers="token"
          :style="{ width: `${imgWidth}px`, height: `${imgWidth}px` }"
        >
          <img
            v-if="imgUrl"
            :src="imgUrl"
            class="avatar"
            :style="{ width: `${imgWidth}px`, height: `${imgWidth}px` }"
          />
          <i
            v-if="!imgUrl && !isUpload"
            class="el-icon-plus avatar-uploader-icon"
            :style="{ width: `${imgWidth}px`, 'line-height': `${imgWidth}px` }"
          ></i>
          <el-progress
            :width="size.isSmallSize ? 80 : 150"
            :stroke-width="3"
            v-if="!imgUrl && isUpload"
            type="circle"
            :percentage="uploadProgress.percentage"
            :status="uploadProgress.status"
          ></el-progress>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <!--可选封面-->
        <p class="choosable-title">可选</p>
        <img
          :src="imgDataUrl"
          class="choosable-img"
          :style="{ width: `${imgWidth - 25}px`, height: `${imgWidth - 25}px` }"
          @click="uploadCover()"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import token from '@/utils/token'
import imgVerity from '@/utils/verify'
export default {
  name: 'uploadCover',
  props: {
    //父组件传来的封面链接
    imageUrl: {
      type: String,
      default: null,
    },
    //文件类型，用于canvas画入文件类型
    fileType: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      isUpload: false, //是否处于上传状态
      uploadProgress: {
        percentage: 0, //上传进度
        status: null,
      },
      imgUrl: null, //封面链接，用于当前组件设置
      visible: false, //可选封面是否可见，用于可选封面框指向自选封面框
      token: {
        //用于上传封面时携带的token
        'HEADER-TOKEN': '',
      },
      imgDataUrl: '', //用于展示画好的封面
      imgWidth: 0,
    }
  },
  watch: {
    size(newVal) {
      this.imgWidth = newVal.isSmallSize ? 100 : 150
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.getToken()
  },
  mounted() {
    this.setCover()
    this.imgWidth = this.size.isSmallSize ? 100 : 150
    if (this.imageUrl) {
      this.imgUrl = this.imageUrl
    }
  },
  methods: {
    setCover() {
      //画可选封面
      let canvas = document.createElement('canvas')
      canvas.width = 178
      canvas.height = 178
      let ct = canvas.getContext('2d')

    //   let img = document.createElement('img')
    //   img.src = require('@/assets/img/resImg/cover2.png')
    //   img.onload = () => {
        //图片载入时执行画封面，不然可能导致img不显示
        // ct.drawImage(img, 0, 0, 100, 100)
        // ct.drawImage(img, 0, 14, 178, 150)
        ct.fillStyle="#0c3662"
        ct.fillRect(0, 0, 178, 178)
        ct.font = 'bold 25px sans-serif' //设置文字样式
        ct.textAlign = 'center'
        // ct.fillStyle = 'rgb(103,148,249)'
        ct.fillStyle = 'white'

        if (this.fileType) ct.fillText('.'+this.fileType.toUpperCase(), 90, 100)
        const dataURL = canvas.toDataURL('image/jpg') //使用canvas将img转换为dataURL
        this.imgDataUrl = dataURL
    //   }
    },
    getToken: function () {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = token.getHeaderToken()
    },
    imgToFile(img) {
      const dataURL = img.src //使用canvas将img转换为dataURL
      const base64 = {
        dataURL: dataURL,
        type: 'image/jpg',
      } //生成base64对象
      const bytes = window.atob(dataURL.split(',')[1]) //通过atob生成bytes
      const ab = new ArrayBuffer(bytes.length) //生成二进制数据缓冲区
      let ia = new Uint8Array(ab) //8位无符号整型数组
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      const blob = new Blob([ab], {
        type: base64.type,
      }) //生成blob对象
      return new File([blob], `cover.jpg`, {
        type: base64.type,
      }) //生成文件对象
    },
    uploadCover(index) {
      //点击可选封面时，上传封面，并展示
      let img = new Image()
      img.src = this.imgDataUrl
      let file
      img.onload = () => {
        file = this.imgToFile(img) //将本地图片转换为file文件
        let f = new FormData()
        f.append('file', file)
        this.$axios.post('news/picturesUpload', f).then((res) => {
          this.imgUrl = res.data.link
          this.$emit('setLogo', this.imgUrl)
        })
      }
    },
    beforeAvatarUpload(file) {
      const verity = imgVerity(file, ['image/jpeg', 'image/png'], 6, [
        '上传的封面图片只能是 JPG/PNG 格式!',
        '上传的封面图片大小不能超过 6MB!',
      ])
      if (!verity.status) {
        this.$message.error(verity.message)
      } else {
        this.imgUrl = null
        this.isUpload = true
        this.uploadProgress.percentage = 0
        this.uploadProgress.status = null
      }
      return verity.status
    },
    handleProgress(event, file, fileList) {
      //文件上传时调用（会随着文件上传一直被调用）
      this.uploadProgress.percentage = Math.floor((event.loaded / event.total) * 100)
    },
    handleAvatarSuccess(res, file) {
      //当上传成功时，将上传的图片预览展示
      this.uploadProgress.status = 'success'
      this.imgUrl = res.link
      this.$emit('setLogo', this.imgUrl) //将logo链接传给父组件用于保存上传信息
    },
    handleError(res) {
      this.uploadProgress.status = 'exception'
      this.$message.error(`上传失败！${res.message}`) //上传失败时，发出提示。
    },
  },
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  display: block;
}

/*
  设置可选封面样式
*/
.choosable-title {
  margin: 0;
  padding: 0;
  line-height: 23px;
  text-align: left;
  color: #999999;
  font-size: 14px;
}

.choosable-img {
  border-radius: 5px;
}

/*
  设置可选封面标题样式
*/
.el-popover__title {
  color: #888888;
  font-size: 14px;
}
</style>
