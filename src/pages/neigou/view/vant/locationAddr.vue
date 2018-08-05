<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <LocationAddr class="c_location_addr" :city_name="city_name" v-model="locationAddrData"></LocationAddr>
            <div></div>
            <van-button @click="city_name=''" type="primary">设置city_name为空</van-button>
            <van-button @click="city_name='北京市'" type="primary">设置city_name --北京 </van-button>

            <h2></h2>
            <h2>
                {{locationAddrData}}
            </h2>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import LocationAddr from '@/pages/neigou/components/locationAddr.vue'
export default {
    data() {
        return {
            name: "locationAddr",
            locationAddrData:{
                deliver_json:'',
                deliver_area:'',
                deliver_addr:''
            },
            city_name:'北京市',
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        
    },
    components: { LocationAddr},
    computed:{

    }
};
</script>
<style lang="scss" scoped>
$pole:75;
#location_deliver_area{
    color: red;
}
</style>
<style lang="scss">
$pole:75;
.c_location_addr{
    display: block;

    #location_deliver_area{
        color:#333;
        border:1px solid #ccc;
        padding:30rem/$pole;
        width:100%;
        display: block;
        background:#fff;
        margin:10rem/$pole 0;
    }
}
</style>