import Vue from 'vue'
import VueRouter from 'vue-router'

import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'
import oauthRouter from './modules/oauth'
import errorRouter from './modules/error'
import store from '@/store'
import {
    getActiveUserRole
} from '@/api/active-user'
import token from '@/utils/token'


Vue.use(VueRouter)

const routes = [siaeRouter, backRouter, oauthRouter, errorRouter, {
    path: '*', // 页面不存在的情况下会跳到404页面
    redirect: '/error/404',
    name: 'notFound',
    hidden: true
}]

const router = new VueRouter({
    // mode: 'history',
    routes
})
const setRole = async () => {
    const roles = store.state.activeUserRole
    if (!roles || roles[0].roleName === 'visitor' && token.getHeaderToken()) {
        const activeUserRole = await getActiveUserRole()
        if (activeUserRole.length === 0) activeUserRole.push({ roleName: 'visitor' })
        store.commit('setActiveUserRole', activeUserRole)
    }
}
router.beforeEach(async (to, from, next) => {
    await setRole()
    const roles = store.state.activeUserRole
    let flag = false
    if (to.meta.roles) {
        await roles.forEach(item => {
            if (item.roleId == -1 || to.meta.roles.includes(item.roleName)) flag = true
            // console.log(item, to);
        })
    } else flag = true
    console.log(flag,to);

    if (flag) next() //放行
    else next({ path: "/error/401", query: { prev: to.fullPath } }) //跳到401页面
})

export default router