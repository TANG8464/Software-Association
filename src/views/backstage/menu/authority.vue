<template>
  <div class="menu-authority">
    <el-row :gutter="24">
      <el-col :span="24" style="padding:0 20px">
        <position-manage ref="roleManage"></position-manage>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24" style="padding:0 20px">
        <role-manage ref="roleManage" @setAllRole="setAllRole" :allRole="allRole"></role-manage>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24" style="padding:0">
        <role-allocation ref="roleAllocation" @setAllRole="setAllRole" :allRole="allRole"></role-allocation>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import PositionManage from './components/MenuAuthority/PositionManage'
import RoleManage from './components/MenuAuthority/RoleManage'
import RoleAllocation from './components/MenuAuthority/RoleAllocation'
export default {
  name: 'authority',
  components: {
    PositionManage,
    RoleManage,
    RoleAllocation,
  },
  data() {
    return {
      allRole: [],
      allRoleJur: [],
    }
  },
  created() {
    this.setAllRole()
  },
  methods: {
    async setAllRole() {
      let res = await this.$axios.get('sys/role/page', {
        params: {
          limit: 1000,
        },
      })
      if (res.data.code === 200) {
        this.allRole = res.data.data.records
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
  },
}
</script>
<style>
</style>