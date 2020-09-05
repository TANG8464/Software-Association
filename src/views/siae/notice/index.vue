<template>
<div class="siae-notice">
    <el-container>
        <el-header>
            <div class="content" :style="{width}">
                <span style="font-size:25px" @click="upOneLevel()">协会公告</span>
                <span v-if="isLoadingDetails" style="margin:0 5px">>&nbsp;{{details.title}}</span>
                <div v-else class="search" ref="search" :style="{width:(searchWidth+25)+'px'}">
                    <input v-model="title" type="text" placeholder="请输入标题关键字" :style="{width:searchWidth+'px'}" @keypress.enter="setAllNotice()" />
                    <span @click="setAllNotice()">
                        <icon name="search" ref="search-icon" scale="20" width="20"></icon>
                    </span>
                </div>
            </div>
            <span></span>
        </el-header>
        <div class="el-main" style="padding:0">
            <line-loading :isLoading.sync="isOpenPageLoading"></line-loading>
        </div>
        <el-main>
            <div class="content" ref="main-content" :style="{'height':size.maxH-150+'px',width}">
                <div v-if="isLoadingDetails">
                    <notice-details :notice="details"></notice-details>
                    <notice-cut :otherNotice="otherNotice" :otherArr="indexArr" @toOther="noticeDetails"></notice-cut>
                </div>

                <div v-else style="height:100%;margin:auto">
                    <p class="search-data_box">
                        <span class="search-text" v-if="isSearch">{{searchData}}</span>
                        <span class="search-text">{{total}}</span>
                        <span class="search-text">NOTICE</span>
                    </p>
                    <notice-list :notice="allNotice" @itemClick="noticeDetails"></notice-list>
                    <p class="tip" style="text-align:center;line-height:30px">
                        <span v-if="!isAllLoad&&isLoading">加载中...</span>
                        <span v-if="isAllLoad">
                            <span v-if="total!==0">已全部加载</span>
                            <span v-else>
                                <icon name="null" scale="40" width="40"></icon>没有相关公告
                            </span>
                        </span>
                    </p>
                </div>
                <div class="share" v-if="isOpenShare" :style="{'position': size.isSmallSize?'relative':'absolute','top': size.isSmallSize?0:'150px','left': size.isSmallSize?0:'150px'}">
                    <share-other :title="details.title" :pics="details.cover"></share-other>
                </div>
                <div class="aside" :style="{'position': size.isSmallSize?'relative':'absolute','right': size.isSmallSize?0:'100px','bottom': size.isSmallSize?0:'100px','text-align': 'right'}">
                    <span style="margin:5px" class="top" v-if="isOpenToTop" @click="toTop()">
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
import NoticeList from './components/NoticeList'
import {
    searchAllNotice,
    searchNoticeById
} from '@/api/notice'
import LineLoading from '@/components/PageLoading/LineLoading'
import NoticeDetails from './components/NoticeDetails'
import NoticeCut from './components/NoticeCut'
import ShareOther from '@/components/ShareOther'
export default {
    components: {
        NoticeList,
        LineLoading,
        NoticeDetails,
        NoticeCut,
        ShareOther
    },
    data() {
        return {
            allNotice: [],
            currPage: 1, //当前页
            limit: 10, //每次展示多少条数据
            title: null, //用于查找的标题
            total: 0, //用于展示搜索到多少项
            time: 0, //计算短时间内多次触发到达底部事件
            scrollTop: -1, //用于计算是否到达底部
            isSearch: false, //是否处于标题查询
            isLoading: false, //是否正在加载数据
            isAllLoad: false, //是否加载完所有数据
            searchData: null, //用于展示的搜索内容
            details: {},
            currentIndex: 0,
            isLoadingDetails: false,
            isOpenPageLoading: false,
            isOpenToTop: false,
            isClickTop: false,
            otherNotice: [],
            indexArr: [],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '97%' : '65%'
        },
        searchWidth() {
            return this.size.isSmallSize ? 130 : 415
        },
        isOpenShare() {
            return this.$route.query.id
        },
    },
    watch: {
        $route(newVal) {
            //监听路由，检测是否展示详情
            this.setAllNotice()
            if (!newVal.query.id) {
                this.isLoadingDetails = false
            }
        },
        title(newVal) {
            //取消搜索时需要init的项
            if (!newVal) {
                this.allNotice = []
                this.total = 0
                this.isSearch = false
                this.setAllNotice()
                this.isAllLoad = false
            }
        },
    },
    created() {
        this.setAllNotice()
    },
    mounted() {
        this.isOpenToTop = false
        //添加到达底部触发事件
        const elM = this.$refs['main-content']
        elM.touchmove = elM.onmousewheel = () => {
            if (elM.scrollTop !== 0) this.isOpenToTop = true
            else this.isOpenToTop = false
            if (this.isAllLoad) {
                return
            }
            const newDateTime = new Date().getTime()
            //解决数据未加载前多次调用
            if (this.scrollTop === elM.scrollTop && newDateTime - this.time > 1500) {
                this.currPage++
                this.setAllNotice()
                this.time = newDateTime
            } else this.scrollTop = elM.scrollTop
        }
    },
    methods: {
        async setAllNotice() {
            //查询时init一些数据
            if (this.title) {
                this.currPage = 1
                this.isAllLoad = false
                this.allNotice = []
                this.isSearch = true
                this.searchData = this.title
            }
            //提示用户正在加载中
            this.isLoading = true
            const data = await searchAllNotice(this.currPage, this.limit, this.title)
            if (data.code === 200) {
                const moreData = data.data.records
                let arr
                if (this.title) arr = moreData
                else arr = this.allNotice.concat(moreData)
                setTimeout(() => {
                    //判断是否全部加载
                    if (arr.length >= data.data.total) this.isAllLoad = true
                    if (arr.length <= data.data.total) this.allNotice = arr
                    this.total = data.data.total
                    this.isLoading = false
                }, 500)
                //加载其他
                const id = this.$route.query.id
                const index = this.$route.query.index
                if (id) this.noticeDetails(id, index)
            } else this.$message.error(data.message)
        },
        async searchNoticeById(id) {
            const data = await searchNoticeById(id)
            if (!data.code === 200) {
                this.$message.error(data.message)
                this.details = {}
            }
        },
        noticeDetails(id, index) {
            //router存储的数据是字符串型的
            index = Number(index)
            //初始到顶部
            this.toTop()
            this.details = this.allNotice[index]
            this.searchNoticeById(id)
            this.isLoadingDetails = true
            this.isOpenPageLoading = true

            this.$router.push({
                path: '/notice',
                query: {
                    id,
                    index
                },
            })
            if (this.allNotice.length > 2) {
                this.indexArr = [
                    index - 1 >= 0 ? index - 1 : this.allNotice.length - 1,
                    index + 1 < this.allNotice.length ? index + 1 : 0,
                ]
                this.otherNotice = [this.allNotice[this.indexArr[0]], this.allNotice[this.indexArr[1]]]
            } else this.otherNotice = null
            this.currentIndex = index
        },
        upOneLevel() {
            this.details = {}
            this.isLoadingDetails = false
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

<style>
.siae-notice .el-container {
    position: fixed;
    width: 100%;
}

.siae-notice .el-container .el-header {
    color: white;
    display: flex;
    align-items: center;
}

.siae-notice .el-container .el-main {
    background-color: white;
}

.siae-notice .el-container .content {
    margin: auto;
    overflow: auto;
}

.siae-notice .search {
    border: 1px solid #999999;
    border-radius: 15px;
    padding: 3px 10px;
    float: right;
    width: 40%;
}

.siae-notice .search input {
    background: none;
    border: none;
    color: #999999;
}

.siae-notice .top {}

.siae-notice .top .plane .icon-top {
    transform: rotate(180deg);
}

.siae-notice .top .icon-cloud2 {
    position: relative;
    top: 10px;
    left: 5px;
}

.siae-notice .top .cloud {
    position: absolute;
    animation: slide 1s infinite;
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

.siae-notice .search-data_box {
    border-bottom: 1.2px solid #e0e0e0;
    text-align: center;
    padding: 10px 0;
}

.siae-notice .search-text {
    padding: 3px 10px;
}
</style>
