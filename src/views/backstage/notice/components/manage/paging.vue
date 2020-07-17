<template>
  <div class="block" style="padding:10px 0;">
    <el-pagination
      :page-size="paging.pageSize"
      @current-change="cutPage"
      :current-page="1"
      :hide-on-single-page="true"
      layout="total, prev, pager, next, jumper"
      :total="paging.totalCount"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    paging: Object
  },
  methods: {
    cutPage(currentPage) {
      this.$emit('cutPage', currentPage);

    }
  }
}
</script>
