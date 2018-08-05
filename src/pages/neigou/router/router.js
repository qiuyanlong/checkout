/*
 * @Author: HW.Liang
 * @Date: 2018-05-30 13:36:51
 * @Last Modified by: HW.Liang
 * @Last Modified time: 2018-07-16 22:30:06
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import config from '@/config/config'
import Checkout from './routerCheckout'
import Welfare from './routerWelfare'
import Cart from './routerCart'
import O2Ocheckout from './routerO2OCheckout'
Vue.use(VueRouter)
export default new VueRouter({
    mode: 'history',
    routes: [
        ...Cart,
        ...Checkout,
        ...Welfare,
        ...O2Ocheckout
    ]

})

