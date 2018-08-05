<template>
  <div>
    <div class="voucher-wel">
      <div class="top-wel">
        <div class="wel-banner">
          <img :src="banner_url" alt="">
          <p>{{banner_text}}</p>
        </div>
      </div>
      <div class="wele-voucher-all">

        <a href="welfarebespeak.html" class="font-tishi"><img src="./img/tishi.png" alt=""><span>&nbsp;&nbsp;{{welfarevoucher_month}}福利券预约评选。自己的券自己说的算 ></span></a>
      </div>
      <div class="wel-voucher-list">

        <div class="list-all" v-for="(list_voucher,index) in cont_list">
          <img v-show="list_voucher.received" src="./img/ale-l.png" alt="" class="ale-l">
          <div class="all-l">
            <h2>{{list_voucher.name}}</h2>
            <p class="p-1">{{list_voucher.desc}}</p>
            <p class="p-2">{{list_voucher.valid_date}}</p>
          </div>

          <div class="all-r">
            <div class="money" v-if="list_voucher.voucher_type == 'neigou'">
              ￥<span>{{list_voucher.money}}</span>
            </div>

            <div class="money" v-else-if="list_voucher.voucher_type == 'discount'">
              <span>{{list_voucher.discount}}</span>折
            </div>
            <div class="money" v-else="list_voucher.voucher_type == 'mianyou'">
              <span class="mianyou">免邮</span>
            </div>
            <div class="go-click" v-show="!list_voucher.received"  @click="voucher_list(list_voucher.enc,list_voucher.received,index)">立即领取</div>
            <a :href="list_voucher.url" class="go-click let-go" v-show="list_voucher.received" >去使用</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/welfarevoucher.scss';
  import {httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import config from '@/config/config'
  import { Toast } from 'vant';
  import loadingImg from './img/loading.gif'
  const  hdDomin = config.store_api_domain+'/hdApi/';
  const  mallDomin = config.mall_api_domain;
  const  diandiDomin = config.diandi_img_domain;

  export default {

    components:{},
    data(){
      return{
        cont_list:[],
        banner_url:'',
        banner_text:'',
        act_name:'',
        welfarevoucher_month:'',
      }

    },
    methods:{
      goUrl(e){
        return e;
      },
      voucher_list(e,sub,i){
        let Vm = this;

        Jsonp(`${mallDomin}/VoucherCenter/ajaxGetVoucher`,{
          params :{'pass':e}}).then((res)=>{
          let _e = res.body
          if(_e.result=='fail'){
            Toast(_e.msg);
          }else{
            if(sub==false){
              sub = true
              Vm.$set(Vm.cont_list[i],'received',sub)
              Toast('领取成功');
            }else {
              return
            }
          }
        })

      }
    },
    created() {
      let Vm = this;

      httpPostV2(`${hdDomin}WelfareVoucher/VouchersForSelection`,{},function(res){
//                console.log(res);
        Vm.cont_list = res.vouchers
        Vm.banner_text = res.desc
        Vm.banner_url = `${diandiDomin}`+res.wap_img
        Vm.act_name = res.subject_name
        Vm.welfarevoucher_month = res.month_name
        document.querySelector('body').style.background=res.bg_color

//                console.log(Vm.cont_list);
      },function(error){
        Toast(error);
      })
    },
    updated(){
      let Vm=this;

    },
  }
</script>

<style scoped lang="scss">
  $pole:75;
</style>
