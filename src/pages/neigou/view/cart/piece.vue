<template>
<div :style="{'height':bodyHeight+'px'}">
	<div class="cartmain piece" id="pieceScroll">
		<loading :loadingswitch="loadding"></loading>
		<!-- search -->
		<section class="search">
			<div class="fm">
				<van-icon name="search"/>
				<form action="javascript:;">
	                <input type="search" placeholder="搜索参与凑单的商品" v-model="searchKey" @keyup.enter="sendSearch">
	            </form>
			</div>
		</section>

		<!-- filter -->
		<section class="filter">
			<div class="sort">
				<div @click="priceSort(1)">
					<span>默认排序</span>
					<i class="down" :class="{'active':sorttype===1}"></i>
				</div>
				<div class="ml50" @click="priceSort(3)">
					<span>价格</span>
					<i class="updown" :class="{'active2':sorttype===2,'active3':sorttype===3}"></i>
				</div>
			</div>
			<div class="screen" @click="rightFilterMask = true">
				<span>筛选</span>
				<img src="./img/filter.png" alt="filter">
			</div>
		</section>

		<!-- voucher tip -->
		<section class="vouchertip" @click="voucherListMask = true">
			<p>优惠券：
				<span v-for="(vo,index) in iSelectedVoucher" v-if="index < iSelectedVoucher.length - 1 ">
					{{vo.showName}}、
				</span>
				<span v-else>
					{{vo.showName}}
				</span>

			</p>
			<van-icon name="question"/>
		</section>

		<!-- goodlist -->
		<section class="goodlist">
			<div class="box" v-for="gd in goods">
				<img :src="gd.img.m_url" @error="goodImgNull" alt="">
				<div class="info">
					<a class="name" :href="storeDomain + '/m' + '/product-' + gd.product_id + '.html'" :data-bn="gd.product_bn" :data-id="gd.product_id">{{gd.name}}</a>
					<p class="twoprice">
						<span><i>￥</i>{{ toFloat( gd.price.price )}}</span>
						<strong></strong>
						<span><i>￥</i>{{ toFloat( gd.price.mktprice )}}</span>
						<a href="javascript:;" class="buy" @click="addCart(gd)">buy</a>
					</p>
				</div>
			</div>
		</section>
		<section class="listnull" v-if="isgoodnull">
			<img src="./img/cart_null.png" alt="">
			<p>没有找到可凑单的商品<br>请尝试调整优惠券</p>
		</section>
		<!-- 筛选弹层 -->
		<van-popup v-model="rightFilterMask" position="right" >
			<div class="filter-mask">
				<h1><span @click="rightFilterMask = false"></span>筛选</h1>
				<p class="tit">价格区间</p>
				<div class="sortprice">
					<div class="inpt">
						<input type="tel" placeholder="起始价格" v-model="gte">
					</div>
					<i class="line"></i>
					<div class="inpt">
						<input type="tel" placeholder="终止价格" v-model="lte">
					</div>
				</div>
				<nav>
					<a href="javascript:;" @click="reset">重置</a>
					<a href="javascript:;" @click="sendSearch">确认</a>
				</nav>
			</div>
		</van-popup>

		<!-- 券列表弹层 -->
		<van-actionsheet v-model="voucherListMask">
			<div class="voucher-list-mask">
				<i class="icon-close" @click="voucherListMask = false"></i>
				<h1>优惠券</h1>
				<ul class="vorlist">

					<li v-for="vo in iSelectedVoucher" :class="[{'blue':vo.type=='money' || vo.type=='discount'},{'green':vo.type=='freeshipping'},{'purple':vo.type=='dutyfree'}]">
						<h2>{{vo.showName}}</h2>
						<p>{{vo.rule_name}}</p>
					</li>
				</ul>
				<p class="btn-bg" @click="voucherListMask = false">知道了</p>
			</div>
		</van-actionsheet>
		<!-- 底bar -->
		<section class="totalbar">
			<div class="totalbar-piece">
					<div>
						<p class="hj">小计: <i>￥</i><span>{{ parseInt(pieceTotal)}}</span><i>.{{toFloat(pieceTotal).split('.')[1]}}</i></p>
						<p class="ze" v-if="pieceNeedMoney > 0 ">还差:¥{{ toFloat(pieceNeedMoney) }}，参与优惠活动</p>
						<p class="ze" v-else>已满足优惠条件，可参与优惠活动</p>
					</div>
					<router-link :to="{name:'CartIndex'}">去购物车</router-link>
					<!-- <a href="javascript:;" @click="privilegeDescModal = true">去结算</a> -->
			</div>
			<div class="iphonex40"></div>
		</section>
	</div>
	
