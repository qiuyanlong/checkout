<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <div>
                <van-switch v-model="checked" size="80px"/>
            </div>
            <div>
                <van-switch v-model="checked" disabled size="80px"/>
            </div>
            <div>
               <van-switch v-model="checked" loading size="80px"/>
            </div>
            <div>
                <van-switch :value="checked" size="80px" @input="onInput" />
            </div>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import Vue from 'vue';
import { Switch } from 'vant';
import { Dialog } from 'vant';
;
Vue.use(Switch);
export default {
    data() {
        return {
            checked: true,
            name: "Switch 开关",
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
         toVant(){ this.$router.push({name:'vantlist'})},
        onInput(checked) {
            Dialog.confirm({
                title: '提醒',
                message: '是否切换开关？'
            }).then(() => {
                this.checked = checked;
            });
        }
    },
    components: {  },
    computed:{

    }
};
</script>

