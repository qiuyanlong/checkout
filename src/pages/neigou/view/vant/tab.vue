<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                高度88 高度 文字大小 颜色 可修改，单个标签宽度不做修改。
            </h2>
        </div>
        <van-tabs v-model="active" swipeable>
        <van-tab :key="index"  v-for="(item,index) in list" :title="'tab'+item.title" >
            内容 {{ item.content }}{{index}}
        </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import './css/vant.scss';
export default {
    data() {
        return {
            name: "Tab 标签页",
            active:1,
           
            list:[
                {title:'1',content:'111111'},
                {title:'2',content:'2222222'},
                {title:'3',content:'33333333333'},
                {title:'4',content:'44444444'},
                {title:'5',content:'55555555555555555'},
                {title:'6',content:'6666666666'},
                {title:'7',content:'77777777777'},
                {title:'8',content:'888888888'},
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

</style>


