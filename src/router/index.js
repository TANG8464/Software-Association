import Vue from 'vue'
import VueRouter from 'vue-router'

import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'

Vue.use(VueRouter)

const routes = [siaeRouter, backRouter]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router