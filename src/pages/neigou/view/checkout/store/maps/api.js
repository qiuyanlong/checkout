
import config from '@/config/config' 

const storeDomain = `${config.store_api_domain}/mallApi`

export default {

	// 获取地址列表接口
	GET_ADDRESS:`${storeDomain}/NewCart/Address/getMemberAddress`,

    // old 商品列表 更新地址 ！！暂停用！！
    TOTAL_GOODS:`${config.store_api_domain}/mallApi/Cart/Total/total`,

    // 内购券 打折券 
    VOUCHER: `${config.store_api_domain}/mallApi/Cart/Total/voucher`,  

    // checkout页面拉去接口
    PRODUCT_LIST: `${config.store_api_domain}/mallApi/NewCart/Checkout/orderConfirmation`,

    // 券选择页面下确认券是否可用接口
    VOUCHER_CAN_USER: `${config.store_api_domain}/mallApi/NewCart/CartApi/useShopVoucherPolymerize`,

    // 提交订单 NewCart/Order/createOrder
    SUBMIT_ORDER:`${config.store_api_domain}/mallApi/NewCart/Order/createOrder`,

    // 是否需要身份正信息 
    IDENTITY_CARD:`${config.store_api_domain}/mallApi/NewCart/Checkout/getVerifyLevel`,

    // 加密提交接口  
    RSA_ENCODY_PRO:`${config.store_api_domain}/mallApi/NewCart/Order/rsaCreateOrder`,

}


