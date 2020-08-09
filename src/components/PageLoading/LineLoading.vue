<template>
  <div class="line-loading">
    <div
      v-show="isLoadingDetails"
      class="line"
      :style="{'width':progress+'%','background-color':color}"
    >_</div>
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
      isLoadingDetails: false,
    }
  },
  watch: {
    isLoadingDetails(newVal) {
      this.$emit('update:isLoading', newVal)
      
    },
    isLoading(newVal) {
      this.isLoadingDetails = newVal
      if (newVal) {
        const load = setInterval(() => {
          const rand = Math.floor(Math.random(10) + 15)
          this.progress += rand
          if (this.progress > 100) {
            clearInterval(load)
            this.isLoadingDetails = false
            this.progress = 0
          }
        }, 50)
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