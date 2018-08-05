<template>

    <div class="wele-bespeak">
      <div class="bespeak-top">
        <img src="./img/deng.png" alt="">
        <span>选择您喜欢的内购券预约，预约人数最多的福利券就可能会在下月供大家领取。</span>
      </div>
      <div class="bespeak-list">
        <div class="count" v-for="(list_voucher,index) in cont_list">
          <div class="count-div">
            <div class="count-top">已预约<span>{{list_voucher.num}}</span>人</div>
          </div>
          <div class="all-count">
            <div class="count-f">
              <h2>{{list_voucher.name}}</h2>
              <p class="desc">{{list_voucher.desc}}</p>
              <p class="time">{{list_voucher.valid_date}}</p>
            </div>
            <div class="count-r">
              <div class="money" v-if="list_voucher.voucher_type == 'neigou'">
                ￥<span>{{list_voucher.money}}</span>
              </div>

              <div class="money" v-else-if="list_voucher.voucher_type == 'discount'">
                <span>{{list_voucher.discount}}</span>折
              </div>
              <div class="money" v-else="list_voucher.voucher_type == 'mianyou'">
                <span class="mianyou">免邮</span>
              </div>


              <div class="on-click" v-show="!list_voucher.subscribe" @click="voucher_list(list_voucher.voucher_id,list_voucher.subscribe,index,list_voucher.num)">预约</div>

              <div class="on-click alw-on" v-show="list_voucher.subscribe" >已预约</div>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
  import './css/welfarebespeak.scss';
  import {httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import config from '@/config/config'
  import { Toast } from 'vant';
  import loadingImg from './img/loading.gif'
  const  hdDomin = config.store_api_domain+'/hdApi/';

  export default {

    components:{
    },
    data(){
      return{
        cont_list:[],
      }

    },
    methods:{
      onClickLeft(){ this.$router.go(-1)},
      toVant(){ this.$router.push({name:'vantlist'})},
      voucher_list(e,sub,i,num){
        let Vm = this;
        httpPostV2(`${hdDomin}WelfareVoucher/subscribe`,{welfare_voucher_id:e},function(res){
//                    console.log(res);
          if(sub==false){
            sub = true
            Vm.$set(Vm.cont_list[i],'subscribe',sub)

//                        console.log(Vm.cont_list[i].subscribe)
            Toast('预约成功');
            num = Number(num)+1
            Vm.$set(Vm.cont_list[i],'num',num)


          }else {
            return
          }
        },function(error){
          Toast(error);
        })

      }

    },

    created() {
      let Vm = this;
      httpPostV2(`${hdDomin}/WelfareVoucher/subscribevouchers`,{},function(res){
        //                console.log(res);
        Vm.cont_list = res.data.vouchers;
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
