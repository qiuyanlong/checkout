<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>整体样式不做修改</h2>
            <h2>基础用法</h2>
            <van-steps :active="active">
            <van-step>买家下单</van-step>
            <van-step>商家接单</van-step>
            <van-step>买家提货</van-step>
            <van-step>交易完成</van-step>
            </van-steps>

            <h2>描述信息-通过title和description属性来定义描述信息信息</h2>
            <van-steps
            :active="active"
            icon="location"
            title="订单信息"
            description="当前进度"
            >
            <van-step>买家下单</van-step>
            <van-step>商家接单</van-step>
            <van-step>买家提货</van-step>
            <van-step>交易完成</van-step>
            </van-steps>

            <h2>竖向步骤条</h2>
            <van-steps direction="vertical" :active="0" active-color="#44bbff" >
            <van-step>
                <h3>【城市】物流状态1</h3>
                <p>2016-07-12 12:40</p>
            </van-step>
            <van-step>
                <h3>【城市】物流状态2</h3>
                <p>2016-07-11 10:00</p>
            </van-step>
            <van-step>
                <h3>快件已发货</h3>
                <p>2016-07-10 09:30</p>
            </van-step>
            </van-steps>
        </div>
    </div>
</template>
<script>
import icon from './img/icon.png'
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Steps 步骤条",
            active: 2,
            icon:icon
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


