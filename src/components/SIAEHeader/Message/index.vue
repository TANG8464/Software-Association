<template>
<div class="massage">
    <div class="content" :style="{'padding':`0 ${size.isSmallSize?10:300}px`,'padding-top':`${size.isSmallSize?30:0}px`}">
        <p class="header">
            <span>消息通知({{total>999?'999+':total}})</span>
            <span v-if="total>0" class="icon" style="color: #fff;float:right">
                <span v-if="!isOpenMenu" style="margin-left:8px;" @click="isOpenMenu=true">
                    <icon name="menu-nav" scale="25" width="25"></icon>
                </span>
                <span v-else class="actions">
                    <span class="checked-all">
                        <span v-if="!isChecked" @click="isChecked=true">全选</span>
                        <span v-else @click="isChecked=false">取消全选</span>
                    </span>
                    <span class="checked">选中({{selectItem.length}})项</span>
                    <span class="delete" @click="deleteMsg(selectItem)">删除</span>
                    <span class="cancel" @click="isOpenMenu=false">取消</span>
                </span>
            </span>
        </p>
        <div class="msg-list" ref="msg-list" :style="{ height}">
            <div class="msg-item" v-for="(item,index) in msg" :key="item.id" @click="onselect(item,index)">
                <span class="unread" v-if="!item.state">&nbsp;</span>
                <div class="avatar-box">
                    <img class="avatar" :src="item.member.avatarUrl" alt />
                </div>
                <div class="msg-main">
                    <p class="msg-title">{{item.title}}</p>
                    <div class="msg-content" :class="{'not-open-msg':!item.isOpenMsg}" v-html="item.isOpenMsg?item.content:item.text">{{}}</div>
                    <p class="msg-action">
                        <span v-if="!item.isOpenMsg" @click="updateOpenMsg(index,true)">查看通知</span>
                        <span v-else @click="updateOpenMsg(index,false)">收起通知</span>
                    </p>
                    <p class="msg-footer">
                        <span>来自于{{item.member.memberName}}</span>
                        <span>{{item.createTime|dateFormatter}}</span>
                    </p>
                </div>
                <span class="actions">
                    <span class="close" @click="deleteMsg(item.id)">
                        <icon name="close" scale="20" width="20"></icon>
                    </span>
                </span>
            </div>
            <div class="loading" v-if="isLoading" data-disabled="disabled">加载中...</div>
            <div class="null" :style="{'line-height': height}" v-else-if="!msg||msg.length===0" data-disabled="disabled">暂无相关通知</div>
            <div class="loading-all" v-else-if="isAllLoad" data-disabled="disabled">已全部加载</div>
        </div>
        <div class="footer">
            <p class="close-msg" @click="$emit('update:isOpenMsg',false)">关闭通知</p>
        </div>
    </div>
</div>
</template>

