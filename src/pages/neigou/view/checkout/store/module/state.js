import util from '@/api/util'
export default {

     // 1.地址列表 
    address_list:[],  

     // ajax地址列表 数据填充 异步 会看到多余的判断 标志位开关
    isajaxdone:false,     

    // 2. 获取当前选准的列的index
    get_now_address_index:0,  

     // 3.key
	key:'',     
 
	 // 7.是否使用积分 1:使用  0:不    
	check_point:1, 


	// 9.商品列表
	product_list:[],

    //10. 是否是海外购  默认是普通的商品
    is_over_sea:false,

    // 商品列表
    goodsList:{},




    // 商品列表所有返回值集合
    goodsGroups:{},

    has_mryx_goods:0,  // 是否存在每日优鲜的产品 0: 不存在 1：存在

     // 是否使用积分支付  使用积分 默认是0 积分信息 info
    is_use_jifen:{
        point:{
            point:0
        },
        channel:{
            channel:''
        },
        paypwd:0,
        isset_paypwd:0,
        use_point:{},
        bswitch:0,
    },

    jifen_switch:1,  // 开关 0 关闭
    
    // checkout 页面已经选择的券列表
    // voucher_list:{},

    is_ziti:{},
    // 当前选准的额默认地址
    ziti_default_address:{},

    // 当前选准的地址的字段
    now_store_address:{},

    // 身份认证信息
    identity:{ 
        "verify_level": 1, 
        "cart_info": { 
            "id_card_name": '', 
            "id_card_no": '', 
            "id_card_zhengmian_image_url": '', 
            "id_card_zhengmian_image_id": '', 
            "id_card_fanmian_image_url": '', 
            "id_card_fanmian_image_id": ''
        } 
    },
    identity_save_info:true,
     // 提交的认证信息
    sub_identity:{},
    
    // 以下是为了提交准备的存贮、
    
    // 每一家店铺的备注信息   [] state
    beizhu:[],

    // 提交的每日优鲜的所有状态 
    mryx_selct:{},

    secondDayComingTo:0, // 是否支持次日达

    // 所有的券列表
    cartallvouchlist:{
       voucher:{},
       freeshipping:{},
       dutyfree:{} 
    },

    is_rsa:0,
    iskola:false,
    is_verify:false,

}














