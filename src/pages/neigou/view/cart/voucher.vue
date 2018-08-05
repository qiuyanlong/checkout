<template>
<div :style="{'height':bodyHeight+'px'}">
    <div class="cartmain">
        <loading :loadingswitch="loadding"></loading>
        <!-- voucher -->
        <section class="voucher" v-for="vo in voucherList">
            <h1 v-if="vo.type == 'blue'">满减券</h1>
            <h1 v-if="vo.type == 'green'">免邮券</h1>
            <h1 v-if="vo.type == 'purple'">免税券</h1>
            <ul>
                <li v-for="(cur,index) in vo.list" :class="[vo.type,{'selected':vo.selectedId == index }]" v-if="vo.isAll || index < 6" @click="selectIt(vo,cur,index)">
                    <div class="box">
                        <p class="desc" v-if="vo.type == 'blue'">
                            <span>{{cur|showVouchName}}</span>
                            <small>有效期:{{cur.valid_time}}</small>
                        </p>
                        <p class="desc" v-if="vo.type == 'green'">
                            <span>免邮券</span>
                            <small>有效期:{{cur.valid_time}}</small>
                        </p>
                        <p class="desc" v-if="vo.type == 'purple'">
                            <span>免税券</span>
                            <small>有效期:{{cur.valid_time}}</small>
                        </p>

                        <p class="tag">{{cur.rule_name}}</p>
                    </div>
                </li>
            </ul>
            <p class="more" @click="open(vo)" :class="{'open':vo.isAll}" v-if="vo.list.length > 6">
                {{vo.isAll?'收起':'展开'}}
                <i></i>
            </p>
        </section>
        <!-- valid good list  -->
        <van-actionsheet v-model="goodsListMask">
            <div class="good-list">
                <i class="icon-close" @click="goodsListMask = false"></i>
                <h1>共 <span>{{canUseGoodList.length}}</span> 件商品可用</h1>
                <p class="sub">以下购物车内的商品符合已选优惠券叠加使用条件</p>
                <ul class="gdlist" v-if="canUseGoodList.length">
                    <li v-for="gd in canUseGoodList">
                        <span>x{{gd.quantity}}</span>
                        <img :src="gd.image" alt="">
                    </li>
                </ul>
                <div class="gdnull" v-else>
                    <img src="./img/cart_null.png" alt="">
                    <p>购物车君很饿~ <br>快用商品喂饱它吧!</p>
                </div>
                <p class="btn-bg" @click="goodsListMask = false">知道了</p>
            </div>
        </van-actionsheet>
        <!-- confirm bar -->
        <section class="totalbar">
            <a href="javascript:;" class="gocheck" @click="goodsListMask = true">
                <p>购物车内共{{canUseGoodList.length}}件可叠加使用</p>
                <p><span>点击查看</span><van-icon name="arrow"/></p>
            </a>
            <div class="alreadysel">
                <p class="info">已选<i>{{alreadySelectedVoucherIdList.length}}</i>张</p>
                <ul class="list">
                    <li v-for="al in alreadySelectedVoucherIdList">
                        {{al.name}}
                    </li>
                </ul>
                <a href="javascript:;" class="go" @click="next">{{btnType==1?'确认':'去凑单'}}</a>
            </div>
            <div class="iphonex40"></div>
        </section>
    </div>
</div>
</template>
<script>

import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'

