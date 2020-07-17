<template>
  <div class="back-header" v-if="isShow">
    <div
      class="logo-box"
      style="display: flex;align-items: center;float:left;position:absolute;top:0;"
    >
      <img src="../../assets/img/logo.png" class="logo" />
      <p class="logo-title" style="font-size:14px;">软件协会</p>
    </div>
    <ul class="header-btn" style="list-style:none;padding:0;">
      <li>
        <i @click="person = true">
          <svg
            t="1592453346502"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3480"
            width="20"
            height="20"
          >
            <path
              d="M512 1.616824c-281.876855 0-510.383176 228.508367-510.383176 510.385223 0 281.874809 228.506321 510.380106 510.383176 510.380106s510.383176-228.506321 510.383176-510.380106C1022.383176 230.125191 793.876855 1.616824 512 1.616824zM835.144748 838.149175c0.101307-0.001023 0.204661-0.001023 0.304945-0.002047-83.016739 82.334193-197.291388 133.199675-323.449693 133.199675-126.424364 0-240.915955-51.078329-323.974649-133.718491 0.039909 0 0.080841 0 0.119727-0.001023-5.981225-5.209652-11.280928-10.671037-15.808034-16.390295 71.405283-118.755708 190.999079-181.641967 339.662957-181.641967 152.783709 0 258.138198 66.104557 339.661933 181.64606C846.923002 827.15375 841.388962 832.788074 835.144748 838.149175zM358.88474 435.444417c0-84.562954 68.552306-153.11526 153.11526-153.11526s153.11526 68.552306 153.11526 153.11526-68.552306 153.11526-153.11526 153.11526S358.88474 520.007371 358.88474 435.444417zM628.101251 603.373057c53.199643-36.849256 88.051405-98.314143 88.051405-167.927617 0-112.750947-91.40171-204.155726-204.15368-204.155726s-204.15368 91.40478-204.15368 204.155726c0 69.614497 34.852786 131.079384 88.052428 167.92864-105.013729 27.350928-195.406458 90.915639-257.029958 176.574554-54.253648-75.417667-86.213547-167.948083-86.213547-267.945565 0-253.688863 205.655893-459.344756 459.344756-459.344756s459.344756 205.655893 459.344756 459.344756c0 99.998505-31.960922 192.528921-86.215594 267.947612C823.506686 694.290743 733.113957 630.723985 628.101251 603.373057z"
              p-id="3481"
            />
          </svg>
        </i>
      </li>
      <li>
        <i @click="menu = true" v-if="!menu">
          <svg
            t="1592450878596"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2700"
            width="20"
            height="20"
          >
            <path
              d="M122.7 229.4h781.1c20.7 0 37.5-16.8 37.5-37.5s-16.8-37.5-37.5-37.5H122.7c-20.7 0-37.5 16.8-37.5 37.5s16.8 37.5 37.5 37.5zM903.8 473.1H122.7c-20.7 0-37.5 16.8-37.5 37.5s16.8 37.5 37.5 37.5h781.1c20.7 0 37.5-16.8 37.5-37.5-0.1-20.7-16.9-37.5-37.5-37.5zM903.8 791H122.7c-20.7 0-37.5 16.8-37.5 37.5S102 866 122.7 866h781.1c20.7 0 37.5-16.8 37.5-37.5S924.4 791 903.8 791z"
              p-id="2701"
            />
          </svg>
        </i>
        <i @click="menu = false" v-if="menu">
          <svg
            t="1592562735424"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2112"
            width="20"
            height="20"
          >
            <path
              d="M548.992 503.744L885.44 167.328a31.968 31.968 0 1 0-45.248-45.248L503.744 458.496 167.328 122.08a31.968 31.968 0 1 0-45.248 45.248l336.416 336.416L122.08 840.16a31.968 31.968 0 1 0 45.248 45.248l336.416-336.416L840.16 885.44a31.968 31.968 0 1 0 45.248-45.248L548.992 503.744z"
              p-id="2113"
            />
          </svg>
        </i>
      </li>
    </ul>
    <el-drawer class="drawer" title :visible.sync="person">
      <div style="overflow:auto;" :style="{'height':maxH+'px'}">
        <aside-right></aside-right>
      </div>
    </el-drawer>

    <div class="drawer" v-if="menu" style="backgroundColor:white;">
      <div style="overflow:auto;" :style="{'height':maxH+'px','width':maxW}">
        <back-aside class="back-aside" :isShowLogo="false" :maxH="maxH"></back-aside>
      </div>
    </div>
  </div>
</template>
<script>
import backAside from "@/components/backstage/BackNavMenu.vue";
import asideRight from "@/components/backstage/BackSidebar.vue";
export default {
  data() {
    return {
      menu: false,
      person: false
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    maxH: {
      type: Number,
      default: 500
    },
    maxW: {
      type: Number,
      default: 500
    }
  },
  watch: {
    isShow(newVal) {
      if (!newVal) {
        this.menu = false;
        this.person = false;
      }
    },
    menu(newVal) {
      let m = document.getElementsByClassName("drawer")[1];
      // let m = this.$refs.elDrawer2;
      if (!newVal) {
        m.style.opacity = 0;
      } else {
        m.style.opacity = 1;
      }
    },
    person(newVal) {
      let p = document.getElementsByClassName("drawer")[0];
      if (!newVal) {
        p.style.opacity = 0;
      } else {
        p.style.opacity = 1;
      }
    }
  },
  components: {
    backAside,
    asideRight
  }
};
</script>
<style>
.back-header{
  z-index: 9999;
}
.el-drawer {
  width: 20% !important;
}
.logo-box {
  margin: auto 5px;
}
.header-btn {
  float: right;
  margin-right: 15px;
}
.header-btn li {
  display: inline;
  margin: 0 10px;
}
.back-aside {
  width: 100%;
}
</style>