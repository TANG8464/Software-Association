<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import resizeMixin from '@/layouts/windowResize'
import { addMonitorWebsite } from '@/api/monitor'
export default {
  name: 'App',
  mixins: [resizeMixin],
  created() {
    addMonitorWebsite()
  },
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

span:hover,
h2:hover,
svg:hover,
img:hover {
  cursor: pointer;
}
</style>
