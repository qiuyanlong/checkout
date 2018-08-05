
import * as types from '../maps/mutation-types'

export default{
    [types.UPDATE_IDEBTITY_INFO](state,ojson){
        let data=ojson['res'];
        for(let key in data.cart_info){
            if(data.cart_info[key]===null){
                data.cart_info[key]=''
            }
        }
        state.identity = data;
        state.identity_save_info=false;
    },

	// 更新 某一个state属性
   [types.UPDATE_ATTRIBUTE](state,ojson){
         state[ojson.type] = ojson['res'];
   },
   
   // 更新地址列表  
   [types.GET_ADDRESS_LIST](state,data){
       state.address_list = data
   },

   [types.GOODS_LISTS](state,data){
        state.goodsList = data
   },

    // 自提列表更新 当前默认选准序号
   [types.ZITI_INDEX_UPDATE](state,index){
        state.is_ziti.default_index = index
   },
   
   // 自提标识 
   [types.ZITI_INDEX_BLOB](state,blob){
        state.is_ziti.blob = blob
   },

   // 自提地址
   [types.ZITI_INDEX_ADDRESS](state,addr){
        state.is_ziti.new_ziti_addr_list = addr
   },
  
}

