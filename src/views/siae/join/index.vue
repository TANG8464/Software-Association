<template>
<div class="join">
    <div class="header">
        <h1 class="welcome-tip" :class="{'gradually-into':isLoadPage}">欢迎加入软件协会</h1>
        <p class="intro"></p>
    </div>
    <div class="main">

        <div>
            <transition name="component" mode="out-in">
                <keep-alive>
                    <router-view />
                </keep-alive>
            </transition>
        </div>
        <div v-if="isNotLogin||isExitLogin" class="pop-up-box">
            <div class="not-login">
                <p v-if="isExitLogin">您已退出账号，请重新登录后继续申请</p>
                <p v-if="isNotLogin"> 您未登录账号，请登录后继续申请</p>
                <el-link type="primary" @click="$router.push('/account/login')">去登陆</el-link>
                <el-link type="danger" @click="$router.push('/account/register')">去注册</el-link>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import token from '@/utils/token'
export default {
    data() {
        return {
            isLoadPage: false,
            isNotLogin: false,
            isExitLogin: false,
        }
    },
    computed: {
        isExit() {
            return this.$store.state.isExit
        },
    },
    watch: {
        isExit(newVal) {
            this.isExitLogin = newVal
        },
    },
    created() {
        this.isNotLogin = !token.getHeaderToken()
        setTimeout(() => {
            this.isLoadPage = true
        }, 100)
    },
}
</script>

<style lang="scss">
.join {
    position: relative;
    text-align: center;
    color: rgb(227, 224, 224);

    .component-enter {
        transform: translateX(50px);
    }

    .component-leave-to {
        opacity: 0;
        transform: translateX(-50px);
    }

    /* v-enter-active 入场动画时间段 */
    /* v-leave-active 离场动画时间段 */

    .component-enter-active,
    .component-leave-active {
        transition: all 0.3s ease;
    }

    .welcome-tip {
        transition: all 1s;
        font-size: 20px;
        opacity: 0;
        margin: 10px;
    }

    .gradually-into {
        font-size: 40px;
        opacity: 1;
    }

    .header {
        min-height: 80px;
    }

    .main {
        min-height: 600px;
        max-width: 800px;
        width: 100%;
        margin: auto;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .not-login {
        margin: auto;
        max-width: 400px;
        width: 100%;
        height: 100px;
        background: white;
        padding: 30px;
        box-sizing: content-box;

        p {
            color: #999999;
        }

        .el-link {
            margin: 0 5px;
        }
    }
}
</style>
