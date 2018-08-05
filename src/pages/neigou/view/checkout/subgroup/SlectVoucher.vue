<template>
<div class="voucherlist" ref="voucherlist" :style="{'height':bodyHeight+'px'}">
<div class="voucherinner">

  <section class="voucher" v-for="vo in voucherList" v-if="vo.list.length">
        <h1 v-if="vo.type == 'blue'">满减券</h1>
        <h1 v-if="vo.type == 'green'">免邮券</h1>
        <h1 v-if="vo.type == 'purple'">免税券</h1>
        <ul>
          <li :class="[vo.type,{'selected':vo.selectedId == index }]"  v-for="(cur,index) in vo.list" v-if="vo.isAll || index < 6" @click="selectIt(cur,vo,index,false)">
                <div class="box">
                     <p class="desc" v-if="vo.type == 'blue'"><span>{{showVouchName(cur)}}</span><small>有效期:{{cur.valid_time}}</small></p>
                     <p class="desc" v-if="vo.type == 'green'"><span>免邮券</span><small>有效期:{{cur.valid_time }}</small></p>
                      <p class="desc" v-if="vo.type == 'purple'"><span>免税券</span><small>有效期:{{cur.valid_time }}</small></p>

                   <p class="tag" v-if="vo.type == 'blue'">{{cur.rule_name}}</p>
                   <p class="tag" v-if="vo.type == 'green' || vo.type == 'purple'">{{cur.name}}</p>
                </div>
            </li>
        </ul>
        <p class="more" @click.stop="vo.isAll = !vo.isAll" :class="{'open':vo.isAll}" v-if="vo.list.length > 6">
            {{vo.isAll?'收起':'展开'}}
            <i></i>
        </p>
    </section>

 <!--  <section class="totalbar-zhanwei160"></section> -->
  <div class="mytotalbar">
      <div class="alreadysel">
          <p class="info" >已选<i>{{numVoucher}}</i>张</p>
          
          <ul class="list">
             <li v-for="tag in selectedTag" >
                 {{tag}}
             </li>
          </ul>
           <a class="go"  @click="selectMyVocucher">确认</a>
      </div>
      <div class="iphonex40"></div>
  </div>

</div>
</div>
</template>

<script>
/**
 * vocher       优惠券
 * dutyfree     免税券  本期没有免息券
 * freeshipping 免邮券
 */
import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
import { Toast } from 'vant'  
import util from '@/api/util'

// 将一个对象转化为数组
const objToArray = (array) => {
    var arr = []
    for (var i in array) {
        if(Array.isArray((array[i]))){
            for(var j=0; j<array[i].length; j++){
                arr.push(array[i][j])
            }
        }else{
             arr.push(array[i])
        }
    }
    return arr;
};


