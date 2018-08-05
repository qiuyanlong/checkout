/*
 * @Author: HW.Liang 
 * @Date: 2018-06-04 18:54:39 
 * @Last Modified by:   HW.Liang 
 * @Last Modified time: 2018-06-04 18:54:39 
 */
let pageLoading = {}
import  './pageLoading.scss'
pageLoading.installed = false
pageLoading.install = function (Vue) {
    if (pageLoading.installed) return
    Vue.prototype.$pageLoading = {}
    Vue.prototype.$pageLoading.show = () => { 
        if (document.querySelector('#pageLoading')) return
        let LoadingTip = Vue.extend({
            template: `<transition>
                <div id="pageLoading">
                    <van-loading class="has-loading-bg" color="white" />
                </div>
            </transition>`
        })
        let tpl = new LoadingTip().$mount().$el
        document.body.appendChild(tpl)
        document.querySelector('#pageLoading').addEventListener('touchmove', function (e) {
            e.stopPropagation()
            e.preventDefault()
        })
        pageLoading.installed = true
    }
    Vue.prototype.$pageLoading.hide = () => {
        //let tpl = document.querySelector('#pageLoading')
        // changed @by qiuyanlong for reason maybe has many tbl apply
        // but you had deleted this child
        // so can threw a error pm:
        let tpl = document.getElementById('pageLoading')
        if(tpl){
            document.body.removeChild(tpl) 
        }
       
    }
}
export default pageLoading