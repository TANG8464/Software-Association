<template>
<div class="background-image">
    <div class="demo-image__placeholder">
        <div class="upload-background">
            <span style="color: #666666; font-size: 14px">共有{{ total }}张背景图</span>
            <el-button style="float: right; position: relative; top: -15px" size="small" @click="isOpenUpload = true">上传背景</el-button>
        </div>
        <div class="pictures" ref="pictures">
            <picture-list :pictures="allBackground" :pictureUrlArr="pictureUrlArr" :refresh="refresh" :key="update" v-if="allBackground">
                <div slot="actions" slot-scope="scope">
                    <div class="actions">
                        <span style="margin: 5%" v-show="!scope.item.status" @click="updateStatus(scope.item.id, true)">
                            <icon name="disabled" scale="20" width="20"></icon>
                        </span>
                        <span style="margin: 5%" v-show="scope.item.status" @click="updateStatus(scope.item.id, false)">
                            <icon name="confirm" scale="20" width="20"></icon>
                        </span>
                        <span style="margin: 5%" @click="deleteImg(scope.item.name)">
                            <icon name="delete" scale="20" width="20"></icon>
                        </span>
                    </div>
                </div>
            </picture-list>
            <div v-else-if="isNotData">
                <icon name="null" scale="40" width="40"></icon>一张都没有
            </div>
        </div>
        <div class="tip" v-if="loading">加载中...</div>
        <div class="tip" v-if="isAllLoading">已全部加载</div>
    </div>
    <el-dialog title="上传背景" :visible.sync="isOpenUpload" width="30%" center>
        <div style="max-height: 400px; overflow: auto">
            <el-upload ref="upload" class="upload-demo" action="#" :multiple="true" :auto-upload="false" :on-change="submitUpload" :on-remove="removeFile" list-type="picture" accept=".jpg, .jpeg, .png, .JPG, .JPEG">
                <el-button size="small">选取背景</el-button>
            </el-upload>
        </div>
        <el-progress v-if="isUploading" :stroke-width="1" :percentage="percentage" :format="format"></el-progress>
        <div v-if="fileList.length === 0" style="width: 100%; line-height: 300px; text-align: center">
            尚未选取背景
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isOpenUpload = false">取 消</el-button>
            <el-button type="primary" @click="uploadBackground">确认上传</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import {
    getAllBackground,
    uploadBackground,
    deleteBackground,
    updateBackgroundStatus,
} from '@/api/siae'
import imgVerity from '@/utils/verify'
import PictureList from '@/components/PictureList'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
    components: {
        PictureList,
        ElImageViewer,
    },
    data() {
        return {
            //所有背景图
            allBackground: null,
            //是否没有数据
            isNotData: false,
            index: -1,
            //设置每次加载背景图 改变Key
            update: false,
            //每页多少条
            limit: 5,
            //当前页
            currPage: 1,
            //是否全部加载
            isAllLoading: false,
            //用于限制到达底部间隔时间
            time: 0,
            //用于计算是否到达底部
            scrollTop: 0,
            loading: false,
            //所有背景图的urlArr数组
            pictureUrlArr: [],
            //需要上传的文件list
            fileList: [],
            //是否打开上传背景dialog
            isOpenUpload: false,
            //上传进度
            percentage: 0,
            //是否处于上传
            isUploading: false,
            //是否是刷新背景图（一般为修改背景图后）
            refresh: false,
            //背景图总数量
            total: 0,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    created() {
        this.allBackground = []
        this.setAllBackground(1, 10)
        this.currPage++
        this.setPictureUrlArr()
    },
    mounted() {
        //添加到达底部触发事件
        const elM = this.$refs['pictures']
        elM.touchmove = elM.onmousewheel = () => {
            if (this.isAllLoading) {
                return
            }
            const newDateTime = new Date().getTime()
            //解决数据未加载前多次调用
            if (this.scrollTop === elM.scrollTop && newDateTime - this.time > 1500) {
                this.loading = true
                this.currPage++
                this.setAllBackground()
                this.time = newDateTime
            } else this.scrollTop = elM.scrollTop
        }
    },
    methods: {
        //设置大图浏览图片
        async setPictureUrlArr() {
            const data = await getAllBackground(1, 1000)
            if (data.code === 200) {
                data.data.records.forEach((item) => {
                    this.pictureUrlArr.push(item.url)
                })
            } else this.$message.error(data.message)
        },
        //懒加载背景图
        async setAllBackground(currPage, limit, refresh) {
            if (refresh) this.refresh = refresh
            if (!refresh && this.isAllLoading) return
            const res = await getAllBackground(currPage || this.currPage, limit || this.limit)
            if (res.code === 200) {
                const {
                    data
                } = res
                if (!data.records) {
                    this.isNotData = true
                    return
                } else if (this.currPage * this.limit >= data.total) {
                    this.isAllLoading = true
                }
                this.total = data.total
                this.update = !this.update
                if (refresh) this.allBackground = data.records
                //  this.allBackground = this.allBackground.concat(data.records)
                else this.allBackground = this.allBackground.concat(data.records)
                if (this.$refs.upload) this.$refs.upload.clearFiles()
                this.loading = false
            } else this.$message.error(data.message)
        },
        //提交图片
        submitUpload(file, fileList) {
            this.fileList.push(file.raw)
            const verity = imgVerity(file.raw, ['image/jpeg', 'image/png'], 20, [
                '上传的封面图片只能是 JPG/PNG 格式!',
                '上传的封面图片大小不能超过 20MB!',
            ])
            if (!verity.status) {
                this.fileList = []
                this.$message.error(verity.message)
            }
        },
        //删除fileList中的file
        removeFile(file, fileList) {
            this.fileList = fileList.map((item) => {
                return item.raw
            })
        },
        //上传背景图
        async uploadBackground() {
            this.isUploading = true
            const config = {
                onUploadProgress: (progressEvent) => {
                    const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
                    this.percentage = complete
                },
            }
            const data = await uploadBackground(this.fileList, config)
            if (data.code === 200) {
                this.isOpenUpload = false
                if (this.allBackground.length >= this.currPage * this.limit) this.currPage++
                this.isAllLoading = false
                this.setAllBackground(1, this.currPage * this.limit, true)
                this.isUploading = false
                this.percentage = 0
            } else this.$message.error(data.message)
        },
        //格式百分比100为正在缓冲
        format(percentage) {
            return percentage === 100 ? '正在缓冲' : `${percentage}%`
        },
        //修改背景图状态（是否在前台可见）
        async updateStatus(id, status) {
            const data = await updateBackgroundStatus(id, status)
            if (data.code === 200) {
                this.setAllBackground(1, this.currPage * this.limit, true)
                this.$message.success('修改成功')
            } else this.$message.error(data.message)
        },
        //删除背景图
        async deleteImg(name) {
            const data = await deleteBackground(name)
            if (data.code === 200) {
                this.setAllBackground(1, this.currPage * this.limit, true)
                this.$message.success('删除成功')
            } else this.$message.error(data.message)
        },
    },
}
</script>

<style>
.el-image-viewer__wrapper {
    z-index: 2503 !important;
}

.upload-background {
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
}

.background-image .tip {
    font-size: 15px;
    color: #666;
    text-align: center;
}

.el-upload .el-upload--picture {
    overflow: auto;
    height: 500px;
}
</style><style lang="scss" scoped>
.background-image {
    .actions {
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 40px;
        left: 0;
        bottom: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity 0.3s;
    }

    .actions::after {
        display: inline-block;
        content: '';
        height: 100%;
        vertical-align: middle;
        filter: blur(2px);
    }

    .actions:hover {
        opacity: 1;
    }
}
</style>
