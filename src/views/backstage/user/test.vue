<template>
<div class="siae-test remove">
    <div class="header">
        <p style="text-align:right">
            <el-link type="primary" @click="downloadScoreLog">导出考核信息</el-link>
        </p>
        <el-date-picker class="date-picker" size="small" v-model="date" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
        <span class="other">
            <el-select style="width:100px;margin-right:10px;" v-model="searchItem" placeholder="请选择" size="small">
                <el-option label="成员号" :value="0"></el-option>
                <el-option label="成员名" :value="1"></el-option>
                <el-option label="考核名称" :value="2"></el-option>
            </el-select>
            <span style="width:200px;display:inline-block;margin-right:10px;">
                <el-input v-if="searchItem===0" placeholder="请输入成员号" v-model="searchData.memberId" size="small" @keypress.enter.native="setAllScore(1)"></el-input>
                <el-input v-if="searchItem===1" placeholder="请输入成员名" v-model="searchData.memberName" size="small" @keypress.enter.native="setAllScore(1)"></el-input>
                <el-input v-if="searchItem===2" placeholder="请输入考核名称" v-model="searchData.testName" size="small" @keypress.enter.native="setAllScore(1)"></el-input>
            </span>
            <el-button size="small" @click="isOpenAdd=true">添加考核信息</el-button>
        </span>
    </div>
    <el-table :data="allScore" style="width: 100%;min-height:514px" v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
        <el-table-column v-if="isShowDels" fill="#fbc4c4" type="selection" width="55"></el-table-column>
        <el-table-column v-for="(item,index) in header" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
        <el-table-column align="right">
            <template slot="header">
                <el-button type="danger" size="mini" round plain v-if="!isShowDels" @click="isShowDels=true">
                    <i class="el-icon-delete"></i>
                    批量删除
                </el-button>
                <div v-if="isShowDels">
                    <el-button type="danger" size="mini" round plain @click="deleteScore()">确认</el-button>
                    <el-button type size="mini" round plain @click="isShowDels=false">取消</el-button>
                </div>
            </template>
            <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="openUpdate(scope.row)">修改</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="text-align:right">
        <el-pagination style="width:300px;display:inline-block;padding:0" :page-size="pagination.pageSize" :pager-count="5" :current-page="pagination.current" layout="prev, pager, next" :total="pagination.total" @current-change="setAllScore" :hide-on-single-page="true"></el-pagination>
        <el-select style="width:80px;margin:0 10px;position:relative;top:5px" v-model="searchData.limit" placeholder="请选择" size="mini" @change="setAllScore(1)">
            <el-option :label="(item-1)*(item-1)*10+10" :value="(item-1)*(item-1)*10+10" v-for="item in 8" :key="item"></el-option>
        </el-select>
    </div>
    <div>
        <add-score :data.sync="addData" :isOpen.sync="isOpenAdd" :date.sync="datetime" :isBulk.sync="isBulk" @addScore="addScore" @uploadSuccess="setAllScore(searchData.currPage)"></add-score>
        <el-dialog title="修改考核信息" :visible.sync="isOpenUpdate" width="30%" :fullscreen="size.isSmallSize">
            <span>
                <score-form ref="scoreForm" :key="isOpenUpdate" :scoreForm.sync="select" :datetime.sync="datetime"></score-form>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm('scoreForm')">重 置</el-button>
                <el-button type="primary" @click="update()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
    <a ref="downloadScore"></a>
</div>
</template>

<script>
import AddScore from './components/AddScore'
import ScoreForm from './components/ScoreForm'
import {
    getAllScore,
    addScore,
    downloadScoreLog,
    updateScore,
    deleteScore
} from '@/api/user'
import dateInfo from '@/utils/dateInfo'
export default {
    components: {
        AddScore,
        ScoreForm,
    },
    data() {
        return {
            allScore: [],
            header: [{
                    label: '成员号',
                    prop: 'memberID',
                },
                {
                    label: '姓名',
                    prop: 'memberName',
                },
                {
                    label: '考核名称',
                    prop: 'testName',
                },
                {
                    label: '成绩',
                    prop: 'score',
                },
                {
                    label: '考试时间',
                    prop: 'testDate',
                },
            ],
            //日期快捷键
            pickerOptions: null,
            isOpenAdd: false,
            date: null,
            addData: {},
            //添加的考核时间
            datetime: null,
            isBulk: false,
            isOpenUpdate: false,
            //查询数据
            searchData: {
                currPage: 1,
                limit: 10,
                memberId: null,
                memberName: null,
                testName: null,
            },
            //查询项
            searchItem: 0,
            //查询的值
            searchValue: '',
            //分页数据
            pagination: {},
            loading: false,
            //导出考核信息的url地址
            downloadLink: '',
            select: {},
            isShowDels: false,
            dels: [],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        date(newVal) {
            this.searchData.beginTimeStamp = parseInt(newVal[0].getTime() / 1000)
            this.searchData.endTimeStamp = parseInt(newVal[1].getTime() / 1000)
            this.setAllScore(1)
        },
        searchItem(newVal) {
            this.searchData.memberId = null
            this.searchData.memberName = null
            this.searchData.testName = null
            this.setAllScore(1)
        },
        select(newVal) {
            console.log(newVal)
        },
    },
    mounted() {
        this.pickerOptions = dateInfo.pickerOptions
        this.setAllScore(1)
    },
    methods: {
        async setAllScore(currPage) {
            this.loading = true
            this.searchData.currPage = currPage
            const res = await getAllScore(this.searchData)
            if (res.code === 200) {
                const {
                    data
                } = res
                this.allScore = data.records
                this.pagination.total = data.total
                this.pagination.pageSize = data.size
                this.pagination.current = data.current
                this.loading = false
            } else this.$message.error(res.message)
        },
        async addScore() {
            this.addData.testDateTimeStamp = this.datetime.getTime() / 1000
            const data = await addScore(this.addData)
            if (data.code === 200) {
                this.setAllScore(this.searchData.currPage)
                this.$message.success('添加成功')
                return true
            } else this.$message.error(data.message)
            return false
        },
        async downloadScoreLog() {
            const data = await downloadScoreLog(this.searchData)
            const a = this.$refs.downloadScore
            a.href = window.URL.createObjectURL(data)
            a.download = '考核信息'
            a.click()
        },
        openUpdate(row) {
            this.select = row
            this.datetime = new Date(this.select.testDateTimeStamp * 1000)
            this.isOpenUpdate = true
            console.log(row)
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        async update() {
            this.select.testDateTimeStamp = this.datetime.getTime() / 1000
            const data = await updateScore(this.select.scoreId, this.select)
            if (data.code === 200) {
                this.isOpenUpdate = false
                this.setAllScore(this.searchData.currPage)
                this.$message.success('修改成功')
            } else this.$message.error(data.message)
        },
        handleSelectionChange(val) {
            this.dels = val.map((item) => {
                return item.scoreId
            })
        },
        async deleteScore() {
            if (this.dels.length > 0) {
                this.$confirm(`此操作将永久删除这${this.dels.length}条考核信息, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(async () => {
                        const data = await deleteScore(this.dels)
                        if (data.code === 200) {
                            this.isShowDels = false
                            this.$message.success('删除成功')
                            this.setAllScore(this.searchData.currPage)
                        } else this.$message.error(data.message)
                    })
                    .catch(() => {})
            }
        },
    },
}
</script>

<style lang="scss">
.siae-test {
    .date-picker {
        max-width: 300px;
    }

    .other {
        display: inline-block;
        width: 73.9%;
        text-align: right;
    }

    .el-select {
        box-sizing: border-box;
    }
}
</style>
