<template>
<div class="recycle" ref="recycle" style="">
    <div class="recycle-header">
        <el-row :gutter="24">
            <el-col :span="20">
                <h2 class="header-left">回收筒</h2>
            </el-col>
            <el-col :span="4">
                <p class="header-right">
                    <span @click="$emit('update:isOpen', false)">
                        <icon name="close" scale="20" width="20"></icon>
                    </span>
                </p>
            </el-col>
        </el-row>
    </div>
    <div class="recycle-content">
        <div v-if="carousels&&carousels.length>0">
            <span class="img-item" v-for="(item, index) in carousels" :key="item.id">
                <img :src="item.url" alt="" />
                <div class="img-action" v-if="isBatch" :key="Number(item.status)">
                    <span v-if="!item.status" @click="handleSelect(index, true, item.name)">
                        <icon name="not-check" scale="20" width="20"></icon>
                    </span>
                    <span v-else @click="handleSelect(index, false, item.id)">
                        <icon name="checked" scale="20" width="20"></icon>
                    </span>
                </div>
                <div class="item-restore" v-if="!isBatch">
                    <span @click="restore(item.id)">还原</span>
                </div>
            </span>
        </div>
        <div class="null" v-else>
            <div>
                <p>
                    <icon name='null' scale='50' width='50'></icon>
                </p>
                <p> 回收筒是空的</p>
            </div>
        </div>
    </div>
    <div class="recycle-footer">
        <p style="text-align: right">
            <span v-if="!isBatch">
                <el-link type="warning" @click="isBatch = true">批量删除</el-link>
            </span>
            <span v-else>
                <el-link type="primary" @click="deleteCarousel()">确定</el-link>
                <el-link type="info" @click="resetStatus()">取消</el-link>
            </span>
            <el-link type="danger" @click="handleAll()">清空</el-link>
        </p>
    </div>
</div>
</template>

<script>
import {
    adminSearchCarousel,
    updateCarouselStatus,
    deleteCarousel
} from '@/api/carousel'
export default {
    props: {
        isOpen: {
            type: Boolean,
            require: true,
        },
    },
    data() {
        return {
            isOpenDiaglog: null,
            carousels: [],
            isBatch: false,
            selectItem: [],
        }
    },
    watch: {
        isOpen(newVal) {
            this.isOpenDiaglog = newVal
        },
        isOpenDiaglog(newVal) {

            let status = 'none'
            const el = this.$refs.recycle
            if (newVal) {
                this.setCarouseles()
                el.style.display = 'block'
                setTimeout(() => {
                    el.classList.add('is-open')
                }, 100)
            } else {
                el.classList.remove('is-open')
                setTimeout(() => {
                    el.style.display = 'none'
                }, 500)
            }
        },
    },
    methods: {
        async setCarouseles() {
            const data = await adminSearchCarousel(1, 1000, false)
            if (data.code === 200) {
                this.carousels = data.data.records
                this.resetStatus()
            } else this.$message.error(data.message)
        },
        async restore(id) {
            const data = await updateCarouselStatus(id, true)
            if (data.code === 200) {
                this.$emit('on-refresh')
                this.setCarouseles()
            } else this.$message.error(data.message)
        },
        async deleteCarousel(isDelAll) {
            let tip = `此操作将永久删除这${this.selectItem.length}轮播图, 是否继续?`
            if (isDelAll) tip = `此操作将清空回收筒, 是否继续?`
            this.$confirm(tip, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(async () => {
                    const data = await deleteCarousel(this.selectItem)
                    if (data.code === 200) {
                        this.setCarouseles()
                    } else this.$message.error(data.message)
                })
                .catch(() => {})
        },
        handleSelect(index, status, name) {
            this.carousels[index].status = status
            if (status) this.selectItem.push(name)
            else {
                const index = this.selectItem.indexOf(name)
                this.selectItem.splice(index, 1)
            }
        },
        handleAll() {
            this.carousels.forEach(async (item) => {
                this.selectItem.push(item.name)
            })
            this.deleteCarousel(true)
        },
        resetStatus() {
            this.isBatch = false
            this.selectItem = []
            this.carousels.forEach((item) => {
                item.status = false
            })
        },
    },
}
</script>

<style lang="scss">
.recycle {
    position: fixed;
    top: 0;
    right: 0;
    opacity: 0;
    transition: all 0.5s;
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 15px 1px #c8c8c8;
    z-index: 999999;
    display: none;
    width: 0;
    height: 0;
    padding: 10px 20px 0 30px;
    overflow: hidden;

    .recycle-header {
        border-bottom: 1px solid #e0e0e0;

        p {
            text-align: right;
        }
    }

    .recycle-content {
        overflow: auto;
        height: 380px;

        img {
            width: 260px;
            height: 130px;
            object-fit: cover;
            transition: all 0.2s;
        }

        img:hover {
            box-shadow: 0 0 5px 1px #d9d9d9;
        }

        .img-item {
            margin: 3px;
            position: relative;
            width: 260px;
            height: 130px;
            display: inline-block;

            .img-action {
                position: absolute;
                bottom: 8px;
                right: 5px;
                display: inline-block;
                z-index: 2;

                .icon-checked {
                    path:first-child {
                        color: white;
                    }
                }
            }

            .item-restore {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 260px;
                line-height: 130px;
                display: none;
                background: rgba(0, 0, 0, 0.2);
                text-align: center;
                color: white;
                opacity: 0;
                display: inline-block;
            }

            .item-restore:hover {
                opacity: 1;
            }
        }

        .null {
            height: 100%;
            display: inline-flex;
            align-items: center;
            width: 100%;

            div {
                width: 100%;
                text-align: center;
            }
        }
    }

    .recycle-footer {
        .el-link {
            margin: 0 3px;
        }
    }
}

.is-open {
    opacity: 1;
    top: 18%;
    right: 22%;
    width: 800px;
    height: 500px;
}
</style>
