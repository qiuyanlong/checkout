<template>
    <div v-if="dateAheadData==1" class="SelectDate">
        <h1 class="m_title">预订时间</h1>
        <div class="lvyouInformation clearfix" >
            <label class="lvyouinfo-timeTxt">请选择预订时间</label>
            <select v-model="selectDate" name="" id="" >
                <option value="">请选择</option>
                <option  v-for="item in canUseDay" :value="item.value">{{item.label}}</option>
            </select>
            <span>
                {{selectDate||'请选择'}}
            </span>
        </div>
        <span class="err" v-if="_selectDate.err">{{_selectDate.err}}</span>
    </div>
</template>
<script>
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

import { mapGetters,mapActions } from 'vuex';

export default{
	name: 'checkoutSelectDate',
	components:{

	},
	data(){
		return{
            selectDate:'',
            startDisparity:3,
            endDisparity:22,
		}
    },
    created(){
        
    },
    mounted() {
        if(this._selectDate.val){
            this.selectDate=this._selectDate.val
        }
    },
    computed:{
        ...mapGetters({
            invalidDatesData:'invalidDatesData',
            dateAheadData:'dateAheadData',
            _selectDate:'selectDate'
        }),
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
                if(Vm.invalidDatesData.indexOf(item)>=0){
                    
                }else{
                    canUseDay.push({"label":item+'    '+ (this.weekText||'星期') +week_text[week],"value":item})
                }
            });
            return canUseDay
        }
    },
    methods:{
        getDays(day1, day2) {  
            let d1 =day1
            let d2 =day2
            let dayMilliSeconds  = 1000*60*60*24;  
            
            let d1Ms = d1.getTime();  
            let d2Ms = d2.getTime();  
            
            let ret;  
            
            for (d1Ms; d1Ms <= d2Ms; d1Ms += dayMilliSeconds) {  
            
                if (!ret) {  
                    let day = new Date(d1Ms);  
                    ret = day.getYMD();  
                } else {  
                    let day = new Date(d1Ms);  
                    ret = ret + ',' + day.getYMD();  
                }  
            }  
            return ret
        },
    },
    watch:{
        selectDate(val){
            let err=false;
            if(!val){err='请选择预定时间'}
            this.$store.dispatch('setSelectDate',{value:val,err:err});
        },
    }
}	
</script>

<style lang="scss">

</style>