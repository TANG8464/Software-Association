<template>
<div class="resUpload-allRes">
    <!--查询资源的条件-->
    <query-condition :searchData="searchData" :total="allRes.total" @setSearchContent="setSearchContent" @search="setAllRes" ref="queryCondition"></query-condition>
    <!--所有资源数据-->
    <all-res-data :allRes="allRes.records" :loading="loading" @setAllRes="setAllRes" ref="allResData"></all-res-data>
    <!--分页-->
    <div class="block">
        <el-pagination @current-change="handleCurrentChange" :hide-on-single-page="true" :current-page.sync="allRes.current" :page-size="allRes.size" layout="prev, pager, next, jumper" :total="allRes.total"></el-pagination>
    </div>
</div>
</template>

<script>
import queryCondition from './QueryCondition'
import allResData from './AllResData'
export default {
    data() {
        return {
            allRes: [], //所有资源数据
            searchData: {
                //查询条件
                limit: 10,
                resourceName: null, //模糊查询文件名
                resourceCategoryId: null,
                currPage: 1,
                type: '3',
                status: '-1',
            },
            loading: false,
        }
    },
    created() {
        this.setAllRes()
    },
    methods: {
        async setAllRes() {
            //设置所有资源数据
            let _this = this
            this.loading = true //开始载入动画
            let res = await this.$axios.get('/resources/page', {
                params: this.searchData,
            })
            if (res.data.code === 200) {
                setTimeout(function () {
                    _this.allRes = res.data.data
                    _this.loading = false
                }, 1000)
                this.searchData.resourceName = ''
            } else {
                this.$message.error({
                    message: res.data.message,
                })
            }

        },
        handleCurrentChange(val) {
            //当前页更换时
            this.searchData.currPage = val
            this.setAllRes()
        },
        setSearchContent(val) {
            //设置搜索内容
            this.searchData.resourceName = val
            this.setAllRes()
        },
    },
    components: {
        queryCondition,
        allResData,
    },
}
</script>

<style>
.el-input {
    margin: 0;
}

.el-pagination {
    padding: 15px 0;
    float: right;
}
</style>
