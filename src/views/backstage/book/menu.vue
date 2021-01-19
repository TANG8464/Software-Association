<template>
  <div>
    <div class="menu">
      <div class="book-menu_search">
        <!-- 条件查询 -->
        <span>项目</span>
        <el-select v-model="selected" placeholder="请选择">
          <el-option label="书籍名称" value="bookName"></el-option>
          <el-option label="作者" value="author"></el-option>
          <el-option label="书籍分类号" value="bookCategoryID"></el-option>
          <el-option label="书籍状态" value="flag"></el-option>
        </el-select>
        <span>值</span>
        <el-input
          v-if="selected != 'flag'"
          v-model="value"
          placeholder="请输入内容"
          style="max-width: 300px"
        ></el-input>
        <el-select v-else v-model="value" placeholder="请选择">
          <el-option
            v-for="item in bookFlag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 条件查询 -->
        <div style="float: right">
          <el-tooltip class="item" effect="dark" content="显示全部书籍" placement="top-end">
            <el-button type="primary" icon="el-icon-view" circle @click="getList()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="多条件查询" placement="top">
            <el-button
              type="success"
              icon="el-icon-search"
              circle
              @click="dialogFormVisible = true"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除选中书籍" placement="top-start">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteBook()"></el-button>
          </el-tooltip>
        </div>
      </div>
      <!-- 多条件查询 -->
      <el-dialog title="多条件查询" :visible.sync="dialogFormVisible" width="30%">
        <el-alert title="不填写默认显示全部书籍" type="info" :closable="false"></el-alert>
        <el-form ref="form" label-width="200px" :model="form" label-position="top">
          <el-form-item label="书籍名称" prop="bookName">
            <el-input v-model="form.bookName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书籍分类号" prop="bookCategoryID">
            <el-input v-model="form.bookCategoryID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="书籍状态" prop="flag">
            <el-select v-model="form.flag" placeholder="请选择">
              <el-option
                v-for="item in bookFlag"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cansol('form')">取 消</el-button>
          <el-button type="primary" @click="confirm('form')">确 定</el-button>
        </div>
      </el-dialog>
      <div class="del">
        <!-- 目录显示 -->
        <menu-table
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          @deleteRow="deleteBook"
          @borrowRow="borrowRow"
        ></menu-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
      ></el-pagination>

      <!-- 借书 -->
      <div class="borrow">
        <el-dialog title="借书" :visible.sync="dialogBorrowVisible" width="30%">
          <el-form ref="BorrowForm" label-width="100px" :model="BorrowForm" label-position="right">
            <el-form-item label="借书人" prop="memberID">
              <select-user :selectId.sync="BorrowForm.memberID"></select-user>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="BorrowForm.remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cansolBorrow('BorrowForm')">取 消</el-button>
            <el-button type="primary" @click="confirmBorrow('BorrowForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 借书 -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { timeDate } from '../../../tools/transformationDate'