export default {
    name: 'SlectVoucher',
    data(){
        return {

            shopid:null,            //  当前进来的这个店铺的id
            vocher_type:'',      //  当前优惠券的类型  coupon,all 
            vocher_typeid: 2,    //  当前的支付方式的id  是国内支付还是国外支付 默认是国内支付

          
            voucherList:[],      // 自己组装的对象   也是页面的数据源
            /*
              结构如下：
            [
              {isAll:false    全选
              list:Array(4)   券列表
              selectedId:-1   没有选择
              shopName:"购物车001"
              type:"blue"}
            ]
             */
            selectedVoucher:{  // 选择的全列表
                voucher:{},
                freeshipping:{},
                dutyfree:{}

            },
            numVoucher:0,      // 选择优惠券的数量 
            selectedTag:{},  // 底部标签列表映射对象


            shoplist:[]

   
        }
    },
    computed:{
       
       ...mapGetters([
          'get_key',
          'get_now_address_index',
          'address_list',  
          'get_goods_group',     // 初始话列表
          'get_jifen_switch',
          'get_is_use_jifen',
          'get_cartallvouchlist'
       ]),

       // 底部推荐商品 是一个从后端返回的数组
       productNum(){
         return objToArray(this.recomentPro)
       },
     
       // 获取当前切换地址的列表
       addressList(){
          return this.address_list[this.get_now_address_index]
       }, 
    },
    filters:{
        timeFormate(v){
            return v && util.pattern('Y-m-d',v)
        },
        
    },
    watch:{
        'selectedVoucher':{
          handler:function(val,oldVal){ 
              this.numVoucher  = Object.keys(val.voucher).length +
                                 Object.keys(val.freeshipping).length +
                                 Object.keys(val.dutyfree).length


          },
          deep:true,
          immediate:true,
         },  
         

    },
    methods:{
        ...mapActions([
           'prolist',
           'voucher_update',
           'cartvoucher' 
         ]),

       showVouchName(cur){
          let name =''
          if(cur.type == 'money'){
              if(cur.limit_cost == 0) name =  '减'+ parseInt(cur.money)
              else name =  '满'+parseInt( cur.limit_cost )+'减'+ parseInt(cur.money)
          }else{
              if(cur.limit_cost == 0) name = parseInt( cur.discount )+'折'
              else name =  '满'+parseInt(cur.limit_cost)+'打'+parseInt( cur.discount )+'折'
          }
          return name
       },  
       //点击确定的时候选择优惠券，添加到state里面的对象里
       selectMyVocucher(){  
          //this.cartvoucher({type:'',id:'',val:'',status:true,allupdate:this.selectedVoucher}) 
           // 地址全部传递获取的数据就可以      
          // this.prolist({el:this,key: this.get_key,type:'init',fn:(respon)=>{setTimeout(()=>{this.$router.go(-1)},500)}})
          setTimeout(()=>{this.$router.go(-1)  },500)
       },



// 点击使用券        
selectIt(list,vo,index,binit){
  let type = vo.type,voucherType  
  this.$pageLoading.show()  

if(vo.selectedId == index){
   vo.selectedId = -1  
  // 第二次点击的时候取消选择
    if( type == 'blue'){  
      this.$set(this.selectedVoucher,'voucher',{})
      this.$delete(this.selectedTag,'voucher')
      voucherType = 'voucher'     
    }else if( type == 'green' ){
          //t = 'freeshipping' 
       this.$set(this.selectedVoucher,'freeshipping',{})
       this.$delete(this.selectedTag,'freeshipping')  
       voucherType = 'freeshipping'      
     }else if(type == 'purple'){
          //t = 'dutyfree' 免税
      this.$set(this.selectedVoucher,'dutyfree',{})
      this.$delete(this.selectedTag,'dutyfree')
      voucherType = 'dutyfree' 
     }

}else{       
   

    // 更新添加券信息
     vo.selectedId = index
    if( type == 'blue'){
          // 更新的时候需要判断在哪里
       this.$set(this.selectedVoucher.voucher,[this.shopid||this.vocher_type],[list.number])
       this.$set(this.selectedTag,'voucher',this.showVouchName(list))
       voucherType = 'voucher'    
     }else if( type == 'green' ){
          //t = 'freeshipping' 
       this.$set(this.selectedVoucher.freeshipping,[this.shopid||this.vocher_type],[list.coupon_id])
        this.$set(this.selectedTag,'freeshipping','免邮券')
        voucherType = 'freeshipping'   

     }else if(type == 'purple'){
 
        this.$set(this.selectedVoucher.dutyfree,[this.shopid||this.vocher_type],[list.coupon_id])       
        this.$set(this.selectedTag,'dutyfree','免税券')
        voucherType = 'dutyfree' 

     }
    
  } 



 if(!binit){
    // update ui的时候不更新这个数据 只更新ui
    this.cartvoucher({type:voucherType,id:this.shopid||'all',val:list.number||list.coupon_id,status:false,allupdate:{}})
 }
  // 每次点击更新状态
  
  setTimeout(()=>{ this.$pageLoading.hide() },500)
},

// 通过一个传递一个id  查询当前的店铺对应的券   plat 为选填参数 是all  
// 如果用户刷新行为 找不到数据源 就直接跳转到cart页面
query_quanById(sourceData,id){
    let res = sourceData,response = {} //this.get_cartDate,     
     // function  //should be an object
     if(typeof res == 'function' && res){
         Toast('券信息丢失，即将跳转到您的购物车') 
         //setTimeout(()=>{ this.$router.go(-1)},1000) 
     } 
    if(this.vocher_type != "all"){
       if(res){
          let type_list = res.body.type_list // array  支付类型 全球支付 国内支付
           // 不是全平台的券 nations 是一个集合 关于是国内还是全球支付的
           type_list.forEach((nations,index,arr)=>{
              //console.log(nations)

              if(nations.type_id == this.vocher_typeid){

                   nations.shop_list&&nations.shop_list.forEach((shop,ind)=>{
                      // shop 是当前所有满足条件的店铺
                     
                      // 当前的店铺id 跟传进来的相等
                      if( shop.shop_id ==this.shopid){
                         
                          if(shop.shop_voucher)
                            { 
                                response['list'] = shop.shop_voucher
                                response['shop_name'] = shop.shop_name
                            }    
                      }

                   })
                }

           })
    }
 }else{
          response['list'] = res
          response['shop_name'] = ''
  }
    return response
},

// 券数据组装
voucherGroup(){ 
let tem = {},
    type = '',
    origindata = {},
    dutyfree = origindata.dutyfree?origindata.dutyfree:[],
    freeshipping = origindata.freeshipping?origindata.freeshipping:[],
    voucher = origindata.voucher?origindata.voucher:[];
    if(this.vocher_type == 'coupon'){
       // checkout 页面来的 店铺级别的券 voucherList
       // 过滤一下数据格式
       origindata = this.query_quanById(this.get_goods_group,this.shopid)
    }

    if(this.vocher_type == 'all'){
       // checkout 页面来的 全平台的券 使用的是传递的格式
        origindata = this.query_quanById(this.$route.params.list)
        //console.log('全平台券数据',origindata,this.$route.params)
    }
    // 非全平台券进入     
    if(!origindata) return 
    for(let vocher in origindata.list){
         if(vocher == 'voucher'){ tem['type']  = 'blue'}
         else if(vocher == 'dutyfree'){tem['type']  = 'purple'}
         else if(vocher == 'freeshipping'){ tem['type']  = 'green' }
          
          tem['selectedId']  = -1                     // 最后检查的时候监测如果是 -1 就是没有选择 
          tem['isAll']  = false                       // 是否折叠参数
          tem['shopName']  =  origindata.shop_name    // 店铺名称
          tem.list = origindata.list[vocher]
          this.voucherList.push(tem)
           
     if(Object.keys(tem).length){ tem = {} } }
      
     //console.log("组装后的数据",this.voucherList)
  }
},
created(){
    // 来源： cart checkout
    
    this.shopid = this.$route.query.shopid
    this.vocher_type = this.$route.query.type 
    this.vocher_typeid = this.$route.query.typeid  // 支付方式
    this.bodyHeight =  document.documentElement.clientHeight 

    // 选券页面 检测时机 如果刷新导致券数据丢失就直接跳转到前面的页面
    try{
       this.shoplist = this.get_goods_group.body.type_list[0].shop_list
    }catch(e){
       if(e.toString){
          if(e.toString().indexOf('Cannot read property \'type_list\' of undefined')){
             console.log(e.toString())
             setTimeout(()=>{
                this.$router.go(-1)
             },2000)
          }

       }
    }

    let Vm = this,
        curshop,
        curvoucher,
        storeVouch,
        indexlist

   // console.log('传递总数据',this.get_cartallvouchlist)  

   

    //每次进券页面 就要检测store里面的券容器是否存在，还原来数据状态

    // 获取券有多张 但是店铺是唯一的 拿到存贮里面对应的店铺 
     curshop = this.shoplist.find(shop=> shop.shop_id ==  this.shopid)
     storeVouch = this.get_cartallvouchlist

     //console.log('传递过来的存在的券数据',storeVouch)

     if(!Object.keys(storeVouch['voucher']).length&&
         !Object.keys(storeVouch['freeshipping']).length&&
         !Object.keys(storeVouch['dutyfree']).length
        ){ 

       // console.log('没有传递数据加载本身的数据')
        this.voucherGroup()  
        return 
     } 

     //console.log('有了选择的数据了')

    
     if(this.vocher_type == 'all'){
        // 全平台券
        curvoucher = this.$route.params.list
     }else{
         // 拿到当前店铺下的所有券 当前给的的几张券一定在这个店铺的券里面
         curvoucher = curshop.shop_voucher
     }
     

      // 当前店铺下面的所有券遍历
      for(let v in curvoucher){
        // 空的就直接跳过
        let tem={},middle={}

        if(v == 'voucher') tem['type']  = 'blue'
        else if(v == 'dutyfree') tem['type']  = 'purple'
        else if(v == 'freeshipping') tem['type']  = 'green'
        
        // 当前店铺本身没有该类型的券 比如免邮券  就不在组装数据了 直接跳出来
        if(!Object.keys(curvoucher[v]).length) continue
        curvoucher[v].forEach((vo,index)=>{  //vo 具体这张券的数据 
                            
            tem['isAll']  = false                       
            if(this.vocher_type == 'all'){
               tem['shopName']  = '全平台券'
            }else{
               tem['shopName']  =  curshop.shop_name
            } 

            tem['list'] = curvoucher[v] 

            if(vo.type == 'money' || vo.type == 'discount'){

              if(storeVouch[v][this.shopid||'all']){
               //console.log('all',storeVouch[v][this.shopid||'all'][0] )
                  if(storeVouch[v][this.shopid||'all'][0] == vo.number){  
                     this.selectIt(vo,tem,index,true) 
                     tem['selectedId']  = index 
                  }
              }
                  
                 
            }else{
   
                if(storeVouch[v][this.shopid||'all']){
                    if(storeVouch[v][this.shopid||'all'][0] == vo.coupon_id){
                       this.selectIt(vo,tem,index,true)
                       tem['selectedId']  = index 
                    }
                }

            }
             
        }) 
     // console.log('tem',tem)
       this.voucherList.push(tem)     
   }

 


},
  mounted(){  
     // this.$nextTick(()=>{
     //   let adoms = this.$refs.voucherlist,
     //       domH =  adoms.offsetHeight,
     //       wheight = document.documentElement.clientHeight

     //   if(domH<wheight){
     //      adoms.style.height =( wheight - 100 )  / 34.5 +'rem'
     //   }
     
     // })
  }
}


