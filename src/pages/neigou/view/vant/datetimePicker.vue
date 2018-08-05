<template>
    <div class="vant">
        <van-nav-bar :title=name left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft">
            <van-icon @click="toVant" name="wap-home" slot="right" />
        </van-nav-bar>
        <van-datetime-picker class="ng-time-picker"
            v-model="currentDate"
            type="datetime"
            :min-date="minDate"
            :max-date="maxDate"
            
            />
        <o2oSelectDage
            v-model="date" 
            :date_ahead="date_ahead"
            :invalid_dates="invalid_dates"
         ></o2oSelectDage>
        
    </div>
</template>
<script>
import './css/vant.scss'
import o2oSelectDage from '@/pages/neigou/components/o2oSelectDate.vue'
export default {
    data() {
        return {
            name: "o2oSelectDage 时间选择",
            minHour: 10,
            maxHour: 20,
            minDate: new Date(),
            maxDate: new Date(2019, 10, 1),
            currentDate: new Date(),

            date:'',
            invalid_dates:'2018-05-31,2018-06-01,2018-06-02,2018-06-03,2018-06-04,2018-06-06,2018-06-08,2018-06-10,2018-06-11,2018-06-13,2018-06-15,2018-06-17,2018-06-18,2018-06-20,2018-06-22,2018-06-24,2018-06-25,2018-06-27,2018-06-29,2018-07-01,2018-07-02',
            date_ahead:[1]
        };
    },
    mounted() {

    },
    methods:{
        onClickLeft(){ this.$router.go(-1)},
        toVant(){ this.$router.push({name:'vantlist'})},
        
    },
    components: { o2oSelectDage },
    computed:{

    }
};
</script>
<style lang="scss">
$pole:75;

.ng-time-picker{
    &.van-picker{
        .van-picker__columns{
            height: 440rem/$pole !important;
            .van-picker-column{
                height: 440rem/$pole !important;
                line-height: 88rem/$pole !important;
                ul{
                    line-height: 88rem/$pole !important;
                }
            }
        }
        
    }
    .van-picker__frame.van-hairline--top-bottom{
        height: 88rem/$pole !important;
    }
}

</style>

