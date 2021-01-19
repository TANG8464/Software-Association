<template>
  <div class="avatar-info">
    <el-dialog
      title="更换头像"
      v-if="isOpen"
      :visible.sync="isOpen"
      width="20%"
      :fullscreen="size.isSmallSize"
    >
      <upload-avatar ref="uploadAvatar"></upload-avatar>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="uploadAvatar()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UploadAvatar from './UploadAvatar'
import { avatarUpload } from '@/api/member'
export default {
  name: 'avatarInfo',
  props: {
    isOpenAvatarInfo: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    UploadAvatar,
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    isOpenAvatarInfo(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenAvatarInfo', newVal)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    height() {
      return this.size.isSmallSize ? this.size.maxW : this.size.maxW * 0.2
    },
  },
  methods: {
    setFile(val) {
      this.file = val
    },
    async uploadAvatar() {
      this.isOpen = false
      const res = await avatarUpload(this.$store.state.redrawImgFile)
      const url = res.data
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.$store.commit('changeAvatar', !this.$store.state.avatar)
        this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
      }
    },
  },
}
</script>
<style>
</style>