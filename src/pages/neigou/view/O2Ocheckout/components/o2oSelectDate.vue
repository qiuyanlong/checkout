/*
 * @Author: HW.Liang 
 * @Date: 2018-06-01 11:13:09 
 * @Last Modified by: HW.Liang
 * @Last Modified time: 2018-06-14 15:43:24
 */
<template>
    <div id="o2o-select-date">
        <div v-if="show">
            <select v-model="selectDay" name="" id="" >
                <option value="">请选择</option>
                <option  v-for="item in canUseDay" :value="item.value">{{item.label}}</option>
            </select>
        </div>
    </div>
</template>
<script>
// 给Date对象添加getYMD方法，获取字符串形式的年月日  
Date.prototype.getYMD = function(){  
    let year=this.getFullYear();
    let mouth=this.getMonth() + 1;
    let day=this.getDate();
    if(mouth<10){
        mouth='0'+mouth
    }
    if(day<10){
        day='0'+day
    }
    return year+'-'+mouth+'-'+day
}  
export default {
    data() {
        return {
            selectDay:'',
            show:true,
            startDisparity:3,
            endDisparity:22,
        };
    },
    props:['value','date_ahead','invalid_dates','weekText'],
    mounted() {

    },
    methods:{
        
        getDays(day1, day2) {  
            // 获取入参字符串形式日期的Date型日期  
            let d1 =day1
            let d2 =day2
        
            // 定义一天的毫秒数  
            let dayMilliSeconds  = 1000*60*60*24;  
            
            // 获取输入日期的毫秒数  
            let d1Ms = d1.getTime();  
            let d2Ms = d2.getTime();  
            
            // 定义返回值  
            let ret;  
            
            // 对日期毫秒数进行循环比较，直到d1Ms 大于等于 d2Ms 时退出循环  
            // 每次循环结束，给d1Ms 增加一天  
            for (d1Ms; d1Ms <= d2Ms; d1Ms += dayMilliSeconds) {  
            
                // 如果ret为空，则无需添加","作为分隔符  
                if (!ret) {  
                    // 将给的毫秒数转换为Date日期  
                    let day = new Date(d1Ms);  
                    // 获取其年月日形式的字符串  
                    ret = day.getYMD();  
                } else {  
                // 否则，给ret的每个字符日期间添加","作为分隔符  
                    let day = new Date(d1Ms);  
                    ret = ret + ',' + day.getYMD();  
                }  
            }  
            return ret
           
        },
        
    },
    components: {  },
    computed:{
        canUseDay(){
            let Vm=this;
            let week_text=['日','一','二','三','四','五','六']
            let canUseDay=[
                
            ]
            let newDate=new Date();
            let startDate= new Date(newDate.getTime() + this.startDisparity*24*60*60*1000);
            let endDate= new Date(newDate.getTime() + this.endDisparity*24*60*60*1000);
            let days=this.getDays(startDate,endDate).split(',')
            days.forEach(item => {
                let D=item.split('-');
                let year=D[0]
                let month=D[1]
                let day=D[2]
                
                let sdate = new Date(year, month - 1,day);
                let week=sdate.getDay();
                if(this.invalid_dates.indexOf(item)>=0){
                    
                }else{
                    canUseDay.push({"label":item+'    '+ (this.weekText||'星期') +week_text[week],"value":item})
                }
            });
            return canUseDay
        }
    },
    watch:{
       selectDay(val){
           this.$emit('input',val)
       } 
    }
};
</script>
<style scoped lang="scss">
$pole:75;
table{
    width: 100%;
    background: #fff;
    text-align: center;
    td{
        border: 1px solid #ccc;
        height: 60rem/$pole;
        line-height:60rem/$pole;
        font-size: 28rem/$pole;
    }
}
select{
    width: 30%;
    height: 60rem/$pole;
    font-size: 28rem/$pole;
    border: 1px solid #ccc;
}
</style>


