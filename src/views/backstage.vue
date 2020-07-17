<template>
  <div class="HomePage">
    <div class="aside-l-box" ref="asideLBox">
      <backAside ref="asidel" id="asidel" :isCollapse="isCollapseAside" :align="align" :maxH="maxH"></backAside>
    </div>
    <div class="main" ref="main">
      <div class="header" ref="header">
        <back-header :isShow="isShowHeader" :maxH="maxH" :maxW="maxW"></back-header>
      </div>
      <div class="outer" ref="outer">
        <div class="within">
          <transition name="component" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>
    <div class="aside-r-box" ref="asideRBox">
      <asideRight ref="asider" :maxH="maxH"></asideRight>
    </div>
    <div class="loading-back" v-if="isLoading">
      <div class="loading">
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
        <div class="cir"></div>
      </div>
    </div>
  </div>
</template>

<script>
import backAside from "@/components/backstage/BackNavMenu.vue";
import asideRight from "@/components/backstage/BackSidebar.vue";
import backHeader from "@/components/backstage/BackPhoneHeader.vue";

export default {
  name: "Home",
  data() {
    return {
      isCollapseAside: false,
      isLoading: false,
      align: "left",
      isShowHeader: false,
      maxW: 0,
      maxH: 0,
      alb: null,
      arb: null,
      m: null,
      out: null,
      h: null
    };
  },
  created() {
    this.load();
    this.setActiveUser();
  },
  mounted() {
    this.init();
    this.resize();
    let that = this;
    window.onresize = function() {
      that.resize();
    };
  },
  watch: {
    "$route.fullPath": function(newVal) {
      this.load();
      this.resize();
    }
  },
  methods: {
    init() {
      this.alb = this.$refs.asideLBox;
      this.arb = this.$refs.asideRBox;
      this.m = this.$refs.main;
      this.out = this.$refs.outer;
      this.h = this.$refs.header;
    },
    load() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    allNav(){

    },
    async setActiveUser() {
      try {
        let res = await this.$axios.get("member/info");
        if (res.data.code === 200) {
          this.$cookies.set(
            "activeUser",
            res.data.data.id + "&" + res.data.data.memberName
          );
        } else {
          this.$message.error({
            message: res.data.message
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    resize() {
      this.maxW = window.outerWidth; //获取网页外部窗体宽
      this.maxH = window.outerHeight; //获取网页外部窗体高

      let fs = 16;
      let pad = 45;
      if (this.maxW <= 1000) {
        this.isCollapseAside = true;
        this.alb.style.width = "65px";
        this.m.style.left = "65px";
        fs = this.maxW * 0.02;
        pad = this.maxW * 0.045;
        this.align = "center";
      } else {
        this.isShowHeader = false;
        this.isCollapseAside = false;
        this.alb.style.width = "15%";
        this.m.style.left = "15%";
        this.align = "left";
      }
      if (this.maxW < 800) {
        this.isShowHeader = true;
        this.m.style.left = 0;
        this.m.style.right = 0;
        this.m.style.backgroundColor = "white";
        this.h.style.opacity = 1;
        this.alb.style.width = 0;
        this.arb.style.width = 0;
        this.out.style.margin = "30px 0";
        this.out.style.boxShadow = "";
        this.out.style.background = "none";
        document.querySelectorAll(".within").forEach(item => {
          item.style.padding = "10px 15px";
        });
      } else {
        this.m.style.right = "50px";
        this.m.style.backgroundColor = "rgb(248, 250, 249)";
        this.h.style.opacity = 0;
        this.arb.style.width = "50px";
        this.out.style.margin = "30px";
        this.out.style.boxShadow = "0px 0px 20px 5px #eeeeee";
        this.out.style.backgroundColor = "white";
        document.querySelectorAll(".within").forEach(item => {
          item.style.padding = "20px 50px";
        });
      }
    }
  },
  components: {
    backAside,
    asideRight,
    backHeader
  }
};
</script>
<style>
.logo {
  height: 30px;
}

.logo-title {
  color: rgb(64, 171, 234);
  display: inline;
  font-weight: 400;
}
</style>
<style scoped>
.component-enter,
.component-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
/* v-enter-active 入场动画时间段 */
/* v-leave-active 离场动画时间段 */

.component-enter-active,
.component-leave-active {
  transition: all 0.3s ease;
}
.aside-l-box {
  position: fixed;
  background-color: white;
  height: 100%;
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
  z-index: 999;
}
.main {
  color: #333;
  text-align: center;
  position: fixed;
  left: 180px;
  right: 50px;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  background-color: rgb(248, 250, 249);
  transition: all 1s;
}
.aside-r-box {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: white;
  width: 50px;
  background-color: #5b626b;
  z-index: 1000;
  transition: all 1s;
}

.el-container {
  width: 100%;
  margin-bottom: 40px;
}

.el-aside {
  background-color: white;
  padding: 0;
  box-shadow: 0px 0px 5px 0px #eeeeee;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
}
.outer {
  margin: 30px;
  border-radius: 10px;
}
.within {
  overflow: hidden !important;
  border-radius: 10px !important;
}
.loading-back {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100000;
  background-color: rgba(255, 255, 255, 0.6);
}
.loading {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  margin: auto auto;
}
.cir {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  display: inline-block;
  animation: slide 1s infinite;
}
.cir:nth-child(1) {
  animation-delay: 0.1s;
  background: #6cdbfa;
}
.cir:nth-child(2) {
  animation-delay: 0.2s;
  background: #9edaf8;
}
.cir:nth-child(3) {
  animation-delay: 0.3s;
  background: #c4d1e9;
}
.cir:nth-child(4) {
  animation-delay: 0.4s;
  background: #eacfee;
}
.cir:nth-child(5) {
  animation-delay: 0.5s;
  background: #ffbdda;
}
@keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}
.el-dialog_wrapper .dialog-fade-leave-active {
  animation-fill-mode: forwards;
}
.el-breadcrumb {
  padding: 10px;
}
</style>


