<template>
<div class="select-users">
    <div class="title">
        <span class="title-item">选择接收对象</span>
        <span class="title-item" style="text-align:right;">
            <el-select v-model="condition.flag" placeholder="请选择" style="width:100px;margin-right:3px" size="mini" @change="setAllMember()">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="协会内" :value="0"></el-option>
                <el-option label="协会外" :value="1"></el-option>
                <el-option label="黑名单" :value="2"></el-option>
            </el-select>
            <el-select style="width:100px" size="mini" v-model="condition.startYear" placeholder="请选择" @change="setAllMember()">
                <el-option label="全部" :value="null"></el-option>
                <el-option v-for="item in startYearList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </span>
    </div>
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
                    <el-input style="width:100%;" v-model="condition.memberName" size="small" placeholder="请输入姓名搜索" @change="setAllMember()"></el-input>
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
                startYear: 2019,
            },
            selectIds: [],
            startYearList: [],
        }
    },
    watch: {
        selectIds(newVal) {
            this.$emit('update:userIds', newVal)
        },
    },
    created() {
        this.initStartYear()
        this.setAllMember()
    },
    methods: {
        initStartYear() {
            const currentYear = new Date().getFullYear()
            for (let i = currentYear; i >= 2010; i--) {
                this.startYearList.push(i)
            }
        },
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
        },
    },
}
</script>

<style lang="scss">
.select-users {
    .title {
        padding: 0 10px;

        .title-item {
            width: 50%;
            display: inline-block;
        }
    }
}
</style>
