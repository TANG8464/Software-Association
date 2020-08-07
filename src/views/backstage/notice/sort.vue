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
export default {
  components: {
    SortData
  },
  data() {
    return {
      allSort: {}
    }
  },
  created() {
    this.setAllSort(1)
  },
  methods: {
    async setAllSort(currPage) {
      let { data } = await this.$axios.get('newscategory/', {
        params: { currPage }
      })
      this.allSort = data.data
      this.allSort.records.forEach(item => {
        item.categoryName = item.newsCategoryName
      })
    },
    async addSort(sort) {
      let { data } = await this.$axios.post('newscategory/', {
        newsCategoryName: sort.categoryName,
        remark: sort.remark
      })
      let type = ''
      if (data.code === 200) type = 'success'
      else type = 'error'
      this.$message({
        type,
        message: data.message
      })
      this.setAllSort(this.allSort.current)
    },
    //修改分类
    async updateSort(sort) {
      let { data } = await this.$axios.put('newscategory/' + sort.id, {
        newsCategoryName: sort.categoryName,
        remark: sort.remark
      })
      let type = ''
      if (data.code === 200) type = 'success'
      else type = 'error'
      this.$message({
        type: type,
        message: data.message
      })
      this.setAllSort(this.allSort.current)
    },
    async delSort(ids) {
      let { data } = await this.$axios.delete('newscategory/', {
        data: ids
      })
      let type = ''
      if (data.code === 200) type = 'success'
      else type = 'error'
      this.$message({
        type: type,
        message: data.message
      })
      //重新渲染所有数据
      this.setAllSort(this.allSort.current)
    }
  }
}
</script>
<style>
</style>