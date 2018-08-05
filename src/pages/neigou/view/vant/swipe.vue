<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
            <h2>
                轮播图 小点点可以修改14*14 间距14
            </h2>
            <h2>基础用法</h2>
            <van-swipe :autoplay="3000" class="swipe">
            <van-swipe-item>1</van-swipe-item>
            <van-swipe-item>2</van-swipe-item>
            <van-swipe-item>3</van-swipe-item>
            <van-swipe-item>4</van-swipe-item>
            </van-swipe>

            <h2>将v-lazy指令的值设置为你需要懒加载的图片</h2>
            <van-swipe class="swipe" :autoplay="2000">
            <van-swipe-item v-for="(image, index) in images" :key="index">
                <img v-lazy="image" />
            </van-swipe-item>
            </van-swipe>
        
    </div>
</template>
<script>
import Vue from 'vue'
import './css/vant.scss';
import { Lazyload } from 'vant';
Vue.use(Lazyload);
export default {
    data() {
        return {
            name: "Swipe 轮播",
            images: [
                '//bcdn.ddguanhuai.com/Uploads/admin/mallbanner/2018-06-14/19199b3aeb785673c81f2d5fab18982e.jpg',
                '//bcdn.ddguanhuai.com/Uploads/admin/mallbanner/2018-06-21/054d4ad4cb127315d661426b10f995e7.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528132769456&di=c75c4a3c1f23fa8c287db5384f090fcb&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2789230263%2C841611518%26fm%3D214%26gp%3D0.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528132791265&di=95a5ae36a623fd4a3acd59562c53cbf3&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D4114628878%2C2796433791%26fm%3D214%26gp%3D0.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528132812893&di=beb4d254be889f42dc15a438ff43644f&imgtype=0&src=http%3A%2F%2Fwww.cq67.com%2Fuploads%2Fmeishi%2F15143%2F16042G30933-13.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528132852933&di=fa58d677b432494b124ffb32fdd32204&imgtype=0&src=http%3A%2F%2Fold.bz55.com%2Fuploads%2Fallimg%2F160628%2F139-16062Q61023.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528132862307&di=a68e39f510bd4199d72e961c8f87c506&imgtype=jpg&src=http%3A%2F%2Fimg3.imgtn.bdimg.com%2Fit%2Fu%3D2352928698%2C3482780601%26fm%3D214%26gp%3D0.jpg',
            ]
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
.swipe{
    height: 340rem/$pole;
    .van-swipe-item{
        background: #44bbff
    }
    img{
        width: 100%;
        height: 340rem/$pole;
    }
}
</style>


