import Vue from 'vue'
import store from './store/store'

import App from './index.vue'
import router from './router/router'
import config from '@/config/config'

import './assets/css/base.scss';
import './assets/css/vant/index.scss'
import './assets/js/flexible.js'

import fundebug from '@/api/debug.js'

import Vant from 'vant'
import { Upload} from 'iview'

//loading
import loading from './components/loading'
import pageLading from '@/pages/neigou/components/pageLoading/pageLoading.js';
Vue.use(pageLading);

Vue.use(Vant);
Vue.component('Upload', Upload)
Vue.component('loading', loading)


Vue.config.errorHandler = fundebug;

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
