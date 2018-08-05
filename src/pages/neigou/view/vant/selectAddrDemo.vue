<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <div class="content">
            <div>
                <SelectAddr v-model="selectData" ></SelectAddr>
            </div>
        </div>
    </div>
</template>
<script>
import './css/vant.scss';
import SelectAddr from '@/pages/neigou/components/selectAddr.vue'
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
            selectData: {
                addr:'mainland:上海/上海市/黄浦区/城区:3928',
                id:[
                    1,1,2,3
                ]
            }
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
    components: { SelectAddr },
    computed:{

    }
};
</script>

