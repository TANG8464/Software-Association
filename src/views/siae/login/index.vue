<template>
<div class="login">
    <el-container :key="update" ref="loginBack">
        <div class="login-content-box" :style="{'width':size.isSmallSize?'100%':'320px','height':size.isSmallSize?'100%':null,'border-radius':size.isSmallSize?0:'10px'}">
            <login-content :logo="logo" data-active="登录框">
                <div slot="actions">
                    <div class="other" style="text-align:center">
                        <p class="title">其他登录方式</p>
                        <p class="actions">
                            <span>
                                <icon name="github" scale="30" width="30"></icon>
                            </span>
                            <span>
                                <icon name="gitee" scale="30" width="30"></icon>
                            </span>
                        </p>
                    </div>
                    <div class="forget" :class="{'small-forget':size.isSmallSize}">
                        <p>
                            <span>忘记密码</span>
                        </p>
                    </div>
                </div>
            </login-content>
        </div>
    </el-container>
</div>
</template>

<script>
import LoginContent from './components/Content'
export default {
    components: {
        LoginContent,
    },
    data() {
        return {
            update: false,
            logo: require('@/assets/img/logo.png'),
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
}
</script>

<style lang="scss">
.login {
    overflow: auto;

    .el-container {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: 0;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        height: 100%;
        width: 100%;
    }

    .login-content-box {
        margin: auto auto;
        background-color: rgba(255, 255, 255, 1);
        padding: 30px;

        .other {
            .title {
                color: #999999;
                font-size: 14px;
                border-bottom: 1px solid #e0e0e0;
                padding: 10px 0;
            }

            .actions {
                span {
                    margin: 0 10px;
                }
            }
        }
    }

}
</style>
