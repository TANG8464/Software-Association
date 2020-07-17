<template>
  <div class="aside-r" style="padding:20px 0;">
    <router-link to="/siae" tag="div" style="font-size:18px;">
      <el-avatar :src="head"></el-avatar>
    </router-link>
    <el-tooltip class="item" effect="dark" content="返回首页" placement="left-end">
      <router-link to="/siae" tag="div" style="font-size:18px;">
        <button class="button">
          <svg
            t="1590299801293"
            class="icon"
            viewBox="0 0 1026 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9357"
            height="25"
            width="25"
          >
            <path
              d="M1005.190301 504.852314l-437.137399-443.90889-29.34313-30.095518c-6.771492-6.771492-15.800147-10.533431-24.828802-10.533431-9.781043 0-18.809699 3.76194-24.828802 10.533431L22.571639 504.099927C1.504776 525.166789-4.514328 556.767083 6.771492 584.605437c11.285819 27.085966 38.371785 45.143277 67.714915 45.143277h48.152829v373.936811h783.235856V630.501102h48.905217c19.562087 0 37.619398-7.52388 51.16238-21.066862 27.085966-29.34313 27.085966-75.238795-0.752388-104.581926z m-428.861131 416.822925H449.927994V687.682586h127.153564v233.992653z m246.783247-373.936811v373.936811H649.310801V659.844232c0-12.038207-4.514328-24.076414-12.790595-32.352682-8.276267-8.276267-20.314475-13.542983-32.352682-13.542983H422.842028c-12.038207 0-23.324026 5.266716-32.352682 13.542983-8.276267 8.276267-13.542983 20.314475-12.790595 32.352682v261.831007H203.144747V547.738428H94.048494l419.080088-424.346804 26.333578 27.085966 392.74651 398.013226-109.096253-0.752388z m0 0"
              class="path"
              p-id="9358"
            />
          </svg>
        </button>
      </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="个人中心" placement="left-end">
      <router-link to="/siae" tag="div" style="font-size:18px;">
        <button class="button">
          <svg
            t="1590302846530"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11559"
            width="25"
            height="25"
          >
            <path
              d="M512 62.784c-123.712 0-224 100.288-224 224s100.288 224 224 224c123.712 0 224-100.288 224-224S635.712 62.784 512 62.784zM512 446.784c-88.352 0-160-71.648-160-160s71.648-160 160-160c88.352 0 160 71.648 160 160S600.384 446.784 512 446.784zM959.328 864.992C942.208 633.184 748.16 449.344 512 449.344c-246.528 0-446.4 199.136-447.872 445.344C64.128 895.104 64 895.552 64 896c0 0.16 0.032 0.288 0.032 0.448C64.032 896.736 64 897.024 64 897.344l0.16 0.128C64.96 932.128 93.152 960 128 960c1.184 0 2.304-0.288 3.488-0.352L131.872 960l1.696 0 668.992 0c18.048 0 32.672-14.336 32.672-32s-14.624-32-32.672-32l-643.2 0C128 896 119.328 897.344 133.92 832.608c30.816-181.184 188.128-319.264 378.08-319.264 200.832 0 365.376 154.24 382.304 350.656l-0.192 0c0.896 10.24 1.696 20.544 1.76 31.008L896 895.008l0 35.2 0.448 0C897.632 946.784 911.104 960 928 960s30.368-13.216 31.552-29.792L960 930.208l-0.832-65.184"
              class="path"
              p-id="11560"
            />
          </svg>
        </button>
      </router-link>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="退出登陆" placement="left-end">
      <button class="button" @click="exit()">
        <svg
          t="1590302564541"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10370"
          width="25"
          height="25"
        >
          <path
            d="M228.66 164.081c19.426-14.6 47.01-10.688 61.61 8.737 14.6 19.426 10.688 47.009-8.737 61.61C185.55 306.567 128 419.264 128 541.607c0 212.077 171.923 384 384 384s384-171.923 384-384c0-122.476-57.676-235.281-153.834-307.407-19.44-14.58-23.378-42.16-8.797-61.6 14.581-19.44 42.16-23.378 61.6-8.797C913.054 252.375 984 391.136 984 541.608c0 260.678-211.322 472-472 472s-472-211.322-472-472c0-150.31 70.792-288.937 188.66-377.527zM556 384c0 24.3-19.7 44-44 44s-44-19.7-44-44V75c0-24.3 19.7-44 44-44s44 19.7 44 44v309z"
            class="path"
            p-id="10371"
          />
        </svg>
      </button>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      head:
        // "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        require("@/assets/img/headImg.gif")
    };
  },
  props: {
    maxH: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.Index = this.$router.currentRoute.path;
  },
  methods: {
    exit() {
      this.$axios("member/logout", {
        method: "put"
      })
        .then(res => {
          console.log(res);
          this.$cookies.remove("activeUser");
          localStorage.removeItem("HEADER_TOKEN");
          this.$notify({
            title: "退出登录",
            message: "成功",
            type: "success",
            duration: 2000,
            showClose: false
          });
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.path {
  fill: rgb(55, 185, 233);
  transition: all 1s;
}
.button {
  background: none;
  border: none;
  border-radius: 5px;
  width: 40px;
  height: 40px;
  padding: 5px;
  margin: 5px 0;
  transition: all 1s;
}
.button:hover {
  background-color: rgb(98, 213, 255);
}
.button:hover .path {
  fill: #fff;
}
</style>