<template>
  <div class="line-loading">
    <div v-show="isLoading" class="line" :style="{'width':progress+'%','background-color':color}">_</div>
  </div>
</template>
<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      require: true,
    },
    color: {
      type: String,
      default: 'rgb(10, 155, 10)',
    },
  },
  data() {
    return {
      progress: 0,
    }
  },
  watch: {
    isLoading(newVal) {
      if (newVal) {
        const load = setInterval(() => {
          const rand = Math.floor(Math.random(10) + 10)
          this.progress += rand
          if (this.progress > 100) {
            clearInterval(load)
            this.isLoadingDetails = false
            this.progress = 0
          }
        }, 100)
      }
    },
  },
}
</script>
<style>
.line-loading {
  height: 3px;
}
</style>