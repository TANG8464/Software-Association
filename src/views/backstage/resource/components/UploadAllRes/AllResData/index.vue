<template>
  <div class="allRes_table">
    <el-table
      ref="singleTable"
      :data="allRes"
      style="width: 100%; text-aligin: center; min-height: 500px"
      @row-contextmenu="more"
      @row-dblclick="more"
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-background="rgba(255, 255, 255, 0.5)"
    >
      <el-table-column
        label="文件"
        show-overflow-tooltip
        style="display: flex; align-items: center"
      >
        <template slot-scope="scope">
          <img
            class="resImg"
            v-if="scope.row.resourceLogo"
            :src="scope.row.resourceLogo"
            alt
            width="40"
            height="40"
          />
          <span v-text="scope.row.resourceName" style="margin: 0 5px"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!size.isSmallSize"
        property="resourceCategory.resourceCategoryName"
        label="资源分类"
        width="100"
      ></el-table-column>

      <el-table-column
        v-if="!size.isSmallSize"
        property="uploadDate"
        label="上传日期"
        width="200"
      ></el-table-column>
      <el-table-column
        v-if="!size.isSmallSize"
        property="member.memberName"
        label="上传者"
        width="150"
      ></el-table-column>
      <el-table-column width="110" property="status" label="是否可下载">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="updateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        v-if="!size.isSmallSize"
        property="type"
        label="存储位置"
        width="100"
      ></el-table-column>
      <el-table-column label width="50">
        <template slot-scope="scope">
          <a id="downloadRes" style="text-align: right" @click="downloadRes(scope.row)">
            <icon name="download" scale="20" width="20"></icon>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <res-details :Details.sync="Details" :isOpenDetails.sync="isOpenDetails"></res-details>
    <update-res
      :update.sync="update"
      :isOpenUpdate.sync="isOpenUpdate"
      :fileType="fileType"
      @setLogo="setLogo"
      @updateRes="updateRes"
    ></update-res>
    <!--右击弹出更多设置-->
    <right-click-box :menu="menuItem" @open="open" ref="menuBox"></right-click-box>
  </div>
</template>

<script>
import ResDetails from './ResDetails'
import UpdateRes from './UpdateRes'
import RightClickBox from '@/components/RightClickBox'
import {
  getResourceById,
  updateResourceStatus,
  updateResource,
  deleteResource,
  download,
} from '@/api/resource'
export default {
  name: 'allResData',
  components: {
    ResDetails,
    UpdateRes,
    RightClickBox,
  },
  props: {
    allRes: {
      type: Array,
      default: function () {
        return []
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpenDetails: false,
      isOpenUpdate: false,
      Details: {}, //当前选择项的详细信息
      update: {}, //当前选择项的修改信息
      selected: {}, //当前选中项
      fileType: null,
      menuItem: ['详细信息', '修改', '删除'],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  methods: {
    setLogo(val) {
      this.update.resourceLogo = val
    },
    more(row, column, event) {
      //打开更多选项设置
      event.preventDefault() //阻止弹出默认窗
      this.$refs.menuBox.more(event)
      this.selected = row
    },
    open(index) {
      switch (index) {
        case 0:
          this.openDetails()
          break
        case 1:
          this.openUpdate()
          break
        case 2:
          this.openAffirm()
          break
      }
    },
    async openDetails() {
      //打开详细信息
      this.isOpenDetails = true
      const res = await getResourceById(this.selected.id) //获取详细信息
      if (res.code === 200) {
        this.Details = res.data
      } else this.$message.error(res.message)
    },
    openUpdate() {
      //打开修改
      const selected = this.selected
      this.isOpenUpdate = true
      this.update = (({ author, description, resourceCategory, resourceLogo, resourceName }) => ({
        author,
        description,
        resourceCategoryID: resourceCategory.id,
        resourceLogo,
        resourceName,
      }))(selected)
      this.fileType = selected.fileType ? selected.fileType.split('/')[1] : ''
    },
    openAffirm() {
      //打开删除确认框
      this.$confirm(`此操作将永久删除"${this.selected.resourceName}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.delRes()
        })
        .catch(() => {})
    },
    async updateStatus(row) {
      //修改状态
      const res = await updateResourceStatus(row.id, row.status)
      if (res.code === 200) {
        this.$message.success('修改成功')
        this.$emit('setAllRes') //重新渲染所有数据
      } else this.$message.error(res.message)
    },
    //修改保存信息
    async updateRes() {
      const res = await updateResource(this.selected.id, this.update)
      if (res.code === 200) {
        this.isOpenUpdate = false
        this.$message.success('修改成功')
        this.$emit('setAllRes') //重新渲染所有数据
      } else this.$message.error(res.message)
    },
    async delRes() {
      //删除资源
      const res = await deleteResource([this.selected.id])
      if (res.code === 200) {
        this.$message.success('删除成功')
        this.$emit('setAllRes') //重新渲染所有数据
      } else this.$message.error(res.message)
    },
    async downloadRes(row) {
      //下载文件
      const res = await download(row.id)
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      let link = document.createElement('a')
      link.href = res.data
      link.download = `${row.resourceName}`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
}
</script>

<style scoped>
.resImg {
  border-radius: 3px;
}
</style><style>
.el-table .cell.el-tooltip {
  display: flex;
  align-items: center;
}
</style>
