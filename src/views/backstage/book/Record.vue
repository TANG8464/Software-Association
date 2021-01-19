<template>
<div class="record">
    <div class="book-record_search">
        <span class="text">项目</span>
        <el-select v-model="selected" placeholder="请选择">
            <el-option label="书籍名称" value="bookName"></el-option>
            <el-option label="借书人用户名" value="memberId"></el-option>
            <el-option label="借书人姓名" value="memberName"></el-option>
            <el-option label="书籍状态" value="flag"></el-option>
        </el-select>
        <span class="text">值</span>
        <el-input v-if="selected!='flag'" v-model="value" placeholder="请输入内容" class="size"></el-input>
        <el-select v-else v-model="value" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="已归还" :value="1"></el-option>
            <el-option label="未归还" :value="2"></el-option>
        </el-select>
        <el-divider></el-divider>
        <div class="menu">
            <record-table :bookData="bookData" @retrunRow="retrunRow"></record-table>
            <el-pagination style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 15, 20, 25, 30]" :page-size="10" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
    </div>
</div>
</template>

<script>
import {
    timeDate
} from '../../../tools/transformationDate'
import token from '@/utils/token'
import {
    getAllBooks,
} from '@/api/book'
import {
    borrowSearch,
    bookReturn
} from '@/api/book/borrow'
import RecordTable from './components/RecordTable'
export default {
    components: {
        RecordTable
    },
    data() {
        return {
            selected: '',
            value: '',
            form: {
                bookName: '',
                bookId: 0,
            },
            pagenum: 1,
            pagesize: 10,
            total: 10,
            bookData: [],
            token: {},
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    watch: {
        value(newVal) {
            if (newVal) this.query()
        }
    },
    created() {
        this.getToken()
        this.getData()
    },
    methods: {
        getToken() {
            //获取登录时存储在localStorage中的header-Token，作为上传凭证
            this.token['HEADER-TOKEN'] = token.getHeaderToken()
        },
        async query() {
            const str = `{"${this.selected}":${this.value}}`
            this.getData(JSON.parse(str))
        },
        async handleSizeChange(val) {
            this.getData({
                size: val,
            })
        },
        async handleCurrentChange(val) {
            this.getData({
                curPage: val,
            })
        },
        async getData(params) {
            if (!params) params = {}
            const data = await borrowSearch(params)
            if (data.code !== 200) return
            const {
                data: res
            } = data
            this.pagenum = res.current
            this.total = res.total
            this.bookData = res.records
            this.bookData.forEach((i) => {
                let date1 = new Date(i.bdate * 1000)
                i.bdate = timeDate(i.bdate * 1000).dateTime
                i.inDate = timeDate(i.inDate * 1000).date
                date1.setDate(date1.getDate() + 15)

                let y = date1.getFullYear()
                let m = date1.getMonth() < 9 ? '0' + (date1.getMonth() + 1) : date1.getMonth() + 1
                let d = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()
                i.dueDate = y + '-' + m + '-' + d
                if (i.rdate == '' || i.rdate == null) {
                    i.rdate = '未归还'
                    if (Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
                        i.overday = 0
                    } else {
                        i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
                    }
                } else {
                    if (Math.round((date1 - new Date(i.rdate)) / (1 * 24 * 60 * 60 * 1000)) >= 0) {
                        i.overday = 0
                    } else {
                        i.overday = -Math.round((date1 - new Date()) / (1 * 24 * 60 * 60 * 1000))
                    }
                    i.rdate = timeDate(i.rdate * 1000).date
                }
            })
        },
        async retrunRow(id) {
            const confirmresult = await this.$confirm('是否归还此书籍?', '还书', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).catch((err) => err)
            if (confirmresult == 'confirm') {
                const data = await bookReturn(id)
                if (data.code != 200) {
                    this.$message.error('还书失败')
                } else {
                    this.$message.success('还书成功')
                    this.getData()
                }
            } else {
                this.$message.info('已取消')
            }
        },
    },
}
</script>

<style scoped>
.book-record_search * {
    margin: 5px;
}

.record .el-select,
.record .el-input {
    display: inline-block;
    max-width: 300px;
    width: 100%;
}

.record span {
    display: inline-block;
    font-weight: 600;
    color: #838b83;
    width: 50px;
}

.main {
    padding: 40px 80px;
}

.el-input {
    width: 300px;
    margin-right: 2%;
}

.left {
    float: left;
}

.right {
    float: right;
}

.text {
    margin-left: 1%;
    margin-right: 1%;
}

/* .el-form {
  width: 80%;
} */
.el-form-item {
    width: 30%;
}

.menu {
    margin-top: 5px;
}
</style>
