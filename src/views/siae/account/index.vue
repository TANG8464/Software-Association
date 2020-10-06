<template>
<div class="login">
    <el-container :key="update" ref="loginBack">
        <div class="content-box" ref="content-box" :style="{width,height,'border-radius':borderRadius}">
            <router-view></router-view>
        </div>
    </el-container>
</div>
</template>

<script>
export default {
    data() {
        return {
            update: false,

            isFull: false,
        }
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
        width() {
            return this.size.isSmallSize ? '100%' : '340px'
        },
        height() {
            return this.size.isSmallSize ? '100%' : null
        },
        borderRadius() {
            return this.size.isSmallSize ? 0 : '10px'
        },
    },
    watch: {
        $route(newVal) {
            this.setFull(newVal.name)
        },
        isFull(newVal) {
            const el = this.$refs['content-box']
            if (newVal) {
                el.style.width = '100%'
                el.style.borderRadius = '0'
            } else {
                el.style.width = this.size.isSmallSize ? '100%' : '340px'
                el.style.borderRadius = '10px'
            }
        },
    },
    mounted() {
        this.setFull(this.$route.name)
    },
    methods: {
        setFull(name) {
            const nameMap = ['forget-pwd', 'register']
            if (nameMap.includes(name)) this.isFull = true
            else this.isFull = false
        }
    }
}
</script>

<style lang="scss">
.login {
    overflow: auto;

    .content-box {
        margin: auto auto;
        background-color: rgba(255, 255, 255, 1);
        padding: 30px;
        transition: all 0.3s;

        .other {
            .title {
                color: #999999;
                font-size: 14px;
                border-bottom: 1px solid #e0e0e0;
                padding: 10px 0;
            }

            .actions {
                span {
                    margin: 0 10px;
                }

                span:hover {
                    color: #111111;
                }
            }
        }
    }
}
</style>
