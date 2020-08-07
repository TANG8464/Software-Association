<template>
  <div class="back-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="item in breadcrumb"
        :key="item.id"
        :to="item.path"
        :replace="true"
        style="font-size:18px;"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: 'Breadcrumb',
  computed: {
    breadcrumb() {
      return this.$store.state.breadcrumb
    },
  }
}
</script>
<style>
.back-breadcrumb {
  margin: 23px 0;
}
</style>