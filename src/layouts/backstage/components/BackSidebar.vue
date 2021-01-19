<template>
<div class="back-sidebar" style="padding:20px 0;" v-if="activeUserInfo">
    <div style="font-size:18px;">
        <person-avatar :avatar="activeUserInfo.avatarUrl"></person-avatar>
    </div>
    <el-tooltip class="item" effect="dark" content="返回首页" placement="left-end">
        <router-link to="/" tag="div" style="font-size:18px;">
            <button class="button">
                <icon name="homepage" scale="25" width="25"></icon>
            </button>
        </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="个人中心" placement="left-end">
        <router-link to="/personal-center" tag="div" style="font-size:18px;">
            <button class="button">
                <icon name="personal-center" scale="25" width="25"></icon>
            </button>
        </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="退出登陆" placement="left-end">
        <button class="button" @click="exit()">
            <icon name="exit" scale="25" width="25"></icon>
        </button>
    </el-tooltip>
</div>
</template>

<script>
import PersonAvatar from '@/components/PersonAvatar'
import token from '@/utils/token'
export default {
    name: 'backSidebar',
    components: {
        PersonAvatar,
    },
    props: {
        maxH: {
            type: Number,
            default: 0,
        },
    },
    created() {
        this.Index = this.$router.currentRoute.path
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.activeUserInfo
        },
    },
    methods: {
        exit() {
            this.$axios('member/logout', {
                    method: 'put',
                })
                .then((res) => {
                    this.$cookies.remove('activeUser')
                    token.removeHeaderToken()
                    this.$notify({
                        title: '退出登录',
                        message: '成功',
                        type: 'success',
                        duration: 2000,
                        showClose: false,
                    })
                    this.$router.push('/')
                })
                .catch((err) => {})
        },
    },
}
</script>

<style lang="scss">
.back-sidebar {
    text-align: center;

    .svg-icon {
        color: #666666;
        transition: all 1s;
    }

    .button {
        background: none;
        border: none;
        border-radius: 5px;
        width: 40px;
        height: 40px;
        padding: 5px;
        margin: 5px 0;
        transition: all 1s;
    }

    .button:hover {
        background-color: #666666;
    }

    .button:hover .svg-icon {
        color: #fff;
    }

    .el-avatar {
        box-shadow: rgb(217, 217, 217) 0px 0px 5px 1px;
    }
}
</style>
