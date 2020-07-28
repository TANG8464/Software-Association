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
        <el-table-column v-if="!size.isSmallSize" label="ID" prop="roleId" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="创建者" prop="createName" width="150"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="描述" prop="remark"></el-table-column>
        <el-table-column width="110">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              size="mini"
              @click="openDistribution(scope.$index, scope.row)"
            >
              <icon name="allocation" scale="20" width="20"></icon>
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
      <el-form :model="power" :label-position="labelPosition">
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
            :default-expanded-keys="power.expanded"
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
export default {
  data() {
    return {
      menuTree: [], //权限菜单
      menuProps: {
        //权限展示关系，子集指向menuNodeList，标签名指向name
        children: 'menuNodeList',
        label: 'name',
      },
      isOpenDistri: false, //是否打开分配权限菜单
      power: {}, //权限信息
      formLabelWidth: '120px',
    }
  },
  props: {
    //所有角色
    allRole: {
      type: Array,
      default: [],
    },
  },
  created() {
    this.setMenuTree()
  },
  watch: {
    allRole: function (newVal) {
      setTimeout(() => {
        this.$refs.powerTable.style.opacity = 1
      }, 500)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    labelPosition() {
      console.log(this.size.isSmallSize)

      return this.size.isSmallSize ? 'top' : 'left'
    },
  },
  methods: {
    //设置所有权限
    async setMenuTree() {
      try {
        let res = await this.$axios.get('/sys/menu/tree/list')
        if (res.data.code === 200) {
          this.menuTree = res.data.data
        } else {
          this.$message.error({
            message: res.data.message,
          })
        }
      } catch (err) {
        this.$message.error({
          message: err,
        })
      }
    },
    //打开分配权限菜单框
    openDistribution(index, row) {
      this.isOpenDistri = true
      this.power.roleId = row.roleId
      this.power.roleName = row.roleName
      this.power.checked = []
      this.power.expanded = []
      this.getChecked(row)
      console.log(row)
    },
    //获取选中的key(最底级)
    getChecked(arr) {
      if (arr.menuNodeList && arr.menuNodeList.length != 0) {
        arr.menuNodeList.forEach((item) => {
          if (item.menuNodeList) {
            this.power.expanded.push(item.menuId) //展开节点
            this.getChecked(item)
          } else {
            this.power.checked.push(item.menuId)
          }
          // this.getChecked(item);
        })
      }
    },
    //分配权限
    async Distribution() {
      const checked = this.$refs.power.getCheckedKeys() //获取已选中节点
      const halfChecked = this.$refs.power.getHalfCheckedKeys() //获取半选中节点
      try {
        let res = await this.$axios.put(
          `/sys/role/${this.power.roleId}/menu`,
          checked.concat(halfChecked)
        )
        if (res.data.code === 200) {
          this.$message.success({
            message: '分配成功',
          })
          this.isOpenDistri = false
          this.$emit('setAllRole')
          this.power = {}
        } else {
          this.$message.error({
            message: res.data.message,
          })
        }
      } catch (err) {
        this.$message.error({
          message: err,
        })
      }
    },
  },
}
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