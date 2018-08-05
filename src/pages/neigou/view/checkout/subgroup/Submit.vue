<template>
 <!-- 提交订单 -->
	   <div class="submit_now flex flex-pack-justify fff flex-align-center">
	   	   <div class="truly_money">
	   	   	  <p class="heji_money">合计实付：<span class="blue_c">{{totalPice}} 元</span>
                <span class="meiri_youxian red" v-if="get_has_mryx_goods" >含生鲜须6分钟内支付</span>
	   	   	  </p>
              <!--  {{total_point|formatePoint}}{{get_is_use_jifen.channel.point_name?get_is_use_jifen.channel.point_name:'积分'}} -->
	   	   	  <p class="zhifu_jifen" v-if="isshowjifen" >{{get_is_use_jifen.channel.point_name}}支付：<span>{{total_point}}</span>{{get_is_use_jifen.channel.point_name}}</p>
  
	   	   </div>
	   	   <a class="sub_btn" @click.stop="submitOrderlist">提交订单</a>

           <!-- 下单错误商品没有库存的弹窗 -->
    			<van-popup  v-model="isnot_enouth_pro" class="myjifenTips">
    				<h1 class="jifenTips-title"><br><small>当前收货地址以下商品库存不足</small></h1>
              <ul class="submit-stock-null">
              	<li class="flex flex-align-center"  v-for="pro in substrStockGoodsList">
              		<img :src="pro.image" :alt="pro.shop_name" >
              		<div class="pro_text">
              			  <p>{{pro.product_name}}</p>
              		    <p class="nums">x{{pro.quantity}}</p>
              		</div>
              	</li>
              </ul>
             <div class="flex flex-pack-center">
                <p class="jifenTips-know" @click="goCart">返回购物车</p>
             </div>
    			</van-popup>

             <!-- 积分支付密码 -->
		     <jifenpay ref="jifenpay" @getMM="getJifenMimaCreateOrder"></jifenpay>	

           <!-- 嘉宝渠道支付密码 -->
         <van-popup v-model="jiabaoqudao"  :overlay="true">
           <div class="otherCompas">
                <div class="jiabaocontent">
                   <h1>支付密码</h1>
                   <input type="password"  required   class="jiabaoinput"  v-model="disanfangPass" placeholder="请输入支付密码" />
                   <p>
                     <input type="button" value="提交" class="jiabaosubmit" @click.stop="DisanfangSubmit"/>
                   </p>
              </div>
               <span class="closeBtn" @click.stop="jiabaoqudao=false"></span>
           </div>
        </van-popup>

	   </div>	
</template>

