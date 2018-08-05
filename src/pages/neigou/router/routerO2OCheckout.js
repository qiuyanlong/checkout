import config from '@/config/config'

const O2Ocheckout=resolve=> require(['../view/O2Ocheckout/O2Ocheckout'],resolve)
const O2OcheckoutVoucher=resolve=> require(['../view/O2Ocheckout/O2OcheckoutVoucher'],resolve)


export default [
    {
        path: config.neigouFallbackPath+'O2Ocheckout.html',
        name: 'O2Ocheckout',
        component: O2Ocheckout,
        meta: {
                title: '结算购物车'
              }
    },
    {
      path: config.neigouFallbackPath+'o2ocheckoutVoucher.html',
      name: 'O2OcheckoutVoucher',
      component: O2OcheckoutVoucher,
      meta: {
                title: '优惠券'
            }
    }

]

