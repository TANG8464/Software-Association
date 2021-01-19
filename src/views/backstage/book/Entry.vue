<template>
<div class>
    <div class="form">
        <el-form ref="form" label-position="top" :model="form" :rules="rules">
            <el-row :gutter="24" class="form1" style="width:100%">
                <el-col :xs="24" :sm="24" :lg="9">
                    <el-form-item label="书名" prop="bookName">
                        <el-input v-model="form.bookName"></el-input>
                    </el-form-item>
                    <el-form-item label="作者" prop="author">
                        <el-input v-model="form.author"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" prop="count">
                        <el-input v-model.number="form.count" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" prop="price">
                        <el-input v-model="form.price" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="9">
                    <el-form-item label="分类号" prop="bookCategoryID">
                        <el-cascader :props="props" :show-all-levels="false" v-model="form.bookCategoryID"></el-cascader>
                    </el-form-item>
                    <el-form-item label="ISBN" prop="isbn">
                        <el-input v-model="form.isbn"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" autocomplete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="6">
                    <el-form :model="form" :label-width="formLabelWidth" label-position="top" :rules="rules">
                        <el-form-item label="书籍封面" ref="uploadElement" prop="img">
                            <el-upload ref="upload" :action="uploadUrl+'news/picturesUpload'" accept="image/png, image/gif, image/jpg, image/jpeg" list-type="picture-card" :limit="limitNum" :auto-upload="true" :on-exceed="handleExceed" :before-upload="handleBeforeUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="imgChange" :class="{hide:hideUpload}" :headers="token" :on-success="handleAvatarSuccess">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt />
                            </el-dialog>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <p style="text-align:right;">
                <el-button type="primary" size="medium" @click=" onSubmit('form')">提交</el-button>
                <el-button size="medium" @click="resetForm('form')">重置</el-button>
            </p>
        </el-form>
    </div>
</div>
</template>

<script>
import token from '@/utils/token'
import imgVerity from '@/utils/verify'
import entryRules from '@/utils/rules'
import {
    getBaseURL
} from '@/utils/url'
import {

    addBook
} from '@/api/book'
import {
    getAllCategory
} from '@/api/book/category'
export default {
    data() {
        return {
            uploadUrl: '',
            token: {},
            isImg: false,
            isSuccess: false,
            form: {
                bookName: '',
                author: '',
                isbn: '',
                price: 0,
                count: 0,
                bookCategoryID: '',
                remark: '',
                imageUrl: '',
            },
            props: {
                lazy: true,
                async lazyLoad(node, resolve) {
                    const id = node.root ? null : node.value
                    const data = await getAllCategory(id)
                    if (data.data.length === 0) {
                        node.data = {}
                        node.data.leaf = true
                    }
                    const nodes = Array.from(data.data).map((item) => ({
                        value: item.id,
                        label: item.bookCategoryName,
                        leaf: false,
                    }))
                    resolve(nodes)
                },
            },
            rules: entryRules,
            hideUpload: false,
            dialogImageUrl: '',
            dialogVisible: false, //图片预览弹窗
            formLabelWidth: '80px',
            limitNum: 1,
        }
    },
    created() {
        this.getToken()
        this.uploadUrl = getBaseURL()
    },
    methods: {
        getToken: function () {
            //获取登录时存储在localStorage中的header-Token，作为上传凭证
            this.token['HEADER-TOKEN'] = token.getHeaderToken()
        },
        // 上传文件之前的钩子
        handleBeforeUpload(file) {
            const verity = imgVerity(file, ['image/jpeg', 'image/png'], 6, [
                '上传的封面图片只能是 JPG/PNG 格式!',
                '上传的封面图片大小不能超过 6MB!',
            ])
            if (!verity.status) {
                this.$message.error(verity.message)
            }
            return verity.status
        },
        // 文件超出个数限制时的钩子
        handleExceed(files, fileList) {},
        // 文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            this.hideUpload = fileList.length >= this.limitNum
        },
        // 点击文件列表中已上传的文件时的钩子
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        handleAvatarSuccess(res, file) {
            this.form.imageUrl = res.link
            this.isSuccess = true
        },
        imgChange(files, fileList) {
            this.hideUpload = fileList.length >= this.limitNum
            if (fileList) {
                this.$refs.uploadElement.clearValidate()
            }
        },
        onSubmit(formName) {
            this.form.bookCategoryID = this.form.bookCategoryID[this.form.bookCategoryID.length - 1]
            if (!this.isSuccess) {
                this.$message.error('请选择书籍封面')
                return
            }
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (this.form.remark === '') {
                        this.form.remark = null
                    }
                    const data = await addBook(this.form)
                    if (data.code !== 200) this.$message.error('提交失败')
                    this.$message.success('提交成功')
                    this.resetForm(formName)
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.dialogVisible = false
            this.hideUpload = false
            this.$refs.upload.clearFiles()
        },
    },
}
</script>

<style>
.form .el-input {
    width: 350px;
}

.hide .el-upload--picture-card {
    display: none;
}
</style>
