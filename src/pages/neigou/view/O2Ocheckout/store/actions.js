import {  httpPostV2 } from '@/api/base'
import config from '@/config/config'
import * as types from './mutation-types.js';
import _fn from './fn.js';
import UTIL from '@/api/util'
let sign=UTIL.getQueryString('sign');
import state from './state.js'

import { Toast } from 'vant'

function resetVoucher(list,useList){
    let _list=list;
    let _useList=useList;

    

    _useList.dutyfree.forEach(item=>{
        _list.dutyfree.forEach(_item=>{
            if(item.coupon_id==_item.coupon_id){
                _item.use=true;
                _item.select=true;
            }
        })
    })
    _useList.freeshipping.forEach(item=>{
        _list.freeshipping.forEach(_item=>{
            if(item.coupon_id==_item.coupon_id){
                _item.use=true;
                _item.select=true;
            }
        })
    })
    _useList.voucher.forEach(item=>{
        _list.voucher.forEach(_item=>{
            if(item.number==_item.number){
                _item.use=true;
                _item.select=true;
            }
        })
    })
    
    return {
        voucher:{
            voucher:{
                data:_list.voucher,
                isAll:false
            },
            freeshipping:{
                data:_list.freeshipping,
                isAll:false
            },
            dutyfree:{
                data:_list.dutyfree,
                isAll:false
            },
        },
        use_voucher:_useList
    }
}
export default {
    getO2OcheckoutData({ commit }, params) {
        let voucherData=_fn.getUseVoucher(state.voucherList);
        console.log('voucherData',voucherData)
        let subData={
            sign:sign,
            ...voucherData,
            ...params
        };
        //Vm.storeDomain + 'mallApi/
        //http://mall.test.neigou.com/NewCart/Checkout/o2oOrderConfirmation
        httpPostV2(`${config.store_api_domain}/mallApi/NewCart/Checkout/o2oOrderConfirmation`,subData, function (res) {
            let voucherList={};
            let platform_voucher=res.extend_data.platform_info
            voucherList.all=resetVoucher(platform_voucher.platform_voucher,platform_voucher.platform_use_voucher)
            
            let type_list=res.type_list
            type_list.forEach((type)=>{
                type.shop_list.forEach((shop)=>{
                    shop.memo='';
                    voucherList[shop.shop_id]=resetVoucher(shop.shop_voucher,shop.shop_use_voucher);
                })
            })
            commit(types.VOUCHERLIST,voucherList);
            commit(types.O2OTOTAL,res);
            commit(types.SHOPLIST,type_list);
            if(state.first){
                commit(types.FIRST,false);
                let bn=[];
                type_list.forEach((type)=>{
                    type.shop_list.forEach((shop)=>{
                        shop.product_list.forEach((product)=>{
                            bn.push(product.product_bn)
                        })
                    })
                })
                let extend_data=res.extend_data.extends[bn[0]];
            
                if(extend_data&&extend_data.guest){
                    let guest=[];
                    extend_data.guest.forEach((guestVal)=>{
                        let inputForm=[];
                        guestVal.forEach((input)=>{
                            let vc={
                                "key":input.key,
                                "value":'',
                                "name":input.name,
                                'error':''
                            }
                            if(input.key=="id_card"){
                                vc.type='select';
                                vc.id_card_type=input.id_card_type;
                                vc.selectVal=1;
                            }else{
                                vc.type='text'
                            }
                            inputForm.push(vc)
                        })
                        guest.push(inputForm)
                    })
                    extend_data.guest=guest
                }
                // 他喵的 处理这个该死的数据 ， 其实我的内心是拒绝的 ， 但是又能怎么样呢！！ 
                commit(types.EXTENDS,extend_data);
            }
            o2oVue.$pageLoading.hide();
        }, function (err,errno,errbody) {
            o2oVue.$pageLoading.hide()
            if(errno==20025){
                Toast('数据获取失败，请重新提交结算')
            }else{
                Toast(err)
            }
            //b0b88c4b14aa4e4597bc13b14ffcef71
        })
    },
    setSelectDate({ commit }, params){
        commit(types.SELECTDATE,params);
    },
    creatO2OOrder({ commit }, params){
        o2oVue.$pageLoading.show()
        let dataError=false;
        let selectData=state.selectDate
        if(!selectData &&state.extends.date_ahead&& state.extends.date_ahead.date_ahead==1){
            commit(types.SELECTDATE,{val:'',err:'请选择预约时间'});
            dataError=true;
        }
        let name_arr=[],
            english_name_arr=[],
            mobile_arr=[],
            email_arr=[],
            id_card_arr=[],
            address_arr=[];

        
        if(state.extends.guest&&state.extends.guest.length>0){
            state.extends.guest.forEach((guestList)=>{
                guestList.forEach((input)=>{
                    let val=input.value;
                    
                    let regxphone =  /^[1][0-9]{10}$/;
                    let regxemail=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                    let regx_id_card={
                        '1':/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                        '2':/^[a-zA-Z0-9]{5,17}$/,
                        '3':/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/,
                        '4':/^[0-9]{8,10}$/,
                        '5':/\S/,
                        '6':/\S/,
                    }
                    switch (input.key) {
                        case 'name':
                            if(!val || (val.length<2)||(val.length>16)){
                                dataError=true;
                                input.error='请填写正确的姓名'
                            }else{
                                name_arr.push(val);
                                input.error=''
                            }
                            break;
                        case 'english_name':
                            if(!/\S/.test(val)){
                                dataError=true;
                                input.error='请填写正确的英文名称'
                            }else{
                                english_name_arr.push(val);
                                input.error=''
                            }
                            break;
                        case 'phone':
                            if(!regxphone.test(val)){
                                dataError=true;
                                input.error='请填写正确的手机号'
                            }else{
                                mobile_arr.push(val);
                                input.error=''
                            }
                            break;
                        case 'email':
                            if(!regxemail.test(val)){
                                dataError=true;
                                input.error='请填写正确的邮箱'
                            }else{
                                email_arr.push(val);
                                input.error=''
                            }
                            break;
                        case 'id_card':
                            let reg=regx_id_card[input.selectVal];
                            if(!reg.test(val)){
                                dataError=true;
                                input.error='请填写正确的证件号码：'+state.extends.id_card_type[input.selectVal]
                            }else{
                                id_card_arr.push(input.selectVal+':'+val);
                                input.error=''
                            }
                            break;
                        case 'recipient_address':
                            if(!/\S/.test(val)){
                                dataError=true;
                                input.error='请填写收货地址'
                            }else{
                                address_arr.push(val);
                                input.error=''
                            }
                            break;
                    }
                })
            })
        }
       
        if(dataError){
            
            Toast('请填写正确的下单信息');
            o2oVue.$pageLoading.hide()
            return false;
        }else{
            let useVoucher=_fn.getUseVoucher(state.voucherList);
            let memo=_fn.getMemo(state.shopList);
            let totalData={
                ...params,
                "sign":UTIL.getQueryString('sign'),
                "extends_field":{},
                memo:memo,
                ...useVoucher,
            }
            if(name_arr.length>0){
                totalData.extends_field.name=name_arr.join(',')
            }
            if(english_name_arr.length>0){
                totalData.extends_field.english_name=english_name_arr.join(',') 
            }
            if(mobile_arr.length>0){
                totalData.extends_field.phone=mobile_arr.join(',')
            }
            if(email_arr.length>0){
                totalData.extends_field.email=email_arr.join(',')
            }
            if(id_card_arr.length>0){
                totalData.extends_field.id_card=id_card_arr.join(',')
            }
            if(address_arr.length>0){
                totalData.extends_field.recipient_address=address_arr.join(',')
            }
            if(selectData){
                totalData.extends_field.date_ahead=selectData; 
            }
            
            httpPostV2(`${config.store_api_domain}/mallApi/NewCart/Order/createO2oOrder`,totalData, function (res) {
                window.location.href=res.redirect
            }, function (err,errno,errbody) {
                o2oVue.$pageLoading.hide()
                if( (errno==20040||errno==20004||errno==20003)&& errbody.length>0 ){
                    commit(types.CREATERROR,{err:err,errno:errno,errbody:errbody});
                }else{
                    Toast(err)
                }
            })
        }
    }
}