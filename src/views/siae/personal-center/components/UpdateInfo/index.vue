<template>
<el-dialog class="update-info" title="修改个人资料" :visible.sync="isOpen" width="42%" :fullscreen="size.isSmallSize">
    <member-info-form :personalInfo.sync="personalInfo" @submitForm="updateInfo" :col="2" :colW="300" :show="[
        'memberName','gender','cascadeClass','stu_num','nation','nativePlace','address','education','politicalOutlook','cardID','phoneNum','qq','description'
      ]"></member-info-form>
</el-dialog>
</template>

<script>
import {
    detailedInformation,
    updatePersonInfo
} from '@/api/active-user'
import MemberInfoForm from '@/components/MemberInfoForm'
export default {
    name: 'updateInfo',
    components: {
        MemberInfoForm,
    },
    props: {
        isOpenUpdate: {
            type: Boolean,
            require: true,
        },
    },
    data() {
        return {
            isOpen: null,
            personalInfo: null,
        }
    },
    watch: {
        isOpenUpdate(newVal) {
            this.isOpen = newVal
        },
        isOpen(newVal) {
            this.$emit('update:isOpenUpdate', newVal)
        },
    },
    computed: {
        size() {
            return this.$store.state.resize
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
        async updateInfo() {
            const res =await updatePersonInfo(this.personalInfo)
            if (res.code === 200) {
                this.$message.success('修改成功')
                this.isOpen = false
                this.setPersonalInfo()
                this.$store.commit('changeMyInfo', !this.$store.state.myInfo)
            } else this.$message.error(res.message)
        },
    },
}
</script>

<style>
.update-info .el-select {
    max-width: 300px;
    width: 100%;
}

.update-info .el-form-item {
    max-width: 300px;
    width: 100%;
    display: inline-block;
    margin: 0 5px;
}

.update-info .el-form--label-top .el-form-item__label {
    padding: 0;
    padding-top: 5px;
}

.update-info .el-form-item__label {
    color: #909399;
}
</style>
