<template>
  <div class="add-sort">
    <div class="add-sort_title">
      <span>添加分类</span>
    </div>
    <ul class="sort-list">
      <li class="sort-list-item" style>
        <el-row :gutter="24" style="width:100%;">
          <el-col :xs="24" :sm="3" :lg="3">
            <h4>#</h4>
          </el-col>
          <el-col :xs="24" :sm="7" :lg="7">
            <p>
              <el-input placeholder="请输入分类名称" v-model="sort.categoryName" clearable></el-input>
            </p>
          </el-col>
          <el-col :xs="24" :sm="8" :lg="11">
            <p>
              <el-input placeholder="请输入分类描述" v-model="sort.remark" clearable></el-input>
            </p>
          </el-col>
          <el-col :xs="24" :sm="4" :lg="3" style="text-align:right;">
            <p>
              <el-button type="success" icon="el-icon-check" :circle="true" plain @click="addSort"></el-button>
            </p>
          </el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sort: {}
    }
  },
  methods: {
    addSort() {
      if (this.sort.categoryName && this.sort.remark) {
        this.$emit('addSort', this.sort)
        this.sort = {}
      } else {
        this.$message.error('数据不能为空哦~')
      }
    }
  }
}
</script>
<style>
.add-sort_title {
  text-align: left;
  padding: 0 30px;
  font-size: 14px;
  color: #999999;
}
.sort-list {
  list-style: none;
}
.sort-list-item {
  text-align: left;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 0 20px;
  display: flex;
  align-items: center;
}
</style>