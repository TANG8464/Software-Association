<template>
  <div class="key_createKey">
    <el-form :model="skey">
      <el-form-item label="accessKey" :label-width="formLabelWidth">
        <el-input v-model="skey.accessKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="securityKey" :label-width="formLabelWidth">
        <el-input v-model="skey.securityKey" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="bucketName" :label-width="formLabelWidth">
        <el-input v-model="skey.bucketName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="domainOfBucket" :label-width="formLabelWidth">
        <el-input v-model="skey.domainOfBucket" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="region" :label-width="formLabelWidth">
        <el-select v-model="skey.region" placeholder="请选择存储区域" style="width:100%">
          <el-option label="华东" value="z0"></el-option>
          <el-option label="华北" value="z1"></el-option>
          <el-option label="华南" value="z2"></el-option>
          <el-option label="北美" value="na0"></el-option>
          <el-option label="东南亚" value="as0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="remark" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="skey.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formLabelWidth: "120px"
    };
  },
  props: {
    skey: {
      type: Object,
      default: {}
    }
  }
};
</script>