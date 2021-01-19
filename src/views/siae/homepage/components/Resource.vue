<template>
  <div class="homepage-resource" style="height:100%">
    <el-row :gutter="24">
      <el-col :lg="10" :md="10" :sm="24" :xs="24">
        <div class="title" style="margin: 40px 0">
          <p style="margin: 0; font-size: 25px">协会资源</p>
          <span class="content">Association of resources</span>
        </div>
        <div class="item" :class="{ 'text-active': active === 0 }" @mouseover="active = 0">
          <p class="item-title">硬件资源</p>
          <p class="content">空调|WiFi|饮水机|舒适的自习室|上千本专业书籍</p>
        </div>
        <div class="item" :class="{ 'text-active': active === 1 }" @mouseover="active = 1">
          <p class="item-title">人力资源</p>
          <p class="content">正在攻读博士的李俊成老师|18、19级优秀的学长学姐</p>
        </div>
        <div class="item" :class="{ 'text-active': active === 2 }" @mouseover="active = 2">
          <p class="item-title">网络资源</p>
          <p class="content">学习视频|学习软件|各大学习的网站|千兆光纤</p>
        </div>
      </el-col>
      <el-col :lg="14" :md="14" :sm="24" :xs="24">
        <div class="show">
          <div class="show-item" :class="{ 'show-active': active === 0 }" style="height: 350px">
            <img src="@/assets/img/resource/自习室.jpg" style="height: 50%" />
            <img src="@/assets/img/resource/专业书籍.jpg" style="height: 50%" />
          </div>
          <div class="show-item" :class="{ 'show-active': active === 1 }">
            <el-row :gutter="24">
              <el-col :span="12">
                <img src="@/assets/img/resource/李老师.png" width="95%" />
              </el-col>
              <el-col :span="12" style="text-align: center">
                <div>
                  <h2>李俊成</h2>
                  <div :style="{ 'font-size': 8 + fontSize + 'px', margin: 0 }">
                    <p>协会创始人</p>
                    <p>硕士毕业|现于中南大学攻读博士</p>
                    <p>独特的教学风格</p>
                    <p>英语六级|爱钻研算法|喜爱研究时代新技术</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="show-item" :class="{ 'show-active': active === 2 }">
            <img src="@/assets/img/resource/网络.jpg" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      src: '@/assets/img/resource/',
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    fontSize() {
      return this.size.maxW * 0.01
    },
  },
}
</script>

<style lang="scss">
.homepage-resource {
  .item {
    padding: 30px 10px;
    transition: all 0.2s;
  }

  .text-active {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  .item {
    .item-title {
      margin: 0;
      font-size: 20px;
    }
  }
  .content {
    color: #dbdbdb;
    margin: 0;
  }

  .show {
    position: relative;
    padding: 15px;
    min-height: 350px;

    .show-item {
      position: absolute;
      top: 0;
      opacity: 0;
      transition: all 0.3s;
      right: 0;
      bottom: 0;
      width: 100%;
      text-align: left;
      img {
        margin: 5px;
      }
    }

    .show-active {
      opacity: 1;
    }
  }
}
</style>
