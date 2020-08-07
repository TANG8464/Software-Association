import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        activeUserInfo: null,
        resize: null, //窗口大小属性
        breadcrumb: null, //面包屑导航

        avatar: false, //是否修改头像
        changeImg: false, //上传头像后是否更改头像位置大小
        redrawImgFile: {}, //重绘上传的图片文件

        myInfo: false
    },
    mutations: { //同步变更
        setActiveUserInfo: (state, userInfo) => {
            state.activeUserInfo = userInfo
        },
        setBreadcrumb: (state, arr) => {
            state.breadcrumb = arr
        },
        setResize: (state, resize) => {
            state.resize = resize
        },
        changeAvatar: (state, flag) => {
            state.avatar = flag
        },
        changeImg: (state, flag) => {
            state.changeImg = flag
        },
        setRedrawImgFile: (state, file) => {
            state.redrawImgFile = file
        },
        changeMyInfo: (state, myInfo) => {
            state.myInfo = myInfo
        }

    },
    actions: { //异步变更
    }
})
export default store