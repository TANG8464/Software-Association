import 'echarts/lib/chart/bar';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

import 'froala-editor/js/languages/zh_cn.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import Velocity from 'velocity-animate';
import Vue from 'vue';
import cookies from 'vue-cookies';
import ECharts from 'vue-echarts';
import VueFroala from 'vue-froala-wysiwyg';
import App from './App.vue';
import http from './http'; //此处问http文件的路径
import router from './router';
import './tools/dialogDrag.js';
Vue.use(cookies)
Vue.use(ElementUI)
Vue.use(VueFroala)
Vue.prototype.$axios = http;

Vue.prototype.$http = http
Vue.component('chart', ECharts)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')