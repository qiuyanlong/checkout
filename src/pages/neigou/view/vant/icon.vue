<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <ul class="iconlist">
                <li v-for="item in iconList">
                    <van-icon :name=item />
                    <p>{{item}}</p>
                </li>
            </ul>
            <div>
                
            </div>
        </div>
    </div>
</template>
<script>

import './css/vant.scss'
export default {
    data() {
        return {
            name: "Icon 图标",
            iconList:["close","upgrade","add-o","passed","chat","question","clock","gold-coin","play","pause","stop","more-o","info-o","share","like-o","logistics","edit","exchange","location","cart","shop","gift","contact","wap-home","points","discount","point-gift","after-sale","edit-data","delete","records","completed","certificate","tosend","sign","home","free-postage","birthday-privilege","member-day-privilege","balance-details","cash-back-record","points-mall","exchange-record","pending-payment","pending-orders","pending-deliver","pending-evaluate","password-view","password-not-view","check","arrow","arrow-left","search","success","fail","add","checked","warn","clear","underway","more","like","photograph","qr-invalid","qr","add2","photo","wechat","alipay","wap-nav","ecard-pay","balance-pay","peer-pay","credit-pay","debit-pay","other-pay","shopping-cart","browsing-history","goods-collect","shop-collect","receive-gift","send-gift","setting","coupon","gift-card-pay","cash-on-deliver","phone","description","card","value-card","gift-card","hot","new","new-arrival","hot-sale",]
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})}
    },
    components: {  },
    computed:{

    }
};
</script>
<style lang="scss">
$pole:75;
.iconlist{
    display: flex;
    flex-wrap:  wrap ;
    li{
        padding: 5rem/$pole;
        box-sizing: border-box;
        width: 25%;
        display: inline-block;
        text-align: center;
        p{
            background: #fff;
            height: 60rem/$pole;
            line-height: 30rem/$pole;
        }
        i{
            background: #fff;
            width: 100%;
            display: block;
            height: 100rem/$pole;
            padding-top: 10rem/$pole;
            vertical-align: middle;
            font-size: 80rem/$pole;
            color: #38f;
        }
    }
}
</style>


