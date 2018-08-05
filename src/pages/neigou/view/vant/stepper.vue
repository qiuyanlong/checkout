<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>整体大小250*60  加减号 60*60  中间输入框130*60</h2>
            <h2>基础用法</h2>
            <van-stepper v-model="value" />
            <h2>禁用状态</h2>
            <van-stepper v-model="value" disabled />
            <h2>高级用法-步进1 最小5 最大20</h2>
            <van-stepper
            v-model="value1"
            integer
            :min="5"
            :max="20"
            :step="1"
            :default-value="value1"
            />
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Stepper 步进器",
            value:1,
            value1:2
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


