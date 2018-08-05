<template>
<div class="sholist ">
  <!-- 具体支付方式：国内支付 还是国外支付 大循环 -->
  <div  v-for="(shop,key) in myprolist" :key="key">
	 <div  class="shopping_types fff">
	       <h1 class="where">{{shop.shop_name}}</h1>
			<div class="box flex" v-for="(goods,index) in shop.product_list" :key="index">
				<a :href="productUrl(goods.product_id)"> 
				   <img v-if="goods" :src="goods.image" @error="errorImg" :alt="goods.product_name"> 
				 </a>  
				<div class="pro_info">
				  <a :href="productUrl(goods.product_id)">   
				     <p class="info ">{{goods.product_name}}</p>
				   </a>  
				 <!--  <p >
				  	   尺码：
				  	   <span class="xs">XS</span> 
				  	   <span class="help"></span> 
				  </p> -->
				  <p class="size flex flex-align-center" v-if="goods.spec_info">{{goods.spec_info}}</p>
				  <div class="flex flex-pack-justify">			  	 
				  	 <div class="flex">
				  	 	 <span class="price">￥{{goods.price.price|toFloat}}</span>
				  	     <span class="fax" v-if="goods.taxfees.cost_tax>0">税费:￥{{goods.taxfees.cost_tax}}</span>
				  	 </div>
		            <span class="nums">x {{goods.quantity}}</span>

				  </div>
				</div>
			
			</div> 
        	<!-- 优惠券 -->
			<div class="neigou_q fff" v-if="voucherCanU(shop)>0">
				<div class="can_use_num flex flex-pack-justify">
					<span class="quan_text">优惠券</span>
					<p class="flex flex-pack-center">

						<a @click="turnVoucher(shop)" class="flex flex-pack-center"> 
							<template v-if="hasSeletcVoucheNumber(shop)>0">已选<span class="nums">{{hasSeletcVoucheNumber(shop)}}</span>张</template>
							<template v-else>
								<template v-if="voucherCanU(shop)>0"><span class="nums">{{voucherCanU(shop)}}</span>张可用</template>
							</template> 
							<a class="right_arrow margin-left_x" ></a>
						</a>

					</p>
				</div>
			</div>
	

             <!-- 备注 -->
           <div class="wrap_line fff">
		    <div class="beizhu flex flex-pack-justify ">
				<div class="mleft flex-align-center flex">
					备注
				    <span class="help margin-left_10"  @click="dia_info('beizhu')" ></span> 
				</div>

				<div class="flex flex-align-center rightesclipe flex-pack-center " @click="bzhow(shop.shop_id)">
					  <span class="not_must_write flex-1" :ref="'needwrote_'+shop.shop_id">非必填</span>
					  <a class="right_arrow margin-left_x"></a>
				</div>
			 </div>
		  </div>	 

 

        <!-- 小计 ui底部下划线有长有短 wrap_line -->
		<div class="wrap_line fff">  
		 <div class="total_m flex flex-pack-justify flex-pack-center">
	    	<div class="flex">
	    		<h1>小计</h1>
	    	    <span class="pro_num">共{{shop.shop_checked_quantity}}件</span>
	    	</div>
	    	<p class="money" v-if="shop.shop_total_amount"> ￥ {{shop.shop_total_amount+shop.shop_total_freight|toFloat}}</p>
	    </div>
	  </div> 


	   </div>		
		
	</div>	
 </div>  	

</div> 
</template>

