<template>
<el-table class="apply-table" :data="table" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255, 255, 255, 0.8)">
    <el-table-column width="45">
        <template>
            <icon name="word" scale="30" width="30"></icon>
        </template>
    </el-table-column>
    <el-table-column label="文件名">
        <template slot-scope="scope">
            <el-link type="info" @click="download(scope.row.id)">{{scope.row.resourceName}}</el-link>
        </template>
    </el-table-column>
    <el-table-column label="申请人" prop="author"></el-table-column>
    <el-table-column label="申请时间">
        <template slot-scope="scope">
            <span>{{scope.row.uploadDate|dataFormatter}}</span>
        </template>
    </el-table-column>
    <el-table-column width="100">
        <template slot-scope="scope">
            <el-dropdown @command="updateApply">
                <span class="el-dropdown-link">
                    审核
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="activePane!=1" :command="{'afterStatus':1,'row':scope.row}">通过</el-dropdown-item>
                    <el-dropdown-item v-if="activePane!=-1" :command="{'afterStatus':-1,'row':scope.row}">不通过</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import {
    download
} from '@/api/resource'
import {
    adminSendMsg
} from '@/api/message'
import {
    adminUpdateApply
} from '@/api/join'
import {
    dataFormatter
} from '@/filters'
import dateInfo from '@/utils/dateInfo'
export default {
    props: {
        table: {
            type: Array,
            require: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        activePane: {
            type: String,
            require: true,
        },
    },
    methods: {
        //下载申请书
        async download(id) {
            const data = await download(id)
            if (data.code === 200) {
                let link = document.createElement('a')
                link.href = data.data
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        },
        async updateApply(command) {
            const data = await adminUpdateApply(command.afterStatus, Number(this.activePane), command.row.id)
            if (data.code === 200) {
                const action = '系统消息'
                const title = command.afterStatus === 1 ? '申请成功' : '申请失败'
                const content =
                    command.afterStatus === 1 ?
                    '您提交的入会申请已通过，请耐心等待面试考试通知' :
                    '您提交的入会申请未通过，请按照要求删除已提交文件后重新提交'
                this.sendMsg(
                    action,
                    `<p>To ${command.row.author}</p><p>${content}</p><p style="text-align:right;">软件协会</p><p style="text-align:right;">${dateInfo.nowDate}</p>`,
                    title, [command.row.memberId]
                )
                this.$emit('refresh')
            } else this.$message.error(data.message)
        },
        async sendMsg(action, content, title, userIds) {
            const data = await adminSendMsg({
                action,
                content,
                title,
                userIds,
            })
            if (data.code !== 200) this.$message.error(data.message)
        },
    },
    filters: {
        dataFormatter,
    },
}
</script>

<style>
.apply-table {
    min-height: 500px;
}
</style>
