<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>基础用法</h2>
            
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Popup 弹出层",
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


