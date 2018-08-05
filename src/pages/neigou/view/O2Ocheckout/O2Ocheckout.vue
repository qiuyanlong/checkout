<template id="o2ocheckout_main">
	<div id="o2ocheckout">
        <Shoplist></Shoplist>
        <SelectDate></SelectDate>
        <Extends></Extends>
        <VoucherAll></VoucherAll>
        <Total></Total>
        <CreatOrder></CreatOrder>
        
        <van-popup  v-model="showErrGoodsModal" class="err_goods_popup ng_popup">
            <h1 class="ng_popup_title">以下商品库存不足</h1>
            <div class="ng_popup_content">
                <ul class="err_goods_list">
                    <li class="flex flex-align-center"  v-for="pro in creatErrorData.errbody">
                        <img :src="pro.image" :alt="pro.shop_name">
                        <div class="pro_text">
                            <p class="name">{{pro.product_name}}</p >
                            <p class="nums">x{{pro.quantity}}</p >
                        </div>
                    </li>
                </ul>
            </div>
            <div class="ng_popup_bottom">
                <van-button class="btn" @click="creatErrorData.errno=0" type="primary">知道了</van-button>
            </div>
       </van-popup>
	</div>
</template>
<script>
import Vue from 'vue'
import { Popup } from 'vant';

import Shoplist from './components/Shoplist.vue'
import Extends from './components/Extends.vue'
import SelectDate from './components/SelectDate.vue'
import VoucherAll from './components/VoucherAll.vue'
import Total from './components/Total.vue'
import CreatOrder from './components/CreatOrder.vue'

import config from '@/config/config.js';
import COOKIE from '@/api/cookie.js';

import UTIL from '@/api/util'
let sign=UTIL.getQueryString('sign');

import {httpGet,httpPost,jsonp} from '@/api/base';
import { mapGetters,mapActions } from 'vuex';
export default{
	name: 'checkout',
	components:{
        Extends,
        Shoplist,
        SelectDate,
        VoucherAll,
        Total,
        CreatOrder
	},
	data(){
		return{
            
		}
    },
    created(){
        this.$pageLoading.show();
        window.o2oVue=this;
        this.$store.dispatch('getO2OcheckoutData');
    },
    computed:{
        ...mapGetters({
            creatErrorData:'creatErrorData'
        }),
        showErrGoodsModal(){
            let errorData=this.creatErrorData;
            let errno=errorData.errno
            let goodsList=errorData.errbody;
            return ((errno==20040||errno==20003||errno==20004)&&this.creatErrorData.errbody.length>0)
        }
    },
    watch:{
        
    },
    methods:{
        toVoucherAll(){
            this.$router.push({path:config.neigouFallbackPath+'o2ocheckoutVoucher.html',query:{sign:sign,shop_id:'all'}})
        }
    }
}	
</script>

<style lang="scss" >
@import "./assets/css/o2ocheckout.scss";
#o2o_total{
    background: #fff
}
</style>