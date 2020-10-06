<template>
<div class="check">
    <p class="check-header">
        <el-link type="primary" @click="isOpenManage=true">入会设置</el-link>
    </p>
    <el-tabs v-model="activePane" type="card" @tab-click="handleClick">
        <el-tab-pane label="未审核" name="0"></el-tab-pane>
        <el-tab-pane label="审核通过" name="1"></el-tab-pane>
        <el-tab-pane label="审核未通过" name="-1"></el-tab-pane>
        <apply-table :table="apply.records" :loading="loading" @refresh="setApply" :activePane="activePane"></apply-table>
    </el-tabs>
    <div style="text-align:right">
        <el-pagination style="width:300px;display:inline-block;padding:0" @current-change="setApply" :current-page="apply.current" :page-sizes="[10,15,20,25,30]" :page-size="searchData.size" :total="apply.total" :hide-on-single-page="false"></el-pagination>
    </div>
    <apply-dialog :isOpen.sync="isOpenManage">
    </apply-dialog>
</div>
</template>

<script>
import {
    adminSearchApply
} from '@/api/join'

import ApplyTable from './components/ApplyTable'
import ApplyDialog from './components/ApplyDialog'
export default {
    components: {
        ApplyTable,
        ApplyDialog
    },
    data() {
        return {
            isOpenManage: false,
            apply: {},
            loading: false,
            activePane: '0',
            searchData: {
                curPage: 1,
                size: 10,
                status: 0
            }
        }
    },
    created() {
        this.setApply()
    },
    methods: {
        handleClick(tab, event) {
            this.searchData.status = Number(tab.name)
            this.setApply()
        },
        async setApply() {
            this.loading = true
            const data = await adminSearchApply(this.searchData)
            if (data.code === 200) {
                this.apply = data.data
                this.loading = false
            } else this.loading = false
        },
    },

}
</script>

<style lang="scss">
.check {
    .check-header {
        text-align: right;
    }
}
</style>
