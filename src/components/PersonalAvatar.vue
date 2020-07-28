<template>
  <el-avatar :src="head" :shape="shape" :size="avatarSize"></el-avatar>
</template>
<script>
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
      head: require('@/assets/img/headImg.gif'),
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
  created() {
    this.setAvatar()
  },
  methods: {
    async setAvatar() {
      const { data } = await this.$axios.get('member/person')
      this.head = data.data.avatarUrl
      console.log(data)
    },
  },
}
</script>