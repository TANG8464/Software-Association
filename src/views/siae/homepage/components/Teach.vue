<template>
  <div class="teaching-direction" :style="{ height: height+'px' }">
    <el-row class="main" :gutter="24">
      <el-col :span="9" style="height: 100%">
        <div class="title" style="margin-top: 100%">
          <p style="margin: 0; font-size: 25px">教学方向</p>
          <span class="content">Teaching Direction</span>
        </div>
      </el-col>
      <el-col :span="15" class="content">
        <div>
          <h1 :class="{ 'title-s-font-size': size.isSmallSize }">C</h1>
          <p :class="{ 'content-s-font-size': size.isSmallSize }">面向尚未接触过编程语言的普高生</p>
        </div>
        <div>
          <h1 :class="{ 'title-s-font-size': size.isSmallSize }">JAVA</h1>
          <p :class="{ 'content-s-font-size': size.isSmallSize }">
            面向有C语言基础的计算机专业职高生
          </p>
        </div>
        <div>
          <h1 :class="{ 'title-s-font-size': size.isSmallSize }">JavaWeb</h1>
          <p :class="{ 'content-s-font-size': size.isSmallSize }">
            大二教学课程，主要面向软件技术专业成员
          </p>
        </div>
        <div>
          <h1 :class="{ 'title-s-font-size': size.isSmallSize }">Android</h1>
          <p :class="{ 'content-s-font-size': size.isSmallSize }">
            大二教学课程，主要面向移动应用专业成员
          </p>
        </div>
        <div>
          <h1 :class="{ 'title-s-font-size': size.isSmallSize }">Python</h1>
          <p :class="{ 'content-s-font-size': size.isSmallSize }">
            大二教学课程，主要面向参加人工智能技能竞赛成员
          </p>
        </div>
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
    height() {
      return this.size.isSmallSize && !this.size.isLandscape ? 350 : this.size.maxH - 60
    },
  },
}
</script>

<style lang="scss">
.teaching-direction {
  position: relative;
  padding: 20px 0;

  .main {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100%;

    .icon-teaching {
      margin-right: 5px;

      path:last-child {
        animation: appear 3s infinite;
        transition: all 3s;
      }

      @keyframes appear {
        0% {
          opacity: 0;
          transform: scale(0);
        }

        50% {
          opacity: 1;
          transform: scale(1);
        }

        100% {
          opacity: 0;
        }
      }
    }

    .content {
      text-align: center;
    }

    .title {
      text-align: center;
      margin: 150px 0;
    }
  }

  .content-s-font-size {
    font-size: 10px;
  }

  .content-l-font-size {
    font-size: 18px;
  }

  .title-s-font-size {
    font-size: 20px;
  }
}
</style>
