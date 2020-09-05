<template>
<div class="personal-center">
    <open-animation :isOpen="isOpenAnimation"></open-animation>
    <div class="main">
        <div class="person-main">
            <div class="content" ref="content" :style="{'padding':`0 ${margin}`,'top':top+'px'}">
                <div class="username-box">
                    <span @click="isOpenAvatarInfo=true">
                        <personal-avatar :avatarSize="avatarSize"></personal-avatar>
                    </span>
                    <span class="username" :style="{'margin-left': (4+size.maxW*0.01)+'px','font-size': (16+size.maxW*0.01)+'px'}">{{activeUser}}</span>
                </div>
                <div style="overflow: auto;padding-bottom:50px;box-sizing: border-box;" :style="{height:size.maxH-320+'px'}">
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
import PersonalAvatar from '@/components/PersonalAvatar'
import AvatarInfo from './components/AvatarInfo'

import {
    getActiveUserInfo
} from '@/api/active-user'
export default {
    name: 'personalCenter',
    components: {
        OpenAnimation,
        PersonalAvatar,
        AvatarInfo,
    },

    data() {
        return {
            isOpenAnimation: false,
            isOpenAvatarInfo: false,
            activeUser: null,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },

        background() {
            return require('@/assets/img/personalCenter/back.jpg')
        },
        margin() {
            return this.size.isSmallSize ? '20px' : `${this.size.maxW * 0.2}px`
        },
        top() {
            return this.size.isSmallSize ? 200 : 400
        },
        avatarSize() {
            return this.size.isSmallSize ? 80 : 120
        },
        isChangeMyInfo() {
            return this.$store.state.myInfo
        },
    },
    watch: {
        isChangeMyInfo() {
            this.setActiveUser()
        },
    },
    mounted() {
        this.isOpenAnimation = true
        setTimeout(() => {
            this.isOpenAnimation = false
        }, 3000)
        this.setActiveUser()
        window.onmousewheel = () => {
            const el = this.$refs.content
            const value = this.size.isSmallSize ? 20 : 200
            if (event.wheelDelta < 0) {
                el.style.top = this.top - value + 'px'
                window.onmousewheel = null
            }
        }
    },
    methods: {
        async setActiveUser() {
            const {
                data
            } = await getActiveUserInfo()
            if (data.code === 200) {
                this.activeUser = data.data.memberName || '未登录'
            } else {
                this.activeUser = '未登录'
                this.$router.push('/personal-center/home')
            }
        },
    },
}
</script>

<style lang="scss">
.personal-center {
    .person-main {
        .back {
            position: absolute;
            top: 0;
            margin: 0;
            background-position: center bottom;
            background-repeat: no-repeat;
            background-size: contain;
            width: 100%;
            z-index: -1;
        }

        .content {
            background-color: rgba(255, 255, 255, 0.90);
            transition: all 0.5s;
            position: fixed;
            width: 100%;
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
