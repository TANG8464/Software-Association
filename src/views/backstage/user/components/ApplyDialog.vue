<template>
<el-dialog class="apply-dialog" title="入会设置" :visible.sync="centerDialogVisible" width="30%" :fullscreen="size.isSmallSize">
    <div>
        <span>是否开启提交申请书接口：</span>
        <el-switch v-model="isOpenApply" active-color="#409EFF" inactive-color="rgb(218, 218, 218)">
        </el-switch>
        <el-form v-if="isOpenApply" :inline="true">
            <el-form-item label="设置开启时长：">
                <el-select size="mini" style="width:60px" v-model="OpenTime">
                    <el-option v-for="item in 30" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span style="padding-left:5px">天</span>
            </el-form-item>
        </el-form>
        <p class="template-title">当前申请书模板</p>
        <p class="template-content" v-if="templateLink">
            <span class="template-item">申请书模板</span>
            <span class="template-item">
                <el-link type="primary" :href="templateLink">下载</el-link>
                <el-link type="danger" @click="delApplyTemplate()">删除</el-link>
            </span>
        </p>
        <div style="text-align:center;" v-else>
            <p style="color:#999999;min-height:50px">暂无模板</p>
            <el-upload ref="upload" class="upload-demo" :limit="1" action="#" drag :auto-upload="false" :on-change="importApplyTemplate">
                <i class="el-icon-upload"></i>
                <p class="el-upload__text">
                    将申请表模板拖到此处，或
                    <em>点击上传</em>
                </p>
                <p class="el-upload__tip" slot="tip">只能上传Word文件</p>
            </el-upload>
        </div>
        <p class="error-tip">{{error}}</p>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveSettings()">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
import {
    isOpenApply,
    adminOpenApply,
    adminCloseApply,
    downloadApplyTemplate,
    uploadApplyTemplate,
    delApplyTemplate
} from '@/api/join-apply'
import {
    wordVerify
} from '@/utils/verify'

export default {
    props: {
        isOpen: {
            type: Boolean,
            require: true
        }
    },
    data() {
        return {
            centerDialogVisible: false,
            isOpenApply: false,
            OpenTime: 1,
            templateLink: null,
            templateFile: null,
            error: null
        };
    },
    computed: {
        size() {
            return this.$store.state.resize
        }
    },
    watch: {
        isOpen(newVal) {
            this.centerDialogVisible = newVal
        },
        centerDialogVisible(newVal) {
            this.$emit('update:isOpen', newVal)
        }
    },
    mounted() {
        this.centerDialogVisible = this.isOpen
        this.init()
    },
    methods: {
        //初始化
        async init() {
            const isOpenData = await isOpenApply()
            if (isOpenData.code === 200) {
                this.isOpenApply = isOpenData.data
            }
            //设置下载申请书模板链接
            const downloadLink = await downloadApplyTemplate()
            if (downloadLink.code === 200) {
                this.templateLink = downloadLink.data
            } else this.templateLink = null
        },
        //保存选择的文件
        async importApplyTemplate(file) {
            const isWord = wordVerify(file.raw)
            const sizeM = 1024 * 1024 * 10
            if (!isWord) this.$message.error('请上传Word文件')
            else if (file.size > sizeM) {
                this.$message.error('文件最大不能超过10MB')
            } else this.templateFile = file.raw
        },
        //提交所有设置
        async SaveSettings() {
            if (this.templateFile) await this.uploadApplyTemplate()
            if (this.isOpenApply) await this.openApply()
            else await this.closeApply()
            await this.init()
            this.centerDialogVisible = false
        },
        //上传申请书模板
        async uploadApplyTemplate() {
            const data = await uploadApplyTemplate(this.templateFile)
            if (data.code !== 200) this.$message.error(data.message)
        },
        //删除申请书模板
        async delApplyTemplate() {
            const data = await delApplyTemplate()
            if (data.code === 200) {
                this.$message.success('删除成功')
                this.init()
            } else this.$message.error(data.message)
        },
        //开启提交申请书接口
        async openApply() {
            const data = await adminOpenApply(this.OpenTime)
            if (data.code !== 200) this.$message.error(data.message)
        },
        //关闭提交申请书接口
        async closeApply() {
            const data = await adminCloseApply()
            if (data.code !== 200) this.$message.error(data.message)
        },

    }
};
</script>

<style lang="scss">
.apply-dialog {
    .template-title {
        padding: 5px 0;
        border-bottom: 1px solid #e0e0e0;
        text-align: center;
        color: #999999;
    }

    .template-item {
        width: 50%;
        display: inline-block;
    }

    .template-item:last-child {
        text-align: right;

        .el-link {
            margin: 0 3px;
        }
    }

    .upload-demo {
        padding: 20px 0;
    }

    .el-upload {
        width: 100%;
        color: rgb(181, 181, 181);

        .el-upload-dragger {
            width: 100%;
            background: none;
            height: 130px;

            .el-icon-upload {
                margin: 10px 0;
            }
        }

        .el-upload__tip {
            margin: 0;
            color: #b5b5b5;
        }

        .el-upload__text {
            color: #b5b5b5;
        }
    }
}
</style>
