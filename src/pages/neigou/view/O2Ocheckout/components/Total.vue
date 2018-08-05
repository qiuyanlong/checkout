<template>
    <div class="o2o_total clearfix">
        <div class="total_info_list">
            <p class="label">商品总额:</p>
            <p class="val">￥{{o2ototalData.total_amount}}</p>
        </div>
        <div  v-if="o2ototalData.total_voucher_discount>0" class="total_info_list">
            <p class="label">内购券抵扣:</p>
            <p class="val">￥{{o2ototalData.total_voucher_discount}}</p>
        </div>
        <div class="shifukuan">合计实付:<span>￥{{o2ototalData.payable_cash}}</span></div>
    </div>
</template>
<script>
import { mapGetters,mapActions } from 'vuex';
import Vue from 'vue'
import UTIL from '@/api/util'

export default{
	name: 'total',
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
            o2ototalData:'o2ototalData',
        }),
    },
    methods:{
        
        
    },
    watch:{
        
    }
}	
</script>

<style lang="scss">

</style>









