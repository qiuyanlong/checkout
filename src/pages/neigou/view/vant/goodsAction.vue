<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                默认高度100，按钮样式可调整
            </h2>
            <div>
                <van-goods-action style="bottom:200px">
                <van-goods-action-mini-btn icon="arrow-left"  @click="onClickMiniBtn" />
                <van-goods-action-mini-btn icon="cart"  @click="onClickMiniBtn" />
                <van-goods-action-big-btn text="加入购物车" primary @click="onClickBigBtn" />
                </van-goods-action>
            </div>
            <div>
                <van-goods-action >
                <van-goods-action-mini-btn icon="arrow-left"  @click="onClickMiniBtn" />
                <van-goods-action-mini-btn icon="cart"  @click="onClickMiniBtn"  info="5"/>
                <van-goods-action-big-btn text="比京东贵？" @click="onClickBigBtn" />
                <van-goods-action-big-btn text="加入购物车" @click="onClickBigBtn" primary />
                </van-goods-action>
            </div>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';

import { Toast } from 'vant';

export default {
    data() {
        return {
            name: "GoodsAction 商品页行动点",
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        onClickMiniBtn() {
            Toast('点击图标');
        },
        onClickBigBtn() {
            Toast('点击按钮');
        }
        
    },
    components: {  },
    computed:{

    }
};
</script>

