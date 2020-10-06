<template>
<div class="header" :style="{'background-color': isOpenMsg?'rgba(41, 42, 52, 0.8)':null}">
    <menu-nav :menu="size.isSmallSize?[]:menu" :parent="size.isSmallSize?'':parent">
        <span class="siae-menu-item" data-not-choose="true" slot="logo">
            <img src="@/assets/img/newLogo.png" alt class="logo" />
        </span>
        <span v-if="isLogin" class="siae-menu-item" data-not-choose="true" slot="actions">
            <span :class="{'message-icon':sysNoticeCount>0}" style="color:white;" @click="isOpenMsg=true">
                <icon name="message" scale="20" width="20"></icon>
                <span>{{sysNoticeCount>99?'99+':sysNoticeCount}}</span>
                <web-socket :sysNoticeCount.sync="sysNoticeCount" :isLogin="isLogin"></web-socket>
            </span>
            <span style="color:white;margin-right: 5px;" @click="isOpenMsg=false">
                <change-back ref="changeBack" data-active="设置登录页背景"></change-back>
            </span>
            <header-account ref="account" :account="account" :accountName="accountName"></header-account>
        </span>
        <span class="siae-menu-item" data-not-choose="true" slot="actions" v-else>
            <router-link to="/account/login" tag="button" class="login">登录</router-link>
            <router-link to="/account/register" tag="span" class="register-link">注册</router-link>
        </span>
    </menu-nav>
    <menu-nav v-if="size.isSmallSize" :menu="menu" :parent="parent"></menu-nav>
    <div class="message-box" ref="msg-box" :style="{'top':size.isSmallSize?'100px': '60px'}">
        <message :isOpenMsg.sync="isOpenMsg" :isLogin="isLogin" :sysNoticeCount.sync="sysNoticeCount"></message>
    </div>
</div>
</template>

<script>
import HeaderAccount from '@/components/SIAEHeader/RightAccount'
import MenuNav from '@/components/SIAEHeader/MenuNav'
import ChangeBack from '@/components/SIAEHeader/ChangeBack'
import Message from '@/components/SIAEHeader/Message'
import WebSocket from '@/components/SIAEHeader/WebSocket'
import {
    detailedInformation
} from '@/api/active-user'
import token from '@/utils/token'
export default {
    name: 'Header',
    components: {
        HeaderAccount,
        MenuNav,
        ChangeBack,
        Message,
        WebSocket,
    },
    data() {
        return {
            menu: null,
            account: [],
            parent: '/',
            accountName: null,
            isLogin: false,
            isOpenMsg: false,
            sysNoticeCount: 0,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        isChangeMyInfo() {
            return this.$store.state.myInfo
        },
    },
    watch: {
        isChangeMyInfo() {
            this.init()
        },
        isOpenMsg(newVal) {
            const el = this.$refs['msg-box']
            if (newVal) {
                el.style.display = 'block'
                setTimeout(() => {
                    el.style.opacity = 1
                    el.style.bottom = 0
                }, 1)
            } else {
                el.style.opacity = 0
                setTimeout(() => {
                    el.style.display = 'none'
                }, 500)
            }
            this.$store.commit('changeMsg', newVal)
        },
        $route() {
            this.isOpenMsg = false
        },
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            this.menu = [{
                name: '首页',
                url: 'homepage',
            }]
            const {
                data
            } = await detailedInformation()
            this.isLogin = data.code === 200
            let navFlag = false
            if (this.isLogin) {
                this.accountName = data.data.memberName
                this.account = [{
                    name: '个人中心',
                    url: '/personal-center',
                    icon: 'personal-center',
                }]
                const roles = data.data.roles
                if (roles) {
                    let flag = false
                    roles.forEach(async (item) => {
                        //是否包含超管
                        if (item.roleId === -1) flag = true
                        //角色是否包含成员，管理员，超级管理员
                        if ([-1, 2, 3].indexOf(item.roleId) >= 0) navFlag = true
                    })
                    if (flag) {
                        this.account.push({
                            name: '管理中心',
                            url: '/Backstage',
                            icon: 'manage',
                        })
                    }
                }
            }
            if (navFlag) {
                this.menu = this.menu.concat([{
                    name: '协会公告',
                    url: 'notice',
                }, {
                    name: '资料下载',
                    url: 'data-download',
                }, {
                    name: '图书借阅',
                    url: 'books-borrow',
                }])
            } else {
                this.menu = this.menu.concat([{
                    name: '申请入会',
                    url: 'join',
                }, {
                    name: '协会公告',
                    url: 'notice',
                }])
            }
        },
    },
}
</script>

<style lang="scss">
.header {
    overflow: hidden;

    .logo {
        height: 60px;
    }

    .message-icon {
        animation: shake 1s infinite;
    }

    @keyframes shake {
        0% {
            transform: rotate(10deg);
        }

        10% {
            transform: rotate(-10deg);
        }

        20% {
            transform: rotate(10deg);
        }

        30% {
            transform: rotate(-10deg);
        }

        40% {
            transform: rotate(10deg);
        }

        100% {
            transform: rotate(10deg);
        }
    }

    .message-box {
        position: fixed;
        z-index: 100;
        background-color: rgba(41, 42, 52, 0.8);
        width: 100%;
        opacity: 0;
        display: none;
        transition: all 0.5s;
        overflow: hidden;
    }

    .siae-menu-item {
        .login {
            background: none;
            color: rgb(217, 217, 217);
            border: 1px solid rgb(217, 217, 217);
            border-radius: 3px;
            padding: 3px 12px;
            font-size: 13px;
        }

        .login:hover,
        .login:active,
        .login:visited {
            background: none;
            color: white;
            border-color: white;
        }

        .register-link {
            color: rgb(217, 217, 217);
            padding: 3px 10px;
            font-size: 13px;
        }

        .register-link:hover,
        .register-link:active,
        .register-link:visited {
            color: white;
        }
    }
}
</style>
