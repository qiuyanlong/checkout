<template>
<!--   海关身份验证 -->
<div class="itentity" :style="{'min-height':bodyHeight+'px'}">

  
  <div class="forms">
  	 <h1 class="titles">请填写个人信息</h1>
  	 
  	 <p><input type="text" class="form_ctrols" placeholder="请填写收件人姓名" v-model="username"></p>
     <p class="error_text">{{userErrors.etext}}</p>
  	 
  	 <p><input type="number" class="form_ctrols ids" placeholder="请填写收件人身份证号" v-model="identId" maxlength="18"></p>
      <p class="error_text">{{idE.etext}}</p>
  </div> 
  
  <div class="pic_upload" v-if="upload_level==2">
  	 <h1 class="titles">请上传本人身份证照片</h1>

  	 <div class="wrap_pic">

      <div class="flex flex-pack-justify">
        <div class="cards">
        
           <div class="demo-upload-list" v-if="id_card_upload_zhengmian_upload.data">
              <img  :src="id_card_upload_zhengmian_upload.data"> 
           </div>
            
            <!-- 如果为空的话 -->
            <div class="imgs" v-else >
                <img src="../images/s.png" alt="上传身份证正面" />
                <p>上传身份证正面</p>
           </div> 

              <Upload
              ref="upload1"
              :show-upload-list="false"
              :default-file-list="id_card_upload_zhengmian0"
              :on-success="handleSuccessZm"
              :format="['jpg','jpeg','png']"
              :max-size="10240"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-progress="handleProgress"
              :on-error="handleError"
              :action="uploadUrl"
              type='drag'
              id="myupload1"
              >
          </Upload>
        </div>

        <div class="cards">
          <div class="demo-upload-list" v-if="id_card_upload_fanmian_upload.data">
                <img  :src="id_card_upload_fanmian_upload.data"> 
           </div>
             <div class="imgs" v-else>
                <img src="../images/b.png" alt="上传身份证反面" />
                <p>上传身份证反面</p>
           </div> 
       
          <Upload
              ref="upload2"
              :show-upload-list="false"
              :default-file-list="id_card_upload_zhengmian1"
              :on-success="handleSuccessFm"
              :format="['jpg','jpeg','png']"
              :max-size="10240"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :on-progress="handleProgress"
              :on-error="handleError"
              :action="uploadUrl"
              type='drag'
              id="myupload2"
            >
        </Upload>
       </div>
      </div>
  	 </div>
  </div>
  
  <div class="upload_notice" v-if="upload_level==2">
  	  <h1 class="titles">请上传本人身份证照片</h1>
  	  <ol>
		<li>1. 请上传本人清晰、完整的彩色身份证照片，确保证件在有效期内；</li>
		<li>2. 身份证各项信息及头像清晰可见，易于识别；</li>
		<li>3. 身份证必须真实拍摄，不得使用复印件和扫描件；</li>
		<li>4. 照片格式必须为JPG或PNG；</li>
		<li>5. 建议横屏拍摄，以满足照片上传要求</li>
  	  </ol>
  </div>
  

  <a class="resove_btn" @click="reverseIdentity">保存</a>

</div>  	
</template>
<script>

