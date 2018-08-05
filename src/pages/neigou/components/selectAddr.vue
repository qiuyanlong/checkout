/*
 * @Author: HW.Liang 
 * @Date: 2018-06-05 00:23:36 
 * @Last Modified by: HW.Liang
 * @Last Modified time: 2018-06-05 00:27:22
 */

<template>
    <div id="select-addr">

        <h2  @click='show=true'>{{value.addr|formatAddr}}<van-button type="primary">选择地址</van-button></h2>
        <van-popup class="popup2" v-model="show" position="bottom" >
            <div class="van-popup__title">所有地区 <a @click='show=false' class="van-popup__close" href="javascript:;"></a></div>
            <ul class="list">
                    <li  v-for="(item, i) in addressAry" :class="[i == index ? 'active' : '']" @click="tabCli(i)">{{item.name}}</li>
                    <li class="active" v-show="navAction">请选择</li>
                </ul>
                <div class="arealist-div" style="transform: translateX(0px);" ref="addressBox">
                    <ul class="arealist z1">
                        <li data-pid="1" data-nextlevel="1" v-for="item in provinceAry" @click="addressCli(1, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z2">
                        <li data-pid="1" data-nextlevel="1" v-for="item in cityAry" @click="addressCli(2, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z3">
                        <li data-pid="1" data-nextlevel="1" v-for="item in countyAry" @click="addressCli(3, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z4">
                        <li data-pid="1" data-nextlevel="1" v-for="item in villageAry" @click="addressCli(4, item.region_id,item.local_name)">{{item.local_name}}</li>                        
                    </ul>
                </div>
        </van-popup>
        <!-- <div id="address-select-modal" v-show="show">
            <div class="addr-map up" ref="addressContainer" id="addressContainer">
                <h4 class="head">所有地区<van-icon name="close" class="addr-icon close" @click="closeCli"/></h4>
                <ul class="list">
                    <li  v-for="(item, i) in addressAry" :class="[i == index ? 'active' : '']" @click="tabCli(i)">{{item.name}}</li>
                    <li class="active" v-show="navAction">请选择</li>
                </ul>
                <div class="arealist-div" style="transform: translateX(0px);" ref="addressBox">
                    <ul class="arealist z1">
                        <li data-pid="1" data-nextlevel="1" v-for="item in provinceAry" @click="addressCli(1, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z2">
                        <li data-pid="1" data-nextlevel="1" v-for="item in cityAry" @click="addressCli(2, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z3">
                        <li data-pid="1" data-nextlevel="1" v-for="item in countyAry" @click="addressCli(3, item.region_id,item.local_name)">{{item.local_name}}</li>
                    </ul>
                    <ul class="arealist z4">
                        <li data-pid="1" data-nextlevel="1" v-for="item in villageAry" @click="addressCli(4, item.region_id,item.local_name)">{{item.local_name}}</li>                        
                    </ul>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
import config from '@/config/config.js';
import { httpGet, httpPost,BffPost,Jsonp} from '@/api/base.js';
import Vue from "vue";
import { Actionsheet } from "vant";
Vue.use(Actionsheet);

