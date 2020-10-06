<template>
<div class="my-apply" :style="{height}">
    <h3 class="title">已提交的申请表</h3>
    <p class="apply" v-if="uploadLink">
        <span class="apply-item">
            <icon name='word' scale='30' width='30'></icon>{{myUserName}}的申请表
        </span>
        <span class="actions apply-item">
            <el-link type="primary" :href="uploadLink">下载</el-link>
            <el-link type="danger" @click="deleteMyApply">删除</el-link>
        </span>
    </p>
    <p class="tip" style="color:#999999" v-else>暂无已提交的申请表</p>
</div>
</template>

<script>
import {
    searchMyApply,
    deleteMyApply
} from '@/api/join'
import {
    getActiveUserInfo
} from '@/api/active-user'
export default {
    data() {
        return {
            myApply: null,
            myUserName: null,
            uploadLink: null,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        height() {
            return this.size.maxH - 210 + 'px'
        }
    },
    created() {
        this.myInfo()
        this.searchMyApply()
    },
    methods: {
        async myInfo() {
            const {
                data
            } = await getActiveUserInfo()

            if (data.code === 200) {
                this.myUserName = data.data.memberName
            }
        },
        async searchMyApply() {
            const data = await searchMyApply()
            if (data.code === 200) {
                this.uploadLink = data.data
            } else this.uploadLink = null
        },
        async deleteMyApply() {
            const data = await deleteMyApply()
            if (data.code === 200) {
                this.searchMyApply()
                this.$message.success("删除成功")
            } else this.$message.error(data.message)
        }
    },
}
</script>

<style lang="scss">
.my-apply {
    position: relative;

    .title {
        border-bottom: 0.5px solid rgb(229, 229, 229);
        padding: 10px 0;
        color: #595959;
    }

    .apply {
        border-radius: 5px;
        padding: 15px 10px;
        color: #464646;
        border-bottom: 0.5px solid rgb(229, 229, 229);
        max-width: 1000px;
        width: 100%;
        margin: auto;

        .apply-item:first-child {
            width: 50%;
            text-align: left;
            display: inline-block;
        }

        .apply-item:last-child {
            width: 50%;
            text-align: right;
            display: inline-block;
        }

        .el-link {
            display: inline;
            margin: 0 5px;
        }

    }

    .link {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .link:hover {
        border-bottom: 1px solid white;
    }

    .link-box {
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        width: 80px;
    }
}
</style>
