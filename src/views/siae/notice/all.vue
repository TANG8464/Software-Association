<template>
<div class="all-notice">
    <p class="search-data_box">
        <span class="search-text" v-if="isSearch">{{ searchData }}</span>
        <span class="search-text">{{ total }}</span>
        <span class="search-text">NOTICE</span>
    </p>
    <div class="notice_list">
        <ul class="notice">
            <li class="notice-item" v-for="(item, index) in allNotice" :key="item.id" @click="itemClick(item.id, index)">
                <el-row :gutter="24">
                    <el-col :lg="20" :sm="24">
                        <h3 class="notice-item_title">
                            <span>
                                <el-tag size="mini" v-if="item.top !== 0" :type="item.tagType" effect="plain">{{
                    item.tagLabel
                  }}</el-tag>
                            </span>
                            <span>{{ item.title }}</span>
                        </h3>
                        <p class="notice-item_content" v-html="item.text"></p>
                        <div class="notice-item_footer">
                            <p v-if="item.member">
                                <span>
                                    <img :src="item.member.avatarUrl" height="30px" width="30px" style="border-radius: 50%" alt />
                                </span>
                                <span>{{ item.member.memberName }}</span>
                            </p>
                            <p>
                                <span>
                                    <icon name="time" scale="14" width="14"></icon>
                                    {{ item.deplDate | dataFormatter }}
                                </span>
                                <span>
                                    <icon name="footer" scale="15" width="15"></icon>
                                    {{ item.count }}
                                </span>
                            </p>
                        </div>
                    </el-col>
                    <el-col :lg="4" :sm="24" style="text-align: right">
                        <div style="height: 150px">
                            <img :src="item.cover" style="width: 100%; height: 100%; border-radius: 5px; object-fit: cover" class="cover" />
                        </div>
                    </el-col>
                </el-row>
            </li>
        </ul>
    </div>
    <p class="tip" style="text-align: center; line-height: 30px">
        <span v-if="!isAllLoad && isLoading">加载中...</span>
        <span v-if="isLoadingErr">加载失败</span>
        <span v-if="isAllLoad">
            <span v-if="total !== 0">已全部加载</span>
            <span v-else>
                <icon name="null" scale="40" width="40"></icon>没有相关公告
            </span>
        </span>
    </p>
</div>
</template>

<script>
import {
    dataFormatter
} from '@/filters'
import {
    searchAllNotice,
    searchNoticeById
} from '@/api/notice'
export default {
    data() {
        return {
            allNotice: [],
            currPage: 1, //当前页
            limit: 10, //每次展示多少条数据
            total: 0, //用于展示搜索到多少项
            time: 0, //计算短时间内多次触发到达底部事件
            scrollTop: -1, //用于计算是否到达底部
            isSearch: false, //是否处于标题查询
            isLoading: false, //是否正在加载数据
            isAllLoad: false, //是否加载完所有数据
            isLoadingErr: false,
            searchData: null, //用于展示的搜索内容
        }
    },
    computed: {
        isOpenToTop() {
            return this.$store.state.isOpenToTop
        },
        isReachBottom() {
            return this.$store.state.isReachBottom
        },
        title() {
            return this.$store.state.noticeTitle
        },
        isSearchNotice() {
            return this.$store.state.isSearchNotice
        },
    },
    watch: {
        //是否点击搜索title
        isSearchNotice(newVal) {
            this.setAllNotice()
        },
        //是否到达底部
        isReachBottom(newVal) {
            if (this.isAllLoad) return
            this.currPage++
            this.setAllNotice()
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
    mounted() {},
    methods: {
        itemClick(id, index) {
            this.$router.push({
                path: '/notice/details',
                query: {
                    id: id,
                },
            })
        },
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
            this.isLoadingErr = false
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
            } else {
                if (data.code === 500) this.$message.error('服务器错误')
                else this.$message.error(data.message)
                this.isLoadingErr = true
                this.isLoading = false
            }
        },
    },
    filters: {
        dataFormatter,
    },
}
</script>

<style lang="scss">
.all-notice {
    padding-bottom: 50px;

    .notice_list {
        .notice {
            list-style: none;
        }

        .notice-item {
            padding: 10px 15px;
            margin: 15px 0;
            transition: all 0.5s;
            border-bottom: 1px dashed #aaaaaa;

            .notice-item_footer {
                color: #666666;
                font-size: 13px;
            }

            .notice-item_footer p {
                display: flex;
                align-items: center;
            }

            .notice-item_footer span {
                margin: 0 5px;
            }

            .el-col {
                padding: 0 !important;
            }

            .notice-item_content {
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 15px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
            }
        }

    }

    .notice-item:hover {
        .notice-item_title {
            span:nth-child(2) {
                border-bottom: 2px solid #666666;
            }
        }

        .cover {
            transform: scale(1.02);
        }

    }
}
</style>