export default {
  data() {
    return {
        selectAddr: "",
        selectData: [],
        lock:false,
        show: false,
        addrAjaxUrl: [
            '/tools-select_state.html',
            '/tools-select_city.html',
            '/tools-select_district.html',
            '/tools-select_town.html'
        ],
        addrKeyName: [
            '',
            'state_id',
            'city_id',
            'district_id'
        ],
        addressAry: [
            
        ],
        provinceAry:[
            {
                id:'',
                name:''
            }
        ],
        cityAry: [
            {

            }
        ],
        villageAry: [],
        countyAry: [

        ],
        index: 0,
        windowW: '',
        navAction: true,
        maxLength: 4
      
    };
  },
  props: ["value"],
  mounted() {
        this.windowW = window.document.body.offsetWidth;
        this.getAddrAjax(0);
  },
  methods: {
        getAddrAjax(index,id,name,cb){
            var _this=this;
            this.index = index;
            var url=_this.addrAjaxUrl[index];
            if(id) url +='?'+_this.addrKeyName[index]+'='+id;
            url = config.store_api_domain+ '/m/' + url;
  
            httpPost(url,{}).then(function(res){
      
                if(res.data.success){
                    if(index == 0){
                        _this.provinceAry = res.data.data;
                    }else if(index == 1){
                        _this.cityAry = res.data.data;
                    }else if(index == 2){
                        _this.countyAry = res.data.data;
                    }else if(index == 3){
                        _this.villageAry = res.data.data;
                        _this.maxLength = 4; 
                    }
                    if(cb) cb();
                }else{
                    _this.maxLength = 3; 
                    _this.setAddrData();
                }
               
                
            })
        },
        addressCli(index,id,name){
            var _this = this;
            if(this.lock) return;
            this.lock = true;
            if(index == this.maxLength){
                if(this.addressAry.length == this.maxLength) this.addressAry.pop();
                this.addressAry.push({name,id});
            }else{
                this.addressAry.push({name,id});
            };

            
            if(index == 4){
                this.navAction = false;
                
                _this.setAddrData();
                return;
            }
            
            this.getAddrAjax(index,id,name,function(){
                _this.$refs.addressBox.style.transform = 'translateX('+ -_this.windowW * index +'px)';
                setTimeout(() => {
                    _this.lock = false;
                }, 300);
            })
        },
        tabCli(index){
            var _this = this;
            this.addressAry.splice(index,this.addressAry.length - index);
            this.navAction = true;
            if(index == 0){
                this.addressAry.pop();
               
            };

            _this.$refs.addressBox.style.transform = 'translateX('+ -_this.windowW * index +'px)';
        },
        setAddrData(){
            var _this = this;
            this.navAction = false;
            this.lock = false;
            var data ={};
            data.selectAddr=this.addressAry;
            let arrAddr=[];
            data.id=[];
            
            data.selectAddr.forEach(item => {
                data.id.push(item.id);
                arrAddr.push(item.name);
            }); 
            let len=data.id.length-1;
            
            data.addr='mainland:'+ arrAddr.join('/') +':'+data.id[len];

            this.$emit("input", data);
       
                _this.show = false;
            
        }
  },
created(){
    let Vm=this;
    
},
  components: {},
  computed: {
     
  },
  watch: {
   
  },
  filters:{
      formatAddr(value){
          return value.split(':')[1].split('/').join(' ')
      }
  }
};
</script>
<style  scoped lang="scss">
$pole: 75;
#address-select-modal{
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	background:rgba(0, 0, 0, 0.5);
	z-index: 1000;
}
.snow-container{
    bottom: 0 !important;
}

 .list {
            position:relative;
            display:block;
            padding:0 40rem/$pole;
            height:65rem/$pole;
            line-height:65rem/$pole;
            &:after {
                position: absolute;
                content:'';
                width: 100%;
                left: 0;
                bottom: 0;
                height: 1px;
                background-color: #B3B3B3;
                -webkit-transform: scale(1, .5);
                transform: scale(1, .5);
                -webkit-transform-origin: center bottom;
                transform-origin: center bottom;
            }
            li {
                position:relative;
                float:left;
                height:100%;
                margin-right:45rem/$pole;
                margin-left:8rem 53rem/$pole;
                color:#333;
                font-size:28rem/$pole;
                max-width:140rem/$pole;
                overflow:hidden;
                &.active {
                    color:#44bbff;
                }
                &.active:after {
                    content:"";
                    position:absolute;
                    left:0;
                    bottom:0;
                    width:100%;
                    height:4rem/$pole;
                    background-color:#44bbff;
                }
                &:last-child {
                    margin-right:0;
                }
            }
        }
        .arealist-div {
            width:400%;
            position:relative;
            transition:transform 0.3s linear;
        }
        .arealist {
            position:relative;
            padding:25rem/$pole 0 0;
            height:595rem/$pole;
            -webkit-overflow-scrolling: touch;
            overflow-y:auto;
            float:left;
            width:25%;
            &.z1 {
                z-index:1;
            }
            &.z2 {
                z-index:2;
            }
            &.z3 {
                z-index:3;
            }
            &.z4 {
                z-index:4;
            }
            li {
                margin:0 40rem/$pole;
                padding-bottom:20rem/$pole;
                font-size:28rem/$pole;
                color:#333;
                line-height:38rem/$pole;
            }
        }
</style>


