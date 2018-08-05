<!-- 

    checkout.html 整体页面注释：包括主要参数和业务
    @time: 2018.6 
  
    a:Address 模块cart 跟checkout使用同一个组件，组件内部会处理cart的部分业务
    b:OverSea 海外购警示模块  身份上传引导模块
    c:meiri-youxian 每日优鲜信息引导模块 
    d:Prolist 结算商品列表
    e:PlatVoucher 积分模块
    f:clearing-info 所有结算信息展示模块
    g:submit  提交模块
    e:Identity 身份认证模块
-->
<template>

<div class="checkout"> 
 
   <!-- 海关信息 -->
   <template v-if="get_isVerify&&get_identity.verify_level>0">
       <div class="warning_info flex" >
	       <span></span>
	       <p>温馨提示：为保障顺利清关，收货地址使用的收货人姓名、身份证号请与付款人真实信息保持一致</p>
	    </div>
       <!-- <div class="warning_info flex">
            <p class="notices">据海关要求，为了确保您的商品能顺利清关，请填写真实有效的身份证信息。</p>
            <div class="warning dis">
                <p><span class="w"></span>您的身份证信息将加密保管，我们保证信息安全，绝不对外泄露。身份证信息需要与收货人一致方可发货，谢谢您的配合。若信息有误，将导致入境物品不能清关，您将承担相应风险。</p>
            </div>
        </div> -->
    </template>
 	 <!--  地址 -->
   <Address @selectFn="selectFn"></Address>
  
   <!-- 海外购验证信息展示 -->
    <OverSea   ></OverSea> 
   <!-- 每日优鲜模块展示 -->
   <meiri-youxian v-if="hasx"></meiri-youxian>

   <!-- 商品列表模块 -->
   <Prolist ></Prolist> 
 
   <!-- 积分模块 -->
   <PlatVoucher></PlatVoucher> 

   <!-- 结算信息模块展示 -->
   <clearing-info></clearing-info>

   <!-- 提交 -->
   <submit></submit>

 </div>

</template>

<script>

	import OverSea from './subgroup/OverSea'
  import MeiriYouxian from './subgroup/MeiriYouxian'
  import Address from '@/pages/neigou/components/Address'
  import Prolist from './subgroup/Prolist'
  import Identity from './subgroup/Identity'
  import PlatVoucher from './subgroup/PlatVoucher'
  import ClearingInfo from './subgroup/ClearingInfo'
  import Submit from './subgroup/Submit'
  import { Toast } from 'vant'
  import config from '@/config/config'
  import util from '@/api/util'  
  import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
	


	export default{
		name: 'checkout',
		components:{
           OverSea,
           MeiriYouxian, 
           Address,
           Prolist,
           PlatVoucher,
           ClearingInfo,
           Submit
		},
		data(){
			return{
        is_over_sea:false,
        controlzitiswitch:false,
			}
		},
    
    computed:{
       ...mapGetters([
          'get_isVerify',
          'get_now_address_index',
          'get_key', 
          'get_now_store_address',
          'address_list',
          'get_secondDayComingTo',
          'get_isajaxdone',
          'get_check_point', // 是否使用积分 1:使用  0:不
          'get_point_number', // 积分
          'get_is_over_sea',  // 海外购
          'get_has_mryx_goods', // 每日优鲜
          'get_identity',       // 海外购身份认证信息
          'get_sub_identity',   // 身份认证
          'get_beizhu',
          'get_mryx_selct',
          'get_is_use_jifen',
          'get_voucheList',
          'get_jifen_switch',
          'get_cartallvouchlist',
          'get_ziti_list',
          'get_ziti_default_address',
          'get_identity_save_info'

       ]),
       nowlist(){  
         return this.address_list[this.get_now_address_index]  
      },
      // 每日优鲜动态切换
      hasx(){
       let res = false
        if(this.get_has_mryx_goods){
            if(this.get_secondDayComingTo){
                 res = false
            }else{
                res= true
            }
        }else{
             res = false
        }
        return res
     }
 
    },
    
    methods:{

     ...mapActions([
      'updateKey',
      'prolist',
      'OverIdentity',
      'mryx_updateIndex',
      'cartvoucher',  // 拿到传递券 存贮到本地store的方法
      'set_ziti_default_address'
      ]), 

     selectFn(el,address,index,type){
      
       this.prolist({el:this,ind:index,fn:()=>{
           this.mryx_updateIndex(index)
       }})
       
       if(this.get_ziti_list.is_ziti){
           this.set_ziti_default_address(address)
       } 
     },

    },
    watch:{
       "get_isajaxdone":{
          handler(v){
                if(v){
                 // 页面初始化
                   // cart 页面通过本地存贮传递过来的券
                    let sessionVoucherstring = util.get_infomation('validSelectedVoucherList'),sessionVoucher
                    if(sessionVoucherstring){
                        sessionVoucher = JSON.parse(sessionVoucherstring)||{voucher:{},dutyfree:{},freeshipping:{}}
                    }else{
                        sessionVoucher = {voucher:{},dutyfree:{},freeshipping:{}}
                    }
                    

                        // 页面初始化的标识 hasInit 存在就标识页面已经初始化过一次了
                        // 不管cart有没有传递券数据 更新state {type:'',id:'',val:,status:false,allupdate:''}  
                    if(!util.get_infomation('hasInit')){
                        // 如果已经将cart的券信息存贮过了，那么一就不再进来了 
                        this.cartvoucher({type:'',id:'',val:'',status:true,allupdate:sessionVoucher})
                        setTimeout(()=>{
                            let path = window.location.pathname  
                            if(path.indexOf('checkout.html')!=-1){
                                util.set_infomation('hasInit',true) 
                            }
                            
                        },500)

                        util.set_infomation('hasInit',true)
                    }
                    this.prolist({el:this,ind:this.get_now_address_index,fn:()=>{
                        if(this.get_isVerify&&this.get_isVerify>0){
                            if(this.get_identity_save_info){
                                this.OverIdentity({
                                    sign: this.get_key||this.$route.query.key, 
                                    addressArr:this.nowlist
                                })
                            }
                        } 
                    }
                })
               
                
                
             }
          },
          immediate:true
       },
       get_ziti_default_address(v){
           if(v&&!this.controlzitiswitch){
              this.prolist({el:this,type:'init',addr:v,fn:()=>{
                  this.controlzitiswitch = true
              }})
           }
          
       }
    },
    created(){
      this.updateKey(this.$route.query.key)
    }
}
</script>
<style lang="scss">
 @import './css/checkout_mixin.scss';
</style>

















