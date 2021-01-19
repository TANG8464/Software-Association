<template>
  <div class="contact-us">
    <div class="contact-us-content">
      <h2>联系方式</h2>
      <p>协会会长：</p>
      <el-row :gutter="24" class="contact-us-list">
        <el-col :span="10" class="contact-us-item" v-for="(item, index) in contact" :key="index">
          <el-col :span="6">
            <h2>{{ item.name }}</h2>
            <span>{{ item.tel }}</span>
          </el-col>
          <el-col :span="18">
            <el-row :gutter="24">
              <el-col :span="24">
                <img :src="require(`@/assets/img/contact-us/${item.name}/qq.jpg`)" alt="" />
                <img :src="require(`@/assets/img/contact-us/${item.name}/wechat.jpg`)" alt="" />
              </el-col>
            </el-row>
          </el-col>
        </el-col>
      </el-row>
      <p style="font-size: 16px">网站负责人：</p>
      <p>唐巧云 QQ 1784998369 Tel 17346985215</p>
      <p>向鹏 QQ 2317537731</p>
      <p>郭银波 QQ 1430615892</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contact: [
        {
          name: '王玉娟',
          tel: '17670005744',
        },
        {
          name: '何萧',
          tel: '17608484616',
        },
        {
          name: '王澳龙',
          tel: '17700742745',
        },
        {
          name: '毛钱',
          tel: '15907938794',
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.contact-us {
  .contact-us-list {
    list-style: none;

    .contact-us-item {
      vertical-align: top;
      display: inline-block;
      padding: 30px 10px;
      margin: 5px 3px;
      border: 1px dotted #999999;
      border-radius: 5px;

      img {
        display: inline-block;
        width: 50%;
        height: 50%;
      }

      .col {
        display: inline-block;
        box-sizing: border-box;
      }

      .col-4 {
        width: 40%;
      }

      .col-6 {
        width: 60%;
      }
    }
  }
}
</style>