<script>
import {
    dateFormatter
} from '@/filters'
import {
    searchMessage,
    updateMsgToRead,
    getUnreadCount,
    deleteMsg
} from '@/api/message'
export default {
    props: {
        isOpenMsg: {
            type: Boolean,
            require: true,
        },
        isLogin: {
            type: Boolean,
            require: true,
        },
        sysNoticeCount: {
            type: Number,
            require: true,
        },
    },
    data() {
        return {
            msg: [],
            scrollTop: 0,
            isLoading: false,
            isAllLoad: false,
            isToBottom: false,
            currPage: 1,
            limit: 10,
            time: 0,
            total: 0,
            //多选
            isOpenMenu: false,
            //全选
            isChecked: false,
            selectItem: [],
            currPageIndex: [],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        height() {
            return this.size.isSmallSize ? this.size.maxH - 230 + 'px' : this.size.maxH - 260 + 'px'
        },
    },
    watch: {
        isLogin(newVal) {
            if (!newVal) this.msg = []
        },
        isChecked(newVal) {
            this.selectItem = []
            const el = this.$refs['msg-list']
            if (newVal) {
                el.children.forEach((item, index) => {
                    if (!item.getAttribute('data-checked') && !item.getAttribute('data-disabled')) item.setAttribute('data-checked', true)
                })
                this.setSelectItem()
            } else {
                el.children.forEach((item) => {
                    if (item.getAttribute('data-checked')) item.removeAttribute('data-checked')
                })
            }
        },
        isOpenMenu(newVal) {
            const el = this.$refs['msg-list']
            if (!newVal) {
                this.selectItem = []

                el.children.forEach((item) => {
                    if (item.getAttribute('data-checked')) item.removeAttribute('data-checked')
                })
            }
        },
        sysNoticeCount() {
            this.searchMessage(1, this.currPage * this.limit, true)
        },
    },
    created() {
        this.searchMessage()
    },
    mounted() {
        const elM = this.$refs['msg-list']
        elM.onmousewheel = () => {
            if (elM.scrollTop !== 0) this.isToBottom = true
            else this.isToBottom = false
            if (this.isAllLoad) {
                return
            }
            const newDateTime = new Date().getTime()
            //解决数据未加载前多次调用
            if (this.scrollTop === elM.scrollTop && newDateTime - this.time > 1500) {
                this.currPage++
                this.searchMessage()
                this.time = newDateTime
            } else this.scrollTop = elM.scrollTop
        }
    },
    methods: {
        async searchMessage(currPage, limit, refresh) {
            this.isLoading = true
            if (this.isAllLoad && !refresh) return
            const res = await searchMessage(null, currPage || this.currPage, limit || this.limit)
            if (res.code === 200) {
                const {
                    data
                } = res
                this.total = data.total
                if (this.currPage * this.limit >= this.total) this.isAllLoad = true
                else this.isAllLoad = false
                data.records.forEach((item, i) => {
                    if (this.currPageIndex.includes(i)) item.isOpenMsg = true
                    else item.isOpenMsg = false
                })
                if (refresh) this.msg = data.records
                else this.msg = this.msg.concat(data.records)
            }
            this.isLoading = false
        },
        //
        async updateMsgToRead(id) {
            const data = await updateMsgToRead(id)
            if (data.code === 200) {
                this.searchMessage(1, this.currPage * this.limit, true)
                this.getUnreadCount()
            }
        },
        //获取未读数量
        async getUnreadCount() {
            const data = await getUnreadCount()
            if (data.code === 200) {
                this.count = data.data
                this.$emit('update:sysNoticeCount', this.count)
            }
        },
        //更新消息为查看状态或者收起状态
        async updateOpenMsg(index, state) {
            if (state) {
                if (!this.currPageIndex.includes(index)) this.currPageIndex.push(index)
            } else {
                if (this.currPageIndex.includes(index))
                    this.currPageIndex.splice(this.currPageIndex.indexOf(index))
            }
            if (state && !this.msg[index].state) await this.updateMsgToRead(this.msg[index].id)
            this.msg[index].isOpenMsg = state
        },
        //删除消息
        async deleteMsg(arr) {
            let ids = []
            if (Array.isArray(arr)) ids = arr
            else ids.push(arr)

            if (ids.length <= 0) {
                this.$message({
                    type: 'warning',
                    message: '您还没有选中删除项哦',
                    customClass: 'siae-msg',
                })
            } else {
                this.$confirm(`此操作将永久删除这${ids.length}条消息，不可撤销`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true,
                    })
                    .then(async () => {
                        const data = await deleteMsg(ids)
                        if (data.code === 200) {
                            this.searchMessage(1, this.currPage * this.limit, true)
                            this.getUnreadCount()
                            this.selectItem = []
                        }
                    })
                    .catch(() => {})
            }
        },
        //选中后改变样式
        onselect(item, index) {
            if (this.isOpenMenu) {
                const el = this.$refs['msg-list']
                const flag = el.children[index].getAttribute('data-checked')
                if (!flag) el.children[index].setAttribute('data-checked', true)
                else el.children[index].removeAttribute('data-checked')
                this.setSelectItem()
            }
        },
        //设置选中项的值
        setSelectItem() {
            this.selectItem = []
            const el = this.$refs['msg-list']
            el.children.forEach((item, index) => {
                if (!item.getAttribute('data-disabled') && item.getAttribute('data-checked')) this.selectItem.push(this.msg[index].id)
            })

        },
    },
    filters: {
        dateFormatter,
    },
}
</script>

<style lang="scss">
.massage {
    .content {
        overflow: hidden;

        .header {
            font-size: 20px;
            color: #fff;
            margin: 5px 0;

            .actions {
                font-size: 15px;

                span {
                    margin-left: 5px;
                }

                .delete {
                    color: #f37c7c;
                }

                .cancel {
                    color: rgb(123, 123, 123);
                }
            }
        }

        .read-all {
            font-size: 16px;
            color: rgb(123, 123, 123);
        }

        .msg-list {
            list-style: none;
            overflow: auto;

            .msg-item {
                position: relative;
                background-color: rgba(255, 255, 255, 0.876);
                padding: 10px 20px;
                border-radius: 5px;
                margin: 10px 0;

                p {
                    margin: 8px 0;
                }

                .msg-main {
                    display: inline-block;
                    width: 90%;
                    padding-left: 10px;
                    box-sizing: border-box;
                }

                .msg-title {
                    font-weight: 600;
                    font-size: 18px;
                }

                .msg-action {
                    cursor: pointer;
                    color: #1191e5;
                    font-size: 13px;
                }

                .not-open-msg {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .msg-footer {
                    text-align: right;
                    color: #666666;
                    font-size: 13px;
                    position: absolute;
                    bottom: 10px;
                    right: 10px;

                    span {
                        margin-left: 8px;
                    }
                }

                .actions {
                    position: absolute;
                    top: 10px;
                    right: 10px;

                    .read {
                        font-size: 13px;
                        color: #666666;
                        margin-right: 5px;
                    }
                }

                .unread {
                    position: absolute;
                    top: 5px;
                    left: 8px;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background-color: #f37c7c;
                    border-radius: 50%;
                }

                .avatar-box {
                    padding: 20px 0;
                    box-sizing: border-box;
                    width: 10%;
                    display: inline-block;
                    vertical-align: top;
                }

                .avatar {
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                    max-width: 60px;
                    max-height: 60px;
                }
            }

            div[data-checked] {
                background-color: rgba(255, 255, 255, 0.7);
            }

            .null {
                color: rgb(123, 123, 123);
                width: 100%;

                vertical-align: middle;
                text-align: center;
            }

            .loading,
            .loading-all {
                color: rgb(123, 123, 123);
                text-align: center;
            }
        }

        .footer {
            cursor: pointer;

            .close-msg {
                text-align: center;
                color: #fff;
            }
        }
    }
}

.el-message-box--center .el-message-box__content {
    padding: 25px;
}
</style>
