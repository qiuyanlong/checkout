<template>
	<div>
		<van-actionsheet v-model="visible">
			<div class="separate-pay">
				<h4>
					<p>选择支付商品<span>请分开结算以下商品</span></p>
					<i class="icon-close" @click="visible = false"></i>
				</h4>

				<ul>
					<li v-for="tp in typeList" @click="go(tp.id)">
						<div>
							<p v-if="tp.id === '1'">海外购商品（需要使用国际支付）</p>
							<p v-else>其他商品</p>
							<span>共{{tp.goodscount}}件商品</span>
						</div>
						<span>￥{{ toFloat( tp.total ) }}</span>
					</li>
				</ul>
			</div>
		</van-actionsheet>
	</div>
</template>
<script>
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'
export default {
	name:'separate',
	data(){
		return {
			visible:false
		}
	},
	props:{
      	value: {
        	type: Boolean,
        	default:false
      	}
    },
    methods:{
    	toFloat(num){

			let result = parseFloat(num),
				s_x,
				pos_decimal

			result = Math.round(num * 100) / 100
			s_x = result.toString()
			pos_decimal = s_x.indexOf('.')

			if (pos_decimal < 0) {
			  pos_decimal = s_x.length
			  s_x += '.'
			}

			while (s_x.length <= pos_decimal + 2) {
			  s_x += '0'
			}

			return s_x

		},
		go(carttype){
			this.$emit('go',parseInt(carttype))
		}
    },
    computed:{
    	...mapGetters([
		    'typeList'
	    ])
    },
	watch:{
		value(val) {
	        this.visible = val
	    },
	    visible(val) {
	        this.$emit('input', val)
	    }
	},
	mounted(){
		if (this.value) this.visible = true
	}
}
</script>
<style lang="scss" scoped>
@import '../css/commen.scss';
.separate-pay{
	background-color:#fff;
	&>h4{
		position:relative;
		height:rem(90);
        font-size:rem(28);
        color: #010101;
        background: #fafafa;
        padding: 0 rem(25);
        letter-spacing:rem(2);
        display:flex;
        align-items:center;
        justify-content:space-between;
        span{
            font-size: rem(26);
            color: #989898;
           	margin-left: rem(30);
        }
        .icon-close{
			width:rem(50);
			height:rem(50);
			display:block;
			background:url(../img/close.png) no-repeat;
			background-size:rem(26) rem(25);
			background-position:center center;
		}
	}
	&>ul{
		padding: 0 rem(25);
		li{
			display:flex;
            align-items:center;
            justify-content:space-between;
			height:rem(160);
			letter-spacing:rem(2);
			&:first-child{
				border-bottom:1px solid $bordercolor;
				@include dpr3border();
			}
			&>span{
				color:#eb2925;
				font-size:rem(32);
			}
		}
		div{
			p{
                font-size:rem(28);
                color: #333333;
            }
            span{
                font-size:rem(24);
                color: #989898;
            }
		}
	}
}
</style>