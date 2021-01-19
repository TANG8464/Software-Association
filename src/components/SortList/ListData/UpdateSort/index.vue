<template>
<el-dialog v-dialogDrag title="修改分类" v-if="isOpen" :visible.sync="isOpen" width="25%" style="text-align:left;" :close-on-click-modal="false" :destroy-on-close="true">
    <el-form v-model="sort">
        <el-form-item label="分类ID">
            <el-input v-model="sort.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
            <el-input v-model="sort.categoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
            <el-input type="textarea" v-model="sort.remark" autocomplete="off"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'updateSort',
    props: {
        isOpenUpdate: {
            type: Boolean,
            required: true
        },
        updateSort: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            sort: {},
            isOpen: false
        }
    },
    watch: {
        isOpenUpdate(newVal) {
            this.isOpen = newVal
        },
        isOpen(newVal) {
            this.$emit('update:isOpenUpdate', newVal)
        },
        updateSort(newVal) {
            let sort = {
                id: this.updateSort.id,
                categoryName: this.updateSort.categoryName,
                remark: this.updateSort.remark
            }
            this.sort = sort
        }
    },
    methods: {
        update() {
            this.$emit('update', this.sort)
            this.isOpen = false
        }
    }
}
</script>
