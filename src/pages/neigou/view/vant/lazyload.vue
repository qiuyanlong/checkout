<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            
            <img @click="showImagePreview(index)" v-for="(img,index) in imgList" v-lazy="img" >
        </div>
    </div>
</template>
<script>
import './css/vant.scss'
import Vue from 'vue';

import { ImagePreview } from 'vant';
import { Lazyload } from 'vant';
Vue.use(Lazyload,{
  preLoad: 2,
  loading: loadingImg,
  attempt: 1,
  lazyComponent:true
});
import loadingImg from './img/loading.gif'
export default {
    data() {
        return {
            name: "Lazyload 图片懒加载",
            imgList:[
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704571186&di=0d80d806740c634ec98062f613809874&imgtype=0&src=http%3A%2F%2Fi2.sanwen.net%2Fdoc%2F1608%2F704-160P1221000.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603734&di=9bffae8be3483300af7582adc7d95282&imgtype=0&src=http%3A%2F%2Fpic22.photophoto.cn%2F20120130%2F0036036853748403_b.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603734&di=74b7295825333e8af038933fb3dadbb8&imgtype=0&src=http%3A%2F%2Fs3.sinaimg.cn%2Fmw690%2F004lIdBbzy76DSx1j1wb2%26690',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603734&di=d2de413c818cbcd0497b07ce7f33a5c7&imgtype=0&src=http%3A%2F%2Fpic.feizl.com%2Fupload%2Fallimg%2F170615%2F0J30H300-8.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603732&di=cd329b564c01b044b580ddc628e517bb&imgtype=0&src=http%3A%2F%2Fs13.sinaimg.cn%2Fmw690%2F002OEOYOzy7dznrZ0Xa7c%26690',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603731&di=fed043ca46c69e858d63351b557b8b94&imgtype=0&src=http%3A%2F%2Fs14.sinaimg.cn%2Fmw690%2F006IziaJzy7aoHfrCIR2d%26690',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603744&di=d4ab8de9ded06135976fa21736d3db2e&imgtype=0&src=http%3A%2F%2Fold.bz55.com%2Fuploads%2Fallimg%2F161115%2F140-1611151UK9.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603742&di=5552092d4aecbb6c0c6ea69bafce1ce5&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201601%2F06%2F20160106153242_iWYsv.jpeg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527704603741&di=95bf9f415fac2fa891b2f556ad274506&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201601%2F05%2F20160105140905_Zc8i2.jpeg',
                
            ]
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        showImagePreview(index){
            ImagePreview(this.imgList,index);
        }
    },
    components: {  },
    computed:{

    }
};
</script>
<style scoped lang="scss">
.content{
    img{
        width: 100%;
        margin: 10px 0;
    }
}
</style>


