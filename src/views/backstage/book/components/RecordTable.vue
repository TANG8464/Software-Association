<template>
<el-table :data="bookData" style="width: 100%" :default-sort="{ prop: 'bdate', order: 'descending' }">
    <el-table-column type="expand">
        <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="书籍名称:">
                    <span>{{ props.row.book.bookName }}</span>
                </el-form-item>
                <el-form-item label="书籍类型:">
                    <span>{{ props.row.book.bookCategory.bookCategoryName }}</span>
                </el-form-item>
                <el-form-item label="书籍条码:">
                    <span>{{ props.row.book.id }}</span>
                </el-form-item>
                <el-form-item label="作者:">
                    <span>{{ props.row.book.author }}</span>
                </el-form-item>
                <el-form-item label="入库日期:">
                    <span>{{ props.row.book.inDate }}</span>
                </el-form-item>
                <el-form-item label="ISBN:">
                    <span>{{ props.row.book.isbn }}</span>
                </el-form-item>
                <el-form-item label="价格:">
                    <span>{{ props.row.book.price }}</span>
                </el-form-item>
                <el-form-item label="剩余册数:">
                    <span>{{ props.row.book.count }}</span>
                </el-form-item>
            </el-form>
        </template>
    </el-table-column>
    <el-table-column v-for="(item,key) of bookHeader" :key="key" :prop="item.prop" :label="item.label" :width="item.width" :sortable="item.sortable" align="center"></el-table-column>
    <el-table-column label="操作" width="80" align="center" fixed="right">
        <template slot-scope="scope">
            <el-button @click.native.prevent="retrunRow(scope.row.id)" type="text" size="small" :disabled="scope.row.rdate == '未归还' ? false : true">还书</el-button>
        </template>
    </el-table-column>
</el-table>
</template>

<script>
import info from '@/utils/info'
export default {
    props: {
        bookData: {
            type: Array,
            require: true
        }
    },
    data() {
        return {
            bookHeader: []
        }
    },
    mounted() {
        this.bookHeader = info.bookHeader()
    },
    methods: {
        retrunRow(id) {
            this.$emit('retrunRow', id)
        }
    }
}
</script>
