import Vue from 'vue'
import VueRouter from 'vue-router'

import loginRouter from './modules/login'
import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'
import personalCenterRouter from './modules/personalCenter'

Vue.use(VueRouter)

const routes = [
    loginRouter, siaeRouter, backRouter, personalCenterRouter
]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router