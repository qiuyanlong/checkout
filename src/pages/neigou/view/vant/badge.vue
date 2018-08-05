<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        
            <van-badge-group :active-key="activeKey">
                <van-badge title="标签名称" @click="onClick" />
                <van-badge title="标签名称" @click="onClick" info="8" />
                <van-badge title="标签名称" @click="onClick" info="99" />
                <van-badge title="标签名称" @click="onClick" info="199" />
            </van-badge-group>
        
    </div>
</template>
<script>
import './css/vant.scss'
export default {
    data() {
        return {
            name: "Badge 徽章",
            activeKey: 0
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        onClick(key) {
            this.activeKey = key;
        }
    },
    components: {  },
    computed:{

    }
};
</script>

