
import config from '@/config/config'

const index = resolve => require(['../view/cart/index'],resolve)
const voucher = resolve => require(['../view/cart/voucher'],resolve)
const piece = resolve => require(['../view/cart/piece'],resolve)

export default [
    {
      path: config.neigouFallbackPath+'cart.html',
      name: 'CartIndex',
      component: index,
      meta: {
          title: '购物车'
      }
    },
    {
      path: config.neigouFallbackPath+'cartVoucher.html',
      name: 'CartVoucher',
      component: voucher,
      meta: {
          title: '选择优惠券'
      }
    },
    {
      path: config.neigouFallbackPath+'cartPiece.html',
      name: 'CartPiece',
      component: piece,
      meta: {
          title: '优惠促销'
      }
    },
]