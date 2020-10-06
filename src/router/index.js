import Vue from 'vue'
import VueRouter from 'vue-router'


import siaeRouter from './modules/siae'
import backRouter from './modules/backstage'
import oauthRouter from './modules/oauth'
import errorRouter from './modules/error'

Vue.use(VueRouter)

const routes = [siaeRouter, backRouter, oauthRouter, errorRouter]

const router = new VueRouter({
    // mode: 'history',
    routes
})

export default router