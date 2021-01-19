<template>
<div class="menu-authority">
    <el-row :gutter="24">
        <el-col :span="24" style="padding:0 20px">
            <!-- 职位管理 -->
            <position-manage ref="roleManage"></position-manage>
        </el-col>
    </el-row>
    <el-row :gutter="24">
        <el-col :span="24" style="padding:0 20px">
            <!-- 权限管理 -->
            <role-manage ref="roleManage" @setAllRole="setAllRole" :allRole="allRole"></role-manage>
        </el-col>
    </el-row>
    <el-row :gutter="24">
        <el-col :span="24" style="padding:0">
            <!-- 权限分配 -->
            <role-allocation ref="roleAllocation" @setAllRole="setAllRole" :allRole="allRole"></role-allocation>
        </el-col>
    </el-row>
</div>
</template>

<script>
import PositionManage from './components/MenuAuthority/PositionManage'
import RoleManage from './components/MenuAuthority/RoleManage'
import RoleAllocation from './components/MenuAuthority/RoleAllocation'
import {
    searchAllRole
} from '@/api/menu/role'
export default {
    name: 'authority',
    components: {
        PositionManage,
        RoleManage,
        RoleAllocation,
    },
    data() {
        return {
            allRole: [], //所有权限
        }
    },
    created() {
        this.setAllRole()
    },
    methods: {
        async setAllRole() {
            const res = await searchAllRole({
                limit: 1000,
            })
            if (res.code === 200) {
                this.allRole = res.data.records
            } else this.$message.error(res.message)
        },
    },
}
</script>

<style>
</style>