</div>
</template>
<script>
import domainConfig from '@/config/config'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'

var removeScroll

function throttle(fn, threshhold) {

  	let  last,timer

  	threshhold || (threshhold = 250)

  	return function () {

    	let now = +new Date()

    	if (last && now < last + threshhold) {

      	clearTimeout(timer)

      	timer = setTimeout(function () {
        	last = now
        	fn()
      	}, threshhold)

	    } else {
	      	last = now
	      	fn()
	    }
  	}
}
export default {
	name:'piece',
	data(){
      	return {
      		addCartSwitch:false,
      		//domain
	  		storeDomain:domainConfig.store_domain,

      		shopId:0,
      		//排序类型
      		sorttype:1,
      		// count:0,
      		// persisted:0,
      		rightFilterMask:false,
      		voucherListMask:false,

      		//商品列表为空
      		isgoodnull:false,

      		goods:[],
      		searchKey:'',
      		page:1,
      		pageSize:15,
      		gte:'',
      		lte:'',

      		//凑单页加入购物车的金额
      		pieceNeedMoney:0,
      		pieceTotal:0,
      	}
    },
    computed:{
    	...mapState({
    		loadding : state => state.cart.fetchLoading,
  			goodlist : state => state.cart.pieceGoodsList,
  			selectedVoucherRuleIdList : state=>state.cart.selectedVoucherRuleIdList
  			// shopVoucherInfo : state => state.cart.shopVoucherInfo
	    }),
	    ...mapGetters([
		    'selectedVoucherListForMoney'
	    ]),
	    iSelectedVoucher(){
	    	if(!this.selectedVoucherListForMoney[this.shopId]) return []
	    	else return this.selectedVoucherListForMoney[this.shopId].usedVoucherList
	    }
    },
    watch:{
    	goodlist(nval){
    		this.goods = [...this.goods,...nval]

    		if(this.goods.length<=0) this.isgoodnull = true
    		else this.isgoodnull = false
    	}
    },
    methods:{
    	//图商品图错误
	    goodImgNull(ev){
	    	ev.target.src = require('./img/good_img_null.png')
	    },
	    reset(){

	    	this.page = 1
	    	this.searchKey = ''
	    	this.sorttype = 1
	    	this.gte = ''
	    	this.lte = ''

	    	this.rightFilterMask=false
	    	this.sendSearch()
	    },
	    sendSearch(type){

	    	let _vm = this,
	    		_voucher = _vm.selectedVoucherRuleIdList

	    	_vm.rightFilterMask=false

	    	if(type !== 'scroll') _vm.goods = [],_vm.page = 1

    		_vm.$store.dispatch('getPiece',{
	    		size:_vm.pageSize,
	    		page:_vm.page,
	    		keyword:_vm.searchKey,
	    		order:_vm.sorttype,
	    		gte:_vm.gte,
	    		lte:_vm.lte,
	    		voucher_rule:_voucher['voucher_rule'][_vm.shopId]||[],
	    		dutyfree_rule:_voucher['dutyfree_rule'][_vm.shopId]||[],
	    		freeshipping_rule:_voucher['freeshipping_rule'][_vm.shopId]||[],
	    	})
	    },
	    //默认排序
	    priceSort(type){

	    	let _vm = this

	    	if(type == 1) _vm.sorttype = type

	    	if(type == 3){

	    		if(_vm.sorttype == 1 || _vm.sorttype == 2) _vm.sorttype = 3
	    		else _vm.sorttype = 2

	    	}

	    	this.sendSearch()

	    },
	    //回车搜索
    	searchingKey(){
    		// this.goods = []
    		// this.$store.dispatch('getPiece',{
	    	// 	size:this.pageSize,
	    	// 	page:1,
	    	// 	keyword:this.searchKey
	    	// })

    	},
    	//设置价格后两位小数
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
    	addCart(good){
    		let _vm = this

    		if(_vm.addCartSwitch) return

    		_vm.addCartSwitch = true

    		_vm.$store.dispatch('buy',{
    			productId:good.product_id,
    			callback(res){
    				if(res.errno){
    					_vm.$toast(res.errorInfo)
    				}else{
    					_vm.$toast('已添加至购物车')

    					_vm.pieceTotal = _vm.pieceTotal + parseFloat(good.price.price)

	    				if(_vm.pieceNeedMoney - good.price.price <= 0){
	    					_vm.pieceNeedMoney = 0
	    				}else{
	    					_vm.pieceNeedMoney = _vm.pieceNeedMoney - good.price.price
	    				}

    				}
    				_vm.addCartSwitch = false
    			}
    		})
    	}
    },
    created(){
    	this.bodyHeight =  document.documentElement.clientHeight
    	let _vm = this

    	_vm.shopId = _vm.$route.query.shopid
    	//本页刷新 回到购物车页
        if(!_vm.selectedVoucherListForMoney[_vm.shopId]){
            _vm.$router.push({
                name:'CartIndex'
            })
            return
        }
        _vm.sendSearch()
    	_vm.pieceNeedMoney = _vm.selectedVoucherListForMoney[_vm.shopId].needmoney || 0
    	_vm.pieceTotal = _vm.selectedVoucherListForMoney[_vm.shopId].voucherTotal || 0

    },
    mounted(){
    	let _vm = this,
    		element = document.getElementById('pieceScroll')

    	element && element.addEventListener( 'scroll', removeScroll = throttle(()=>{
    		if(_vm.loadding) return
       		let _scroll = element.scrollTop
       		let _scrollHeight =element.scrollHeight
       		let _eleHeight = element.offsetHeight
            if(_eleHeight+_scroll >=_scrollHeight  ){
		    	++_vm.page
		    	this.sendSearch('scroll')

            }
    	}, 1000))

  	},
  	beforeDestroyed(){

  		let element = document.getElementById('pieceScroll')

  		element && element.removeEventListener('scroll',removeScroll)
  	},
  	destroyed(){
  		// document.getElementById('pieceScroll').removeEventListener('scroll',removeScroll)
  	}
  	// ,beforeRouteLeave(to, from, next) {
   //      console.log(to)
   //      to.meta.keepAlive = false
   //      next()
   //  }
}
</script>
<style lang="scss" scoped>
@import './css/commen.scss';
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
/*.toolbar-loading{
	position:fixed;
	left:0;
	bottom:rem(100);
	width:100%;
	background-color:#fff;
	padding:rem(20) 0;
	.load-c{
    	display:block;
    	border-radius:50%;
    	width:rem(50);
    	height:rem(50);
    	border:rem(4) solid $blue;
    	border-top-color:transparent;
    }
}*/
input::-webkit-search-cancel-button{
  display: none;
}

