<template>
<el-table :data="tableData" style="width: 100%" :row-style="{ height: '10px' }" @selection-change="handleSelectionChange">
    <el-table-column align="center" type="selection" width="55"></el-table-column>
    <el-table-column align="center" label="删除" width="50">
        <template slot-scope="scope">
            <p @click="deleteRow(scope.row.id, scope.$index, tableData)">
                <icon name="remove" scale="20" width="18"></icon>
            </p>
        </template>
    </el-table-column>
    <el-table-column align="center" label="书籍封面">
        <template slot-scope="scope">
            <img :src="scope.row.imageUrl" width="55" height="70" />
        </template>
    </el-table-column>
    <el-table-column align="center" v-for="item in headers" :key="item.label" :label="item.label" :prop="item.prop" :width="item.width" sortable></el-table-column>
    <el-table-column align="center" label="操作" width="80" fixed="right">
        <template slot-scope="scope">
            <el-button @click.native.prevent="borrowRow(scope.row.id)" type="text" size="small" :disabled="scope.row.count > 0 ? false : true">借书</el-button>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
export default {
    props: {
        tableData: {
            type: Array,
            require: true
        }
    },
    data() {
        return {
            headers: [{
                    prop: 'isbn',
                    label: 'ISBN',
                    width: '180',
                },
                {
                    prop: 'id',
                    label: '书刊条码',
                    width: '120',
                },
                {
                    prop: 'bookName',
                    label: '书刊名称',
                    width: '180',
                },
                {
                    prop: 'author',
                    label: '作者',
                    width: '150',
                },
                {
                    prop: 'bookCategory.id',
                    label: '分类号',
                    width: '100',
                },
                {
                    prop: 'bookCategory.bookCategoryName',
                    label: '分类名称',
                    width: '150',
                },
                {
                    prop: 'price',
                    label: '价格',
                    width: '100',
                },
                {
                    prop: 'count',
                    label: '剩余册数',
                    width: '120',
                },
                {
                    prop: 'inDate',
                    label: '入库日期',
                    width: '180',
                },
            ],
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val)
        },
        deleteRow(id, index, tableData) {
            this.$emit('deleteRow', id, index, tableData)
        },
        borrowRow(id) {
            this.$emit('borrowRow', id)
        }
    }
}
</script>
