<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                文案提示：文字大小24 间距24 高度72
                </br>
                loading success error  不做样式修改
            </h2>
            <h2>基础用法</h2>
            <van-button @click="a()" type="primary">文案提示</van-button>
            <van-button @click="b()" type="primary">loading</van-button>
            <van-button @click="c()" type="primary">success</van-button>
            <van-button @click="d()" type="primary">error</van-button>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import { Toast } from 'vant';
export default {
    data() {
        return {
            name: "Toast 轻提示",
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        a(){
            Toast('我是提示文案，建议不超过十五字~');
        },
        b(){
            Toast.loading({
            mask: true,
            message: '加载中...'
            });
        },
        c(){
            Toast.success('成功文案');
        },
        d(){
            Toast.fail('失败文案');
        },
    },
    components: { },
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;

</style>


