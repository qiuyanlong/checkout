<template>
    <div class="cart">
        <van-swipe :autoplay="3000" class="swipe">
  <van-swipe-item>1</van-swipe-item>
  <van-swipe-item>2</van-swipe-item>
  <van-swipe-item>3</van-swipe-item>
  <van-swipe-item>4</van-swipe-item>
</van-swipe>
        <van-button type="default">默认按钮</van-button>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="danger">危险按钮</van-button>

        <van-cell-group>
            <van-cell title="单元格" value="内容" />
            <van-cell title="单元格" value="内容" label="描述信息" />
        </van-cell-group>
        <van-circle
            v-model="currentRate"
            color="#13ce66"
            fill="#fff"
            size="200px"
            layer-color="#eee"
            :text="text"
            :rate="rate"
            :speed="100"
            :clockwise="false"
            :stroke-width="60"
        />
        <van-loading color="black" />
<van-loading color="white" />
<van-loading type="spinner" color="black" />
<van-loading type="spinner" color="white" />
        <lazy-component class="img">
            <img v-for="img in imageList" v-lazy="img" >
        </lazy-component>
        <van-checkbox v-model="checked">复选框</van-checkbox>

        <van-popup v-model="show1"  :overlay="true">
        内容
        </van-popup>
        <van-button @click="show1=true" type="default">弹出弹层</van-button>


        <van-button @click="toast1" type="primary">弹出1提示</van-button>
        <van-button @click="toast2" type="primary">弹出2提示</van-button>
        <van-button @click="toast3" type="primary">弹出3提示</van-button>
        <van-button  @click="toast4" type="primary">弹出4提示</van-button>
    </div>
</template>

<script>
import { Toast } from 'vant';
import loadingImg from './img/loading.gif'
import Vue from 'vue'
import { Button } from 'vant';
import { Cell, CellGroup } from 'vant';
Vue.use(Button);
Vue.use(Cell).use(CellGroup);
import { Circle } from 'vant';

Vue.use(Circle);

import { ImagePreview } from 'vant';
ImagePreview([
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527612926411&di=c323ed3dde84a26f23481c8cd35a4bda&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F593e50a9334d2.jpg',
  'https://img.yzcdn.cn/2.jpg'
]);

import { Lazyload } from 'vant';

Vue.use(Lazyload,{
  preLoad: 2,
  loading: loadingImg,
  attempt: 1,
  lazyComponent:true
});

import { Loading } from 'vant';

Vue.use(Loading);

import { Swipe, SwipeItem } from 'vant';

Vue.use(Swipe).use(SwipeItem);

import { Checkbox, CheckboxGroup } from 'vant';

Vue.use(Checkbox).use(CheckboxGroup);

import { Popup } from 'vant';

Vue.use(Popup);


import "./css/cart.scss";
export default {
    name: "Index",
    data() {
        return {
            show1:false,
            show2:false,
            show3:false,
            checked:false,
            currentRate: 50,
            rate:60,
            imageList:[
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613096189&di=6fb502290ff9029dada247103b3d1108&imgtype=0&src=http%3A%2F%2Fwww.sinaimg.cn%2Fdy%2Fslidenews%2F21_img%2F2016_05%2F41065_4826094_235056.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613119321&di=89d0326f3b28b3561986eeb05663f92c&imgtype=0&src=http%3A%2F%2Fwww.sinaimg.cn%2Fdy%2Fslidenews%2F21_img%2F2016_05%2F41065_4826099_393173.jpg',
                'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1853910018,4113999733&fm=27&gp=0.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613119319&di=800f32eda9bf9dedbe1a6bebdc55762f&imgtype=0&src=http%3A%2F%2Fjiangsu.china.com.cn%2Fuploadfile%2F2016%2F1122%2F1479776954541886.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613180067&di=f96edebdde0418f510671ddc4b5a4472&imgtype=0&src=http%3A%2F%2Fcul.china.com.cn%2Fcswh%2Fimages%2Fattachement%2Fjpg%2Fsite449%2F20160215%2F0c8268021069182bb49819.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613195099&di=7257d26604dfd4c04a27af7ff159e973&imgtype=0&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170408%2F739500e41bfe4a0288e21595bce55a4f_th.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527613221827&di=6c8bb5f2227d85203b66768f887b6055&imgtype=0&src=http%3A%2F%2Fs9.rr.itc.cn%2Fr%2FwapChange%2F20171_2_23%2Fa5t9dv04118024730405.jpg'


            ]
        };
    },
    mounted() {  
      
    },
    methods:{
        toast1(){
            Toast('我是提示文案，建议不超过十五字~');
        },
        toast2(){
            Toast.loading({
                mask: true,
                message: '加载中...'
            });
        },
        toast3(){
            Toast.success('成功文案');
        },
        toast4(){
            Toast.fail('失败文案');
        },
    },
    components: {  },
    computed:{
        text() {
            return this.currentRate.toFixed(0) + '%'
        }
    }
};
</script>

