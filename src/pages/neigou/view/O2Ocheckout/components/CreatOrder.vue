<template>
    <div class="o2o_creat_order ">
        <p>合计实付:￥{{o2ototalData.payable_cash}}</p>
        <a href="javascript:;" @click="creatO2OOrder">提交订单</a>
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
        creatO2OOrder(){
            let Vm=this;
            let data={fromEvent:'creatO2OOrder'};
            this.$store.dispatch('creatO2OOrder',data);
        }
        
    },
    watch:{
        
    }
}	
</script>

<style lang="scss">

</style>









