<template>
<div class="home">
    <router-link to="/personal-center/my-info" tag="div" style="font-size:14px">
        <i>
            <icon name="personal-info" scale="23" width="23"></icon>
        </i>
        我的信息
        <i class="el-icon-arrow-right right"></i>
    </router-link>
    <el-collapse accordion>
        <el-collapse-item>
            <template slot="title">
                <i>
                    <icon name="dynamic-state" scale="20" width="20"></icon>
                </i>
                个人动态
            </template>
            <dynamic-state></dynamic-state>
        </el-collapse-item>
        <el-collapse-item>
            <template slot="title">
                <i>
                    <icon name="experience" scale="23" width="23"></icon>
                </i>
                我的经历
            </template>
            <my-experience></my-experience>
        </el-collapse-item>
        <el-collapse-item>
            <template slot="title">
                <i>
                    <icon name="safe" scale="20" width="20"></icon>
                </i>
                账号安全
            </template>
            <account-security></account-security>
        </el-collapse-item>
    </el-collapse>
</div>
</template>

<script>
import DynamicState from './components/PersonalData/DynamicState'
import MyExperience from './components/PersonalData/MyExperience'
import AccountSecurity from './components/PersonalData/AccountSecurity'
export default {
    name: 'personalData',
    components: {
        DynamicState,
        MyExperience,
        AccountSecurity,
    },
    data() {
        return {
            personalInfo: null,
        }
    },
}
</script>

<style lang="scss">
.home {
    .right {
        margin: 0 8px 0 auto;
        float: right;
        position: relative;
        top: 8px;
    }

    .el-collapse-item__header,
    .el-collapse-item__wrap {
        background: none !important;
    }

    .el-collapse-item__header {
        border-bottom: 1px solid #d2d2d2 !important;
    }

    .el-collapse {
        border-top: 1px solid #d2d2d2;
    }
}
</style>
