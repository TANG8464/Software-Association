<template>
  <div class="avatar-info">
    <el-dialog
      title="更换头像"
      v-if="isOpen"
      :visible.sync="isOpen"
      width="20%"
      :fullscreen="size.isSmallSize"
    >
      <!-- <personal-avatar :avatarSize="360" ></personal-avatar> -->
      <upload-avatar @setFile="setFile" ref="uploadAvatar"></upload-avatar>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="uploadAvatar()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UploadAvatar from './UploadAvatar'
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
      file: null,
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
      if (!this.file) return
      this.isOpen = false
      let formData = new FormData()
      formData.append('file', this.file)
      const { data } = await this.$axios.post('member/avatarUpload', formData)
      const url = data.data
      if (data.code === 200) {
        const { data } = await this.$axios.put('member/person', {
          avatarUrl: url,
        })
        if(data.code !== 200){
          this.$message.error(data.message)
          return 
        }
        if (data.code === 200) {
          this.$message.success('修改成功')
          this.$store.commit('changeAvatar', !this.$store.state.avatar)
        }
      }
    },
  },
}
</script>
<style>
</style>