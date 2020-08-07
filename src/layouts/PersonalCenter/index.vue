<template>
  <div class="personal-center">
    <open-animation :isOpen="isOpenAnimation"></open-animation>
    <div class="header">
      <small-header v-if="size.isSmallSize"></small-header>
      <large-header v-else></large-header>
    </div>
    <div class="main">
      <person-main></person-main>
    </div>
  </div>
</template>
<script>
import OpenAnimation from '@/views/personal-center/OpenAnimation'
import PersonMain from '@/views/personal-center/PersonMain'
import LargeHeader from '@/components/SIAEHeader/LargeSizeScreen'
import SmallHeader from '@/components/SIAEHeader/SmallSizeScreen'
export default {
  name: 'personalCenter',
  components: {
    OpenAnimation,
    PersonMain,
    LargeHeader,
    SmallHeader,
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  data() {
    return {
      isOpenAnimation: false,
    }
  },
  mounted() {
    this.isOpenAnimation = true
    setTimeout(() => {
      this.isOpenAnimation = false
    }, 3000)
  },
}
</script>
