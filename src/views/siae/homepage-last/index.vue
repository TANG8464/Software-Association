<template>
  <div class="homepage-last">
    <div class="homepage-last-main-first" :style="{ 'min-height': size.maxH - 60 + 'px' }">
      <p style="line-height: 25px">
        <span @click="prev()"><icon name="return" scale="18" width="18"></icon></span>
        <span>&nbsp;|&nbsp;</span>
        <span style="font-size: 18px">{{ title }}</span>
      </p>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  data() {
    return {
      title: null,
    }
  },
  mounted() {
    this.title = this.$route.query.name
  },
  methods: {
    prev() {
      this.$router.push({ path: '/homepage', query: { active: 6 } })
    },
  },
}
</script>

<style lang="scss">
.homepage-last {
  .homepage-last-main-first {
    // background: rgba(206, 228, 255, 0.30);
    background-color: white;
    width: 100%;
    padding: 20px 8%;
    box-sizing: border-box;
  }
}
</style>
