<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>样式不做修改</h2>
            <h2>基础用法</h2>
            <van-progress :percentage="50" />
            <h2>置灰</h2>
            <van-progress  inactive :percentage="70" />
            <h2>样式定制</h2>
            <van-progress
            pivot-text="橙色"
            color="#f2826a"
            :percentage="25"
            />
           <h2></h2>
            <van-progress
            pivot-text="红色"
            color="#f3594b"
            :percentage="50"
            />
            <h2></h2>
            <van-progress
            :percentage="75"
            pivot-text="紫色"
            pivot-color="#7232dd"
            color="linear-gradient(to right, #be99ff, #7232dd)"
            />
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Progress 进度条",
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


