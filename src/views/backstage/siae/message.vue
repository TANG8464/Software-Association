<template>
<div class="message">
    <div class="header">
        <el-button size="mini" @click="openSend">发个通知</el-button>
        <el-input style="width: 260px; margin-left: 5px" size="mini" placeholder="请输入消息标题" v-model="title" @keypress.enter.native="setAllMessage(1)"></el-input>
    </div>
    <el-table class="remove" :data="allMessage" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55" v-if="isShowDels"></el-table-column>
        <el-table-column type="expand">
            <template slot-scope="props">
                <h3>{{ props.row.title }}</h3>
                <p v-html="props.row.content"></p>
                <p style="text-align: right; font-size: 13px">
                    {{ props.row.createTime | dataFormatter }}
                </p>
            </template>
        </el-table-column>
        <el-table-column align="right" width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.member">
                    <img style="border-radius: 5px" :src="scope.row.member.avatarUrl" width="40" height="40" />
                </span>
            </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in headers" :key="index" :prop="item.prop" :label="item.label" :width="item.width" align="center"></el-table-column>
        <el-table-column align="right" width="150">
            <template slot="header">
                <el-button type="danger" size="mini" round plain v-if="!isShowDels" @click="isShowDels = true">
                    <i class="el-icon-delete"></i>
                    批量删除
                </el-button>
                <div v-if="isShowDels">
                    <el-button type="danger" size="mini" round plain @click="deleteMsg(dels)">确认</el-button>
                    <el-button type size="mini" round plain @click="isShowDels = false">取消</el-button>
                </div>
            </template>
            <template slot-scope="scope">
                <span style="margin-right: 8px; font-size: 18px" @click="openUpdate(scope.row)">
                    <i class="el-icon-edit"></i>
                </span>
                <span style="color: #f56c6c; font-size: 18px" @click="deleteMsg(scope.row.id)">
                    <i class="el-icon-delete"></i>
                </span>
            </template>
        </el-table-column>
    </el-table>
    <span style="text-align: right">
        <el-pagination :page-size="pagination.pageSize" :pager-count="5" :current-page="pagination.current" layout="prev, pager, next" :total="pagination.total" @current-change="setAllMessage" :hide-on-single-page="true"></el-pagination>
    </span>
    <el-dialog :title="dialog.title" :visible.sync="isOpenDialog" style="min-width: 350px" :width="dialog.isSend ? '60%' : '30%'" :fullscreen="size.isSmallSize">
        <el-form :model="formData" :key="formData.key" status-icon ref="formData" label-position="top" class="demo-formData">
            <el-row :gutter="24">
                <el-col :lg="dialog.isSend ? 12 : 24" :sm="24" :xs="24">
                    <el-form-item prop="action" label="消息类型">
                        <el-select v-model="formData.action" placeholder="请选择" style="width: 100%">
                            <el-option v-for="(item, index) in msgType" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="title" label="消息标题">
                        <el-input v-model="formData.title" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="content" label="消息内容">
                        <edit ref="edit" v-model="formData.content" :toolbarButtons="toolbarButtons" height="150" placeholderText="请在此输入消息内容"></edit>
                    </el-form-item>
                </el-col>
                <el-col :lg="12" :sm="24" :xs="24">
                    <el-form-item v-if="dialog.isSend" prop="userIds">
                        <select-users :userIds.sync="formData.userIds"></select-users>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('formData')">重置</el-button>
            <el-button type="primary" @click="submitForm()">{{ dialog.type }}</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import Edit from '@/components/FroalaEdit'
import SelectUsers from '@/components/SelectUsers'
import {
    searchAllMessage,
    adminSendMsg,
    adminUpdateMsg,
    adminDeleteMsg
} from '@/api/message'
import {
    dataFormatter
} from '@/filters'
export default {
    components: {
        SelectUsers,
        Edit,
    },
    data() {
        return {
            allMessage: [],
            loading: false,
            headers: [{
                    label: '发布者',
                    prop: 'member.memberName',
                    width: '150',
                },
                {
                    label: '消息类型',
                    prop: 'action',
                    width: '150',
                },
                {
                    label: '消息标题',
                    prop: 'title',
                    width: null,
                },
                {
                    label: '已读人数',
                    prop: 'readCount',
                    width: '80',
                },
                {
                    label: '未读人数',
                    prop: 'notReadCount',
                    width: '80',
                },
            ],
            msgType: ['系统消息', '成功消息', '失败消息'],
            currPage: 1,
            limit: 10,
            title: null,
            pagination: {},
            isShowDels: false,
            dels: [],
            isOpenDialog: false,
            dialog: {},
            formData: {
                key: 0
            },
            toolbarButtons: [
                'fontFamily',
                'fontSize',
                'color',
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'fullscreen',
            ],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        title(newVal) {
            if (!newVal) {
                this.setAllMessage(1)
            }
        },
    },
    created() {
        this.setAllMessage()
    },
    methods: {
        async setAllMessage(currPage) {
            this.loading = true
            this.currPage = currPage
            const res = await searchAllMessage(null, currPage || this.currPage, this.limit, this.title)
            if (res.code === 200) {
                const {
                    data
                } = res
                this.allMessage = data.records
                this.pagination = {
                    total: data.total,
                    current: data.current,
                    pageSize: data.size,
                }
            } else this.$message.error(res.message)
            this.loading = false
        },

        handleSelectionChange(val) {
            this.dels = val.map((item) => {
                return item.id
            })
        },
        openSend() {
            this.isOpenDialog = true
            this.dialog = {
                title: '发送通知',
                type: '发送',
                isSend: true,
            }
        },
        openUpdate(row) {
            this.isOpenDialog = true
            this.formData = row
            this.dialog = {
                title: '修改通知',
                type: '修改',
                isSend: false,
            }
        },
        async submitForm() {
            let data
            if (this.formData.id) data = await adminUpdateMsg(this.formData)
            else data = await adminSendMsg(this.formData)
            if (data.code === 200) {
                this.$message.success(this.formData.id ? '修改成功' : '发送成功')
                this.setAllMessage(this.currPage)
                this.isOpenDialog = false
                this.resetForm('formData')
            } else this.$message.error(data.message)
        },
        async deleteMsg(arr) {
            let ids = []
            if (Array.isArray(arr)) ids = arr
            else ids.push(arr)
            if (ids.length > 0) {
                this.$confirm(`此操作将永久删除这${ids.length}条通知, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(async () => {
                        const data = await adminDeleteMsg(ids)
                        if (data.code === 200) {
                            this.isShowDels = false
                            this.$message.success('删除成功')
                            this.setAllMessage(this.currPage)
                        } else this.$message.error(data.message)
                    })
                    .catch(() => {})
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.formData.userIds = null
            this.formData.content = null
            //解决渲染失败问题
            this.formData.key++

        },
    },
    filters: {
        dataFormatter,
    },
}
</script>

<style lang="scss">
.message {
    .header {
        text-align: right;
    }

    .el-form--label-top .el-form-item__label {
        padding: 0;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    .el-form-item__content {
        line-height: normal;
    }
}
</style>
