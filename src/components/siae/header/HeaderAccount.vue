<template>
  <el-dropdown @command="skip">
    <span class="el-dropdown-link">
      <personal-avatar></personal-avatar>
    </span>
    <el-dropdown-menu slot="dropdown">
      <h4 style="color:#409EFF;text-align:center">{{accountName}}</h4>
      <el-dropdown-item command="/personalCenter">
        <icon name="personal-center" scale="18" width="18"></icon>
        <span>个人中心</span>
      </el-dropdown-item>
      <el-dropdown-item command="/Backstage" v-show="isShow.backstage">
        <icon name="manage" scale="18" width="18"></icon>
        <span>管理中心</span>
      </el-dropdown-item>
      <div class="line"></div>
      <el-dropdown-item command="exit">
        <icon name="exit" scale="18" width="18"></icon>
        <span>退出登录</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import PersonalAvatar from '@/components/PersonalAvatar'
import { logout } from '@/api/active-user'
import token from '@/utils/token'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  name: '',
  components: {
    PersonalAvatar,
  },
  data() {
    return {
      isShow: {
        backstage: true,
      },
      accountName: null,
    }
  },
  created() {
    this.getUserName()
  },
  methods: {
    getUserName() {
      getActiveUserInfo().then((res) => {
        console.log(res)
        this.accountName = res.data.data.memberName
      })
    },
    skip(url) {
      if (url == 'exit') this.exit()
      else this.$router.push(url)
    },
    exit() {
      this.$parent.isLogin()
      logout().then((res) => {
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
    },
  },
}
</script>
