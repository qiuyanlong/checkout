
import config from '@/config/config'

const Welfarebespeak=resolve=> require(['../view/welfare/welfarebespeak'],resolve)
const Welfareposters=resolve=> require(['../view/welfare/welfareposters'],resolve)
const Welfarepostersgo=resolve=> require(['../view/welfare/welfarepostersgo'],resolve)
const Welfarevoucher=resolve=> require(['../view/welfare/welfarevoucher'],resolve)


export default [
    {
      path: config.neigouFallbackPath+'welfarebespeak.html',
      name: 'welfarebespeak',
      component: Welfarebespeak,
      meta: {
        title: '福利券预约'
      }
    },
    {
      path: config.neigouFallbackPath+'welfareposters.html',
      name: 'welfareposters',
      component: Welfareposters,
      meta: {
        title: '生产海报'
      }
    },
    {
      path: config.neigouFallbackPath+'welfarepostersgo.html',
      name: 'welfarepostersgo',
      component: Welfarepostersgo,
      meta: {
        title: '生产海报'
      }
    },
    {
      path: config.neigouFallbackPath+'welfarevoucher.html',
      name: 'welfarevoucher',
      component: Welfarevoucher,
      meta: {
        title: '福利券中心'
      }
    },

]
