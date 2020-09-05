<template>
<div class="main">
    <div class="header" style="text-align:right;">
        <el-link type="primary" @click="downloadMemberInfo">导出成员表</el-link>
    </div>
    <div class="table remove">
        <div style="width:100%;text-align:right;">
            <el-select v-model="condition.flag" placeholder="请选择" style="width:100px;float:left;margin:10px 0" size="small" @change="initTable()">
                <el-option label="所有" :value="-1"></el-option>
                <el-option label="协会内" :value="0"></el-option>
                <el-option label="协会外" :value="1"></el-option>
                <el-option label="黑名单" :value="2"></el-option>
            </el-select>
            <el-select v-model="selectSearch" placeholder="请选择" style="width:100px" size="small">
                <el-option label="姓名" value="memberName"></el-option>
                <el-option label="成员号" value="id"></el-option>
            </el-select>
            <el-input v-if="selectSearch==='memberName'" style="min-width:200px;width:25%;margin:10px;" v-model="condition.memberName" size="small" placeholder="请输入姓名搜索"></el-input>
            <el-input v-if="selectSearch==='id'" style="min-width:200px;width:25%;margin:10px;" v-model="condition.id" size="small" placeholder="请输入成员号搜索"></el-input>
            <condition-query :condition.sync="condition" @queryCondition="initTable"></condition-query>
        </div>
        <div>
            <member-table :tableData="tableData" :selectPosition="selectPosition" :loading="loading" @handleSelectionChange="handleSelectionChange" @more="more" @changePosition="changePosition" @removeMember="removeMember" @changeAdmin="changeAdmin"></member-table>
            <div style="text-align:right">
                <el-pagination style="width:300px;display:inline-block;padding:0" @current-change="initTable" :current-page="pagenum" :page-sizes="[10,15,20,25,30]" :page-size="condition.size" layout="total, prev, pager, next" :total="total" :hide-on-single-page="true"></el-pagination>
                <el-select style="width:80px;margin:0 10px;position:relative;top:5px" v-model="condition.size" placeholder="请选择" size="mini" @change="initTable(1)">
                    <el-option :label="(item-1)*(item-1)*10+10" :value="(item-1)*(item-1)*10+10" v-for="item in 8" :key="item"></el-option>
                </el-select>
            </div>
        </div>
    </div>
    <update-memberInfo :isOpenUpdateInfo.sync="isOpenUpdateInfo" :memberInfo.sync="memberInfo" @updateMemberInfo="updateMemberInfo"></update-memberInfo>
    <right-click-box :menu="menuItem" @open="open" ref="menuBox"></right-click-box>
    <a ref="downloadMemberInfo"></a>
</div>
</template>

<script>
import MemberTable from './components/MemberTable'
import ConditionQuery from './components/ConditionQuery'
import UpdateMemberInfo from './components/UpdateMemberInfo'
import RightClickBox from '@/components/RightClickBox'
import {
    updateMemberInfo,
    conditionSearch,
    downloadMemberInfo
} from '@/api/user'
export default {
    name: 'memberManage',
    components: {
        MemberTable,
        UpdateMemberInfo,
        RightClickBox,
        ConditionQuery,
    },
    data() {
        return {
            loading: false,
            tableData: [],
            position: [],
            selectPosition: [],
            pagenum: 1,
            pagesize: 10,
            total: 10,
            checkeds: 0,
            isOpenUpdateInfo: false,
            memberInfo: null,
            selected: [],
            menuItem: [],
            selectedRow: null,
            //搜索
            selectSearch: 'memberName',
            condition: {
                memberName: null,
                id: null,
                flag: 0,
                curPage: 1,
                classID: null,
                instituteID: null,
                specialtyID: null,
                size: 10,
            },
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
    },
    methods: {
        more(row, column, event) {
            const menuMap = [
                ['修改', '移出协会', '加入黑名单', '永久删除'],
                ['修改', '加入协会', '加入黑名单', '永久删除'],
                ['修改', '永久删除'],
            ]
            this.menuItem = menuMap[row.flag]
            //打开更多选项设置
            event.preventDefault() //阻止弹出默认窗
            this.$refs.menuBox.more(event)
            this.selectedRow = row
        },
        //右击菜单点击后的关联操作
        open(index) {
            switch (index) {
                case 0:
                    this.openEditDialog(this.selectedRow)
                    break
                case 1:
                    const flag = this.selectedRow.flag
                    if (flag === 2) {
                        this.removeMember(this.selectedRow.id)
                    } else if (flag <= 1) {
                        const changeFlag = flag === 0 ? 1 : 0
                        this.updateMemberFlag(this.selectedRow.id, 1)
                    }
                    break
                case 2:
                    this.updateMemberFlag(this.selectedRow.id, 2)
                    break
                case 3:
                    this.removeMember(this.selectedRow.id)
            }
        },
        //初始化表格数据，
        async initTable(val) {
            this.loading = true
            this.condition.curPage = val
            const data = await conditionSearch(this.condition)
            if (data.code != 200) {
                this.$message.error(data.message)
            } else {
                this.tableData = data.data.records
                this.pagenum = data.data.current
                this.total = data.data.total
                this.pagesize = data.data.size

                this.tableData.forEach((item) => {
                    if (item.position != null) this.selectPosition.push(item.position.id)
                    else this.selectPosition.push('无')
                    item.isAdmin = item.roles.some((i) => {
                        if (i.roleId === 3) return true
                    })
                    item.isHover = false
                })
                setTimeout(() => {
                    this.loading = false
                }, 500)
            }
        },

        //更改职位
        async changePosition(row, index) {
            const data = await updateMemberInfo(row.id, {
                positionID: this.selectPosition[index],
            })
            if (data.code !== 200) {
                this.$message.error(data.message)
            }
        },
        //打开修改
        openEditDialog(row) {
            this.memberInfo = row
            console.log(row)

            this.isOpenUpdateInfo = true
        },
        //全选后
        handleSelectionChange(val) {
            this.checkeds = val.length
            val.forEach((item) => {
                this.selected.push(item.id)
            })
        },
        //修改
        async updateMemberInfo() {
            const {
                data
            } = await this.$axios.put(`member/${this.memberInfo.id}`, this.memberInfo)
            if (data.code === 200) {
                this.$message.success('修改成功')
                this.initTable(this.pagenum)
            } else {
                this.$message.error(data.message)
            }
        },
        //删除
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
                '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).catch((err) => err)
            if (confirmresult == 'confirm') {
                const {
                    data: res
                } = await this.$http.delete('member/', {
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
        //修改协会状态
        async updateMemberFlag(id, status) {
            const {
                data
            } = await this.$axios.put(`/member/${id}/flag/${status}`)
            console.log(data)
            if (data.code === 200) {
                this.initTable(this.pagenum)
            } else this.$message.error(data.message)
        },
        //设置管理或取消管理
        async changeAdmin(id, role) {
            const putData = [role]
            const {
                data
            } = await this.$axios.put(`member/authority/${id}`, putData)
            if (data.code === 200) {
                this.initTable(this.pagenum)
            } else {
                this.$message.error(data.message)
            }
        },
        async downloadMemberInfo() {
            const data = await downloadMemberInfo(this.condition)
            console.log(data)
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
