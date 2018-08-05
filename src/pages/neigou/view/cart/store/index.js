import config from '@/config/config'
import { Toast } from 'vant'
import { httpPostV2 , Jsonp } from '@/api/base'
import util from '@/api/util'

//api domain
const storeDomain = `${config.store_api_domain}/mallApi`



const FETCH_LOADING = 'FETCH_LOADING'
const GET_CART = 'GET_CART'
const UPDATE_FIRST_REQUEST = 'UPDATE_FIRST_REQUEST'
const UPDATE_CHECKED = 'UPDATE_CHECKED'
const UPDATE_GOOD_NUMBER = 'UPDATE_GOOD_NUMBER'
const DELETE_GOOD = 'DELETE_GOOD'

const CONFIRM_SELECT_VOUCHER = 'CONFIRM_SELECT_VOUCHER'

const UPDATE_ADDRESS = 'UPDATE_ADDRESS'
const GET_PIECE_GOODSLIST = 'GET_PIECE_GOODSLIST'

const UPDATE_SHOP_VOUCHER_INFO = 'UPDATE_SHOP_VOUCHER_INFO'
const SELECTED_IT_VOUCHER = 'SELECTED_IT_VOUCHER'

const GOODS_LIST_STOCK = 'GOODS_LIST_STOCK'
const UPDATE_STOCK_TIME = 'UPDATE_STOCK_TIME'
const SAVE_SELECTED_VOUCHER_RULEID = 'SAVE_SELECTED_VOUCHER_RULEID'
const CARTTOTALLOADING='CARTTOTALLOADING'

const API = {

    time : new Date,

    common : function(URL,PARAMS,success){

        this.time = new Date;
        if(!PARAMS.noloading){
            state.fetchLoading = true
        }
        return new Promise( (resolve,reject) => {
            httpPostV2(URL,PARAMS,res=>{
                state.fetchLoading = false
                resolve(res)
            },(errorMsg,errorNo)=>{
                state.fetchLoading = false
                Toast(errorMsg)
            })

        })

    },

    unusual : function(URL,PARAMS,success){

        return new Promise( (resolve,reject) => {

            httpPostV2(URL,PARAMS,res=>{
                resolve(res)
            },(errorMsg,errorNo)=>{
                Toast(errorMsg)
            })

        })
    }
}
/**
state

selectedVoucherList:{
    'voucher': {
        '151' : ['39FCDFBAFA3677DE']
    },
    'dutyfree':{
        '151' : ['17895']
    },
    freeshipping:{
        '151' : ['17892']
    }
}


**/
const state = {
    cartTotalLoading:false,
    fetchLoading : true,

    addressList : [],
    //购物车数据
    cartDate : Object,

    //购物车初始化店铺券   选中券数据
    selectedVoucherList:{
        'voucher':{},
        'dutyfree':{},
        'freeshipping':{}
    },
    //有效券数据
    filterSelectedVoucherList:{},

    //选中券rule_id
    // selectedVoucherRuleIdList:{
    //     '151' : {
    //         voucher_rule:[],
    //         freeshipping_rule:[],
    //         dutyfree_rule:[]
    //     }
    // },
    //凑单页 选中券 rule_id
    selectedVoucherRuleIdList:{
        'voucher_rule':{},
        'dutyfree_rule':{},
        'freeshipping_rule':{}
    },
    // selectedVoucherList:{
    //     'voucher': {
    //         '146' : ['B0D252C49D44EFBB']
    //     },
    //     'dutyfree':{
    //         '151' : ['17895']
    //     },
    //     freeshipping:{
    //         '151' : ['17892']
    //     }
    // },


    //地址数据
    addressArr:{},

    //凑单页商品列表
    pieceGoodsList:[],

    //店铺id
    currentShopId:0,

    //店铺券信息
    // shopVoucherInfo:{},

    //商品库存
    goodslistStock:{},

    //库存保存时间
    stockSaveTime:0,

    //购物车有每日优鲜商品
    hasMRYX:0,
    // //券选择页选中券信息
    // alreadySelectedVoucherIdList:[]

}