/**
 *  verify_level 1 只验证姓名跟身份id
 *               2 需要校验 姓名跟id 以及正反面的图片
 */

  import { Toast } from 'vant'
  import config from '@/config/config' 
  import { httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
  import reg from '@/api/reg'

  String.prototype.gblen = function() {  
    var len = 0;  
    for (var i=0; i<this.length; i++) {  
      if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {  
         len += 2;  
       } else {  
         len ++;  
       }  
     }  
    return len;  
  }

  export default{
 	 name:'Identity',
 	 data(){
 	 	return{
 	 		 username:'',
       identId:'',

       // 上传地址
       uploadUrl:config.store_api_domain+'/m/paycenter2-imageupload.html',

       // 默认已上传的文件列表，例如：
       id_card_upload_zhengmian0: [
            {
                'images_id': '',
                'data': ''
            }
        ],
        id_card_upload_zhengmian1: [
            {
                'images_id': '',
                'data': ''
            }
        ],


        listText:[
          {
            text:'上传身份证正面',
            url:require('../images/b.png'),
            isshow:'zh'
          },
          {
            text:'上传身份证反面',
            url:require('../images/s.png'),
            isshow:'fa'
          }
        ],
        // 正面
       id_card_upload_zhengmian_upload: {
                'images_id': '',
                'data': ''
            },
        // 反面
       id_card_upload_fanmian_upload:{
                'images_id': '',
                'data': ''
            },

       upload_level:1  // 默认使用的是1级的验证规则
 	 	}
 	 },
   computed:{
      ...mapGetters([
          'get_is_over_sea',
          'get_identity',       // 海外购身份认证信息  
          'get_key', 
          'get_now_address_index',  
          'address_list',
          'get_sub_identity',
          'get_identity_save_info'

       ]),
     userErrors(){
       let status,etext
       if(!this.username){
           return {
              etext:''
           }

       }

       if(this.username.gblen()>=4 &&this.username.gblen()<20){
           status = true
           etext = ''
       }else{
           status = false
           etext = '收件人姓名不符合格式'
       }

       if(!this.userFlag){
           this.userFlag = true
           etext = ''
       }

       return{
          status,
          etext
       }
     },
     idE(){
       let status,etext

       if(!this.identId){
         return{
            etext:''
         }
       }
       if(!reg.isIdCard(this.identId)){
           status = false
           etext = '请检查您的身份证号码'
       }else{
           status = true
           etext = ''
       }

      if(!this.passwordFlag){
           this.passwordFlag = true
           etext = ''
       }
        
       return{
          status,
          etext
       }
     }
   },

   methods:{
        ...mapActions([
         'updateIdentity_info'
      ]),  

       isempty(obj){
          if(JSON.stringify(obj) == '{}'){
            return true
          }
       },  
       handleSuccessZm (res, file, fileList) {
       
            if(res.success=="success"){
                 this.id_card_upload_zhengmian_upload={ data:res.data.data, images_id:res.data.image_id}
              this.$pageLoading.hide()
            }
       },
       handleSuccessFm(res, file, fileList){
           if(res.success=="success"){
               this.id_card_upload_fanmian_upload={ data:res.data.data, images_id:res.data.image_id}
            
              this.$pageLoading.hide()
            }
       },
       handleFormatError (file) {

            Toast('请选择正确的图片')
        },
        handleMaxSize (file) {
            Toast('选择的图片大小不能超过10M')
        },

        handleProgress(event, file, fileList){
             this.$pageLoading.show()
        },
        handleError(error, file, fileList){
             this.$pageLoading.hide()
            Toast(error);
        },
        handleRemove (file) {
          const fileList = this.$refs.upload.fileList;
       },

        // 保存表单
        reverseIdentity(){
           
           var Vm = this;
           let sub = {    
                verify_level:this.upload_level,
                cart_info:{
                    id_card_name:Vm.username,
                    id_card_no:Vm.identId
                }
            }

            if(this.upload_level == 1){
                    if(!this.userErrors.status|| !this.idE.status){
                        Toast('请检查您的身份认证信息不完整')
                        return 
                    }
            }else{
              // 2
                if(!this.userErrors.status|| !this.idE.status){
                    Toast('请检查您的身份认证信息不完整')
                    return 
                }
                if(!this.id_card_upload_zhengmian_upload.data ){
                    Toast('身份证必须真实拍摄，正面还没有上传')
                    return
                }
            
                if(!this.id_card_upload_fanmian_upload.data){
                    Toast('身份证必须真实拍摄，反面还没有上传')
                    return
                }
  
                sub.cart_info.id_card_fanmian_image_id=Vm.id_card_upload_fanmian_upload.images_id;
                sub.cart_info.id_card_fanmian_image_url=Vm.id_card_upload_fanmian_upload.data;
                sub.cart_info.id_card_zhengmian_image_id=Vm.id_card_upload_zhengmian_upload.images_id;
                sub.cart_info.id_card_zhengmian_image_url=Vm.id_card_upload_zhengmian_upload.data;
            }   
            this.updateIdentity_info(sub)
            this.$router.go(-1)
        }
 	 },
   created(){
       let Vm=this;
       this.bodyHeight =  document.documentElement.clientHeight
         // 监测是否通过身份验证     
    try{ 
        let infos = this.get_identity;
        if(this.get_identity_save_info){
            this.$router.go(-1)
        }
        this.upload_level = infos.verify_level


        if(infos.cart_info.id_card_no){
            this.username = infos.cart_info.id_card_name
            this.identId = infos.cart_info.id_card_no
            if(this.upload_level ==2){
                this.id_card_upload_zhengmian_upload={
                    data: infos.cart_info.id_card_zhengmian_image_url,
                    images_id: infos.cart_info.id_card_zhengmian_image_id
                }
                this.id_card_upload_fanmian_upload={
                    data: infos.cart_info.id_card_fanmian_image_url,
                    images_id: infos.cart_info.id_card_fanmian_image_id
                }
            }
        }
    
     }catch(e){
         Toast('页面发生了错误，请重新进入')
         setTimeout(()=>{
           this.$router.go(-1)
         },1000)
     }
   }
  
 }	
</script>
<style lang="scss" scoped> 
/* 布局相关函数定义rem大小*/
@function pxm($px) {
  @return ( ($px / 75) * 1 ) +rem;
}
.flex{
    /* 设置弹性布局 */
    display:-webkit-box; 
    display:-webkit-flex;
    display:-ms-flexbox; 
    display:flex;        
}
.flex-1{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:1;
    -webkit-flex:1;    
    -ms-flex:1;        
    flex:1;          
}
.flex-2{
   /* 子元素自动占据剩余的空间 */
    -webkit-box-flex:2;
    -webkit-flex:2;    
    -ms-flex:2;        
    flex:2;          
}
.flex-pack-center{
    /* 水平布局下的子元素 水平居中 */
    -webkit-box-pack: center;          
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center
}
.flex-align-center{
    -webkit-box-align: center;/* android 2.1-3.0, ios 3.2-4.3 */
    -webkit-align-items: center;/* Chrome 21+ */
    -ms-flex-align: center;/* WP IE 10 */
    align-items: center;/* android 4.4 */
}
.flex-pack-justify{
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.itentity{
	padding:pxm(30);
	background: #fff;

	.notices{
		font-size: pxm(28);
		color:#333333;
	}

	.warning{
		background: #fdf4c0;
		padding: pxm(20);
		margin:pxm(20) 0;
		line-height: pxm(36);
		.w{
		     width:pxm(27);
		     height:pxm(27);
		     display: inline-block;
		     vertical-align: top;
		     background: url('../images/i.png') center center no-repeat;
		     margin-right: pxm(10);
		     background-size: cover;
		}
		p{
			display: inline-block;
			color:#e49543;
		    font-size:pxm(22);
		}
	}
}

.titles{
    font-size: pxm(28);
    padding-bottom: pxm(20);
}
.forms{
  .form_ctrols{
  	width:100%;
  	border:1px solid #aeaead;
  	color:#333;
  	padding-left: pxm(20);
  	line-height: pxm(88);
  	margin-bottom: pxm(20);
  	font-size: pxm(28);
  	[data-dpr='3'] &{
          border-width:1.5px;
      } 
  }	
  .ids{
  	margin-bottom: pxm(30);
  }
}

.pic_upload{

   .cards{
   	  width:pxm(333);
   	  height: pxm(206);
   	  border-radius: pxm(5);
   	  border:1px solid #b3e3ff;
      overflow: hidden;
          text-align: center;
          position: relative;
   	  [data-dpr='3'] &{
          border-width:1.5px;
      } 
      position: relative;
      overflow: hidden;
      background: #eef9ff;
   }
   .imgs{
   	  position: absolute;
   	  width:100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
        img{
             width: 60%;
        }
      p{
      	 padding-top: pxm(10);
      	 font-size: pxm(24);
      }
   }
   .cards:nth-child(1){
      margin-right: pxm(20);
   }

   .ivu-upload-drag{
      background: none;
      height: 100%;
    }
}

 .ivu-upload{
      width:100%;
      height:100%;
      display:block;
      position: absolute;
      left:0;
      top:pxm(50); 
    }

.upload_notice{
	margin-top: pxm(30);
	ol{

	   padding-bottom: pxm(130);
      li{
      	 color:#999999;
      	 font-size: pxm(24);
      	 line-height: pxm(40);
      }
	}
}
.resove_btn{
	position: fixed;
	bottom: 0;
	left:0;
	width:100%;
	display: inline-block;
	background: #44bbff;
	line-height: pxm(96);
	color:#fff;
	font-size: pxm(30);
	text-align: center;
  z-index:999999;
}
.error_text{
   font-size:pxm(10);
   color:red;
   padding-bottom: pxm(10);
}
.wrap_pic{
  position: relative;
}
</style>

<style lang="scss">
 #myupload1, #myupload2{
     position: absolute;
     left:0;
     top:0;
     right:0;
     bottom:0;
     width:100%;
  display: block;
   .ivu-upload-drag{
     height: 100%;
   }
  .ivu-upload-input{
    display: none;
  }
} 

.demo-upload-list{
   width:100%;
   height: 100%;
   position: relative;

   .remove_icon{
     position: absolute;
     top:0;
     right:pxm(5);
     -height: pxm(10);
     width:100%;
     display: block;
     color:#fff;
     text-align: right;
     font-size: pxm(30);
     background: rgba(0,0,0,0.3);
   }

   img{
     width:100%;
     display: inline-block;
     height: 100%;
   }
}
</style>
