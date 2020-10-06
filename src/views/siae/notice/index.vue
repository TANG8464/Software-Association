<template>
<div class="siae-notice">
    <el-container>
        <el-header :class="{ 'header-mheight': isOpenToTop && $route.name === 'details' }">
            <div class="content" :style="{ width }">
                <span :style="{ 'font-size': isOpenToTop && $route.name === 'details' ? '18px' : '25px' }" @click="upOneLevel()">协会公告</span>
                <span v-if="isLoadingDetails" style="margin: 0 5px">&gt;&nbsp;{{ currentTitle }}</span>
                <div v-else class="search" ref="search" :style="{ width: searchWidth + 25 + 'px' }">
                    <input v-model="title" type="text" placeholder="请输入标题关键字" :style="{ width: searchWidth + 'px' }" @keypress.enter="setAllNotice()" />
                    <span @click="setAllNotice()">
                        <icon name="search" ref="search-icon" scale="20" width="20"></icon>
                    </span>
                </div>
            </div>
        </el-header>
        <el-main>
            <div class="main-content" ref="main-content" style="overflow: auto;" :style="{ width, height }">
                <router-view></router-view>
                <div class="aside" :style="{
              position: size.isSmallSize ? 'relative' : 'absolute',
              right: size.isSmallSize ? 0 : '100px',
              bottom: size.isSmallSize ? 0 : '50px',
              'text-align': 'right',
            }">
                    <span style="margin: 5px" class="top" v-if="isOpenToTop" @click="toTop()">
                        <span class="cloud" v-if="isClickTop">
                            <icon name="cloud1" scale="20" width="20"></icon>
                            <icon name="cloud2" scale="20" width="20"></icon>
                        </span>
                        <span class="plane">
                            <icon name="top" scale="50" width="50"></icon>
                        </span>
                    </span>
                </div>
            </div>
        </el-main>
    </el-container>
</div>
</template>

<script>
import {
    searchAllNotice,
    searchNoticeById
} from '@/api/notice'
import LineLoading from '@/components/PageLoading/LineLoading'
import ShareOther from '@/components/ShareOther'
export default {
    components: {
        LineLoading,
        ShareOther,
    },
    data() {
        return {
            title: '',
            currentIndex: 0,
            isLoadingDetails: false,
            isOpenToTop: false,
            isClickTop: false,
            time: 0,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '97%' : '55%'
        },
        height() {
            return this.isOpenToTop ? this.size.maxH - 85 + 'px' : this.size.maxH - 120 + 'px'
        },
        searchWidth() {
            return this.size.isSmallSize ? 130 : 415
        },
        isOpenShare() {
            return this.$route.query.id
        },
        currentTitle() {
            return this.$store.state.currentTitle
        },
    },
    watch: {
        title(newVal) {
            this.$store.commit('setNoticeTitle', newVal)
        },
        $route(newVal) {
            if (newVal.name === 'details') this.isLoadingDetails = true
            else this.isLoadingDetails = false
            this.init()
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (this.$route.name === 'details') {
                this.isLoadingDetails = true
            } else this.isLoadingDetails = false
            this.isOpenToTop = false
            //添加到达底部触发事件
            const elM = this.$refs['main-content']
            const wheel = () => {

                if (elM.scrollTop !== 0) this.isOpenToTop = true
                else this.isOpenToTop = false
                this.$store.commit('changeOpenToTop', this.isOpenToTop)
                const newDateTime = new Date().getTime()
                //解决数据未加载前多次调用
                if (this.scrollTop === elM.scrollTop && newDateTime - this.time > 1500) {
                    this.time = newDateTime
                    this.$store.commit('changeReachBottom', !this.$store.state.isReachBottom)
                } else this.scrollTop = elM.scrollTop
            }
            elM.onmousewheel = wheel
            elM.addEventListener('touchmove', wheel)
        },
        setAllNotice() {
            this.$store.commit('changeSearchNotice', !this.$store.state.isSearchNotice)
        },
        upOneLevel() {
            this.$router.push('/notice')
        },
        //回到顶部
        toTop() {
            this.isClickTop = true
            const elM = this.$refs['main-content']
            const toTop = setInterval(() => {
                elM.scrollTop -= 600
                if (elM.scrollTop === 0) {
                    clearInterval(toTop)
                    this.isOpenToTop = false
                    this.isClickTop = false
                }
            }, 50)
        },
    },
}
</script>

<style lang="scss">
.siae-notice {
    .el-container {
        .el-header {
            color: white;
            display: flex;
            align-items: center;
            transition: all 0.5s;
        }

        .el-main {
            background-color: white;
            padding: 0;
        }

        .content {
            margin: auto;
        }

        .header-mheight {
            height: 25px !important;
        }

        .main-content {
            margin: auto;
            min-height: 300px;
        }
    }

    .search {
        border: 1px solid #999999;
        border-radius: 15px;
        padding: 3px 10px;
        float: right;
        width: 40%;

        input {
            background: none;
            border: none;
            color: #d2d2d2;
        }
    }

    .top {
        .plane {
            .icon-top {
                transform: rotate(180deg);
            }
        }

        .icon-cloud2 {
            position: relative;
            top: 10px;
            left: 5px;
        }

        .cloud {
            position: absolute;
            animation: slide 1s infinite;
        }
    }

    .search-data_box {
        border-bottom: 1.2px solid #e0e0e0;
        text-align: center;
        padding: 10px 0;
    }

    .search-text {
        padding: 3px 10px;
    }
}

@keyframes slide {
    0% {
        top: -10px;
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        top: 40px;
    }
}
</style>
