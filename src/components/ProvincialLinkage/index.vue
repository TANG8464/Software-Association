<template>
<div id="app">
    <!-- 插件级联，来自于element-china-area-data -->
    <el-cascader size="large" :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>
</div>
</template>

<script>
import {
    regionDataPlus, //数据
    CodeToText, //码转文本
    TextToCode //文本转码
} from 'element-china-area-data'
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
            let place = this.place.split(' ')
            const lastIndex = place.length - 1
            //-转换为全部
            if (place[lastIndex] === '-') place[lastIndex] = '全部'
            const codeArr = []
            if (lastIndex >= 0) codeArr.push(TextToCode[place[0]].code) //县/区 转换为code
            if (lastIndex >= 1) codeArr.push(TextToCode[place[0]][place[1]].code) //市 转换为code
            if (lastIndex >= 2) codeArr.push(TextToCode[place[0]][place[1]][place[2]].code) //省 转换为code
            this.selectedOptions = codeArr
        }
    },
    methods: {
        handleChange(value) {
            const updatePlace = []
            this.selectedOptions.forEach((item) => {
                if (item === '') updatePlace.push('-')
                else updatePlace.push(CodeToText[item]) //把选择的地区码转换为文字
            })
            this.$emit('update:place', updatePlace.join(' ')) //转换为字符串传给父组件的place
        },
    },
}
</script>

<style>
.el-cascader {
    width: 100%;
}
</style>
