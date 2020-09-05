<template>
  <div class="backstage">
    <page-loading :isLoading="isLoading"></page-loading>
    <div class="back-nav-menu-bax" ref="navMenuBox">
      <back-nav-menu ref="navMenu" :isCollapse="isCollapseAside" :align="align" :maxH="size.maxH"></back-nav-menu>
    </div>
    <div class="back-sidebar-box" ref="sidebarBox">
      <back-sidebar ref="sidebar" :maxH="size.maxH"></back-sidebar>
    </div>
    <div class="main" ref="main">
      <div class="header" ref="header" v-show="isShowHeader">
        <Back-phone-header v-if="isShowHeader" :maxH="size.maxH" :maxW="size.maxW"></Back-phone-header>
      </div>
      <div class="outer" ref="outer">
        <div class="within" ref="within">
          <breadcrumb-nav></breadcrumb-nav>
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackNavMenu from './components/BackNavMenu'
import BackSidebar from './components/BackSidebar'
import BackPhoneHeader from './components/BackPhoneHeader'
import BreadcrumbNav from '@/components/BreadcrumbNav'
import PageLoading from '@/components/PageLoading/One'
export default {
  name: 'backstage',
  components: {
    BackNavMenu,
    BackSidebar,
    BackPhoneHeader,
    BreadcrumbNav,
    PageLoading,
  },
  data() {
    return {
      isCollapseAside: false,
      isLoading: false,
      align: 'left',
      isShowHeader: false,
      navMenu: null,
      backSidebar: null,
      main: null,
      out: null,
      header: null,
    }
  },
  created() {
    this.load()
  },
  mounted() {
    this.init()
    this.resize()
  },
  watch: {
    $route(newVal) {
      this.resize()
    },
    size() {
      this.resize()
    },
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
  },
  methods: {
    init() {
      this.navMenu = this.$refs.navMenuBox
      this.backSidebar = this.$refs.sidebarBox
      this.main = this.$refs.main
      this.out = this.$refs.outer
      this.header = this.$refs.header
    },
    load() {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
    resize() {
      const isMediumSize = this.size.isMediumSize
      const isSmallSize = this.size.isSmallSize

      this.isCollapseAside = isMediumSize //是否开启折叠
      this.navMenu.style.width = isMediumSize ? '65px' : '15%' //左侧导航栏宽度
      this.main.style.left = isSmallSize ? 0 : this.navMenu.style.width //中间距离左边的宽度

      this.align = isMediumSize ? 'center' : 'left' //菜单内容居中/居左

      this.isShowHeader = isSmallSize //是否展示上侧导航栏
      this.header.style.opacity = isSmallSize ? 1 : 0

      this.main.style.right = isSmallSize ? 0 : '50px'
      // this.main.style.backgroundColor = isSmallSize ? 'white' : 'rgb(248, 250, 249)'

      this.navMenu.style.width = isSmallSize ? 0 : this.navMenu.style.width
      this.backSidebar.style.width = isSmallSize ? 0 : '50px'

      this.out.style.margin = isSmallSize ? '30px 0' : '30px'
      this.out.style.boxShadow = isSmallSize ? '' : '0px 0px 20px 5px #eeeeee'
      this.out.style.background = isSmallSize ? 'none' : 'white'
      this.$refs.within.style.padding = isSmallSize ? '10px 15px' : '20px 50px'
    },
  },
}
</script>
<style>
.logo-title {
  color: rgb(64, 171, 234);
  display: inline;
  font-weight: 400;
}
</style>
<style scoped>
.back-nav-menu-bax {
  position: fixed;
  background-color: white;
  height: 100%;
  width: 0;
  transition: all 1s;
  
}
.header {
  background-color: white;
  box-shadow: 0px 0px 20px 5px #eeeeee;
  transition: all 1s;
  height: 45px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2502;
}
.main {
  color: #333;
  position: fixed;
  left: 180px;
  right: 50px;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  background-color: rgb(248, 250, 249);
  /*
  background-color: white;
  */
  transition: all 1s;
  border-right: 1px solid #e0e0e0;
  border-left: 1px solid #e0e0e0;
}
.back-sidebar-box {
  position: fixed;
  right: 0;
  height: 100%;
  background-color: rgb(255, 255, 255);
  /*
  background-color: #5b626b;
  */
}

.el-container {
  width: 100%;
  margin-bottom: 40px;
}

.el-aside {
  background-color: white;
  padding: 0;
  box-shadow: 0px 0px 5px 0px #eeeeee;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
}
.outer {
  /*
  margin: 30px;
  border-radius: 10px;
  */
}
.within {
  overflow: hidden !important;
  border-radius: 10px !important;
}
.el-dialog_wrapper .dialog-fade-leave-active {
  animation-fill-mode: forwards;
}
</style>


