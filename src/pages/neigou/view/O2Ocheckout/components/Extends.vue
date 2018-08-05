<template id="">
	<div class="Extends">
        <div class="form_box" v-if="_guestData&&_guestData.length>0" style="margin-bottom:20px;" v-for="(v,i) in _guestData">
            <div v-if="_guestData.length>1" class="guest_data_title m_title">第{{i+1}}条人员信息</div>
            <div v-if="_guestData.length==1" class="guest_data_title m_title">预约信息</div>
            <div class="guest_data" v-for="(input,i) in v">
                <div v-if="input.key=='name'" class="form_list">
                    <div class="input">
                        <input autocomplete="off"  :class="[input.error?'err':'']" class="input_type_name input_ui" v-model="input.value"  type="text" placeholder="请输入姓名" name="name"/>
                        <span class="label">姓名:</span>
                    </div>
                    <span class="err" v-if="input.error" v-html="input.error"></span>
                </div>
                <div v-if="input.key=='english_name'" class="form_list">
                    <div class="input">
                        <input  :class="[input.error?'err':'']"  class="input_type_english_name input_ui" v-model="input.value"  type="text" value="" placeholder="请输入英文名称" name="english_name"/>
                        <span class="label">英文名称:</span>
                    </div>
                    <span class="err" v-if="input.error" v-html="input.error"></span>
                </div>
                <div v-if="input.key=='phone'" class="form_list">
                    <div class="input">
                        <span class="label">手机号:</span>
                        <input  :class="[input.error?'err':'']"  class="input_type_phone input_ui" type="text" v-model="input.value"  value="" placeholder="请输入手机号" name="phone"/>
                    </div>
                    <span class="err" v-if="input.error" v-html="input.error"></span>
                </div>
                <div v-if="input.key=='email'" class="form_list">
                    <div class="input">
                        <span class="label">邮箱:</span>
                        <input  :class="[input.error?'err':'']"  class="input_type_email input_ui" type="text" v-model="input.value"  placeholder="请输入邮箱" name="email"/>
                    </div>
                    <span class="err" v-if="input.error" v-html="input.error"></span>
                </div>
                <div v-if="input.key=='id_card'" class="form_list">
                    <div class="input">
                        <span class="label">证件类型:</span>
                        <select name="id_card_type" v-model="input.selectVal">
                            <option v-for="opt in input.id_card_type" :value="opt" v-html="setOptTxt(opt)"></option>
                        </select>
                        <span class="show_val">{{setOptTxt(input.selectVal)}}</span>
                    </div>
                </div>
                <div v-if="input.key=='id_card'" class="form_list">
                    <div class="input">
                        <span class="label">证件号码:</span>
                        <input  :class="[input.error?'err':'']" type="text" value="" class="input_type_id_card input_ui" v-model="input.value" placeholder="请输入证件号码" name="id_card"/>
                    </div>
                    <span  class="err" v-if="input.error" v-html="input.error"></span>
                </div>
                <div v-if="input.key=='recipient_address'" class="form_list">
                    <div class="input">
                        <span class="label">收货地址:</span>
                        <input  :class="[input.error?'err':'']" type="text" value="" class="input_type_recipient_address input_ui"  v-model="input.value" placeholder="请输入收货地址" name="recipient_address"/>
                    </div>
                    <span class="err" v-if="input.error" v-html="input.error"></span>
                </div>
            </div>
        </div>
        
	</div>
</template>
<script>
import { mapGetters,mapActions } from 'vuex';



export default{
    name: 'checkout',
    data(){
        return {

        }
    },
	components:{
        
    },
    methods:{
        setOptTxt(val){
            return this.idCardTypeData[val]
        },
    },
    computed:{
        ...mapGetters({
            _guestData:'guestData',
            idCardTypeData:'idCardTypeData'
        }),
    },
    created(){
        
    },
    watch:{
        
    }
    
}	
</script>

<style lang="scss">

</style>