export default {
    name: 'voucher',
    data(){
        return {
            shopId:0,
            goodsListMask:false,
            voucherList:[],

            //弹层商品列表
            canUseGoodList:[],

            //已选券id列表
            alreadySelectedVoucherIdList:[],

            //按钮类型
            btnType:1,
        }
    },
    computed:{
        ...mapState({
            loadding : state => state.cart.fetchLoading,
            // shopVoucherInfo : state => state.cart.shopVoucherInfo,
            selectedVoucherList : state => state.cart.selectedVoucherList,
            selectedVoucherRuleIdList : state => state.cart.selectedVoucherRuleIdList
            // alreadySelectedVoucherIdList : state => state.cart.alreadySelectedVoucherIdList
        }),
        ...mapGetters([
            'shopList'
        ]),
    },
    watch:{},
    methods:{
        open(voucher){
            voucher.isAll = !voucher.isAll
        },
        selectIt(voucher,cur,index){
            let _vm = this,
                voucherid = voucher.type === 'blue' ? cur.number : cur.coupon_id,
                _cancel = -1,
                _replace = -1,
                name = '',
                ajaxData = {}

            _vm.alreadySelectedVoucherIdList.forEach((i,inx)=>{
                if(i[voucher.type]) _replace = inx
                if(i[voucher.type] === voucherid) _cancel = inx
            })

            voucher.selectedId = index

            if(_replace != -1) _vm.alreadySelectedVoucherIdList.splice(_replace,1)
            if(_cancel != -1) voucher.selectedId = -1

            if(voucher.type == 'blue'){

                if(cur.type == 'money'){
                    if(cur.limit_cost == 0) name =  '减'+ parseInt(cur.money)
                    else name =  '满'+parseInt( cur.limit_cost )+'减'+ parseInt(cur.money)
                }else{
                    if(cur.limit_cost == 0) name = parseInt( cur.discount )+'折'
                    else name =  '满'+parseInt(cur.limit_cost)+'打'+parseInt( cur.discount )+'折'
                }

                // if(cur.type == 'money') name = '满'+parseInt( cur.limit_cost )+'减'+ parseInt(cur.money)
                // else name = '满'+parseInt(cur.limit_cost)+'打'+parseInt( cur.discount )+'折'



            }
            if(voucher.type == 'green') name = '免邮券'
            if(voucher.type == 'purple') name = '免税券'
            //取消选中时 不添加数据
            _cancel === -1 && _vm.alreadySelectedVoucherIdList.push({
                [voucher.type]:voucherid,
                name,
                ruleId:cur.rule_id
            })
            //获取券id
            _vm.alreadySelectedVoucherIdList.forEach(i=>{
                if(i['blue']) ajaxData.voucher = [i['blue']]
                if(i['purple']) ajaxData.dutyfree = [i['purple']]
                if(i['green'])  ajaxData.freeshipping = [i['green']]
            })

            _vm.$store.dispatch('selectVoucher',{
                callback(res){
                    _vm.canUseGoodList = res.match_products || []
                    _vm.checkVoucherList(res.use_voucher)
                },
                shop_id: this.shopId,
                ...ajaxData
            })
        },
        checkVoucherList(voucherList = {}){

            //按钮状态  0 去凑单 或  1 确认
            let btntype = 1

            for(let m in voucherList){
                //返回接口里 数据为空时 是Array类型
                if(Object.prototype.toString.call(voucherList[m]).toLowerCase() == "[object object]"){

                    for(let n in voucherList[m]){
                        //只要有一个use_status为0 则按钮就是去凑单
                        if(voucherList[m][n].use_status == 0) btntype = 0
                    }

                }

            }

            this.btnType = btntype

        },

        //点击按钮
        next(){
            let _vm = this,

                //选中券 用来初始化购物车数据
                obj = {
                    voucher:[],
                    dutyfree:[],
                    freeshipping:[]
                },
                //选中券rule_id 用来初始化凑单页数据
                obj2 = {
                    voucher_rule:[],
                    freeshipping_rule:[],
                    dutyfree_rule:[]
                },
                _selectedVoucherList = _vm.selectedVoucherList,
                _selectedVoucherRuleIdList = _vm.selectedVoucherRuleIdList
            _vm.alreadySelectedVoucherIdList.forEach(i=>{

                if(i['blue'])
                    obj.voucher = [i['blue']],
                    obj2.voucher_rule = [i['ruleId']]

                if(i['purple'])
                    obj.dutyfree = [i['purple']],
                    obj2.freeshipping_rule = [i['ruleId']]

                if(i['green'])
                    obj.freeshipping = [i['green']],
                    obj2.dutyfree_rule = [i['ruleId']]
            })
            //保存已选券
            for(let m in _selectedVoucherList){

                //判断是否为空
                if(Object.keys(_selectedVoucherList[m]).length === 0){
                    _selectedVoucherList[m][_vm.shopId] = obj[m]

                    //选中券rule_id 用来初始化凑单页数据
                   _selectedVoucherRuleIdList[m + '_rule'][_vm.shopId] = obj2[m + '_rule']
                }else{
                    for(let n in _selectedVoucherList[m]){
                        if(_vm.shopId == n){
                            _selectedVoucherList[m][n] = obj[m]

                            _selectedVoucherRuleIdList[m + '_rule'][n] = obj2[m + '_rule']

                            //_selectedVoucherRuleIdList[n][m + '_rule'] = obj2[m + '_rule']
                        }else{
                            _selectedVoucherList[m][_vm.shopId] = obj[m]

                            _selectedVoucherRuleIdList[m + '_rule'][_vm.shopId] = obj2[m + '_rule']
                        }
                    }
                }
            }

            //更新已选券内容
            _vm.$store.commit('CONFIRM_SELECT_VOUCHER',_selectedVoucherList)

            //保存已选券 rule_id
            _vm.$store.commit('SAVE_SELECTED_VOUCHER_RULEID',_selectedVoucherRuleIdList)

            if(_vm.btnType == 1){
                _vm.$router.push({name:'CartIndex'})
            }
            else{
                _vm.$store.dispatch('getCart',res=>{
                    _vm.$router.push({name:'CartPiece',query:{shopid:_vm.shopId}})
                })
            }

        }
    },
    filters:{
        showVouchName(cur){
            if(cur.type == 'money'){
                if(cur.limit_cost == 0) return '减'+ parseInt(cur.money)
                else return  '满'+parseInt( cur.limit_cost )+'减'+ parseInt(cur.money)
            }else{
                if(cur.limit_cost == 0) return parseInt( cur.discount )+'折'
                else return  '满'+parseInt(cur.limit_cost)+'打'+parseInt( cur.discount )+'折'
            }
        }
    },
    created(){
        this.bodyHeight =  document.documentElement.clientHeight
        let _vm = this,
            newarr = [],
            curShop,
            curVoucher,
            usedVoucher

        _vm.shopId = _vm.$route.query.shopid

        //本页刷新 回到购物车页
        if(!_vm.shopList.length){
            _vm.$router.push({
                name:'CartIndex'
            })
            return
        }

        curShop = _vm.shopList.find(shop=> shop.shop_id == _vm.shopId )
        curVoucher = curShop.shop_voucher
        usedVoucher = curShop.shop_use_voucher

        for(let vo in curVoucher){
            let _voucher = {
                isAll:false,
                selectedId:-1,
            }
            if(!curVoucher[vo].length) continue



            _voucher.list = curVoucher[vo]
            if(vo === 'voucher') _voucher.type = 'blue'
            if(vo === 'dutyfree') _voucher.type = 'purple'
            if(vo === 'freeshipping') _voucher.type = 'green'

            newarr.push(_voucher)

            //编辑时 选中券
            if(usedVoucher[vo].length){

                usedVoucher[vo].forEach(use=>{

                    curVoucher[vo].forEach(( vou,index)=>{
                        if(vou.type == 'money' || vou.type == 'discount'){

                            if(use.number == vou.number){
                                _voucher.selectedId = index
                                _vm.selectIt(_voucher,vou,index)
                            }
                        }else{
                            if(use.coupon_id == vou.coupon_id){
                                _voucher.selectedId = index
                                _vm.selectIt(_voucher,vou,index)
                            }

                        }
                    })
                })

            }
        }

        _vm.voucherList = newarr
    }
}
</script>

<style lang="scss" scoped>
@import './css/commen.scss';
.good-list{
    position:relative;
    .icon-close{
      position:absolute;
      top:rem(45);
      right:rem(40);
      width:rem(26);
      height:rem(25);
      display:block;
      background:url(./img/close.png) no-repeat;
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
            border:1px solid $bordercolor;
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
                border-radius:rem(30);
                background-color:#ff8534;
            }
            img{
                width:100%;
                height:100%;
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
.totalbar{
    
}
.voucher{
    margin-bottom:rem(20);
    padding-top:rem(25);
    /*padding:rem(25) 0 rem(20);*/
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
                border:1px solid #f5fbff;
                [data-dpr="2"] &,[data-dpr="3"] &{
                border-width:2px;
            }
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
                        color:$blue;
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
            display:flex;
            align-items:center;
            justify-content:center;
            height:rem(54);
            color:#d6d6d6;
            font-size:rem(24);
            white-space: nowrap;
        }
    }
}
</style>