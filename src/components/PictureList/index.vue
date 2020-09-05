<template>
<div class="picture-list" :key="show">
    <el-row :gutter="24" v-for="(item,index) in allBackground" :key="item.id">
        <el-col :lg="(index+3)%3===2?12:6" :md="(index+3)%3===2?12:6" :xs="12" :sm="12">
            <div class="img-box" :style="{height:height((index+3)%3!==2)}">
                <el-image :src="item[0].url" style="height:100%" :preview-src-list="preview(index,0)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[0]"></slot>
            </div>
            <div class="img-box" :style="{height: height((index+3)%3!==2)}" v-if="item.length>1&&(index+3)%3!==2">
                <el-image :src="item[1].url" :preview-src-list="preview(index,1)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[1]" :updateStatus="updateStatus" :deleteImg="deleteImg"></slot>
            </div>
        </el-col>
        <el-col v-if="item.length>2" :lg="(index+3)%3===0?12:6" :md="(index+3)%3===0?12:6" :xs="12" :sm="12">
            <div class="img-box" :style="{height:height((index+3)%3!==0)}">
                <el-image :src="item[(index+3)%3===2?1:2].url" :preview-src-list="preview(index,(index+3)%3===2?1:2)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[(index+3)%3===2?1:2]"></slot>
            </div>
            <div class="img-box" :style="{height:height((index+3)%3!==0)}" v-if="item.length>3&&(index+3)%3!==0">
                <el-image :src="item[(index+3)%3===2?2:3].url" :preview-src-list="preview(index,(index+3)%3===2?2:3)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[(index+3)%3===2?2:3]"></slot>
            </div>
        </el-col>
        <el-col v-if="item.length>4||item.length>3&&(index+3)%3===0" :lg="(index+3)%3===1?12:6" :md="(index+3)%3===1?12:6" :xs="12" :sm="12">
            <div class="img-box" :style="{height: height((index+3)%3!==1)}">
                <el-image :src="item[(index+3)%3===1?4:3].url" :preview-src-list="preview(index,(index+3)%3===1?4:3)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[(index+3)%3===1?4:3]"></slot>
            </div>
            <div class="img-box" :style="{height: height((index+3)%3!==1)}" v-if="item.length>4&&(index+3)%3!==1">
                <el-image :src="item[4].url" :preview-src-list="preview(4)" fit="cover">
                    <picture-loading slot="placeholder"></picture-loading>
                </el-image>
                <slot name="actions" :item="item[4]"></slot>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import PictureLoading from './PictureLoading'
export default {
    components: {
        PictureLoading,
    },
    props: {
        pictures: {
            type: Array,
            require: true,
        },
        pictureUrlArr: {
            type: Array,
            require: true,
        },
        col: {
            type: Number,
            deafult: 5,
        },
        refresh: {
            type: Boolean,
            require: true,
        },
    },
    data() {
        return {
            allBackground: null,
            show: false,
            index: 0,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        pictures() {
            this.init()
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.show = !this.show
            if (this.refresh || !this.allBackground) {
                let index = -1
                let backs = []
                this.pictures.forEach((item) => {
                    if (index === -1 || backs[index].length >= 5) backs[++index] = []
                    backs[index].push(item)
                })
                this.allBackground = backs
                this.index = index
            } else {
                const len = this.allBackground.length
                for (
                    let i = (len - 1) * this.col + this.allBackground[len - 1].length; i < this.pictures; i++
                ) {
                    if (this.index === -1 || backs[this.index].length >= 5) backs[++this.index] = []
                    backs[this.index].push(this.pictures[i])
                }
            }
        },
        height(flag) {
            return flag || this.size.isSmallSize ? '150px' : '310px'
        },
        preview(row, col) {
            const index = (row + 1) * (col + 1) - 1
            let previewArr = []
            for (let i = index; i < this.pictureUrlArr.length; i++) {
                previewArr.push(this.pictureUrlArr[i])
            }
            for (let i = 0; i < index; i++) {
                previewArr.push(this.pictureUrlArr[i])
            }
            return previewArr
        },
        updateStatus(id, status) {
            this.$emit('updateStatus', id, status)
        },
        deleteImg(name) {
            this.$emit('deleteImg', name)
        },
    },
}
</script>

<style lang="scss">
.picture-list {
    .img-box {
        position: relative;
        margin: 5px;
    }

    .img-box:hover .actions {
        opacity: 1;
    }

    .el-row .el-col {
        padding: 0 !important;
        position: relative;
    }

    .el-image {
        border-radius: 5px;
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
