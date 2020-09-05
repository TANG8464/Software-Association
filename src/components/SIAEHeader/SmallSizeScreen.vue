<template>
<div class="siae-phone-header">
    <span class="logo-box">
        <img src="@/assets/img/newLogo.png" alt class="logo" />
    </span>
    <span>
        <span class="actions-icon" style="color:white;">
            <span>
                <change-back ref="changeBack"></change-back>
            </span>
            <span style=" padding: 10px 14px;" @click="isShowNav=!isShowNav">
                <icon v-show="!isShowNav" name="menu-nav" scale="25" width="25"></icon>
                <icon v-show="isShowNav" name="close" scale="25" width="25"></icon>
            </span>
        </span>
        <div class="menu" ref="menu">
            <menu-nav :menu="menu" :parent="parent">
                <span v-if="isLogin" class="siae-menu-item" data-not-choose="true" slot="actions">
                    <header-account ref="account" :account="account"></header-account>
                </span>
                <router-link to="/login" tag="span" class="siae-menu-item" data-not-choose="true" slot="actions" v-else>登录</router-link>
            </menu-nav>
        </div>
    </span>
</div>
</template>

<script>
import HeaderAccount from './RightAccount'
import MenuNav from './MenuNav'
import ChangeBack from './ChangeBack'
import {
    getActiveUserInfo
} from '@/api/active-user'
import token from '@/utils/token'
export default {
    name: 'phoneHeader',
    components: {
        HeaderAccount,
        MenuNav,
        ChangeBack,
    },
    data() {
        return {
            menu: null,
            account: [{
                    name: '个人中心',
                    url: '/personal-center',
                    icon: 'personal-center',
                },
                {
                    name: '管理中心',
                    url: '/Backstage',
                    icon: 'manage',
                },
            ],
            parent: '/',
            accountName: null,
            isLogin: false,
            isShowNav: false,
        }
    },
    computed: {
        isChangeMyInfo() {
            return this.$store.state.myInfo
        },
    },
    watch: {
        isChangeMyInfo() {
            this.init()
        },
        isShowNav(newVal) {
            const el = this.$refs.menu
            if (newVal) {
                el.style.display = 'block'
                setTimeout(() => {
                    ;
                    (el.style.opacity = 1), (el.style.height = '80px')
                }, 1)
            } else {
                el.style.opacity = 0
                setTimeout(() => {
                    el.style.display = 'none'
                }, 500)
            }
        },
    },
    created() {
        this.init()
    },
    methods: {
        async init() {
            const {
                data
            } = await getActiveUserInfo()
            this.isLogin = data.code === 200
            if (this.isLogin) this.accountName = data.data.memberName
            if (token.getHeaderToken()) {
                this.menu = [{
                        name: '首页',
                        url: 'homePage',
                    },
                    {
                        name: '申请入会',
                        url: 'joinIn',
                    },
                    {
                        name: '协会公告',
                        url: 'notice',
                    },
                    {
                        name: '资料下载',
                        url: 'data-download',
                    },
                    {
                        name: '图书借阅',
                        url: 'books-borrow',
                    },
                ]
            } else {
                this.menu = [{
                        name: '首页',
                        url: 'homePage',
                    },
                    {
                        name: '申请入会',
                        url: 'joinIn',
                    },
                    {
                        name: '协会公告',
                        url: 'notice',
                    },
                ]
            }
        },
    },
}
</script>

<style lang="scss">
.siae-phone-header {
    width: 100%;
    text-align: right;
    margin: 5px 0;
    position: relative;
    height: 45px;

    li {
        display: inline;
        margin: 8px;
    }

    .logo-box {
        position: fixed;
        display: block;
        margin: 0;
    }

    .logo {
        height: 50px;
    }

    .menu {
        position: absolute;
        top: 50px;
        z-index: 100;
        background-color: rgba(41, 42, 52, 0.7);
        padding: 10px;
        width: 100%;
        text-align: left;
        opacity: 0;
        display: none;
        height: 0;
        transition: all 0.3s;

        span {
            margin: auto 5px;
            height: 10px;
        }
    }

    .showNav {
        opacity: 1;
        height: 70px;
    }

    .siae-menu {
        height: 70px;
    }

    .siae-menu-item {
        margin: 0;
        padding: 0;
    }

    .actions-icon {
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto 0;

        span {
            float: left;
        }
    }
}
</style>
