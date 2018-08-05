<template>
	<div class="meiriyouxian">
	    <div id="yx_express_time_m" class="clearfix">
			<p class="title">预约配送时间</p> 
			<div>
				<!-- <span>今天</span>  -->
				<span @click="mryx_dialog_show=true">{{time_to_destination}}</span> 
				<i class="jiantou"></i>
			</div> 
			<p class="desc">您可预约每日优鲜商品送达时间</p>
	   </div>

   <!-- 每日优鲜时间选择 -->

	 <van-popup v-model="mryx_dialog_show" position="bottom" :overlay="true" :close-on-click-overlay="false" > 
	   <div class="mryx_dialogs">
	   	 <a href="javascript:;" class="close_checkout_voucher" @touchend="mryx_dialog_show=false" ></a>
	   	 <h4>预约配送时间</h4>

	   	 <div class="select_yx_express_time">
		   	 	<ul class="day" @touchmove.stop.self="noop($event)">
		   	 	 <li class="active" ref="timeDay" v-if="mryx_express_time[0]">{{mryx_express_time[0].day_type|formateDay}}</li>
		   	   </ul>

		   	 <ul class="time" @touchmove.stop.self="noop($event)">
		   	    <li  v-for="(t,index) in mryx_express_time[0].data" :class="{active: index == select_index}" @click.prevent="select_time_mryx(index)" ref="timeItem">
              {{ t.time|formatetime }}
           </li>
		   	 </ul>
	   	 </div>
	   </div>
	 </van-popup>

 </div>
</template>
<script>

  import config from '@/config/config' 
  import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'


  export default {
	name:'MeiriYouxian',
	data(){
		return{
			mryx_dialog_show:false,                // dialog switch
			time_to_destination:'今天  2小时内送达',  // expression for what's time to send
			select_index:0,                        // which one selected index 0,1,2...
			mryx_express_time:[
                // {
                //     "day_type":"this_day",
                //     "data":[
                //         {
                //             "time":[
                //                 "0",
                //                 "0"
                //             ]
                //         },
                //         {"time":["15", "17"] }, {"time":["16", "18"] }, {"time":["17", "19"] }, {"time":["18", "20"] }, {"time":["19", "21"] }, {"time":["20", "22"] }, {"time":["21", "23"] } ]
                // }
              {
                day_type:"",
                data:[]
              }
            ]
		}
	},
   computed:{
     ...mapGetters([
        'get_goods_group',
        'get_has_mryx_goods'
      ])
   },
    filters:{
      formatetime(v){
        
          // it's a array just like ["0","0"]
         
          let res = '',
              sum = (arr)=>{
             if(!Array.isArray(arr)) return
             let res = 0
             arr.forEach((item,index,arr)=>{
             	res += parseFloat(item)
             })	
             return res
          };

          if( Object.prototype.toString.call(v) =='[object Array]' ){

          	 if( sum(v) <=0){
                 res = '2小时内送达';
          	 }else{
          	 	 res = v[0]+':00 - ' + v[1] + ':00';
          	 }
          }

          return res
      },
      formateDay(v){
         // it's a string for day 
         return  v=='this_day'? '今天' :'明天'
      },

    },
  
	methods:{ 
    ...mapActions([
           'mryx_selct' 
      ]), 

		select_time_mryx(index){
		   let d = this.$refs.timeDay.innerText,         // 今天 昨天
           t = this.$refs.timeItem[index].innerText,  // 18:00 - 20:00 
           Vm = this

           //console.log( d+" "+t)
           this.time_to_destination = d+" "+t
           this.mryx_dialog_show = false
           this.select_index = index


           let mryx = {
                   has_mryx:Vm.get_has_mryx_goods,
                   mryx_day:Vm.mryx_express_time[0].day_type,
                   mryx_start_time:Vm.mryx_express_time[0].data[index].time[0],
                   mryx_end_time:Vm.mryx_express_time[0].data[index].time[1],
               }

            this.mryx_selct(mryx)   

		},

		noop(){},  // null function 
	},
  watch:{
      get_goods_group: {
         handler(v){
            if(v){

             let mryx =  v.body.extend_data.mryx_info,
                 validTime = mryx.has_mryx
 
                if(validTime){
                    this.mryx_express_time = mryx.dispatching_time_list.data
                }
          }
        },
        immediate:true
      }
      
  }
}	
</script>

<style  lang="scss">
.meiriyouxian{
  margin-bottom: 0.26rem;
}
.mryx_dialogs{
    background-color: #f5f6fa;
    padding: 0;
    margin: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    border-radius: 0;
}
.close_checkout_voucher {
    position: absolute;
    top: .4rem;
    top: .26667rem;
    right: .26667rem;
    height: .4rem;
    width: .4rem;
    text-align: center;
    background: url('../images/close_x.png') no-repeat 50%;
    background-size: 100% 100%;
}

.mryx_dialogs h4 {
    height: 1.06667rem;
    line-height: 1.06667rem;
     font-size: .4rem;
    text-align: center;

}

.select_yx_express_time {
    padding: .13333rem 0;
    padding-bottom: .66667rem;
    overflow: hidden;
}
.select_yx_express_time ul {
    width: 49%;
    float: left;
    height: 5.33333rem;
    overflow: auto;
    -webkit-transform:translateZ(0);
    -webkit-overflow-scrolling: touch;
}

.select_yx_express_time ul li.active {
    color: #4bf;
}
.select_yx_express_time ul li {
    line-height: .8rem;
    font-size: .37333rem;
    text-align: center;
}
</style>