</script>

<style lang="scss" scoped>
@import '../.././cart/css/commen.scss';

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
.voucherinner{
  padding-bottom: 2.5rem;
}
.good-list{
    position:relative;
    .icon-close{
      position:absolute;
      top:rem(45);
      right:rem(40);
      width:rem(26);
      height:rem(25);
      display:block;
      background: url('../images/close_1.png') no-repeat;
      background-size:100% 100%;
    }
    h1{
        padding:rem(35) 0 rem(15);
        line-height:1.5;
        color:#343434;
        font-size:rem(30);
        letter-spacing: rem(5);
        text-align:center;
        span{
            color:$blue;
        }
    }
    .sub{
        font-size:22rem/$pole;
        color:#858585;
        text-align:center;
        letter-spacing: rem(2);
    }
    .gdlist{
        margin:rem(50) 20rem/$pole;
        &:after{
            @include clear();
        };
        li{
            position:relative;
            float:left;
            margin:0 rem(10) rem(12) 0;
            width:rem(170);
            height:rem(170);
            overflow: hidden;
            border:1px solid $bordercolor;
            padding:rem(20);
            text-align:center;
            @include dpr3border();
            &:nth-of-type(4n){
                margin-right:0;
            }
            span{
                position:absolute;
                top:rem(7);
                right:rem(7);
                color:#fff;
                height:rem(30);
                padding:0 rem(15);
                font-size: rem(14);
                text-align: center;
                line-height: rem(30);
                border-radius:rem(30);
                background-color:#ff8534;
            }
          img{
            max-width:100%;   
          }  
        }
    }
    .gdnull{
      padding:rem(50) 0;
      text-align:center;
      img{
        width:rem(241);
        height:rem(159);
      }
      &>p{
        margin-top:rem(30);
        width:100%;
        font-size:rem(30);
        line-height:1.5;
        color:#939ab1;
        letter-spacing:rem(5);
        text-align:center;
      }
    }
}

