<template>
  <div class="personal-center">
    <open-animation :isOpen="isOpenAnimation"></open-animation>
    <div class="header">
      <siae-phone-header v-if="size.isSmallSize"></siae-phone-header>
      <siae-header v-else></siae-header>
    </div>
    <div class="main">
      <person-main></person-main>
    </div>
  </div>
</template>
<script>
import OpenAnimation from '@/views/PersonalCenter/OpenAnimation'
import PersonMain from '@/views/PersonalCenter/PersonMain'
import SiaeHeader from '@/components/siae/SiaeHeader.vue'
import SiaePhoneHeader from '@/components/siae/SiaePhoneHeader.vue'
export default {
  name: 'personalCenter',
  components: {
    OpenAnimation,
    PersonMain,
    SiaeHeader,
    SiaePhoneHeader,
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
