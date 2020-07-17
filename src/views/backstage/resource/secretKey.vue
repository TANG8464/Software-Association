<template>
  <div class="resource-secretKey">
    <div style="margin:23px 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
        <el-breadcrumb-item style="font-size:18px;">密钥管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--文字提示-->
    <p class="intro">
      用于后端访问七牛云使用的密钥（可以设置多对密钥(Access/Secret Key)，但只能运行一个密钥；出于安全考虑，建议周期性地更换密钥。
      您可以查看更多）
      <el-link type="primary" href="https://developer.qiniu.com/af/kb/1334">安全使用密钥建议</el-link>。
    </p>
    <!--密钥数据-->
    <key-data :keys="keys" @setKeys="setKeys"></key-data>
    <!--创建密钥-->
    <el-button
      size="small"
      type="primary"
      ref="addKeys"
      style="float:right;margin:5px 0;"
      @click="isOpenCreate = true"
    >创建密钥</el-button>
    <el-dialog title="创建密钥" :visible.sync="isOpenCreate" width="30%">
      <createKey :skey="key"></createKey>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOpenCreate = false">取 消</el-button>
        <el-button type="primary" @click="createKey()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import keyData from "@/views/backstage/resource/components/secretKey/keyData.vue";
import createKey from "@/views/backstage/resource/components/secretKey/createKey.vue";
export default {
  components: {
    keyData,
    createKey
  },
  data() {
    return {
      keys: [], //所有密钥
      isOpenCreate: false, //是否打开创建密钥窗口
      //创建密钥时上传给服务端的数据
      key: {
        accessKey: "",
        securityKey: "",
        bucketName: "",
        domainOfBucket: "",
        region: "",
        remark: ""
      }
    };
  },
  created() {
    this.setKeys();
  },
  methods: {
    async setKeys() {
      //设置所有key值
      try {
        let res = await this.$axios.get("/config/qiniu/list");
        if (res.data.code === 200) {
          this.keys = res.data.data;
          this.keys.forEach(item => {
            if (item.configStatus) {
              item.state = {
                title: "使用中",
                style: "run"
              };
            } else {
              item.state = {
                title: "已停用",
                style: "over"
              };
            }
          });
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async createKey() {
      //上传创建密钥数据
      try {
        let res = await this.$axios.post("config/qiniu/", this.key);
        if (res.data.code === 200) {
          this.$message.success({
            message: "成功"
          });
          this.setKeys();
          this.isOpenCreate = false;
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },

};
</script>
<style scoped>
</style>
<style>
.intro {
  color: #666f80;
  width: 70%;
  text-align: left;
  font-size: 14px;
  margin: 50px 0;
}
</style>