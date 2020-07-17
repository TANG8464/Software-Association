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
    <svg
      t="1594031132851"
      class="icon search-icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3285"
      width="23"
      height="23"
      id="search-icon"
      @click="search()"
    >
      <path
        d="M216.8 781.3C55.7 620.2 55.7 358 216.8 196.9s423.2-161.1 584.3 0 161.1 423.2 0 584.3-423.2 161.2-584.3 0.1z m530.9-530.9c-131.6-131.6-345.7-131.6-477.4 0-131.6 131.6-131.6 345.7 0 477.3 131.6 131.6 345.7 131.6 477.3 0 131.7-131.5 131.7-345.7 0.1-477.3z"
        fill="#686868"
        p-id="3286"
      />
      <path
        d="M890.2 947.9c-9.6 0-19.2-3.6-26.5-10.9L741.2 816.5c-14.9-14.7-15.1-38.6-0.4-53.5 14.7-14.9 38.6-15.1 53.5-0.4l122.5 120.5c14.9 14.7 15.1 38.6 0.4 53.5-7.5 7.5-17.2 11.3-27 11.3z"
        fill="#686868"
        p-id="3287"
      />
      <path
        d="M487.4 275.6c-7.1-7.1-11.3-16.9-11.1-27.7 0.6-20.9 17.9-37.4 38.8-36.8 72.9 1.9 141.5 31.4 193.1 83 14.8 14.8 14.8 38.7 0 53.5-14.8 14.8-38.7 14.8-53.5 0-37.8-37.8-88.1-59.5-141.6-60.8-10.1-0.4-19.1-4.6-25.7-11.2zM723.9 484.2c-5.5-5.5-9.4-12.8-10.6-21.1-1.5-10.2-3.9-20.5-7-30.5-6.2-20 4.9-41.2 24.9-47.4 20-6.2 41.2 4.9 47.4 24.9 4.3 13.7 7.5 27.7 9.6 41.7 3.1 20.6-11.1 39.9-31.7 43-12.5 1.9-24.4-2.4-32.6-10.6z"
        fill="#2BA8FC"
        p-id="3288"
      />
    </svg>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchContent: "", //查询内容
      searchInputWidth: 0, //查询框宽度
      searchInputPadding: 0, //查询框的内边距
      isOpenInput: false
    };
  },
  methods: {
    inputInit() {
      if (this.isOpenInput) {
        this.searchInputWidth = 0;
        this.searchInputPadding = 0;
        this.isOpenInput = false;
      }
    },
    search() {
      //点击查询按钮
      console.log(this.searchInputWidth);
      if (!this.isOpenInput) {
        this.searchInputWidth = 200;
        this.searchInputPadding = 15;
        this.isOpenInput = true;
      }else 
      this.$emit("setSearchContent", this.searchContent);
    }
  }
};
</script>
<style scoped>
.allRes_search {
  display: inline;
}
/*
设置搜索框图标，加入旋转摆动动态效果
*/
.search-icon {
  animation: slide 1s infinite;
  position: relative;
  top: 5px;
  margin: 0 5px;
}
.search-icon:hover {
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