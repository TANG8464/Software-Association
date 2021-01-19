<template>
  <div
    class="siae-homepage"
    ref="siae-homepage"
    :class="{
      'not-scroll': size.isLargeSize && size.isLandscape,
      'full-screen': active === 0 && !lessThenMedium,
    }"
    :style="{ height: size.maxH - (active === 0 ? 0 : 60) + 'px' }"
  >
    <div
      class="content"
      ref="content"
      style="position: relative; height: 100%"
      :style="{ transform: `translate3d(0px, ${ty}px, 0px)` }"
    >
      <!-- 轮播图 -->
      <div :class="{ page: !lessThenMedium, active: active === 0 }">
        <imgCar :imgCars="imgCars" :height="height + 'px'"></imgCar>
      </div>
      <!-- 中间需要展示的内容 -->
      <div
        v-for="(item, index) in activeArr"
        :key="index + 1"
        :class="{ page: !lessThenMedium, active: active === index + 1 }"
        :style="{
          width,
          height: lessThenMedium && !size.isLandscape ? 'auto' : `${height}px`,
        }"
        style="margin: auto"
      >
        <component :is="item"></component>
      </div>
      <!-- 友情链接 -->
      <div
        :class="{ active: active === 6 }"
        :style="{
          width,
          height: lessThenMedium && !size.isLandscape ? 'auto' : `${height}px`,
        }"
        style="margin: auto"
      >
        <siae-footer></siae-footer>
      </div>
    </div>
    <div class="right-tip-top" v-if="active !== 0 && !lessThenMedium">
      <div
        class="anchor"
        :class="{ active: index + 1 === active }"
        v-for="(item, index) in anchor"
        :key="index"
        @click="active = index + 1"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import imgCar from '@/components/SIAEImageCarousel'
import NewestNotice from './components/NewestNotice'
import Teach from './components/Teach'
import Resource from './components/Resource'
import Achievement from './components/Achievement'
import OutstandingMember from './components/OutstandingMember'
import SiaeFooter from '@/layouts/SIAE/components/SiaeFooter'
import { searchCarousel } from '@/api/carousel'

export default {
  name: 'HomePage',
  components: {
    imgCar,
    NewestNotice,
    Teach,
    Resource,
    Achievement,
    OutstandingMember,
    SiaeFooter,
  },
  data() {
    return {
      imgCars: [],
      active: 0,
      scrollValue: 0,
      time: 0,
      total: 6,
      anchor: ['最新公告', '教学方向', '协会资源', '主要成就', '优秀成员', '友情链接'],
      activeArr: ['NewestNotice', 'Teach', 'Resource', 'Achievement', 'OutstandingMember'],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    lessThenMedium() {
      return this.size.isSmallSize || this.size.isMediumSize
    },
    width() {
      return this.size.isSmallSize ? '97%' : '80%'
    },
    height() {
      return this.lessThenMedium && !this.size.isLandscape
        ? (this.size.maxW * 9) / 16
        : this.size.maxH
    },
    ty() {
      return this.size.isLargeSize && this.size.isLandscape ? -this.scrollValue * this.active : 0
    },
  },
  watch: {
    size() {
      this.scrollValue = this.size.maxH-10
    },
  },
  mounted() {
    this.scrollValue = this.size.maxH-10
    if (this.$route.query.active) this.active = this.$route.query.active
    const el = this.$refs['content']
    console.log(el)
    // 滚动监听实现上下翻动页面
    el.onmousewheel = (e) => {
      if (!this.size.isMediumSize && !this.size.isSmallSize) {
        const newDate = new Date().getTime()
        if (newDate - this.time > 800) {
          if (e.wheelDelta < 0) {
            if (this.active < this.total) this.active++
          } else {
            if (this.active > 0) this.active--
          }
          this.time = newDate
          // if (this.active < 1) this.scrollValue = this.size.maxH - 60
          // else this.scrollValue = this.size.maxH
        }
      }
    }
    setTimeout(() => {
      this.searchCarousel()
    }, 500)
  },
  methods: {
    // 查找轮播图
    async searchCarousel() {
      const data = await searchCarousel(1, 1000)
      if (data.code === 200) {
        this.imgCars = []
        data.data.records.forEach((item) => {
          this.imgCars.push(item.url)
        })
      } else this.$message.error(data.message)
    },
  },
}
</script>

<style>
</style><style lang="scss">
.siae-homepage {
  color: white;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 0;

  .content {
    transition: all 0.5s;
  }

  .page {
    opacity: 0;
    transition: all 0.5s;
  }

  .active {
    opacity: 1;
  }

  .right-tip-top {
    position: fixed;
    right: 30px;
    top: 15%;
    bottom: 0;
    transition: all 1s;
    .anchor {
      color: #666666;
      cursor: pointer;
    }
    .active {
      color: white;
      font-weight: 600;
    }
  }
}

.not-scroll {
  overflow: hidden;
}

.full-screen {
  position: fixed;
  top: 0;
}
</style>
