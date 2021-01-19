<template>
<el-table :data="bookData" style="width: 100%" :default-sort="{prop: 'bdate', order: 'descending'}" max-height="300" min-height="300">
    <el-table-column v-for="(item,key) of bookHeader" :key="key" :prop="item.prop" :label="item.label" :width="item.width" :sortable="item.sortable" align="center"></el-table-column>
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
    }
}
</script>
