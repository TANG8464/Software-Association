<template>
  <div>
    <el-table
      :data="allScore"
      style="width: 100%; min-height: 514px"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="isShowDels"
        fill="#fbc4c4"
        type="selection"
        width="55"
      ></el-table-column>
      <el-table-column
        v-for="(item, index) in header"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
      ></el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-button
            type="danger"
            size="mini"
            round
            plain
            v-if="!isShowDels"
            @click="isShowDels = true"
          >
            <i class="el-icon-delete"></i>
            批量删除
          </el-button>
          <div v-if="isShowDels">
            <el-button type="danger" size="mini" round plain @click="deleteScore()">确认</el-button>
            <el-button type size="mini" round plain @click="isShowDels = false">取消</el-button>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="openUpdate(scope.row)">修改</el-button>
          <span style="margin: 0 8px"></span>
          <el-button size="mini" type="warning" @click="openCheck(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <check-dialog
      :activePane="activePane"
      :isOpenCheck.sync="isOpenCheck"
      :checkInfo.sync="checkInfo"
      @update="updateScore"
    ></check-dialog>
  </div>
</template>

<script>
import { updateScore } from '@/api/member/score'
import { updateMemberStatus } from '@/api/member'
import { adminSendMsg } from '@/api/message'
import dateInfo from '@/utils/dateInfo'
import CheckDialog from './CheckDialog'
export default {
  components: {
    CheckDialog,
  },
  props: {
    allScore: {
      type: Array,
      require: true,
    },
    loading: {
      type: Boolean,
      require: true,
    },
    isDels: {
      type: Boolean,
      require: true,
    },
    activePane: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      header: [
        {
          label: '成员号',
          prop: 'memberID',
        },
        {
          label: '姓名',
          prop: 'memberName',
        },
        {
          label: '考核名称',
          prop: 'testName',
        },
        {
          label: '成绩',
          prop: 'score',
          sortable: true,
        },
        {
          label: '考试时间',
          prop: 'testDate',
        },
      ],
      isShowDels: false,
      isOpenCheck: false,
      checkInfo: {},
      selectRow: {},
    }
  },
  watch: {
    isDels(newVal) {
      this.isShowDels = newVal
    },
    isShowDels(newVal) {
      this.$emit('update:isDels', newVal)
    },
    // 'checkInfo.pass'(newVal) {

    // },
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    deleteScore() {
      this.$emit('deleteScore')
    },
    openUpdate(row) {
      this.$emit('openUpdate', row)
    },
    async openCheck(row) {
      this.isOpenCheck = true
      this.selectRow = row
      if (Number(this.activePane) != 0) {
        this.checkInfo.pass = Number(this.activePane) === 1 ? -1 : 1
      } else this.checkInfo.pass = 1
      this.checkInfo.content =
        this.checkInfo.pass === 1
          ? `恭喜你，通过了协会的“${this.selectRow.testName}”考核，请关注协会动态，按时来协会上课`
          : `很遗憾，你没有通过协会的“${this.selectRow.testName}”考核，继续努力，争取通过协会的下一次考核`
    },
    async updateScore() {
      const pass = this.checkInfo.pass
      const memberId = this.selectRow.memberID
      const res = await updateScore(this.selectRow.scoreId, Object.assign(this.selectRow, { pass }))
      if (res.code === 200) {
        const title = pass === 1 ? '考核通过' : '考核未通过'
        await adminSendMsg({
          action: '系统消息',
          content: `<p>To ${this.selectRow.memberName}</p><p>${this.checkInfo.content}</p><p style="text-align:right;">软件协会</p><p style="text-align:right;">${dateInfo.nowDate}</p>`,
          title,
          userIds: [memberId],
        })
      } else this.$message.error(res.message)
      if (pass === 1) {
        this.$confirm('考核已通过是否将该成员加入协会？', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'info',
        })
          .then(async () => {
            const status = pass === 1 ? 0 : 1 //0表示在协会，1表示协会外
            await updateMemberStatus(memberId, status)
            this.$emit('updateScore')
            this.isOpenCheck = false
          })
          .catch(() => {
            this.$emit('updateScore')
            this.isOpenCheck = false
          })
      } else {
        this.$emit('updateScore')
        this.isOpenCheck = false
      }
    },
  },
}
</script>
