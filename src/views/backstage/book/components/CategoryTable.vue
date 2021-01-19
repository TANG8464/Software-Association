<template>
<el-table :data="categoryData" style="width: 100%" row-key="id" lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column prop="id" label="id" width="180" header-align="center"></el-table-column>
    <el-table-column prop="bookCategoryName" label="类型名称" align="center"></el-table-column>
    <el-table-column width="180" label="操作" align="center">
        <template slot="header">
            <div style="text-align:center;display: flex;align-items: center;width:150px" @click="addTopNode()">
                <icon name='insert' scale='18' width='18'></icon>
                <span style="color:#008df0;padding:0 8px;">添加顶级类型</span>
            </div>
        </template>
        <template slot-scope="scope">
            <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import {
    getAllCategory
} from '@/api/book/category'
export default {
    props: {
        categoryData: {
            type: Array,
            require: true
        }
    },
    methods: {
        load(tree, treeNode, resolve) {
            setTimeout(async () => {
                const res = await getAllCategory(tree.id)
                if (res.code !== 200) return
                for (let i in res.data) res.data[i].hasChildren = "true";
                resolve(res.data);
            }, 500);
        },
        addTopNode() {
            this.$emit('addTopNode')
        },
        handleAdd(index, row) {
            this.$emit('handleAdd', index, row)
        },
        handleDelete(index, row) {
            this.$emit('handleDelete', index, row)
        }
    }
}
</script>
