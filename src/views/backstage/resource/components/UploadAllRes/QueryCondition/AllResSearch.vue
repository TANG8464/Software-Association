<template>
  <div class="allRes_search">
    <input
      id="searchInput"
      class="search-input"
      v-model="searchContent"
      placeholder="请输入文件名"
      style="transition: all 1s;"
      :style="{width:searchInputWidth+'px',padding:'0 '+searchInputPadding+'px'}"
    />
    <span @click="search()">
      <icon id="icon-search" name="search" scale="23" width="23"></icon>
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchContent: '', //查询内容
      searchInputWidth: 0, //查询框宽度
      searchInputPadding: 0, //查询框的内边距
      isOpenInput: false,
    }
  },
  // beforeMounted() {
  //   //当滚动或点击其他地方时不显示MoreMenu
  //   document.body.onclick = (e) => {
  //     let id = e.target.id
  //     if (id !== 'icon-search' && id !== 'searchInput') this.inputInit() //当非搜索图标和搜索框点击时，将搜索框隐藏
  //   }
  // },
  methods: {
    // inputInit() {
    //   if (this.isOpenInput) {
    //     this.searchInputWidth = 0
    //     this.searchInputPadding = 0
    //     this.isOpenInput = false
    //   }
    // },
    search() {
      //点击查询按钮
      if (!this.isOpenInput) {
        this.searchInputWidth = 200
        this.searchInputPadding = 15
        this.isOpenInput = true
      } else this.$emit('setSearchContent', this.searchContent)
    },
  },
}
</script>
<style scoped>
.allRes_search {
  display: inline;
}
/*
设置搜索框图标，加入旋转摆动动态效果
*/
.icon-search {
  animation: slide 1s infinite;
  margin: 0 5px;
}
.icon-search:hover {
  animation: none;
}
@keyframes slide {
  0% {
    transform: rotate(10deg);
  }
  10% {
    transform: rotate(-10deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  40% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(10deg);
  }
}
</style>
<style>
.search-input {
  border: none;
  border-radius: 0px;
  padding: 0;
  box-sizing: content-box;
  border-bottom: 1px solid #333333;
  outline: none;
  line-height: 30px;
}
</style>