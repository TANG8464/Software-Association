import Vue from 'vue'
import axios from 'axios';
import router from './router';
import ElementUI from 'element-ui';
import cookies from 'vue-cookies'
// axios 配置
axios.defaults.timeout = 8000;
axios.defaults.baseURL = 'http://120.26.177.203/';
// // http request 拦截器
axios.interceptors.request.use(config => {
        let token = localStorage.getItem('HEADER_TOKEN')
        if (token) { //判断token是否存在
            config.headers['HEADER-TOKEN'] = token; //将token设置成请求头
            // config.headers.X_XSRF_TOKEN = this.$cookies.get('XSRF-TOKEN'); //将token设置成请求头
        }
        return config;
    },
    err => {
        console.log(err);
        return Promise.reject(err);
    }
);
let i = 0;
// // http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (i < 1) {
            if (error.response != undefined) {
                const err = {
                    401: '权限不足',
                    5011: '身份已过期请重新登录',
                    404: '找不到啊~',
                    500: '服务器连接失败，请检查网络设置',
                }
                let message = null;
                let status = error.response.data.status;
                if (err.hasOwnProperty(status)) {
                    message = err[status];
                } else {
                    message = error.response.data.message;
                }
                ElementUI.Notification({
                    title: "错误",
                    message: message,
                    type: "error",
                    duration: 1000,
                    showClose: false
                });
                if (status === 5011) {
                    cookies.remove("activeUser");
                    window.localStorage.removeItem("HEADER_TOKEN")
                    setTimeout(() => {
                        router.replace({
                            path: '/',
                            query: { redirect: router.currentRoute.fullPath }
                        })
                    }, 1000)
                }
            } else {
                ElementUI.Notification({
                    title: "网络错误",
                    message: "服务器连接失败，请检查网络设置",
                    type: "error",
                    duration: 5000,
                    showClose: true
                });
                // return Promise.reject("服务器连接失败");
            }
            i++;

        }

    }
);
export default axios;