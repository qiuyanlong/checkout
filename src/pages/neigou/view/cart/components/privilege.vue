<template>
	<div>
		<van-actionsheet v-model="visible">
			<div class="privilege-description">
				<i class="icon-close" @click="visible = false"></i>
				<h1>说明</h1>
				<template v-for="li in list.no">
					<div class="no-support" v-if="li === 'ban_point_pay'">
						<p class="tit"><van-icon name="info-o" />该商品不支持积分结算</p>
						<p class="titdesc">部分海外购商品由于票税问题暂不支持积分结算</p>
					</div>
				</template>
				<div class="line"></div>
				<ul class="privi-list">
					<li v-for="li in list.yes">
						<i class="igic" :class="li"></i>{{matchlist[li]}}
					</li>
				</ul>
				<p class="btn-bg" @click="visible = false">确认</p>
			</div>
		</van-actionsheet>
	</div>
</template>
<script>
export default {
	name:'privilege',
	data(){
		return {
			visible:false,
			matchlist:{
				'discount' : '满减商品',
				'mianyou' : '支持免邮券',
				'point_pay' : '积分结算',
				'dutyfree' : '支持免税券',
				'nonghang_interest_free':'农行免息',
				'baitiao_interest_free':'白条免息',
			}
		}
	},
	props:{
      	value: {
        	type: Boolean,
        	default:false
      	},
      	list:{
      		type:Object
      	}
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
.igic{
	display: inline-block;
	background: url(../img/iconlist.png) no-repeat;
	/*background-size:96rem/$pole 84rem/$pole;*/
	background-size:rem(124.8) rem(109.2);
	overflow: hidden;
	text-indent: -9999px;
	text-align: left;
	/*width:24rem/$pole; height:24rem/$pole;*/
	width:rem(31.2);
	height:rem(31.2);
}
/*特价*/
.igic-1 { /*background-position: -4rem/$pole -0rem/$pole;*/background-position: rem(-5.2) 0;}
/*满减*/
.igic.discount{ /*background-position: -32rem/$pole -0rem/$pole;*/background-position: rem(-41.6) 0;}
/*打折*/
.igic-3 { /*background-position: -60rem/$pole -0rem/$pole;*/background-position: rem(-78) -0;}
/*免邮*/
.igic.mianyou { /*background-position: -4rem/$pole -28rem/$pole;*/background-position: rem(-5.2) rem(-36.4);}
/*免税*/
.igic.dutyfree{ /*background-position: -32rem/$pole -28rem/$pole;*/background-position: rem(-41.6) rem(-36.4);}
/*免息*/
.igic.interestfree,.igic.baitiao_interest_free,.igic.nonghang_interest_free { /*background-position: -60rem/$pole -28rem/$pole;*/background-position: rem(-78) rem(-36.4);}
/*海外购*/
.igic-7 { /*background-position: -4rem/$pole -56rem/$pole;*/background-position: rem(-5.2) rem(-72.8);}
/*积分支付*/
.igic.point_pay { /*background-position: -32rem/$pole -56rem/$pole;*/background-position: rem(-41.6) rem(-72.8);}
/*七天无理由*/
.igic-9 { /*background-position: -60rem/$pole -56rem/$pole;*/background-position: rem(-78) rem(-72.8);}

.privilege-description{
	position:relative;
	.icon-close{
		position:absolute;
		top:rem(35);
		right:rem(25);
		width:rem(50);
		height:rem(50);
		display:block;
		background:url(../img/close.png) no-repeat;
		background-size:rem(26) rem(25);
		background-position:center center;
	}
	&>h1{
		padding:rem(35) 0;
		font-size:rem(30);
		color:#a1a1a1;
		line-height:1.5;
		text-align:center;
		letter-spacing:rem(2);
	}
	.line{
		margin:rem(0 30);
		height: 1px;
        background: linear-gradient(to right, #d6d6d6, #d6d6d6 3px, transparent 3px, transparent);
        background-size: 8px 100%;
        [data-dpr="2"] &,[data-dpr="3"] &{
        	height:1.5px;
        	background: linear-gradient(to right, #d6d6d6, #d6d6d6 rem(12), transparent rem(12), transparent);
        	background-size: rem(26) 100%;
        }
	}
	.no-support{
		margin:rem(0) rem(30);
		padding-bottom:rem(15);
		letter-spacing:rem(2);
		.tit{
			margin-bottom:rem(5);
			display:flex;
			align-items:center;
			color:#333;
			font-size:rem(28);
			line-height:1.5;
			.van-icon-info-o{
				color:$red;
				margin-right:rem(15);
			}
		}
		.titdesc{
			padding-left:rem(45);
			color:#858585;
			font-size:rem(24);
			line-height:1.5;
			margin-bottom:rem(25);
		}
	}
	.privi-list{
		margin:rem(40) rem(30) ;
		display:flex;
		flex-flow: row wrap;
		justify-content:flex-start;
		li{
			margin-bottom:rem(25);
			width:33.33333%;
			font-size:rem(28);
			color:#333;
			letter-spacing:rem(5);
			.igic{
				margin-right:rem(15);
				vertical-align:middle;
			}
			&.lg{
				width:66.66666%;
			}
		}
	}
}
</style>
