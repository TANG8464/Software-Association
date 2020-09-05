import Vue from 'vue'
import axios from 'axios';
import router from '@/router';
import ElementUI from 'element-ui';
import cookies from 'vue-cookies'
import token from '@/utils/token'
// axios 配置
const request = axios.create({
    baseURL: 'http://120.26.177.203/',
    timeout: 100000
})

// http request 拦截器
request.interceptors.request.use(config => {
        const headerToken = token.getHeaderToken()
        if (headerToken) { //判断token是否存在
            config.headers['HEADER-TOKEN'] = headerToken; //将token设置成请求头
            // config.headers.X_XSRF_TOKEN = this.$cookies.get('XSRF-TOKEN'); //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
let i = 0;
// // http response 拦截器
request.interceptors.response.use(
    response => {
        const headerToken = token.getHeaderToken()
        const currentRoute = router.currentRoute.fullPath.split('?')[0]
        if (i < 1 && !headerToken && currentRoute === '/Backstage') {
            ElementUI.Notification({
                title: "错误",
                message: "身份已过期请重新登录",
                type: "error",
                duration: 1000,
                showClose: false
            });
            setTimeout(() => {
                router.replace({
                    path: '/login',
                    query: { redirect: router.currentRoute.fullPath }
                })
            }, 1000)
            i++
        }
        return response;
    },
    error => {
        if (i < 1) {
            let status = null;
            let message = null
            if (!window.navigator.onLine) {
                message = "服务器连接失败，请检查网络设置"
            } else if (error.response != undefined) {
                const err = {
                    401: '权限不足',
                    5011: '身份已过期请重新登录',
                    404: '找不到啊~',
                    500: '服务器内部错误',
                }
                status = error.response.data.status
                if (err.hasOwnProperty(status)) {
                    message = err[status];
                } else {
                    message = error.response.data.message;
                }
            } else {
                message = "服务器访问错误，请稍后...";
            }
            ElementUI.Notification({
                title: "错误",
                message,
                type: "error",
                duration: 1000,
                showClose: false
            });
            if (status === 5011) {
                token.removeHeaderToken()
                setTimeout(() => {
                    router.replace({
                        path: '/',
                        query: { redirect: router.currentRoute.fullPath }
                    })
                }, 1000)
            }
            i++;
            return Promise.reject(error);
        }
    }
);
export default request;