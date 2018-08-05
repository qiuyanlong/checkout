<template>
<div :style="{'height':bodyHeight+'px'}">
	<div class="cartmain cart">
		<loading :loadingswitch="loadding"></loading>
		<!-- 天气提醒 -->
		<!-- <p class="weather-tip">
			<i></i>
			<span>{{loadding}}温馨提示：近期受雨雪天气影响，长江以北、西北江淮、江南北部、西南等地区部分订单配送将受到影响，如果您购买的商品未能正常送达，请您理解并耐心等待，我们将会密切关注天气变化，合理调配资源，竭尽全力将订单商品送达您的手中。有任何问题，您都可以联系客服。</span>
		</p> -->
		<Address @selectFn="selectFn" v-if="vueShopList && vueShopList.length"></Address>

  		<!-- cart null -->
		<section class="go-buy" v-if="vueShopList && vueShopList.length === 0">
			<img src="./img/cart_null.png" alt="">
			<p>购物车君很饿~ <br>快用商品喂饱它吧!</p>
			<a :href="storeDomain">去逛逛</a>
		</section>
		<!-- <section class="cart-like">
			<h1>猜你喜欢</h1>
			<nav>
				<a :herf="ll.url" v-for="ll in likeList">
					<img :src="ll.img" :alt="ll.name">
					<div class="info">
						<p class="name">{{ll.name}}</p>
						<p class="twoprice"><span><i>￥</i>97.2</span><strong></strong><span><i>￥</i>102.2</span></p>
					</div>
				</a>
			</nav>
		</section> -->

		<!--shop-->
		<section class="shop" v-for="shop in vueShopList">
			<h1>
				<van-checkbox v-model="shop.shopChecked"  @click.native="curShopIsSelected(shop)">{{shop.shopName}}</van-checkbox>
				<span class="iedit" :class="{'blue':shop.isEdit}" @click="editGood(shop)">{{shop.isEdit ? '完成' : '编辑'}}</span>
			</h1>
			<router-link :to="{name:'CartVoucher',query:{shopid:shop.shopId}}" v-if="shop.voucherNumber > 0 && shop.usedVoucher.num <= 0">
				<div class="use" v-if="shop.voucherNumber > 0 && shop.usedVoucher.num <= 0">
					<p>有<i>{{shop.voucherNumber}}</i>张优惠券可选</p>
					<div class="go"><span>选择</span><van-icon name="arrow"/></div>
				</div>
			</router-link>
			<template v-if="shop.usedVoucher.num > 0">

				<router-link :to="{name:'CartVoucher',query:{shopid:shop.shopId}}">
					<div class="used">
						<i>已选{{shop.usedVoucher.num}}张</i>
						<p>
							<span v-for="(vo,index) in shop.usedVoucher.list" v-if="index !== shop.usedVoucher.list.length-1">
							{{vo.showName}}、
							</span>
							<span v-else>{{vo.showName}}</span>
						</p>
						<div class="go"><span>修改</span><van-icon name="arrow"/></div>
					</div>
				</router-link>
				<router-link :to="{name:'CartPiece',query:{shopid:shop.shopId}}" v-if="shop.useStatus==0 && shop.usedVoucher.needmoney > 0">
					<div class="using">
						<i class="hid">已选{{shop.usedVoucher.num}}张</i>
						<p>还差{{shop.usedVoucher.needmoney}}元 参与活动</p>
						<div class="go"><span>凑单</span><van-icon name="arrow"/></div>
					</div>
				</router-link>

			</template>

			<div class="cart-slider" v-for="good in shop.goodlist" :class="{'mt20':good.margintop,'useback':good.useVoucher}">
				<div class="good slidecontent"
					:class="{'active':good.useTransition,'botline':good.botline,'topline':good.topline}"
		            @touchstart='touchStart($event,good)'
		            @touchmove='touchMove($event,good)'
		            @touchend='touchEnd($event,good)'
		            :style="good.deleteSlider"
				>
					<van-checkbox
						v-model="good.checked"
						@change="curGoodIsSelected($event,shop)"
						@click.native="sendAlreadyGoods"
						v-if="good.marketable"
					></van-checkbox>
					<van-checkbox disabled v-else></van-checkbox>
					<div class="img">
						<img :src="good.image" @error="goodImgNull" alt="">
						<p v-if="good.stock <= 0 && good.marketable">区域无库存</p>
						<p v-if="!good.marketable">暂时失效</p>
					</div>

					<!-- 非编辑状态 -->
					<div class="info" v-if="!shop.isEdit || !good.marketable">
						<a class="name" :data-stock="good.stock" :data-bn="good.bn" :href="storeDomain + '/m' + '/product-' + good.pid + '.html'">
							<span v-if="good.isSpecial == 1">特价</span>
							{{good.goodName}}
						</a>
						<p class="spec">
							{{good.specInfo}}
						</p>
						<p class="privilege">
                            <span v-if="good.uniquePrivilege.length>0">特权:</span>
							<span v-if="good.novoucher">该商品不支持用券</span>
							<i class="igic" :class="icon" v-for="icon in good.uniquePrivilege"></i>
							<van-icon name="question" v-if="good.uniquePrivilege.length>0 || good.nosupport.length>0" @click="showPrivilegeList(good.privilege,good.nosupport)"/>
						</p>
						<p class="other">
							<span>￥{{ parseInt(good.price)}}<i>.{{toFloat(good.price).split('.')[1]}}</i><del>￥{{ toFloat( good.mktprice ) }}</del></span>
							<strong>x{{good.number}}</strong>
						</p>
					</div>

					<!-- 编辑状态 -->
					<div class="info pld40" v-else>
						<div class="fl">
							<div class="calculate" :data-stock="good.stock">
								<div class="lt"
									@click="calcuGoodNumber('-',good)"
									:class="{'disabled':good.number <= 1 || good.number <= good.limitBuy.min_num || good.stock <= 0}"
								></div>

								<div class="num">
									<input type="tel" v-model="good.number" @blur="calcuGoodNumber('input',good)" oninput="javascript:this.value=this.value.replace(/[^\d]/g,'')" :disabled="good.stock <= 0">
								</div>

								<div class="rg"
									@click="calcuGoodNumber('+',good)"
									:class="{'disabled':good.number >= good.limitBuy.max_num && good.limitBuy.max_num != 0 || good.number >= good.stock}"
								></div>
							</div>
							<a href="javascript:;" class="calculate-remove" @click="removeGood(good.pid,shop)">删除</a>
						</div>
						<div class="limit">

							<p v-if="good.number > good.stock && good.stock > 0 && good.marketable">(仅剩{{good.stock}}件)</p>
							<p v-if="good.limitBuy.min_num">(最少{{good.limitBuy.min_num}}件)</p>
							<p v-if="good.limitBuy.max_num">(限购{{good.limitBuy.max_num}}件)</p>
						</div>

					</div>

					<!-- 删除按钮 -->
					<a class="remove noTouchMove" ref="removebutton" href="javascript:;" @click="removeGood(good.pid,shop)">删除</a>
				</div>
			</div>

		</section>
			<!-- privilege description -->
			<Privilege v-model="privilegeDescModal" :list="privilegeList"></Privilege>

			<!--分开结算-->
			<Separate v-model="separatePayModal" @go="goCheckout"></Separate>

			<!--库存不足-->
			<Normal v-model="normalSwitch">
				<div slot="areanostock" class="areanostock">
					<h1>当前收货地址以下商品库存不足</h1>
					<ul>
						<li v-for="ae in areaNoStock">
							<div class="img">
								<img :src="ae.image" alt="">
							</div>
							<div class="info">
								<p>{{ae.goodName}}</p>
								<span>x{{ae.number}}</span>
							</div>
						</li>
					</ul>
					<a href="javascript:;" @click="normalSwitch = false">知道了</a>
				</div>
			</Normal>
			<!-- total -->
			<template v-if="vueShopList && vueShopList.length">
				<section class="totalbar">

					<!-- <p class="tip">优惠提示：所选商品包含[京东白条分期免息]优惠商品，若与其他商品合并结算这无法享受免息</p> -->
					<div class="allprice">
						<van-checkbox v-model="cartChecked" @click.native="curCartIsSelected">全选</van-checkbox>
                        <div class="go" v-if="cartTotalLoadingData">
                            <a href="javascript:;"  class=""><van-loading color="white" /></a>
                        </div>
						<div v-else class="go" >
							<div>
								<p class="hj">合计: <i>￥</i><span>{{parseInt(cartDate.payable_cash)}}</span><i>.{{toFloat(cartDate.payable_cash).split('.')[1]}}</i></p>
								<p class="ze" v-show="cartDate.total_discount > 0">总额:¥{{ toFloat( cartDate.total_amount ) }}已减¥{{toFloat(cartDate.total_discount)}}</p>
							</div>
							<template v-if="cartGoodNumber > 0 && currentAddressIsRight">
								<a href="javascript:;" @click="separatePayModal = true" v-if="isSeparate">去结算</a>
								<a href="javascript:;" @click="goCheckout" v-else>去结算</a>
							</template>
							<template v-else>
								<a href="javascript:;" class="disabled">去结算</a>
							</template>
						</div>
					</div>
					<div class="iphonex40"></div>
				</section>
			</template>
	</div>
