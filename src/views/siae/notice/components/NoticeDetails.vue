<template>
  <div class="notice-details">
    <h3>{{notice.title}}</h3>
    <p class="tip">
      <span v-if="notice.member">{{notice.member.memberName}}</span>
      <span>{{notice.deplDate}}</span>
    </p>
    <div v-html="notice.content"></div>
    <el-tag size="small" v-for="(item,index) in notice.label" :key="index">{{item}}</el-tag>
  </div>
</template>
<script>
export default {
  props: {
    notice: { type: Object, require: true },
  },
  mounted() {
    console.log(this.notice)
  },
}
</script>
<style>
.notice-details {
  padding: 20px 0;
}
.notice-details .tip {
  color: #666666;
  font-size: 13px;
}
.notice-details .tip span {
  margin: 0 5px;
}
.notice-details .el-tag {
  margin: 0 3px;
}
</style>