<template>
  <div class="main">
    <div class="header" style="text-align: right">
      <el-link type="primary" @click="downloadMemberInfo">导出成员表</el-link>
    </div>
    <div class="table remove">
      <div style="width: 100%; text-align: right">
        <span style="float: left">
          <el-select
            v-model="condition.flag"
            placeholder="请选择"
            style="width: 180px; margin: 10px 0; text-align: center"
            size="small"
            @change="initTable()"
          >
            <el-option
              v-for="(item, index) in conditionFlagLabel"
              :key="index"
              :label="item"
              :value="index - 1"
            ></el-option>
          </el-select>
          <span style="margin: 0 5px"></span>
          <el-select
            style="width: 100px"
            size="small"
            v-model="condition.startYear"
            placeholder="请选择"
            @change="initTable"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in startYearList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </span>
        <el-select v-model="selectSearch" placeholder="请选择" style="width: 100px" size="small">
          <el-option label="姓名" value="memberName"></el-option>
          <el-option label="成员号" value="id"></el-option>
        </el-select>
        <el-input
          v-if="selectSearch === 'memberName'"
          style="min-width: 200px; width: 25%; margin: 10px"
          v-model="condition.memberName"
          size="small"
          placeholder="请输入姓名搜索"
        ></el-input>
        <el-input
          v-if="selectSearch === 'id'"
          style="min-width: 200px; width: 25%; margin: 10px"
          v-model="condition.id"
          size="small"
          placeholder="请输入成员号搜索"
        ></el-input>
        <condition-query :condition.sync="condition" @queryCondition="initTable"></condition-query>
      </div>
      <div>
        <member-table
          :tableData="tableData"
          :currentPosition="currentPosition"
          :loading="loading"
          @handleSelectionChange="handleSelectionChange"
          @more="more"
          @changePosition="changePosition"
          @removeMember="removeMember"
          @changeAdmin="changeAdmin"
        ></member-table>
        <div style="text-align: right">
          <el-pagination
            style="width: 300px; display: inline-block; padding: 0"
            @current-change="initTable"
            :current-page="currentPage"
            :page-sizes="[10, 15, 20, 25, 30]"
            :page-size="condition.size"
            layout="total, prev, pager, next"
            :total="total"
            :hide-on-single-page="true"
          ></el-pagination>
          <el-select
            style="width: 80px; margin: 0 10px; position: relative; top: 5px"
            v-model="condition.size"
            placeholder="请选择"
            size="mini"
            @change="initTable(1)"
          >
            <el-option
              :label="(item - 1) * (item - 1) * 10 + 10"
              :value="(item - 1) * (item - 1) * 10 + 10"
              v-for="item in 8"
              :key="item"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <update-memberInfo
      :isOpenUpdateInfo.sync="isOpenUpdateInfo"
      :memberInfo.sync="memberInfo"
      @updateMemberInfo="updateMemberInfo"
    ></update-memberInfo>
    <right-click-box :menu="menuItem" @open="open" ref="menuBox"></right-click-box>
    <add-experience
      :isOpenAddExperience.sync="isOpenAddExperience"
      :memberId.sync="selectMemberId"
    ></add-experience>
    <a ref="downloadMemberInfo"></a>
  </div>
</template>

