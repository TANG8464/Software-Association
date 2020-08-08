<template>
  <div class="siae-homepage">
    <div class="content" :style="{'height':size.maxH-60+'px'}">
      <imgCar :imgCars="imgCars" :height="size.isSmallSize?'200px':size.maxH-60+'px'"></imgCar>
      <div>最新公告</div>
    </div>
  </div>
</template>
<script>
import imgCar from '@/components/SIAEImageCarousel'
export default {
  name: 'HomePage',
  data() {
    return {
      imgCars: [
        require('@/assets/img/imgCar/1000285.jpg'),
        require('@/assets/img/imgCar/1001251.jpg'),
        require('@/assets/img/imgCar/1001777.jpg'),
        require('@/assets/img/imgCar/1001917.jpg'),
        require('@/assets/img/imgCar/2000411.jpg'),
      ],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  components: {
    imgCar,
  },
}
</script>
<style>
.siae-homepage {
  position: fixed;
  width: 100%;
  color: white;
}
.siae-homepage .content {
  overflow: auto;
}
</style>