<template>
  <div class="notice-sort">
    <sort-data
      :allSort="allSort"
      @addSort="addSort"
      @updateSort="updateSort"
      @delSort="delSort"
      @setAllSort="setAllSort"
    ></sort-data>
  </div>
</template>

<script>
import SortData from '@/components/SortList'
import {
  getResourceCategory,
  addResourceCategory,
  updateResourceCategory,
  deleteResourceCategory,
} from '@/api/resource/category'
export default {
  components: {
    SortData,
  },
  data() {
    return {
      allSort: {},
    }
  },
  created() {
    this.setAllSort(1)
  },
  methods: {
    async setAllSort(currPage) {
      //分页查找所有资源种类
      const res = await getResourceCategory({ currPage })
      this.allSort = res.data
      this.allSort.records.forEach((item) => {
        item.categoryName = item.resourceCategoryName
      })
    },
    async addSort(sort) {
      const res = await addResourceCategory({
        resourceCategoryName: sort.categoryName,
        remark: sort.remark,
      })
      if (res.code === 200) {
        this.$message.success('添加成功')
        this.setAllSort(this.allSort.current)
      } else this.$message.error(res.message)
    },
    //修改分类
    async updateSort(sort) {
      sort.resourceCategoryName = sort.categoryName
      const res = await updateResourceCategory(sort)
      if (res.code === 200) {
        this.setAllSort(this.allSort.current)
        this.$message.success('修改成功')
      } else this.$message.error(res.message)
    },
    async delSort(ids) {
      const res = await deleteResourceCategory(ids)
      if (res.code === 200) {
        //重新渲染所有数据
        this.setAllSort(this.allSort.current)
      } else this.$message.error(res.message)
    },
  },
}
</script>

<style>
.res-sort .el-checkbox__input.is-checked .el-checkbox__inner,
.res-sort .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.res-sort .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #f56c6c;
}

.res-sort .el-checkbox__inner:hover {
  border-color: #f56c6c;
}
</style>
