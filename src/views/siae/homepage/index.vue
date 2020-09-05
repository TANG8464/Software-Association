<template>
<div class="siae-homepage">
    <div class="content" :style="{'height':size.maxH-70+'px'}">
        <imgCar :imgCars="imgCars" :height="size.isSmallSize&&!size.isLandscape?size.maxW*9/16+'px':size.maxH-60+'px'"></imgCar>
        <div :style="{width}" style="margin: auto;overflow: auto;">
            <p class="title" :style="{'font-size':+10+size.maxW*0.01+'px'}">
                <icon name="notice" scale="40" :width="25+size.maxW*0.01"></icon>
                <span>最新公告</span>
            </p>
            <div class="new-notice">
                <newest-notice></newest-notice>
            </div>
            <p class="title" :style="{'font-size':+10+size.maxW*0.01+'px'}">
                <icon name="notice" scale="40" :width="25+size.maxW*0.01"></icon>
                <span>教学方式</span>
            </p>

            <div class="new-notice"></div>
            <p class="title" :style="{'font-size':+10+size.maxW*0.01+'px'}">
                <icon name="notice" scale="40" :width="25+size.maxW*0.01"></icon>
                <span>优秀成员</span>
            </p>
            <div class="new-notice"></div>
            <p class="title" :style="{'font-size':+10+size.maxW*0.01+'px'}">
                <icon name="notice" scale="40" :width="25+size.maxW*0.01"></icon>
                <span>主要成就</span>
            </p>
            <div class="new-notice"></div>
            <el-row class="footer" :gutter="24" style="margin: 0;">
                <el-col class="left" :class="{lg:!size.isSmallSize,sm:size.isSmallSize}" :lg="8" :xs="24" :sm="24">
                    <span>协会简介</span>
                    <span>成员介绍</span>
                    <span>联系我们</span>
                    <span>常见问题</span>
                </el-col>
                <el-col class="right" :lg="16" :xs="24" :sm="24">
                    <h3>友情链接</h3>
                    <p class="link">
                        <a href="https://gitee.com/">码云</a>
                        <a href="https://github.com/">Github</a>
                        <a href="https://www.iconfont.cn/">阿里巴巴矢量图标库</a>
                        <a href="https://www.qiniu.com/">七牛云</a>
                        <a href="https://element.eleme.cn/">elementUI</a>
                        <a href="https://cn.vuejs.org/">VUE</a>
                        <a href="https://www.canva.cn/">Canva</a>
                    </p>
                    <p class="link">
                        <icon name="public" scale="20" width="20"></icon>
                        <span>
                            <a href="https://beian.miit.gov.cn/#/Integrated/recordQuery" target="_blank">湘ICP备20007056号</a>
                            <span>&copy; 2019-2020</span>
                        </span>
                    </p>
                </el-col>
            </el-row>
        </div>
    </div>
</div>
</template>

<script>
import imgCar from '@/components/SIAEImageCarousel'
import NewestNotice from './components/NewestNotice'
export default {
    name: 'HomePage',
    components: {
        imgCar,
        NewestNotice,
    },
    data() {
        return {
            imgCars: [
                'https://siaestudio.cn-bj.ufileos.com/4bcba289-93f3-4d47-b835-fcc9bb079ce5.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=TetyZ8Ky8Zc600kJ57Oiqej0OaY%3D&Expires=2859073756',
                'https://siaestudio.cn-bj.ufileos.com/855b77ef-55a2-46e6-99fb-ebe1e82ce5cf.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=4livvZdqrjQ%2Fj7MFSm9a5Eicmpo%3D&Expires=2859073876',
                'https://siaestudio.cn-bj.ufileos.com/91f0f9cc-59c1-4a6e-84f5-8735ee35e2bd.png?UCloudPublicKey=TOKEN_58848898-b11e-4125-946f-2167992f8714&Signature=O%2BEK2jtIEYaP4D88yJ8N5oDi1zk%3D&Expires=2859073938',
            ],
            // isClose: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '97%' : '80%'
        },
    },
}
</script>

<style>
</style><style lang="scss">
.siae-homepage {
    position: fixed;
    width: 100%;
    color: white;

    .content {
        overflow: auto;

        .icon-notice {
            animation: waggle 2s infinite;
        }

        @keyframes waggle {
            0% {
                transform: rotate(10deg);
            }

            50% {
                transform: rotate(-10deg);
            }

            100% {
                transform: rotate(10deg);
            }
        }

        .title {
            border-bottom: 1px solid #fff;
        }

        .new-notice {}

        .footer {
            height: 200px;
            color: #b5b5b5;
            padding: 20px 0;

            .lg {
                border-right: 0.5px solid #b5b5b5;

                span {
                    text-align: center;
                    width: 100%;
                    display: block;
                    padding: 5px 0;
                }
            }

            .sm {
                span {
                    margin: 0 5px;
                    display: inline;
                }
            }

            .link {
                font-size: 14px;

                a {
                    color: #b5b5b5;
                    text-decoration: none;
                    margin: 0 5px;
                }

                a:hover {
                    border-bottom: 1px solid #b5b5b5;
                }
            }
        }
    }
}
</style>
