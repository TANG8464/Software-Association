<template>
  <div class="aside">
    <div class="logo-box" v-if="isShowLogo">
      <img src="../../assets/img/logo.png" class="logo" />
      <h2 v-if="!isCollapse" class="logo-title">软件协会</h2>
    </div>
    <!--左侧导航菜单，router开启路由，unique-opened只展开一个菜单项，collapse是否折叠菜单-->
    <el-menu
      :default-active="index"
      text-color="#222222"
      active-text-color="rgb(63,171,235)"
      router
      :collapse="isCollapse"
      style="overflow: auto;"
      :style="{'height':maxH-200+'px'}"
      ref="menu"
      unique-opened="true"
    >
      <!--菜单-->
      <el-submenu
        v-for="item in nav"
        :key="item.menuId"
        :index="'/Backstage/'+item.url"
        :style="{'text-align':align}"
        ref="submenu"
      >
        <template slot="title">
          <i v-html="item.icon"></i>
          <span class="menu_text">{{item.name}}</span>
        </template>
        <!--子菜单-->
        <el-menu-item
          v-for="children in item.menuNodeList"
          :key="children.menuId"
          :index="'/backstage/'+children.url"
        >
          <span v-html="children.icon" style="position:relative;top:-3px;margin:0 2px;"></span>&nbsp;
          <span class="menu_text">{{children.name}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      nav: [], //左侧导航栏所有值
      index: "" //当前选中菜单项
    };
  },
  props: {
    isCollapse: {
      //是否折叠左导航栏
      type: Boolean,
      default: false
    },
    align: {
      //导航栏文字对齐方式
      type: String,
      default: "left"
    },
    isShowLogo: {
      //是否展示logo，maxW小于800时不展示
      type: Boolean,
      default: true
    },
    maxH: {
      //页面最大高
      type: Number,
      default: 500
    }
  },
  created() {
    //页面进入时，设置默认index为当前路由
    this.index = this.$route.fullPath;
    this.allNav();
  },
  watch: {
    //监听路由,设置当前选中的index为当前路由
    "$route.fullPath": function(newVal) {
      this.index = newVal;
    }
  },
  methods: {
    //获取所有导航菜单
    async allNav() {
      try {
        let res = await this.$axios.get("sys/menu/nav");
        if (res.data.code === 200) {
          this.nav = res.data.data;
        } else {
          this.$message.error({
            message: "请求错误"
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>
.aside {
  user-select: none;
}
/*
 logo
*/
.logo-box {
  padding: 10px;
  display: flex;
  align-items: center;
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
</style>
<style>
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
</style>
