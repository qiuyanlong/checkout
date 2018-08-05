<template>
    <div class="shop_list">
        <template v-if="shopList">
        <div :class="{ neigou: type.type_id==2 }" v-for="type in shopList" class=" shop_item">
            <div class="dis ">{{type.type_name}}</div>
            <template v-for="shop in type.shop_list">
                <h2 class="shop_name ">{{shop.shop_name}}</h2>
                <ul class="goods_list">
                    <li v-for="goods in shop.product_list">
                        <a class="flex" :href="linkStoreDomain+'/lvyouproduct-'+goods.product_id+'.html'">
                            <img :src="goods.image" alt="" @error="errorImg(goods)" class="goods_img" />
                            <div class="goods_info">
                                <p class="goods_name">{{goods.product_name}}</p>
                                <p class=" goods_spec_info">{{goods.spec_info}}</p>
                                <div class="clearfix">
                                    <p class="price">￥{{goods.price.price|toFixed}}</p>
                                    <span class="quantity">x{{goods.quantity}}</span>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <div @click="toSelectVoucher(shop.shop_id)" class="voucher" v-if="voucherNum(shop.shop_voucher)>0">
                    <p class="text">优惠券</p>
                    <div class="tolink">
                        <template v-if="voucherNum(shop.shop_use_voucher)>0">已选<span>{{voucherNum(shop.shop_use_voucher)}}</span>张</template>
                        <template v-else >有<span>{{voucherNum(shop.shop_voucher)}}</span>张可选</template>
                        <van-icon name="arrow" />
                    </div>
                </div>
                <div class="shop_total">
                    <p>小计<span>共{{shop.shop_checked_quantity}}件</span></p>
                    <p class="total_price">￥{{shop.shop_total_amount}}</p>
                </div>
                <div class="shop_memo">
                    <span class="fl">订单备注</span>
                    <span class="fl"><van-icon class="question" @click="show_memo"  name="question"/></span>
                    <p class="fr" @click="to_set_memo(shop)">
                        <van-icon class="arrow"  name="arrow"  />
                        <span v-if="shop.memo">{{shop.memo}}</span>
                        <span class="fbt" v-else>非必填</span>
                    </p>
                </div>
            </template>
        </div>
        </template>
        <van-popup class="popup_memo" position="right" v-model="showMemo">
            
            <van-cell-group>
            <van-field
                v-model="shop_memo"
                type="textarea"
                placeholder="请输入备注"
                rows="5"
                max-length=200
                autosize
            />
            </van-cell-group>
            <div class="max_memo">
                <van-notice-bar :scrollable="false">
                <van-icon name="warn" />最多输入200个字
                </van-notice-bar>
            </div>
            
            <van-button size="large" @click="save_shop_memo" class="save_shop_memo" bottom-action type="primary">确认</van-button>
        </van-popup>
    </div>
</template>
<script>
import config from '@/config/config.js';
import defaultImg from '../assets/img/default.png'

import Vue from 'vue'
import { mapGetters, mapActions } from "vuex";

import { Dialog } from 'vant';

import UTIL from '@/api/util'
let sign=UTIL.getQueryString('sign');

export default {
    name: "typelist",
    components: {},
    data() {
        return {
            defaultImg:defaultImg,
            linkStoreDomain:config.store_domain,
            showMemo:false,
            shop_memo:'',
            memo_shop:null
        };
    },
    filters:{
        toFixed(num){
            return Number(num).toFixed(2)
        }
    },
    created() {},
    computed: {
        ...mapGetters({
            shopList: "shoplistData"
        }),
    },
    methods: {
        to_set_memo(shop){
            this.showMemo=true;
            this.shop_memo=shop.memo;
            this.memo_shop=shop;
        },
        save_shop_memo(){
            this.$set(this.memo_shop,'memo',this.shop_memo)
            this.showMemo=false;
        },
        errorImg(goods){
            goods.image=this.defaultImg
        },
        toSelectVoucher(shop_id){
            this.$router.push({path:config.neigouFallbackPath+'o2ocheckoutVoucher.html',query:{sign:sign,shop_id:shop_id}})
        },
        voucherNum(l){
            var num=0;
            num+=l.dutyfree.length;
            num+=l.freeshipping.length;
            num+=l.voucher.length;
            return num;
        },
        show_memo(){
            Dialog.alert({
                className:'memo_dialog',
                title:'关于备注',
                confirmButtonText:'知道了',
                message: '<p class="memo_dialog_txt">如需开具发票，请务必在备注中提供单位名称及税号。（使用预付卡支付以及跨境商品暂不支持开发票）在商品不退货的情况下，按照收货地址10个工作日后寄出。</p>'
            }).then(() => {
            // on close
            });
        }
    },
    watch: {
        shop_memo(val){
            if(val.length>200){
                this.shop_memo=val.substr(0,200);
            }
        }
    }
};

</script>
