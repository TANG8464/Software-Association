<template>
  <div class="login-change_back">
    <div
      class="changeBackBtn"
      style="position: fixed;right:50px;bottom:30px"
      @click="centerDialogVisible = true"
    >
      <svg
        t="1590470621992"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3839"
        width="25"
        height="25"
      >
        <path
          d="M910.74 338.74L756.8 195.33c-11.5-10.71-27.32-16.15-43.59-14.99-1.53-0.12-3.03-0.18-4.48-0.18h-82.01l-5.75 2.98c-30.39 15.75-69.15 24.42-109.16 24.42s-78.78-8.67-109.16-24.42l-5.75-2.98h-82.02c-20.91 0-39.71 10.63-49.43 27.51L113.29 349.43C102.78 359.21 97 372.22 97 386.06c0 13.84 5.78 26.84 16.29 36.63l111.17 103.58c9.31 8.66 21.33 13.87 34.27 14.95v250.3c0 28.84 25.19 52.31 56.14 52.31h393.85c30.96 0 56.14-23.47 56.14-52.31V530.57c13.1-1 25.28-6.23 34.68-14.98l111.18-103.58c21.7-20.19 21.7-53.07 0.02-73.27z m0 0"
          p-id="3840"
          class="changeBackSvg"
        />
      </svg>
    </div>
    <el-dialog title="设置背景" v-dialogDrag :visible.sync="centerDialogVisible" center>
      <div style="height:350px;overflow:auto;">
        <div
          class="backSmall"
          v-for="(item,index) in backs"
          :key="index"
          style="width:200px;height:140px;float:left;"
          @click="selectIndex=index"
        >
          <img :src="item" alt style="width:100%;height:100%;" />
          <div style="float:right; position: relative;top:-140px;" v-if="selectIndex==index">
            <svg
              t="1590473419360"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5945"
              width="25"
              height="25"
            >
              <path
                d="M511.999994 0C229.205543 0 0.020822 229.226376 0.020822 512.020827c0 282.752797 229.184721 511.979173 511.979173 511.979173s511.979173-229.226376 511.979173-511.979173C1023.979167 229.226376 794.794446 0 511.999994 0zM815.371918 318.95082l-346.651263 461.201969c-10.830249 14.370907-27.32555 23.409999-45.27877 24.742952-1.582882 0.124964-3.12411 0.166619-4.665338 0.166619-16.328682 0-32.074198-6.373185-43.779197-17.911565l-192.903389-189.44604c-24.617988-24.20144-24.992881-63.731847-0.791441-88.349835 24.20144-24.659643 63.731847-24.951226 88.349835-0.833096l142.042875 139.501932 303.788472-404.2182c20.744091-27.575479 59.899605-33.115568 87.516739-12.413131C830.534266 252.219827 836.116009 291.375341 815.371918 318.95082z"
                p-id="5946"
                fill="#ffffff"
              />
            </svg>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setBack(false)">取 消</el-button>
        <el-button type="primary" @click="setBack(true)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    backs: {
      type: Array,
      default: []
    },
    backIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectIndex: 0,
      centerDialogVisible: false
    }
  },
  mounted() {
    this.selectIndex = this.backIndex
  },
  methods: {
    setBack(isSet) {
      this.centerDialogVisible = false
      if (isSet) {
        localStorage.setItem('backIndex', this.selectIndex)
        this.$emit('update:backIndex', this.selectIndex)
      } else {
        this.selectIndex = this.backIndex
      }
    }
  }
}
</script>
<style scoped>
.changeBackBtn {
  padding: 10px 14px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0);
  transition: all 0.5s;
}
.changeBackBtn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
.changeBackSvg {
  fill: white;
}
.backSmall {
  margin: 5px;
  padding: 5px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}
</style>