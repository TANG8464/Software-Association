<template>
  <ul
    class="right-click-box"
    ref="rightClickBox"
    :style="{opacity,display,top,left}"
    :key="opacity"
  >
    <li
      class="right-click-box_item"
      v-for="(item,index) in menu"
      :key="item"
      @click="open(index)"
    >{{item}}</li>
  </ul>
</template>
<script>
export default {
  props: {
    menu: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      opacity: 0,
      display: 'none',
      isOpen: false,
      top: 0,
      left: 0,
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.opacity = 0
        //将contentMenu消除以防误触
        setTimeout(() => {
          this.display = 'none'
        }, 1000)
      } else {
        //先将其展示防止动画无效
        this.display = 'inline-block'
        //再将透明度变为1
        setTimeout(() => {
          this.opacity = 1
        }, 200)
      }
    },
  },
  mounted() {
    document.body.onclick = (e) => {
      this.isOpen = false
    }
    window.addEventListener(
      //滚动监听
      'scroll',
      () => {
        this.isOpen = false
      },
      true
    )
  },
  methods: {
    more(event) {
      this.isOpen = true
      //打开更多选项设置
      this.top = event.clientY + 'px'
      this.left = event.clientX + 'px'
    },
    open(index) {
      this.$emit('open', index)
    },
  },
}
</script>
<style>
</style>