<template>
  <div id="app">
    <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
  </div>
</template>
<script>
import { regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  props: {
    place: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      options: regionDataPlus,
      selectedOptions: [],
    }
  },
  mounted() {
    if (this.place) {
      console.log(this.place);
      
      let place = this.place.split(' ')
      const lastIndex = place.length - 1
      if (place[lastIndex] == '-') place[lastIndex] = '全部'
      let codeArr = []
      if (lastIndex >= 0) codeArr.push(TextToCode[place[0]].code)
      if (lastIndex >= 1) codeArr.push(TextToCode[place[0]][place[1]].code)
      if (lastIndex >= 2) codeArr.push(TextToCode[place[0]][place[1]][place[2]].code)
      this.selectedOptions = codeArr
    }
  },
  methods: {
    handleChange(value) {
      let updatePlace = []
      this.selectedOptions.forEach((item) => {
        if (item === '') updatePlace.push('-')
        else updatePlace.push(CodeToText[item])
      })
      this.$emit('update:place', updatePlace.join(' '))
    },
  },
}
</script>
<style>
.el-cascader {
  width: 100%;
}
</style>