<template>
<el-table class="member-table" :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" @row-contextmenu="more" @row-dblclick="more">
    <el-table-column type="selection" width="30" v-if="isShowDels"></el-table-column>
    <el-table-column type="expand">
        <template slot-scope="props">
            <member-info :memberInfo="props.row"></member-info>
        </template>
    </el-table-column>
    <el-table-column label="姓名" show-overflow-tooltip width="220">
        <template slot-scope="scope">
            <span style="color:#d61e1e;">
                <icon name="admin" scale="20" width="20" v-if="scope.row.isAdmin"></icon>
            </span>
            <span>{{scope.row.memberName}}</span>
        </template>
    </el-table-column>
    <el-table-column v-if="!size.isSmallSize" prop="id" label="成员号" width="100"></el-table-column>
    <el-table-column v-if="!size.isSmallSize" prop="email" label="邮箱" width="200"></el-table-column>
    <el-table-column v-if="!size.isSmallSize" label="班级">
        <template slot-scope="scope">
            <span>{{scope.row.iclass?scope.row.iclass.class_name:'-'}}</span>
        </template>
    </el-table-column>
    <el-table-column v-if="!size.isSmallSize" prop="position.positionName" label="职位" width="150">
        <template slot-scope="scope">
            <el-select v-model="currentPosition[scope.$index]" placeholder="请选择" @change="changePosition(scope.row,scope.$index)" size="small">
                <el-option v-for="item in position" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </template>
    </el-table-column>
    <el-table-column width="150">
        <template slot="header">
            <div style="text-align:right;">
                <el-button type="danger" size="mini" round plain v-if="!isShowDels" @click="isShowDels=true">
                    <i class="el-icon-delete"></i>
                    批量删除
                </el-button>
            </div>
            <div v-if="isShowDels">
                <el-button type="danger" size="mini" round plain @click="removeMember()">确认</el-button>
                <el-button type size="mini" round plain @click="isShowDels=false">取消</el-button>
            </div>
        </template>
        <template slot-scope="scope">
            <div style="text-align:right;">
                <el-button v-if="scope.row.isAdmin" size="mini" type="danger" @click="changeAdmin(scope.row.id, 2)">取消管理</el-button>
                <el-button v-else size="mini" @click="changeAdmin(scope.row.id,3)">设为管理</el-button>
            </div>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import MemberInfo from './MemberInfo'
import {
    getAllPosition
} from '@/api/member/position'
export default {
    components: {
        MemberInfo,
    },
    props: {
        tableData: {
            type: Array,
            require: true,
        },
        currentPosition: {
            type: Array,
            require: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isShowDels: false,
            position: [],
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    created() {
        this.setPosition()
    },
    methods: {
        //设置当前有的职位
        async setPosition() {
            const data = await getAllPosition(1, 1000)
            if (data.code === 200) {
                this.position = data.data.records
            } else this.$message.error(data.message)
        },
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val)
        },
        more(row, column, event) {
            this.$emit('more', row, column, event)
        },
        changePosition(row, index) {
            this.$emit('changePosition', row, index)
        },
        removeMember() {
            this.$emit('removeMember')
        },
        changeAdmin(id, type) {
            this.$emit('changeAdmin', id, type)
        },
    },
}
</script>

<style>
</style>
