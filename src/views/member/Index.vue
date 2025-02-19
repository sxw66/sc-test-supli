<template>
	<div class='sld_collect_index wd'>
		<!-- 会员基本信息 -->
		<div class="user_info_top ">
			<div class="user_info_l fl flex_column_around_center">
				<div>
					<div class="user_avatar sld_img_center">
						<img :src="memberInfo.info.userAvatar" class="head_img" v-if="memberInfo.info.userAvatar">
						<img src="@/assets/member/missing-face.png" class="head_img" v-else>
					</div>
					<div class="user_avatar_r">
						<b>{{ memberInfo.info.userName }}</b>
					</div>
				</div>

				<div class="flex_row_center_center" :style="{ maxWidth: '90%', marginTop: '20px' }">
					<router-link :to="'/member/address/list'" class="user_addr" target="_blank">
						<i class="iconfont icondaohangdizhiweizhi"></i>
						<span style="margin: 0 5px;" class="addr-detail">{{ L['会员收货地址'] }}</span>
						<i class="fr iconfont iconfanhui"></i>
					</router-link>
				</div>


			</div>
			<div class="infoCon clearfix">
				<div class="info_rcol">
					<h4 class="user_title"><i class="iconfont icongerenzhongxinwodecaichan"></i>{{ L["我的财产"] }}</h4>
					<ul class="acco_info fl flex_row_start_center">

						<li class="acco_item">
							<div>
								<router-link class="sld_link_red" :to="'/member/coupon'" target="_blank">{{
							memberInfo.info.couponNum }}
								</router-link>
								<p>{{ L['优惠券'] }}</p>
								<router-link class="sld_link" :to="'/coupon'" target="_blank">{{ L['领券']
									}}</router-link>
							</div>
						</li>

						<!-- <li class="acco_item">
							<div>
								<router-link class="sld_link_red" :to="'/member/collect/store'" target="_blank">
									{{ memberInfo.info.followStoreNum }}</router-link>
								<p>{{ L['供应商关注'] }}</p>
								<router-link class="sld_link" :to="'/member/collect/store'" target="_blank">{{
							L['查看'] }}
								</router-link>
							</div>
						</li> -->
					</ul>
				</div>
			</div>
		</div>
		<!-- 会员订单信息 -->
		<div class="user_order clearfix">
			<div class="my_order fl">
				<h4 class="user_title"><i class="iconfont">&#xe619;</i>{{ L['我的订单'] }}</h4>
				<ul class="clearfix order_state_nav">
					<li>
						<router-link :to="'/member/order/list?orderState=10'" target="_blank">
							<i class="iconfont">&#xe677;</i>
							<p>{{ L['待支付'] }}</p>
							<div class="tag" v-if="memberInfo.info.toPaidOrder > 0">{{ memberInfo.info.toPaidOrder }}
							</div>
						</router-link>

					</li>
					<li>
						<router-link :to="'/member/order/list?orderState=30'" target="_blank">
							<i class="iconfont">&#xe676;</i>
							<p>{{ L['待收货'] }}</p>
							<div class="tag" v-if="memberInfo.info.toReceivedOrder > 0">
								{{ memberInfo.info.toReceivedOrder }}</div>

						</router-link>
					</li>
					<li>
						<router-link :to="'/member/order/list?orderState=40&evaluateState=1'" target="_blank">
							<i class="iconfont">&#xe678;</i>
							<p>{{ L['待评价'] }}</p>
							<div class="tag" v-if="memberInfo.info.toEvaluateOrder > 0">
								{{ memberInfo.info.toEvaluateOrder }}</div>
						</router-link>
					</li>
					<li>
						<router-link :to="'/member/order/list?orderState=25'" target="_blank">
							<i class="iconfont">&#xe67c;</i>
							<p>{{ L['声明发货'] }}</p>
							<div class="tag" v-if="memberInfo.info.toEvaluateOrder > 0">
								{{ memberInfo.info.toEvaluateOrder }}</div>

						</router-link>
					</li>
					<!-- <li>
						<router-link :to="'/member/order/aftersales'" target="_blank">

							<i class="iconfont">&#xe67c;</i>
							<p>{{ L['售后/退货'] }}</p>
							<div class="tag" v-if="memberInfo.info.afterSaleNum > 0">{{ memberInfo.info.afterSaleNum
								}}
							</div>
						</router-link>
					</li> -->
					<li>
						<router-link :to="'/member/order/list'" target="_blank">
							<span>
								<i class="iconfont iconziyuan11"></i>
							</span>
							<p>{{ L['全部订单'] }}</p>
						</router-link>
					</li>
				</ul>
				<div v-if="order.list.length > 0">
					<div class="user-order-item clearfix"
						v-for="({ createTime, totalMoney, productList, orderSn, orderStateValue, }, index) in order.list"
						:key="index">
						<div class="fl">
							<router-link class="fl img"
								:to="`/goods/detail?sourcePath=/member/index&productId=${productList[0].productId}`" target="_blank">
								<coverImage :src="productList[0].productImage" class="img"></coverImage>
							</router-link>
							<a class="fl">
								<p>{{ productList[0].goodsName }}</p>
								<p class="price">R${{ $formatMoneyNum(totalMoney) }}</p>
								<p class="time">下单时间:{{ createTime }}</p>
							</a>
						</div>
						<div class="fr">
							<p class="orderSn">{{ L['订单号'] }}:{{ orderSn }}</p>
							<p class="orderState">{{ orderStateValue }}</p>
							<a @click="seeOrderDetail(orderSn)" style="cursor: pointer">{{ L['查看详情'] }}</a>
						</div>
					</div>
				</div>
				<div class="user_order_empty flex_row_center_center" v-else>
					<img src="@/assets/member/member_empty.png" alt="">
					<p>{{ L['这里空空如也，快去挑选合适的商品吧~'] }}</p>
				</div>
			</div>
			<div class="my_follow fr">

				<!-- 进货单item -->
				<div class="my_follow_item cartItem">
					<h4 class="user_title"><i class="iconfont icongouwuche"></i>{{ L['进货单'] }} ({{ cartLen
						}})<router-link :to="'/cart/index'" target="_blank">{{ L['查看更多'] }}></router-link>
					</h4>
					<ul class="clearfix">
						<template v-for="(storeItem, storeIndex) in cartData.data.storeCartGroupList" :key="storeIndex">
							<template v-for="(promotItem, promotIndex) in storeItem.storeGoodsList" :key="promotIndex">
								<li class="list_item" v-for="(cartItem, cartIndex) in promotItem.goodsCartList" :key="cartIndex">
									<a @click="toProductDetail(cartItem.productId)">
										<img :src="cartItem.productImage" alt="">
									</a>
								</li>
							</template>
						</template>
						<div class="no_footprint" v-show="!cartLen">{{ L['暂无商品~'] }}</div>
					</ul>
				</div>

				<!-- 关注供应商item -->
				<!-- <div class="my_follow_item store">
					<h4 class="user_title"><i class="iconfont">&#xe679;</i>{{ L['供应商关注'] }}
						({{ memberInfo.info.followStoreNum }})
						<router-link :to="'/member/collect/store'" target="_blank">{{ L['查看更多'] }}></router-link>
					</h4>
					<ul class="clearfix">
						<li class="list_item" v-for="({ storeLogo, storeId }, index) in collectStore.store" :key="index">
							<router-link :to="`/store/index?vid=${storeId}`" target="_blank">
								<img :src="storeLogo" alt="">
							</router-link>
						</li>
						<div class="no_footprint" v-show="!collectStore.store.length">{{ L['暂无关注供应商~'] }}</div>
					</ul>
				</div> -->

				<!-- 收藏商品item -->
				<div class="my_follow_item goods">
					<h4 class="user_title"><i class="iconfont">&#xe67d;</i>{{ L['我的收藏'] }}
						({{ memberInfo.info.followProductNum }})
						<router-link :to="'/member/collect/goods'" target="_blank">{{ L['查看更多'] }}></router-link>
					</h4>
					<ul class="clearfix">
						<li class="list_item" v-for="({ productImage, productId }, index) in collectGoods.goods" :key="index">
							<a @click="toProductDetail(productId)">
								<img :src="productImage" alt="">
							</a>
						</li>
						<div class="no_footprint" v-show="!collectGoods.goods.length">{{ L['暂无收藏商品~'] }}</div>
					</ul>
				</div>

				<!-- 足迹item -->
				<div class="my_follow_item footprint">
					<h4 class="user_title"><i class="iconfont">&#xe67f;</i>{{ L['我的足迹'] }}
						({{ memberInfo.info.lookLogNum }})
						<router-link :to="'/member/footprint'" target="_blank">{{ L['查看更多'] }}></router-link>
					</h4>
					<ul class="clearfix">
						<li class="list_item" v-for="({ goodsImage, productId }, index) in looklog.log" :key="index">
							<a @click="toProductDetail(productId)">
								<img :src="goodsImage" alt="" />
							</a>
						</li>
						<div class="no_footprint" v-show="!looklog.log.length">
							{{ L['暂无足迹~'] }}
						</div>
					</ul>
				</div>
			</div>
		</div>
		<!-- 热销推荐 -->

	</div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from "vuex";
