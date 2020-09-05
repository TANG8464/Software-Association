<template>
  <span class="personal-avatar">
    <el-avatar :src="head" :shape="shape" :size="avatarSize"></el-avatar>
  </span>
</template>
<script>
import { getActiveUserInfo } from '@/api/active-user'
export default {
  props: {
    avatarSize: {
      type: Number,
      default: 40,
    },
    shape: {
      type: String,
      default: 'circle',
    },
  },
  data() {
    return {
      head: require('@/assets/img/headImg.png'),
    }
  },
  computed: {
    isChangeAvatar() {
      return this.$store.state.avatar
    },
    isChangeMyInfo() {
      return this.$store.state.myInfo
    },
  },
  watch: {
    isChangeAvatar() {
      this.setAvatar()
    },
    isChangeMyInfo() {
      this.setAvatar()
    },
  },
  mounted() {
    this.setAvatar()
  },
  methods: {
    async setAvatar() {
      const { data } = await getActiveUserInfo()
      if (data.code === 200) {
        this.head = data.data.avatarUrl || require('@/assets/img/headImg.png')
      } else this.head = require('@/assets/img/headImg.png')
    },
  },
}
</script>
<style>
.personal-avatar .el-avatar {
  background: white;
}
</style>