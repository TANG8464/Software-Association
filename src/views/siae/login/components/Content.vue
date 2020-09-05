<template>
<div class="login-content">
    <div :class="{'sm-landsape':size.isSmallSize&& size.isLandscape}">
        <el-row :gutter="24">
            <el-col :lg="24" :sm="size.isLandscape?12:24" :xs="size.isLandscape?12:24">
                <div style="margin:10px auto;text-align:center;">
                    <img :src="logo" alt height="100px" />
                </div>
                <div v-if="size.isSmallSize&& size.isLandscape">
                    <slot name="actions"></slot>
                </div>
            </el-col>
            <el-col :lg="24" :sm="size.isLandscape?12:24" :xs="size.isLandscape?12:24">
                <el-form :model="form">
                    <el-form-item>
                        <siae-input type="text" v-model="form.username" label="用户名"></siae-input>
                    </el-form-item>
                    <el-form-item>
                        <siae-input type="password" v-model="form.password" label="密码" :lock="true"></siae-input>
                    </el-form-item>
                    <el-form-item>
                        <siae-input type="text" v-model="form.verifyCode" label="验证码" :width="(size.isSmallSize? 45+size.maxW*0.01:58)" :height="48" @keyup.enter.native="login"></siae-input>
                        <div id="verifyImg" @mouseover="cut=true" @mouseout="cut=false" style="display: inline;">
                            <div :style="{backgroundImage:'url('+form.verifyImg+')',height: '48px',width:'130px'}" style="float:right;border-radius: 5px;text-align:center;position:relative;">
                                <span style="position:absolute;left:0;right:0;margin:auto">{{!form.verifyImg?'加载中...':''}}</span>
                                <div class="bg-cut" v-show="cut" @click="getVertifyCode()">
                                    <span>换一张</span>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-checkbox-group v-model="form.rememberMe" style="text-align:left;margin:25px 0;">
                        <el-checkbox label="记住我" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button type="primary" style="width:100%" @click="login()">{{ loading ? '登录中 ...' : '登 录' }}</el-button>
                </div>
                <div v-if="!(size.isSmallSize&& size.isLandscape)">
                    <slot name="actions"></slot>
                </div>
            </el-col>
        </el-row>
    </div>
</div>
</template>

<script>
import token from '@/utils/token'
export default {
    props: {
        logo: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            form: {
                username: '',
                password: '',
                verifyCode: '',
                verifyImg: '',
                rememberMe: false,
            },
            cut: false,
            loading: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    created() {
        this.pageShow()
        this.getVertifyCode()
    },
    methods: {
        pageShow() {
            const user = localStorage.getItem('user')
            if (user) this.form = JSON.parse(user)

            const headerToken = token.getHeaderToken()
            if (headerToken) {
                this.$router.push('/')
            }
        },
        //获取验证码
        async getVertifyCode() {
            const {
                data
            } = await this.$axios.get('verifyImage/', {
                responseType: 'arraybuffer',
            })
            this.form.verifyImg =
                'data:image/png;base64,' +
                btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            this.cut = true
            this.cut = false
        },
        async login() {
            this.loading = true
            const rememberMe = this.form.rememberMe
            const form = this.form
            form.rememberMe = Number(rememberMe)
            delete form.verifyImg
            if (form.username && form.password) {
                let {
                    data
                } = await this.$axios.post('login', form)
                if (data.code === 200) {
                    localStorage.setItem('HEADER-TOKEN', data.headerToken)
                    this.form.rememberMe = rememberMe
                    if (this.form.rememberMe) {
                        delete this.form.verifyCode
                        delete this.form.verifyImg
                        localStorage.setItem('user', JSON.stringify(this.form))
                    } else {
                        localStorage.removeItem('user')
                    }
                    let url = this.$route.query.redirect

                    if (!url) {
                        url = '/'
                    }
                    this.$router.push(url)
                    this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
                    this.$notify.success({
                        title: '成功',
                        message: '登录成功',
                    })
                } else {
                    this.loading = false
                    this.$notify.error({
                        title: '失败',
                        message: data.error,
                    })
                }
                this.getVertifyCode() //更新验证码
            } else {
                this.$notify.error({
                    title: '失败',
                    message: '用户名密码不能为空',
                })
            }
        },
    },
}
</script>

<style lang="scss">
.login-content {
    .sm-landsape {
        position: absolute;
        top: 0;
        left: 20px;
        bottom: 0;
        right: 20px;
        height: 300px;
        margin: auto auto;
    }

    .bg-cut {
        background-color: rgba(0, 0, 0, 0.4);
        width: 100%;
        line-height: 48px;
        text-align: center;
        color: white;
        border-radius: 5px;
    }

    .el-input {
        height: 40px;
    }

    .vf-img {
        height: 48px !important;
        line-height: 48px !important;
    }

    .el-input__inner {
        height: 100% !important;
    }

    .forget {
        text-align: right;
        font-size: 14px;

        span:hover {
            border-bottom: 1px solid #333333;
        }

        .small-forget {
            position: fixed;
            bottom: 0;
            box-sizing: border-box;
            width: 88%;
        }
    }
}
</style>
