<template>
    <div class="voucherAll">
        <div  v-if="canUseVoucherAllNum>0" id="voucherAll" @click="toVoucherAll">
            <p>跨平台通用券</p>
            <div v-if="useVoucherAllNum>0">已选<span>{{useVoucherAllNum}}</span>张 <van-icon name="arrow" /></div>
            <div v-else><span>{{canUseVoucherAllNum}}</span>张可用 <van-icon name="arrow" /></div>
        </div>
    </div>
</template>
<script>
import { mapGetters,mapActions } from 'vuex';

import config from '@/config/config.js';

import UTIL from '@/api/util'
let sign=UTIL.getQueryString('sign');

export default{
	name: 'VoucherAll',
	components:{
        
	},
	data(){
		return{
            
		}
    },
    created(){
        
    },
    computed:{
        ...mapGetters({
            voucherListData:'voucherListData'
        }),
        useVoucherAllNum(){
            let num=0;
            
            if(this.voucherListData&&this.voucherListData.all){
                let data=this.voucherListData.all;
                for(let voucherType in data.use_voucher){
                    num+=data.use_voucher[voucherType].length||0;
                }
            }
            return num
        },
        canUseVoucherAllNum(){
            let num=0;
            if(this.voucherListData&&this.voucherListData.all){
                let data=this.voucherListData.all;
                for(let voucherType in data.voucher){
                    num+=data.voucher[voucherType].data.length||0;
                }
            }
            return num
        }
    },
    methods:{
        toVoucherAll(){
            this.$router.push({path:config.neigouFallbackPath+'o2ocheckoutVoucher.html',query:{sign:sign,shop_id:'all'}})
        }
    },
    watch:{
        
    }
}	
</script>

<style lang="scss">

</style>









