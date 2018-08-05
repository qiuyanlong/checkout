<template>
 <div class="bz_content" :style="{'height':bodyHeight+'px'}">
      <div class="header">
      	 <!--  <p class="rtitle">订单备注</p> -->
		  <textarea name="bz_content" maxlength="200" ref="bz_content" @focus="help_text=false"  @blur="isshowhelp"  v-model="inputReark" placeholder="请填写订单备注，最多200个字"></textarea>
		  <!-- <p class="help_text" v-if="help_text">请填写订单备注，最多200个字</p> -->
		  <a class="bz_require" @click="closebeizhu">{{retext}}</a>
      </div>
</div>	
</template>

<script>

function getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
         var a = val.charAt(i);
         if (a.match(/[^\x00-\xff]/ig) != null) 
        {
            len += 2;
        }
        else
        {
            len += 1;
        }
    }
    return len;
}
import { Toast } from 'vant'	
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'	
export default{
	name:'Remarks',
	//props:['shopid'],
	data(){
		return {
          help_text:true,
          inputReark:'',
          shopid:0,
          retext:'确认'
		}
	},
	computed:{
       ...mapGetters([
       	      'get_key',
		   	  'get_beizhu'
		   ]),
	},
	methods:{
		...mapActions(['beizhufn']),
		myremarking(event){
           this.$emit('remarkInput',event.target.value)
		},
		closebeizhu(){
			// 将组装好的该条信息冒泡给父组件以供捕获
		  let cons = this.inputReark.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g,"")
		  if(getByteLen(cons)>200){
             Toast('备注最多只能是200字范围以内')
             return

		  }else{
	  	 	   this.$pageLoading.show()
			   if(this.inputReark){
			   	   this.retext = '确认...'
			   }

			   setTimeout(()=>{
		   	   	   this.retext = '确认'
		   	   	   this.$pageLoading.hide()
		   	   	   this.beizhufn({id:this.shopid,val:cons})	
		   	   	   this.$router.go(-1)
	   	       },500)
		   }	
		},
		isshowhelp(){
          if(!this.inputReark) this.help_text = true
		} 
	},
	created(){
        this.shopid = this.$route.query.shopid
        let haswrites =  this.get_beizhu

        haswrites.forEach((item,index)=>{
           if(item.id == this.shopid){
           	   this.help_text = false
           	   this.inputReark = item.val 
           }
        })
 

        if(!this.inputReark){
        	this.help_text = true 
        } 

        // key 可以当做是刷新的标识
        this.bodyHeight =  document.documentElement.clientHeight 
	}
}	
</script>
<style lang="scss" scoped>
/* 布局相关函数定义rem大小*/
@function pxm($px) {
  @return ( ($px / 75) * 1 ) +rem;
}

.bz_content {


    .header{
       padding: pxm(30);
       background: #fff;
    }
    .rtitle{
       font-size: pxm(28);
       color:#000;

    }
    .help_text{
      color:#d3d3d3;
      position: absolute;
      top:pxm(40);
      left: pxm(30);
      font-size: pxm(24);
    }
}
.bz_content textarea{
    width:100%;
    background: #fff;
    height: pxm(300);
    border:none;
    font-size: pxm(24);
    padding-top:pxm(24);
    resize:none;
}
.bz_require{
    position: absolute;
    left: 0;
    top:pxm(350);
    //bottom: 0;
    width: 100%;
    font-weight: bold;
    background: #44bbff;
    color:#fff;
    font-size: pxm(30);
    text-align: center;
    line-height: pxm(100);
     -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
}
	
</style>














