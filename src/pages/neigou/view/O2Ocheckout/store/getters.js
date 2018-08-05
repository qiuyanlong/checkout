export default {
    shoplistData(state){
        return state.shopList||[]
    },
    voucherListData(state){
        return state.voucherList||null
    },
    guestData(state){
        return state.extends.guest||[]
    },
    idCardTypeData(state){
        return state.extends.id_card_type||{}
    },
    invalidDatesData(state){
        if(state.extends.date_ahead&&state.extends.date_ahead.invalid_dates){
            return state.extends.date_ahead.invalid_dates||[];
        }else{
            return []
        }
    },
    dateAheadData(state){
        if(state.extends.date_ahead&&state.extends.date_ahead.date_ahead){
            return state.extends.date_ahead.date_ahead||''
        }else{
            return ''
        }
    },
    selectDate(state){
        let data={val:state.selectDate,err:state.selectDateErr}
        return data
    },
    o2ototalData(state){
        return state.o2ototalData
    },
    creatErrorData(state){
        return state.creatError;
    },
}