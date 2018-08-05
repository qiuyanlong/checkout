<template >
	<div id="o2ocheckout_voucher" class="voucherlist" ref="voucherlist" :style="{'height':bodyHeight+'px'}">
        <template v-if="sign">
        <div v-for="(shop_voucher,shop_type) in voucherListData" v-if="shop_type==shop_id">
            <section class="voucher" v-for="(vo,key) in shop_voucher.voucher" v-if="vo.data.length>0">
                <h1 v-if="key == 'voucher'">优惠券</h1>
                <h1 v-if="key == 'freeshipping'">免邮券</h1>
                <h1 v-if="key == 'dutyfree'">免税券</h1>
                <ul>
                    <li @click="selectVoucher(vo.data,voucher)" :class="{blue:key=='voucher',green:key=='freeshipping',purple:key=='dutyfree',selected:voucher.select}" v-for="(voucher,index) in vo.data" v-if="vo.isAll || index < 6">
                        <div class="box">
                            <p class="desc" v-if="key == 'voucher'"><span>{{voucher|showVouchName}}</span><small>有效期:{{voucher.valid_time}}</small></p>
                            <p class="desc" v-if="key == 'freeshipping'"><span>免邮券</span><small>有效期:{{voucher.valid_time }}</small></p>
                            <p class="desc" v-if="key == 'dutyfree'"><span>免税券</span><small>有效期:{{voucher.valid_time }}</small></p>

                            <p class="tag" v-if="key == 'voucher'">{{voucher.voucher_name}}</p>
                            <p class="tag" v-if="key == 'freeshipping' || key == 'dutyfree'">{{voucher.name}}</p>
                        </div>
                    </li>
                </ul>
                <p class="more" @click.stop="openVoucher(vo)" :class="{'open':vo.isAll}" v-if="vo.data.length > 6">
                    {{vo.isAll?'收起':'展开'}}
                    <i></i>
                </p>
            </section>
        </div>
        

        <div class="mytotalbar">
            <div class="alreadysel">
                <p class="info" >已选<i>{{selectedTag.length}}</i>张</p>
                <ul class="list">
                    <li v-for="tag in selectedTag" >
                        {{tag}}
                    </li>
                </ul>
                <a class="go"  @click="selectMyVocucher">确认</a>
            </div>
            <div class="iphonex40"></div>
        </div>
        </template>
    </div>
</template>
<script>
import config from '@/config/config.js';
import "./assets/css/voucher.scss";
import Vue from 'vue'
import { mapGetters,mapActions } from 'vuex';

export default{
	name: 'checkout',
	components:{
       
	},
	data(){
		return{
            bodyHeight:0,
            shop_id:'',
            sign:''
		}
    },
    created(){
        let Vm=this;
        if(!this.voucherListData){
            window.history.go(-1)
            return false;
        }
        this.bodyHeight =  document.documentElement.clientHeight;
        this.shop_id = this.$route.query.shop_id;
        this.sign = this.$route.query.sign;
    },
    mounted(){
        
    },
    filters: {
       
        showVouchName(cur) {
            let name = "";
            if (cur.type == "money") {
                if (cur.limit_cost == 0) name = "减" + Math.floor(cur.money*100)/100;
                else
                name = "满" + Math.floor(cur.limit_cost*100)/100 + "减" + Math.floor(cur.money*100)/100;
            } else {
                if (cur.limit_cost == 0) name = parseInt(cur.discount) + "折";
                else
                name =
                    "满" +
                    parseInt(cur.limit_cost) +
                    "打" +
                    parseInt(cur.discount) +
                    "折";
            }
            return name;
        }
    },
    computed:{
        ...mapGetters({
            voucherListData:'voucherListData'
        }),
        selectedTag(){
            let arr=[];
            let data=this.voucherListData[this.shop_id].voucher
            for(let type in data){
                let voucherList=data[type].data;
                voucherList.forEach(voucher=>{
                    if(voucher.select==true){
                        if(type=='voucher'){
                            let name = "";
                            if (voucher.type == "money") {
                                if (voucher.limit_cost == 0) name = "减" + Math.floor(voucher.money*100)/100;
                                else
                                name = "满" + Math.floor(voucher.limit_cost/100)*100 + "减" + Math.floor(voucher.money/100)*100;
                            } else {
                                if (voucher.limit_cost == 0) name = parseInt(voucher.discount) + "折";
                                else
                                name =
                                    "满" +
                                    parseInt(voucher.limit_cost) +
                                    "打" +
                                    parseInt(voucher.discount) +
                                    "折";
                            }
                            arr.push(name)
                        }
                        if(type=='freeshipping'){
                            arr.push('免邮券')
                        }
                        if(type=='dutyfree'){
                            arr.push('免税券')
                        }
                        
                    }
                })
            }
            return arr;
        }
    },
    watch:{
        
    },
    methods:{
        selectMyVocucher(){
            let Vm=this;
            let nowVoucherData=Object.assign({},this.voucherListData[this.shop_id]);
            let newUseVoucher={
                voucher:[],
                freeshipping:[],
                dutyfree:[],
            }
            for(let type in nowVoucherData.voucher){
                let voucherList=nowVoucherData.voucher[type].data;
                voucherList.forEach(voucher=>{
                    voucher.use=false;
                    if(voucher.select){
                        voucher.use=true;
                        newUseVoucher[type].push(voucher)
                    }
                })
            }
            this.voucherListData[Vm.shop_id].use_voucher=newUseVoucher
            this.voucherListData[Vm.shop_id].voucher=nowVoucherData.voucher
            this.$router.push({path:config.neigouFallbackPath+'o2ocheckout.html',query:{sign:this.sign}})
        },
        selectVoucher(allvoucher,voucher){
            if(voucher.select){
                this.$set(voucher,'select',false)
            }else{
                allvoucher.forEach(item=>{
                    this.$set(item,'select',false)
                })
                this.$set(voucher,'select',true)
            }
        },
        voucherNum(shop_voucher){
            let num=0;
            for(let v in shop_voucher){
                let item=shop_voucher[v].data||shop_voucher[v];
                let len=item.length||0
                if(len&&len>0){
                    num+=len
                }
            }
            return num
        },
        openVoucher(voucher){
            if(!voucher.isAll){
                this.$set(voucher,'isAll',true)
            }else{
                this.$set(voucher,'isAll',false)
            }
        }
    }
}	
</script>
