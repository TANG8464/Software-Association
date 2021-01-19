<template>
  <div class="check">
    <p class="check-header">
      <el-link type="primary" @click="isOpenManage = true">入会设置</el-link>
      <el-link type="danger" @click="delStatus">清除缓存</el-link>
    </p>
    <el-tabs v-model="activePane" type="card" @tab-click="handleClick">
      <el-tab-pane label="未审核" name="0"></el-tab-pane>
      <el-tab-pane label="审核通过" name="1"></el-tab-pane>
      <el-tab-pane label="审核未通过" name="-1"></el-tab-pane>
      <apply-table
        :table="apply.records"
        :loading="loading"
        @refresh="setApply"
        :activePane="activePane"
      ></apply-table>
    </el-tabs>
    <div style="text-align: right">
      <el-pagination
        style="width: 300px; display: inline-block; padding: 0"
        @current-change="setApply"
        :current-page="apply.current"
        :page-sizes="[10, 15, 20, 25, 30]"
        :page-size="searchData.size"
        :total="apply.total"
        :hide-on-single-page="false"
      ></el-pagination>
    </div>
    <apply-dialog :isOpen.sync="isOpenManage"> </apply-dialog>
  </div>
</template>

<script>
import { adminSearchApply, delStatus } from '@/api/join-apply'

import ApplyTable from './components/ApplyTable'
import ApplyDialog from './components/ApplyDialog'
export default {
  components: {
    ApplyTable,
    ApplyDialog,
  },
  data() {
    return {
      isOpenManage: false,
      apply: {},
      loading: false,
      activePane: '0',
      searchData: {
        curPage: 1,
        size: 10,
        status: 0,
      },
    }
  },
  created() {
    this.setApply()
  },
  methods: {
    handleClick(tab, event) {
      this.searchData.status = Number(tab.name)
      this.setApply()
    },
    async setApply(curPage) {
      if (curPage) this.searchData.curPage = curPage
      this.loading = true
      const data = await adminSearchApply(this.searchData)
      if (data.code === 200) {
        this.apply = data.data
        this.loading = false
      } else this.loading = false
    },
    async delStatus() {
      this.$confirm('清除申请书缓存将会删除所有申请书，请先将所有申请书在minio下载备份。', '提示', {
        confirmButtonText: '已备份，执行删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const data = await delStatus()
          if (data.code === 200) {
            this.$message.success('清除成功')
            this.setApply()
          } else this.$message.error(data.message)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang="scss">
.check {
  .check-header {
    text-align: right;
    .el-link {
      margin: 0 2px;
    }
  }
}
</style>
