import Vue from 'vue'
import Vuex from 'vuex'
import checkout from '../view/checkout/store'
import cart from '../view/cart/store'
import O2Ocheckout from '../view/O2Ocheckout/store/store'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        checkout,
        cart,
        O2Ocheckout,
    }
})