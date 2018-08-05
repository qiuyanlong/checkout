<template>
<div>

 
  <!-- 当前用户还没有添加地址的时候 !nowlist.deliver_json||!nowlist.area_valid -->
  <div  v-cloak v-if="get_isajaxdone&&address_list.length ==0">
    <div class="addr-main">
      <a :href="goAddAddress">
        <i></i>
        <span>请先添加收货地址</span>
      </a>
    </div>
  </div> 

<!-- 0.0 地址顶部通栏 start  盘算条件是通过是不是自提商品来进行判断-->
 <div v-else-if="get_ziti_list.is_ziti" class="address_v3_comments flex flex-align-center flex-pack-justify fff" @click="addresslistModel" >

       <div class="left">
          <h1>
             <template>{{get_ziti_default_address.name}}</template>  
             <template>{{get_ziti_default_address.mobile}}</template> 
           </h1>
         <p class="sub">
            <template>{{get_ziti_default_address.address_name}}</template>
            <template>{{get_ziti_default_address.addr}}</template>
         </p>
   
      </div> 
      <a class="right_arrow" ></a>     
 </div>

  <div v-else-if="address_list.length>0" class="address_v3_comments flex flex-align-center flex-pack-justify fff" @click="addresslistModel" >
       <div v-if="nowlist">
    		 <div class="left">
    	      <h1>
            
    	         <template v-if="nowlist">{{nowlist.name}}</template>  
    	         <template v-if="nowlist">{{nowlist.mobile}}</template>
    	       </h1>
    		   <p class="sub">
            
              <template v-if="nowlist.deliver_area">{{nowlist.deliver_addr}} {{nowlist.deliver_area}} {{nowlist.addr}}</template>   
              <template v-else>{{nowlist.area.split(':')[1].replace(/\//g,' ')}}  {{nowlist.addr}}</template>
    		   </p>
    	 	</div> 

     
       <template v-if="hasIncheckout">
           
           <template v-if="hasMRYX">
              <div class="bg_dmask" v-if="!nowlist.deliver_json||!nowlist.area_valid" >{{errAddrTxt}}</div> 
           </template>

           <template v-else>
              <div class="bg_dmask" v-if="!nowlist.area_valid" >{{errAddrTxt}}</div> 
           </template>

           
      </template>

       <template v-else>
        <div class="bg_dmask" v-if="hasMRYX&&!nowlist.deliver_json||!nowlist.area_valid" >{{errAddrTxt}}</div> 
      </template>

  
      </div> 
      <a class="right_arrow" ></a>    
  	</div>
<!-- 0.0 地址顶部通栏 end -->






  <!-- 1.0 普通地址列表弹窗 -->
 
	<van-popup v-model="addressshow" v-if="address_list.length" class="jianrongclass"  ref="commonAddrmodel">
		<div class="add_content">
		   <div class="diahead flex flex-pack-justify flex-align-center">
		   	  <p>选择收货地址</p>
			    <a class="close" @click="addressshow = false"></a>
		   </div>
           <div class="list_wrap_scroll" @touchmove.stop.self="noop($event)">
	           	  <div class="dis_list flex flex-pack-justify" v-for="(addr,index) in address_list">
	           	    <div class="addres_sub" :class="{selected:index == get_now_address_index}" @click="selectAddress(addr,index,'normal')">
	           	  	 <p class="sj">{{addr.name}} {{addr.mobile}}</p>
	           	     <p class="add-txt">

    	           	      <template v-if="addr.deliver_area">{{addr.deliver_addr}} {{addr.deliver_area}} {{addr.addr}}</template>  	
                        <template v-else>{{addr.area.split(':')[1].replace(/\//g,' ')}}  {{addr.addr}}</template>

                     <div class="dmask" v-if="error_addres(addr)"><p>{{errAddrTxt}}</p></div> 
	           	     </p>
	           	  </div>
	           	  <a class="editors" :href="goEditAddress(addr)"></a> 
	           </div> 
           </div>

        <div>
          <a class="add_new_address" :href="goAddAddress" v-if="address_list.length < 10">新增收货地址</a>
          <a class="add_new_address"   @click="addressTooMuch" v-else>新增收货地址</a>
        </div>
		</div>
	</van-popup>
  


<!-- 2.0 每日优鲜配送弹窗列表弹窗 -->
<van-popup v-model="youxian_address_list" position="bottom" :overlay="true" :close-on-click-overlay="false" > 
   <div class="addr_list_main">
      <div class="addr_list_title">生鲜类商品需完善配送地址</div> 

      <ul  @touchmove.stop.self="noop($event)">
          <li v-for="(addr,index) in address_list" @click="selectAddress(addr,index,'shengxain')">
            <p>{{addr.deliver_addr}} &nbsp; {{addr.deliver_area}} &nbsp; {{addr.addr}}</p> 
            <span>{{addr.name}}&nbsp;{{addr.mobile}}</span> 
            <span class="error" v-if="!addr.area_valid||!addr.deliver_json">
              <img src="../view/checkout/images/error.png">
              地址库升级，请完善地址信息
            </span>
          </li>
        </ul> 
        <a class="add_addr" :href="goAddAddress" v-if="address_list.length < 10">新增收货地址</a>
        <a class="add_addr"  href="javascript:void(0)"  @click="addressTooMuch" v-else>新增收货地址</a>
    </div>
</van-popup>



<!-- 3.0 自提地址弹窗，自提跟普通商品的弹窗有区别，不能编辑，不能删除 -->
 <van-popup v-model="ziti_model_show" >
    <div class="add_content zitilist">
       <div class="diahead flex flex-pack-justify flex-align-center">
          <p>选择自提地址</p>
          <a class="close" @touchend="ziti_model_show=false"></a>
       </div>
           <div class="list_wrap_scroll" @touchmove="noop($event)">
                <div class="dis_list flex flex-pack-justify" v-for="(addr,index) in  zitilist" :class="{ziti_active:index == zitiindex}">
                  <div class="addres_sub" @click="selectAddress(addr,index,'ziti')">
                    <p class="sj">{{addr.address_name|filtertext}} &nbsp;</p> 
                   <p class="add-txt">
                    <template>{{addr.addr}}</template>
                    <template>{{addr.name}}</template>
                    <template>{{addr.mobile}}</template>
                   </p>
                </div>
             </div> 
           </div>
    </div>
  </van-popup> 

</div>
</template>

<script>
/**
 * 页面相关的注释区域：
 * 
 * 1: 地址拼接方法: region_tree[1]+region_tree[2]+deliver_area+ res.addr 
 * 
 */
import config from '@/config/config' 
import { httpGet, httpPost,BffPost,Jsonp} from '@/api/base'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
import { Toast } from 'vant'



export default{
	name: 'Address',
	data(){
		return {
			addressshow:false,  
      ziti_model_show:false,
      youxian_address_list:false,           // 每日优鲜是否显示地址列表开关 只适合cart页面展示使用
      ischeckout:true,                      // 是不是checkout页面，false 不是
      is_has_action_select_address:false,   // 是否打开进去过
      errAddrTxt:'地址库升级，请完善地址信息',
		}
	},
  filters:{
    deleteLine(v){
       return v.toString().replace(/-/g,' ')
    }
  },
	computed:{
    ...mapState({
        hasMRYX:state =>state.cart.hasMRYX, 
     }),

	   ...mapGetters([
        'address_list',          // 地址存贮列表
        'get_product_list',      // 产品列表
        'get_isajaxdone',        // 地址列表是否请求成功
	   	  'get_now_address_index', // 默认地址对应的index  没有默认就是0
	   	  'get_key'              , // key
        'get_goods_list',
        'get_has_mryx_goods',
        'get_ziti_list',          // 自提选项，包括是否是自提标志，默认选准index,字帖列表
        'get_ziti_default_address', // 自提默认的地址
	   ]),
	  
     // 默认是选择是哪一个，如果没有默认地址，就默认第一个为默认地址
	   nowlist(){  
        return this.address_list[this.get_now_address_index]	
     },
     zitiindex(){
         var r = 0
         this.get_ziti_list.ziti_address&&this.get_ziti_list.ziti_address.forEach((item,index)=>{
           if(item.addr_id == this.get_ziti_default_address.addr_id){
              r = index
           }
        })  

        return r
     },
     
    hasIncheckout(){
        return window.location.pathname.indexOf('checkout.html')
    }, 
     zitilist(){
        // 自提地址列表
       return this.get_ziti_list.ziti_address
     },

    // 新增收货地址
     goAddAddress(){
      let _href = window.location.href.split('&addrId')[0];

      let tolink
      if(this.ischeckout){
          tolink=config.store_domain+'/m/member-add_receiver.html?checkoutKey='+this.get_key+'&checkoutUrl='+_href;
      }else{
          tolink=config.store_domain+'/m/member-add_receiver.html?&cartUrl='+_href;
      }


      
      if(this.get_has_mryx_goods){
          tolink+='&fromtype=mryx';
      }
         return tolink
     },
     

	},
	methods:{

     
     // action 方法映射
		 ...mapActions([
        'total_quest',      //
        'get_address_list', // 地址列表映射
        'toggleAddress',    // 地址切换 货物列表映射
        'prolist',           // 产品列表
        'set_ziti_default_address'

      ]),

     // 点击顶部地址栏进入地址列表，需要根据是自提地址或者普通地址来计算 
     addresslistModel(){ 
        // 是否是自提
        if( this.get_ziti_list.is_ziti){
            this.ziti_model_show = true         
        }else{
            this.addressshow = true
        } 

        
        //this.$refs.commonAddrmodel.$el.style.left = 
        this.$nextTick(()=>{
             //console.log(window.outerWidth,this.$refs.commonAddrmodel.$el.offsetWidth)
             let winw = window.outerWidth,
                 tarw = this.$refs.commonAddrmodel.$el.offsetWidth,
                 offsets = (winw-tarw)/2 

                 //this.$refs.commonAddrmodel.$el.style.left = offsets 
        });
     },
     noop(){},  //null function

     // 编辑地址
		 goEditAddress(item){
      let id = item.addr_id;
      let _href = window.location.href.split('&addrId')[0];
      let tolink
      if(this.ischeckout){
          tolink=config.store_domain+'/m/member-modify_receiver-'+id +'.html?checkoutKey='+this.get_key+'&checkoutUrl='+_href;
      }else{
          tolink=config.store_domain+'/m/member-modify_receiver-'+id +'.html?cartUrl='+_href;
      }


      if(this.get_has_mryx_goods){
         
          // 是每日优鲜过去的
          tolink+='&fromtype=mryx';
      }
      return tolink;
    },

		// 选择地址  order接口
		selectAddress(address,index,type){
       /*
          选择地址只有来源：正常置于顶部的地址选择、在cart页面底部弹出来的生鲜地址选择，自提地址选择
          normal   shengxain
       */    
    

   if(!this.get_ziti_list.is_ziti){

       // 每日优鲜的判断条件跟普通的商品时不一样的 
       // 无效的地址不让点击 
       
       if(this.hasMRYX){
          if(address&& !address.area_valid||!address.deliver_json){
             return  
          } 
       }else{
         if(address&& !address.area_valid){
             return  
          } 
       }
          
       this.addressshow = false
          
		 }else{
        this.ziti_model_show = false  
     }


     this.$emit('selectFn',this,address,index,type)
   }, 
    

	  addressTooMuch(){
       Toast('最多添加10个收货地址')
    },

    // 无效的地址 错误提示
    error_addres(v){


       if(this.hasMRYX){
            if(!v.deliver_json||!v.area_valid){
               return true
            }
       }else{
            if(!v.area_valid){
               return true
            }
       }
    } 

  },
  beforeCreate(){
     
  },
  created(){
     let path = this.$route.path  // /neigou/checkout.html 
     if(path.indexOf('cart.html')!=-1){
        this.ischeckout = false
     }else if(path.indexOf('checkout.html')!=-1){
        this.ischeckout = true 
     }

       this.get_address_list()


       this.get_ziti_list.ziti_address&&this.get_ziti_list.ziti_address.forEach((addr,index)=>{
           if(addr.def_addr == 1){
              this.set_ziti_default_address(addr)
           }
       })
  },
  filters:{
    filtertext(v){
        return v.toString().replace('-','')
    }
  },
  watch:{
    // 当前的默认地址是否符合每日优鲜的配送条件 默认是符合条件 false 无效的每日优鲜配送地址
     // address_list(newl){
     //     newl.forEach((val,index,arr)=>{
     //       if(val['def_addr']&& !val['deliver_json']){
     //           // 是默认地址  且每日优鲜的判断条件满足 如果不在checkout页面的话 
     //           // 
     //           // 不再检验每日优鲜的弹窗
     //            if(!this.ischeckout){
     //                //this.youxian_address_list = true
                    
     //                if(this.hasMRYX){
     //                    // 购物车里面有每日优鲜 需要严格的校验四级地址
     //                } 
     //            }        
     //       }
     //    })
     // },
     // 

    
     
  },
  mounted(){
    
	}
}
</script>

<style>
[v-cloak] {
    display: none;  
}
</style>

<style lang="scss" scoped>

@mixin fz($font-size) {
    font-size: $font-size;
    [data-dpr="2"] & {
        font-size: $font-size * 2;
    }
    [data-dpr="3"] & {
        font-size: $font-size * 3;
    }
}

@mixin dpr-img($url,$name,$type:".jpg"){
    background-image: url($url+"2x/"+ $name+"@2x"+$type);
    [data-dpr="3"] &{
       background-image: url($url+"3x/"+ $name+"@3x"+$type);
    }
}



@mixin table-center {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

@mixin poa-center($w, $h) {
    position: absolute;
    width: $w;
    height: $h;
    left: 50%;
    top: 50%;
    transition: translate(-50%, -50%)
}

@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

@mixin t-overflow($line:1) {
    @if $line==1 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    @else {
        display: -webkit-box;
        -webkit-line-clamp: $line;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}


/* 布局相关函数定义rem大小*/
@function pxm($px) {
  @return ( ($px / 75) * 1 ) +rem;
}

@mixin top_line{
    border-top:1px solid #dddddd;
    [data-dpr='3'] &{
          border-width:1.5px;
      } 
}


.flex{
    /* 设置弹性布局 */
    display:-webkit-box; 
    display:-webkit-flex;
    display:-ms-flexbox; 
    display:flex;        
}
.flex-1{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:1;
    -webkit-flex:1;    
    -ms-flex:1;        
    flex:1;          
}
.flex-2{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:2;
    -webkit-flex:2;    
    -ms-flex:2;        
    flex:2;          
}
.flex-pack-center{
    /* 水平布局下的子元素 水平居中 */
    -webkit-box-pack: center;          
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center
}
.flex-align-center{
    -webkit-box-align: center;/* android 2.1-3.0, ios 3.2-4.3 */
    -webkit-align-items: center;/* Chrome 21+ */
    -ms-flex-align: center;/* WP IE 10 */
    align-items: center;/* android 4.4 */
}
.flex-pack-justify{
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}


/**
 * checkout页面相关的
 */
html{
    -webkit-overflow-scrolling: touch;  
    -moz-overflow-scrolling: touch;
    -o-overflow-scrolling: touch;
    overflow-scrolling: touch;
}

.right_arrow{
   width:pxm(20);
   height: pxm(30);
   display: inline-block;
   background: url('../view/checkout/images/right_array.png') 0 0 no-repeat;
   background-size: contain;
}
.margin-left_x{
    margin-left: pxm(16);
}
.fff{
    background: #fff;
}

.margin-top_x{
    margin-top: pxm(20);
}
.margin-left_10{
    margin-left: pxm(10);
}
.padding-bottom_27{
    padding-bottom: pxm(27);
}

@mixin blue_c{
    color:#44bbff;
}

.blue_c{
     color:#44bbff;
}
.black_c{
    color:#3c3c3c;
}

.address_v3_comments{ 
    width:100%;
    padding:pxm(14) pxm(20)  pxm(11);
    position: relative;
    margin-bottom: pxm(20);
    .left{
       padding-right: pxm(10);
        h1{
          color:#333333;
          font-size: pxm(32);
          line-height: pxm(60);
        }
        & .sub{
          color:#666666;
          font-size: pxm(26);
          line-height: pxm(47);
          text-overflow: ellipsis;
          word-break: break-all;
          overflow:hidden;
        }
    }
}

.address_v3_comments::after{
        content: '';
        position: absolute;
        bottom: -5px;
        left:0;
        background: url('../view/checkout/images/line.png') 0 0 no-repeat;
        width:100%;
        background-size:cover;
        height: pxm(5);
}

/*地址选择*/

.add_content{
  width: 9.06667rem;
  padding: pxm(20);
  height: 100%;
  background: #fff;
  font-size:0.4rem;
  border-radius: .10667rem;

  .diahead{
    position: relative;
    padding: 0 .26667rem;
    line-height: 1.06667rem;
    height: 1.06667rem;
    color: #333;
    font-size: .4rem;
    border-bottom: 1px solid #ddd;
  }
  .close{
     width:pxm(34);
     height: pxm(30);
     display: inline-block;
     display: inline-block;
     background: url('../view/checkout/images/close.png') 0 0 no-repeat;
     background-size:contain;
  }
  .dis_list{
     border-bottom: 1px solid #ddd;
    position: relative;
    padding: .2rem 0 .2rem .2rem;
    color: #444;
    line-height: 1.5;
    text-align: left;    
  }
  .sj{
     padding-right: 1.46667rem;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    font-size: .37333rem;
  }
  .add-txt{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    color: #666;
    max-height: 99rem;
    padding-right: 1.46667rem;
    text-overflow: ellipsis;
    word-break: break-all;
    overflow: hidden;
    font-size: .37333rem;
  }
  .editors{

    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -.48rem;
    width: 1.46667rem;
    height: .96rem;
    border-left: 1px solid #ddd;
    background: url('../view/checkout/images/editor.png') 0 0 no-repeat; 
    background-size: .45333rem .45333rem;
    background-position: 50%;
  }
  .add_new_address{
    z-index: 1;
    margin-top: pxm(20);
    display: block;
    height: 1.2rem;
    border-radius: .10667rem;
    line-height: 1.06667rem;
    background-color: #4bf;
    color: #fff;
    font-size: .37333rem;
    line-height: 1.2rem;
    text-align: center;
  }
  .selected{
     padding-left: 1.2rem;

  }
  .selected:before{
    content: " ";
    width: .53333rem;
    height: .53333rem;
    background: url('../view/checkout/images/gou.png') 0 0 no-repeat;
    display: block;
    position: absolute;
    z-index: 2;
    background-size: 100% 100%;
    left: .32rem;
    top: 50%;
    margin-top: -.26667rem;
  }
  
}



.jifen_wrap{
    padding-left: pxm(30);
}
.jifen{
    @include top_line;
}

.beizhu{
    font-size:pxm(28);
    color:#333333;
    background: #fff;
    line-height: pxm(100);
    padding-right:pxm(30);
    @include top_line;
}

.not_must_write{
    color:#aeaead;
}


textarea::-webkit-input-placeholder {
color: #d3d3d3 !important;
}
textarea:-moz-placeholder {
color: #d3d3d3 !important; 
}
textarea::-moz-placeholder {
color: #d3d3d3 !important; 
}
textarea:-ms-input-placeholder {
color: #d3d3d3 !important; 
}

.list_wrap_scroll{
  overflow-y:scroll;
  max-height: 6.66667rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -webkit-transform:translateZ(0);
}

.addr-main {
    position: relative;
    background: #fff;

    a {
    display: block;
    width: 100%;
    height: 100%;
    color: #4bf;
    overflow: hidden;
    padding: .66667rem pxm(30);
    font-size: .4rem;
    line-height: .66667rem;
 
     i {
      margin-right: .13333rem;
      display: inline-block;
      width: .53333rem;
      height: .53333rem;
      vertical-align: middle;
      line-height: 6rem; 
      background: url('../view/checkout/images/plus.png') no-repeat;
      background-size: 100% 100%;
     }

   }
   a:after {
     content: ">";
     float: right;
    }
   span {
     vertical-align: middle;
   }
}

 .addr-main:after{
    content: '';
    position: absolute;
    bottom: -5px;
    left:0;
    background: url('../view/checkout/images/line.png') 0 0 no-repeat;
    width:100%;
    background-size:cover;
    height: pxm(5);
}



.dmask {
    color: #f53e3e;
    font-size: .34667rem;
    p {
      padding-left: .53333rem;
      display: inline-block;
      background: url('../view/checkout/images/error.png') no-repeat;
      background-size: .42667rem .42667rem;
      background-position: 0;
   }
}
.bg_dmask{
    position: absolute;
    top: 0; 
    height: 100%;
    width:100%;
    left:0;
    background: rgba(243,14,14,.8);
    z-index: 1;
    text-align: center;
    display: block;
    color: #fff;
    font-size: .4rem;
    line-height: pxm(160);
}


.addr_list_main {
    z-index: 99999;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 10.4rem;
    background: #fff;
}
.addr_list_main .addr_list_title {
    line-height: 1.33333rem;
    height: 1.33333rem;
    font-size: .4rem;
    color: #ababab;
    text-align: center;
    border-bottom: .02667rem solid #eee;
}
.addr_list_main ul {
    height: 7.73333rem;
    overflow: hidden;
    overflow-y: auto;
    -webkit-transform:translateZ(0);
    -webkit-overflow-scrolling: touch;
    margin: 0 .26667rem;
    padding: pxm(10) 0;
}
.addr_list_main ul li {
    width: 100%;
    background: #f4f4f4;
    margin-bottom: .26667rem;
    padding: .26667rem;
}
.addr_list_main ul li p {
    line-height: .58667rem;
    max-height: 99rem;
    font-size: .4rem;
    color: #333;
}
.addr_list_main ul li span {
    display: block;
    max-height: 99rem;
    font-size: .4rem;
    line-height: .58667rem;
    padding-top: .13333rem;
    color: #666;
}
.addr_list_main ul li span.error {
    font-size: .37333rem;
    vertical-align: middle;
    color: red;
}
.addr_list_main ul li span {
    display: block;
    max-height: 99rem;
    font-size: .4rem;
    line-height: .58667rem;
    padding-top: .13333rem;
    color: #666;
}
.addr_list_main a.add_addr {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 1.33333rem;
    line-height: 1.33333rem;
    font-size: .4rem;
    color: #fff;
    background: #4bf;
    text-align: center;
}
.addr_list_main ul li span.error img {
    height: .4rem;
    margin-right: .13333rem;
    vertical-align: middle;
    position: relative;
    top: -.04rem;
}
.zitilist .sj,.zitilist .add-txt{
  padding-right:0;
}
.ziti_active p{
   color:#39b9ff!important;
}
</style>














