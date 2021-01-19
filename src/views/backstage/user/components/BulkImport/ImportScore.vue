<template>
<div class="bulk-import-score">
    <p>
        <el-link type="primary" :href="uploadLink" download="考核信息导入模板">下载模板</el-link>
    </p>
    <el-upload ref="upload" class="upload-demo" action="#" drag :headers="token" :before-upload="beforeUpload" :auto-upload="false" :on-change="uploadScore">
        <i class="el-icon-upload"></i>
        <p class="el-upload__text">
            将考核信息表拖到此处，或
            <em>点击上传</em>
        </p>
        <p class="el-upload__tip" slot="tip">只能上传Excel文件</p>
    </el-upload>
</div>
</template>

<script>
import token from '@/utils/token'
import {
    excelVerify
} from '@/utils/verify'
import {
    setUploadLink,
    uploadScore
} from '@/api/member/score'
export default {
    data() {
        return {
            token: {
                'HEADER-TOKEN': token.getHeaderToken()
            },
            uploadLink: '',
        }
    },
    created() {
        this.setUploadLink()
    },
    methods: {
        async setUploadLink() {
            const data = await setUploadLink()
            this.uploadLink = window.URL.createObjectURL(data)
        },
        beforeUpload(file) {
            const isExcel = excelVerify()
            if (!isExcel) this.$message.error('请上传Excel文件')
            return isExcel
        },
        async uploadScore(file) {
            const data = await uploadScore(file.raw)
            if (data.code === 200) {
                this.$emit('uploadSuccess')
                this.$message.success('导入成功')
            } else this.$message.error(data.message)
        },
    },
}
</script>

<style>
.bulk-import-score .upload-demo {
    text-align: center;
    margin: auto;
}
</style>
