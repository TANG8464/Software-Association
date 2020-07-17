import Vue from 'vue'
import VueRouter from 'vue-router'

import loginRouter from './modules/login'
import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'



Vue.use(VueRouter)

const routes = [
    loginRouter, siaeRouter, backRouter
]

const router = new VueRouter({
    routes
})

export default router