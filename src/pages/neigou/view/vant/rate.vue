<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <van-notice-bar >
        size:属性已经失效，css为了支持rem定义了全局的样式，
        </van-notice-bar>
        <div class="content">
            <h2>样式可全局配置：宽高60 52</h2>
            <h2>基础用法</h2>
            <van-rate v-model="value" />

            <h2>自定义颜色</h2>
            <van-rate
            v-model="value"
            :size="22"
            :count="6"
            color="#2ba"
            void-color="#ceefe8"
            />
            <h2>禁用状态</h2>
            <van-rate v-model="value" disabled />
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Rate 评分",
            value:5
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


