<template>
  <div>
    <div class="voucher-wel">
      <div class="top-wel">
        <div class="wel-banner">
          <img :src="banner_url" alt="">
          <p>{{banner_text}}</p>
        </div>
      </div>

      <h2 class="posters-h2"><span></span>&nbsp;&nbsp;{{act_name}}&nbsp;&nbsp;<span></span></h2>

      <div class="month-count">
        <div class="all-c border-last" v-for="(list_voucher,index) in cont_list">
          <div class="month-list">


            <h3 v-if="list_voucher.voucher_type == 'neigou'">{{list_voucher.name}}：<span>￥</span>&nbsp;<em>{{list_voucher.money}}</em></h3>
            <h3 v-else-if="list_voucher.voucher_type == 'discount'">{{list_voucher.name}}：<em>{{list_voucher.discount}}</em><span>折</span>&nbsp;</h3>
            <h3 v-else="list_voucher.voucher_type == 'mianyou'">{{list_voucher.name}}：<em class="mianyou">免邮</em></h3>

            <div class="list-desc">{{list_voucher.desc}}</div>
            <div class="list-time">{{list_voucher.valid_date}}</div>
          </div>
        </div>
      </div>
      <h2 class="posters-h2 m-t-2"><span></span>&nbsp;&nbsp;在哪儿领取&nbsp;&nbsp;<span></span></h2>
      <p class="activity-p">登录公司内购首页，在页面顶部领取本月福利</p>
      <div class="div-img">
        <img src="./img/activity-img.png" alt="">
      </div>
      <div class="activity-time"><span>活动时间：{{activity_time}}</span></div>
    </div>
  </div>
</template>

<script>
  import './css/welfareposters_go.scss';
  import {httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import config from '@/config/config'
  import { Toast } from 'vant';
  import loadingImg from './img/loading.gif'
  const  hdDomin = config.store_api_domain+'/hdApi/';
  const  diandiDomin = config.diandi_img_domain;

  export default {

    components:{},
    data(){
      return{
        cont_list:[],
        banner_url:'',
        banner_text:'',
        act_name:'',
        activity_time:'',
      }

    },
    methods:{
      GetQueryString(name)
      {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
      }
    },
    created() {
      let Vm = this;
      let encrypt_info = Vm.GetQueryString('encrypt_info');
      httpPost(`${hdDomin}WelfareVoucherNotLogin/splash`,{encrypt_info:encrypt_info}).then(res =>{
//                console.log(res);
        if(res.data.errno == 0){
          Vm.cont_list = res.data.body.vouchers;
          Vm.banner_text = res.data.body.desc
          Vm.banner_url = `${diandiDomin}`+res.data.body.wap_img
          Vm.act_name = res.data.body.subject_name
          Vm.activity_time = res.data.body.time
          document.querySelector('body').style.background=res.data.body.bg_color
//                console.log(Vm.cont_list);
        }else{
          Toast(res.data.error);
        }
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
