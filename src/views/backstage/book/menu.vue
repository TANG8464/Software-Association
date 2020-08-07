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
          <el-option label="0 在库，1 全部借出，2 遗失" value="flag"></el-option>
        </el-select>
        <span>值</span>
        <el-input v-model="value" placeholder="请输入内容" style="max-width:300px"></el-input>
        <span
          :style="{'display':size.isSmallSize?'block':'inline','text-align':'right'}"
          style="width:100%"
        >
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-search"
            class="magrin search_btn"
            style="display:inline"
            @click="query()"
          >查询</el-button>
        </span>

        <!-- 条件查询 -->
        <el-tooltip class="item" effect="dark" content="显示全部书籍" placement="top-end">
          <el-button type="primary" icon="el-icon-view" circle @click="getList()"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="多条件查询" placement="top">
          <el-button type="success" icon="el-icon-search" circle @click="dialogFormVisible = true"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除选中书籍" placement="top-start">
          <el-button type="danger" icon="el-icon-delete" circle @click="deleteBook()"></el-button>
        </el-tooltip>
      </div>

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
          <el-form-item label="0 在库，1 全部借出，2 遗失" prop="flag">
            <el-input v-model="form.flag" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cansol('form')">取 消</el-button>
          <el-button type="primary" @click="confirm('form')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 多条件查询 -->

      <div class="del">
        <!-- 目录显示 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          :row-style="{height:'10px'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="删除" width="50">
            <template slot-scope="scope">
              <icon
                name="remove"
                scale="20"
                width="18"
                @click="deleteRow(scope.row.id,scope.$index,tableData)"
              ></icon>
            </template>
          </el-table-column>
          <el-table-column align="center" label="书籍封面">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" width="55" height="70" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isbn" label="ISBN" width="180" sortable></el-table-column>
          <el-table-column align="center" prop="id" label="书刊条码" width="120" sortable></el-table-column>
          <el-table-column align="center" prop="bookName" label="书刊名称" width="180" sortable></el-table-column>
          <el-table-column align="center" prop="author" label="作者" width="150" sortable></el-table-column>
          <el-table-column align="center" prop="bookCategory.id" label="分类号" width="100" sortable></el-table-column>
          <el-table-column
            align="center"
            prop="bookCategory.bookCategoryName"
            label="分类名称"
            width="150"
            sortable
          ></el-table-column>
          <el-table-column align="center" prop="price" label="价格" width="100" sortable></el-table-column>
          <el-table-column align="center" prop="count" label="剩余册数" width="120" sortable></el-table-column>
          <el-table-column align="center" prop="inDate" label="入库日期" width="180" sortable></el-table-column>
          <el-table-column align="center" label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="borrowRow(scope.row.id)"
                type="text"
                size="small"
                :disabled="scope.row.count>0?false:true"
              >借书</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 目录显示 -->
      </div>

      <!-- 分页 -->
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
      <!-- 分页 -->

      <!-- 借书 -->
      <div class="borrow">
        <el-dialog title="借书" :visible.sync="dialogBorrowVisible">
          <el-form ref="BorrowForm" label-width="100px" :model="BorrowForm" label-position="right">
            <el-form-item label="借书人用户名" prop="memberID">
              <el-input v-model="BorrowForm.memberID" autocomplete="off"></el-input>
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
import token from '@/utils/token'
export default {
  data() {
    // 判断数字是是否大于0
    var checkNum = (rule, value, callback) => {
      if (value <= 0) {
        callback(new Error('必须大于0'))
      } else {
        callback()
      }
    }
    // 判断数字是是否大于0

    return {
      // 条件查询
      selected: '',
      value: '',
      // 条件查询

      // 分页
      pagenum: 1,
      pagesize: 10,
      total: 10,
      // 分页

      tableData: [], // 书籍列表

      //多条件查询
      dialogFormVisible: false, //多条件查询框是否显示
      form: {
        author: '',
        bookCategoryID: '',
        bookName: '',
        flag: '',
        pageNum: null,
      },
      //多条件查询

      //规则
      rules: {
        bookName: [{ required: true, message: '书名不能为空' }],
        author: [{ required: true, message: '作者不能为空' }],
        isbn: [{ required: true, message: 'ISBN号不能为空' }],
        price: [
          { required: true, message: '价格不能为空' },
          { type: 'number', message: '价格必须为数字' },
          { validator: checkNum, trigger: 'blur' },
        ],
        bookCategoryID: [{ required: true, message: '分类号不能为空' }],
        count: [
          { required: true, message: '数量不能为空' },
          { type: 'number', message: '数量必须为数字值' },
          { validator: checkNum, trigger: 'blur' },
        ],
      },
      //规则

      multipleSelection: [], //多选

      //借书
      dialogBorrowVisible: false, //借书对话框
      BorrowForm: {
        memberID: '',
        remark: '',
      },
      currentId: '',
      //借书

      token: {},
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.getList()
    this.getToken()
  },
  methods: {
    // 多条件查询
    cansol(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    async confirm(form) {
      if (this.form.author == '') this.form.author = null
      if (this.form.bookName == '') this.form.bookName = null
      if (this.form.flag == '') this.form.flag = null
      if (this.form.bookCategoryID == '') this.form.bookCategoryID = null
      const { data: res } = await this.$http.get('book/search', {
        params: this.form,
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.tableData = res.data.records
        this.pagenum = res.data.current
        this.total = res.data.total
        this.$message.success('查询书籍信息成功')
        this.$refs[form].resetFields()
        this.dialogFormVisible = false
      }
    },
    // 多条件查询

    // 条件查询
    async query() {
      if (this.selected) {
        const { data: res } = await this.$http.get(
          'book/search' + '?' + this.selected + '=' + this.value
        )
        if (res.code !== 200) {
          this.$message.error(res.message)
        } else {
          this.tableData = res.data.records
          this.pagenum = res.data.current
          this.total = res.data.total
          this.$message.success('查询书籍信息成功')
          this.selected = ''
          this.value = ''
        }
      } else {
        this.$message.warning('请选择查询项')
      }
    },
    // 条件查询

    // 删除书籍
    async deleteRow(id, index, table) {
      const resData = [id]

      const confirmresult = await this.$confirm('此操作将永久删除该书籍, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult == 'confirm') {
        const { data: res } = await axios.delete('book/', {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: resData,
        })
        if (res.code != 200) {
          this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          table.splice(index, 1)
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    // 删除书籍

    //借书
    borrowRow(id) {
      console.log(typeof id)
      this.dialogBorrowVisible = true
      this.currentId = id
    },
    cansolBorrow(fromName) {
      this.$refs[formName].resetFields()
      this.dialogBorrowVisible = false
    },
    async confirmBorrow(fromName) {
      let resData = {
        bookID: this.currentId,
        memberID: this.BorrowForm.memberID,
        remark: this.BorrowForm.remark,
      }
      const { data: res } = await this.$http.post('bookborrow/borrow', resData, {
        headers: this.token,
      })
      if (res.code != 200) {
        this.$message.error(res.message)
      } else {
        this.$message.success('借书成功')
        this.getList()
        this.dialogBorrowVisible = false
      }
    },
    //借书

    // 分页
    async handleSizeChange(val) {
      this.pagesize = val
      const { data: res } = await this.$http.get('book/search', {
        params: { size: val },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
        this.tableData = res.data.records
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].inDate = timeDate(this.tableData[i].inDate * 1000).dateTime
        }
        this.pagenum = res.data.current
      }
    },
    async handleCurrentChange(val) {
      const { data: res } = await this.$http.get('book/search', {
        params: { curPage: val },
      })
      if (res.code != 200) {
        console.log('查询失败')
      } else {
        this.tableData = res.data.records
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].inDate = timeDate(this.tableData[i].inDate * 1000).dateTime
        }
        this.pagenum = res.data.current
      }
    },
    // 分页

    // 获取书籍列表
    async getList() {
      const { data: res } = await this.$http.get('book/search', {
        params: {
          curPage: 1,
          size: this.pagesize,
        },
      })
      if (res.code != 200) {
        this.$message.error('获取书籍信息失败')
      } else {
        this.tableData = res.data.records
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].inDate = timeDate(this.tableData[i].inDate * 1000).dateTime
        }
        this.pagenum = res.data.current
        this.total = res.data.total
      }
    },
    // 获取书籍列表

    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //多选

    //删除选中的书籍
    async deleteBook() {
      let resData = []
      this.multipleSelection.forEach((item) => {
        resData.push(item.id)
      })
      if (resData.length <= 0) {
        this.$message({
          message: '您还没有选择删除项哦',
          center: true,
          customClass: 'noChecked',
          iconClass: 'el-icon-warning',
        })
        return
      }
      const confirmresult = await this.$confirm('此操作将永久删除选中书籍, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult == 'confirm') {
        console.log(resData)

        const { data: res } = await axios.delete('book/', {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data: resData,
        })
        if (res.code != 200) {
          this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          this.getList()
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    //删除选中的书籍

    getToken: function () {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = token.getHeaderToken
    },
  },
}
</script>
<style scoped>
.book-menu_search * {
  margin: 5px;
}
.el-select {
  margin-bottom: 15px;
}
.menu .el-select,
.menu .el-input {
  display: inline-block;
  max-width: 300px;
  width: 100%;
}
.menu span {
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
</style>