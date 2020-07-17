<template>
  <div class="siae" ref="siae" id="siae">
    <div id="universe-box">
      <img src="@/assets/img/back/1.gif" alt width="260px" />
    </div>
    <pageHeader :activeIndex="Index"></pageHeader>
    <router-view />
  </div>
</template>
<script>
import pageHeader from "@/components/siae/header.vue";
import { back } from "@/assets/js/background.js";
export default {
  name: "siae",
  data() {
    return {
      Index: "/homePage"
    };
  },
  mounted() {
    back(this.$refs.siae);
  },
  components: {
    pageHeader
  }
};
</script>
<style scoped>
#universe-box {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
