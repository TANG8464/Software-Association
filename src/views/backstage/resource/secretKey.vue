<template>
  <div class="resource-secretKey">
    <!--文字提示-->
    <p class="intro">
      用于后端访问七牛云使用的密钥（可以设置多对密钥(Access/Secret Key)，但只能运行一个密钥；出于安全考虑，建议周期性地更换密钥。
      您可以查看更多）
      <el-link type="primary" href="https://developer.qiniu.com/af/kb/1334">安全使用密钥建议</el-link>。
    </p>
    <!--密钥数据-->
    <key-from-data
      v-show="size.isSmallSize||size.isMediumSize"
      :keys="keys"
      @setKeys="setKeys"
      @delKey="delKey"
      @updateStatus="updateStatus"
    ></key-from-data>
    <key-table-data
      v-show="!(size.isSmallSize||size.isMediumSize)"
      :keys="keys"
      @setKeys="setKeys"
      @delKey="delKey"
      @updateStatus="updateStatus"
    ></key-table-data>
    <!--创建密钥-->
    <el-button
      size="small"
      type="primary"
      ref="addKeys"
      style="float:right;margin:5px 0;"
      @click="isOpenCreate = true"
    >创建密钥</el-button>
    <create-key :skey="key" @createKey="createKey" :isOpenCreate.sync="isOpenCreate"></create-key>
  </div>
</template>
<script>
import KeyFromData from './components/KeyData/FromData'
import KeyTableData from './components/KeyData/TableData'
import CreateKey from './components/CreateKey'
export default {
  components: {
    KeyFromData,
    KeyTableData,
    CreateKey,
  },
  data() {
    return {
      keys: [], //所有密钥
      isOpenCreate: false, //是否打开创建密钥窗口
      //创建密钥时上传给服务端的数据
      key: {
        accessKey: '',
        securityKey: '',
        bucketName: '',
        domainOfBucket: '',
        region: '',
        remark: '',
      },
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  created() {
    this.setKeys()
  },
  methods: {
    async setKeys() {
      //设置所有key值
      let { data } = await this.$axios.get('/config/qiniu/list')
      if (data.code === 200) {
        this.keys = data.data
        this.keys.forEach((item) => {
          item.state = {}
          item.state.title = item.configStatus ? '使用中' : '已停用'
          item.state.style = item.configStatus ? 'run' : 'over'
        })
      } else {
        this.$message.error({
          message: data.message,
        })
      }
    },
    async createKey() {
      //上传创建密钥数据
      let { data } = await this.$axios.post('config/qiniu/', this.key)
      if (data.code === 200) {
        this.$message.success({
          message: '创建成功',
        })
        this.setKeys()
        this.isOpenCreate = false
      } else {
        this.$message.error({
          message: data.message,
        })
      }
    },
    async delKey(id, password) {
      //删除密钥
      let res = await this.$axios.delete('config/qiniu/', {
        data: { id, password },
      })
      if (res.data.code === 200) {
        this.$message.success({
          message: '删除成功',
        })
        this.setKeys()
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
    async updateStatus(id, status) {
      //修改状态
      let res = await this.$axios.put(`config/qiniu/${id}/info?status=${status}`)
      if (res.data.code === 200) {
        this.$message.success({
          message: status ? '已启用' : '已停用',
          customClass: 'update-status',
        })
        this.setKeys()
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
  },
}
</script>
<style scoped>
</style>
<style>
.resource-secretKey .intro {
  color: #666f80;
  width: 70%;
  text-align: left;
  font-size: 14px;
  margin: 50px 0;
}

.resource-secretKey .el-input {
  margin: 5px 0;
}
.resource-secretKey .el-input.is-active .el-input__inner,
.resource-secretKey .el-input__inner:focus {
  border-color: #c0c4cc !important;
  outline: 0;
}
.resource-secretKey .pwd-show {
  float: right;
  position: relative;
  top: -39px;
  left: -8px;
}
.resource-secretKey .run {
  color: #67c23a;
}
.resource-secretKey .over {
  color: #ff7373;
}
.resource-secretKey .update-status {
  background-color: white;
}
</style>