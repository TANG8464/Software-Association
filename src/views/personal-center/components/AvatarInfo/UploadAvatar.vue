<template>
  <div>
    <el-button plain @click="$refs.upload.click()">上传头像</el-button>
    <input type="file" ref="upload" style="display: none;" @change="upload($event)" />
    <div class="avatar-box" :style="{'height':`${height}px`}">
      <el-avatar
        ref="avatar"
        class="avatar"
        :src="head"
        :style="{'height':`${height}px`,'width':`${height}px`}"
        fit="fill"
        shape="square"
      ></el-avatar>
      <div
        class="drag"
        ref="drag"
        :style="{'height':`${height}px`,'width':`${height}px`,'box-shadow': `0 0 0 ${height*0.01}px rgba(0, 0, 0, 0.5)`,'outline': `${height*0.01}px solid rgba(0, 0, 0, 0.5)`}"
      ></div>
    </div>
  </div>
</template>
<script>
import imgVerity from '@/utils/verify'
import { imgDrag, redraw } from '@/utils/pictureProcessing'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  data() {
    return {
      head: require('@/assets/img/headImg.png'),
      headInitW: 0,
      headInitH: 0,
      avatarImg: null,
      imgType: 'image/jpg',
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    height() {
      return (this.size.isSmallSize ? this.size.maxW : this.size.maxW * 0.2) - 40
    },
    changeImg() {
      return this.$store.state.changeImg
    },
  },
  watch: {
    head() {
      this.avatarImg = this.$refs.avatar.$el.children[0]
      this.avatarImg.style.top = 0
      this.avatarImg.style.left = 0
      this.avatarImg.onload = () => {
        //获取原始尺寸
        const width = parseInt(this.avatarImg.naturalWidth || 0)
        const height = parseInt(this.avatarImg.naturalHeight || 0)
        //计算差值
        const size = width > height ? height - this.height : width - this.height
        //等比缩放
        this.avatarImg.style.width = `${
          width > height ? width - (width * size) / height : this.height
        }px`
        this.avatarImg.style.height = `${
          width > height ? this.height : height - (height * size) / width
        }px`
      }
      //拖拽事件
      imgDrag(this.$refs.drag, this.avatarImg)
      document.body.onmousewheel = this.changeImgSize
    },
    size() {
      //重绘
      redraw(this.avatarImg, this.imgType, this.height, this.height)
    },
    changeImg() {
      //重绘
      redraw(this.avatarImg, this.imgType, this.height, this.height)
    },
  },
  beforeDestroy() {
    document.body.onmousewheel = null
  },
  methods: {
    //上传头像
    upload(e) {
      const file = e.srcElement.files[0] //上传的图片
      //图片验证
      const verity = imgVerity(file, ['image/jpeg', 'image/png'], 10, [
        '上传的头像只能是 JPG/PNG 格式!',
        '上传的头像大小不能超过 10MB!',
      ])
      if (!verity.state) {
        this.$message.error(verity.message)
      } else {
        const url = URL.createObjectURL(file) //将图片转换为临时路径
        this.head = url
        this.imgType = file.type
        this.$store.commit('setRedrawImgFile', file)
      }
    },
    changeImgSize(e) {
      const size = event.wheelDelta > 0 ? -10 : 10
      const width = parseInt(this.avatarImg.style.width)
      const height = parseInt(this.avatarImg.style.height)
      this.avatarImg.style.width = `${width + size}px`
      this.avatarImg.style.height = `${height + (height * size) / width}px`
      this.$store.commit('changeImg', !this.changeImg)
    },
  },
}
</script>
<style>
.avatar-info .avatar {
}
.avatar-info .avatar-box {
  margin: 15px 0;
  background: rgba(0, 0, 0, 0.3);
}
.avatar-info .avatar-box .el-avatar {
  position: absolute;
  background: white;
}
.avatar-info .avatar-box .el-avatar img {
  position: relative;
}
.avatar-info .avatar-box .drag {
  position: absolute;
  float: left;
  box-sizing: border-box;
  border-radius: 50%;
}
</style>