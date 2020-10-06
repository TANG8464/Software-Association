<template>
<div class="footer">
    <el-row :gutter="24" style="margin: 0;">
        <el-col class="left" :class="{lg:!size.isSmallSize,sm:size.isSmallSize}" :lg="9" :xs="24" :sm="24">
            <span>协会简介</span>
            <span>成员介绍</span>
            <span>联系我们</span>
            <span>常见问题</span>
        </el-col>
        <el-col class="right" :lg="15" :xs="24" :sm="24">
            <h3>友情链接</h3>
            <p class="link">
                <a href="http://www.hunangy.com/">学校官网</a>
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
</template>

<script>
export default {
    computed: {
        size() {
            return this.$store.state.resize
        },
    }
}
</script>

<style lang="scss">
.footer {
    height: 200px;
    color: #b5b5b5;
    padding: 20px 0;
    // margin: 50px 0;
    /*
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    */

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

    .left {
        span:hover {
            color: white;
        }
    }
}
</style>
