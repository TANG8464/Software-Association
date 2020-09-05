<template>
  <div class="tag-page">
    <ul class="tags">
      <li
        class="tag-item"
        :data-active="index===active"
        v-for="(item,index) in list"
        :key="item.id"
        @click="tagClick(item.id,index)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      active: 0,
    }
  },
  methods: {
    tagClick(id, index) {
      this.active = index
      this.$emit('tagClick', id)
    },
  },
}
</script>
<style>
.tags {
  margin: 5px 0;
  overflow: auto;
  white-space: nowrap;
  text-align: center;
}
.tag-page {
  z-index: 9999;
  border-bottom: 1px solid #e0e0e0;
}
.tag-page .tag-item {
  display: inline-block;
  margin: 0 5px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
}
.tag-page li {
  transition: all 0.1s;
  min-width: 45px;
}
.tag-page li:hover {
  font-size: 18px;
}
.tag-page li[data-active] {
  font-size: 20px;
}
</style>