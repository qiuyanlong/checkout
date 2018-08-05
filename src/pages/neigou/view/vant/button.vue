<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                默认按钮大小 高度：96 左右文案边距30。大号高度：100，默认block宽度100%
                禁用按钮颜色 背景颜色#eee
            </h2>
            <div>
                <van-button type="default">默认按钮</van-button>
                <van-button type="primary">主要按钮</van-button>
                <!-- <van-button type="danger">危险按钮</van-button> -->
                <van-button disabled>禁用状态</van-button>
            </div>
            </div>
            <div>
                <van-button size="large" bottom-action type="primary">大号按钮</van-button>
            <div>
                
            </div>

            <h2>其他按钮（不常用）</h2>
            <div>
                <van-button loading />
                <van-button loading type="primary" />   
            </div>
            <van-button type="primary" block>按钮</van-button>
            <van-row>
                <van-col span="12">
                    <van-button bottom-action>按钮</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="primary" bottom-action>按钮</van-button>
                </van-col>
            </van-row>
        </div>
    </div>
</template>
<script>
import './css/vant.scss'
export default {
    data() {
        return {
            name: "按钮-vantButton",
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})}
    },
    components: {  },
    computed:{

    }
};
</script>