export default {
	name: 'index',

	setup () {
		const router = useRouter()
		const store = useStore()
		const memberInfo = reactive({ info: {} })
		const looklog = reactive({ log: [] })
		const looklogLen = ref(0)
		const cartData = reactive({ data: [] })
		const cartLen = ref(0)
		const collectStore = reactive({ store: [] })
		const collectGoods = reactive({ goods: [] })
		const hotRecom = reactive({ goods: [] })
		const order = reactive({ list: [] })
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()

		

		const getInitInfo = () => {  //获取会员信息数据
			proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
				if (res.state == 200) {
					memberInfo.info = Object.assign({}, memberInfo.info, res.data);
					store.commit("updateMemberInfo", memberInfo.info); //将进货单数据存储到vuex的store中
				}
			})
		}

		const getLookLog = () => {  //获取我的足迹数据
			proxy.$get('v3/supplier/channel/productLookLog/list').then(res => {
				if (res.state == 200) {
					looklog.log = res.data.list[0] ? res.data.list[0].productLookLogList.slice(0, 4) : []
					looklogLen.value = res.data.list[0] ? res.data.list[0].productLookLogList.length : 0
				}
			})
		}

		const getCartItem = () => {
			proxy.$get('v3/supplier/channel/cart/cartList').then(res => {
				if (res.state == 200) {
					cartData.data = res.data

					let { storeCartGroupList } = cartData.data
					let storeGoodsList = storeCartGroupList.map(i => i.storeGoodsList).flat(1).map(j => j.goodsCartList).flat(1)

					cartLen.value = storeGoodsList.length
				}
			})
		}

		const getCollectStore = () => {
			proxy.$get('v3/supplier/channel/followStore/list').then(res => {
				if (res.state == 200) {
					collectStore.store = res.data.storeList
				}
			})
		}

		const getCollectGoods = () => {
			proxy.$get('v3/supplier/channel/followProduct/list').then(res => {
				if (res.state == 200) {
					collectGoods.goods = res.data.list
				}
			})
		}

		const getHotReco = () => {
			//获取热门推荐数据
			// let params = {
			// 	queryType: 'cart'
			// }
			// proxy.$get('v3/supplier/channel/goods/recommendList', params).then(res => {
			// 	if (res.state == 200) {
			// 		hotRecom.goods = res.data.list
			// 		hotRecom.goods.map(
			// 			item => (item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
			// 		)
			// 	}
			// })
		}

		const getOrder = () => {
			//获取订单
			let params = {
				current: 1
			}
			proxy.$get('v3/supplier/channel/orderInfo/list', params).then(res => {
				if (res.state == 200) {
					order.list = res.data.list
					order.list.forEach(item => {
						item.totalMoney = new Number(item.totalMoney).toFixed(2)
						item.productList = []
						item.orderProductList.forEach(items => {
							if (items.isGift != 1) {
								item.productList.push(items)
							}
						})
					})
				}
			})
		}

		const seeOrderDetail = (orderSn) => {
			//去往订单详情
			let newWin = router.resolve({
				path: 'order/detail',
				query: {
					orderSn: orderSn
				}
			})
			window.open(newWin.href, '_blank');
		}

		const toProductDetail = (productId) => {
			let newWin = router.resolve({
				path: '/goods/detail',
				query: {
					sourcePath: '/member/index',
					productId: productId
				}
			})
			window.open(newWin.href, '_blank');
		};



		onMounted(() => {
			getInitInfo()
			getLookLog()
			getHotReco()
			getOrder()
			getCartItem()
			getCollectStore()
			getCollectGoods()
			
			const properties = Object.keys(L).map(key => ({
			[key]: Reflect.get(L, key)
			}));
			
			console.log(L, 'EEE');
			console.log(properties, 'properties');
			console.log(L['会员收货地址'], 'lll');
		})

		return {
			memberInfo, L, looklog, hotRecom, getOrder, order, seeOrderDetail, toProductDetail, looklogLen, cartData, cartLen, collectStore, collectGoods,
		}
	}
}
</script>
<style lang="scss" scoped>
@import '@/style/member/index.scss';
@import '@/style/base.scss';

.user_order_empty {
	padding: 90px;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;

	img {
		width: 190px;
		height: 140px;
	}

	p {
		margin-left: 12px;
		color: #666666;
	}
}

.no_footprint {
	height: 73px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #666666;
}

.iconfanhui {
	font-size: 24px;
	margin-right: 5px;
	transform: rotate(180deg);
}

</style>
