import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        breadcrumb: null,
        resize: {},
        sortData: {},
        avatar: false
    },
    mutations: { //同步变更
        setBreadcrumb: (state, arr) => {
            state.breadcrumb = arr
        },
        setResize: (state, resize) => {
            state.resize = resize
        },
        setSortData: (state, sortData) => {
            state.sortData = sortData
        },
        changeAvatar: (state, avatar) => {
            state.avatar = avatar
        }
    },
    actions: { //异步变更
    }
})
export default store