<script>
  import { Popup } from 'vant';
	import { Dialog } from 'vant'
	import { Toast } from 'vant'
	import RSA from '../RSA/'
  import { Base64 } from 'js-base64'
	import config from '@/config/config' 
	import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
	import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  import jifenpay from '@/pages/neigou/components/jifenpay.vue'

	export default{
		name: 'Submit',
		components:{
			jifenpay
		},
		data(){  
			return {
				meiri_youxian:false,
				totalPice:0,
				isnot_enouth_pro:false,
        jiabaoqudao:false,
				substrStockGoodsList:[],
        disanfangPass:'',
        total_point_discount:0,
        total_point:0
			}
		},
		computed:{
		   ...mapGetters([
          'get_goods_group',
          'address_list',
		   	  'get_key', 
		   	  'get_now_address_index', 
		   	  'get_check_point', // 是否使用积分 1:使用  0:不
		   	  'get_is_use_jifen', // 积分
		   	  'get_jifen_switch',
		   	  'get_has_mryx_goods',
		   	  'get_is_over_sea',
          'get_secondDayComingTo',
		   	  'get_identity',
          'get_sub_identity',
		   	  'get_mryx_selct',
		   	  'get_beizhu',        // 备注的内容store
		   	  'get_cartallvouchlist', // 券列表
                 'get_is_rsa',  // 加密
                 'get_isVerify'

		   ]),
		   nowaddlist(){
		   	 return this.address_list[this.get_now_address_index]
		   },
		   // 是否是采用积分支付
		   isshowjifen(){
           if(this.get_is_use_jifen.bswitch){
               return this.get_jifen_switch == 1?true:false
           }else{
              return false
           }
        },

		},
    filters:{
        // 格式化内狗币的金额 只能是整数
       formatePoint(p){ return p&&parseFloat(p) },
    },
		methods:{
			...mapActions([
		        'total_quest',      //
		        'get_address_list', // 地址列表映射
		        'toggleAddress',    // 地址切换 货物列表映射
		        'submitOrder',
		        'rsasubmitOrder'    // 加密提交接口
		      ]),
      // 页面格式化店铺备注的格式
      formateMomo(arr){
         let momo = {}
         arr.forEach((item,index)=>{
           momo[item.id] = item.val
         })
         return momo
      },
	    getJifenMimaCreateOrder(mima){
           if(!mima) return
           let infos = this.subactiondoing(mima)	
           this.subtotal(infos)
      },
      DisanfangSubmit(){
         let mima = this.disanfangPass
         if(!mima) return
         let infos = this.subactiondoing(mima) 
         this.subtotal(infos)
      },
      goCart(){
           //this.$router.push({path:'v2/neigou/cart.html'}) 
           if(config.env == 'dev'){
              window.location.href='cart.html'
          }else{
              window.location.href='/m/v2/cart.html'
          }
      },
        // 提交动作里面的方法
      subactiondoing(mima){
          let Vm = this
           // 基础信息
           let subInfo = {
           	  sign:Vm.get_key,
           	  cartType:Vm.get_is_over_sea?1:2,  // 海外购是1 国内支付是2
           	  addressArr:Vm.nowaddlist,
           	  memo:Vm.formateMomo(Vm.get_beizhu),
           }

               Object.assign(subInfo,this.get_cartallvouchlist) 

              // 积分支付信息
               if(this.isshowjifen){
               	  // 开启了 或者默认开启了 
               	  let needpoint = this.get_is_use_jifen.use_point.deductible_point,
			          haspoint = this.get_is_use_jifen.point.point,
			          point,
			          channel = this.get_is_use_jifen.channel.channel||''

			        if(needpoint>haspoint){
			             point = haspoint
			        }else if(needpoint<haspoint){
			            point = needpoint
			        }else{
			            // 相等 一样 随便取一个 
			             point = needpoint
			        }


               	 let jifen  = {
	               	  checked_point:this.get_is_use_jifen.bswitch,
	               	  point_number:point,
	               	  point_channel:channel
	               }
	               Object.assign(subInfo,jifen)
               }else{
               	     let jifen  = {
	               	  checked_point:0,
	               	  point_number:0,
	               	  point_channel:''
	               }
	               Object.assign(subInfo,jifen)
               }


              // 每日优鲜信息
              if(this.get_has_mryx_goods){
                   if(this.get_secondDayComingTo){
                      // 次日达
                      Object.assign(subInfo,{
                          dispatching_type:1,
                          has_mryx:1
                      })
                   }else{
                      // 正常的每日优鲜
                      if(Object.keys(this.get_mryx_selct).length === 0 ){  
                            // 用户没有勾选每日优鲜的时间，默认就是两小时送的
                           let mryx = {
                                   has_mryx:Vm.get_has_mryx_goods,
                                   mryx_day:'this_day',
                                   mryx_start_time:0,
                                   mryx_end_time:0,
                               }

                           Object.assign(subInfo,mryx) 

                        }else{

                           Object.assign(subInfo,this.get_mryx_selct)
                        }  
                   }
               }
               

             // 海外购 身份信息填写  isset_paypwd  
                if(this.get_isVerify&&this.get_identity.verify_level>0){

              	  // 如果是海外支付
                    subInfo.id_card_info=this.get_identity.cart_info;
                    subInfo.verify_level=this.get_identity.verify_level;

              }
              
              // 如果采用的是密码支付方式，将密码也拼接进去
              if(mima){
                    subInfo['point_password'] = mima
              }
                
                // 最后导出的是一份参数配置 下单
                return subInfo
	        },

	        subtotal(subInfo){
                  // 加密使用 
                  // 
                if(this.get_isVerify&&this.get_identity.verify_level>0){
                    if(!subInfo.id_card_info.id_card_no){
                        Toast('请填写海关信息')
                        return false;
                    }
                }

              this.$pageLoading.show()
	             if(this.get_is_rsa){
	                let v2_data = RSA.encryptLong(Base64.encode(JSON.stringify(subInfo)))
	                this.rsasubmitOrder({infodata:v2_data,fn:(res)=>{
	                	  if(!res.data.errno){
	                		 window.location.replace(res.data.body.redirect)
	                		}else{
                               
                               if(res.data.errno == 20037){
		               	    		     // 开启密码支付的
                                 
                                    this.$refs.jifenpay.showError(res.data.errorInfo)
	                		         }

		               	     // 20003  本地验证库存不足  20004 本地验证限时限购 20040  下单异常 
                          else if(res.data.errno == 20040||res.data.errno == 20003|| res.data.errno == 20004 ){
                                    // 没有库存
                                    this.substrStockGoodsList = res.data.body

                                     if(!this.substrStockGoodsList.length){ 
                                         // 如果库存不足的时候，没有返回商品的数量信息，那就报错误
                                         res.data.error&&Toast(res.data.error)
                                    }else{
                                         this.isnot_enouth_pro = true
                                    }


                          } // 海外购身份信息没有确认
                          else if( res.data.errno == 20034){
                               this.Toast(res.data.error)
                          }
		               	    	else{
                                     // 其他券弹窗
		               	    		 Toast(res.data.error)
		               	    	}
	                		  
	                		}

	                	   this.$pageLoading.hide()	
	                }})

	              }else{
	              	  // 正常提交
	              	  this.submitOrder({infodata:subInfo, fn:(res)=>{ 
		               	    // 下单成功的回调
		               	    if(!res.data.errno){
		                       window.location.replace(res.data.body.redirect)
		               	    }else{
		               	    	
		               	    	if(res.data.errno == 20037){
		               	    		 // 开启密码支付的
                                  this.$refs.jifenpay.showError(res.data.errorInfo)
	                		    }

                         // 20003  本地验证库存不足  20004 本地验证限时限购 20040  下单异常 
                          else if(res.data.errno == 20040||res.data.errno == 20003|| res.data.errno == 20004 ){
                                    // 没有库存
                                    
                                    this.substrStockGoodsList = res.data.body

                                    if(!this.substrStockGoodsList.length){ 
                                        // 如果库存不足的时候，没有返回商品的数量信息，那就报错误
                                        res.data.error&&Toast(res.data.error)
                                    }else{
                                        this.isnot_enouth_pro = true
                                    }
                                    

                          } // 海外购身份信息没有确认
                          else if( res.data.errno == 20034){
                               Toast(res.data.error)
                          }  
				                  
                          else{
                                     // 其他券弹窗
		               	    		 Toast(res.data.error)
		               	    	}
		               	    }

		               	    this.$pageLoading.hide()
		               }})
	              }
	        },
            // 提交订单动作
			submitOrderlist(){
               
             
              // 监测当前公司是否开启了积分  首先检查在开启的情况下 用户需要设置密码  
              // 排除不能使用积分兑换的商品
              
              if(this.get_jifen_switch&&this.total_point_discount>0){

             	  // // 当如果使用的是积分支付,就验证是否开启了支付密码
             	 if(this.get_is_use_jifen.paypwd == 1){  
                     
                      // 开启了第三方公司的支付功能，这样子的公司不会设置密码，只能是输入密码 
                    if(this.get_is_use_jifen.paypwd_type == 1){
                         
                         this.jiabaoqudao = true
                        // 三方
                     }else{
                       // 不是第三方，但是开启了密码设置跟输入密码的功能
                       if(this.get_is_use_jifen.isset_paypwd != 1 ){
                           // 用户没有设置自己的密码 
                           this.$refs.jifenpay.showNotPay()    
                       }else{
                            // 用户已经设置了密码 秘密支付弹窗 直接输入密码
                            this.$refs.jifenpay.showPay()
                       }
                       
                    }

             	  }else{
               
                     let infos = this.subactiondoing()
                     this.subtotal(infos)
                }


             }else{ 
                    let infos = this.subactiondoing()
                    this.subtotal(infos)
             }

            
             
		}
	},
		watch:{
			get_goods_group(v){
              let total_amount = v.body.payable_cash
              this.totalPice = total_amount >=0 ? total_amount :0
              this.total_point = v.body.total_point
              this.total_point_discount = v.body.total_point_discount


			}
		},
		mounted(){
            
		}

	}
