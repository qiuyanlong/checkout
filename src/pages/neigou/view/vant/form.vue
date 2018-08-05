<template>
    <div class="vant">
        
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>
                所有单选 复选 大小36*36 </br>
                搜索框整体高度84，搜索区域60,文案距离左侧70 距离icon图标20</br>
                密码框整体样式，和键盘样式不做特定修改</br>
                switch开关涉及到具体应用做特定样式修改。
                通用样式104 * 64
            </h2>
            <input type="text" v-model="ccc" @input="aaa">
            <h2>Checkbox 复选框</h2>
            <van-checkbox-group v-model="result">
            <van-checkbox
                v-for="(item, index) in list"
                :key="item"
                :name="item"
            >
                复选框 {{ item }}
            </van-checkbox>
            </van-checkbox-group>
            <h2>Radio 单选框</h2>

            <van-radio-group v-model="radio">
            <van-radio name="1">单选框 1</van-radio>
            <van-radio name="2">单选框 2</van-radio>
            </van-radio-group>
        </div>
            <h2>Search 搜索</h2>
            <van-search placeholder="请输入商品名称" v-model="search_value" />
            <form action="/">
            <van-search
                v-model="search_value"
                placeholder="请输入商品名称"
                show-action
                @search="onSearch"
                @cancel="onCancel"

               
            />
            </form>

            <van-search
            v-model="search_value"
            show-action
            @search="onSearch"
            >
            <div slot="action" @click="onSearch">搜索</div>
            </van-search>


        <div class="content">
            <h2>NumberKeyboard 数字键盘</h2>
            <van-button @touchstart.native.stop="show = true;show1 = false">
            弹出默认键盘
            </van-button>
            <van-button @touchstart.native.stop="show1 = true;show = false">
            自定义
            </van-button>
            <van-number-keyboard
            :show="show"
            extra-key="."
            close-button-text="完成"
            @blur="show = false;"
            @input="onInput"
            @delete="onDelete"
            />

            <van-number-keyboard
            :show="show1"
            theme="custom"
            
            close-button-text="完成"
            @blur="show1 = false"
            @input="onInput1"
            @delete="onDelete1"
            />
            <h2>PasswordInput 密码输入框</h2>
            <van-password-input
            :value="value"
            info="密码为 6 位数字"
            @focus="show1 = true"
            />

            <h2>Switch 开关</h2>
            <van-switch v-model="switchchecked" />
            <van-switch v-model="switchchecked" disabled />
            <van-switch v-model="switchchecked" loading />

            <h2>Uploader 图片上传</h2>
            <van-uploader :after-read="onRead" accept="image/gif, image/jpeg, image/png" multiple>
            <van-icon name="photograph" />
            </van-uploader>
        </div>
    </div>
</template>
<script>
import UTIL from '@/api/util.js'
import './css/vant.scss';
import { Toast } from 'vant';
export default {
    data() {
        return {
            name: "From 表单",
            checked:true,
            list: ['a', 'b', 'c'],
            result: ['a', 'b'],

            show: false,
            show1:false,
            value:'',
            radio:1,
            search_value:'',
            switchchecked:false,
            ccc:''
        };
    },
    mounted() {
        
    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        aaa:UTIL.debounce(function(){
            console.log(this.ccc)
        },200),
        onInput(value) {
            Toast(value);
        },
        onInput1(key) {
            this.value = (this.value + key).slice(0, 6);
        },
        onDelete1() {
            this.value = this.value.slice(0, this.value.length - 1);
        },
        onDelete() {
            Toast('delete');
        },
        onSearch(){
            Toast(this.search_value);
        },
        onCancel(){
            this.search_value=''
        },
        onRead(file) {
            Toast(file)
        }
    },
    components: { },
    computed:{

    },
    watch:{
       search_value:UTIL.throttle(function(val){
           console.log(val)
       },1000)
    }
};
</script>
<style lang="scss" scoped>
$pole:75;

</style>


