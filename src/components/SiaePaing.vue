<template>
  <div class="siae-paing" v-if="pages>0">
    <ul class="paing">
      <li
        class="paing-item"
        v-show="arr.includes(index)"
        v-for="index in pages"
        :key="index"
        :data-active="index===currentPage"
        @click="btnClick(index)"
      >{{index>=10?index:'0'+index}}</li>
      <li class="paing-item">/{{ pages>=10?pages:'0'+pages}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    btnCount: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      arr: [],
    }
  },
  computed: {
    pages() {
      return this.total > 0 && this.pageSize > 0 ? Math.ceil(this.total / this.pageSize) : 0
    },
  },
  watch: {
    pages() {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (!this.pages) return
      if (this.pages >= this.btnCount) {
        this.arr = [1, 2, 3]
      } else {
        for (let i = 1; i <= this.pages; i++) {
          this.arr.push(i)
        }
      }
    },
    btnClick(index) {
      console.log(index)
      if (this.pages > 3 && index < this.pages && index >= this.btnCount - 1) {
        this.arr = [index - 1, index, index + 1]
      }
      this.$emit('pageChange', index)
    },
  },
}
</script>
<style>
.siae-paing .paing {
  text-align: center;
}
.siae-paing .paing-item {
  display: inline-block;
  margin: 5px;
  font-size: 22px;
  cursor: pointer;
  user-select: none;
}
.siae-paing li[data-active] {
  border-bottom: 1px solid rgba(41, 42, 52, 0.82);
  padding: 5px;
  width: 28px;
  height: 28px;
}
</style>