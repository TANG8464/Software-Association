<template>
<div class="image-carousel">
    <div class="carousel-header">
        <el-row :gutter="24">
            <el-col :span="20">
                <p :style="{ 'text-align': isNotCarousel ? null : 'left' }">
                    当前共{{ carousels.length }}张轮播图
                </p>
            </el-col>
            <el-col :span="4">
                <p style="text-align: right">
                    <el-link type="primary">
                        <span v-if="model === 'carousel'" @click="model = 'list'">列表模式</span>
                        <span v-if="model === 'list'" @click="model = 'carousel'">轮播图模式</span>
                    </el-link>
                    <el-link type="danger" @click="isOpenRecycle = true">回收筒</el-link>
                </p>
                <recycle :is-open.sync="isOpenRecycle" @on-refresh="setCarouseles"></recycle>
            </el-col>
        </el-row>
    </div>
    <div class="carousel-content" ref="carousel-content">
        <el-carousel v-if="model === 'carousel' && !isNotCarousel" indicator-position="outside" direction="horizontal" :height="height" trigger="click">
            <el-carousel-item v-for="item in carousels" :key="item.id">
                <div style="height: 100%">
                    <img :src="item.url" alt="" style="object-fit: fill" />
                    <div class="actions">
                        <span style="margin: 5%; color: #e0e0e0" @click="unloading(item.id)">
                            <icon name="unloading" scale="20" width="20"></icon>
                        </span>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
        <div class="carousel-list" ref="carousel-list" v-if="model === 'list' && !isNotCarousel">
            <span class="img-item" draggable="true" v-for="item in carousels" :key="item.id" :data-sort="item.sort" :data-id="item.id">
                <img :src="item.url" draggable="true" alt="" style="object-fit: fill; cursor: move" />
                <div class="actions">
                    <span style="margin: 5%; color: #e0e0e0" @click="unloading(item.id)">
                        <icon name="unloading" scale="20" width="20"></icon>
                    </span>
                </div>
            </span>
        </div>
    </div>
    <div class="carousel-list-null" style="text-align: center">
        <el-upload class="upload-demo" ref="upload-demo" :class="{ null: isNotCarousel }" action="#" :before-upload="onbeforeUpload">
            <div>
                <div v-if="isNotCarousel">
                    <p>
                        <icon name="null" scale="80" width="80"></icon>
                    </p>
                    <p>暂时没有上传轮播图哦~</p>
                </div>
                <el-link type="primary">点击上传</el-link>
                <p class="tip" style="font-size: 12px">
                    只能上传JPG/PNG,大小不能超过20MB(建议像素：1920*900)
                </p>
            </div>
        </el-upload>
        <p class="tip" v-if="loading">上传中,请耐心等待...</p>
    </div>
</div>
</template>

<script>
import {
    adminSearchCarousel,
    updateCarouselStatus,
    deleteCarousel,
    addCarousel,
    updateCarouselSort
} from '@/api/carousel'
import imgVerify from '@/utils/verify'
import Recycle from './components/Recycle'
import {
    dragSort
} from '@/utils/carousel'
export default {
    components: {
        Recycle,
    },
    data() {
        return {
            carousels: [],
            fileList: [],
            height: '500px',
            isOpenRecycle: false,
            model: 'carousel',
            loading: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        isNotCarousel() {
            return !this.carousels || this.carousels.length <= 0
        },
        carouselSort() {
            return this.$store.state.carouselSort
        }
    },
    watch: {
        size() {
            this.height = this.$refs['carousel-content'].clientWidth * 0.45 + 'px'
        },
        model(newVal) {
            if (newVal === 'list' && !this.isNotCarousel) {
                setTimeout(() => {
                    const el = this.$refs['carousel-list']
                    dragSort(el)
                }, 100)
            }
            this.setCarouseles()
        },
        carouselSort(newVal) {
            this.sort()
        }
    },
    created() {
        this.setCarouseles()
    },
    mounted() {
        this.height = this.$refs['carousel-content'].clientWidth * 0.45 + 'px'
    },
    methods: {
        async setCarouseles() {
            const data = await adminSearchCarousel(1, 1000, true)
            if (data.code === 200) {
                this.carousels = data.data.records
                const carouselSort = []
                this.carousels.forEach((item) => {
                    carouselSort.push(item.id)
                })
                this.$store.commit('setCarouselSort', carouselSort)
            } else this.$message.error(data.message)
        },
        async onbeforeUpload(file) {
            const verity = imgVerify(file, ['image/jpeg', 'image/png'], 20, [
                '上传的封面图片只能是 JPG/PNG 格式!',
                '上传的封面图片大小不能超过 20MB!',
            ])
            const flag = verity.status
            if (!flag) {
                this.$message.error(verity.message)
            } else {
                const url = window.URL.createObjectURL(file)
                const obj = {
                    file,
                    url
                }
                this.fileList.push(obj)
                await this.uploadCarousel([file])
                this.fileList.pop()
            }
            return false
        },
        async uploadCarousel(fileList) {
            this.loading = true
            const data = await addCarousel(fileList)
            if (data.code === 200) {
                this.$refs['upload-demo'].clearFiles()
                this.$message.success('上传成功')
                this.setCarouseles()
                this.loading = false
            } else this.$message.error(data.message)
        },
        async unloading(id) {
            this.$confirm('此操作将卸下该轮播图', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(async () => {
                    const data = await updateCarouselStatus(id, false)
                    if (data.code === 200) {
                        this.setCarouseles()
                    } else this.$message.error(data.message)
                })
                .catch(() => {})
        },
        async sort() {
            const data = await updateCarouselSort(this.carouselSort)
            if (data.code !== 200) this.$message.error(data.message)
        }
    },
}
</script>

<style lang="scss">
.image-carousel {
    margin: 0 30px;

    .carousel-header {
        color: #999999;
        font-size: 13px;
        border-bottom: 1px solid #e0e0e0;
    }

    .carousel-content {
        padding-top: 10px;
        margin: 0 60px;
        box-sizing: border-box;

        .el-carousel__item {
            img {
                height: 100%;
                width: 100%;
            }
        }

        .el-carousel__item h3 {
            color: #475669;
            font-size: 18px;
            opacity: 0.75;
            line-height: 300px;
            margin: 0;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n + 1) {
            background-color: #d3dce6;
        }

        .actions {
            z-index: 1;
            position: absolute;
            width: 100%;
            height: 40px;
            left: 0;
            bottom: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.3);
            transition: opacity 0.3s;
        }

        .actions::after {
            display: inline-block;
            content: '';
            height: 100%;
            vertical-align: middle;
            filter: blur(2px);
        }

        .is-active:hover .actions {
            opacity: 1;
        }

        .carousel-list {
            height: 550px;
            overflow: auto;

            .img-item {
                margin: 3px;
                position: relative;
                width: 300px;
                height: 190px;
                display: inline-block;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .img-item:hover .actions {
                opacity: 1;
            }

            .img-item {
                transition: all 1s;
            }
        }
    }

    .carousel-list-null {
        .null {
            height: 500px;
            display: flex;
            align-items: center;
            border: 2px dotted #c0c0c0;
            border-radius: 5px;
            color: #999999;
            font-size: 13px;

            div {
                text-align: center;
                width: 100%;
                color: #999999;
                font-size: 14px;
            }
        }

        .null:hover {
            border-color: rgb(104, 177, 255);
        }
    }

    .tip {
        color: #999999;
        font-size: 13px;
    }

    .el-link {
        margin: 0 3px;
    }
}

.article-neirong img:hover {
    box-shadow: 2px 3px 2px 0px #bebbbb;
}
</style>
