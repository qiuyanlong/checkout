export default{
    getMemo(typeList){
        let mome={};
        if(typeList){
            typeList.forEach(type=>{
                if(type.shop_list){
                    type.shop_list.forEach(shop=>{
                        if(shop.memo){
                            mome[shop.shop_id]=shop.memo
                        }
                    })
                }
            })
        }
        return mome
    },
    getUseVoucher(voucherData){
        let subData={
            dutyfree:{},
            freeshipping:{},
            voucher:{}
        }
        for(let type in voucherData){
            let useVoucher=voucherData[type].use_voucher;
            for(let voucher_type in useVoucher){
                let voucherList=useVoucher[voucher_type];
                if(voucherList.length>0){
                    let arr=[];
                    voucherList.forEach(voucher=>{
                        let number=voucher.number||voucher.coupon_id
                        arr.push(number)
                    })
                    subData[voucher_type][type]=arr
                }
                
            }
        }
        return subData
    }
}