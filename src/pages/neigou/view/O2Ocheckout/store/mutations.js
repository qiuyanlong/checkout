import * as types from './mutation-types.js';
const mutations = {
    [types.SHOPLIST] (state,p) {
        let memoArr={};
        state.shopList.forEach(type => {
            type.shop_list.forEach(shop=>{
                let memo=shop.memo
                if(memo){
                    memoArr[shop.shop_id]=memo;
                }
            })
        });
        p.forEach(type=>{
            type.shop_list.forEach(shop=>{
                let mome=memoArr[shop.shop_id]
                if(mome){
                    shop.memo=mome
                }
            })
        })
        state.shopList = p;
    },
    [types.FIRST] (state,p) {
        state.first = p;
    },
    [types.EXTENDS] (state,p) {
        state.extends = p;
        state.idCardType=p.id_card_type
    },
    [types.VOUCHERLIST] (state,p) {
        state.voucherList = p;
    },
    [types.SELECTDATE] (state,p) {
        state.selectDate = p.value;
        state.selectDateErr = p.err;
    },
    [types.O2OTOTAL] (state,p) {
        let data={};
        data.payable_cash=p.payable_cash;
        data.total_voucher_discount=p.total_voucher_discount
        data.total_amount=p.total_amount

        state.o2ototalData = data;
    },
    [types.CREATERROR] (state,p) {
        state.creatError = p;
    },
}
export default mutations
