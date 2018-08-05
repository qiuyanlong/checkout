<template>
<div class="jifen_wrap fff">	
<!-- 跨平台通用券 -->

    <div class="cross_stable_q flex flex-pack-justify margin-top_x fff" v-if="total_platformVocher>0">
    	<span>跨平台通用券</span>
    	<div class=" flex flex-align-center" @click.self="turnVoucher()">
    		<template v-if="hasSelectPlatvoucherNumber()>0">已选 <span class="blue_c">{{hasSelectPlatvoucherNumber()}}</span>张</template>
    		<template v-else>
    			<template><span class="blue_c">{{total_platformVocher}}</span>张可用</template>
    		</template>
    		<a class="right_arrow margin-left_x"  ></a> 
    	</div>
    </div>		


   <!-- 积分 -->
    <div class="flex flex-pack-justify jifen flex-align-center fff" v-if="get_is_use_jifen.bswitch">
    	<div class="flex flex-align-center">
    		{{get_is_use_jifen.channel.point_name?get_is_use_jifen.channel.point_name:'积分'}}
    		<span class="help margin-left_10" @click="dia_info('jifen')"></span> 
    		<span class="total_scores">
    			共 <span class="blue_c">{{get_is_use_jifen.point.point|deleteLine}}</span>
                  {{get_is_use_jifen.channel.point_name?get_is_use_jifen.channel.point_name:'积分'}}
    		</span>	
    	</div>     
        <!-- <van-switch v-model="checked" />	 -->
        <input class="mui-switch mui-switch-animbg " :checked="mychecked" type="checkbox"  v-model="mychecked">
  </div>
    
</div>    
</template>
<script>
  import { Dialog } from 'vant';
	import config from '@/config/config' 
	import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
	import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'

	export default{
		name: 'PlatVoucher',
		data(){
			return {
				 member_point:0,
				 total_platformVocher:0,
         typdid:2,     // 默认支付方式2 1是海外支付方式
				 platform_voucher_list:{},
         mychecked:true,
         bflag:false  // 默认初始化的  是一个防止初始化的时候 watch监听到这个checked属性变化的 flag
 			}
		},
		computed:{
           ...mapGetters([
               'get_goods_group',
                'address_list',
      		   	  'get_key', 
      		   	  'get_now_address_index', 
      		   	  'get_is_use_jifen', // 积分
      		   	  'get_jifen_switch',
      		   	  'get_cartallvouchlist'
      		]),
    		   
		   myprolist(){
           	 return this.get_product_list&& this.get_product_list[0] && this.get_product_list[0].shop_list
           },
      
       // 获取当前切换地址的列表
       addressList(){
          return this.address_list[this.get_now_address_index]
       },
       hasSelect(){
          return this.get_jifen_switch?true:false
       }
		},
		watch:{
			mychecked(val){ 
        let tar = 1
         if(val){ tar = 1 }else{ val = 0}
         this.jifen_switch( val )
           
         if(!this.bflag){
            
            this.bflag = true

         }else{

              // 监测 刷新页面 
             this.$pageLoading.show()            
             this.prolist({el:this,key:this.get_key,ind:this.get_now_address_index,type:'init'})
         }  
         
			},

			// 全平台优惠券数量
			get_goods_group(v){
			  let datas = v.body.extend_data.platform_info.platform_voucher
        this.platform_voucher_list = datas
        this.total_platformVocher = datas['voucher'].length + datas['dutyfree'].length + datas['freeshipping'].length
        this.typdid = v.body.type_list[0].type_id  
			}
		},
    filters:{
        deleteLine(v){
           return v.toString().replace(/-/g,' ')
        }
    },
		methods:{
			 ...mapActions([
		        'total_quest',      //
		        'get_address_list', // 地址列表映射
		        'toggleAddress',    // 地址切换 货物列表映射
		        'prolist',          // 产品列表
		        'jifen_switch'      // 积分开关 
		      ]),
           // 已经选择平台券的数量 
           hasSelectPlatvoucherNumber(){
             let voucher = this.get_cartallvouchlist,len = 0

             for(let vo in voucher){
             	 if(voucher[vo]['all']){
                   len ++
             	 }
             }
              return len
           },
           // 跳转路由 
			turnVoucher(){
				let Vm = this
				if(!this.total_platformVocher){  // 积分为0的时候就不让进选券的页面了 
                   return 
				}
				this.$router.push({
					 name: 'checkoutvoucher',
					 params:{
					 	list:this.platform_voucher_list
					 },
					 query:{
					 	 from:'checkout',
					 	 type:'all',
            typeid: Vm.typdid   
					 }
				})
			},
     dia_info(v){ 
				if(v == 'jifen'){
				  Dialog.alert({
				  title: '积分支付说明',	
				  message: '积分属于企业福利平台的虚拟货币。<br/> 所有积分支付的订单均不提供商品发票。',
				  confirmButtonText:'知道了'
				 });
			 }
		  },
		},
	  created(){
      this.mychecked = this.get_jifen_switch
    }
	}
</script>
<style lang="scss" >
@function pxm($px) {
  @return ( ($px / 75) * 1 ) +rem;
}
@mixin borderRadius($radius:pxm(20)) {
  border-radius: $radius;
  border-top-left-radius: $radius;
  border-top-right-radius: $radius;
  border-bottom-left-radius: $radius;
  border-bottom-right-radius: $radius;
}
 
$duration: .4s;
$checkedColor: #64bd63;
.mui-switch {
  width: pxm(70);
  height: pxm(43);
  border:1px solid #e5e5e5;
  overflow: hidden;
  position: relative;
  background-color: #fdfdfd;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  @include borderRadius();
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
  &:before {
    content: '';
    width: pxm(42);
    height: pxm(42);
    position: absolute;
    top: pxm(-.96);
    left: 0;
    @include borderRadius();
    background-color: #fff;
    box-shadow: 0 pxm(1) pxm(3) rgba(0, 0, 0, 0.4);
  }
  &:checked {
    border-color: $checkedColor;
    box-shadow: $checkedColor 0 0 0 pxm(16) inset;
    background-color: $checkedColor;
    &:before {
      left: pxm(23);
    }
  }
  &.mui-switch-animbg {
    transition: background-color ease $duration;
    &:before {
      transition: left 0.3s;
    }
    &:checked {
      box-shadow: #dfdfdf 0 0 0 0 inset;
      background-color: $checkedColor;
      transition: border-color $duration, background-color ease $duration;
      &:before {
        transition: left 0.3s;
      }
    }
 
  }
  &.mui-switch-anim {
    transition: border cubic-bezier(0, 0, 0, 1) $duration, box-shadow cubic-bezier(0, 0, 0, 1) $duration;
    &:before {
      transition: left 0.3s;
    }
    &:checked {
      box-shadow: $checkedColor 0 0 0 pxm(16) inset;
      background-color: $checkedColor;
      transition: border ease $duration, box-shadow ease $duration, background-color ease $duration*3;
      &:before {
        transition: left 0.3s;
      }
    }
 
  }
}
	
</style>

