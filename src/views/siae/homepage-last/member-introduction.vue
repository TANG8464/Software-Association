<template>
  <div class="member-introduction">
    <div class="title">
      <h1>成员介绍</h1>
      <span>Member Introduction</span>
    </div>
    <el-row class="member" :gutter="24">
      <el-col
        :lg="8"
        :md="12"
        :sm="24"
        :xs="24"
        class="member-item"
        v-for="(item, index) in member"
        :key="index"
      >
        <div class="member-item_content">
          <!--  -->
          <div
            class="top"
            style="padding: 30px 0; color: white"
            :style="{
              background: item.backgroundUrl ? `url(${item.backgroundUrl})` : 'rgb(29, 53, 84)',
              'background-position': '0%',
              'background-repeat': 'no-repeat',
              'background-size': 'cover',
              object: 'fill',
            }"
          >
            <div class="avatar-img">
              <el-avatar :src="item.avatarUrl"></el-avatar>
            </div>
            <h2 class="content-title">
              {{ item.memberName }}
              <small style="font-size: 15px">
                {{ item.positionName ? item.positionName : '成员' }}</small
              >
            </h2>
            <p style="margin: 0">{{ item.year }}</p>
          </div>
          <div class="bottom" style="padding: 15px">
            <div class="experience">
              <div class="text-ellipsis">
                <div v-for="(children, key) of item.experienceMap" :key="key">
                  {{ children }}
                </div>
              </div>
              <div v-if="item.experienceMap.length === 0">Ta暂时还没有什么经历</div>
            </div>
            <el-divider v-if="item.experienceMap.length !== 0 || item.description"></el-divider>
            <div class="description">
              <div style="text-align: left" class="text-ellipsis">
                {{ item.description }}
              </div>
              <div v-if="item.experienceMap.length !== 0 && !item.description">
                Ta暂时没啥想说的
              </div>
            </div>
            <span class="introduction_footer">SOFTWARE ASSOCIATION</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { searchMemberExperienceByYear } from '@/api/member/experience'
import { getBackgroundById } from '@/api/background'
export default {
  data() {
    return {
      member: [],
    }
  },
  mounted() {
    this.setMemberExperience()
  },
  methods: {
    async setMemberExperience() {
      const currentDate = new Date()
      let yearOne = currentDate.getFullYear() - 3
      let yearTwo = currentDate.getFullYear() - 2
      if (currentDate.getMonth() >= 8) {
        yearOne++
        yearTwo++
      }
      this.searchMemberExperienceByYear(yearOne)
      this.searchMemberExperienceByYear(yearTwo)
    },
    async searchMemberExperienceByYear(year) {
      const data = await searchMemberExperienceByYear(year)
      if (data.code === 200) {
        this.member = this.member.concat(data.data.records)
      }
    },
    async setBack(id) {
      if (id !== null) {
        const data = await getBackgroundById(id)
        if (data.code === 200) {
          return data.data.url
        } else return ''
      } else return null
    },
  },
}
</script>

<style lang="scss">
.member-introduction {
  font-family: 'YAC1IYcrX24 0';

  .title {
    text-align: center;
    margin: 15px 0;
    h1 {
      margin-bottom: 0px;
    }
  }

  .member {
    .member-item {
      display: inline-block;
      padding: 0 50px;
      height: 500px;
      list-style: none;
      vertical-align: top;
      box-sizing: border-box;

      .member-item_content {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 480px;
        text-align: center;
        border-radius: 5px;
        box-sizing: border-box;
        border: 1px solid #e0e0e0;
        .avatar-img {
          position: relative;
          width: 30%;
          height: 0;
          padding-bottom: 30%;
          max-width: 150px;
          max-height: 150px;
          border-radius: 50%;
          box-shadow: 0 0 15px 1px rgb(44, 42, 42);
          display: inline-block;
          box-sizing: border-box;
          overflow: hidden;
          img {
            position: absolute;
            top: 0;
            left: 0;
          }
        }

        .content-title {
          margin: 5px 0;
          font-weight: 500;
        }

        .introduction_footer {
          position: absolute;
          left: 0;
          bottom: 10px;
          width: 100%;
          font-size: 13px;
          background: white;
        }
      }
      .top,
      .bottom {
        height: 40%;
        transition: all 0.5s;
        font-size: 14px;
      }
      .member-item_content:hover .top {
        height: 20%;
      }
      .member-item_content:hover .bottom {
        height: 80%;
      }
      .member-item_content:hover .text-ellipsis {
        overflow: auto;
      }
      .bottom {
        .experience {
          height: 29%;
          transition: all 0.3s;
        }
        .description {
          height: 40%;
          transition: all 0.3s;
        }
        .experience:hover {
          height: 100%;
        }
        .experience:hover + .description {
          height: 0;
        }
      }
    }
    .el-tooltip__popper {
      max-width: 500px;
    }
    .el-divider--horizontal {
      margin: 10px !important;
    }
  }
}
</style>
