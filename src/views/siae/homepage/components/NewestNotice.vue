<template>
<div class="newest-notice">
    <el-row :gutter="24" v-for="(item,index) in notices" :key="item.id">
        <el-col :span="6" :class="{right:index%2===1}">
            <img :src="item.cover" alt style="width:100%" />
        </el-col>
        <el-col :span="18">
            <div>
                <h2 class="news_title">
                    <span>{{item.title}}</span>
                </h2>
                <p class="news_content" v-html="item.text"></p>
                <div>
                    <p style="display:inline-block;width:70%;line-height:30px">
                        <img :src="item.member.avatarUrl" width="30" height="30" style="border-radius:50%" />
                        <span>{{item.member.memberName}}</span>
                    </p>
                    <p style="display:inline-block;text-align:right;width:30%">{{item.deplDate|dataFormatter}} | {{item.count}}</p>
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {
    searchNewestNotice
} from '@/api/notice'
import {
    dataFormatter
} from '@/filters'
export default {
    data() {
        return {
            notices: [],
        }
    },
    created() {
        this.setNotices()
    },
    methods: {
        async setNotices() {
            const data = await searchNewestNotice()

            if (data.code === 200) {
                this.notices = data.data
                console.log(this.notices)
            } else this.$message.error(data.message)
        },
    },
    filters: {
        dataFormatter,
    },
}
</script>

<style lang="scss">
.newest-notice {
    color: #666666;
    padding: 20px;

    .el-row {
        margin: 10px;
        padding: 10px;
        background-color: rgba($color: #ffffff, $alpha: 0.8);

        .news_title:hover span {
            border-bottom: 1px solid #666666;
        }

        .news_content {
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 15px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
    }

    .right {
        float: right;
    }
}
</style>
