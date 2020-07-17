<template>
  <div class="login-content">
    <div style="margin:10px auto;">
      <img :src="logo" alt height="100px" />
    </div>
    <el-form :model="form">
      <el-form-item>
        <el-input
          type="text"
          style="width:100%"
          v-model="form.username"
          autocomplete="off"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="password"
          style="width:100%"
          v-model="form.password"
          autocomplete="off"
          show-password
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          class="vf-img"
          v-model="form.verifyCode"
          autocomplete="off"
          placeholder="验证码"
        ></el-input>
        <div id="verifyImg" @mouseover="cut=true" @mouseout="cut=false" style="display: inline;">
          <div
            :style="{backgroundImage:'url('+form.verifyImg+')',height: '48px',width:'130px'}"
            style="float:right;border-radius: 5px;"
          >
            <div class="bg-cut" v-show="cut" @click="getVertifyCode()">
              <span>换一张</span>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-checkbox-group v-model="form.rememberMe" style="text-align:left;margin:25px 0;">
        <el-checkbox label="记住我" name="type"></el-checkbox>
      </el-checkbox-group>
    </el-form>
    <div class="demo-drawer__footer">
      <el-button
        type="primary"
        style="width:100%"
        @click="login()"
      >{{ loading ? '登录中 ...' : '登 录' }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        verifyCode: "",
        verifyImg: "",
        rememberMe: false
      },
      cut: false,
      loading: false
    };
  },
  props: {
    logo: {
      type: String,
      default: null
    }
  },
  created() {
    this.pageShow();
    this.getVertifyCode();
    let _this = this;
    document.onkeydown = function (e) {
      if (window.event.keyCode == 13 && _this.$route.fullPath == "/") {
        _this.login();
      }
    };
  },
  mounted() {
    document.querySelector(".vf-img .el-input__inner").style = "height:48px;";
  },
  methods: {
    pageShow() {
      if (localStorage.getItem("user")) {
        let user = localStorage.getItem("user").split("&");
        let boo = {
          true: true,
          false: false
        };
        this.form.username = user[0];
        this.form.password = user[1];
        this.form.rememberMe = boo[user[2]];
      }
      if (localStorage.getItem("HEADER_TOKEN")){
        this.$router.push("/backstage");
      }
    },
    //获取验证码
    async getVertifyCode() {
      try {
        let res = await this.$axios.get("verifyImage/", {
          responseType: "arraybuffer"
        });
        if (res.status === 200) {
          this.form.verifyImg =
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (res, byte) => res + String.fromCharCode(byte),
                ""
              )
            );
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async login() {
      this.loading = true;
      try {
        if (this.form.username && this.form.password) {
          let res = await this.$axios.post("login", {
            username: this.form.username,
            password: this.form.password,
            rememberMe: Number(this.form.rememberMe),
            verifyCode: this.form.verifyCode
          });
          if (res.status === 200) {
            if (res.data.code === 200) {
              if (this.form.rememberMe) {
                localStorage.setItem(
                  "user",
                  this.form.username +
                  "&" +
                  this.form.password +
                  "&" +
                  this.form.rememberMe
                );
              } else {
                localStorage.removeItem("user");
              }
              // this.$cookies.set(
              //   "activeUser",
              //   res.data.userDetail.id + "&" + res.data.userDetail.username
              // );
              localStorage.setItem("HEADER_TOKEN", res.data.headerToken);
              // if (res.data.userDetail.power == "ROLE_ADMIN") { //需改动
              this.$router.push("/Backstage");
              // }
              this.$notify({
                title: "成功",
                message: "登录成功",
                type: "success",
                duration: 2000,
                showClose: false
              });
            } else {
              this.getVertifyCode(); //更新验证码
              this.loading = false;
              this.$notify({
                title: "失败",
                message: res.data.error,
                type: "error",
                duration: 2000,
                showClose: false
              });
            }
          } else {
            this.$message.error({
              message: "请求错误"
            });
          }
        } else {
          this.$notify({
            title: "失败",
            message: "用户名密码不能为空",
            type: "error",
            duration: 2000,
            showClose: false
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
.bg-cut {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  line-height: 48px;
  text-align: center;
  color: white;
  border-radius: 5px;
}

.el-input {
  height: 40px;
}
.vf-img {
  width: 58% !important;
  height: 48px !important;
  line-height: 48px !important;
}
.el-input__inner {
  height: 100% !important;
}
</style>