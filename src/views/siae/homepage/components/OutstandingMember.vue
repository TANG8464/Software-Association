<template>
<div class="outstanding-member">
    <div class="title">
        <p :style="{'font-size':18+fontSize+'px',margin:0}">优秀成员</p>
        <span>Outstanding Member</span>
    </div>
    <div class="content">
        <div v-if="!size.isSmallSize" class="direction-icon" @click="tx<0?tx+=Math.ceil(width):tx">&lt;</div>
        <div class="carousel-box">
            <div class="carousel" ref="carousel" :style="{transform: `translate3d(${tx}%, 0px, 0px)`}">
                <div class="carousel-item" v-for="item in memberData" :key="item.id" :style="{height:height+'px',width:width+'%'}">
                    <div class="avatar">
                        <img :src="item.avatarUrl" />
                    </div>
                    <div class="carousel-content">
                        <p :style="{'font-size':12+fontSize+'px',margin:0}">
                            {{item.name}}
                            <span :style="{'font-size':fontSize+'px',margin:0}"> {{item.spellName}}</span>
                        </p>
                        <p :style="{'font-size':fontSize+'px',margin:0}">{{item.major}}|{{item.GraduationYear}}年毕业</p>
                        <p :style="{'font-size':fontSize+'px',margin:0}">{{item.position}}</p>
                        <p :style="{'font-size':3+fontSize+'px',margin:0}">{{item.annualSalary}}</p>
                        <p :style="{'font-size':fontSize+'px','margin-top':40+'px'}">{{item.company}}</p>
                        <p class="tip" :style="{'font-size':fontSize-3+'px'}">数据更新于{{item.updateYear}}年</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!size.isSmallSize" class="direction-icon" @click="tx>min?tx-=Math.ceil(width):tx">&gt;</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            memberData: [{
                    id: 1,
                    name: '陈资',
                    spellName: 'Chen Zi',
                    major: '10级计软',
                    GraduationYear: 2013,
                    position: '项目总监',
                    annualSalary: '30w',
                    company: '长沙三岩信息技术有限公司',
                    updateYear: 2019,
                    avatarUrl: require('@/assets/img/outstandingMember/陈资.jpg'),
                },
                {
                    id: 2,
                    name: '蔡典',
                    spellName: 'Cai Dian',
                    major: '10级计软',
                    GraduationYear: 2013,
                    position: '研发工程师',
                    annualSalary: '15w',
                    company: '深圳市壹米互娱有限公司',
                    updateYear: 2018,
                    avatarUrl: require('@/assets/img/outstandingMember/蔡典.png'),
                },
                {
                    id: 3,
                    name: '雷超',
                    spellName: 'Lei Chao',
                    major: '13级计软',
                    GraduationYear: 2016,
                    position: 'Java开发工程师',
                    annualSalary: '14w',
                    company: '深圳市亚声威格科技有限公司',
                    updateYear: 2018,
                    avatarUrl: require('@/assets/img/outstandingMember/雷超.jpg'),
                },
                {
                    id: 4,
                    name: '唐志峰',
                    spellName: 'Tang Zhi Feng',
                    major: '13级移软',
                    GraduationYear: 2018,
                    position: '算法工程师',
                    annualSalary: '12w',
                    company: '长沙数定',
                    updateYear: 2018,
                    avatarUrl: require('@/assets/img/outstandingMember/唐志峰.jpg'),
                },
                {
                    id: 5,
                    name: '李明',
                    spellName: 'Li Ming',
                    major: '13级计软',
                    GraduationYear: 2016,
                    position: 'Java开发工程师',
                    annualSalary: '14w',
                    company: '广州南方数码科技股份有限公司',
                    updateYear: 2019,
                    avatarUrl: require('@/assets/img/outstandingMember/李明.jpg'),
                },
            ],
            tx: 0, //translate3d的x偏移量
            min: 0, //translate3d的x偏移量最小值
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        fontSize() {
            return this.size.maxW * 0.01
        },
        height() {
            return this.size.isSmallSize ? null : 300 + this.size.maxH * 0.15
        },
        width() {
            return this.size.isSmallSize ? 48 : 24.2
        }
    },
    mounted() {
        //设置translate3d的x偏移量最小值
        this.min =
            (this.$refs.carousel.children.length - 100 / Math.ceil(this.width)) *
            -1 *
            Math.ceil(this.width)
        const elM = this.$refs.carousel
        let startX, startY
        elM.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX
            startY = e.touches[0].pageY
        })
        elM.addEventListener('touchmove', (e) => {
            const endX = e.touches[0].pageX
            const endY = e.touches[0].pageY

            if (endX - startX < 0) this.tx > this.min ? (this.tx -= Math.ceil(this.width)) : this.tx
            else this.tx < 0 ? (this.tx += Math.ceil(this.width)) : this.tx
        })
    },
}
</script>

<style lang="scss">
.outstanding-member {
    position: relative;

    .title {
        text-align: center;
    }

    .carousel-box {
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        color: #000000;

        .carousel {
            transition: all 0.3s;

            .carousel-item {
                position: relative;
                display: inline-block;
                background-color: rgba($color: #ffffff, $alpha: 0.95);
                border: 1px solid #999999;
                // border-radius: 10px;
                margin: 0.3%;
                box-sizing: content-box;

                .avatar {
                    text-align: center;
                    padding-top: 30px;

                    img {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        object-fit: cover;
                        display: inline-block;
                        transition: all 1s;
                    }
                }

                .carousel-content {
                    padding: 10px 0;
                    text-align: center;
                }

                .tip {
                    color: #666666;
                }
            }

            .carousel-item:hover {
                transform: scale(1.01);
            }
        }
    }

    .direction-icon {
        display: inline-block;
        border: 1px solid white;
        width: 20px;
        height: 20px;
        text-align: center;
        padding: 1px;
        border-radius: 5px;
        color: white;
        cursor: pointer;
    }

    .direction-icon {
        position: absolute;
        top: 0;
        bottom: -400px;
        margin: auto;
        height: 20px;
    }

    .direction-icon:first-child {
        left: -50px;
    }

    .direction-icon:last-child {
        right: -50px;
    }
}
</style>
