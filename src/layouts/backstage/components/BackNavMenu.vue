<template>
<div class="nav-menu">
    <div class="logo-box" v-if="isShowLogo">
        <img v-if="!isCollapse" src="@/assets/img/squareLogo.png" class="logo" style="height: 100px;" />
        <img v-if="isCollapse" src="@/assets/img/logo.png" class="logo" style="height: 30px;" />
    </div>
    <!--左侧导航菜单，router开启路由，unique-opened只展开一个菜单项，collapse是否折叠菜单-->
    <el-menu v-if="!isLoading" :default-active="index" text-color="#222222" active-text-color="rgb(63,171,235)" router :collapse="isCollapse" style="overflow: auto;" :style="{'height':maxH-110+'px'}" ref="menu">
        <el-menu-item style="padding:0 10px" index="/backstage/data-monitor" @click="$router.push('/backstage/data-monitor')">
            <template slot="title">
                <i class="menu_icon">
                    <icon name='data-monitor' scale='23' width='23'></icon>
                </i>
                <span class="menu_text">数据监测</span>
            </template>
        </el-menu-item>
        <!--菜单-->
        <el-submenu v-for="item in nav" :key="item.menuId" :index="'/Backstage/'+item.url" :style="{'text-align':align}" ref="submenu" v-show="item.url!=='-'">
            <template slot="title">
                <i class="menu_icon" v-html="item.icon"></i>
                <span class="menu_text">{{item.name}}</span>
            </template>
            <!--子菜单-->
            <el-menu-item v-for="children in item.menuNodeList" :key="children.menuId" :index="'/backstage/'+children.url" @click="setActiveIndex(item,children)">
                <span class="menu_icon" v-html="children.icon" style="position:relative;top:-3px;margin:0 2px;"></span>&nbsp;
                <span class="menu_text">{{children.name}}</span>
            </el-menu-item>
        </el-submenu>
    </el-menu>
    <div>
        <span class="rotate">
            <icon name='loading' scale='30' width='30'></icon>
        </span>
    </div>
</div>
</template>

<script>
export default {
    name: 'Aside',
    props: {
        isCollapse: {
            //是否折叠左导航栏
            type: Boolean,
            default: false,
        },
        align: {
            //导航栏文字对齐方式
            type: String,
            default: 'left',
        },
        isShowLogo: {
            //是否展示logo，maxW小于800时不展示
            type: Boolean,
            default: true,
        },
        maxH: {
            //页面最大高
            type: Number,
            default: 500,
        },
    },
    data() {
        return {
            nav: [], //左侧导航栏所有值
            index: '', //当前选中菜单项
            isLoading: false,
        }
    },
    computed: {
        isChangeNav() {
            return this.$store.state.isChangeNav
        },
    },
    watch: {
        //监听路由,设置当前选中的index为当前路由
        '$route.fullPath': function (newVal) {
            this.index = newVal
            const url = this.index.substring(11)
            this.initBreadcrumb(url)
        },
        isChangeNav(newVal) {
            this.allNav(this.index)
        },
    },
    created() {
        //页面进入时，设置默认index为当前路由
        this.index = this.$route.fullPath
        const url = this.index.substring(11)
        this.allNav(url)
    },

    methods: {
        setActiveIndex(item, children) {
            let Breadcrumb = []
            if (item) Breadcrumb.push({
                id: 1,
                name: item.name,
                path: '/backstage/' + item.url
            })
            if (children) Breadcrumb.push({
                id: 2,
                name: children.name,
                path: ''
            }, )
            this.$store.commit('setBreadcrumb', Breadcrumb)
        },
        //获取所有导航菜单
        async allNav(url) {
            this.isLoading = true
            const {
                data
            } = await this.$axios.get('sys/menu/nav')
            if (data.code === 200) {
                this.nav = data.data
                this.initBreadcrumb(url)
                this.isLoading = false
                //设置初始面包屑内容
            } else {
                this.$message.error({
                    message: '请求错误',
                })
            }
        },
        initBreadcrumb(url) {
            let Breadcrumb = []
            this.nav.forEach((item) => {
                item.menuNodeList.forEach((children) => {
                    if (children.url === url) {
                        Breadcrumb = [{
                                id: 1,
                                name: item.name,
                                path: '/backstage/' + item.url
                            },
                            {
                                id: 2,
                                name: children.name,
                                path: ''
                            },
                        ]

                    }
                })
            })
            this.$store.commit('setBreadcrumb', Breadcrumb)
        },
    },
}
</script>

<style lang="scss">
.nav-menu {
    user-select: none;

    /*
 logo
*/
    .el-menu {
        background: none;

        .el-submenu {
            .el-menu-item {
                display: block;
            }
        }
    }

    .logo-box {
        padding: 10px;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    .logo {
        margin: auto;

    }

    /*
 清除el-menu右侧边框线
*/
    .el-menu {
        border: none;
    }

    p {
        margin: 0;
    }

    .rotate {
        display: block;
        width: 35px;
        height: 35px;
        margin: auto;
        transition: all 1s;
        animation: rotate 1.5s linear infinite
    }

    @keyframes rotate {
        0% {
            animation-delay: 1.5s;
            transform: rotate(0deg);
        }

        100% {
            animation-delay: 0.5s;
            transform: rotate(1turn);
        }
    }
}
</style><style>
.el-submenu__title {
    padding: 0 10px !important;
}

/*
导航栏菜单预选中文字样式
*/
.el-menu-item:focus svg path,
.el-menu-item:hover svg path {
    fill: rgb(64, 171, 234);
}

.el-menu-item:focus .menu_text,
.el-menu-item:hover .menu_text {
    color: rgb(64, 171, 234);
}

.menu_icon {
    width: 23px;
    display: inline-block;
}

.menu_text {
    margin-left: 5px;
}
</style>
