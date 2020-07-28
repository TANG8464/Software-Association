<template>
  <div class="secretKey_tabledata">
    <el-table :data="showKeys" style="width: 100%" :key="skStatus">
      <el-table-column prop="configValue.bucketName" label="bucketName" width="110"></el-table-column>
      <el-table-column label="AccessKey/SecretKey">
        <!--ak/sk-->
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;width:100%;">
            <div style="width:100%;">
              <label style="margin:0 5px;">AK:</label>
              <el-input v-model="scope.row.configValue.accessKey" readonly></el-input>
              <label style="margin:0 5px;">SK:</label>
              <el-input
                v-model="scope.row.configValue.securityKey"
                :type="scope.row.skStatus"
                readonly
              ></el-input>
              <!--显示或隐藏sk-->
              <el-button
                type="info"
                size="mini"
                class="pwd-show"
                @click="changeType(scope.$index,'text')"
                v-if="scope.row.skStatus==='password'"
              >显示</el-button>
              <el-button
                type="info"
                size="mini"
                class="pwd-show"
                @click="changeType(scope.$index,'password')"
                v-else
              >隐藏</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span :class="scope.row.state.style" v-html="scope.row.state.title"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.configStatus">
            <el-button size="mini" type="danger" @click="blockUp(scope.$index, scope.row)">停用</el-button>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="warning"
              plain
              @click="startUsing(scope.$index, scope.row)"
            >启用</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      skStatus: 0,
      showKeys: []
    }
  },
  props: {
    keys: {
      type: Array,
      deafults: []
    }
  },
  watch: {
    keys(newVal) {
      this.showKeys = newVal
      this.showKeys.forEach(item => {
        item.skStatus = 'password'
      })
    }
  },
  methods: {
    changeType(index, type) {
      this.showKeys[index].skStatus = type
      this.skStatus++
    },
    blockUp(index, row) {
      //禁用密钥
      this.$confirm('您确定禁用此密钥吗？禁用前请确认该密钥没有被使用。', ' ', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$emit('updateStatus', row.id, !row.configStatus)
      })
    },
    startUsing(index, row) {
      //启用密钥
      this.$emit('updateStatus', row.id, !row.configStatus)
    },
    handleDelete(index, row) {
      //删除密钥时弹出密码验证
      this.$prompt('请输入你的密码', '密码验证', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        customClass: 'fullScreen'
      }).then(({ value }) => {
        this.$emit('delKey', row.id, value)
      })
    }
  }
}
</script>

<style>
/*
.el-message-box__wrapper {
  display: flex;
  align-items: center;
  background-color: white;
}
.fullScreen {
  width: 100%;
  box-shadow: none;
  border: none;
}
.fullScreen .el-message-box__headerbtn {
  position: fixed;
  top: 0;
  right: 0;
  height: 50px;
}
*/

.el-icon-lock {
  font-size: 35px;
  text-align: center;
  display: block;
}

.fullScreen .el-message-box__title {
  font-weight: 600;
  font-size: 18px;
}
.fullScreen .el-message-box__content p,
.fullScreen .el-message-box__title,
.fullScreen .el-icon-lock,
.fullScreen .el-message-box__input,
.fullScreen .el-message-box__btns {
  text-align: center;
  line-height: 50px;
  margin: auto auto;
  box-sizing: content-box;
}
.fullScreen .el-message-box__input {
  width: 300px;
}
.fullScreen .el-message-box__close {
  font-size: 28px;
}
</style>
