<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import resizeMixin from '@/layouts/windowResize'
export default {
  name: 'App',
  mixins: [resizeMixin]
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.component-enter,
.component-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
/* v-enter-active 入场动画时间段 */
/* v-leave-active 离场动画时间段 */

.component-enter-active,
.component-leave-active {
  transition: all 0.3s ease;
}
span:hover,
h2:hover,
svg:hover,
img:hover {
  cursor: pointer;
}
</style>
