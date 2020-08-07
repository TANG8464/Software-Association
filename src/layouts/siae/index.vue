<template>
  <div class="siae" ref="siae" id="siae">
    <div id="universe-box">
      <img src="@/assets/img/back/1.gif" alt width="260px" />
    </div>

    <small-header v-if="size.isSmallSize" :activeIndex="Index"></small-header>
    <large-header v-else :activeIndex="Index"></large-header>
    <transition name="component" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script>
import LargeHeader from '@/components/SIAEHeader/LargeSizeScreen'
import SmallHeader from '@/components/SIAEHeader/SmallSizeScreen'
import { back } from '@/assets/js/background.js'
export default {
  name: 'siae',
  components: {
    LargeHeader,
    SmallHeader,
  },
  data() {
    return {
      Index: '/homePage',
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  mounted() {
    back(this.$refs.siae)
  },
}
</script>
<style>
#universe-box {
  position: fixed;
  bottom: 0;
  right: 0;
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
</style>
