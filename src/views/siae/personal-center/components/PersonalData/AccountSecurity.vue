<template>
<div class="account-security" v-if="personalInfo">
    <p class="tip" :class="'tip-estate-'+personalInfo.safeEstate">
        安全系数：
        <el-rate v-model="personalInfo.safeEstate" show-text :texts="safetyFactor" :colors="colors" disabled :text-color="colors[personalInfo.safeEstate]" score-template="{value}" :max="5"></el-rate>
    </p>

    <p class="item" :class="{success:personalInfo.githubStatus,warning:!personalInfo.githubStatus}">
        <span>
            <icon name="github" scale="20" width="20"></icon>绑定Github
        </span>
        <span>{{personalInfo.githubStatus?`已绑定:${personalInfo.githubId}`:'未绑定'}}</span>
        <span @click="boundClick('github',!personalInfo.githubStatus)">{{personalInfo.githubStatus?"解除绑定":'绑定Github'}}</span>
    </p>
    <p class="item" :class="{success:personalInfo.giteeStatus,warning:!personalInfo.giteeStatus}">
        <span>
            <icon name="gitee" scale="20" width="20"></icon>绑定码云
        </span>
        <span>{{personalInfo.giteeStatus?`已绑定:${personalInfo.giteeId}`:'未绑定'}}</span>
        <span @click="boundClick('gitee',!personalInfo.giteeStatus)">{{personalInfo.giteeStatus?"解除绑定":'绑定码云'}}</span>
    </p>
    <p class="item">
        <span>
            <icon name="lock" scale="21" width="21"></icon>设置密码
        </span>
        <span>已设置</span>
        <router-link to="/personal-center/update-password" tag="span">修改密码</router-link>
    </p>
    <p class="item">
        <span>
            <icon name="email" scale="20" width="20"></icon>绑定邮箱
        </span>
        <span>{{personalInfo.emailStatus?`${personalInfo.email}`:'未绑定'}}</span>
        <span data-disabled>{{personalInfo.emailStatus?"需修改邮箱请联系管理员":'绑定邮箱'}}</span>
    </p>
</div>
</template>

<script>
import {
    detailedInformation
} from '@/api/active-user'
import {
    binding,
    unbind
} from '@/api/oauth'
import {
    getBaseURL
} from '@/utils/url'
export default {
    data() {
        return {
            personalInfo: null,
            safetyFactor: ['不安全', '低', '中', '良好', '高'],
            colors: {
                0: '#ed5a5a',
                1: '#ed5a5a',
                2: '#ffad4f',
                3: '#f1d622',
                4: '#9ad642',
                5: '#05c212',
            },
        }
    },
    computed: {
        changeMyInfo() {
            return this.$store.state.myInfo
        },
    },
    watch: {
        changeMyInfo() {
            this.setPersonalInfo()
        },
    },
    created() {
        this.setPersonalInfo()
    },
    methods: {
        async setPersonalInfo() {
            const {
                data
            } = await detailedInformation()
            this.personalInfo = data.data
            if (this.personalInfo) {
                this.personalInfo.safeEstate = 2
                if (this.personalInfo.email) {
                    this.personalInfo.emailStatus = true
                    this.personalInfo.safeEstate++
                } else this.personalInfo.emailStatus = false
                if (this.personalInfo.giteeId) {
                    this.personalInfo.giteeStatus = true
                    this.personalInfo.safeEstate++
                } else this.personalInfo.giteeStatus = false
                if (this.personalInfo.githubId) {
                    this.personalInfo.githubStatus = true
                    this.personalInfo.safeEstate++
                } else this.personalInfo.githubStatus = false
            }
        },
        async boundClick(source, status) {
            if (status) {
                const data = await binding(source)
                window.location.href = data.data
            } else {
                this.$confirm('解绑后将不能使用该账号登录', '解绑提醒', {
                        confirmButtonText: '确认解绑',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true,
                    })
                    .then(async () => {
                        const data = await unbind(source)
                        if (data.code === 200) {
                            this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
                            this.$message.success('解绑成功')
                        } else this.$message.error(data.message)
                    })
                    .catch(() => {})
            }
        },
    },
}
</script>

<style lang="scss">
.account-security {
    padding: 20px 0;

    .tip {
        .el-rate {
            display: inline-block;
        }
    }

    .tip-estate-1 {
        color: #ed5a5a;
    }

    .tip-estate-2 {
        color: #ffad4f;
    }

    .tip-estate-3 {
        color: #f1d622;
    }

    .tip-estate-4 {
        color: #9ad642;
    }

    .tip-estate-5 {
        color: #05c212;
    }

    .item {
        margin: 0;
        padding: 15px 0;
        border-top: 1px dashed #e0e0e0;
        border-bottom: 1px dashed #e0e0e0;

        span:first-child {
            text-align: left;
        }

        span {
            width: 33%;
            display: inline-block;
            text-align: center;
        }

        span:last-child {
            color: #409eff;
            text-align: right;
        }

        span[data-disabled] {
            color: #c0c0c0;
            font-size: 12px;
        }
    }

    .success {
        span:first-child {
            color: #000000;
        }

        span {
            color: #05c212;
        }

        span:last-child {
            color: #ed5a5a;
        }
    }

    .item:last-child {
        border-top: none;
    }
}
</style>
