<template>
<div class="my-info">
    <div class="header">
        <router-link to="/personal-center/home" tag="span">
            <el-link type="info">返回</el-link>
        </router-link>

        <span style="margin:0 8px;color:#e0e0e0"></span>
        <span style="font-weight:600">我的信息</span>
        <span @click="isOpenUpdate=true" style="float:right">
            <el-link :underline="false" type="primary">编辑资料</el-link>
        </span>
    </div>
    <div v-if="personalInfo" style="font-size:14px">
        <h4 class="info-title">基本信息</h4>
        <p>
            <span>ID：</span>
            <span>{{personalInfo.id}}</span>
        </p>
        <p>
            <span>名称：</span>
            <span>{{personalInfo.memberName}}</span>
        </p>
        <p>
            <span>性别：</span>
            <span>{{personalInfo.gender}}</span>
        </p>
        <p>
            <span>QQ：</span>
            <span>{{personalInfo.qq}}</span>
        </p>
        <p>
            <span>邮箱：</span>
            <span>{{personalInfo.email}}</span>
        </p>
        <p>
            <span>手机号：</span>
            <span>{{personalInfo.phoneNum}}</span>
        </p>
        <p>
            <span>身份证：</span>
            <span>{{personalInfo.cardID}}</span>
        </p>
        <p>
            <span>职位：</span>
            <span>{{personalInfo.position?`${personalInfo.position.positionName}(${personalInfo.position.remark})`:'无'}}</span>
        </p>
        <p>
            <span>政治面貌：</span>
            <span>{{personalInfo.politicalOutlook}}</span>
        </p>
        <p>
            <span>个人说明：</span>
            <span>{{personalInfo.description}}</span>
        </p>
        <h4 class="info-title">教育经历</h4>
        <p>
            <span>所在学院：</span>
            <span>{{personalInfo.institute?personalInfo.institute.institute_name:'-'}}</span>
        </p>
        <p>
            <span>所学专业：</span>
            <span>{{personalInfo.specialty?personalInfo.specialty.specialty_name:'-'}}</span>
        </p>
        <p>
            <span>所在班级：</span>
            <span>{{personalInfo.iclass?personalInfo.iclass.class_name:'-'}}</span>
        </p>
        <p>
            <span>学历：</span>
            <span>{{personalInfo.education}}</span>
        </p>
        <p>
            <span>学号：</span>
            <span>{{personalInfo.stu_num}}</span>
        </p>
        <h4 class="info-title">联系地址</h4>
        <p>
            <span>国籍：</span>
            <span>{{personalInfo.nation}}</span>
        </p>
        <p>
            <span>家乡：</span>
            <span>{{personalInfo.nativePlace}}</span>
        </p>
        <p>
            <span>所在地：</span>
            <span>{{personalInfo.address}}</span>
        </p>
    </div>
    <div v-else style="text-align:center;">暂无数据</div>
    <update-info :isOpenUpdate.sync="isOpenUpdate"></update-info>
</div>
</template>

<script>
import UpdateInfo from './components/UpdateInfo'
import {
    detailedInformation
} from '@/api/active-user'
export default {
    components: {
        UpdateInfo,
    },
    data() {
        return {
            personalInfo: null,
            isOpenUpdate: false,
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
        setPersonalInfo() {
            detailedInformation().then((res) => {
                this.personalInfo = res.data.data
            })
        },
    },
}
</script>

<style lang="scss">
.my-info {
    margin: 10px 0;

    .info-title {
        border-radius: 5px;
        text-align: center;
        font-size: 14px;
    }

    p {
        margin: 0;
        border-top: 1px dashed #d2d2d2;
        padding: 10px 0;

        span:first-child {
            color: #909399;
            width: 80px;
            display: inline-block;
            padding-left: 15px;
        }
    }

    p:last-child {
        border-bottom: 1px dashed #d2d2d2;
    }

    .header {
        border-bottom: 1px solid #d2d2d2;
        font-size: 16px;
        padding: 10px 0;
        z-index: 0;
    }
}
</style>
