<template>
  <div class>
    <div class="category">
      <category-table
        :categoryData="categoryData"
        @addTopNode="addTopNode"
        @handleAdd="handleAdd"
        @handleDelete="handleDelete"
      ></category-table>
      <el-dialog
        title="新增顶级分类"
        width="30%"
        class="add-event-dialog"
        :visible.sync="addTopVisible"
        size="tiny"
      >
        <el-form ref="addTopForm" :model="addTopForm">
          <el-form-item label="分类名称" prop="bookCategoryName">
            <el-input v-model="addTopForm.bookCategoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类号" prop="id">
            <el-input v-model="addTopForm.id"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addTopForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTopFormCancleBtn('addTopForm')">取 消</el-button>
          <el-button type="primary" @click="addTopFormSubmitBtn('addTopForm')">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="新增书籍分类"
        width="30%"
        class="add-event-dialog"
        :visible.sync="addEventdialogVisible"
        size="tiny"
      >
        <el-form ref="addEventForm" :model="addEventForm">
          <el-form-item label="父类id" prop="categoryID">
            <el-input v-model="addEventForm.categoryID" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" prop="bookCategoryName">
            <el-input v-model="addEventForm.bookCategoryName"></el-input>
          </el-form-item>
          <el-form-item label="分类号" prop="id">
            <el-input v-model="addEventForm.id"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addEventForm.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>
          <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import token from '@/utils/token'
import { getAllBooks } from '@/api/book'
import { getAllCategory, addBookCategory, deleteBookCategory } from '@/api/book/category'
import CategoryTable from './components/CategoryTable'
export default {
  components: {
    CategoryTable,
  },
  created() {
    this.getToken()
    this.getData()
  },
  data() {
    return {
      categoryData: [],
      token: {},
      addTopVisible: false,
      addTopForm: {
        bookCategoryName: '',
        id: '',
        remark: '',
      },
      addEventdialogVisible: false,
      addEventForm: {
        bookCategoryName: '',
        id: '',
        remark: '',
        categoryID: '',
      },
    }
  },
  methods: {
    getToken: function () {
      //获取登录时存储在localStorage中的header-Token，作为上传凭证
      this.token['HEADER-TOKEN'] = token.getHeaderToken()
    },
    async getData() {
      const res = await await getAllCategory()
      if (res.code !== 200) return
      for (let i in res.data) res.data[i].hasChildren = 'true'
      this.categoryData = res.data
    },
    addTopNode() {
      this.addTopVisible = true
    },
    handleAdd(index, row) {
      this.addEventForm.categoryID = row.id
      this.addEventdialogVisible = true
    },
    handleDelete(index, row) {
      this.$confirm('确定要删除该节点吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const data = await deleteBookCategory(row.id)
          if (data.code !== 200) {
            this.$message.error('删除失败')
          } else {
            console.log(this.categoryData);
            this.categoryData.splice(index, 1)
            this.$message.success('删除成功!')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    addTopFormSubmitBtn(formname) {
      this.$refs[formname].validate(async (valid) => {
        if (valid) {
          const dataPost = this.addTopForm
          const data = await addBookCategory(dataPost)
          if (data.code != 200) {
            this.$message.error(data.message)
          } else {
            
            this.$refs[formname].resetFields()
            this.$message.success('添加书籍类型成功')
            this.addTopVisible = false
            this.getData()
          }
        } else {
          return false
        }
      })
    },
    /*取消顶级节点新增 */
    addTopFormCancleBtn(formname) {
      this.addTopVisible = false
      this.$refs[formname].resetFields()
    },
    addEventFormSubmitBtn(formname) {
      this.$refs[formname].validate(async (valid) => {
        if (valid) {
          const dataPost = this.addEventForm
          const data = await addBookCategory(dataPost)
          if (data.code !== 200) return
          this.addEventdialogVisible = false
          this.$refs[formname].resetFields()
          this.$message.success('添加书籍类型成功')
        } else {
          return false
        }
      })
    },
    /*取消节点新增 */
    addEventFormCancleBtn(formname) {
      this.addEventdialogVisible = false
      this.$refs[formname].resetFields()
    },
  },
}
</script>

<style scoped>
</style>
