<template>
  <div class="personal-center">
    <open-animation :isOpen="isOpenAnimation"></open-animation>
    <div class="main">
      <div class="person-main" ref="content-box">
        <div class="personal-content" ref="content" :style="{ padding: `0 ${margin}` }">
          <div class="username-box">
            <span @click="isOpenAvatarInfo = true" v-if="activeUserInfo">
              <person-avatar :avatar="avatar" :avatarSize="avatarSize"></person-avatar>
            </span>
            <span
              class="username"
              :style="{
                'margin-left': 4 + size.maxW * 0.01 + 'px',
                'font-size': 16 + size.maxW * 0.01 + 'px',
              }"
              >{{ activeUser }}</span
            >
          </div>
          <div style="box-sizing: border-box">
            <transition name="component">
              <router-view></router-view>
            </transition>
          </div>
        </div>
        <avatar-info :isOpenAvatarInfo.sync="isOpenAvatarInfo"></avatar-info>
      </div>
    </div>
  </div>
</template>

<script>
import OpenAnimation from './OpenAnimation'
import PersonAvatar from '@/components/PersonAvatar'
import AvatarInfo from './components/AvatarInfo'

import { getActiveUserInfo } from '@/api/active-user'
export default {
  name: 'personalCenter',
  components: {
    OpenAnimation,
    PersonAvatar,
    AvatarInfo,
  },

  data() {
    return {
      isOpenAnimation: false,
      isOpenAvatarInfo: false,
      activeUser: null,
      avatar: null,
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    margin() {
      return this.size.isSmallSize ? '20px' : `${this.size.maxW * 0.2}px`
    },
    top() {
      return this.size.isSmallSize ? this.size.maxW * 0.3 : 260
    },
    bottom() {
      return this.size.isSmallSize ? this.size.maxW * 0.8 : 260
    },
    avatarSize() {
      return this.size.isSmallSize ? 80 : 120
    },
    isChangeMyInfo() {
      return this.$store.state.myInfo
    },
    activeUserInfo() {
      return this.$store.state.activeUserInfo
    },
    isExit() {
      return this.$store.state.isExit
    },
  },
  watch: {
    isChangeMyInfo() {
      this.setActiveUser()
    },
    isExit() {
      this.setActiveUser()
    },
  },
  mounted() {
    this.isOpenAnimation = true
    setTimeout(() => {
      this.isOpenAnimation = false
    }, 1000)
    this.setActiveUser()
    const el = this.$refs.content
    const elB = this.$refs['content-box']
    el.style.top = this.top + 'px'
    el.style.paddingBottom = this.bottom + 'px'
  },
  methods: {
    async setActiveUser() {
      const { data } = await getActiveUserInfo()
      if (data.code === 200) {
        this.activeUser = data.data.memberName || '未登录'
        this.avatar = data.data.avatarUrl
        this.$store.commit('setActiveUserInfo', data.data)
      } else {
        this.avatar = null
        this.activeUser = '未登录'
        this.$router.push('/personal-center/home')
      }
    },
  },
}
</script>

<style lang="scss">
.personal-center {
  //  position: relative;
  //     min-height: 800px;
  .person-main {
    // overflow: auto;
    .personal-content {
      background-color: rgba(255, 255, 255, 0.9);
      transition: all 1s;
      position: relative;
      box-sizing: border-box;

      .username-box {
        position: relative;
        top: -60px;
        display: flex;
        align-items: flex-start;

        .username {
          color: white;
          text-shadow: rgb(92, 92, 92) 0.1em 0.1em 0.2em;
        }
      }

      .el-collapse {
        margin-top: 15px;
      }
    }
  }

  .component-enter {
    opacity: 0;
    transform: translateX(500px);
  }

  .component-leave-to {
    opacity: 0;
    transform: translateX(-500px);
  }

  /* v-enter-active 入场动画时间段 */
  /* v-leave-active 离场动画时间段 */

  .component-enter-active {
    transition: all 0.3s ease;
  }

  .component-leave-active {
    transition: all 0.1s ease;
  }
}
</style>