import axios from 'axios'
import menuRules from '@/utils/rules'
import { deleteBook, getAllBooks } from '@/api/book'
import { bookBorrow } from '@/api/book/borrow'
import MenuTable from './components/MenuTable'
import SelectUser from '@/components/SelectUser'
export default {
  components: {
    MenuTable,
    SelectUser,
  },
  data() {
    return {
      // 条件查询
      selected: null,
      value: null,
      // 分页
      pagenum: 1,
      pagesize: 10,
      total: 10,
      tableData: [], // 书籍列表
      //多条件查询
      dialogFormVisible: false, //多条件查询框是否显示
      form: {
        author: null,
        bookCategoryID: null,
        bookName: null,
        flag: null,
        pageNum: null,
      },

      //规则
      rules: menuRules,
      multipleSelection: [], //多选

      //借书
      dialogBorrowVisible: false, //借书对话框
      BorrowForm: {
        memberID: null,
        remark: null,
      },
      currentId: null,
      //书籍状态
      bookFlag: [
        {
          label: '在库',
          value: 0,
        },
        {
          label: '全部借出',
          value: 1,
        },
        {
          label: '遗失',
          value: 2,
        },
      ],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.getList()
  },
  watch: {
    value(newVal) {
      if (newVal) this.query()
    },
  },
  methods: {
    // 取消多条件查询
    cansol(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    //确认多条件查询
    async confirm(form) {
      const res = await getAllBooks(this.form)
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      const { data } = res
      this.tableData = data.records
      this.pagenum = data.current
      this.total = data.total
      this.$refs[form].resetFields()
      this.dialogFormVisible = false
    },
    // 多条件查询
    async query() {
      if (!this.selected) {
        this.$message.warning('请选择查询项')
        return
      }
      const str = `{"${this.selected}":"${this.value}"}`
      const data = await getAllBooks(JSON.parse(str))
      if (data.code !== 200) {
        this.$message.error(data.message)
        return
      }
      const { records, current, total } = data.data
      ;[this.tableData, this.pagenum, this.total] = [records, current, total]
    },

    //借书
    borrowRow(id) {
      this.dialogBorrowVisible = true
      this.currentId = id
    },
    //取消借书
    cansolBorrow(formName) {
      this.$refs[formName].resetFields()
      this.dialogBorrowVisible = false
    },
    //确认借书
    async confirmBorrow() {
      const resData = this.BorrowForm
      resData.bookID = this.currentId
      const data = await bookBorrow(resData)
      if (data.code !== 200) {
        this.$message.error(data.message)
        return
      }
      this.$message.success('借书成功')
      this.getList()
      this.dialogBorrowVisible = false
    },
    // 分页
    async handleSizeChange(val) {
      this.pagesize = val
      this.getList()
    },
    async handleCurrentChange(val) {
      this.getList(val)
    },
    // 获取书籍列表
    async getList(curPage) {
      const data = await getAllBooks({
        curPage: curPage ? curPage : 1,
        size: this.pagesize,
      })
      if (data.code !== 200) return
      const { data: res } = data
      this.tableData = res.records
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].inDate = timeDate(this.tableData[i].inDate * 1000).dateTime
      }
      this.pagenum = res.current
      this.total = res.total
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    //删除书籍
    async deleteBook(id, index, table) {
      let resData = []
      if (id) resData.push(id)
      else {
        this.multipleSelection.forEach((item) => {
          resData.push(item.id)
        })
      }
      if (resData.length <= 0) {
        this.$message({
          message: '您还没有选择删除项哦',
          center: true,
          customClass: 'noChecked',
          iconClass: 'el-icon-warning',
        })
        return
      }
      const bookName = id ? `"${table[index].bookName}"` : `这${resData.length}本书`
      const confirmresult = await this.$confirm(`此操作将永久删除${bookName}, 是否继续?`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult !== 'confirm') {
        this.$message.info('已取消删除')
        return
      }
      const data = await deleteBook(resData)
      if (data.code !== 200) {
        this.$message.error('删除失败!')
        return
      }
      this.$message.success('删除成功!')
      if (id) table.splice(index, 1)
      else this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.menu {
  .book-menu_search {
    * {
      margin: 5px;
    }

    .el-select {
      margin-bottom: 15px;
    }

    .el-select,
    .el-input {
      display: inline-block;
      max-width: 300px;
      width: 100%;
    }
  }

  span {
    display: inline-block;
    font-weight: 600;
    color: #838b83;
    width: 50px;
  }

  .magrin {
    margin-left: 15px;
    margin-right: 15px;
  }

  .el-form--label-top .el-form-item__label {
    padding: 0 !important;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .el-form {
    margin-top: 1%;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .borrow .el-dialog {
    width: 200px;
  }

  .el-dialog {
    .el-select {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.menu {
  .el-dialog {
    min-width: 500px !important;
  }
}
</style>
