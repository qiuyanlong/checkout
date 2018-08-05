<template>
    <div id="locationAddr">
        <div id="location_deliver_area" @click="showSearchAddr">{{value.deliver_area||'请选择小区/楼宇'}}</div>
        <div style="display:none">
            <input type="text" name="">
        </div>
        <van-popup class="searchAddrPage" v-model="isShow" position="right" :overlay="false">
            <van-search
                v-model="searchvalue"
                placeholder="请输入搜索关键字"
                show-action
                @search="onSearch"
                @input="inputSearch"
            >
            <div slot="action" class="hideSearchAddrPage" @click="onHide">取消</div>
            </van-search>
            <ul class="search_addr_list">
                <template v-if="addrList&&addrList.length>0">
                <li v-for="addr in addrList" @click="setAddr(addr.title,addr.address,addr)"><p class="title">{{addr.title}}</p><p class="address">{{addr.address}}</p></li>
                </template>
                <template v-if="searchvalue && addrList.length==0">
                    <li class="no"><p class="address">未搜索到数据，请重新修改关键字</p></li>
                </template>
            </ul>
        </van-popup>
    </div>
</template>
<script>
import { Toast } from 'vant';
import {Jsonp} from '@/api/base';
import UTIL from '@/api/util';
import config from '@/config/config';
export default {
    data() {
        return {
            isShow:false,
            searchvalue:'',
            addrList:[]
        };
    },
    props:['value','city_name'],
    mounted() {
        console.log(this.value)
    },
    methods:{
        inputSearch:UTIL.debounce(function(){
            Jsonp(`${config.mall_domain}/Mall/getLocationRegionListAjax`,{region:this.city_name,keyword:this.searchvalue}).then(res=>{
                if(res.result=='succ'&&res.data.data.length>0){
                    this.addrList=res.data.data
                }
            })
        },500),
        showSearchAddr(){
            if(!this.city_name){
                Toast('请选择城市');
            }else{
                this.isShow=true
            }
        },
        onSearch(){

        },
        onCancel(){
            
        },
        onHide(){
            this.isShow=false
        },
        setAddr(deliver_area,deliver_addr,deliver_json){
            let deliverJson=encodeURI(JSON.stringify(deliver_json))
            this.$emit('input',{
                deliver_area:deliver_area,
                deliver_addr:deliver_addr,
                deliver_json:deliverJson,
            })
            this.isShow=false
        }
    },
    components: {  },
    computed:{
        
    },
    watch:{
       city_name(new_val,old_vue){
           if(new_val!=old_vue){
                this.$emit('input',{
                    deliver_area:'',
                    deliver_addr:'',
                    deliver_json:'',
                })
                this.searchvalue=''
                this.addrList=[];
           }
       }
    }
};
</script>
<style scoped lang="scss">
$pole:75;
#locationAddr{
    max-height: 99rem;
    font-size: 30rem/$pole;
    color: #666;
}
.searchAddrPage{
    height: 100%;
    right: 0;
    width: 100%;
    bottom: 0;
}
.hideSearchAddrPage{
    width: 80rem/$pole;
    text-align: center;
    color: #44bbff;
}
ul.search_addr_list{
	padding: 0 30rem/$pole;
    background: #fff;
    overflow-y: auto;
	li{
		border-bottom: 1px solid #ccc;
		padding: 18rem/$pole 0;
		padding-left: 44rem/$pole;
		//background: url('../images/dingwei_icon.png') no-repeat 0 center;
		background-size: 27rem/$pole 44rem/$pole;
		[data-dpr='3'] &{
			border-width:1.5px;
		}
		p.title{
			line-height: 50rem/$pole;
			height: 50rem/$pole;
			overflow: hidden;
			font-size: 28rem/$pole;
			color: #343434;
		}
		p.address{
			line-height: 46rem/$pole;
			height: 46rem/$pole;
			overflow: hidden;
			font-size: 26rem/$pole;
			color: #aeaead;
		}
		&:last-child{
			border: none;
		}
		&.no{
			background: none;
			padding-left: 0;
		}
	}
}
</style>


