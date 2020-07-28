<template>
  <div class="personal-open-animation" ref="animation">
    <div
      class="content"
      :style="{backgroundImage:`url(${background})`,'text-align': textAlign,'font-size':fontSize}"
    >
      <p>走上程序道路的人</p>
      <p>眼里总有别人看不到的世界</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      require: true,
    },
  },
  watch: {
    isOpen(newVal) {
      const animation = this.$refs.animation
      animation.style.transition = !newVal ? 'all 1s' : 'none'
      animation.style.opacity = newVal ? 1 : 0
      setTimeout(() => {
        animation.style.display = newVal ? 'block' : 'none'
      }, 1000)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    background() {
      return require('@/assets/img/personalCenter/pageAnimation.png')
    },
    textAlign() {
      return this.size.isSmallSize ? 'center' : 'left'
    },
    fontSize() {
      return this.size.isSmallSize ? '20px' : '30px'
    },
  },
}
</script>
<style>
.personal-open-animation {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(47, 55, 91);
  z-index: 9999;
  opacity: 0;
}
.personal-open-animation .content {
  position: fixed;
  top: 0;
  bottom: 0;
  margin: 0;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-size: contain;
  height: 100%;
  width: 100%;
  color: rgb(255, 234, 206);
  font-weight: 500;
}
.personal-open-animation .content p {
  margin: 20px;
}
</style>
