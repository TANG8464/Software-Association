<template>
  <div class="res-secretKey_data">
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
      showKeys: [],
    };
  },
  props: {
    keys: {
      type: Array,
      deafults: []
    }
  },
  watch: {
    keys(newVal) {
      this.showKeys = newVal;
      this.showKeys.forEach(item => {
        item.skStatus = "password";
      });
    }
  },
  methods: {
    changeType(index, type) {
      console.log(this.showKeys);
      this.showKeys[index].skStatus = type;
      this.skStatus++;
    },
    blockUp(index, row) {
      //禁用密钥
      let _this = this;
      this.$confirm("您确定禁用此密钥吗？禁用前请确认该密钥没有被使用。", " ", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        _this.updateStatus(row.id, !row.configStatus);
      });
    },
    startUsing(index, row) {
      //启用密钥
      this.updateStatus(row.id, !row.configStatus);
    },
    handleDelete(index, row) {
      //删除密钥时弹出密码验证
      let _this = this;
      this.$prompt("请输入你的密码", "密码验证", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputType: "password",
        customClass: "fullScreen"
      }).then(({ value }) => {
        _this.delKey(row.id, value);
      });
      // let header = document.querySelector(".fullScreen .el-message-box__header");
      // if (header.className.indexOf("el-icon-lock") == -1) {
      //   let first = header.firstChild;
      //   let div = document.createElement("div");
      //   div.className = "el-icon-lock";
      //   header.insertBefore(div, first);
      // }

    },
    async delKey(id, pwd) {
      console.log(id, pwd);

      //删除密钥
      try {
        let res = await this.$axios.delete("config/qiniu/", {
          data: {
            id: id,
            password: pwd
          }
        });
        if (res.data.code === 200) {
          this.$message.success({
            message: "删除成功"
          });
          this.$emit("setKeys");
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async updateStatus(id, status) {
      //修改状态
      try {
        let res = await this.$axios.put(
          `config/qiniu/${id}/info?status=${status}`
        );
        console.log(res);

        if (res.status === 200) {
          if (res.data.code === 200) {
            this.$message.success({
              message: status ? "已启用" : "已停用",
              customClass: "update-status"
            });
            this.$emit("setKeys");
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style scoped>
.el-input {
  margin: 5px 0;
}
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #c0c4cc !important;
  outline: 0;
}
.pwd-show {
  float: right;
  position: relative;
  top: -39px;
  left: -8px;
}
.run {
  color: #67c23a;
}
.over {
  color: #ff7373;
}
.update-status {
  background-color: white;
}
</style>

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