.ml50{
	margin-left:rem(50);
}
.listnull{
	display:flex;
    flex-wrap:wrap;
    justify-content:center;
    align-content:center;
    font-size:0;
    padding-top:rem(150);
    img{
        width:rem(241);
        height:rem(159);
    }
    &>p{
        margin-top:rem(50);
        width:100%;
        font-size:rem(30);
        line-height:1.5;
        color:#939ab1;
        letter-spacing:rem(5);
        text-align:center;
    }
}
.search{
	padding:rem(13) rem(20);
	background-color:#fff;
	font-size:0;
	.fm{
		background-color:#efefef;
		border-radius:rem(6);
		display:flex;
		align-items:center;
		padding:rem(10) rem(20);

	}
	.van-icon-search{
		width:rem(30);
		margin-right:rem(15);
		color:#c5c5c5;
		font-size:rem(28);
	}
	input{
		font-size:rem(26);
		line-height:1.5;
		letter-spacing:rem(1);
		background: transparent;
		border:0;
		width:rem(600);
	}
}
.filter{
	display:flex;
	justify-content:space-between;
	border-top:1px solid $bordercolor;
	border-bottom:1px solid $bordercolor;
	@include dpr3border();
	background-color:#fff;
	font-size:0;
	height:rem(92);
	padding-left:rem(20);
	.sort{
		display:flex;
		align-items:center;
		letter-spacing:rem(2);
		font-size:0;
		span,i{
			vertical-align:middle;
			font-size:rem(28);
		}
		.down{
			position:relative;
			top:rem(5);
			margin-left:rem(5);
	        display:inline-block;
	        width:0;
	        height:0;
	        border-top:rem(10) solid #999999;
	        border-left:rem(10) solid transparent;
	        border-right:rem(10) solid transparent;
	        border-bottom:rem(10) solid transparent;
	        &.active{
	        	border-top-color:$blue;
	        }
		}
		.updown{
			position:relative;
			margin-left:rem(5);
			display:inline-block;
			width:rem(24);
			height:rem(24);
			&.active2:before{
	        	border-bottom-color:$blue;
	        }
	        &.active3:after{
	        	border-top-color:$blue;
	        }
			&:before,&:after{
				position:absolute;
				left:0;
				content:"";
				display:inline-block;
		        width:0;
		        height:0;
		        border-left:rem(10) solid transparent;
		        border-right:rem(10) solid transparent;
			}
			&:before{
				top:rem(-10);
		        border-top:rem(10) solid transparent;
		        border-bottom:rem(10) solid #999999;
			}
			&:after{
				bottom:rem(-10);
		        border-top:rem(10) solid #999999;
		        border-bottom:rem(10) solid transparent;
			}
		}
	}
	.screen{
		width:rem(154);
		border-left:1px solid $bordercolor;
		@include dpr3border();
		font-size:rem(28);
		letter-spacing:rem(2);
		display:flex;
		align-items:center;
		justify-content:center;
		img{
			width:rem(25);
			height:rem(27);
		}
	}

}
.vouchertip{
	display:flex;
	align-items:center;
	justify-content:space-between;
	padding:0 rem(20);
	width:100%;
	height:rem(80);
	font-size:rem(24);
	color:#ed9646;
	background-color:#fff7d0;
	p{
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
		width:rem(600);
		letter-spacing:rem(2);
	}
	.van-icon-question{
		font-size:rem(26);
	}
}
.goodlist{
	background-color:#fff;
	.box{
		margin:0 auto;
		padding:0 rem(20);
		display:flex;
		justify-content:space-between;
		align-items:center;
		width:100%;
		height:rem(210);
		font-size:0;
		border-bottom:1px solid $bordercolor;
		@include dpr3border();
	}
	img{
		width:rem(140);
		height:rem(140);
	}
	.info{
		width:rem(530);
		letter-spacing:rem(2);
	}
	.name{
		word-break: break-all;
		text-overflow: ellipsis;
        display:-webkit-box;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        font-size:rem(28);
        line-height:rem(45);
        color:#3c3c3c;
	}
	.twoprice{
		position:relative;
		margin-top:rem(30);
		display:flex;
		align-items:center;
		justify-content:flex-start;
		strong{
			margin:0 rem(20);
			display:inline-block;
			height:rem(24);
			border-left:1px solid $bordercolor;
			@include dpr3border();
		}
		span{
			font-size:rem(30);
			i{
				font-style:normal;
				font-size:rem(24);
			}
			&:nth-child(1){
				color:$blue;
			}
			&:nth-child(3){
				color:#9b9b9b;
				text-decoration: line-through;
			}
		}
		.buy{
			position:absolute;
			top:rem(-10);
			right:0;
			width:rem(50);
			height:rem(43);
			background:url(./img/cart.png) no-repeat;
			background-size:100% 100%;
		}
	}
}
.van-popup--right{
	width: rem(670);
	height:100%;
}
.filter-mask{
	position:relative;
	width:100%;
	height:100%;
	&>nav{
		position:absolute;
		left:0;
		bottom:0;
		width:100%;
		display:flex;
		font-size:0;
		letter-spacing:rem(5);
		a{
			display:flex;
			align-items:center;
			justify-content:center;
			font-size:rem(30);
			height:rem(96);
			&:first-child{
				border-top:1px solid $bordercolor;
				width:rem(270);
				color:#333;
				@include dpr3border();
			}
			&:last-child{
				width:rem(500);
				color:#fff;
				background-color:$blue;
			}
		}
	}
	h1{
		position:relative;
		display:flex;
		align-items:center;
		justify-content:center;
        height:rem(100);
        font-size: rem(30);
        color: #333;
        letter-spacing:rem(5);
        border-bottom: 1px solid #d7d7d7;
        @include dpr3border();
		span{
			position:absolute;
			top:0;
			left:0;
			width:rem(100);
			height:100%;
			background:url(./img/close.png) no-repeat;
			background-size:rem(30) rem(30);
			background-position:center center;

		}

    }
    .tit{
    	padding:rem(20) rem(30);
    	font-size: rem(26);
        color: #333;
    }
    .sortprice{
    	position:relative;
    	display:flex;
    	justify-content:space-between;
    	align-items:center;
    	padding:0 rem(30);
		.line{
			border-top:1px solid #a1a1a1;
			width:rem(16);
			@include dpr3border();
		}
    	.inpt{
    		width:rem(280);
    		background: #f4f4f4;
    		border-radius:rem(6);
    		font-size: 0;
    		input{
    			background:transparent;
    			border:0;
    			font-size:rem(24);
    			line-height:1.5;
    			padding:rem(10) rem(15);
    			color:$blue;
    		}
    	}
    }

}
.voucher-list-mask{
	position:relative;
	background:#f5f6fa;
	.icon-close{
		position:absolute;
		top:rem(45);
		right:rem(40);
		width:rem(26);
		height:rem(25);
		display:block;
		background:url(./img/close.png) no-repeat;
		background-size:100% 100%;
	}
	&>h1{
		padding:rem(35) 0;
		font-size:rem(30);
		color:#a1a1a1;
		line-height:1.5;
		text-align:center;
		letter-spacing:rem(2);
	}
	.vorlist{
		margin-bottom:rem(20);
		max-height:rem(500);
		overflow-y:auto;
		li{
			padding-left:rem(40);
			margin:0 auto rem(12);
			display:flex;
			flex-wrap:wrap;
			align-content: center;
			width:rem(680);
			height:rem(160);
			border:1px solid $bordercolor;
			@include dpr3border();
			font-size:0;
			letter-spacing:rem(3);
			overflow:hidden;
			border-radius:rem(8);
			background:#fff;
			h2{
				width:100%;
				font-size:rem(30);
				line-height:1.5;
			}
			p{
				margin-top:rem(10);
				width:100%;
				font-size:rem(24);
				line-height:1.5;
			}
			&.blue{
				background:#fff url(./img/vo1.png) repeat-y;
				background-size:rem(8) rem(12);
				h2{
					color:$blue;
				}
			}
			&.red{
				background:#fff url(./img/vo2.png) repeat-y;
				background-size:rem(8) rem(12);
				h2{
					color:$red;
				}
			}
			&.green{
				background:#fff url(./img/vo4.png) repeat-y;
				background-size:rem(8) rem(12);
				h2{
					color:$green;
				}
			}
			&.purple{
				background:#fff url(./img/vo3.png) repeat-y;
				background-size:rem(8) rem(12);
				h2{
					color:$purple;
				}
			}
		}
	}
}
</style>
