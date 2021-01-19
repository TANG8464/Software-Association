<template>
  <div class="key_createKey">
    <el-dialog title="创建密钥" :visible.sync="isOpen" width="30%">
      <el-form :model="skey" :label-position="labelPosition">
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
          <el-select v-model="skey.region" placeholder="请选择存储区域" style="width: 100%">
            <el-option
              v-for="item in regionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="remark" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="skey.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="createKey()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    skey: {
      type: Object,
      default: {},
    },
    isOpenCreate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formLabelWidth: '120px',
      isOpen: false,
      labelPosition: null,
      regionList: [
        { label: '华东', value: 'z0' },
        { label: '华北', value: 'z1' },
        { label: '华南', value: 'z2' },
        { label: '北美', value: 'na0' },
        { label: '东南亚', value: 'as0' },
      ],
    }
  },
  watch: {
    isOpenCreate(newVal) {
      this.isOpen = newVal
    },
    isOpen(newVal) {
      this.$emit('update:isOpenCreate', newVal)
    },
    isSmall(newVal) {
      this.labelPosition = newVal ? 'top' : 'left'
    },
  },
  computed: {
    isSmall() {
      return this.$store.state.resize.isSmallSize
    },
  },
  mounted() {
    this.labelPosition = this.isSmall ? 'top' : 'left'
  },
  methods: {
    createKey() {
      this.$emit('createKey')
    },
  },
}
</script>