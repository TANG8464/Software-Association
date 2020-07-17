<template>
  <div class="allocation role-allocation">
    <el-divider content-position="left">权限分配</el-divider>
    <div class="powerTable" ref="powerTable">
      <el-table :data="allRole">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p style="color: #909399;">可访问菜单</p>
            <el-tree
              :data="props.row.menuNodeList"
              :default-expand-all="true"
              :props="menuProps"
              empty-text="尚未分配权限"
            ></el-tree>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="roleId" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="150"></el-table-column>
        <el-table-column label="创建者" prop="createName" width="150"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="描述" prop="remark"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-link
              style="display: flex;align-items: center;"
              :underline="false"
              type="primary"
              size="mini"
              @click="openDistribution(scope.$index, scope.row)"
            >
              <allocation-icon></allocation-icon>
              <span>分配权限</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      v-if="isOpenDistri"
      :visible.sync="isOpenDistri"
      width="30%"
      @opened="$refs.power.setCheckedKeys(power.checked)"
    >
      <el-form :model="power">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="power.roleName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配权限" :label-width="formLabelWidth">
          <el-tree
            ref="power"
            :data="menuTree"
            show-checkbox
            node-key="menuId"
            :highlight-current="true"
            :props="menuProps"
            :default-checked-keys="power.checked"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpenDistri = false">取 消</el-button>
        <el-button type="primary" @click="Distribution">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import allocationIcon from "@/views/backstage/menu/components/authority/allocation/allocationIcon.vue";
export default {
  data() {
    return {
      menuTree: [], //权限菜单
      menuProps: {
        //权限展示关系，子集指向menuNodeList，标签名指向name
        children: "menuNodeList",
        label: "name"
      },
      isOpenDistri: false, //是否打开分配权限菜单
      power: {}, //权限信息
      formLabelWidth: "120px"
    };
  },
  props: {
    //所有角色
    allRole: {
      type: Array,
      default: []
    }
  },
  created() {
    this.setMenuTree();
  },
  watch: {
    allRole: function(newVal) {
      setTimeout(() => {
        this.$refs.powerTable.style.opacity = 1;
      }, 500);
    }
  },
  methods: {
    //设置所有权限
    async setMenuTree() {
      try {
        let res = await this.$axios.get("/sys/menu/tree/list");
        if (res.data.code === 200) {
          this.menuTree = res.data.data;
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
    //打开分配权限菜单框
    openDistribution(index, row) {
      this.isOpenDistri = true;
      this.power.roleId = row.roleId;
      this.power.roleName = row.roleName;
      this.power.checked = [];
      this.getChecked(row);
    },
    //获取选中的key
    getChecked(arr) {
      if (arr.menuNodeList && arr.menuNodeList.length != 0) {
        arr.menuNodeList.forEach(item => {
          console.log(this.power);
          this.power.checked.push(item.menuId);
          this.getChecked(item);
        });
      }
    },
    //分配权限
    async Distribution() {
      let checked = this.$refs.power.getCheckedKeys();
      try {
        let res = await this.$axios.put(
          `/sys/role/${this.power.roleId}/menu`,
          checked
        );
        if (res.data.code === 200) {
          this.$message.success({
            message: "分配成功"
          });
          this.isOpenDistri = false;
          this.$emit("setAllRole");
          this.power = {};
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
    }
  },
  components: {
    allocationIcon
  }
};
</script>
<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.powerTable {
  transition: all 1s;
  opacity: 0;
}
</style>