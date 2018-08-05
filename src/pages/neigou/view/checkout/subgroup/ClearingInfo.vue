<template>
	<!-- 商品总额 -->
   <div class="total_pro_price margin-top_x fff">
   	  <p class="t_money flex flex-pack-justify padding-bottom_27">
   	  	 <span>商品总额</span>
   	  	 <span class="black_c">￥{{ototalPice}}</span>
   	  </p>
       <div class="flex flex-pack-justify flex-align-center yunfei">
         <div class="mleft flex-align-center flex">
            应收运费
             <span class="help margin-left_10" @click="dialog_fare_show=true"></span> 
         </div>
          <span class="black_c">￥{{totalfright}}</span>
      </div>
   	  <p class="t_neigou_q flex flex-pack-justify padding-bottom_27">
   	  	 <span>免减券抵扣</span>
   	  	 <span class="black_c">￥{{totalVocher}}</span>
   	  </p>
  
      <p class="t_free_q flex flex-pack-justify padding-bottom_27">
   	  	 <span>免邮券抵扣</span>
   	  	 <span class="black_c">￥{{freight_discount}}</span>
   	  </p>

      <p class="t_free_q flex flex-pack-justify padding-bottom_27" v-if="taxfares>0">
         <span>税费</span>
         <span class="black_c">￥{{taxfares}}</span>
      </p>
      <p class="t_free_q flex flex-pack-justify padding-bottom_27" v-if="taxfares>0">
         <span>免税券抵扣</span>
         <span class="black_c">￥{{total_taxfees_discount}}</span>
      </p>

       <p class="t_jifen_q flex flex-pack-justify padding-bottom_27" v-if="isshowjifen">
   	  	 <span>{{get_is_use_jifen.channel.point_name?get_is_use_jifen.channel.point_name:'积分'}}抵扣</span>
   	  	 <span class="black_c">￥{{total_point_discount}}</span>
   	 </p>
      
      <div class="flex flex-pack-justify flex-align-center yunfei">
         <div class="mleft flex-align-center flex">
            实收运费
         </div>    
          <span class="black_c">￥{{actualltfrate|toFloat}}</span>
      </div> 

      <div class="total_price black_c">
      	  合计实付：<span class="m blue_c">￥{{totalPice}}</span>
      </div>


      <!-- 费用明细列表 -->
      <van-popup  v-model="dialog_fare_show">
          <DialogFare 
            @close_dialog_fare="dialog_fare_show=false"
         >    
         </DialogFare>
      </van-popup>

 </div>	
</template>
<script>
  import { Popup } from 'vant';
  import config from '@/config/config' 
  import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  import DialogFare from './DialogFare'
	export default{
		name: 'ClearingInfo',
  		data(){
  			return {
  				 dialog_fare_show:false,  // 运费弹窗开关
           totalPice:0,    // 纯净的总价格
           totalfright:0,  // 总运费、
           totalVocher:0, // 总优惠券抵扣多少钱
           freight_discount:0, // 免邮券抵扣
           total_point:0, // 内购比抵扣多少钱
           ototalPice:0,//不纯净的总价格  			
           actualltfrate:0,  // 实际运费
           total_point_discount:0,
           taxfares:0,
           total_taxfees_discount:0,
         }  
  		},
      components:{
         DialogFare
      },
      computed:{
         ...mapGetters([
             'get_product_list', // 产品列表
              'get_goods_group',
              'address_list',
              'get_key', 
              'get_voucher',
              'get_now_address_index', 
              'get_shipping',
              'get_dutyfree',    // 免税
              'get_check_point', // 是否使用积分 1:使用  0:不
              'get_is_use_jifen', // 积分
              'get_jifen_switch'
           ]),

          isshowjifen(){
             if(this.get_is_use_jifen.bswitch){
                 return this.get_jifen_switch == 1?true:false
             }else{
                return false
             }
          }
       },
      filters:{
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
          // 格式化内狗币的金额 只能是整数
         formatePoint(p){ return p&&parseFloat(p) },
      }, 
      watch:{
         get_goods_group(v){
              let payable_cash = v.body.payable_cash,
                  total_freight = v.body.total_freight,
                  total_discount = v.body.total_voucher_discount, 
                  total_freight_discount = v.body.total_freight_discount,
                  total_point =  v.body.total_point,    //total_point_discount,  以内狗币为单位
                  total_amount =  v.body.total_amount,
                  total_point_discount =  v.body.total_point_discount,
                  taxfares =  v.body.total_taxfees,
                  total_taxfees_discount =  v.body.total_taxfees_discount

              this.totalPice = payable_cash>=0 ? payable_cash :0  // 实际付钱不能为小于0的数字
              this.totalfright = total_freight
              this.totalVocher = total_discount
              this.freight_discount =  total_freight_discount
              this.total_point = total_point
              this.ototalPice = total_amount
              this.actualltfrate =  this.totalfright - this.freight_discount
              this.total_point_discount = total_point_discount
              this.taxfares = taxfares
              this.total_taxfees_discount = total_taxfees_discount
         }
      }, 
      methods:{
        ...mapActions([
            'total_quest',      //
            'get_address_list', // 地址列表映射
            'toggleAddress',    // 地址切换 货物列表映射
            'prolist'           // 产品列表
          ]),
      }  
	}
</script>





















