<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                中间弹出可能会被请提示替换，如果弹出的是具体内容可以使用Dialog弹出框， 主要应用是底部弹出，用做信息展示。
                底部弹出样式 title高度98，文案大小30.关闭按钮和底部按钮可按需添加。内部内容自定义。
</br>
                右侧弹出用于 商品列表删选器，页面内整页面覆盖弹出。宽度可配置
            </h2>
            <h2>基础用法</h2>
            <van-button type="primary" @click='show1=true'>中间弹出</van-button>
            <van-popup class="popup1" v-model="show1">
                神马文案乱七八糟的
            </van-popup>
            <h2>弹出位置</h2>
            <van-button type="primary" @click='show2=true'>底部</van-button>
            <van-button type="primary" @click='show3=true'>右侧全局</van-button>

            <van-popup class="popup2" v-model="show2" position="bottom" >
                <div class="van-popup__title">标题 <a @click='show2=false' class="van-popup__close" href="javascript:;"></a></div>
                样式完全需要自己定义
                <a class="van-popup__buttom_btn" href="javasript:;" @click='show2=false'>知道了</a>
            </van-popup>
             <van-popup class="popup3" v-model="show3" position="right" >
            样式完全需要自己定义
            <van-button type="danger" @click='show3=false'>关闭</van-button>
            </van-popup>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Popup 弹出层",
            show1:false,
            show2:false,
            show3:false,
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        
    },
    components: { },
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;
.popup1{
    width: 80%;
}
.popup2{
    width: 100%;
    
    height: 300rem/$pole;
}
.popup3{
    width: 100%;
    height: 100%;
}
</style>


