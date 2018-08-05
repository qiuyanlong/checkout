<template>
<div v-if="get_isVerify&&get_identity.verify_level>0" >
    
	 <!-- <template v-if="get_identity.cart_info.id_card_no">
	 	<div class="warning_info flex" >
	       <span></span>
	       <p>温馨提示：为保障顺利清关，收货地址使用的收货人姓名、身份证号请与付款人真实信息保持一致</p>
	    </div>
	 </template> -->
	 <template >
	 	<div class="hg_rz flex flex-align-center flex-pack-justify fff" @click="hg_identity_switch">
	      <div class="hg_rz_inn">
	        <h1>海关信息</h1>
	        <p v-if="!get_identity.cart_info.id_card_no" class="red">因海关清关需要，请填写收货人的身份证号</p>
	        <p v-else>收货人身份证号：{{get_identity.cart_info.id_card_no|cidX}}</p>
	      </div>
	     <a class="right_arrow" ></a>
	  </div>
	 </template>

</div>
</template>

<script>

import { Toast } from 'vant'
import config from '@/config/config' 
import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'	
export default{
	name:'OverSea',
	props:['isinfo','type'],
	data(){
		return{
           waring:false,
           identity:false,
           idenPass:false,
           useCid:'',
		}
	},
	computed:{
	  ...mapGetters([
	  	  'get_sub_identity',
          'get_is_over_sea',
          'get_identity',       // 海外购身份认证信息
          'get_isVerify'

       ]),	
	},

	filters:{
	  cidX(cid){
	  	 // 旧版的是15位数  新版的18位
	  	 return cid&&cid.replace(/(\d{4})\d{7,10}(\d{4})/, "$1****$2");
	  }	 
	},
	watch:{
		
	},
	methods:{
		// 海关身份验证
         hg_identity_switch(){
            this.$router.push({ name:'identity'}) 
         }
	},
	
}	
</script>