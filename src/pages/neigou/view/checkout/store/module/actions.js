
import Vue from 'vue'
import * as types from '../maps/mutation-types'
import api from '../maps/api'
import { Toast } from 'vant'
import util from '@/api/util'  
import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
import config from '@/config/config'





/**
 * [description]
 * @param  {[type]} from         [m pc]
 * @param  {[type]} errorcode    [错误码]
 * @param  {[type]} isneedToCart [是否需要返回到cart]
 */
const errorActionFn = (from,isneedToCart)=>{
     let env = config.env
     if(isneedToCart&&env == 'dev'){
         
         setTimeout(()=>{  
             window.location.href = '/neigou/cart.html'
         },500)
     }

     if(isneedToCart&&env != 'dev'){

         if(from == 'm'){
             setTimeout(()=>{
                window.location.href = '/m/v2/cart.html'
             },500)
         }else{
            setTimeout(()=>{
                window.location.href  = '/v2/cart.html'
             },500)
         }
        
     }

}



export default {

  // 获取地址列表 初始化
   get_address_list({state,commit}){
      // 参数 from_vue 只是标识
      /*
           errno: 
            0  成功标识
            10001 没有登录，跳转url 登录超时,请重新登录
            50010 超出下单时间
            50011 预约配送时间已失效 
      */
     
     // cart页面使用的 如果在用户选完券以后，会自动触发地址接口请求的列表，因此在这里判断如果是这种情况，就不让在请求接口
     let path = window.location.pathname  // this丢失  指向的是store /neigou/checkout.html  
     if(path.indexOf('cart.html')!=-1 || path.indexOf('checkout.html')!=-1){
       if(state.now_store_address.addr_id) return
     }

     // 发起地址列表的请求
      httpPost(api.GET_ADDRESS,{"from_vue":1})
         .then((s)=>{
            
          if(!s.data.errno){

                commit(types.GET_ADDRESS_LIST,s.data.body)
                commit(types.UPDATE_ATTRIBUTE,{type:'isajaxdone',res:true})
               
               // 在这里更新now_index的初始值
               let addressslist = s.data.body
               if(addressslist && Object.prototype.toString.call(addressslist) === "[object Array]" ){
                  addressslist.forEach((item,index)=>{
                     for(var attr in item){
                         if(item['def_addr']){
                           commit(types.UPDATE_ATTRIBUTE,{type:'get_now_address_index',res:index})
                           
                           commit(types.UPDATE_ATTRIBUTE,{type:'now_store_address',res:item})
                        }
                     }
                  })
               }else{
                          commit(types.UPDATE_ATTRIBUTE,{type:'get_now_address_index',res:0})
               }
           
        }
            
   }) 
}, 


    // checkout 页面获取商品列表 
  prolist({commit,state,getters},data){
     
    let urls = api.PRODUCT_LIST,  
        nindex = data.ind||0,
        Vm = data.el,
        type = data.type;

        Vm.$pageLoading.show()


    /* 
      type: 来源标识

     normal  
     shengxain:控制器开关->youxian_address_list    仅仅是针对 cart页面而言
     ziti: 自提地址标识
     init : 初始化 
     */
    

    let point = 9999999999,channel = ''


   let myaddr = {
       sign: state.get_key||Vm.$route.query.key||data.key,
       checked_point:state.jifen_switch,    // 默认开关是打开的
       point_number:point, 
       point_channel:channel,        
       addressArr: state.is_ziti.is_ziti?state.ziti_default_address: state.address_list[data.ind],
    }



    Object.assign(myaddr,state.cartallvouchlist)
    
    //console.log('-----------前端调试使用券参数',state.cartallvouchlist) 
    //console.log('-----------前端调试初始化参数-调试使用',myaddr)

    httpPost(api.PRODUCT_LIST,myaddr) //data.data
      .then((respon)=>{

         if(!respon.data.errno){ // == 0是成功 

             Vm.$pageLoading.hide()


             commit(types.UPDATE_ATTRIBUTE,{type:'product_list',res:respon.data.body.type_list})
            
             // 每日优鲜  has_mryx_goods
             commit(types.UPDATE_ATTRIBUTE,{type:'has_mryx_goods',res:respon.data.body.extend_data.mryx_info.has_mryx})

             // 是否支持次日达 
             commit(types.UPDATE_ATTRIBUTE,{type:'secondDayComingTo',res:respon.data.body.extend_data.mryx_info.dispatching_type}) 
             
             // 店铺信息  用户券信息更新等 
             commit(types.UPDATE_ATTRIBUTE,{type:'goodsGroups',res:respon.data})

             // 自提
             commit(types.UPDATE_ATTRIBUTE,{type:'is_ziti',res:respon.data.body.extend_data.ziti})

            
             // 是否使用积分支付 
             let extend_datas = respon.data.body.extend_data.point,
                 jifen_switch = extend_datas.point_switch,
                 member_point = extend_datas.member_point,  // 当前用户的积分
                 cur_channel = extend_datas.cur_channel,
                 use_point = extend_datas.use_point,
                 paypwd =  extend_datas.paypwd,
                 isset_paypwd = extend_datas.isset_paypwd,
                 paypwd_type =  extend_datas.paypwd_type
           

              commit(types.UPDATE_ATTRIBUTE,{type:'is_use_jifen',res:{paypwd_type:paypwd_type,isset_paypwd:isset_paypwd,point:member_point,channel:cur_channel,paypwd:paypwd,use_point:use_point,bswitch:jifen_switch}})
               // 海外购
              commit(types.UPDATE_ATTRIBUTE,{type:'is_over_sea',res:respon.data.body.type_list[0].type_id==1?true:false})
             
               // 订单加密标识
              commit(types.UPDATE_ATTRIBUTE,{type:'is_rsa',res:respon.data.body.extend_data.is_rsa}) 

              // 考拉商品
             commit(types.UPDATE_ATTRIBUTE,{type:'is_verify',res:respon.data.body.extend_data.is_verify})

              

             // 初始化回调 
             data.fn&&data.fn(respon)
              
         }else{
            
            Toast(respon.data.error)
            errorActionFn('m',true) 

            Vm.$pageLoading.hide()
         }


      })
      .catch((e)=>{
         console.log('错误',e)
      })
    },

    // 积分开关更新
    jifen_switch({commit},bfalse){
       commit(types.UPDATE_ATTRIBUTE,{type:'jifen_switch',res:bfalse})
    },


    // cart 页面 每日优鲜地址编辑 更新序号 index
    mryx_updateIndex({commit},nindex){
       commit(types.UPDATE_ATTRIBUTE,{type:'get_now_address_index',res:nindex})
    },

   
    // 海外购是否进行了身份认证 
    OverIdentity({commit,state},ideninfo){
       httpPost(api.IDENTITY_CARD,ideninfo)
       .then((res)=>{
            if(!res.data.errno){
                commit(types.UPDATE_IDEBTITY_INFO,{type:'identity',res:res.data.body})

            }else{
              Toast(res.data.error)
              return
            }
       })
    },

    updateIdentity_info({commit},data){ 
      commit(types.UPDATE_ATTRIBUTE,{type:'identity',res:data})
    },
    // 下单支付
    submitOrder({commit},data){
        httpPost(api.SUBMIT_ORDER,data.infodata)
        .then((res)=>{
            data.fn&&data.fn(res)
        }) 
    },

    // 加密订单下单接口 
    rsasubmitOrder({commit},data){
       httpPost(api.RSA_ENCODY_PRO,{data:data.infodata})
        .then((res)=>{
            data.fn&&data.fn(res)
        }) 
    },

    beizhufn({state,commit},info){ //{id:1,val:''}
   
       let remarkable = state.beizhu,
            copys = remarkable

            if(copys.length){  
              for(var i=0; i<copys.length; i++){
                 if(info.id == copys[i].id ){
                    copys.splice(i,1,)
                    break
                 }
             }
            } 



           copys.push({'id':info.id,'val':info.val})
           commit(types.UPDATE_ATTRIBUTE,{type:'beizhu',res:copys})
    },
    // 每日优鲜的选择时间数据
    mryx_selct({commit},data){
        commit(types.UPDATE_ATTRIBUTE,{type:'mryx_selct',res:data})
    },


    // 更新传递券 
    cartvoucher({state,commit},data){ 

       // {type:'voucher',id:'162',val:'NUADA12AS',status:false,allupdate:{}}     
       
       // 添加状态 如果存在 就直接更新类似 { v:{},f:{},...}类似的对象到state里面
       // 一般用在初始化  cart页面传递数据过来的时候 用所有数据填写整个state
       // 
       if(data.status){
          commit(types.UPDATE_ATTRIBUTE,{type:'cartallvouchlist',res:data.allupdate}) 

        }else{

        // 拷贝一份原来的数据，操作玩直接进行赋值，不要操作原数据
        let copyVouch = state.cartallvouchlist
        

        // 先查询在不在，不在就添加 在就删除   
        for(let attr in copyVouch){
            
            if(attr == data.type){
               
               // 有可能本来就没有选券，一直未空
               if(!Object.keys(copyVouch[attr]).length){
                   copyVouch[attr][data.id] = [data.val]
                   
               }else{

                  for(let id in copyVouch[attr]){
                     //id 121
                    
                     if(id == data.id){
                       // 存在就删除 但是全平台券就需要比较一下 value值是否一样 因为key全部都是 ‘all’

                        if(copyVouch[attr][id][0] == data.val){
                            
                          delete copyVouch[attr][id]

                        }else{
                           // 否则就只是券信息的切换 还是添加
                           copyVouch[attr][data.id] = [data.val]
                        }
                      
                         break
                     }else{
                        // 不存在就添加
                        copyVouch[attr][data.id] = [data.val]
                        break
                     }
                }
              }

            }
        }
      
       commit(types.UPDATE_ATTRIBUTE,{type:'cartallvouchlist',res:copyVouch}) 
    }   

  },

  updateKey({commit},key){
    commit(types.UPDATE_ATTRIBUTE,{type:'key',res:key})
  },

  set_ziti_default_address({commit},addr){
     commit(types.UPDATE_ATTRIBUTE,{type:'ziti_default_address',res:addr})
  }
}






// if(respon.data.errno == 20025){
//    Toast(respon.data.error)
//    // 该错误一般是由于key失效引发的，所以需要跳到cart页面
  
//   setTimeout(()=>{
//      Vm.$router.push({path:'/neigou/cart.html'}) 
//   },1000)

// }else if( respon.data.errno ==20027){  
//     // 商品价格结算错误
    
//     Toast(respon.data.error)

//     setTimeout(()=>{
//        Vm.$router.push({path:'/neigou/cart.html'}) 
//      },1000)

// }else if (respon.data.errno ==20003) {
//      Toast(respon.data.error)
//      setTimeout(()=>{
//        Vm.$router.push({path:'/neigou/cart.html'}) 
//      },1000)
// }










