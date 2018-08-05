<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                带有背景的行内loading 宽高100 图标icon60。全局pageLoading保持一致。展示全局pageLoading则其他内容均不可点击
            </h2>
            <van-loading color="black" />
            <van-loading class="has-loading-bg" color="white" />
            <div></div>
            <van-loading type="spinner" color="black" />
            <van-loading class="has-loading-bg" type="spinner" color="white" />

            <div></div>
            <van-button type="primary" @click="showLoading()">展示pageLoading</van-button>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Loading 加载",
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        showLoading(){
            let Vm=this;
            this.$pageLoading.show()
            setTimeout(function(){
                Vm.$pageLoading.hide()
            },3000)
        }
    },
    components: { },
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;
.has-loading-bg{
    width: 100rem/$pole;
    height: 100rem/$pole;
    background-color: rgba(0, 0, 0, .5);
    padding: 20rem/$pole;
    border-radius: 8rem/$pole;
}
</style>


