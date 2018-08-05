<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <h2>整体样式慎用，不做样式修改，数据结构和内购业务不一致，操作繁琐</h2>
            <div>
                <van-address-list
                v-model="chosenAddressId"
                :list="list"
                @add="onAdd"
                @edit="onEdit"
                />
            </div>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import { Toast } from 'vant';
export default {
    data() {
        return {
            name: "AddressList 地址列表",
            chosenAddressId: '1',
            list: [
                {
                id: '1',
                name: '张三',
                tel: '13000000000',
                address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室'
                },
                {
                id: '2',
                name: '李四',
                tel: '1310000000',
                address: '浙江省杭州市拱墅区莫干山路 50 号'
                }
            ],
            selectData: '北京/北京市/东城区/内环到三环里'
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        onAdd() {
            Toast('新增收货地址');
        },
        onEdit(item, index) {
            Toast('编辑收货地址:' + index);
        }
       
    },
    components: {  },
    computed:{

    }
};
</script>

