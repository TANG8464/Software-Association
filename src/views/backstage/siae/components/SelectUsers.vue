<template>
<div class="select-users">
    <el-table ref="multipleTable" height="300" :data="allMember" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column width="60">
            <template slot="header">
                <span>{{selectIds.length}}/{{allMember.length}}</span>
            </template>
            <template slot-scope="scope">
                <img width="30" height="30" style="border-radius:50%" :src="scope.row.avatarUrl" alt />
            </template>
        </el-table-column>
        <el-table-column prop="memberName">
            <template slot="header">
                <span>
                    <el-input style="width:100%;" v-model="condition.memberName" size="small" placeholder="请输入姓名搜索"></el-input>
                </span>
            </template>
            <template slot-scope="scope">
                <span>{{scope.row.memberName}}</span>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {
    updateMemberInfo,
    conditionSearch,
    downloadMemberInfo
} from '@/api/user'
export default {
    props: {
        userIds: {
            type: Array,
            require: true,
        },
    },
    data() {
        return {
            allMember: [],
            condition: {
                memberName: null,
                id: null,
                flag: 0,
                curPage: 1,
                classID: null,
                instituteID: null,
                specialtyID: null,
                size: 10000,
            },
            selectIds: [],
        }
    },
    watch: {
        'condition.memberName'() {
            this.setAllMember()
        },
        selectIds(newVal) {
            this.$emit('update:userIds', newVal)
        },
    },
    created() {
        this.setAllMember()
    },
    methods: {
        async setAllMember() {
            const data = await conditionSearch(this.condition)
            if (data.code === 200) {
                this.allMember = data.data.records
            } else this.$message.error(data.message)
        },
        handleSelectionChange(val) {
            this.selectIds = val.map((item) => {
                return item.id
            })
            console.log(this.selectIds)
        },
        onchange() {
            console.log(this.selectSearch)
        },
    },
}
</script>

<style>
</style>
