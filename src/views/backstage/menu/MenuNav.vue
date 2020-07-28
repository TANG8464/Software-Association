<template>
  <div class="menu-nav">
    <div class="menu" ref="menu" style="opacity:0;">
      <el-table :data="allMenu" style="width: 100%" ref="menuTable">
        <el-table-column width="50">
          <template slot-scope="scope">
            <i
              :class="scope.row.openIcon"
              v-if="scope.row.type===0&&scope.row.hasChildren"
              @click="insertRow(scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <i
              :class="scope.row.openIcon"
              v-if="scope.row.type===1&&scope.row.hasChildren"
              @click="insertRow(scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="#" width="50">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <span @click="delTip(scope.$index, scope.row)">
                <icon name="remove" scale="20" width="18"></icon>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="menuId" label="ID" width="60"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="url" label="路由"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="perms" label="可访问接口"></el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="图标" width="60">
          <template slot-scope="scope">
            <p v-html="scope.row.icon"></p>
          </template>
        </el-table-column>
        <el-table-column v-if="!size.isSmallSize" label="是否可用" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="right">
          <template slot="header">
            <div
              style="text-align:left;margin:20px 0;display: flex;align-items: center;width:150px"
              @click="openDialog(0,0)"
            >
              <icon name="insert" scale="18" width="18"></icon>
              <span style="color:#008df0;padding:0 8px;">添加菜单</span>
            </div>
          </template>
          <template slot-scope="scope" >
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link el-icon-more"></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openDialog(3,scope.row.type,scope.row)">修改</el-dropdown-item>
                <el-dropdown-item @click.native="openDialog(1,1,scope.row)" v-if="scope.row.type===0">添加子菜单</el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.type==1"
                  @click="openDialog(2,2,scope.row)"
                >添加可访问接口</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--增加修改共用菜单-->
    <el-dialog
      :title="dialogTitle"
      v-if="isOpenDialog"
      :visible.sync="isOpenDialog"
      v-dialogDrag
      :width="size.isSmallSize?'100%':'30%'"
      :destroy-on-close="true"
      @clone="cancel()"
    >
      <el-form :model="menu">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="menu.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="父级菜单"
          style="text-aligin:left;"
          :label-width="formLabelWidth"
          v-if="menu.isP"
        >
          <el-select v-model="menu.parentId" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in parentArr"
              :key="item.menuId"
              :label="item.name"
              :value="item.menuId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路由" :label-width="formLabelWidth" v-if="btnType!=2">
          <el-input v-model="menu.url" autocomplete="off" placeholder="路由地址不包括/Backstage"></el-input>
        </el-form-item>
        <el-form-item label="接口名称" :label-width="formLabelWidth" v-if="btnType===2">
          <el-input v-model="menu.perms" autocomplete="off" placeholder="逗号分隔多个接口"></el-input>
        </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth" v-if="btnType!=2">
          <el-input
            type="textarea"
            v-model="menu.icon"
            autocomplete="off"
            maxlength="3000"
            show-word-limit
            resize="none"
            rows="8"
            placeholder="贴入表示图标的代码(建议宽高18~30px)"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否可用" :label-width="formLabelWidth" style="width:150px">
          <el-switch v-model="menu.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allMenu: [],
      parentArr: [],
      isOpenDialog: false,
      menu: {},
      formLabelWidth: '80px',
      toInsertRowDate: 0, //进入InsertRow函数的时间
      dialogTitle: '',
      btnType: 0,
      menuType: 0,
    }
  },
  created() {
    this.setAllMenu()
  },
  watch: {
    allMenu: function (newVal) {
      setTimeout(() => {
        this.$refs.menu.style.opacity = 1
      }, 500)
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  methods: {
    async setAllMenu() {
      const { data } = await this.$axios.get('sys/menu/tree/list')
      if (data.code === 200) {
        this.allMenu = {}
        this.allMenu = data.data
        this.allMenu.forEach((item) => {
          //用于展开子菜单
          if (item.menuNodeList && item.menuNodeList.length != 0) {
            item.hasChildren = true
            item.open = false
            item.openIcon = 'el-icon-arrow-right'
            item.menuNodeList.forEach((item) => {
              if (item.menuNodeList && item.menuNodeList.length != 0) {
                item.hasChildren = true
                item.open = false
                item.openIcon = 'el-icon-arrow-right'
              }
            })
          }
          this.parentArr.push({
            //修改子菜单时的父级菜单
            menuId: item.menuId,
            name: item.name,
          })
        })
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
    insertRow(index, row) {
      const t = new Date()
      if (t - this.toInsertRowDate > 500) {
        let i = index + 1
        if (!row.open) {
          row.open = true
          const icon = row.icon
          row.openIcon = 'el-icon-loading'
          row.icon = row.openIcon //为了引起渲染，不然上面的class应用不上
          row.icon = icon
          setTimeout(() => {
            row.menuNodeList.forEach((item) => {
              this.allMenu.splice(i++, 0, item)
            })
            row.openIcon = 'el-icon-arrow-down'
          }, 300)
          this.toInsertRowDate = t
        } else {
          let len = row.menuNodeList.length
          if (row.parentId === 0) {
            row.menuNodeList.forEach((item) => {
              if (item.open) {
                item.open = false
                len += item.menuNodeList.length
                item.openIcon = 'el-icon-arrow-right'
              }
            })
          }
          this.allMenu.splice(i, len)
          row.open = false
          row.openIcon = 'el-icon-arrow-right'
        }
      }
    },
    openDialog(menu, type, row) {
      let title = ''
      const menuList = ['添加菜单', '添加子菜单', '添加可访问接口']
      if (menu < 3) {
        title = menuList[menu]
      } else if (menu === 3) {
        this.menu = row
        const menuListT = ['修改菜单', '修改子菜单', '修改可访问接口']
        title = menuListT[type]
        this.menu.isP = type === 1
      }
      if (menu !== 3) {
        this.menu.parentId = row ? row.menuId : 0
        this.menu.type = menu
        this.perms = null
        this.menu.orderNum = menu === 0 ? this.parentArr.length : row.menuNodeList.length
      }
      this.btnType = type
      this.menuType = menu
      this.dialogTitle = title
      this.isOpenDialog = true
    },
    confirm() {
      if (this.menuType === 3) {
        this.updateMenu()
      } else {
        this.addMenu()
      }
    },
    async addMenu() {
      const { data } = await this.$axios.post('sys/menu/', this.menu)
      if (data.code === 200) {
        this.isOpenDialog = false
        this.$message.success({
          message: '添加成功',
        })
        this.menu = {}
        this.$parent.$parent.$refs.asidel.allNav()
        this.setAllMenu()
      } else {
        this.$message.error({
          message: data.message,
        })
      }
    },
    async updateMenu() {
      const { data } = await this.$axios.put('sys/menu/' + this.menu.menuId, this.menu)

      if (data.code === 200) {
        this.$message.success({
          message: '修改成功',
        })
        this.isOpenDialog = false
        this.menu = {}
        this.$parent.$parent.$refs.asidel.allNav()
        this.setAllMenu()
      } else {
        this.$message.error({
          message: data.message,
        })
      }
    },
    delTip(index, row) {
      this.$confirm(`此操作将永久删除"${row.name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteMenu(row.menuId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async deleteMenu(id) {
      const { data } = await this.$axios.delete('sys/menu/' + id)
      if (data.code === 200) {
        this.$message.success({
          message: '删除成功!',
        })
        this.$parent.$parent.$refs.asidel.allNav()
      } else {
        this.$message.error({
          message: res.data.message,
        })
      }
    },
    cancel() {
      this.isOpenDialog = false
      this.menu = {}
      this.setAllMenu()
    },
  },
}
</script>
<style scoped>
.el-dialog {
  z-index: 99999 !important;
}
.el-link {
  font-size: 13px;
}
.el-table__row {
  transition: all 1s;
}
p {
  margin: 0;
}
.menu {
  transition: all 0.5s;
}
</style>