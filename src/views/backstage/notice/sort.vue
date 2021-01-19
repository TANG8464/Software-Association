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
  searchAllNotieCategiry,
  addNotieCategiry,
  deleteNotieCategiry,
  updateNotieCategiry,
} from '@/api/notice/category'
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
    //条件查询分类
    async setAllSort(currPage) {
      const res = await searchAllNotieCategiry({ currPage })
      this.allSort = res.data
      this.allSort.records.forEach((item) => {
        item.categoryName = item.newsCategoryName
      })
    },
    //添加分类
    async addSort(sort) {
      const res = await addNotieCategiry({
        newsCategoryName: sort.categoryName,
        remark: sort.remark,
      })
      if (res.code === 200) {
        this.setAllSort(this.allSort.current)
        this.$message.success('添加成功')
      } else this.$message.error(res.message)
    },
    //修改分类
    async updateSort(sort) {
      const res = await updateNotieCategiry(sort.id, {
        newsCategoryName: sort.categoryName,
        remark: sort.remark,
      })
      if (res.code === 200) {
        this.setAllSort(this.allSort.current)
        this.$message.success('修改成功')
      } else this.$message.error(res.message)
    },
    //删除分类
    async delSort(ids) {
      const res = await deleteNotieCategiry(ids)
      if (res.code === 200) {
        //重新渲染所有数据
        this.setAllSort(this.allSort.current)
        this.$message.success('删除成功')
      } else this.$message.error(res.message)
    },
  },
}
</script>
<style>
</style>