<script>
    import { Dialog } from 'vant';
	import config from '@/config/config' 
	import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
	import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
	
	export default{
		name: 'Prolist',
		data(){
			return {
	            linkStoreDomain:config.store_domain            
			}
		},
		computed:{
          ...mapGetters([
          	  'get_product_list', // 产品列表 
		   	  'get_check_point',  // 是否使用积分 1:使用  0:不
		   	  'get_point_number', // 积分
		   	  'get_beizhu',
		   	  'get_cartallvouchlist'
		   ]),
           myprolist(){
           	 return this.get_product_list&& this.get_product_list[0] && this.get_product_list[0].shop_list
           },
            // 默认是国内支付  海外购 1  国内支付 2
           nation_way(){
              return this.get_product_list&&this.get_product_list[0]&&this.get_product_list[0].type_id
           }
		},
		watch:{
        	get_beizhu:{
        		 deep:true,
	    	     immediate:true,
	    	     handler(v){ 	
	               v.forEach((item)=>{ 
					this.$nextTick(()=>{
						 try{
						 	 if(!item.val){
							  	 this.$refs['needwrote_'+item.id][0].innerHTML = '非必填'
							  }else{
							  	  this.$refs['needwrote_'+item.id][0].innerHTML = item.val
							  }
						 }catch(e){
						 	 // 铺货错误来源，防止影响程序执行，主要是因为如果在备注页面刷新，就在保存进来就会捕获到错误的产生，不做处理
						 	 console.log(e.toString())
						 }
					})
	             })
	    	   }       
        	}
        },
		filters:{
			 // 对于数字金额的钱 进行格式化
           priceCess(v){
              return parseFloat(v).toFixed(2)
           },

           toFloat(num){

			let result = parseFloat(num),
				s_x,
				pos_decimal

			result = Math.round(num * 100) / 100
			s_x = result.toString()
			pos_decimal = s_x.indexOf('.')

			if (pos_decimal < 0) {
			  pos_decimal = s_x.length
			  s_x += '.'
			}

			while (s_x.length <= pos_decimal + 2) {
			  s_x += '0'
			}

			return s_x

		},
          
 		},

      
		methods:{
		  ...mapActions(['beizhufn']),

           productUrl(id){
	            return this.linkStoreDomain + '/product-'+id+'.html';
	        },

          voucherCanU(v){
            return v.shop_voucher.voucher.length + v.shop_voucher.freeshipping.length + v.shop_voucher.dutyfree.length
          },
          // 已选了几张券
          hasSeletcVoucheNumber(shop){
           	   let voucher = this.get_cartallvouchlist,
                   len = 0

             for(let vo in voucher){
             	 if(voucher[vo][shop.shop_id]){
                   len ++
             	 }
             }
        
              return len
           },
			// 跳转路由 
			turnVoucher(shop){
				let Vm = this
				if(!this.voucherCanU(shop)){  // 积分为0的时候就不让进选券的页面了 
                   return 
				}
				this.$router.push({
					 path: 'checkoutVoucher.html',
					 query:{
					 	from:'checkout',
					 	shopid:shop.shop_id,
					 	typeid:Vm.nation_way,
					 	type:'coupon'
					 }
				})
			}, 
            bzhow(shopid){
            	this.$router.push({
					 path: 'shopmarks.html',
					 query:{
					 	shopid:shopid
					 }
				})
            },
            errorImg(e){
              e.target.src = require('../../../assets/images/default.png');
            },

           dia_info(v){ 
				if(v == 'jifen'){
                  Dialog.alert({
				  title: '关于发票',	
				  message: '<p class="jifenTips-desc">如需开具发票，请务必在备注中提供单位名称及税号。（使用预付卡支付、积分支付以及跨境商品暂不支持开发票）在商品不退货的情况下，按照收货地址10个工作日后寄出。</p>',
				  confirmButtonText:'知道了'
				 });
			 }else if(v == 'beizhu'){
			 	  Dialog.alert({
				  title: '关于备注',	
				  message: '<p class="jifenTips-desc">如需开具发票，请务必在备注中提供单位名称及税号。（使用预付卡支付<span>、内购币支付</span>以及跨境商品暂不支持开发票）在商品不退货的情况下，按照收货地址10个工作日后寄出。</p>',
				  confirmButtonText:'知道了'
				 });
			 }
		  }

		},
		
	}
</script>

<style scoped>
[v-cloak] {
  display: none;
}	
.disnooo{
	display: none;
}

</style>



















