<template>
 <div class="freight_model">
   <div id="freight_model_content" class="layer-dialog-center">
    <h1 class="checkout-modal-header">运费详情</h1> 
    <div class="freight_model_main">
       <ul class="freight_list" ref="myscroll" @touchmove.stop="noop">
        <li v-for="shop in myprolist">
          <h2>{{shop.shop_name}}<span>运费:  
             <template>{{farepriceshow(shop)}}</template>
             <template>{{farename}}</template>
          </span>
          </h2>
          <ul>
            <li v-for="(goods,index) in shop.product_list" :key="index">
              <img :src="goods.image" @error="errorImg" :alt="goods.product_name">
           </li> 
          </ul>
        </li>
       </ul>
    </div>

     <div class="freight_text">
      <p class="txt">注:免邮券仅可抵扣该券指定范围内商品的运费。</p>
     </div>
     <a href="javascript:;" class="close_freight_model" @click="close_freight_model">知道了</a>
</div>
</div>
</template>

<script>


  import config from '@/config/config' 
  import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
	export default {
		name:'DialogFare',
		data(){
			return{   
			}
		},
     computed:{
      ...mapGetters([
          'get_product_list', // 产品列表
          'get_goods_group',
          'address_list',
          'get_now_address_index', 
          'get_check_point', // 是否使用积分 1:使用  0:不
          'get_is_use_jifen', // 积分
          'get_jifen_switch',
          
       ]),
    
    myprolist(){
         return this.get_product_list&& this.get_product_list[0] && this.get_product_list[0].shop_list
    },
    isshowjifen(){
     if(this.get_is_use_jifen.bswitch){
             return this.get_jifen_switch == 1?true:false
         }else{
            return false
         }
      },
     
   // 内狗币 积分名称展示
   farename(){ 
       if( this.isshowjifen ){ 
           if(this.get_is_use_jifen.channel.point_name){
             return this.get_is_use_jifen.channel.point_name
           }else{
             return "积分"
           }
       }else{
          return ''
       }
   },
  

    },

		methods:{
           close_freight_model(){
           	  this.$emit('close_dialog_fare')
           },
           noop(){}, // null function
           errorImg(e){
              e.target.src = require('../../../assets/images/default.png');
            },

           farepriceshow(shop){
               if( this.isshowjifen ){ 
                    // 传递进来的总运费的价格
                    if(this.get_is_use_jifen.channel.exchange_rate){
                       // 每个店铺的运费分别展示
                       return shop.shop_total_freight*this.get_is_use_jifen.channel.exchange_rate
                    }
                    
               }else{
                      return shop.shop_total_freight
               }
           }

		  },
      mounted(){
         
          try{ this.$refs.myscroll.scrollTop = 50}
          catch(e){ console.log(r.toString()) }
      },


	}



</script>

<style lang="scss" scoped>
#freight_model_content {
    border: none;
    padding-bottom: .4rem;
}

.layer-dialog-center {
    width: 9.06667rem;
    background-color: #fff;
    border-radius: .10667rem;
    overflow: hidden;
    -webkit-transition: .2s;
    transition: .2s;
 }   
#freight_model_content h1 {
    text-align: center;
    color: #4bf;
}
#freight_model_content ul.freight_list li h2 span {
    position: absolute;
    right: .4rem;
    color: #333;
}
.checkout-modal-header {
    position: relative;
    padding: 0 .26667rem;
    line-height: 1.06667rem;
    height: 1.06667rem;
    color: #333;
    font-size: .4rem;
    border-bottom: 1px solid #ddd;
}
#freight_model_content ul.freight_list {
    max-height: 6.53333rem;
    overflow-y: auto;
    -webkit-transform:translateZ(0);
    width: 100%;
     -webkit-overflow-scrolling: touch;
}
#freight_model_content ul.freight_list li h2 {
    background: #f8f8f8;
    padding: 0 .4rem;
    border-top: .02667rem solid #eee;
    height: .98667rem;
    line-height: .98667rem;
    font-size: .32rem;
    color: #333;
    position: relative;
}
#freight_model_content ul.freight_list li ul {
    overflow: hidden;
    padding-left: .26667rem;
    padding-top: .26667rem;
}
#freight_model_content ul.freight_list li ul li {
    float: left;
    margin: 0 .13333rem .26667rem;
}
#freight_model_content ul.freight_list li ul li img {
    box-sizing: border-box;
    width: 1.6rem;
    height: 1.6rem;
    border: .02667rem solid #ccc;
}
#freight_model_content .freight_text {
    line-height: .4rem;
    padding: .13333rem .4rem;
}
#freight_model_content .freight_text p.txt {
    color: #666;
    padding: .06667rem 0 .26667rem;
}

#freight_model_content .freight_text p {
    font-size: .32rem;
    color: #333;
}
#freight_model_content a {
    width: 6.93333rem;
    height: 1.14667rem;
    line-height: 1.14667rem;
    color: #fff;
    margin: 0 auto;
    display: block;
    background: #4bf;
    font-size: .4rem;
    text-align: center;
    border-radius: .10667rem;
}	

</style>























