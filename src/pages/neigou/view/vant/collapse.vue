<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>折叠面板title 高90 左右内间距30，文字大小28</h2>
        </div>
        <van-collapse v-model="activeNames" :accordion=true>
            <van-collapse-item  name="1">
                <div slot="title">title<van-icon class="van-collapse-title-icon" name="question" /></div>
                内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊
            </van-collapse-item>
            <van-collapse-item title="title" name="2">
                内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊
            </van-collapse-item>
            <van-collapse-item title="title" name="3">
                内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊内容啊
            </van-collapse-item>
        </van-collapse>
    </div>
</template>
<script>
import './css/vant.scss'
export default {
    data() {
        return {
            name: "Collapse 折叠面板",
            activeNames: ['1']
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
<style lang="scss">
$pole:750/10;
.van-collapse-title-icon{
    margin: 0 5rem/$pole;
    color: #38f;
}
</style>


