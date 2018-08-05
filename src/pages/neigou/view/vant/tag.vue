<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                高度34 可做统一高度修改
            </h2>
            <h2>基础用法</h2>
            <van-tag>标签</van-tag>
            <van-tag type="danger">标签</van-tag>
            <van-tag type="success">标签</van-tag>
            <van-tag type="primary">标签</van-tag>
            <h2>空心样式 设置plain属性设置为空心样式</h2>
            <van-tag plain>标签</van-tag>
            <van-tag plain type="danger">标签</van-tag>
            <van-tag plain type="primary">标签</van-tag>
            <van-tag plain type="success">标签</van-tag>
            <h2>圆角样式 通过mark设置为圆角样式</h2>
            <van-tag mark>标签</van-tag>
            <van-tag mark type="danger">标签</van-tag>
            <van-tag mark type="primary">标签</van-tag>
            <van-tag mark type="success">标签</van-tag>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Tag 标记",
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


