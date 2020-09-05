<template>
<div class="siae">
    <div class="back" ref="back" id="back" :class="{'blur':isOpenMsg}"></div>
    <div class="siae-content" :class="{container:isClose}">
        <div id="universe-box" v-if="!isClose" :class="{'blur':isOpenMsg}">
            <img src="@/assets/img/back/1.gif" alt :style="{width:size.maxW*0.1+'px'}" />
        </div>
        <large-header :activeIndex="Index"></large-header>
        <div class="main" :class="{'blur':isOpenMsg,'shift-dow':isOpenMsg}">
            <router-view />
        </div>
    </div>
</div>
</template>

<script>
import LargeHeader from '@/components/SIAEHeader/LargeSizeScreen'
import {
    back,
    close
} from '@/assets/js/background.js'
export default {
    name: 'siae',
    components: {
        LargeHeader,
    },
    data() {
        return {
            Index: '/homePage',
            isClose: false,
            activeBack: {},
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
    },
    watch: {
        isChangeBack(newVal) {
            console.log(newVal)

            this.init()
        },
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            const booMap = {
                true: true,
                false: false,
            }
            const activeBack = JSON.parse(localStorage.getItem('activeBack'))
            const isOpenBack = localStorage.getItem('isOpenBack')
            const el = this.$refs.back
            if (booMap[isOpenBack] && activeBack) {
                this.isClose = true
                el.style = `background:url(${activeBack.url});background-position: 50%;background-repeat: no-repeat;background-size: cover;`
                close(el)
            } else {
                el.style = ''
                back(this.$refs.back)
                this.isClose = false
            }
        },
    },
}
</script>

<style lang="scss">
.siae {
    background-color: rgba(0, 0, 0, 0.4);

    .back {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: 0;
        height: 100%;
        width: 100%;
    }

    .siae-content {
        background: rgba(0, 0, 0, 0.4);
    }

    .container {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: 0;
        height: 100%;
        width: 100%;

    }

    .header {
        z-index: 100;
    }

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

    .blur {
        filter: blur(7px);
    }

    .main {
        position: relative;
        top: 8px;
        translate: all 1s;

    }

    .shift-dow {
        top: 15px;
    }
}
</style>
