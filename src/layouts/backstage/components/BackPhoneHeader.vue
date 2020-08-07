<template>
  <div class="back-phone-header" v-if="isShow">
    <div class="logo-box" style>
      <img src="@/assets/img/logo.png" class="logo" />
      <p class="logo-title" style="font-size:14px;">软件协会</p>
    </div>
    <ul class="header-btn" id="header-btn" style="list-style:none;padding:0;">
      <li>
        <i @click="person = true">
          <icon name="sidebar" scale="20" width="20"></icon>
        </i>
      </li>
      <li>
        <span @click="menu = true" v-show="!menu">
          <icon name="menu-nav" scale="20" width="20"></icon>
        </span>
        <span @click="menu = false" v-show="menu">
          <icon name="close" scale="20" width="20"></icon>
        </span>
      </li>
    </ul>
    <el-drawer class="drawer" :visible.sync="person">
      <div style="overflow:auto;" :style="{'height':maxH+'px'}">
        <back-sidebar id="nav-sidebar"></back-sidebar>
      </div>
    </el-drawer>

    <div class="drawer menu-drawer" style="display :none;transition :all 0.3s">
      <div style="overflow:auto;background-color:white;" :style="{'height':maxH+'px','width':maxW}">
        <back-nav-menu class="back-aside" id="nav-menu" :isShowLogo="false" :maxH="maxH+200"></back-nav-menu>
      </div>
    </div>
  </div>
</template>
<script>
import BackNavMenu from './BackNavMenu'
import BackSidebar from './BackSidebar'
export default {
  components: {
    BackNavMenu,
    BackSidebar,
  },
  props: {
    isShow: {
      type: Boolean,
      default: true,
    },
    maxH: {
      type: Number,
      default: 500,
    },
    maxW: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      menu: false,
      person: false,
    }
  },

  watch: {
    $route() {
      this.menu = false
    },
    isShow(newVal) {
      if (!newVal) {
        this.menu = false
        this.person = false
      }
    },
    menu(newVal) {
      const m = document.getElementsByClassName('drawer')[1]
      if (!newVal) {
        m.style.opacity = 0
        setTimeout(() => {
          m.style.display = 'none'
        }, 200)
      } else {
        m.style.display = 'block'
        setTimeout(() => {
          m.style.opacity = 1
        }, 200)
      }
    },
    person(newVal) {
      let p = document.getElementsByClassName('drawer')[0]
      if (!newVal) {
        p.style.opacity = 0
      } else {
        p.style.opacity = 1
      }
    },
  },
  mounted() {
    window.onclick = (e) => {
      const isNotCloseMenu = e.path.some((item) => {
        return item.id === 'header-btn' || item.id === 'nav-menu'
      })
      const isNotClosePerson = e.path.some((item) => {
        return item.id === 'header-btn' || item.id === 'sidebar'
      })
      if (!isNotCloseMenu) {
        this.menu = false
      }
      if (!isNotClosePerson) {
        this.person = false
      }
    }
  },
}
</script>
<style>
.back-phone-header {
  z-index: 999;
}
.back-phone-header .el-drawer {
  width: 20% !important;
}
.back-phone-header .logo-box {
  margin: auto 5px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
}
.back-phone-header .header-btn {
  float: right;
  margin-right: 15px;
}
.back-phone-header li {
  display: inline;
  margin: 0 10px;
}
.back-phone-header .back-aside {
  width: 100%;
}
</style>