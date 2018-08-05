<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <van-notice-bar :scrollable="false"
            text="点击图片预览"
            />
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
            name: "ImagePreview 图片预览",
            imgList:[
                'http://img.zcool.cn/community/0381de85949053ca8012193a3339cc5.jpg',
                'http://pic1.win4000.com/mobile/2017-10-13/59e0893628cfe.png',
                'http://img.zcool.cn/community/038c0ee5744f9a500000025ae5acd2a.jpg',
                'http://pic1.win4000.com/mobile/f/593523fb8a93d.png',
                'http://imgstore.cdn.sogou.com/app/a/100540002/758044.jpg',
                'http://img0.imgtn.bdimg.com/it/u=310245717,321710055&fm=27&gp=0.jpg',
                'http://attach.bbs.miui.com/forum/201612/06/215913vfj7u68qq7s9qwua.png',
                'http://imgstore.cdn.sogou.com/app/a/100540002/763364.jpg',
                'http://ww1.sinaimg.cn/large/d2e27164gw1fbmwcflbhrj21kw134gzl.jpg',
                'http://n.sinaimg.cn/sinacn/w811h1440/20180101/04fb-fyqefvw7281878.jpg',
                'http://up.enterdesk.com/edpic_source/12/02/46/12024623452438a85ac163270c3507ba.jpg',
                'http://file.mumayi.com/forum/201409/27/085439cleldrreledoxrtr.jpg',
                'http://f1.topitme.com/1/82/29/1145959140cc929821o.jpg',
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


