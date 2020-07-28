<template>
  <div class="sort-list">
    <div>
      <list-data
        ref="sortData"
        @setAllSort="setAllSort"
        :allSort="allSort.records"
        @update="update"
        @delSort="delSort"
      ></list-data>
      <div style="text-align:right;padding:0 15px;">
        <el-pagination
          :hide-on-single-page="true"
          @current-change="setAllSort"
          :current-page.sync="allSort.current"
          :page-size="allSort.size"
          :total="allSort.total"
          layout="total, prev, pager, next"
        ></el-pagination>
        <add-sort @addSort="addSort"></add-sort>
      </div>
    </div>
  </div>
</template>
<script>
import ListData from './ListData'
import AddSort from './AddSort'
export default {
  name: 'sortList',
  components: {
    ListData,
    AddSort
  },
  props: {
    allSort: {
      type: Object,
      required: true
    }
  },
  methods: {
    async setAllSort(pageNo) {
      console.log(pageNo)
      this.$emit('setAllSort', pageNo)
    },
    addSort(sort) {
      this.$emit('addSort', sort)
    },
    update(sort) {
      console.log(sort)

      this.$emit('updateSort', sort)
    },
    delSort(ids) {
      this.$emit('delSort', ids)
    }
  }
}
</script>
<style>
.update-span,
.del-span {
  padding: 0 5px;
}
.update {
  fill: #8a8a8a;
}
.update-span:hover .update {
  fill: rgb(63, 171, 235);
}

.del {
  fill: #8a8a8a;
}
.del-span:hover .del {
  fill: #f56c6c;
}

.notice-sort .el-checkbox__input.is-checked .el-checkbox__inner,
.notice-sort .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #f56c6c;
  border-color: #f56c6c;
}
.notice-sort .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #f56c6c;
}
.notice-sort .el-checkbox__inner:hover {
  border-color: #f56c6c;
}


</style>