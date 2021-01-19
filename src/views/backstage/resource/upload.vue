<template>
<div class="upload">
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="资源上传" name="first" class="upload-content">
                <!--资源上传窗口-->
                <upload-frame @uploadScs="isUploadScs=true" :resourceName.sync="resourceName" :serverType.sync="serverType" :fileType.sync="fileType" ref="frame"></upload-frame>
                <!--保存资源上传信息-->
                <upload-information v-if="isUploadScs&&activeName==='first'" :resName="resourceName" :serverType="serverType" @init="dataInit" :fileType="fileType" ref="information"></upload-information>
            </el-tab-pane>
            <el-tab-pane label="所有资源" name="second">
                <!--所有资源管理-->
                <upload-all-res ref="allRes"></upload-all-res>
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
</template>

<script>
import UploadFrame from './components/UploadFrame'
import UploadInformation from './components/UploadInformation'
import UploadAllRes from './components/UploadAllRes'
export default {
    components: {
        UploadFrame,
        UploadInformation,
        UploadAllRes
    },
    data() {
        return {
            activeName: 'first', //当前选中哪一面
            isUploadScs: false, //是否上传成功，用于是否展示保存信息页
            resourceName: '', //上传时的key，用于默认资源名称 和上传时的fileKey
            serverType: '1', //上传时选择的存储位置
            isMedium: false, //中等页面
            isSmall: false, //小型页面
            fileType: '' //文件类型，用于可选封面
        }
    },
    watch: {
        //监听当前页面
        activeName(newVal) {
            if (newVal === 'second') {
                this.$refs.allRes.setAllRes()
            }
        }
    },
    methods: {
        //数据初始化
        dataInit() {
            Object.assign(this.$data, this.$options.data()) //将data重设为最初值
            this.$refs.frame.dataInit() //重设frame页面中的data
        },
        //设置frame传来的数据
        setResName(val) {
            this.resourceName = val
        },
        setType(val) {
            this.serverType = val
        },
        setFileType(val) {
            this.fileType = val
        }
    }
}
</script>

<style>
.upload {
    text-align: center;
}
</style>
