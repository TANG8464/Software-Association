<template>
  <div class="notice-details">
    <h2>{{notice.title}}</h2>
    <p class="author" v-if="notice.member">
      <span>
        <img
          :src="notice.member.avatarUrl"
          height="30px"
          width="30px"
          style="border-radius:50%"
          alt
        />
      </span>
      <span>{{notice.member.memberName}}</span>
    </p>
    <p class="tip">
      <span>
        <icon name="time" scale="14" width="14"></icon>
        {{notice.deplDate|dataFormatter}}
      </span>
      <span>
        <icon name="footer" scale="15" width="15"></icon>
        {{notice.count}}
      </span>
    </p>
    <div class="content" style="min-height:150px;font-size:18px" v-html="notice.content"></div>
    <div class="tag">
      <notice-tag :tag="notice.label"></notice-tag>
    </div>
  </div>
</template>
<script>
import { dataFormatter } from '@/filters'
import NoticeTag from '@/components/NoticeTag'
export default {
  props: {
    notice: { type: Object, require: true },
  },
  components: { NoticeTag },
  mounted() {
    console.log(this.notice)
  },
  filters: { dataFormatter },
}
</script>
<style>
.notice-details {
  padding: 20px 0;
  font-size: 20px;
  padding-bottom: 40px;
}
.notice-details .author {
  display: flex;
  align-items: center;
  font-size: 16px;
}
.notice-details .author span {
  margin: 0 5px;
}
.notice-details .tip {
  font-size: 14px;
}
.notice-details .tip span {
  margin: 0 5px;
}
.notice-details .el-tag {
  margin: 0 3px;
}
.notice-details .content img {
  width: 100%!important;
}
.notice-details .fr-img-wrap {
  text-align: center;
  display: inline-block;
}
.notice-details .fr-inner {
  display: inline;
}
</style>