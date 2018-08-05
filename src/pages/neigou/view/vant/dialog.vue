<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                主要用于二次确认。标题高度72 上间距30，内容自定义，内容区域内间距上下30左右40，按钮高度100文字大小32
            </h2>
            <h2>基础用法</h2>
            <van-button @click="a()" type="primary">alert</van-button>
            <van-button @click="b()" type="primary">无标题alert</van-button>
            <van-button @click="c()" type="primary">确认 取消</van-button>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import { Dialog } from 'vant';
export default {
    data() {
        return {
            name: "Dialog 弹出框",
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        a(){
            Dialog.alert({
            title: '标题',
            message: '弹窗内容'
            }).then(() => {
                alert('close')
            });

        },
        b(){
            Dialog.alert({
            message: '弹窗内容'
            }).then(() => {
                alert('close')
            });

        },
        c(){
            Dialog.confirm({
            title: '标题',
            message: '弹窗内容'
            }).then(() => {
            // on confirm
            }).catch(() => {
            // on cancel
            });
        }
    },
    components: { },
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;

</style>


