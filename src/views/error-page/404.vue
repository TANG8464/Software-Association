<template>
  <div class="error_404">
    <!-- <h2 style="color: black">
      <icon name="cry" scale="100" width="100"></icon>
    </h2> -->
    <!-- <p class="color-gray">非常抱歉，您访问的页面不存在</p> -->
    <div style="width: 100%;">
      <!-- <icon name='404' scale='100' width='300'></icon> -->
      <img :src="require('@/assets/img/404.png')" alt="" style="height: 550px" />
      <icon name="spaceman" scale="100" width="100"></icon>
    </div>
  </div>
</template>

<style>
.error_404 {
  width: 80%;
  margin: auto;
  text-align: center;
}
</style>
