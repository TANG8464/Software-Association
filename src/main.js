import '@/styles/index.css';
import http from '@/utils/request'; //此处问http文件的路径
import 'echarts/lib/chart/bar';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/languages/zh_cn.js';
import jQuery from 'jquery';
import Velocity from 'velocity-animate';
import Vue from 'vue';
import cookies from 'vue-cookies';
import ECharts from 'vue-echarts';
import VueFroala from 'vue-froala-wysiwyg';
import SlideVerify from 'vue-monoplasty-slide-verify';
import Icon from 'vue2-svg-icon/Icon';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';
import './directive/dialogDrag.js';
import SiaeInput from '@/components/SiaeInput'


Vue.use(SlideVerify);
Vue.component('icon', Icon);
Vue.component('siae-input', SiaeInput);
window.jQuery = jQuery
window.$ = jQuery
Vue.use(Vuex)
Vue.use(cookies)
Vue.use(ElementUI)
Vue.use(VueFroala)
    // Vue.use(Velocity)
Vue.prototype.$axios = http;

Vue.prototype.$http = http
Vue.component('chart', ECharts)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')