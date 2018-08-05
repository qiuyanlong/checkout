<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>整体样式不做修改</h2>
            <h2>Tabbar 标签栏</h2>
            <van-tabbar v-model="active">
            <van-tabbar-item icon="shop">标签</van-tabbar-item>
            <van-tabbar-item icon="chat" info=''>标签</van-tabbar-item>
            <van-tabbar-item icon="records" info="5">标签</van-tabbar-item>
            <van-tabbar-item icon="gold-coin" info="20">标签</van-tabbar-item>
            </van-tabbar>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Tabbar 标签栏",
            active: 0
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

</style>


