<template>
  <div class="res_addSort">
    <div style="text-align:left;padding:0 30px;">
      <span style="font-size:14px;color:#999999;">添加分类</span>
    </div>
    <ul style="text-align:left;">
      <li class="sortArr" style="height: 1.6em;width:95%;border: 1px solid #e0e0e0;">
        <el-row :gutter="24" style="width:100%;text-align:center;">
          <el-col :span="3">
            <h4>#</h4>
          </el-col>
          <el-col :span="7">
            <p>
              <el-input placeholder="请输入分类名称" v-model="sort.resourceCategoryName" clearable></el-input>
            </p>
          </el-col>
          <el-col :span="10">
            <p>
              <el-input placeholder="请输入分类描述" v-model="sort.remark" clearable></el-input>
            </p>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <p>
              <el-button type="success" icon="el-icon-check" circle @click="addSort()"></el-button>
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
    };
  },
  methods: {
    async addSort() {
      try {
        let res = await this.$axios.post("resocategory/", this.sort);
          let typ = "";
          if (res.data.code === 200) {
              typ = "success";
              this.$emit('setAllSort');
          }
          else typ = "error";
          this.$message({
            type: typ,
            message: res.data.message
          });
          this.sort = {};
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>