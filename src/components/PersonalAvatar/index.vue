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
  },
  watch: {
    isChangeAvatar() {
      this.setAvatar()
    },
  },
  mounted() {
    this.setAvatar()
  },
  methods: {
    async setAvatar() {
      getActiveUserInfo().then((res) => {
        this.head = res.data.data.avatarUrl
      })
    },
  },
}
</script>
<style>
.personal-avatar .el-avatar {
  background: white;
}
</style>