<template>
  <div class="back-sidebar" style="padding:20px 0;">
    <div style="font-size:18px;">
      <personal-avatar></personal-avatar>
    </div>
    <el-tooltip class="item" effect="dark" content="返回首页" placement="left-end">
      <router-link to="/siae" tag="div" style="font-size:18px;">
        <button class="button">
          <icon name="homepage" scale="25" width="25"></icon>
        </button>
      </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="个人中心" placement="left-end">
      <router-link to="/personalCenter" tag="div" style="font-size:18px;">
        <button class="button">
          <icon name="personal-center" scale="25" width="25"></icon>
        </button>
      </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="退出登陆" placement="left-end">
      <button class="button" @click="exit()">
        <icon name="exit" scale="25" width="25"></icon>
      </button>
    </el-tooltip>
  </div>
</template>
<script>
import PersonalAvatar from '@/components/PersonalAvatar'
import token from '@/utils/token'
export default {
  name: 'backSidebar',
  components: {
    PersonalAvatar,
  },
  props: {
    maxH: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.Index = this.$router.currentRoute.path
  },
  methods: {
    exit() {
      this.$axios('member/logout', {
        method: 'put',
      })
        .then((res) => {
          console.log(res)
          this.$cookies.remove('activeUser')

          token.removeHeaderToken()
          this.$notify({
            title: '退出登录',
            message: '成功',
            type: 'success',
            duration: 2000,
            showClose: false,
          })
          this.$router.push('/')
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
<style>
.back-sidebar {
  text-align: center;
}
.back-sidebar .svg-icon {
  color: rgb(55, 185, 233);
  transition: all 1s;
}
.back-sidebar .button {
  background: none;
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 5px 0;
  transition: all 1s;
}
.back-sidebar .button:hover {
  background-color: rgb(98, 213, 255);
}
.back-sidebar .button:hover .svg-icon {
  color: #fff;
}
</style>