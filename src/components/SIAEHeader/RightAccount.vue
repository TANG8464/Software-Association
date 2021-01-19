<template>
  <div class="right-account">
    <el-dropdown @command="skip" v-if="activeUserInfo">
      <span class="el-dropdown-link">
        <person-avatar :avatar="activeUserInfo.avatarUrl"></person-avatar>
      </span>
      <el-dropdown-menu slot="dropdown">
        <p class="username">{{ activeUserInfo.memberName }}</p>
        <el-dropdown-item v-for="item in account" :key="item.id" :command="item.url">
          <icon :name="item.icon" scale="18" width="18"></icon>
          <span>{{ item.name }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="exit">
          <icon name="exit" scale="18" width="18"></icon>
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import PersonAvatar from '@/components/PersonAvatar'
import { logout } from '@/api/active-user'
import token from '@/utils/token'

export default {
  name: '',
  components: {
    PersonAvatar,
  },
  props: {
    account: {
      type: Array,
      require: true,
    },
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.activeUserInfo
    },
  },
  methods: {
    skip(url) {
      if (url == 'exit') this.exit()
      else this.$router.push(url)
    },
    async exit() {
      const { data } = await logout()
      if (data.code === 200) {
        token.removeHeaderToken()
        this.$notify({
          title: '退出登录',
          message: '成功',
          type: 'success',
          duration: 2000,
          showClose: true,
        })
        this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
        this.$store.commit('exit', !this.$store.state.isExit)
      } else this.$message.error(data.message)
    },
  },
}
</script>

<style lang="scss">
.username {
  margin: 10px;
  color: #409eff;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  padding: 0 25px;
}

.el-dropdown-menu {
  text-align: center;
}
</style>
