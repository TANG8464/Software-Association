<template>
  <div class="newest-notice" :style="{ padding: padding - 5 + 'px' }">
    <div class="title">
      <p :style="{ 'font-size': +15 + size.maxW * 0.01 + 'px', margin: margin + 'px' }">
        <icon name="notice" scale="40" :width="25 + size.maxW * 0.01"></icon>最新公告
      </p>
      <span>The Latest Announcement</span>
    </div>
    <div v-if="notices" :style="{ width: size.maxW }" style="overflow: auto">
      <el-row
        :gutter="24"
        :style="{ margin: margin + 'px', padding: padding - 5 + 'px' }"
        style="min-width: 650px; display: inline-block"
      >
        <el-col
          :span="8"
          v-for="item in notices"
          :key="item.id"
          :style="{ padding: `0 ${padding - 5}px` }"
        >
          <div
            class="notice"
            style="height: 100%"
            @click="$router.push({ path: '/notice/details', query: { id: item.id, index: 0 } })"
          >
            <div class="cover-box" :style="{ height: 200 + size.maxW * 0.01 + 'px' }">
              <img :src="item.cover" alt style="width: 100%; height: 100%; object-fit: cover" />
            </div>
            <div class="content-box" :style="{ padding: padding + 'px' }">
              <h1
                class="news_title"
                :style="{ 'font-size': fontSize + 5 + 'px', margin: margin + 'px' }"
              >
                <span>{{ item.title }}</span>
              </h1>
              <p
                class="news_content"
                v-html="item.text"
                :style="{
                  'font-size': fontSize + 5 + 'px',
                  margin: margin + 'px',
                  'min-height': '30px',
                }"
              ></p>
              <div
                class="footer-box"
                :style="{ 'font-size': fontSize + 'px', margin: margin + 'px' }"
              >
                <div style="display: inline-flex; align-items: center">
                  <img
                    :src="item.member.avatarUrl"
                    width="35"
                    height="35"
                    style="border-radius: 50%; display: inline"
                  />
                  <span>{{ item.member.memberName }}</span>
                </div>
                <div>{{ item.deplDate | dateFormatter }} | {{ item.count | countFormatter }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row v-else :gutter="24" :style="{ margin: margin + 'px', padding: padding - 5 + 'px' }">
      <el-col :span="8" v-for="item in 3" :key="item" :style="{ padding: padding - 5 + 'px' }">
        <div class="notice" :style="{ 'min-height': 100 + size.maxW * 0.2 + 'px' }"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchNewestNotice } from '@/api/notice'
import { dateFormatter, countFormatter } from '@/filters'
export default {
  data() {
    return {
      notices: [],
    }
  },
  computed: {
    size() {
      return this.$store.state.resize
    },
    fontSize() {
      return this.size.isSmallSize ? 6 : 15
    },
    margin() {
      return this.size.isSmallSize ? 5 : 10
    },
    padding() {
      return this.size.isSmallSize ? 5 : 20
    },
  },
  created() {
    this.setNotices()
  },
  methods: {
    async setNotices() {
      const data = await searchNewestNotice()
      if (data.code === 200) {
        this.notices = data.data
      } else this.$message.error(data.message)
    },
  },
  filters: {
    dateFormatter,
    countFormatter,
  },
}
</script>

<style lang="scss">
.newest-notice {
  color: #666666;

  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  .title {
    text-align: center;
    color: white;
  }

  .icon-notice {
    animation: waggle 2s infinite;
  }

  @keyframes waggle {
    0% {
      transform: rotate(10deg);
    }

    50% {
      transform: rotate(-10deg);
    }

    100% {
      transform: rotate(10deg);
    }
  }

  .el-row {
    margin: 10px;
    padding: 10px;

    .el-col {
      .notice {
        background-color: rgba($color: #ffffff, $alpha: 0.95);
        margin: 5px;

        .footer-box {
          border-top: 1px solid #aaaaaa;
          text-align: center;
          padding: 10px;
        }
      }

      .notice:hover {
        transform: scale(1.01);
      }
    }

    .news_title {
      text-overflow: ellipsis;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
    }

    .news_title:hover span {
      border-bottom: 1px solid #666666;
    }

    .news_content {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
}
</style>
