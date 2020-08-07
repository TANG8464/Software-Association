<template>
  <div class="main">
    <div class="table remove">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-contextmenu="more"
        @row-dblclick="more"
        :cell-class-name="cellClassName"
        @cell-mouse-enter="onCellMouseEnter"
        @cell-mouse-leave="onCellMouseLeave"
      >
        <el-table-column type="selection" width="30" v-if="isShowDels"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <member-info :memberInfo="props.row"></member-info>
          </template>
        </el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:red;">
              <icon name="admin" scale="20" width="20" v-if="scope.row.isAdmin"></icon>
            </span>
            <span>{{scope.row.memberName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="id" label="成员号" width="100"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="学院">
          <template slot-scope="scope">
            <span>{{scope.row.institute?scope.row.institute.institute_name:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="专业">
          <template slot-scope="scope">
            <span>{{scope.row.specialty?scope.row.specialty.specialty_name:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="班级">
          <template slot-scope="scope">
            <span>{{scope.row.iclass?scope.row.iclass.class_name:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="position.positionName" label="职位">
          <template slot-scope="scope">
            <span>{{scope.row.position?scope.row.position.positionName:'-'}}</span>
          </template>
        </el-table-column>
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
                批量删除
              </el-button>
            </div>
            <div v-if="isShowDels">
              <el-button type="danger" size="mini" round plain @click="removeMember()">确认</el-button>
              <el-button type size="mini" round plain @click="isShowDels=false">取消</el-button>
            </div>
          </template>
          <template slot-scope="scope">
            <div style="text-align:right;">
              <el-button
                v-if="scope.row.isAdmin"
                size="mini"
                type="danger"
                @click="changeAdmin(scope.row.id, 2)"
              >取消管理</el-button>
              <el-button v-else size="mini" @click="changeAdmin(scope.row.id,3)">设为管理</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;">
        <el-pagination
          @current-change="initTable"
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
      :memberInfo.sync="memberInfo"
      @updateMemberInfo="updateMemberInfo"
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
      memberInfo: null,
      selected: [],
      isShowDels: false,
      menuItem: ['修改', '移出协会', '加入黑名单', '永久删除'],
      selectedRow: null,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.initTable(1)
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
          this.openEditDialog(this.selectedRow)
          break
        case 1:
          this.updateMemberFlag(this.selectedRow.id, 1)
          break
        case 2:
          this.updateMemberFlag(this.selectedRow.id, 2)
          break
        case 3:
          this.removeMember(this.selectedRow.id)
      }
    },
    async initTable(val) {
      const { data: res } = await this.$http.get('member/search', {
        params: {
          flag: 0,
          curPage: val,
        },
      })
      if (res.code != 200) {
        this.$message.error(res.message)
      } else {
        this.tableData = res.data.records
        this.pagenum = res.data.current
        this.total = res.data.total
        this.pagesize = res.data.size
        this.tableData.forEach((item) => {
          item.isAdmin = item.roles.some((i) => {
            if (i.roleId === 3) return true
          })
          item.isHover = false
        })
      }
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
    },
    onCellMouseEnter(row, column, cell, event) {
      this.tableData[row.index].isHover = true
    },
    onCellMouseLeave(row, column, cell, event) {
      this.tableData[row.index].isHover = false
    },
    openEditDialog(row) {
      this.memberInfo = row
      this.isOpenUpdateInfo = true
    },
    handleSelectionChange(val) {
      this.checkeds = val.length
      val.forEach((item) => {
        this.selected.push(item.id)
      })
    },
    async updateMemberInfo() {
      const { data } = await this.$axios.put(`member/${this.memberInfo.id}`, this.memberInfo)
      if (data.code === 200) {
        this.$message.success('修改成功')
        this.initTable(this.pagenum)
      } else {
        this.$message.error(data.message)
      }
    },
    async removeMember(id) {
      let resData = []
      if (id) resData.push(id)
      else if (this.selected.length === 0) {
        this.$message.warning('请先选择成员!')
        return
      } else {
        resData = this.selected
      }
      const confirmresult = await this.$confirm(
        `此操作将永久删除${id ? '该成员' : '这' + resData.length + '名成员'}`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmresult == 'confirm') {
        const { data: res } = await this.$http.delete('member/', {
          data: resData,
        })
        if (res.code !== 200) {
          this.$message.error('删除失败!')
        } else {
          this.$message.success('删除成功!')
          this.initTable(this.pagenum)
        }
      } else {
        this.$message.info('已取消删除')
      }
    },
    async updateMemberFlag(id, status) {
      const { data } = await this.$axios.put(`/member/${id}/flag/${status}`)
      console.log(data)
      if (data.code === 200) {
        this.initTable(this.pagenum)
      } else this.$message.error(data.message)
    },
    async changeAdmin(id, role) {
      const putData = [role]
      const { data } = await this.$axios.put(`member/authority/${id}`, putData)
      if (data.code === 200) {
        this.initTable(this.pagenum)
      } else {
        this.$message.error(data.message)
      }
    },
  },
}
</script>
<style scoped>
.el-pagination {
  margin-top: 15px;
}

.operation span {
  display: inline-block;
  margin: 0 5px;
  color: #909399;
}
</style>