const getters = {
    cartTotalLoadingData(){
        return state.cartTotalLoading
    },
    shopList : (state, getters, rootState) => {

        let hwg = [],
            normal = []

        if(state.cartDate.type_list) state.cartDate.type_list.forEach(item=>{

            if(item.type_id == 1){

                item.shop_list.forEach(sp=>sp.type_id = 1)
                hwg = [...hwg,...item.shop_list]

            }
            if(item.type_id == 2){

                item.shop_list.forEach(sp=>sp.type_id = 2)
                normal = [...normal,...item.shop_list]

            }

        })
        return [...normal,...hwg]

    },

    typeList : (state, getters, rootState) => {
        let arr = []
        state.cartDate.type_list && state.cartDate.type_list.forEach(item=>{

            let goodscount = 0,
                id = item.type_id,
                total = item.type_total_amount

            item.shop_list.forEach(sp=>{

                sp.product_list.forEach(gd=>{
                    if(gd.checked_state === 1) goodscount += parseInt(gd.quantity)
                })

            })

            arr.push({
                id,
                total,
                goodscount
            })

        })
        return arr

    },

    //已选券
    selectedVoucherListForMoney:(state, getters, rootState) => {
        //店铺信息
        let shopInfo = {}
        let obj = state.cartDate

        //筛选有效券
        let filter = {
            voucher:{},
            dutyfree:{},
            freeshipping:{}
        }

        obj.type_list && obj.type_list.forEach(item=>{

            item.shop_list.forEach(shop=>{
                //已用券
                let _usedvoucher = {}
                //选中商品且符合券规则的金额
                let _shopVoucherGoodsTotal = 0
                //店铺 use_status
                let _useStatus = 1
                shop.product_list.forEach((good,goodIndex)=>{
                    //商品数量
                    let __goodnumber = parseInt( good.quantity )
                    //已用券
                    _usedvoucher.num = 0
                    _usedvoucher.list = []

                    _usedvoucher.needmoney = 0
                    _usedvoucher.needmoneylist = []

                    //选中商品且符合券规则的金额
                    if(good.use_voucher && good.checked_state === 1) _shopVoucherGoodsTotal += parseFloat( good.cost * __goodnumber)
                    //可用券id列表

                    for(let m in shop.shop_use_voucher){
                        let cur = shop.shop_use_voucher[m]
                        _usedvoucher.num  = _usedvoucher.num + parseInt(cur.length)

                        let voucherid = []
                        cur.forEach(c=>{
                            let _cell = c
                            if(m==='voucher'){
                                if(c.type=='money'){
                                    if(c.limit_cost == 0) _cell.showName = '减'+ parseInt(c.money)
                                    else _cell.showName = '满'+parseInt( c.limit_cost )+'减'+ parseInt(c.money)
                                }else{
                                    if(c.limit_cost == 0) _cell.showName =  parseInt( c.discount )+'折'
                                    else _cell.showName = '满'+parseInt(c.limit_cost)+'打'+parseInt( c.discount )+'折'
                                }

                                //设置有效券
                                if(c.use_status == 1) voucherid.push(c.number)
                                if( voucherid.length ) filter.voucher[shop.shop_id] = voucherid


                            }else{
                                //设置有效券
                                if(c.use_status == 1) voucherid.push(c.coupon_id)
                                if( voucherid.length ) filter[m][shop.shop_id] = voucherid
                            }

                            if(m==='dutyfree'){
                                _cell.type = "dutyfree"
                                _cell.showName = '免税券'
                            }
                            if(m==='freeshipping'){
                                _cell.type = "freeshipping"
                                _cell.showName = '免邮券'

                            }
                            _usedvoucher.list.push(_cell)
                        })
                        if(cur.length) cur.forEach(it=>{
                            if(it.use_status == 0){
                                _useStatus = 0
                                _usedvoucher.needmoneylist.push(it.need_money)
                            }
                        })

                    }

                    //获取最大need_money
                    if(_usedvoucher.needmoneylist.length) _usedvoucher.needmoney = Math.max(..._usedvoucher.needmoneylist)


                    shopInfo[shop.shop_id] = {
                        useStatus:_useStatus,
                        needmoney:_usedvoucher.needmoney,
                        voucherTotal:_shopVoucherGoodsTotal,
                        usedVoucherNumber:_usedvoucher.num,
                        usedVoucherList:_usedvoucher.list
                    }
                })
            })
        })
        state.filterSelectedVoucherList = filter
        return shopInfo
    }

}

