<template>
  <div class="error">
    <router-view></router-view>
    <p class="link">
      <span class="color-gray">您可以尝试访问以下页面：</span>
      <span class="link-item" @click="$router.push('/homepage')">首页</span>
      <span class="link-item" @click="$router.push('/notice')">协会公告</span>
      <span class="link-item" @click="$router.push('/account/login')">登录</span>
      <span class="link-item" @click="$router.push('/account/register')">注册</span>
    </p>
    <p class="link">
      <span class="color-gray"
        >或者
        <el-link type="primary" @click="$router.push('/homepage-last/contact-us')"
          >联系我们</el-link
        >
      </span>
    </p>
  </div>
</template>
<script>
export default {
  destroyed(){
      this.$router.push(this.$route.query.prev)
  }
}
</script>
<style lang="scss">
.error {
  padding: 50px 0;
  /*
    background-color: rgba(33, 34, 42, 1);
    */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;

  /*
    color: white;
    */
  .link {
    font-size: 14px;
    color: #b9b9b9;

    .link-item {
      display: inline-block;
      margin: 0 5px;
    }

    .link-item:hover {
      color: #999999;
      border-bottom: 1px solid #999999;
    }
  }
}
</style>
