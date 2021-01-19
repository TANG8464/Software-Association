<template>
  <div class="apply-table">
    <el-table
      :data="table"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-table-column width="45">
        <template>
          <icon name="word" scale="30" width="30"></icon>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <el-link type="info" @click="download(scope.row.id)">{{
            scope.row.resourceName
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="author"></el-table-column>
      <el-table-column label="申请时间">
        <template slot-scope="scope">
          <span>{{ scope.row.uploadDate | dateFormatter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="openCheck(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <check-dialog
      :activePane="activePane"
      :isOpenCheck.sync="isOpenCheck"
      :checkInfo.sync="checkInfo"
      @update="updateApply"
    ></check-dialog>
  </div>
</template>

<script>
import { download } from '@/api/resource'
import { adminSendMsg } from '@/api/message'
import { adminUpdateApply } from '@/api/join-apply'
import { dateFormatter } from '@/filters'
import dateInfo from '@/utils/dateInfo'
import CheckDialog from './CheckDialog'
export default {
  components: {
    CheckDialog,
  },
  props: {
    table: {
      type: Array,
      require: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    activePane: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      isOpenCheck: false,
      selectRow: null,
      checkInfo: {
        pass: 0,
        content: '',
      },
    }
  },
  watch: {
    'checkInfo.pass'(newVal) {
      this.checkInfo.content =
        newVal === 1
          ? `您提交的入会申请已通过，请耐心等待面试考试通知`
          : `很遗憾，您提交的入会申请未通过，请删除已提交文件，并按照以下要求改正后重新提交`
    },
  },
  methods: {
    //下载申请书
    async download(id) {
      const data = await download(id)
      if (data.code === 200) {
        let link = document.createElement('a')
        link.href = data.data
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
    openCheck(row) {
      this.isOpenCheck = true
      this.selectRow = row
      if (Number(this.activePane) != 0) {
        this.checkInfo.pass = Number(this.activePane) === 1 ? -1 : 1
      } else this.checkInfo.pass = 1
    },
    async updateApply(command) {
      const params = Object.assign(this.selectRow, {
        afterStatus: this.checkInfo.pass,
        beforeStatus: Number(this.activePane),
      })
      const data = await adminUpdateApply(params)
      if (data.code === 200) {
        const action = '系统消息'
        const title = this.checkInfo.pass === 1 ? '入会申请已通过' : '入会申请未通过'
        this.sendMsg(
          action,
          `<p>To ${this.selectRow.author}</p><p>${this.checkInfo.content}</p><p style="text-align:right;">软件协会</p><p style="text-align:right;">${dateInfo.nowDate}</p>`,
          title,
          [this.selectRow.memberId]
        )
        this.$emit('refresh')
        this.isOpenCheck = false
      } else this.$message.error(data.message)
    },
    async sendMsg(action, content, title, userIds) {
      const data = await adminSendMsg({
        action,
        content,
        title,
        userIds,
      })
      if (data.code !== 200) this.$message.error(data.message)
    },
  },
  filters: {
    dateFormatter,
  },
}
</script>

<style>
.apply-table {
  min-height: 500px;
}
</style>
