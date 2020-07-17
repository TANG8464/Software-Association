<template>
  <div class="upload-information_cover">
    <el-popover
      placement="right"
      v-if="isOpenSelectable"
      title="可选封面"
      trigger="manual"
      v-model="visible"
    >
      <div>
        <!--可选封面-->
        <ul style="list-style:none;">
          <li style="float:left;">
            <img :src="imgDataUrl" class="choosable-img" @click="uploadCover()" />
          </li>
        </ul>
      </div>
      <!--自选封面-->
      <div style="float:left;" slot="reference" @click="visible=true" v-autoClick>
        <el-upload
          class="avatar-uploader"
          action="http://120.26.177.203/news/picturesUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleError"
          :before-upload="beforeAvatarUpload"
          :on-progress="handleProgress"
          :headers="token"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-if="!imgUrl&&!isUpload" class="el-icon-plus avatar-uploader-icon"></i>
          <el-progress
            :width="178"
            :stroke-width="3"
            v-if="!imgUrl&&isUpload"
            type="circle"
            :percentage="uploadProgress.percentage"
            :status="uploadProgress.status"
          ></el-progress>
        </el-upload>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isUpload: false, //是否处于上传状态
      uploadProgress: {
        percentage: 0, //上传进度
        status: null
      },
      imgUrl: null, //封面链接，用于当前组件设置
      visible: false, //可选封面是否可见，用于可选封面框指向自选封面框
      token: {
        //用于上传封面时携带的token
        "HEADER-TOKEN": ""
      },
      imgDataUrl: "" //用于展示画好的封面
    };
  },
  props: {
    //父组件传来的封面链接
    imageUrl: {
      type: String,
      default: null
    },
    //是否展示可选封面，用于解决页面关闭时，可选封面不关闭
    isOpenSelectable: {
      type: Boolean,
      default: false
    },
    //文件类型，用于canvas画入文件类型
    fileType: {
      type: String,
      default: ""
    }
  },
  created() {
    this.getToken();
    this.setCover();
  },
  mounted() {
    if (this.imageUrl) {
      this.imgUrl = this.imageUrl;
      console.log(this.imageUrl);
    }
  },
  methods: {
    setCover() {
      //画可选封面
      let canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      let ct = canvas.getContext("2d");
      let img = document.createElement("img");
      img.src = require("@/assets/img/resImg/cover.jpg");
      let _this = this;
      img.onload = function () {
        //图片载入时执行画封面，不然可能导致img不显示
        ct.drawImage(img, 0, 0, 100, 100);
        ct.font = "bold 30px sans-serif"; //设置文字样式
        ct.textAlign = "center";
        ct.fillStyle = "rgb(103,148,249)";
        ct.fillText(_this.fileType.toUpperCase(), 42, 96);
        let dataURL = canvas.toDataURL("image/jpg"); //使用canvas将img转换为dataURL
        _this.imgDataUrl = dataURL;
        console.log(_this.imgDataUrl);
      };
    },
    getToken: function () {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token["HEADER-TOKEN"] = localStorage.getItem("HEADER_TOKEN");
    },
    imgToFile(img) {
      let dataURL = img.src; //使用canvas将img转换为dataURL
      let base64 = {
        dataURL: dataURL,
        type: "image/jpg"
      }; //生成base64对象
      let bytes = window.atob(dataURL.split(",")[1]); //通过atob生成bytes
      let ab = new ArrayBuffer(bytes.length); //生成二进制数据缓冲区
      let ia = new Uint8Array(ab); //8位无符号整型数组
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      let blob = new Blob([ab], { type: base64.type }); //生成blob对象
      return new File([blob], `cover.jpg`, { type: base64.type }); //生成文件对象
    },
    uploadCover(index) {
      //点击可选封面时，上传封面，并展示
      let img = new Image();
      img.src = this.imgDataUrl;
      let file;
      let _this = this;
      img.onload = function () {
        file = _this.imgToFile(img); //将本地图片转换为file文件
        let f = new FormData();
        f.append("file", file);
        _this.$axios.post("news/picturesUpload", f).then(res => {
          console.log(res.data.link);
          _this.imgUrl = res.data.link;
          _this.$emit("setLogo", _this.imgUrl);
          // _this.isUpload = true;
        });
      };
    },
    beforeAvatarUpload(file) {
      //上传封面前判断是否为jpeg或png格式，判断大小是否小于6MB
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 6;
      if (!isJPG && !isPNG) {
        this.$message.error("上传的封面图片只能是 JPG/PNG 格式!");
      } else if (!isLt2M) {
        this.$message.error("上传的封面图片大小不能超过 6MB!");
      } else {
        this.imgUrl = null;
        this.isUpload = true;
        this.uploadProgress.percentage = 0;
        this.uploadProgress.status = null;
      }
      return (isJPG || isPNG) && isLt2M;
    },
    handleProgress(event, file, fileList) {
      // this.isUpload = true;
      //文件上传时调用（会随着文件上传一直被调用）
      this.uploadProgress.percentage = Math.floor(
        (event.loaded / event.total) * 100
      );
    },
    handleAvatarSuccess(res, file) {
      //当上传成功时，将上传的图片预览展示
      this.uploadProgress.status = "success";
      this.imgUrl = res.link;
      console.log(res);
      this.$emit("setLogo", this.imgUrl); //将logo链接传给父组件用于保存上传信息
    },
    handleError(res) {
      this.uploadProgress.status = "exception";
      this.$message.error(`上传失败！${res.message}`); //上传失败时，发出提示。
    }
  },
  directives: {
    autoClick: {
      inserted(el) {
        el.click();
      }
    }
  }
};
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/*
  设置可选封面样式
*/
.choosable-img {
  width: 100px;
  height: 100px;
  margin: 10px;
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