import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        isExit: false,
        activeUserInfo: null,
        activeUserRole:null,//当前用户角色 router
        resize: null, //窗口大小属性
        breadcrumb: null, //面包屑导航
        avatar: false, //是否修改头像
        changeImg: false, //上传头像后是否更改头像位置大小
        redrawImgFile: {}, //重绘上传的图片文件
        myInfo: false,
        isChangeNav: false,
        isChangeBack: false, //是否更换背景
        isOpenMsg: false, //是否打开消息通知
        isOpenToTop: false, //notice 是否回到顶部
        isReachBottom: false,
        noticeTitle: '',
        isSearchNotice: false,
        currentTitle: '', //当前查看详情的公告
        carouselSort:[]
    },
    mutations: { //同步变更
        setActiveUserInfo: (state, userInfo) => {
            state.activeUserInfo = userInfo
        },
        setActiveUserRole:(state, userRole)=>{
            state.activeUserRole = userRole
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
        },
        changeNav: (state, flag) => {
            state.isChangeNav = flag
        },
        changeBack: (state, flag) => {
            state.isChangeBack = flag
        },
        changeMsg: (state, flag) => {
            state.isOpenMsg = flag
        },
        changeOpenToTop: (state, flag) => {
            state.isOpenToTop = flag
        },
        changeReachBottom: (state, flag) => {
            state.isReachBottom = flag
        },
        setNoticeTitle: (state, title) => {
            state.noticeTitle = title
        },
        changeSearchNotice: (state, flag) => {
            state.isSearchNotice = flag
        },
        setCurrentTitle: (state, title) => {
            state.currentTitle = title
        },
        setCarouselSort:(state, arr)=>{
            state.carouselSort = arr
        },
        exit: (state, flag) => {
            state.isExit = flag
        },
    },
    actions: { //异步变更
    }
})
export default store