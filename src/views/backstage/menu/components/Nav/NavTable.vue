<template>
<el-table :key="tableKey" :data="allMenu" style="width: 100%" ref="menuTable" row-key="menuId" lazy :load="load" :tree-props="{children: 'menuNodeList', hasChildren: 'hasChildren'}">
    <el-table-column width="80"></el-table-column>
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
    <el-table-column v-if="!isSmallSreen" prop="menuId" label="ID" width="60"></el-table-column>
    <el-table-column v-if="!isSmallSreen" prop="url" label="路由"></el-table-column>
    <el-table-column v-if="!isSmallSreen" prop="perms" label="可访问接口"></el-table-column>
    <el-table-column v-if="!isSmallSreen" label="图标" width="60">
        <template slot-scope="scope">
            <p v-html="scope.row.icon"></p>
        </template>
    </el-table-column>
    <el-table-column v-if="!isSmallSreen" label="是否可用" width="80">
        <template slot-scope="scope">
            <el-switch v-model="scope.row.status" disabled></el-switch>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="100" align="right">
        <template slot="header">
            <div style="text-align:left;margin:20px 0;display: flex;align-items: center;width:150px" @click="openDialog(0,0)">
                <icon name="insert" scale="18" width="18"></icon>
                <span style="color:#008df0;padding:0 8px;">添加菜单</span>
            </div>
        </template>
        <template slot-scope="scope">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link el-icon-more"></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openDialog(3,scope.row.type,scope.row)">修改</el-dropdown-item>
                    <el-dropdown-item @click.native="openDialog(1,1,scope.row)" v-if="scope.row.type===0">添加子菜单</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.type==1" @click.native="openDialog(2,2,scope.row)">添加可访问接口</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
export default {
    props: {
        //所有导航栏菜单数据
        allMenu: {
            type: Array,
            require: true
        },
        //是否小屏幕（用于判断是否需要隐藏某些内容）
        isSmallSreen: {
            type: Boolean,
            require: true
        },
        //强制渲染
        tableKey: {
            type: Number,
            defaults: -1
        }

    },
    methods: {
        //载入子菜单数据
        load(tree, treeNode, resolve) {
            setTimeout(() => {
                resolve(tree.menuNodeList)
            }, 500)
        },
        //打开菜单
        openDialog(menu, type, row) {
            this.$emit('openDialog', menu, type, row)
        },
        //删除
        delTip(index, row) {
            this.$emit('delTip', index, row)
        }
    }
}
</script>
