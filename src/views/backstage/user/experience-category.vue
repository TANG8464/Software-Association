<template>
  <div class="experience-category">
    <sort-data
      :allSort="{}"
      :sortList="allSort"
      @addSort="operationSort"
      @updateSort="operationSort"
      @delSort="delSort"
      @setAllSort="setAllSort"
    ></sort-data>
  </div>
</template>

<script>
import SortData from '@/components/SortList'
import {
  addExperienceCategory,
  delMemberExperienceCategory,
  searchMemberExperienceCategory,
} from '@/api/member/experience-category'
export default {
  components: {
    SortData,
  },
  data() {
    return {
      allSort: [],
    }
  },
  created() {
    this.setAllSort()
  },
  methods: {
    async setAllSort() {
      //分页查找所有资源种类
      const data = await searchMemberExperienceCategory()
      if (data.code === 200) this.allSort = data.data
    },
    async operationSort(sort) {
      sort.expCategoryName = sort.categoryName
      const res = await addExperienceCategory(sort)
      if (res.code === 200) {
        this.setAllSort()
        this.$message.success('添加成功')
      } else this.$message.error(res.message)
    },
    async delSort(ids) {
      ids.forEach(async (item) => {
        const res = await delMemberExperienceCategory(item)
         //重新渲染所有数据
        if (res.code === 200) {
          this.setAllSort()
           this.$message.success('删除成功')
        } else this.$message.error(res.message)
       
      })
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
