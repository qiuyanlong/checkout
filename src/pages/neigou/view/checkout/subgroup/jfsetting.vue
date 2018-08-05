<template>
  <div class="jfsetting" :style="{'min-height':bodyHeight+'px'}">
    <div class="setarea">
      <div class="settop" v-if="settype && canPaint">
        <h1>{{wen_an.top}}</h1>
        <!-- <h1>您正在为账户 188****7244设置支付密码</h1> -->
        <div class="onepeace">
          <input type="text" maxlength="6" autocomplete="off" v-model="input_msg_val">
          <a href="javascript:;" class="getcode" @click="toggleImg" v-if="!timecount">获取验证码</a>
          <a href="javascript:;" class="getcode" v-else>{{timecount}}s</a>
        </div>
        <p class="codetip" v-html="wen_an.bot"></p>
        <!-- <p class="codetip">您的积分账号已与登录账号合并<br>如有疑问,可联系内购网客服咨询 400-666-6365</p> -->
        <a href="javascript:;" class="codenext" @click="codeNext">下一步</a>
      </div>
      <div class="setnumber" :class="{'back':settype && codestep == 1}" v-if="canPaint">
        <div class="settop" :class="{'move':next}">
          <h1>请设置六位支付密码</h1>
          <div class="onepeace">
            <i v-for="(item,index) in dianarr" :class="{'ed':index+1 <= setarr.length}"></i>
          </div>
        </div>
        <div class="settwotop" :class="{'move':next}">
          <h1>请再次输入</h1>
          <div class="onepeace">
            <i v-for="(item,index) in dianarr" :class="{'ed':index+1 <= settwoarr.length}"></i>
          </div>
        </div>
        <div class="keyboard">
          <ul>
            <li ref="int" v-for="(item,index) in intarr" v-if="index != 9">{{item}}</li>
            <li v-else></li>
          </ul>
        </div>
      </div>
      <div class="jfp-layer" :class="{'jfp-in':iwantcode}">
        <div class="jfp-backdrop"></div>
        <div class="jfp-dialog img-log">
          <p class="img-p">请输入图片验证码</p>
          <div class="onepeace img-int">
            <input type="text" maxlength="6" autocomplete="off" v-model="input_img_val">
            <a href="javascript:;" class="getcode"><img :src="ewmUrl" @click="changeImg" ref="imgewm"></a>
          </div>
          <a href="javascript:;" class="codenext img-btn" @click="checkImgCode">确认</a>
          <i class="jfp-close" @click="toggleImg"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {httpPost,httpPostV2,BffPost,Jsonp} from '@/api/base'
  import config from '@/config/config'
  import { Toast } from 'vant';
  import '../css/set.scss';
  const store_domain = config.store_api_domain
  const store_url = config.store_domain
  function requestQueryString(paras){
    let url = window.location.href,_paraString = url.substring(url.indexOf("?")+1).split("&"),returnValue;
    for (let i=0; i<_paraString.length; i++){
      let j = _paraString[i];
      let _key = j.split('=')[0]
      let _value = j.split('=')[1]
      if(_key == paras){
        returnValue = _value
        break;
      }
    }
    if(typeof(returnValue)=="undefined"){
      return "";
    }else{
      return returnValue;
    }
  }
  export default {
    data() {
      return {
        point_name:'',

        sign:'',
        operatetype:'',
        ewmUrl:`${store_domain}/index-gen_vcode-b2c-4.html`,
        wen_an:{
          top:'',
          bot:''
        },
        settype:0,
        input_msg_val:'',
        input_img_val:'',
        timecount:0,
//        loadingSwitch:false,
        canPaint:false,
        codestep:1,
        iwantcode:0,
        next:0,
        step:1,
        dianarr:[0,0,0,0,0,0],
        intarr:[1,2,3,4,5,6,7,8,9,'',0,'del'],
        setarr:[],
        settwoarr:[]
      }
    },
    filters:{},
    methods: {
      getQueryString(name){
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
      },
      changeImg(event){
        let _target = event.target || event,
          _origsrc = _target.getAttribute('src').split('?')[0]
        _target.src = _origsrc + '?time=' + (new Date).getTime()
      },
      codeNext(){
        let Vm = this

        if(/^\s*$/.test(Vm.input_msg_val)){
          Toast('短信验证码不能为空')
          return
        }

        this.$pageLoading.show()
        httpPost(`${store_domain}/m/member-point.html`,{act:'check',code:Vm.input_msg_val}).then(res =>{
          if(res.data.errno){
               Toast(res.data.error)
               this.$pageLoading.hide()
               return
          }else{
              Vm.codestep = 2;
          }
          this.$pageLoading.hide()
        })
      },
      checkImgCode(){  
        let Vm = this,timer

        if(/^\s*$/.test(Vm.input_img_val)){
          Toast('图片验证码不能为空')
          return
        }

      this.$pageLoading.show()
       httpPost(`${store_domain}/m/member-point.html`,{act:'sendcode',verifycode:Vm.input_img_val}).then(res =>{
          
         if(!res.data.errno){
             this.$pageLoading.hide()
              Toast('短信验证码已发送')
              Vm.iwantcode = 0
              Vm.timecount = 60
              Vm.input_img_val = ''
              Vm.changeImg(Vm.$refs.imgewm)
              timer = setInterval(()=>{
                Vm.timecount --
                if(!Vm.timecount) clearInterval(timer)
              },1000)
           }else{
                this.$pageLoading.hide()
                Toast(res.data.error)
           }

        })
      },
      toggleImg(){
        let Vm = this
        Vm.iwantcode = !Vm.iwantcode
        if(!Vm.iwantcode){
          Vm.input_img_val = ''
          Vm.changeImg(Vm.$refs.imgewm)
        }
      },
      stop(){
        let Vm = this,result = false

        if(Vm.setarr.length >=6 && Vm.step == 1) result = true
        if(Vm.settwoarr.length >=6 && Vm.step == 2) result = true

        return result
      },
      setEvent(){
        let Vm = this,_x,_y,_targetEl,GetPos = obj => {
          let pos = {}
          pos.x = obj.offsetLeft
          pos.y = obj.offsetTop
          while (obj = obj.offsetParent) {
            pos.x += obj.offsetLeft;
            pos.y += obj.offsetTop;
          }
          return pos;
        }
        Vm.$refs.int.forEach(item => {
          item.addEventListener('touchstart',ev=>{
            if(Vm.stop()) return
            ev.target.className = 'down'
          })
          item.addEventListener('touchend', ev => {
            if(Vm.stop()) return
            let el = ev.target
              ,curx = ev.changedTouches[0].pageX
              ,cury = ev.changedTouches[0].pageY
              ,width = el.offsetWidth
              ,height = el.offsetHeight
              ,top = GetPos(el).y
              ,left = GetPos(el).x
            ev.target.className = ''
            if(curx >= left && curx <= ( left + width ) && cury >= top && cury <= ( top + height ) ){
              let num = parseInt( el.innerText )
              if(/[0-9]/.test(num)){
                //记录密码
                if(Vm.step == 1){
                  Vm.setarr.push(num)
                }else{
                  Vm.settwoarr.push(num)
                }
              }else{

                if(el.innerText === 'del' ){
                  //删除密码
                  //Vm.mimaarr.pop()
                  if(Vm.step == 1){
                    Vm.setarr.pop()
                  }else{
                    Vm.settwoarr.pop()
                  }
                }

              }
            }
          });
        })
      }
    },
    watch: {
      setarr(cval){
        let Vm = this
        if(cval.length == 6){
          Vm.next = 1
          setTimeout(()=>{
            Vm.step = 2
          },1000)
        }
      },
      settwoarr(cval){
        let Vm = this
        if(cval.length == 6){
          if(Vm.setarr.toString()  === cval.toString()){
             this.$pageLoading.show()

            let _data
            if(!Vm.settype && Vm.sign){
              _data = {
                act:Vm.operatetype,
                sign:Vm.sign,
                password:cval.toString().replace(/\,/g,'')
              }
            }else{
              _data = {
                act:Vm.operatetype,
                code:Vm.input_msg_val,
                password:cval.toString().replace(/\,/g,'')
              }
            }
       

            httpPostV2(`${store_domain}/m/member-point.html`,_data,res=>{ 
              this.$pageLoading.hide()
              if(Vm.operatetype == 'reset'){
                Toast('修改密码成功')
              }else{
                Toast('设置成功，继续支付')
              }
              setTimeout(()=>{
                window.location.href = decodeURIComponent(requestQueryString('origincheckout'))
              },1000)

            },(err,num)=>{

              this.$pageLoading.hide()
              Toast(err)
              if(num == 30002){
                //sign 超时，去掉sign
                setTimeout(()=>{
                  window.location.href = window.location.href.split('&sign=')[0]
                },2000)
              }
            })


          }else{
            Toast('两次输入的密码不一致，请再次输入')
            Vm.settwoarr = []
          }
        }
      }
    },
 
    mounted() {  

      let Vm = this

      if(requestQueryString('operatetype') == 'reset'){
        Vm.operatetype = 'reset'
        document.title = '修改密码'
      }else{
        Vm.operatetype = 'set'
        document.title = '设置支付密码'
      }
 

      httpPost(`${store_domain}/m/member-point.html`,{act:'init',from_vue:1}).then(res =>{   
     

        Vm.point_name = res.point_name||''
        //没有手机号
        let _sign = requestQueryString('sign')
        if(_sign){
          Vm.settype = 0
          Vm.sign = _sign
        }else{
          Vm.settype = 1
        }


        if(res.data.body.platform == 'neigou'){

            if(res.data.body.need_mobile == 1){
              let _redirecturl = encodeURIComponent(window.location.href+'&sign=' + res.data.body.sign)

              window.location.href = `${store_url}/m/passport-bind_mobile.html?redirect=${_redirecturl}`
              return;
            }
            Vm.wen_an.top = `您正在为账户 ${res.data.body.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')} 设置支付密码`
            Vm.wen_an.bot = `您在内购平台的虚拟货币账号已与登录账号合并<br>如有疑问,可联系内购网客服咨询${res.data.body.tel}`
        }else{
          Vm.settype = 1
          Vm.wen_an.top = '验证码将会发送到您OA注册的手机号上'
          Vm.wen_an.bot = '若由于更换手机号而未收到验证码，请登录OA修改手机号'
        }
        Vm.canPaint = true
        Vm.$nextTick(()=>{
          Vm.setEvent()
        })
      })
    },
    created() {
         this.bodyHeight =  document.documentElement.clientHeight
    }
  }
</script>