.voucher{
    margin-bottom:rem(20);
    padding-top:rem(60);
    background-color:#fff;
    overflow:hidden;
    &>h1{
        padding:0 rem(20) rem(8);
        color:#333;
        font-size:rem(28);
        letter-spacing:rem(2);
        line-height:1.5;
    }
    .more{
        width:100%;
        height:rem(88);
        display:flex;
        justify-content:center;
        align-items:center;
        border-top:1px solid $bordercolor;
        @include dpr3border();
        color:#7f7f7f;
        font-size:rem(28);
        letter-spacing:rem(2);
        &.open{
            i{
                top:rem(-5);
                border-top:rem(10) solid transparent;
                border-bottom:rem(10) solid #7f7f7f;
            }
        }
        i{
            position:relative;
            top:rem(5);
            margin-left:rem(5);
            display:inline-block;
            width:0;
            height:0;
            border-top:rem(10) solid #7f7f7f;
            border-left:rem(10) solid transparent;
            border-right:rem(10) solid transparent;
            border-bottom:rem(10) solid transparent;
        }
    }
    &>ul{
        padding-top:rem(12);
        margin:0 rem(20) rem(20);
        &:after{
            @include clear();
        }
        li{
            float:left;
            position:relative;
            margin-right:rem(10);
            margin-bottom:rem(12);
            overflow:hidden;
            font-size:0;
            &:before,&:after{
                content:"";
                position:absolute;
                top:rem(94);
                width:rem(18);
                height:rem(18);
                background-color:#fff;
                border-radius:100%;
                z-index:1;
                border:rem(2) solid #f5fbff;
            }
            &:before{
                left:rem(-9);
            }
            &:after{
                right:rem(-9);
            }
            &:nth-of-type(3n){
                margin-right:0;
            }

            /*优惠券*/
            &.blue{
                &:before,&:after{
                    border-color:$blue;
                }
                .box{
                    background-color:#f5fbff;
                    border-color:$blue;
                    &:after{
                        background: linear-gradient(to right, #9cdbff, #9cdbff 4px, transparent 4px, transparent);
                        background-size: 8px 100%;
                    };
                }
                .desc{
                    span{
                        color:$blue;
                    }
                    small{
                        //color:$blue;
                        color:#a7aaad;
                        opacity:0.6;
                    }
                }
                .tag{
                    color:$blue;

                }
                &.selected{
                    .box{
                        background-color:$blue;
                    }
                    .desc{
                        span{
                            color:#fff;
                        }
                        small{
                            color:#fff;
                            opacity:0.5;
                        }
                    }
                    .tag{
                        color:#fff;
                        text-align: center;
                    }
                }
            }

            /*免息券*/
            &.red{
                &:before,&:after{
                    border-color:$lowred;
                }
                .box{
                    background-color:#fce6e6;
                    border-color:$lowred;
                    &:after{
                        background: linear-gradient(to right, #ffadad, #ffadad 4px, transparent 4px, transparent);
                        background-size: 8px 100%;
                    };
                }
                .desc{
                    span{
                        color:$lowred;
                    }
                    small{
                        color:$lowred;
                        opacity:0.6;
                    }
                }
                .tag{
                    color:$lowred;
                }
                &.selected{
                    .box{
                        background-color:$lowred;
                    }
                    .desc{
                        span{
                            color:#fff;
                        }
                        small{
                            color:#fff;
                            opacity:0.5;
                        }
                    }
                    .tag{
                        color:#fff;
                    }
                }
            }
            /*免税券*/
            &.purple{
                &:before,&:after{
                    border-color:$purple;
                }
                .box{
                    background-color:#f1edff;
                    border-color:$purple;
                    &:after{
                        background: linear-gradient(to right, #bcb4d7, #bcb4d7 4px, transparent 4px, transparent);
                        background-size: 8px 100%;
                    };
                }
                .desc{
                    span{
                        color:$purple;
                    }
                    small{
                        color:$purple;
                        opacity:0.6;
                    }
                }
                .tag{
                    color:$purple;
                }
                &.selected{
                    .box{
                        background-color:$purple;
                    }
                    .desc{
                        span{
                            color:#fff;
                        }
                        small{
                            color:#fff;
                            opacity:0.5;
                        }
                    }
                    .tag{
                        color:#fff;
                    }
                }
            }
            /*免邮券*/
            &.green{
                &:before,&:after{
                    border-color:$green;
                }
                .box{
                    background-color:#e4fcef;
                    border-color:$green;
                    &:after{
                        background: linear-gradient(to right, #ade6c1, #ade6c1 4px, transparent 4px, transparent);
                        background-size: 8px 100%;
                    };
                }
                .desc{
                    span{
                        color:$green;
                    }
                    small{
                        color:$green;
                        opacity:0.6;
                    }
                }
                .tag{
                    color:$green;
                }
                &.selected{
                    .box{
                        background-color:$green;
                    }
                    .desc{
                        span{
                            color:#fff;
                        }
                        small{
                            color:#fff;
                            opacity:0.5;
                        }
                    }
                    .tag{
                        color:#fff;
                    }
                }
            }
        }
        .box{
            position:relative;
            width:rem(230);
            border-radius:rem(10);

            background:#f2f2f2;
            border:1px solid #f2f2f2;
            [data-dpr="2"] &,[data-dpr="3"] &{
                border-width:2px;
            }


            &:after{
                content:"";
                position:absolute;
                left:0;
                top:rem(101);
                width:100%;
                height: 1px;
                background: linear-gradient(to right, #d6d6d6, #d6d6d6 4px, transparent 4px, transparent);
                background-size: 8px 100%;
            };

        }
        .desc{
            display:flex;
            flex-wrap:wrap;
            align-content:center;
            text-align:center;
            height:rem(101);
            span{
                width:100%;
                font-size:rem(28);
                color:#5d5d5c;
            }
            small{
                width:100%;
                font-size:rem(22);
                color:#aeaead;
            }
        }
        .tag{
            // display:flex;
            // align-items:center;
            // justify-content:center;
            height:rem(54);
            padding:0 rem(20);
            color:#d6d6d6;
            font-size:rem(24);
        }
    }
}
.van-actionsheet{
  background:#fff;
}
.tag{
  text-align: center;
  line-height: rem(54);
}

.aaa{
  font-size: 14px;
}


.mytotalbar{
  position:fixed;
  width:100%;
  height:rem(100);
  left:0;
  bottom:0;
  z-index:9999999;  /*.cart-slider .slidecontent:  z-index 100*/
  letter-spacing:rem(2);
  box-shadow:0 rem(-10) rem(30) 0 rgba(0,0,0,0.1);
  .tip{
    background-color:$red;
    font-size:rem(24);
    padding:rem(12) rem(20);
    line-height:rem(35);
    color:#fff;
  }
  // cart toolbar
  .allprice{
    display:flex;
    justify-content:space-between;
    background-color:#fff;
    align-items:center;
    .van-checkbox{
      padding-left:rem(20);
      font-size:rem(26);
      color:#333;
      line-height:rem(40);
    }
    .go{
      display:flex;
      justify-content:flex-end;
      height:rem(120);
      &>div{
        width:rem(380);
        height:100%;
        padding-right:rem(30);
        display:flex;
        flex-wrap: wrap;
        align-content: center;
        text-align:right;
      }
      .hj{
        width:100%;
        color:#343434;
        font-size:rem(28);
        span{
          color:$red;
          font-size:rem(34);
        }
        i{
          font-style:normal;
          color:$red;
          font-size:rem(24);
        }
      }
      .ze{
        width:100%;
        color:#8d8d8d;
        font-size:rem(24);
      }
      &>a{
        display:flex;
        align-items:center;
            justify-content:center;
        font-size:rem(32);
        color:#fff;
        background-color:$blue;
        width:rem(210);
        height:100%;
        &.disabled{
          background-color:#c9c9c9;
        }
      }
    }
  }
  // piece toolbar
  .totalbar-piece{
    display:flex;
    justify-content:space-between;
    background-color:#fff;
    align-items:center;
    height:rem(100);
    &>div{
      width:rem(500);
      height:100%;
      padding-left:rem(30);
      display:flex;
      flex-wrap: wrap;
      align-content: center;
      text-align:left;
    }
    .hj{
      width:100%;
      color:#343434;
      font-size:rem(28);
      span{
        color:$blue;
        font-size:rem(34);
      }
      i{
        font-style:normal;
        color:$blue;
        font-size:rem(24);
      }
    }
    .ze{
      width:100%;
      color:#8d8d8d;
      font-size:rem(24);
    }
    &>a{
      display:flex;
      align-items:center;
        justify-content:center;
      font-size:rem(32);
      color:#fff;
      background-color:$blue;
      width:rem(210);
      height:100%;
    }
  }
  // voucher toolbar
  .gocheck{
        display:flex;
        align-items:center;
        justify-content:space-between;
        height:rem(60);
        font-size:0;
        padding:0 rem(20);
        letter-spacing:rem(2);
        background:#fff7d0;
        p{
          position:relative;
          font-size:rem(22);
          color:#858585;
          line-height:1.5;
          span{
              vertical-align: middle;
          }
          .van-icon-arrow{
              width:rem(26);
              vertical-align: middle;
          }

        }
    }
    .alreadysel{
        display:flex;
        height:rem(100);
        justify-content:space-between;
        background-color:#fff;
        align-items:center;
        padding-left:rem(20);
        .info{
            font-size:rem(22);
            color:#343434;
            i{
                font-style:normal;
                color:$red;
            }
        }
        .list{
            margin-bottom:rem(-6);
            font-size:0;
            width:rem(400);
            li{
                margin-right:rem(6);
                margin-bottom:rem(6);
                font-size:rem(22);
                min-width:rem(80);
                display:inline-block;
                border-radius:rem(4);
                background-color:#e9f6ff;
                border:1px solid $blue;
                color:$blue;
                text-align:center;
                @include dpr3border();
            }
        }
        .go{
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:rem(32);
            color:#fff;
            background-color:$blue;
            width:rem(210);
            height:100%;
        }
    }
}

</style>