<script>
import MemberTable from './components/MemberTable'
import ConditionQuery from './components/ConditionQuery'
import UpdateMemberInfo from './components/UpdateMemberInfo'
import AddExperience from './components/AddExperience'
import RightClickBox from '@/components/RightClickBox'
import {
  updateMemberInfo,
  conditionSearch,
  downloadMemberInfo,
  updateMemberStatus,
  deleteMember,
} from '@/api/member'
import { updateMemberAuthority } from '@/api/menu/authority'
export default {
  name: 'memberManage',
  components: {
    MemberTable, //展示成员的表格
    UpdateMemberInfo, //修改成员信息的菜单
    RightClickBox, //右击弹出框
    ConditionQuery, //条件查询
    AddExperience, //添加经历菜单
  },
  data() {
    return {
      loading: false, //数据是否处于载入中
      tableData: [], //展示成员的表格信息
      currentPosition: [], //当前页的每个成员的当前职位
      currentPage: 1, //当前页
      pagesize: 10, //每页多少条数据
      total: 0, //共多少条数据
      selectedIdsLen: 0, //选中ids的长度
      isOpenUpdateInfo: false, //是否打开修改成员信息的菜单
      memberInfo: null, //成员信息Obj
      selected: [], //选中的ids
      menuItem: [], //右击的所有菜单项
      selectedRow: null, //当前选中行
      selectSearch: 'memberName', //搜索项
      condition: {
        //搜索项绑定的值
        memberName: null,
        id: null,
        flag: 0,
        curPage: 1,
        classID: null,
        instituteID: null,
        specialtyID: null,
        size: 10,
        startYear: new Date().getFullYear() - 1,
      },
      conditionFlagLabel: ['所有', '协会内', '协会外', '黑名单', '协会内+外(可考核成员)'],
      isOpenAddExperience: false, //是否打开添加经历菜单
      selectMemberId: 0, //当前选中行的成员id
      startYearList: [],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  watch: {
    'condition.memberName'() {
      this.initTable(1)
    },
    'condition.id'() {
      this.initTable(1)
    },
    'condition.size'() {
      this.initTable(1)
    },
  },
  created() {
    this.initTable(1)
    this.initStartYear()
  },
  methods: {
    initStartYear() {
      const currentYear = new Date().getFullYear()
      for (let i = currentYear; i >= 2010; i--) {
        this.startYearList.push(i)
      }
    },
    more(row, column, event) {
      //右击后
      const menuMap = [
        //针对多种身份切换不同的菜单
        ['修改', '移出协会', '加入黑名单', '永久删除', '成员经历'],//协会成员
        ['修改', '加入协会', '加入黑名单', '永久删除', '成员经历'],//非协会成员
        ['修改', '永久删除'],//黑名单
      ]
      this.menuItem = menuMap[row.flag]
      //打开更多选项设置
      event.preventDefault() //阻止弹出默认窗
      this.$refs.menuBox.more(event) //执行右击弹出框的more函数
      this.selectedRow = row //记录当前选中行的所有数据
    },
    //右击菜单点击后的关联操作
    open(index) {
      switch (index) {
        case 0:
          this.openEditDialog(this.selectedRow) //打开编辑菜单
          break
        case 1:
          const flag = this.selectedRow.flag
          if (flag === 2) {
            this.removeMember(this.selectedRow.id) //删除成员
          } else if (flag <= 1) {
            const changeFlag = flag === 0 ? 1 : 0
            this.updateMemberFlag(this.selectedRow.id, changeFlag) //修改成员状态（协会内0，协会外1，黑名单2）
          }
          break
        case 2:
          this.updateMemberFlag(this.selectedRow.id, 2) //修改成员状态（协会内0，协会外1，黑名单2）
          break
        case 3:
          this.removeMember(this.selectedRow.id) //删除成员
          break
        case 4:
          this.isOpenAddExperience = true //打开添加经历菜单
          this.selectMemberId = this.selectedRow.id //设置选中行id
          break
      }
    },
    //初始化表格数据，
    async initTable(val) {
      this.loading = true
      this.condition.curPage = val
      const data = await conditionSearch(this.condition)
      if (data.code != 200) {
        this.$message.error(data.message)
        return
      }
      //对应赋值
      ;[this.tableData, this.currentPage, this.total, this.pagesize, this.currentPosition] = [
        data.data.records,
        data.data.current,
        data.data.total,
        data.data.size,
        [],
      ]
      this.tableData.forEach((item) => {
        if (item.position != null) this.currentPosition.push(item.position.id)
        else this.currentPosition.push('无')
        item.isAdmin = item.roles.some((i) => {
          if (i.roleName === 'admin') return true
        })
        item.isHover = false
      })
      setTimeout(() => {
        this.loading = false
      }, 500)
    },

    //更改职位
    async changePosition(row, index) {
      const res = await updateMemberInfo(row.id, {
        positionID: this.currentPosition[index],
      })
      if (res.code !== 200) {
        this.$message.error(res.message)
      } else {
        this.isOpenUpdateInfo = false
      }
    },
    //打开修改
    openEditDialog(row) {
      this.memberInfo = row
      this.isOpenUpdateInfo = true
    },
    //全选后
    handleSelectionChange(val) {
      this.selected = []
      this.selectedIdsLen = val.length
      val.forEach((item) => {
        this.selected.push(item.id)
      })
    },
    //修改
    async updateMemberInfo() {
      const data = await updateMemberInfo(this.memberInfo.id, this.memberInfo)
      if (data.code !== 200) {
        this.$message.error(data.message)
        return
      }
      this.isOpenUpdateInfo = false
      this.$message.success('修改成功')
      this.initTable(this.currentPage)
    },
    //删除
    async removeMember(id) {
      let ids = []
      if (id) ids.push(id)
      else if (this.selected.length === 0) {
        this.$message.warning('请先选择成员!')
        return
      } else ids = this.selected

      const confirmresult = await this.$confirm(
        `此操作将永久删除${id ? '该成员' : '这' + ids.length + '名成员'}`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmresult !== 'confirm') {
        this.$message.info('已取消删除')
        return
      }
      const res = await deleteMember(ids)
      if (res.code !== 200) {
        this.$message.error('删除失败!')
        return
      }
      this.$message.success('删除成功!')
      this.initTable(this.currentPage)
    },
    //修改协会状态
    async updateMemberFlag(id, status) {
      const data = await updateMemberStatus(id, status)
      if (data.code === 200) {
        this.initTable(this.currentPage)
      } else this.$message.error(data.message)
    },
    //设置管理或取消管理
    async changeAdmin(memberId, role) {
      const roles = [role]
      const data = await updateMemberAuthority(memberId, roles)
      if (data.code === 200) {
        this.initTable(this.currentPage)
      } else this.$message.error(data.message)
    },
    async downloadMemberInfo() {
      const data = await downloadMemberInfo(this.condition)
      const a = this.$refs.downloadMemberInfo
      a.href = window.URL.createObjectURL(data)
      a.download = '成员信息'
      a.click()
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
