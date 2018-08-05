export default {
   
   // 获取商品列表
   get_product_list(state){
     return state.product_list
   },

   // 获取 地址列表
   address_list(state){
      return state.address_list
   },

   // 身份认证信息
   get_identity(state){
     return state.identity
   },
   get_identity_save_info(state){
        return state.identity_save_info;
    },
   get_isajaxdone(state){
     return state.isajaxdone
   },
   // 获取当前选择的地址
   get_now_address(state,index){
      return index && state.address_list[index]
   }, 

   // 获取默认的 index
   get_now_address_index(state){
      return state.get_now_address_index

   },
   
   // 获取key
   get_key(state){
   	 return state.key
   },

  
   // 检查是否使用积分
   get_check_point(state){
      return state.check_point
   },

 

   // 获取商品列表
   get_goods_list(state){
      return state.goodsList
   },

   get_goods_group(state){
     return state.goodsGroups
   },

   get_is_over_sea(state){
       return state.is_over_sea
   },


   get_ziti_list(state){
     return state.is_ziti
   },
   
   get_ziti_default_address(state){
     return state.ziti_default_address
   },


   // 每日优鲜
   get_has_mryx_goods(state){
     return state.has_mryx_goods
   },

   // 积分支付
   get_is_use_jifen(state){
     return state.is_use_jifen
   },

   get_jifen_switch(state){
     return state.jifen_switch
   },


   get_now_store_address(state){
     return state.now_store_address
   },
   

   // 获取每一家店铺的备注信息
   get_beizhu(state){

    let beizhu = state.beizhu
     return beizhu
   },

   get_mryx_selct(state){
      return state.mryx_selct
   },

   // 全局的选择券
   get_cartallvouchlist(state){
     return state.cartallvouchlist
   },
   
   // 是ras
   get_is_rsa(state){
     return state.is_rsa
   },

   get_sub_identity(state){
     return state.sub_identity
   },

   get_isVerify(state){
        return state.is_verify
    },
   get_secondDayComingTo(state){
     return state.secondDayComingTo
   }

}











