<template>
<div class="bulk-import">
    <p class="intro">
        注意:上传时的数据条数最好不要超过3000条哦!因为不超过3000行上传的数据如果出现错数据也会回滚，修改数据重新上传即可,反之不会。
        <br />flag: 0协会内，1协会外，2永不录入
    </p>
    <el-link type="primary" :href="uploadLink" download="成员表导入模板">下载导入模板</el-link>
    <el-upload ref="upload" :class="{'upload-demo':!isSuccess,'upload-btn':isSuccess}" :style="{'width': isSuccess?'':'100%','max-width': isSuccess?'':'500px',}" :drag="!isSuccess" action="http://120.26.177.203/member/uploadMemberExcel" :headers="token" :on-success="handldeSuccess" :on-error="handldeError" :before-upload="beforeUpload">
        <el-button v-if="isSuccess" size="small" type="primary">继续上传</el-button>
        <div v-else>
            <i class="el-icon-upload"></i>
            <p class="el-upload__text">
                将成员表拖到此处，或
                <em>点击上传</em>
            </p>
            <p class="el-upload__tip" slot="tip">只能上传Excel文件</p>
        </div>
    </el-upload>
    <upload-table v-if="isSuccess" :header="header" :data="data"></upload-table>
</div>
</template>

<script>
import token from '@/utils/token'
import UploadTable from '@/components/PublicTable'
import {
    excelVerify
} from '@/utils/verify'
export default {
    components: {
        UploadTable,
    },
    data() {
        return {
            uploadLink: '#',
            token: {},
            isSuccess: false,
            header: [],
            data: [],
        }
    },
    mounted() {
        this.setUploadLink()
        this.token = {
            'HEADER-TOKEN': token.getHeaderToken(),
        }
    },
    methods: {
        async setUploadLink() {
            const {
                data
            } = await this.$axios.get('member/downloadMemExportTemplates', {
                responseType: 'blob',
            })
            let url = window.URL.createObjectURL(data)
            this.uploadLink = url
        },
        beforeUpload(file) {

            const isExcel = excelVerify(file)
            if (!isExcel) this.$message.error('请上传Excel文件')
            return isExcel
        },
        handldeSuccess(res, file) {
            console.log(res)
            if (res.code === 200) {
                this.$message.success('导入成功')
                this.isSuccess = true
                if (res.data) {
                    this.data = res.data
                    Object.keys(res.data[0]).forEach((key) => {
                        this.header.push(key)
                    })
                    console.log(this.header)
                }
            } else if (res.code === 500) {
                this.$message.error('糟糕！数据库错误')
            } else {
                this.data = []
                this.$message.error(res.message)
            }
            this.$refs.upload.clearFiles()
        },
        handldeError(err, file) {
            this.$message.error(err.message)
            this.$refs.upload.clearFiles()
        },
    },
}
</script>

<style>
.bulk-import .intro {
    color: #666f80;
    width: 70%;
    text-align: left;
    font-size: 14px;
    margin: 50px 0;
}

.bulk-import .upload-demo {
    text-align: center;
    margin: auto;
}

.bulk-import .upload-btn {
    float: right;
}

.bulk-import .el-upload {
    width: inherit;
    max-width: inherit;
}

.bulk-import .el-upload-dragger {
    width: 100%;
    height: 260px;
    padding-top: 30px;
}
</style>
