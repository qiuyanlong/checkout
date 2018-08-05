<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <van-notice-bar 
            text="这个好像根本不好用 还是不要用了! 由于绘制问题导致UI不正确" 
            left-icon="https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=fe3fec8834fae6cd0ce1a3673f83231c/ca1349540923dd543f5aaad7d009b3de9c824867.jpg"  
            background="red"
            color="#fff"
        />
        <div class="content">
            <van-circle
                v-model="currentRate"
                :rate="30"
                :speed="100"
                :text="text"

                class="circle"
            />
        </div>
    </div>
</template>
<script>
import './css/vant.scss'
export default {
    data() {
        return {
            name: "Circle 环形进度条",
            currentRate: 0
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        
    },
    components: {  },
    computed:{
        text() {
            return this.currentRate.toFixed(0) + '%'
        }
    }
};
</script>
<style lang="scss">
$pole:750/10;
.circle{
    width: 700rem/$pole !important;
    height: 100rem/$pole !important;
}
</style>


