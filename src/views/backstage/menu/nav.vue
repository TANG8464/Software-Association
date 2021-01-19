<template>
<div class="menu-nav">
    <div class="menu" ref="menu" style="opacity:0;">
        <nav-table :allMenu="allMenu" :table-key="key" :isSmallSreen="size.isSmallSize" @openDialog="openDialog" @delTip="delTip"></nav-table>
    </div>
    <!--增加修改共用菜单-->
    <nav-dialog :isOpenDialog.sync="isOpenDialog" :dialogTitle="dialogTitle" :isSmallSreen="size.isSmallSize" :btnType="btnType" :menu="menu" :parentArr="parentArr" @confirm="confirm" @cancel="cancel"></nav-dialog>
</div>
</template>

<script>
import NavDialog from './components/Nav/NavDialog'
import {
    addMenuNav,
    getAllMenuNavTree,
    deleteMenuNav,
    updateMenuNav
} from '@/api/menu'
import NavTable from './components/Nav/NavTable'
export default {
    name: 'menuNav',
    components: {
        NavDialog,
        NavTable
    },
    data() {
        return {
            //所有导航栏菜单
            allMenu: [],
            parentArr: [], //修改子菜单时的所有父级菜单（便于修改父级菜单）
            isOpenDialog: false, //是否打开菜单
            menu: {}, //当前需要操作的menu的基本信息
            toInsertRowDate: 0, //进入InsertRow函数的时间
            dialogTitle: '', //Dialog菜单的标题
            btnType: 0, //Dialog菜单的按钮类型
            menuType: 0, //保存Dialog菜单的类型，便于之后用于判断
            key: 0
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
        //设置所有menu
        async setAllMenu() {
            const data = await getAllMenuNavTree()
            if (data.code === 200) {
                this.allMenu = data.data
                this.key++
                this.allMenu.forEach((item) => {
                    //用于展开子菜单
                    if (item.menuNodeList && item.menuNodeList.length != 0) {
                        item.hasChildren = true
                        item.menuNodeList.forEach((item) => {
                            if (item.menuNodeList && item.menuNodeList.length != 0) {
                                item.hasChildren = true
                            }
                        })
                    }
                    this.parentArr.push({
                        //修改子菜单时的父级菜单
                        menuId: item.menuId,
                        name: item.name,
                    })
                })
            } else this.$message.error(res.data.message)
        },
        //打开共用菜单
        openDialog(menu, type, row) {
            this.menu = { //不要删除该obj，会影响添加菜单
                name: '',
                url: '',
                icon: '',
                status: true,
            }
            let title = ''
            const menuList = ['添加菜单', '添加子菜单', '添加可访问接口'] //菜单标题数组
            if (menu < 3) {
                title = menuList[menu] //菜单标题
                this.menu.parentId = row ? row.menuId : 0 //当前menu的父级id
                this.menu.url = row ? row.url + '/' : '' //当前menu的url
                this.menu.type = menu 
                this.perms = null
                this.menu.orderNum = menu === 0 ? this.parentArr.length : row.menuNodeList.length
            } else if (menu === 3) {
                this.menu = row
                const menuListT = ['修改菜单', '修改子菜单', '修改可访问接口']
                title = menuListT[type]
                this.menu.isP = type === 1
            }
            this.btnType = type
            this.menuType = menu
            this.dialogTitle = title
            this.isOpenDialog = true
        },
        confirm(val) {
            this.menu = val
            if (this.menuType === 3) this.updateMenu()
            else this.addMenu()
        },
        async addMenu() {
            const data = await addMenuNav(this.menu)
            if (data.code === 200) {
                this.isOpenDialog = false
                this.$message.success('添加成功')
                this.menu = {}
                this.$store.commit('changeNav', !this.$store.state.isChangeNav)
                this.setAllMenu()
            } else this.$message.error(data.message)
        },
        async updateMenu() {
            const data = await updateMenuNav(this.menu.menuId, this.menu)
            if (data.code === 200) {
                this.$message.success('修改成功')
                this.isOpenDialog = false
                this.menu = {}
                this.$store.commit('changeNav', !this.$store.state.isChangeNav)
                this.setAllMenu()
            } else this.$message.error(data.message)
        },
        delTip(index, row) {
            this.$confirm(`此操作将永久删除"${row.name}", 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(() => {
                    this.deleteMenu(row.menuId, index)
                })
                .catch(() => {
                    this.$message.info('已取消删除')
                })
        },
        async deleteMenu(id, index) {
            const data = await deleteMenuNav(id)
            if (data.code === 200) {
                this.$message.success('删除成功!')
                this.$store.commit('changeNav', !this.$store.state.isChangeNav)
                this.setAllMenu()
            } else this.$message.error(res.data.message)
        },
        cancel() {
            this.isOpenDialog = false
            this.menu = {}
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
