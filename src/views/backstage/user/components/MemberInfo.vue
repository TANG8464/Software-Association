<template>
<div class="member-info">
    <el-form label-position="left" inline class="demo-table-expand" label-width="100px" v-if="info">
        <el-row :gutter="24">
            <el-col :xs="24">
                <el-form-item label="学院:">
                    <span>{{ info.institute ? info.institute.institute_name : '-' }}</span>
                </el-form-item>
                <el-form-item label="专业:">
                    <span>{{ info.specialty ? info.specialty.specialty_name : '-' }}</span>
                </el-form-item>
                <el-form-item label="班级:">
                    <span>{{ info.iclass ? info.iclass.class_name : '-' }}</span>
                </el-form-item>
                <el-form-item label="职位:">
                    <span>{{ info.position ? info.position.positionName : '-' }}</span>
                </el-form-item>
                <el-form-item label="学号:">
                    <span>{{ info.stu_num || '-' }}</span>
                </el-form-item>
                <el-form-item label="姓名:">
                    <span>{{ info.memberName || '-' }}</span>
                </el-form-item>
                <el-form-item label="性别:">
                    <span>{{ info.gender || '-' }}</span>
                </el-form-item>
                <el-form-item label="手机号:">
                    <span>{{ info.phoneNum || '-' }}</span>
                </el-form-item>
                <el-form-item label="邮箱:">
                    <span>{{ info.email || '-' }}</span>
                </el-form-item>
                <el-form-item label="QQ:">
                    <span>{{ info.qq || '-' }}</span>
                </el-form-item>
                <el-form-item label="国籍:">
                    <span>{{ info.nation || '-' }}</span>
                </el-form-item>
                <el-form-item label="家乡:">
                    <span>{{ info.nativePlace || '-' }}</span>
                </el-form-item>
                <el-form-item label="所在地:">
                    <span>{{ info.address || '-' }}</span>
                </el-form-item>
                <el-form-item label="政治面貌：">
                    <span>{{ info.politicalOutlook || '-' }}</span>
                </el-form-item>
                <el-form-item label="学历：">
                    <span>{{ info.education || '-' }}</span>
                </el-form-item>
                <el-form-item label="身份证号：">
                    <span>{{ info.cardID || '-' }}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form-item label="个人说明：">
                    <span>{{ info.description || '-' }}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-form-item label="个人经历：" :key="key">
                    <div v-if="JSON.stringify(info.experienceMap)!=='{}'">
                        <div v-for="(item, key) of info.experienceMap" :key="key">
                            <div style="line-height:25px"><small>{{ key }}</small></div>
                            <el-tag style="margin:0 3px" v-for="chilren in item" :key="chilren.id" closable type="info" @close="delExperience(chilren)">
                                {{ chilren.experienceDes }}
                            </el-tag>
                        </div>
                    </div>
                    <span v-else> -</span>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</div>
</template>

<script>
import {
    searchMemberExperience,
    deleteMemberExperience
} from '@/api/member/experience'
export default {
    props: {
        memberInfo: {
            type: Object,
            require: true,
            default: null,
        },
    },
    data() {
        return {
            info: null,
            key: 0,
        }
    },
    watch: {
        memberInfo(newVal) {
            this.info = newVal
        },
        info(newVal) {
            this.setExperience()
        },
    },
    mounted() {
        this.info = this.memberInfo
    },
    methods: {
        async setExperience() {
            const data = await searchMemberExperience(this.info.id)
            if (data.code === 200) {
                this.info.experienceMap = data.data.experienceMap
                this.key++
                console.log(this.info.experienceMap)
            }
        },
        async delExperience(item) {
            this.$confirm(`确认删除"${item.experienceDes}"`, '删除确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(async () => {
                    const data = await deleteMemberExperience(item.id)
                    if (data.code === 200) {
                        this.setExperience()
                    } else this.$message.error(data.message)
                })
                .catch(() => {})
        },
    },
}
</script>

<style>
.member-info .el-form-item {
    min-width: 280px;
}

.member-info .el-form-item__label {
    color: #99a9bf;
}
</style>
