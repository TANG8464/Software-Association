<template>
  <div class="siae" ref="siae">
    <div class="back" ref="back" id="back">
      <div id="universe-box" v-if="!isClose" :class="{ blur: isOpenMsg }">
        <img src="@/assets/img/back/1.gif" alt :style="{ width: size.maxW * 0.1 + 'px' }" />
      </div>
      <div class="siae-content" :class="{ container: isClose }">
        <siae-header :activeIndex="Index"></siae-header>
        <div
          class="main"
          :class="{
            blur: isOpenMsg,
            'shift-dow': isOpenMsg,
            isScroll: !isScrollArr.includes($route.name),
          }"
          :style="{ height: size.maxH - 70 + 'px' }"
        >
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SiaeHeader from './components/SiaeHeader'
import SiaeFooter from './components/SiaeFooter'
import { back, close } from '@/assets/js/background.js'
import { detailedInformation } from '@/api/active-user'
import { getBackgroundById } from '@/api/background'
import { getActiveUserInfo } from '@/api/active-user'
export default {
  name: 'siae',
  components: {
    SiaeHeader,
    SiaeFooter,
  },
  data() {
    return {
      Index: '/homePage',
      isClose: false,
      activeBack: {},
      routes: [
        'homepage',
        'join-in',
        'data-download',
        'books-borrow',
        'home',
        'update-password',
        'my-info',
      ],
      isScrollArr: [
        // 'homePage',
        // 'join-in',
        // 'data-download',
        // 'books-borrow',
        // 'home',
        // 'update-password',
        // 'my-info',
        // 'register',
        // 'apply', 'contact-us',
        // 'common-problem'
        'all',
      ],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    isChangeBack() {
      return this.$store.state.isChangeBack
    },
    isOpenMsg() {
      return this.$store.state.isOpenMsg
    },
    isScroll() {
      return this.$route.name !== 'homepage' || this.size.isSmallSize
    },
    isExit() {
      return this.$store.state.isExit
    },
  },
  watch: {
    isChangeBack(newVal) {
      this.setBack()
    },
    isExit() {
      this.setBack()
    },
  },
  async created() {
    const { data } = await getActiveUserInfo()
    this.$store.commit('setActiveUserInfo', data.data)
  },
  mounted() {
    this.setBack()
  },
  methods: {
    //查询自己设置的背景并设置
    async setBack() {
      const el = this.$refs.back
      el.style = null
      await back(el)
      this.isClose = false
      const { data: res } = await detailedInformation()
      if (res.code === 200 && res.data && [0, null].indexOf(res.data.customBackground) === -1) {
        const data = await getBackgroundById(res.data.customBackground) //查询自己的设置的背景
        if (data.code === 200 && data.data.url) {
          this.isClose = true
          await close(el)
          el.style = `background:url(${data.data.url});background-position: 50%;background-repeat: no-repeat;background-size: cover;`
        } else this.$message.error(data.message)
      }
    },
  },
}
</script>

<style lang="scss">
.siae {
  overflow: hidden;

  .back {
    position: fixed;
    top: 0;
    bottom: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    // z-index: -1;
    overflow: hidden;
  }

  .siae-content {
    background: rgba(0, 0, 0, 0.5);
  }

  .container {
    position: fixed;
    top: 0;
    bottom: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }

  #universe-box {
    position: fixed;
    bottom: 0;
    right: 0;
    filter: brightness(80%);
  }

  .component-enter,
  .component-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

  /* v-enter-active 入场动画时间段 */
  /* v-leave-active 离场动画时间段 */

  .component-enter-active,
  .component-leave-active {
    transition: all 0.3s ease;
  }

  .blur {
    filter: blur(7px);
  }

  .main {
    position: relative;
    top: 8px;
    translate: all 1s;
    // z-index: 0;
  }

  .isScroll {
    overflow: auto;
  }

  .shift-dow {
    top: 15px;
  }
}
</style>
