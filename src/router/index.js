import Vue from 'vue'
import VueRouter from 'vue-router'


import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'
import oauthRouter from './modules/oauth'

Vue.use(VueRouter)

const routes = [siaeRouter, backRouter, oauthRouter]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router