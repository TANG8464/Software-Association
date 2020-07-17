<template>
  <div class="menu-authority">
    <div style="margin:23px 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="width:150px">
        <el-breadcrumb-item style="font-size:18px;">权限管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
     <el-row :gutter="24">
      <el-col :span="24" style="padding:0">
        <position-manage ref="roleManage"></position-manage>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24" style="padding:0">
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
import positionManage from "@/views/backstage/menu/components/authority/position-manage.vue";
import roleManage from "@/views/backstage/menu/components/authority/role-manage.vue";
import roleAllocation from "@/views/backstage/menu/components/authority/allocation.vue";
export default {
  name: "role",
  data() {
    return {
      allRole: [],
      allRoleJur: []
    };
  },
  created() {
    this.setAllRole();
    this.setAllRoleJur();
  },
  methods: {
    async setAllRole() {
      try {
        let res = await this.$axios.get("sys/role/page", {
          params: {
            limit: 1000
          }
        });
          if (res.data.code === 200) {
          this.allRole = res.data.data.records;
          } else {
            this.$message.error({
              message: res.data.message
            });
          }
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
    },
    async setAllRoleJur() {
      try {
      } catch (err) {
        this.$message.error({
          message: err
        });
      }
    }
  },
  components: {
    roleManage,
    roleAllocation,
    positionManage
  }
};
</script>
<style>
</style>