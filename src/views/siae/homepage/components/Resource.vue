<template>
<div class="homepage-resource">
    <el-row :gutter="24">
        <el-col :span="10">
            <div class="title" style="margin:40px 0">
                <p :style="{'font-size':18+fontSize+'px',margin:0}">协会资源</p>
                <span class="content">Association of resources</span>
            </div>
            <div class="item" :class="{'text-active':active===0}" @mouseover="active=0">
                <p :style="{'font-size':8+fontSize+'px',margin:0}">硬件资源</p>
                <p class="content">空调|WiFi|饮水机|舒适的自习室|上千本专业书籍</p>
            </div>
            <div class="item" :class="{'text-active':active===1}" @mouseover="active=1">
                <p :style="{'font-size':8+fontSize+'px',margin:0}">人力资源</p>
                <p class="content">正在攻读博士的李俊成老师|18、19级优秀的学长学姐</p>
            </div>
            <div class="item" :class="{'text-active':active===2}" @mouseover="active=2">
                <p :style="{'font-size':8+fontSize+'px',margin:0}">网络资源</p>
                <p class="content">学习视频|学习软件|各大学习的网站|千兆光纤</p>
            </div>
        </el-col>
        <el-col :span="14">
            <div class="show">
                <div class="show-item" :class="{'show-active':active===0}">
                    <img src="@/assets/img/resource/自习室.jpg" :width="size.isSmallSize?'100%':'50%'" />
                    <img src="@/assets/img/resource/专业书籍.jpg" :width="size.isSmallSize?'100%':'50%'" />
                </div>
                <div class="show-item" :class="{'show-active':active===1}">
                    <el-row :gutter="24">
                        <el-col :lg="12" :sm="24" :xs="24">
                            <img src="@/assets/img/resource/李老师.png" width="95%" />
                        </el-col>
                        <el-col :lg="12" :sm="24" :xs="24" style="text-align:center;">
                            <div>
                                <h2 :style="{'font-size':12+fontSize+'px',margin:0}">李俊成</h2>
                                <div :style="{'font-size':8+fontSize+'px',margin:0}">
                                    <p>协会创始人</p>
                                    <p>硕士|毕业于中南大学攻读博士</p>
                                    <p>独特的教学风格</p>
                                    <p>英语八级|爱钻研算法|喜爱研究时代新技术</p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="show-item" :class="{'show-active':active===2}">
                    <img src="@/assets/img/resource/网络.jpg" width="100%" />
                </div>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    data() {
        return {
            active: 0,
            src: '@/assets/img/resource/'
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        fontSize() {
            return this.size.maxW * 0.01
        },
    },
}
</script>

<style lang="scss">
.homepage-resource {
    .item {
        padding: 30px 10px;
        transition: all 0.2s;
    }

    .text-active {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }

    .content {
        color: #dbdbdb;
        margin: 0;
    }

    .show {
        position: relative;
        padding: 15px;

        .show-item {
            position: absolute;
            top: 0;
            opacity: 0;
            transition: all 0.3s;
            // padding: 30px 0;
            // margin: 30px 0;

            img {
                margin: 5px;
            }
        }

        .show-active {
            opacity: 1;
        }
    }
}
</style>