const actions = {

    //购物车初始化
    getCart ({ commit, state }, callback) {

        API.common(`${storeDomain}/NewCart/CartApi/getCartPolymerizeGoodsList`,{addressArr:state.addressArr,...state.selectedVoucherList}).then(res=>{
            commit('GET_CART',res)
            if(typeof callback === 'function') callback(res)
        })

    },

    //更新选中商品
    // updateGoodsChecked:util.debounce(function({ commit, state }, idArray){
    //     API.common(`${storeDomain}/NewCart/CartApi/changeCartProductCheck`,{addressArr:state.addressArr,productIds:[...idArray],...state.selectedVoucherList,noloading:true}).then(res=>{
    //         commit('UPDATE_CHECKED',res)
    //     })
    // },500),
    
    updateGoodsChecked:function({ commit, state }, idArray){

        let randomStr=util.randomStr(5);
        serial_num.unshift(randomStr);
        commit('CARTTOTALLOADING',true);
        API.common(`${storeDomain}/NewCart/CartApi/changeCartProductCheck`,{addressArr:state.addressArr,productIds:[...idArray],...state.selectedVoucherList,noloading:true,serial_num:randomStr}).then(res=>{
            console.log(res.serial_num,serial_num[0])
            if((res.serial_num)&&(serial_num[0]==res.serial_num)){
                commit('CARTTOTALLOADING',false);
                commit('UPDATE_CHECKED',res);
            }
        })
    },
    //更新商品数量
    updateGoodNumber({ commit, state }, {pid,number}) {
        if(!number){
            return false;
        }
        API.common(`${storeDomain}/NewCart/CartApi/changeCartProductNum`,{addressArr:state.addressArr,productId:pid,quantity:number,...state.selectedVoucherList}).then(res=>{
            commit('UPDATE_GOOD_NUMBER',res)
        })

    },

    //删除商品
    deleteGood ({ commit, state }, pID) {

        API.common(`${storeDomain}/NewCart/CartApi/delCart`,{addressArr:state.addressArr,productIds:[pID],...state.selectedVoucherList}).then(res=>{
            commit('DELETE_GOOD',res)
        })

    },

    //获取商品库存
    getGoodStock ({ commit, state }, {productIds,callback}) {

        API.common(`${storeDomain}/NewCart/Product/getProductStore`,{addressArr:state.addressArr,product_bns:[...productIds]}).then(res=>{
            callback(res)
            commit('GOODS_LIST_STOCK',res)
        })
    },

    //去结算车
    submitCart({ commit, state },{cartType,callback}) {
        API.common(`${storeDomain}/NewCart/CartApi/cartToSettlement`,{addressArr:state.addressArr,cartType}).then(res=>{
            callback(res)
        })
    },

    //选择券
    selectVoucher({ commit, state },{callback,...params}) {
        API.common(`${storeDomain}/NewCart/CartApi/useShopVoucherPolymerize`,{addressArr:state.addressArr,...params}).then(res=>{
            // console.log(res)
            callback(res)
            // commit('SELECTED_IT_VOUCHER',params)

        })
    },

    //凑单初始化
    getPiece ({ commit, state },options) {
        API.common(`${storeDomain}/NewCart/Product/searchProductByVoucher`,{
            page_size:options.size,
            page:options.page,
            keyword:options.keyword,
            order_by:options.order,
            price_gte:options.gte,
            price_lte:options.lte,
            voucher_rule:options.voucher_rule,
            dutyfree_rule:options.dutyfree_rule,
            freeshipping_rule:options.freeshipping_rule
        }).then(res=>{
            commit('GET_PIECE_GOODSLIST',res)
        })
    },

    //凑单页加入购物车
    buy({ commit, state },{productId,callback}) {
        Jsonp(`${storeDomain}/NewCart/CartApi/addCart`,{
            quantity:1,productId
        }).then(res=>{
            callback(res)
        })
    }

}

const mutations = {

    [GET_CART] (state, res) {
        state.cartDate = res

        //检查是否有每日优鲜商品
        state.hasMRYX = res.extend_data && res.extend_data.mryx_info.has_mryx
    },

    [UPDATE_CHECKED](state, res) {
        state.cartDate = res

        //检查是否有每日优鲜商品
        state.hasMRYX = res.extend_data && res.extend_data.mryx_info.has_mryx
    },

    [UPDATE_GOOD_NUMBER](state, res) {
        state.cartDate = res
    },

    [DELETE_GOOD](state, res) {
        state.cartDate = res
    },

    //更新地址
    [UPDATE_ADDRESS](state, res){
        state.addressArr = res
    },

    //凑单商品列表
    [GET_PIECE_GOODSLIST](state, res){
        state.pieceGoodsList = res.product_list
    },

    //更新店铺券信息
    [UPDATE_SHOP_VOUCHER_INFO](state, res){
        state.shopVoucherInfo = res
    },

    //选中一张券
    // [SELECTED_IT_VOUCHER](state, res){
    //     // state.alreadySelectedVoucherIdList.push(res)
    //     // state.alreadySelectedVoucherIdList.forEach(item=>{
    //     //     if(item.shop_id == res.shop_id){
    //     //         item.voucher = res.voucher
    //     //     }
    //     // })
    //     // console.log(state.alreadySelectedVoucherIdList)
    //     // state.alreadySelectedVoucherIdList = res
    // },
    [CONFIRM_SELECT_VOUCHER](state, res){
        state.selectedVoucherList = res
    },
    [GOODS_LIST_STOCK](state, res){
        state.goodslistStock = res
    },
    //更新库存缓存时间
    [UPDATE_STOCK_TIME](state,res){
        state.stockSaveTime = res
    },
    //保存已选券 rule_id
    [SAVE_SELECTED_VOUCHER_RULEID](state,res){
        state.selectedVoucherRuleIdList = res
    },
    [CARTTOTALLOADING](state,res){
        state.cartTotalLoading=res;
    }

}

export default {
  state,
  getters,
  actions,
  mutations
}