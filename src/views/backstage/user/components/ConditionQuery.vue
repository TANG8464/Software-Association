<template>
<el-popover placement="bottom" trigger="click" v-model="isOpenCondition">
    <ul style="list-style:none;">
        <li>
            <span class="condition_title">所在学院：</span>
            <el-select v-model="searchData.instituteID" placeholder="请选择" size="mini" style="width:110px;margin:5px;" @change="changeInstitute()">
                <el-option label="所有" :value="null"></el-option>
                <el-option v-for="item in institutesList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </li>
        <li>
            <span class="condition_title">所在专业：</span>
            <el-select size="mini" v-model="searchData.specialtyID" placeholder="请选择" style="width:110px;margin:5px;" @change="changeSpecialty()">
                <el-option label="所有" :value="null"></el-option>
                <el-option v-for="item in specialtyList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </li>
        <li>
            <span class="condition_title">所在班级：</span>
            <el-select size="mini" v-model="searchData.classID" placeholder="请选择" style="width:110px;margin:5px;" @change="queryCondition()">
                <el-option label="所有" :value="null"></el-option>
                <el-option v-for="item in classList" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </li>
        <li>
            <span class="condition_title">每 页</span>
            <el-select size="mini" v-model="searchData.limit" placeholder="请选择" style="width:110px;margin:5px;" @change="queryCondition()">
                <el-option label="10" value="10"></el-option>
                <el-option label="20" value="20"></el-option>
                <el-option label="50" value="50"></el-option>
            </el-select>
            <span class="condition_title">条</span>
        </li>
    </ul>
    <condition-icon slot="reference" @click="isOpenCondition=true"></condition-icon>
</el-popover>
</template>

<script>
import ConditionIcon from '@/components/ConditionIcon'
import {
    searchInstitutes,
    searchSpecialty,
    searchClass
} from '@/api/member/institutes'
export default {
    components: {
        ConditionIcon,
    },
    props: {
        condition: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            isOpenCondition: false,
            searchData: {},
            institutesList: [],
            specialtyList: [],
            classList: [],
        }
    },
    watch: {
        searchData(newVal) {
            this.$emit('update:condition', newVal)
        },
    },
    mounted() {
        this.searchData = this.condition
        this.setInstitutesList()
    },
    methods: {
        changeInstitute() {
            this.setSpecialtyList()
            this.queryCondition()
        },
        changeSpecialty() {
            this.setClassList()
            this.queryCondition()
        },
        queryCondition() {
            this.$emit('queryCondition')
        },
        async setInstitutesList() {
            const data = await searchInstitutes()
            if (data.code === 200) {
                this.institutesList = data.data
            } else this.$message.error(data.message)
        },
        async setSpecialtyList() {
            const data = await searchSpecialty(this.searchData.instituteID)
            if (data.code === 200) {
                this.specialtyList = data.data
            } else this.$message.error(data.message)
        },
        async setClassList() {
            const data = await searchClass(this.searchData.specialtyID)
            if (data.code === 200) {
                this.classList = data.data
            } else this.$message.error(data.message)
        },
    },
}
</script>
