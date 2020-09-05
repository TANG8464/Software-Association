<template>
  <div class="record">
    <div class="book-record_search">
      <span class="text">项目</span>
      <el-select v-model="selected" placeholder="请选择">
        <el-option label="书籍名称" value="bookName"></el-option>
        <el-option label="借书人用户名" value="memberId"></el-option>
        <el-option label="借书人姓名" value="memberName"></el-option>
        <el-option label="0 全部，1 已归还，2 未归还" value="flag"></el-option>
      </el-select>
      <span class="text">值</span>
      <el-input v-model="value" placeholder="请输入内容" class="size"></el-input>
      <span
        :style="{'display':size.isSmallSize?'block':'inline','text-align':'right'}"
        style="width:100%"
      >
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-search"
          class="magrin"
          @click="query()"
        >查询</el-button>
      </span>
      <el-divider></el-divider>
      <div class="menu">
        <el-table
          :data="bookData"
          style="width: 100%"
          :default-sort="{prop: 'bdate', order: 'descending'}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="书籍名称:">
                  <span>{{ props.row.book.bookName}}</span>
                </el-form-item>
                <el-form-item label="书籍类型:">
                  <span>{{ props.row.book.bookCategory.bookCategoryName }}</span>
                </el-form-item>
                <el-form-item label="书籍条码:">
                  <span>{{ props.row.book.id }}</span>
                </el-form-item>
                <el-form-item label="作者:">
                  <span>{{ props.row.book.author }}</span>
                </el-form-item>
                <el-form-item label="入库日期:">
                  <span>{{ props.row.book.inDate }}</span>
                </el-form-item>
                <el-form-item label="ISBN:">
                  <span>{{ props.row.book.isbn }}</span>
                </el-form-item>
                <el-form-item label="价格:">
                  <span>{{ props.row.book.price }}</span>
                </el-form-item>
                <el-form-item label="剩余册数:">
                  <span>{{ props.row.book.count }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="bdate" label="借出日期" width="150" align="center" sortable></el-table-column>
          <el-table-column prop="dueDate" label="应还日期" width="150" align="center"></el-table-column>
          <el-table-column prop="rdate" label="归还日期" width="150" align="center"></el-table-column>
          <el-table-column prop="overday" label="逾期天数" width="100" align="center"></el-table-column>
          <el-table-column prop="book.bookName" label="书刊名称" width="170" align="center"></el-table-column>
          <el-table-column prop="book.id" label="书刊条码" width="120" align="center"></el-table-column>
          <el-table-column prop="member.memberName" label="借书人姓名" width="120" align="center"></el-table-column>
          <el-table-column prop="member.id" label="借书人用户名" width="120" align="center"></el-table-column>
          <el-table-column label="操作" width="80" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="retrunRow(scope.row.id)"
                type="text"
                size="small"
                :disabled="scope.row.rdate=='未归还'?false:true"
              >还书</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="float:right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10,15,20,25,30]"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { timeDate } from '../../../tools/transformationDate'
import token from '@/utils/token'
export default {
  created() {
    this.getToken()
    this.getData()
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
  methods: {
    getToken() {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = token.getHeaderToken()
    },
    async query() {
      console.log(this.selected + '  ' + this.value)
      const { data: res } = await this.$http.get(
        'bookborrow/search' + '?' + this.selected + '=' + this.value,
        {
          headers: this.token,
        }
      )
      if (res.code == 200) {
        if (res.data.records == null || res.data.records == '' || res.data.records == []) {
          this.$message.error('没有查询出任何数据')
          return
        }

        this.bookData = res.data.records
        this.selected = ''
        this.value = ''
        this.pagenum = res.data.current
        this.total = res.data.total
        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).dateTime
          i.book.inDate = timeDate(i.book.inDate * 1000).date
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
        this.$message.success('查询记录成功')
      }
    },
    async handleSizeChange(val) {
      this.pagesize = val
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
        params: { size: val },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
        this.pagenum = res.data.current
        this.bookData = res.data.records
        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).dateTime
          i.book.inDate = timeDate(i.book.inDate * 1000).date
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
      }
    },
    async handleCurrentChange(val) {
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
        params: { curPage: val },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
        this.pagenum = res.data.current
        this.bookData = res.data.records

        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).dateTime
          i.book.inDate = timeDate(i.book.inDate * 1000).date
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
      }
    },
    async getData() {
      const { data: res } = await this.$http.get('bookborrow/search', {
        headers: this.token,
      })
      if (res.code == 200) {
        this.pagenum = res.data.current
        this.total = res.data.total
        this.bookData = res.data.records
        this.bookData.forEach((i) => {
          let date1 = new Date(i.bdate * 1000)
          i.bdate = timeDate(i.bdate * 1000).dateTime
          i.book.inDate = timeDate(i.book.inDate * 1000).date
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
      }
    },
    async retrunRow(id) {
      const confirmresult = await this.$confirm('是否归还此书籍?', '还书', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult == 'confirm') {
        const { data: res } = await this.$http.post('bookborrow/return' + '?' + 'id=' + id)
        if (res.code != 200) {
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