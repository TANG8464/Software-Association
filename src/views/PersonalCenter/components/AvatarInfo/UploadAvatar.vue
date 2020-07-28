<template>
  <div>
    <el-button plain @click="$refs.upload.click()">上传头像</el-button>
    <input type="file" ref="upload" style="display: none;" @change="upload($event)" />
    <div class="avatar-box" :style="{'height':`${height}px`}">
      <el-avatar
        ref="avatar"
        :src="head"
        :style="{'height':`${height}px`,'width':`${height}px`}"
        fit="fill"
      ></el-avatar>
      <div class="drag" ref="drag" :style="{'height':`${height}px`,'width':`${height}px`}"></div>
    </div>
  </div>
</template>
<script>
import imgVerity from '@/utils/verify'
import { imgDrag } from '@/utils/pictureProcessing'
export default {
  data() {
    return {
      head: null,
      avatarImg: null,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    height() {
      return (this.size.isSmallSize ? this.size.maxW : this.size.maxW * 0.2) - 40
    },
  },
  watch: {
    head() {
      setTimeout(() => {
        this.avatarImg = this.$refs.avatar.$el.children[0]
        console.log(this.avatarImg)
      }, 200)
    },
  },
  created() {},
  mounted() {
    this.setAvatar()
    // this.avatarImg = this.$refs.avatar.$el

    window.addEventListener('mousewheel', this.changeImgSize, false)
    imgDrag(this.$refs.drag, this.avatarImg)
  },
  methods: {
    async setAvatar() {
      const { data } = await this.$axios.get('member/person')
      this.head = data.data.avatarUrl
      console.log(data)
    },
    //上传头像
    upload(e) {
      const file = e.srcElement.files[0] //上传的图片
      //图片验证
      const verity = imgVerity(file, ['image/jpeg', 'image/png', 'image/gif'], 10, [
        '上传的头像只能是 JPG/PNG/GIF 格式!',
        '上传的头像大小不能超过 10MB!',
      ])
      if (!verity.state) {
        this.$message.error(verity.message)
      } else {
        const url = URL.createObjectURL(file) //将图片转换为临时路径
        this.$emit('setFile', file) //设置上传的图片
        this.head = url
        console.log(file, url)
      }
    },
    changeImgSize(e) {
      const size = event.wheelDelta > 0 ? -10 : 10
      const width = parseInt(this.avatarImg.width)
      const height = parseInt(this.avatarImg.height)
      this.avatarImg.style.width = `${width + size}px`
      this.avatarImg.style.height = `${height + (height * size) / width}px`
    },
  },
}
</script>
<style>
.avatar-info .avatar-box {
  margin: 15px 0;
  background: rgba(0, 0, 0, 0.3);
}
.avatar-info .avatar-box .el-avatar {
  position: absolute;
  background: white;
}
.avatar-info .avatar-box .el-avatar img {
  position: absolute;
}
.avatar-info .avatar-box .drag {
  position: absolute;
}
</style>