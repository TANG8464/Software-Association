<template>
<div class="sort-list">
    <div>
        <list-data ref="sortData" @setAllSort="setAllSort" :allSort="allSort.records?allSort.records:sortList" @update="update" @delSort="delSort"></list-data>
        <div style="text-align:right;padding:0 15px;">
            <span v-if="allSort.records">
                <el-pagination :hide-on-single-page="true" @current-change="setAllSort" :current-page.sync="allSort.current" :page-size="allSort.size" :total="allSort.total" layout="total, prev, pager, next"></el-pagination>
            </span>
            <add-sort @addSort="addSort"></add-sort>
        </div>
    </div>
</div>
</template>

<script>
import ListData from './ListData'
import AddSort from './AddSort'
export default {
    name: 'sortList',
    components: {
        ListData,
        AddSort
    },
    props: {
        allSort: { //适应后端写的分页，后端接口无分页是传入{}
            type: Object,
            required: true
        },
        sortList: { //适应后端写的无分页
            type: Array,
            default: () => {
                return []
            }
        }
    },
    methods: {
        setAllSort(pageNo) { //查
            this.$emit('setAllSort', pageNo)
        },
        addSort(sort) { //增
            this.$emit('addSort', sort)
        },
        update(sort) { //改
            this.$emit('updateSort', sort)
        },
        delSort(ids) { //删
            this.$emit('delSort', ids)
        }
    }
}
</script>

<style>
.update-span,
.del-span {
    padding: 0 5px;
}

.update {
    fill: #8a8a8a;
}

.update-span:hover .update {
    fill: rgb(63, 171, 235);
}

.del {
    fill: #8a8a8a;
}

.del-span:hover .del {
    fill: #f56c6c;
}
</style>
