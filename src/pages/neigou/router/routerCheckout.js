import config from '@/config/config'

const Checkout=resolve=> require(['../view/checkout/checkout'],resolve)
const Identity=resolve=> require(['../view/checkout/subgroup/Identity'],resolve)
const Jfsetting=resolve=> require(['../view/checkout/subgroup/jfsetting'],resolve)
const CheckoutVoucher=resolve=> require(['../view/checkout/subgroup/SlectVoucher'],resolve)
const Usershopscomments=resolve=> require(['../view/checkout/subgroup/Remarks'],resolve)

export default [

    {
        path: config.neigouFallbackPath+'checkout.html',
        name: 'checkout',
        component: Checkout,
        meta: {
                title: '结算购物车'
              }
    },
    {
        path: config.neigouFallbackPath+'identity.html',
        name: 'identity',
        component: Identity,
        meta: {
                title: '海外购身份认证'
              }
    },
    {
      path: config.neigouFallbackPath+'jfsetting.html',
      name: 'jfsetting',
      component: Jfsetting,
    },

    {
      path: config.neigouFallbackPath+'checkoutVoucher.html',
      name: 'checkoutvoucher',
      component: CheckoutVoucher,
      meta: {
                title: '优惠券'
            }
    },
    {
      path: config.neigouFallbackPath+'shopmarks.html',
      name: 'Usershopscomments',
      component: Usershopscomments,
      meta: {
                title: '商品店铺备注'
            }
    }

]

