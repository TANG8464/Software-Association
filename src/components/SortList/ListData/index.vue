<template>
<div class="sortData remove">
    <!--分类数据-->
    <el-table ref="sortData" :data="allSort" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column v-if="isShowDels" type="selection" width="80"></el-table-column>
        <el-table-column label="ID" prop="id" width="55"></el-table-column>
        <el-table-column prop="categoryName" label="分类" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="!size.isSmallSize" prop="remark" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column width="150">
            <template slot="header">
                <el-button v-if="!isShowDels" type="danger" size="mini" round plain @click="isShowDels=true" class="el-icon-delete">批量删除</el-button>
                <div v-if="isShowDels">
                    <el-button type="danger" size="mini" round plain @click="deleteSort()">确认</el-button>
                    <el-button type size="mini" round plain @click="isShowDels=false">取消</el-button>
                </div>
            </template>
            <template slot-scope="scope">
                <div style="text-align:right;">
                    <span class="update-span" @click="openUpdate(scope.row)" style="color:#909399">
                        <icon name="edit" scale="20" width="20"></icon>
                    </span>
                    <span class="del-span" @click="deleteSort(scope.row.id)" style="color:#909399">
                        <icon name="delete" scale="20" width="20"></icon>
                    </span>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!--修改分类-->
    <update-sort :isOpenUpdate.sync="isOpenUpdate" :updateSort="updateSort" @update="update"></update-sort>
</div>
</template>

<script>
import UpdateSort from './UpdateSort'
export default {
    props: {
        allSort: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        UpdateSort
    },
    data() {
        return {
            dels: [], //删除项
            isOpenUpdate: false, //是否打开修改菜单
            updateSort: {}, //修改分类时上传给服务端的数据
            isShowDels: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    methods: {
        handleSelectionChange(val) {
            this.dels = val
        },
        //删除提示
        deleteSort(id) {
            let ids = []
            if (id) {
                ids.push(id)
            } else {
                this.dels.forEach((item) => {
                    ids.push(item.id)
                })
            }
            if (ids.length > 0) {
                this.$confirm(`此操作将永久删除这${ids.length}条分类, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(() => {
                        this.$emit('delSort', ids)
                    })
                    .catch(() => {})
            } else {
                this.$message({
                    message: '您还没有选择删除项哦',
                    center: true,
                    customClass: 'noChecked',
                    iconClass: 'el-icon-warning',
                })
            }
        },
        //   //打开修改分类菜单框
        openUpdate(item) {
            this.updateSort = item
            this.isOpenUpdate = true
        },
        update(sort) {

            this.$emit('update', sort)
        },
    },
}
</script>
