<template>
  <div class="notice-tag">
    <icon name="label" scale="20" width="20"></icon>
    <span v-for="(item,index) in tag" :key="index">{{item}}</span>
  </div>
</template>
<script>
export default {
  props: {
    tag: {
      type: Array,
      require: true,
    },
  },
}
</script>
<style>
.notice-tag {
  border-bottom: 1px solid #e0e0e0;
}
.notice-tag span {
  font-size: 16px;
  margin: 0 5px;
}
.notice-tag span:hover{
    color: #333333;
}
</style>