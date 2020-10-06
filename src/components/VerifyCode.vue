<template>
  <div>
    <slide-verify
      ref="slideblock"
      @again="onAgain"
      @fulfilled="onFulfilled"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
      :accuracy="accuracy"
      :slider-text="text"
    ></slide-verify>
    <div>{{msg}}</div>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    isSuccess: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      msg: '',
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 5,
    }
  },
  methods: {
    onSuccess(times) {
      this.$emit('onSuccess')
      this.msg = `验证通过, 耗时${(times / 1000).toFixed(1)}s`
      this.$emit('update:isSuccess', true)
    },
    onFail() {
      this.msg = '验证不通过'
      this.$emit('update:isSuccess', false)
    },
    onRefresh() {
      // console.log('点击了刷新小图标')
      this.msg = ''
    },
    onFulfilled() {
      // console.log('刷新成功啦！')
      this.$emit('update:isSuccess', false)
    },
    onAgain() {
      // console.log('检测到非人为操作的哦！')
      this.msg = `检测到非人为操作的哦！`
      // 刷新
      this.$refs.slideblock.reset()
      this.$emit('update:isSuccess', false)
    },
    reset() {
      // 父组件直接可以调用刷新方法
      this.$refs.slideblock.reset()
      this.$emit('update:isSuccess', false)
    },
  },
}
</script>