</script>

<style lang="scss">

.flex{
    /* 设置弹性布局 */
    display:-webkit-box; 
    display:-webkit-flex;
    display:-ms-flexbox; 
    display:flex;        
}
.flex-1{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:1;
    -webkit-flex:1;    
    -ms-flex:1;        
    flex:1;          
}
.flex-2{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:2;
    -webkit-flex:2;    
    -ms-flex:2;        
    flex:2;          
}
.flex-pack-center{
    /* 水平布局下的子元素 水平居中 */
    -webkit-box-pack: center;          
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center
}
.flex-align-center{
    -webkit-box-align: center;/* android 2.1-3.0, ios 3.2-4.3 */
    -webkit-align-items: center;/* Chrome 21+ */
    -ms-flex-align: center;/* WP IE 10 */
    align-items: center;/* android 4.4 */
}
.flex-pack-justify{
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}

/* 布局相关函数定义rem大小*/
@function pxm($px) {
  @return ( ($px / 75) * 1 ) +rem;
}
.myjifenTips{
	padding: pxm(25);
}
.jifenTips-know {
    display: block;
    border-top: 1px solid #dddddd;
    height: 1.33333rem;
    line-height: 1.33333rem;
    font-size: 0.42667rem;
    letter-spacing: 0.01333rem;
    text-align: center;
    background: #45bcff;
    color:#fff;
    width:86%;
    border-radius: pxm(10);
}
.submit-stock-null {
    font-size: 0.37333rem;
    color: #44bbff;
    margin: 0 auto 0.4rem;
    display: block;
    text-align: center;
    width: 8rem;
    max-height: 6rem;
    overflow-y: auto;
}
.submit-stock-null li {
    line-height: 0.53333rem;
    padding: 0.26667rem 0;

    img{
    	border:1px solid #f3f3f3;
    	width: pxm(126);
    	height: pxm(126);
    	vertical-align: middle;
    	margin-right: pxm(24);
    }
    .nums{
    	color:#ccc;
    }
    .pro_text{
    	text-align: left;
    }
}
.jifenTips-title {

    font-size: pxm(35);
    color: #333;
    letter-spacing: 0.01333rem;
    line-height: 1.5;
    text-align: center;
    font-weight: bold;
}


</style>