</div>
</template>

<script>
import './css/cart.scss'
import domainConfig from '@/config/config'
import Address from '@/pages/neigou/components/Address'
import Separate from './components/separate'
import Privilege from './components/privilege'
import Normal from './components/normal'
import {mapState,mapMutations,mapGetters,mapActions} from 'vuex'

function calculateDebounce(fn, delay) {
    var delay=delay
    var timer,curObj
    return function (type,good) {
    	if(curObj && good.pid !== curObj) return
        curObj = good.pid;
        if(type=='-'|| type=='+'){
            delay=500;
        }
      	if(type === '-'){
      		if ( good.number <= good.limitBuy.min_num || good.number <= 1 || good.stock <= 0) return curObj = null
	  		good.number--

	  		//用户加入购物车了 1000件，但实际库存只剩下500,当用户改变数量时，强制将数量改为最大库存数
	  		if(good.number >= good.stock && good.stock > 0) good.number = good.stock


	  	}else if(type === '+'){
	  		if ( good.number >= good.limitBuy.max_num && good.limitBuy.max_num > 0 || good.number >= good.stock) return curObj = null
	  		good.number++
	  	}else if( type === 'input'){
	  		if(good.number >= good.stock){
                good.number = good.stock
            }
            if(/^\s*$/.test(good.number) || good.number == 0){
                good.number = 1
            }
            if(good.limitBuy.min_num && good.number <= good.limitBuy.min_num) good.number = good.limitBuy.min_num
            if(good.limitBuy.max_num && good.number >= good.limitBuy.max_num ) good.number = good.limitBuy.max_num
	  	}
      	clearTimeout(timer)
      	timer = setTimeout(function () {
         	fn(good)
         	curObj = null
      	}, delay)
    }
}
export default {
  	name: 'cart',
	data(){
	  	return {

	  		//domain
	  		storeDomain:domainConfig.store_domain,

	  		//所有shop 数据
	  		vueShopList:null,

	  		//全选按钮
	  		cartChecked:false,

	  		//特权弹层开关
	  		privilegeDescModal:false,

	  		//分开结算弹层开关
	  		separatePayModal:false,

	  		//移除按钮的宽度
	  		removeBtnWidth:0,

	  		//判断是否分开结算
	  		isSeparate:false,

	  		//特权列表
	  		privilegeList:{},

	  		//编辑状态shop
	  		shopIsEditing:[],

	  		//区域无库存列表
	  		areaNoStock:[],

	  		//区域无库存弹层开关
	  		normalSwitch:false,

	  		//节省金额
	  		saveMoney:0,

	  		//总件数
            cartGoodNumber:0,

            //结算类型
            cartType:0,

            //商品bn列表
            productBn:[],

            //记录当前地址是否正确
            currentAddressIsRight:true,

	  	}
	},
	components: {
		Address,
		Separate,
		Privilege,
		Normal
	},
  	computed:{
  		alreadySelectedGoodArray(){

            let _goodArray = []

            this.vueShopList && this.vueShopList.forEach(sp=>{

                sp.goodlist.forEach(gd=>{

                    if(gd.checked) _goodArray.push(gd.pid)

                })

            })

            return _goodArray

        },
  		...mapState({
  			hasMRYX : state=>state.cart.hasMRYX,
  			loadding : state => state.cart.fetchLoading,
	      	cartDate : state => state.cart.cartDate,
	      	selectedVoucherList : state => state.cart.selectedVoucherList,
	      	filterSelectedVoucherList : state => state.cart.filterSelectedVoucherList,
	      	goodslistStock : state => state.cart.goodslistStock,
	      	stockSaveTime : state => state.cart.stockSaveTime,

	      	now_store_address : state => state.checkout.now_store_address,
	    }),
	    ...mapGetters([
		    'shopList',
		    'typeList',
            'selectedVoucherListForMoney',
            'cartTotalLoadingData'
	    ])
  	},
  	watch:{

  		now_store_address:{
  			handler(nval){
  				this.$store.commit("UPDATE_ADDRESS",nval)
  				this.currentAddressIsRight = this.hasMRYX&& !nval.deliver_json||!nval.area_valid ? false : true
  			},
  			immediate:true
  		},
  		hasMRYX(nval){
  			this.currentAddressIsRight = nval&& !this.now_store_address.deliver_json||!this.now_store_address.area_valid ? false : true
  		},
  		//店铺数据
  		shopList(nval,oval){

  			let _vm = this

  			_vm.vueShopList = []

  			if(!nval.length)  return

  			let markgoodlist = []

  			//节省金额
  			let saveMoney = 0

  			//bn 列表
  			let shopProductBns = []

  			//当前客户端时间
  			let clientTime = +new Date

  			//店铺信息
  			// let shopInfo = {}

  			//已选券信息 通过store 获取
  			let _usedVoucherListForMoney = _vm.selectedVoucherListForMoney

  			nval.forEach(item => {

  				//当前shop
  				let _currentshop = {}

  				//商品列表
  				let _goodlist = []

  				//初始店铺的全选按钮 为true
  				let _shopChecked = true

  				//可用券数量
  				let _vouchernumber = 0

  				// //已用券
  				// let _usedvoucher = {}

  				//商品bn  product
  				let _productbns = []

  				//店铺编辑状态
  				let _isEditing = false

  				//选中商品且符合券规则的金额
  				// let _shopVoucherGoodsTotal = 0

  				item.product_list.forEach((gd,gdIndex)=>{

  					//商品数量
  					let __goodnumber = parseInt( gd.quantity )

  					//商品选中状态
  					let __goodChecked = false

  					//同时存在农行免息，白条免息，免息券,只展示一个免息icon，但是弹层上展示多个
  					let __uniquePrivilege = []

  					//权益
  					let __privilege = []

  					//不支持
  					let __nosupport = []

  					//不能用券
  					let __voucherno = false

  					//区分满足券规则商品 和普通商品  UI
  					let __margintop = false

  					//设置聚合商品的连接线
  					let __topline = false
  					let __botline = false

  					if(gd.marketable) gd.checked_state === 1 ? __goodChecked = true : _shopChecked = false

  					gd.goods_icon.length && gd.goods_icon.forEach(icon=>{
  						let icontype = icon.icon_marking
  						if(icontype === 'ban_point_pay'){
  							__nosupport.push(icontype)
  						}else if(icontype === 'ban_voucher'){
  							__voucherno = true
  						}else{
  							__privilege.push(icontype)


  							//商品信息处 只展示一个免息icon
  							if(icontype == 'baitiao_interest_free' || icontype == 'nonghang_interest_free'){
  								if(!__uniquePrivilege.find(p=>p=='interestfree')){
  									__uniquePrivilege.push('interestfree')
  								}
  							}else{
  								__uniquePrivilege.push(icontype)
  							}

  						}
  					})

  					//当前元素前一个元素 当前元素后一个元素
  					let __prevgood = item.product_list[gdIndex-1],
  						__nextgood = item.product_list[gdIndex+1]

  					if(!gd.use_voucher && __prevgood && __prevgood.use_voucher ) __margintop = true

  					if(gd.use_voucher && __nextgood && __nextgood.use_voucher ) __botline = true

  					if(gd.use_voucher && __prevgood && __prevgood.use_voucher) __topline = true

  					// //选中商品且符合券规则的金额
  					// if(gd.use_voucher && gd.checked_state === 1) _shopVoucherGoodsTotal += parseFloat( gd.cost * __goodnumber)

  					//区域无库存
  					// _vm.areaNoStock.forEach(ae=>{
  					// 	if(ae.pid === gd.product_id) __goodstock = ae.stock
  					// })

  					_goodlist.push({
  						bn:gd.product_bn,
  						pid:gd.product_id,
  						goodId:gd.goods_id,
  						specInfo:gd.spec_info,
  						image:gd.image,
  						number:__goodnumber,
  						price:gd.price.price,
  						mktprice:gd.price.mktprice,
  						goodName:gd.product_name,
  						marketable:gd.marketable,
  						uniquePrivilege:__uniquePrivilege,
  						privilege:__privilege,
  						nosupport:__nosupport,
  						novoucher:__voucherno,
  						useVoucher:gd.use_voucher,
  						isSpecial:gd.is_special_sale,
  						stock:9999999,
  						limitBuy:gd.limit_buy,

  						//区分满足券规则商品 和普通商品  UI
  						margintop:__margintop,
  						//设置聚合商品的连接线
  						topline:__topline,
  						botline:__botline,

  						checked:__goodChecked,
	  	  				startX: 0,
				        endX: 0,
				        moveX: 0,
				        disX: 0,
				        useTransition: false,
				        moveIsOver: false,
				        deleteSlider: ''
  					})
  					_productbns.push(gd.product_bn)
  				})
  				markgoodlist.push(..._goodlist)
  				//商品循环结束

  				//券数量
  				for(let m in item.shop_voucher){
  					_vouchernumber += item.shop_voucher[m].length
  				}

  				//已用券
  				// _usedvoucher.num = 0
  				// _usedvoucher.list = []

  				// _usedvoucher.needmoney = 0
  				// _usedvoucher.needmoneylist = []


  				//已用券
  				// for(let m in item.shop_use_voucher){

  				// 	let cur = item.shop_use_voucher[m]

  				// 	if(cur.length) cur.forEach(it=>{
  				// 		if(it.use_status == 1){
	  			// 			saveMoney += parseFloat(it.money)
	  			// 		}
  				// 	})

  				// }

  				//获取最大need_money
  				//if(_usedvoucher.needmoneylist.length) _usedvoucher.needmoney = Math.max(..._usedvoucher.needmoneylist)


  				// shopInfo[item.shop_id] = {
  				// 	needmoney:_usedvoucher.needmoney,
  				// 	voucherTotal:_shopVoucherGoodsTotal,
  				// }

  				//店铺编辑状态
  				_vm.shopIsEditing.forEach(shopid=>{
  					if(item.shop_id === shopid){
  						_isEditing = true
  					}
  				})

  				_currentshop = {
  					typeId:item.type_id,
  					shopId:item.shop_id,
  					shopName:item.shop_name,
  					isEdit:_isEditing,
  					shopChecked:_shopChecked,
  					goodlist:_goodlist,
  					// shopVoucher:item.shop_voucher,
  					voucherNumber:_vouchernumber,
  					useStatus:_usedVoucherListForMoney[item.shop_id].useStatus,
  					usedVoucher:{
  						list:_usedVoucherListForMoney[item.shop_id].usedVoucherList,
  						num:_usedVoucherListForMoney[item.shop_id].usedVoucherNumber,
  						needmoney:_usedVoucherListForMoney[item.shop_id].needmoney
  					},
  					// usedVoucher:_usedvoucher,
  					// needmoney:_vm.selectedVoucherList[item.shop_id].needmoney,
  					// goodbns:item.product_bns
  				}

  				_vm.vueShopList.push(_currentshop)

  				shopProductBns.push( ..._productbns )
  			})

			//shop 遍历结束

			//更新店铺券信息
			// _vm.$store.commit('UPDATE_SHOP_VOUCHER_INFO',shopInfo)

			// console.log(_vm.shopVoucherInfo)

			//节省金额
			// _vm.saveMoney = saveMoney
  			//判断bns非空 防止多次请求库存接口 ,页面停留3分钟 重新拉取库存
  			if(JSON.stringify(_vm.goodslistStock) == "{}" || ( clientTime - _vm.stockSaveTime >= 180000 ) || _vm.productBn.length == 0 ){
  				//开始记录库存缓存时间
  				_vm.$store.commit('UPDATE_STOCK_TIME',+new Date)

  				_vm.productBn = shopProductBns
  				//请求库存
  				_vm.getGoodStock({
	  				productIds:shopProductBns,
	  				callback(res){
	  					_vm.areaNoStock = []

	  					markgoodlist.forEach(gd=>{

	  						for(let probn in res){
	  							if(gd.bn === probn){
	  								gd.stock = res[probn].stock
	  								if(res[probn].stock <= 0 && gd.checked) _vm.areaNoStock.push(gd)
	  							}
	  						}

	  					})
	  				}
	  			})
  			}else{
  				let res = _vm.goodslistStock
  				_vm.areaNoStock = []
  				markgoodlist.forEach(gd=>{

					for(let probn in res){
						if(gd.bn === probn){

							gd.stock = res[probn].stock
							if(res[probn].stock <= 0  && gd.checked) _vm.areaNoStock.push(gd)
						}
					}

				})
  			}


  			//如果每个店铺都被选中  购物车全选按钮被选中
  			if(!_vm.vueShopList.find(sp=>sp.shopChecked===false)) _vm.cartChecked = true

  			//渲染节点元素时 获取删除按钮的宽度
  			_vm.$nextTick(()=>{
  				_vm.removeBtnWidth = _vm.$refs.removebutton[0].offsetWidth
  			})
  		},

  		//分开结算判断
  		typeList(nval){
  			let _isseparate = false,
                _count = 0,
                _hwg = 0,
                _normal = 0

            nval.forEach(tp=>{
                _count += tp.goodscount

                if( tp.id == 1 && tp.goodscount > 0 ) _hwg = 1,this.cartType = 1

                if( tp.id == 2 && tp.goodscount > 0) _normal = 1,this.cartType = 2
            })

            //判断是否分开结算
           	this.isSeparate =  _hwg && _normal ? true :  false

        	//购物车勾选商品的总件数
            this.cartGoodNumber = _count

  		}

  	},
  	methods:{
  		...mapActions([

  			'mryx_updateIndex',

	      	'getCart',
	      	'updateGoodsChecked',
	      	'updateFirstReques',
	      	'updateGoodNumber',
	      	'deleteGood',
	      	'getGoodStock',
	      	'submitCart'
	    ]),
	    ...mapMutations([
	    	'UPDATE_SHOP_VOUCHER_INFO'
	    	//'UPDATE_ADDRESS'
	    ]),

  		//每日优鲜不合法地址回调
  		selectFn(el,address,index,type){

  			//更新store地址数据，更新productBn  重新请求库存
  			this.productBn = []
  			// this.$store.commit("UPDATE_ADDRESS",address)

  			this.$store.commit('updata_attribute',{type:'get_now_address_index',res:index})
  			this.$store.commit('updata_attribute',{type:'now_store_address',res:address})

  			 // commit(types.UPDATE_ATTRIBUTE,{type:'get_now_address_index',res:nindex})


	        this.mryx_updateIndex(index)

	        //隐藏优鲜地址弹窗
	        el.youxian_address_list = false

	        //隐藏普通地址弹窗
	        el.addressshow = false
        	this.getCart()
	     },

	    //展示特权
	    showPrivilegeList(list,list2){
	    	this.privilegeDescModal = true
	    	this.privilegeList = {
	    		yes:list,
	    		no:list2
	    	}
	    },

	    //去结算车
		goCheckout(from){

			let _vm = this

			//判断是否勾选了 区域无库存商品
			if(_vm.areaNoStock.find(ae=>ae.checked) ) return _vm.normalSwitch = true
			else _vm.normalSwitch = false

			_vm.submitCart({
				cartType: ( typeof from === 'number' ? from : 0 ) ||  _vm.cartType,
				callback(res){
					_vm.$router.push({
			  			name:'checkout',
			  			query:{
			  				key:res.checkoutKey
			  			}
			  		})

					//存储有效券
					sessionStorage.setItem('validSelectedVoucherList',JSON.stringify(_vm.filterSelectedVoucherList))



				}
			})
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

		//图商品图错误
	    goodImgNull(ev){
	    	ev.target.src = require('./img/good_img_null.png')
	    },

	  	//移除商品
	  	removeGood(_Gid,_Shop){

	  		this.$dialog.confirm({
			  // title: '删除商品',
			  message: '确定删除相应商品?'
			}).then(() => {

			  	let _goodindex,
			  		_goodlist = _Shop.goodlist

		  		_goodindex = _goodlist.findIndex( gd => gd.pid === _Gid )

		  		_goodlist.splice(_goodindex,1)

		  		//判断删除的商品是否是最后一个店铺商品
		  		if(!_goodlist.length){
		  			let _shopindex,
		  				_shoplist = this.vueShopList

		  			_shopindex = _shoplist.findIndex( sp => sp.id === _Shop.id )
			  		_shoplist.splice(_shopindex,1)
		  		}

		  		//触发store action
		  		this.deleteGood(_Gid)

			}).catch(() => {
			  // on cancel
			});


	  	},

	  	//编辑商品
	  	editGood(shop){

	  		shop.isEdit = !shop.isEdit
	  		if(shop.isEdit){
	  			this.shopIsEditing.push(shop.shopId)
	  		}else{
	  			let _arr = []
	  			this.shopIsEditing.forEach((item,index)=>{

	  				if(item !== shop.shopId ){
	  					_arr.push(item)
	  				}

	  			})
	  			this.shopIsEditing = _arr
	  		}
	  		shop.goodlist.forEach(gd => this.$set(gd,'isGoodEdit',shop.isEdit))

	  		this.resetTouch(shop)

	  	},

	  	//更新已选商品
	  	sendAlreadyGoods(){
	  		this.updateGoodsChecked(this.alreadySelectedGoodArray)
	  	},

	  	//选中所有商品
	  	curCartIsSelected(){

	  		let _this = this

	  		_this.cartChecked ? _this.vueShopList.forEach(shop => {

	  			shop.shopChecked = true
	  			_this.curShopIsSelected(shop, 1)

	  		}) : _this.vueShopList.forEach(shop => {
	  			shop.shopChecked = false
	  			_this.curShopIsSelected(shop, 1)

	  		})

	  		this.sendAlreadyGoods()
	  	},


	  	//点击选中当前shop所有商品
	  	curShopIsSelected(shop,fromAll = 0){

	  		let _gd = shop.goodlist || [];

	  		shop.shopChecked ? _gd.forEach( gd =>  gd.checked = true ) : _gd.forEach( gd => gd.checked = false );

	  		if(!fromAll) this.sendAlreadyGoods()

	  	},

	  	//选中单个商品
	  	curGoodIsSelected(ev,shop){

	  		ev ? !shop.goodlist.find( gd => gd.checked === false )
	  		?
	  		( shop.shopChecked = true, !this.vueShopList.find( sp => sp.shopChecked==false) ? this.cartChecked = true : '' ) : ''
	  		:
	  		(shop.shopChecked = false, this.cartChecked = false)

	  	},

	  	//点击商品时或者点击编辑时， 重置其他商品的 删除样式
	  	resetTouch(shop = this.vueShopList){

	  		let _find = function(_sp){
	  			let _isMoved ;
	        	if ( _isMoved = _sp.goodlist.find( g => g.moveIsOver == true ) ){

	        		_isMoved.deleteSlider = 'transform:translateX(0px)'
			        _isMoved.startX=0
			        _isMoved.startY=0
			        _isMoved.endX=0
			        _isMoved.moveX=0
			        _isMoved.disX=0
			        _isMoved.disY=0
			        _isMoved.moveIsOver = false

	        	}
	  		}

	  		Array.isArray(shop) ? shop.forEach(sp => _find(sp)) : _find(shop)

	    },

	    //手指接触到good时
	    touchStart (ev,obj) {

	      	ev = ev || event

	      	//手持接触的节点 如果class是noTouchMove 阻止滑动(针对节点)，编辑商品时 阻止滑动
		  	if(ev.target.className.indexOf('noTouchMove') != -1 || obj.isGoodEdit) return;
	      	if (ev.touches.length === 1) {
	        	obj.startX = ev.touches[0].clientX
	        	obj.startY= ev.touches[0].clientY
				obj.disX=0
	        	this.resetTouch()
	      	}

	    },

	    //手指在good上滑动
	    touchMove (ev,obj) {

	      	ev = ev || event
	      	let wd = this.removeBtnWidth
	      	//手持接触的节点 如果class是noTouchMove 阻止滑动(针对节点)，编辑商品时 阻止滑动
	      	if(ev.target.className.indexOf('noTouchMove') != -1 || obj.isGoodEdit) return;

	      	if (ev.touches.length === 1) {

	      		obj.moveY  = ev.touches[0].clientY
	      		obj.disY = obj.startY - obj.moveY

	        	obj.moveX = ev.touches[0].clientX
	        	obj.disX = obj.startX - obj.moveX

	        	if ( Math.abs(obj.disX) > Math.abs(obj.disY) && obj.disX > 0 ){

		        	//滑动时禁止页面滑动
		        	if(obj.disX > 20 || obj.moveIsOver) ev.preventDefault()
		        	if (obj.moveIsOver || obj.disX<=0) return
		        	// 移动中关闭transition 防止页面卡顿
		        	obj.useTransition = false

		        	if (obj.disX < 0 || obj.disX === 0) {
		          		//obj.deleteSlider = 'transform:translate3d(0px,0px,0px)'
		        	} else if (obj.disX > 0) {
		          		if (obj.disX >= wd) {
			            	obj.moveIsOver = true;
			            	obj.deleteSlider = 'transform:translate3d(-' + parseInt(wd) + 'px,0px,0px)'
			            	return
			          	}
		          		obj.deleteSlider = 'transform:translate3d(-' + parseInt(obj.disX) + 'px,0px,0px)'
		        	}
	        	}
	      	}
	    },

	    //手指离开good
	    touchEnd (ev,obj) {

	      	ev = ev || event
	      	let wd = this.removeBtnWidth
	      	//手持接触的节点 如果class是noTouchMove 阻止滑动(针对节点)，编辑商品时 阻止滑动
	      	if(ev.target.className.indexOf('noTouchMove') != -1 || obj.isGoodEdit) return;

	      	if (ev.changedTouches.length === 1) {
	        	let endX = ev.changedTouches[0].clientX
	        	obj.disX = obj.startX - endX


	        	// 放开手 打开transition
	        	obj.useTransition = true

		        if (obj.disX < wd) {
		          	obj.moveIsOver = false
		          	setTimeout(() => {
		            	obj.deleteSlider = 'transform:translate3d(0px,0px,0px)'
		          	}, 1)
		        } else {
		          	obj.moveIsOver = true
		          	setTimeout(() => {
		            	obj.deleteSlider = 'transform:translate3d(-' + parseInt(wd) + 'px,0px,0px)'
		          	}, 1)
		        }
	      	}
	    },

  	},
  	filters:{
        showVouchName(cur){
            if(cur.type == 'money'){
                if(cur.limit_cost == 0) return '减'+ parseInt(cur.money)
                else return  '满'+parseInt( cur.limit_cost )+'减'+ parseInt(cur.money)
            }else{
                if(cur.limit_cost == 0) return parseInt( cur.discount )+'折'
                else return  '满'+parseInt(cur.limit_cost)+'打'+parseInt( cur.discount )+'折'
            }
        }
    },
  	mounted(){

  	},
  	beforeCreate(){},
  	created(){
        window.serial_num=[];
        this.$store.state.checkout.identity_save_info=true// 重置选择信息

  		this.bodyHeight =  document.documentElement.clientHeight
  		//清空所选有效券数据
  		sessionStorage.removeItem('validSelectedVoucherList')

  		let _vm = this
  		//更改数量 防抖函数
  		_vm.calcuGoodNumber = calculateDebounce(good=>{
  			_vm.updateGoodNumber({pid:good.pid,number:good.number})
  		}, 1000)

  		_vm.getCart()

  		if(window.sessionStorage){
         sessionStorage.removeItem('hasInit')
      }
  	}
}
</script>