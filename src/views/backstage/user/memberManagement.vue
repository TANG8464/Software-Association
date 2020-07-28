<template>
  <div class="main">
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-contextmenu="more"
        @row-dblclick="more"
      >
        <el-table-column type="selection" width="30" v-if="isShowDels"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <member-info :memberInfo="props.row"></member-info>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="成员号" width="100"></el-table-column>
        <el-table-column prop="memberName" label="姓名"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="institute.institute_name" label="学院"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="specialty.specialty_name" label="专业"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="iclass.class_name" label="班级"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="position.positionName" label="职位"></el-table-column>
        <el-table-column width="150">
          <template slot="header">
            <div style="text-align:right;">
              <el-button
                type="danger"
                size="mini"
                round
                plain
                v-if="!isShowDels"
                @click="isShowDels=true"
              >
                <i class="el-icon-delete"></i>
                批量移除
              </el-button>
            </div>
            <div v-if="isShowDels">
              <el-button type="danger" size="mini" round plain @click="BulkDelete()">确认</el-button>
              <el-button type size="mini" round plain @click="isShowDels=false">取消</el-button>
            </div>
          </template>
          <template slot-scope="scope">
            <!--  <div class="operation" style="text-align:right;">
              <span @click="openeditDialog(scope.row.id,scope.row)">
                <icon name="edit" scale="20" width="20"></icon>
              </span>
              <span @click="deleteRow(scope.row.id,scope.$index,tableData)">
                <icon name="delete" scale="20" width="20"></icon>
              </span>
            </div>-->
            <el-button size="mini">设为管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-pagination
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
    <update-memberInfo
      :isOpenUpdateInfo.sync="isOpenUpdateInfo"
      :updateMemberInfo.sync="updateMemberInfo"
    ></update-memberInfo>
    <right-click-box :menu="menuItem" @open="open" ref="menuBox"></right-click-box>
  </div>
</template>
<script>
import MemberInfo from './components/MemberInfo'
import UpdateMemberInfo from './components/UpdateMemberInfo'
import RightClickBox from '@/components/RightClickBox'
export default {
  name: 'memberManage',
  components: {
    MemberInfo,
    UpdateMemberInfo,
    RightClickBox,
  },
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 10,
      checkeds: 0,
      isOpenUpdateInfo: false,
      updateMemberInfo: null,
      selected: [],
      isShowDels: false,
      menuItem: ['修改', '移出协会', '加入黑名单'],
      selectedRow: null,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.initTable()
  },
  methods: {
    more(row, column, event) {
      //打开更多选项设置
      event.preventDefault() //阻止弹出默认窗
      this.$refs.menuBox.more(event)
      this.selectedRow = row
    },
    open(index) {
      switch (index) {
        case 0:
          this.openeditDialog('', this.selectedRow)
          break
        case 1:
          this.deleteRow(this.selectedRow.id)
          break
      }
    },
    async initTable() {
      const { data: res } = await this.$http.get('member/search', {
        praams: {
          flag: 0,
        },
      })
      if (res.code != 200) {
        this.$message.error(res.message)
      } else {
        this.tableData = res.data.records
        this.pagenum = res.data.current
        this.total = res.data.total
        this.pagesize = res.data.size
      }
    },
    async handleSizeChange(val) {
      const { data: res } = await this.$http.get('member/search', {
        params: { size: val },
      })
      this.pagesize = res.data.size
    },
    async handleCurrentChange(val) {
      const { data: res } = await this.$http.get('member/search', {
        params: { pageNum: val },
      })
      this.tableData = res.data.records
      this.pagenum = res.data.current
    },
    openeditDialog(row) {
      this.updateMemberInfo = row
      this.isOpenUpdateInfo = true
    },
    async deleteRow(id) {
      let resData = [id]
      const confirmresult = await this.$confirm('此操作将永久删除该成员, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult == 'confirm') {
        const { data: res } = await this.$http.delete('member/', {
          data: resData,
        })
        if (res.code != 200) {
          this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          // table.splice(index, 1)
          this.initTable()
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    handleSelectionChange(val) {
      this.checkeds = val.length
      val.forEach((item) => {
        this.selected.push(item.id)
      })
    },
    async BulkDelete() {
      console.log(this.selected)
      if (this.selected.length == 0) {
        this.$message.warning('请先选择成员!')
        return
      }
      const confirmresult = await this.$confirm('此操作将永久删除该成员, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmresult == 'confirm') {
        console.log(this.selected)

        const { data: res } = await this.$http.delete('member/', {
          data: this.selected,
        })
        if (res.code != 200) {
          this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          this.initTable()
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
  },
}
</script>
<style scoped>
.el-pagination {
  margin-top: 15px;
}
.el-dialog .el-form-item {
  width: 40%;
}
.el-select {
  width: 205px;
}
.operation span {
  display: inline-block;
  margin: 0 5px;
  color: #909399;
}
</style>