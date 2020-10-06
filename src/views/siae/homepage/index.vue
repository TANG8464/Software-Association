<template>
<div class="siae-homepage" ref="siae-homepage" :class="{ 'not-scroll': !size.isSmallSize, 'full-screen': active === 0 }" :style="{ height: this.size.maxH - (active === 0 ? 0 : 60) + 'px' }">
    <div class="content" ref="content" style="position: relative; height: 100%" :style="{ transform: `translate3d(0px, ${ty}px, 0px)` }">
        <div :class="{ page: !size.isSmallSize, active: active === 0 }">
            <imgCar :imgCars="imgCars" :height="height + 60 + 'px'"></imgCar>
        </div>
        <div :class="{ page: !size.isSmallSize, active: active === 1 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <newest-notice></newest-notice>
        </div>
        <div :class="{ page: !size.isSmallSize, active: active === 2 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <teach></teach>
        </div>
        <div :class="{ page: !size.isSmallSize, active: active === 3 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <resource></resource>
        </div>
        <div :class="{ page: !size.isSmallSize, active: active === 4 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <outstanding-member></outstanding-member>
        </div>
        <div :class="{ page: !size.isSmallSize, active: active === 5 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <achievement></achievement>
        </div>
        <div v-if="!size.isSmallSize && !size.isMedium" :class="{ active: active === 6 }" :style="{ width, 'min-height': height + 'px' }" style="margin: auto">
            <siae-footer></siae-footer>
        </div>
    </div>
    <div class="right-tip" v-if="active !== 0 && !size.isSmallSize">
        <div class="doc" :class="{ active: item === active }" v-for="item in total" :key="item" @click="active = item"></div>
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
import {
    searchCarousel
} from '@/api/carousel'

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
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '97%' : '80%'
        },
        height() {
            return this.size.isSmallSize && !this.size.isLandscape ?
                (this.size.maxW * 9) / 16 :
                this.size.maxH - 60
        },
        ty() {
            return -this.scrollValue * this.active
        },
    },
    watch: {
        size() {
            this.scrollValue = this.size.maxH - 60
        },
    },
    mounted() {
        this.searchCarousel()
        this.scrollValue = this.size.maxH - 60
        const el = this.$refs['content']
        el.onmousewheel = (e) => {
            if (!this.size.isMediumSize && !this.size.isSmallSize) {
                const newDate = new Date().getTime()
                if (newDate - this.time > 1000) {
                    if (e.wheelDelta < 0) {
                        if (this.active < this.total) this.active++
                    } else {
                        if (this.active > 0) this.active--
                    }
                    this.time = newDate
                }
            }
        }
    },
    methods: {
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
    z-index: -1;

    .content {
        transition: all 1s;
    }

    .page {
        opacity: 0;
        transition: all 1s;
    }

    .active {
        opacity: 1;
    }

    .right-tip {
        position: fixed;
        right: 30px;
        top: 45%;
        bottom: 0;
        transition: all 1s;

        .doc {
            border: 1px solid white;
            width: 6px;
            height: 6px;
            margin: 3px;
            border-radius: 50%;
            transition: all 1s;
        }

        .active {
            background: white;
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
