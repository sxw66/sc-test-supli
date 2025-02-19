//进货单页面
<template>
	<div class="sld_cart_index">
		<div class="cart_content" v-if="cartData.data &&
			((cartData.data.invalidList &&
				cartData.data.invalidList.length > 0) ||
				(cartData.data.storeCartGroupList &&
					cartData.data.storeCartGroupList.length > 0))
			">
			<!-- 进货单列表顶部标题 start-->
			<div class="cart_title flex_row_start_center">
				<div class="cart_title_pre flex_row_start_center" v-if="cartData.data.storeCartGroupList.length > 0">
					<div class="select" @click="changeSelectState('all', cartData.data.checkedAll)" style="margin-right: 20px;">
						<myCheckBox :checked="cartData.data.checkedAll" :disabled="cartData.data.lackAll"></myCheckBox>
					</div>
					<span>{{ L['全选'] }}<text v-if="cartData.data.totalCheck">（{{ cartData.data.totalCheck }}）</text></span>
				</div>
				<div v-else style="width: 62px;"></div>


				<div class="cart_title_pre">
					<span>{{ L['商品信息'] }}</span>
				</div>

				<div class="cart_title_pre">
					<span>{{ L['数量'] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L['单价'] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L['小计（R$）'] }}</span>
				</div>
				<div class="cart_title_pre">
					<span>{{ L['操作'] }}</span>
				</div>
			</div>
			<!-- 进货单列表顶部标题 end-->
			<!-- 进货单列表 start -->
			<div class="cart_lists" v-show="cartData.data">
				<div class="cart_lists_pre" v-for="(cartGroupItem, cartGroupIndex) in cartData.data.storeCartGroupList"
					:key="cartGroupIndex">
					<!-- 供应商信息 start -->
					<div class="store_info flex_row_start_center" v-if="false">
						<!-- 可选择 -->
						<div class="select">
							<!-- 全部无货，不可选择 -->
							<img src="@/assets/cart/not_sel.png" alt="" class="store_sel" v-if="cartGroupItem.lackAll" />
							<div v-else @click="changeSelectState('store', cartGroupItem.checkedAll, cartGroupItem)"
								style="margin-right: 20px;">
								<myCheckBox :checked="cartGroupItem.checkedAll"></myCheckBox>
							</div>
						</div>
						<router-link target="_blank" :to="`/store/index?vid=${cartGroupItem.storeId}`"
							class="store_des flex_row_start_center cursor_pointer">
							<span>{{ cartGroupItem.storeName }}</span>
							<img src="@/assets/cart/right_down.png" alt="" />
						</router-link>
						<div class="store_kefu" @click="kefu(cartGroupItem)">
							<dynaIcon src="goods/server.png" color="--color_main" width="18" height="18">
							</dynaIcon>
						</div>
						<div v-show="cartGroupItem.hasCoupon" class="store_coupons" :class="{ active: cartGroupItem.showCoupon }">
							<div class="store_coupons_bg" @click="openCouponModel(cartGroupItem.storeId, cartGroupIndex, 'open')">
								<!-- <dynaIcon src="cart_coupons.png" width="82" height="26" color="--color_main" class="img">
								</dynaIcon> -->
								<i class="iconfont iconyouhuiquan21 coupons_bga"></i>
								<i class="iconfont iconziyuan11-copy-copy coupons_jian" v-if="cartGroupItem.showCoupon"></i>
								<i class="iconfont iconziyuan11-copy coupons_jian" v-else></i>
							</div>
							<div v-if="cartGroupItem.showCoupon" class="store_coupons_list">
								<div class="store_coupons_close flex_row_end_center">
									<img src="@/assets/buy/close.png" @click="closeCouponModel(cartGroupIndex)" />
								</div>
								<div class="model_coupon_list">
									<CouponItem v-for="(couponItem, couponIndex) in couponList.data.list" :key="couponIndex"
										:class="sld_coupon_item" coupon_type="small" :coupon_item="couponItem"
										@refreshCouponList="openCouponModel(null, null, 'get')">
									</CouponItem>
								</div>
								<div class="flex_row_end_center sld_pagination sld_paginations sld_page_bottom" v-if="couponList.data.pagination &&
			couponList.data.pagination.total
			">
									<el-pagination @current-change="handleCurrentChangeCoupon" v-model:currentPage="curCouponPage"
										:page-size="couponPageSize" layout="prev, pager, next, jumper"
										:total="couponList.data.pagination.total" :hide-on-single-page="true">
									</el-pagination>
								</div>
								<div class="rotate_circle"></div>
							</div>
						</div>
					</div>

					<!-- 供应商信息 end -->
					<!-- 商品信息 start -->
					<div class="goods_con">

						<!-- 满减活动 start -->
						<div class="full_reduc_activity flex_row_start_center"
							v-if="cartGroupItem.promotionList.length || cartGroupItem.promotionId">
							<div
								v-if="cartGroupItem.promotionDes && cartGroupItem.promotionList && cartGroupItem.promotionList.length > 0">
								<el-popover width="300px" v-model:visible="promotionModelMap[cartGroupItem.storeId]"
									@show="promotionShow(cartGroupItem)">
									<template #reference>
										<div class="flex_row_start_center cursor_pointer">
											<span class="full_reduc_title">{{ L['满减'] }}</span>
											<div class="full_reduc_des overflow_ellipsis"
												:title="replacePromotionText(cartGroupItem.promotionDes)"
												v-html="getPromotionText(cartGroupItem.promotionDes)">
											</div>
											<div class="iconfont iconziyuan11 full_dis_icon"></div>
										</div>
									</template>
									<div class="option_promotion" v-if="promotionIdMap[cartGroupItem.storeId]">
										<el-radio-group v-model="promotionIdMap[cartGroupItem.storeId].goodsPromotionId"
											@change="(e) => changePromotion(e, cartGroupItem)" text-color="#333333" fill="#FF0000">
											<el-radio v-for="(promotionItem, promotionIndex) in cartGroupItem.promotionList"
												:key="promotionIndex" :label="promotionItem.goodsPromotionId" class="promotion_radio">
												<p v-html="getPromotionText(promotionItem.promotionDes)" class="promotion_text"></p>
											</el-radio>
										</el-radio-group>
										<div class="promotion_btn flex_row_center_center">
											<span @click="selPromotion(cartGroupItem)">{{ L['确定'] }}</span>
										</div>
									</div>
								</el-popover>
							</div>
							<div class="flex_row_start_center" v-else>
								<span class="full_reduc_title">{{ L['满减'] }}</span>
								<div class="full_reduc_des overflow_ellipsis" :title="replacePromotionText(cartGroupItem.promotionDes)"
									v-html="getPromotionText(cartGroupItem.promotionDes)"></div>
							</div>
						</div>
						<!-- 满减活动 end -->

						<!-- 商品列表 start -->
						<div class="goods_list">
							<CartItem :cartItem="storeGoodsItem"
								v-for="(storeGoodsItem, storeGoodsIndex) in cartGroupItem.storeGoodsList" :key="storeGoodsIndex"
								@selectState="changeSelectState" @editNum="editNumRequest" @delCartGoods="delCartGoods"
								@moveCartGoods="moveCartGoods">
							</CartItem>
						</div>
						<!-- 商品列表 end -->
					</div>
					<!-- 商品信息 end -->
				</div>
				<!-- 失效商品 start -->
				<div v-if="cartData.data.invalidList && cartData.data.invalidList.length > 0">
					<InvalidCart :invalidList="cartData.data.invalidList"></InvalidCart>
				</div>
				<!-- 失效商品 -->
			</div>
			<!-- 进货单列表 end -->

			<!-- 操作按钮 start -->
			<div class="options_btn flex_row_between_center" ref="optionsBtn">
				<div class="options_btn_left flex_row_start_center">
					<div class="options_sel flex_row_start_center" v-if="cartData.data.storeCartGroupList.length > 0"
						@click="changeSelectState('all', cartData.data.checkedAll)">
						<myCheckBox :checked="cartData.data.checkedAll"></myCheckBox>
						<span class="sel_text">{{ L['全选'] }}</span>
					</div>
					<div class="del_all cursor_pointer" @click="delBatchGoods" v-if="cartData.data.storeCartGroupList.length > 0">
						{{ L['删除选中的商品'] }}
					</div>

				</div>
				<div class="options_right flex_row_start_center">
					<div class="options_sel_num">
						{{ L['已选商品'] }}<span>{{ cartData.data.totalCheck }}</span>{{ L['件'] }}
					</div>
					<div class="options_line"></div>
					<div class="options_sel_price flex_row_start_center">
						<div class="options_all_count flex_column_start_end">
							<span>{{ L['合计'] }}：</span>
							<span v-if="cartData.data.totalDiscount">{{ L['促销减'] }}：</span>
						</div>
						<div class="options_promotion flex_column_start_end">
							<span>R${{ $formatMoneyNum(cartData.data.totalAmount) }}</span>
							<span v-if="cartData.data.totalDiscount">R${{ $formatMoneyNum(cartData.data.totalDiscount) }}</span>
						</div>
					</div>
					<div class="go_buy cursor_pointer" :class="{ active: cartData.data.totalAmount > 0 }" @click="goBuy">
						{{ L['去结算'] }}
					</div>
				</div>
			</div>
			<!-- 操作按钮 end -->
		</div>
		<div class="cart_content_no flex_column_center_center" v-show="!cartData.data ||
			JSON.stringify(cartData.data) == '{}' ||
			(cartData.data &&
				cartData.data.invalidList &&
				cartData.data.invalidList.length == 0 &&
				cartData.data.storeCartGroupList &&
				cartData.data.storeCartGroupList.length == 0)
			">
			<img src="@/assets/cart/no_data.png" alt="" />
			<p>{{ L['这里空空如也，快去首页逛逛吧~'] }}</p>
			<span @click="goIndex">{{ L['去首页 > >'] }}</span>
		</div>



		<!-- 清空失效商品 弹框 start -->
		<el-dialog title="提示" v-model="clearInvalidGoodsModel" width="20%" center top="30vh">
			<div style="margin:0 auto; text-align: center">
				{{ L['确定清空失效商品？'] }}
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelClearInvalidModel">{{
			L['取 消']
		}}</el-button>
					<el-button type="primary" @click="confirmClearInvalidModel">{{
			L['确 定']
		}}</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 清空失效商品 弹框 end -->

		<!-- 删除所选商品 弹框 start -->
		<el-dialog title="提示" v-model="chosenGoodsModel" width="20%" center top="30vh">
			<div style="margin:0 auto; text-align: center">
				{{ L['确定删除选中商品？'] }}
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="chosenGoodsModel = false">{{
			L['取 消']
		}}</el-button>
					<el-button type="primary" @click="delCartGoods('batch')">{{
			L['确 定']
		}}</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 删除所选商品 弹框 end -->

		<!-- 优惠券弹框 start -->
		<el-dialog v-model="couponModel" title="优惠券" width="832px">
			<div class="coupon_model">
				<div class="model_coupon_list">
					<CouponItem v-for="(couponItem, couponIndex) in couponList.data.list" :key="couponIndex"
						:coupon_item="couponItem" :class="sld_coupon_item" @refreshCouponList="openCouponModel(null, null, 'get')">
					</CouponItem>
				</div>
				<div class="flex_row_end_center sld_pagination sld_paginations sld_page_bottom"
					v-if="couponList.data.pagination && couponList.data.pagination.total">
					<el-pagination @current-change="handleCurrentChangeCoupon" v-model:currentPage="curCouponPage"
						:page-size="couponPageSize" layout="prev, pager, next, jumper" :total="couponList.data.pagination.total"
						:hide-on-single-page="true">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
		<!-- 优惠券弹框 end -->

		<!-- 底部操作悬浮框 start -->
		<div class="bottom_options" v-if="optionsBtnShow">
			<div class="bottom_options_con flex_row_between_center">
				<div class="options_btn_left flex_row_start_center">
					<div class="options_sel flex_row_start_center" @click="changeSelectState('all', cartData.data.checkedAll)">
						<dynaIcon src="cart/sel.png" width="15" height="14" color="--color_main" v-if="cartData.data.checkedAll"
							style="cursor: pointer;"></dynaIcon>
						<img src="@/assets/cart/not_sel.png" alt="" class="store_sel" v-else />
						<span>{{ L['全选'] }}</span>
					</div>
					<div class="del_all cursor_pointer" @click="delBatchGoods">
						{{ L['删除选中的商品'] }}
					</div>

				</div>
				<div class="options_right flex_row_start_center">
					<div class="options_sel_num">
						{{ L['已选商品'] }}<span>{{ cartData.data.totalCheck }}</span>{{ L['件'] }}
					</div>
					<div class="options_line"></div>
					<div class="options_sel_price flex_row_start_center">
						<div class="options_all_count flex_column_start_end">
							<span>{{ L['合计'] }}：</span>
							<span v-if="cartData.data.totalDiscount">{{ L['促销减'] }}：</span>
						</div>
						<div class="options_promotion flex_column_start_end">
							<span>R${{ $formatMoneyNum(cartData.data.totalAmount) }}</span>
							<span v-if="cartData.data.totalDiscount">R${{ $formatMoneyNum(cartData.data.totalDiscount) }}</span>
						</div>
					</div>
					<div class="go_buy cursor_pointer" :class="{ active: cartData.data.totalAmount > 0 }" @click="goBuy">
						{{ L['去结算'] }}
					</div>
				</div>
			</div>
		</div>
		<!-- 底部操作悬浮框 end -->


		<!-- 商品无货缺货弹窗 start -->
		<DisabledProductModal v-model:show="dpModalShow" :goodsList="disabled_good_info.productList"
			:state="disabled_good_info.state" :title="dpModalTitle" mode="cart">
			<template #footer>
				<el-button type="primary" @click="clearDisalbedGoods"
					v-if="disabled_good_info.state == 6 || disabled_good_info.state == 2 || disabled_good_info.state == 4 || disabled_good_info.state == 1 || disabled_good_info.state == 3">移除商品</el-button>
			</template>
		</DisabledProductModal>
		<!-- 商品无货缺货弹窗 end -->

	</div>
</template>

<script>
import {
	reactive,
	getCurrentInstance,
	ref,
	watchEffect,
	onMounted,
	computed,
} from 'vue'
import {
	ElMessage,
	ElDialog,
	ElButton,
} from 'element-plus'
import { useRouter } from 'vue-router'
import CouponItem from '@/components/CouponItem'
import { useStore } from 'vuex'
import InvalidCart from './components/InvalidCart.vue'
import CartItem from './components/CartItem.vue'
import { useOrderCheck } from '@/utils/hooks'
import { preventMutiClick } from '@/utils/common'
import { DisabledProductModal } from "../buy/components/MiniCompo";

export default {
	name: 'CartIndex',
	components: {
		ElDialog,
		ElButton,
		CouponItem,
		InvalidCart,
		CartItem,
		DisabledProductModal
	},
	setup () {
		const router = useRouter()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const memberInfo = ref(store.state.memberInfo)
		const token = ref(store.state.loginFlag) //登录缓存是否登录
		const cartData = reactive({ data: store.state.cartListData }) //进货单数据信息
		const clearInvalidGoodsModel = ref(false) //清空失效商品对话框是否显示
		const delGoodsCartIds = ref('') //要删除的商品的进货单的id集
		const couponModel = ref(false) //优惠券弹框是否显示
		const couponList = reactive({ data: {} }) //当前供应商优惠券列表数据
		const cartListData = reactive({ data: store.state.cartListData }) //获取vux的store中的进货单数据
		const optionsBtnTop = ref(0) //底部操作按钮R$素的top值
		const windowHeight = ref(0) //屏幕R$素的高度
		const optionsBtnShow = ref(false) //底部操作按钮悬浮框是否显示
		const optionsBtn = ref(null) //获取底部操作按钮R$素
		const curCouponPage = ref(1) //当前为第一页优惠券
		const couponPageSize = ref(6) //优惠券默认一页显示6条数据
		const curStoreId = ref(-1) //当前打开的优惠券弹框的供应商id
		const elementScrollTop = ref(0) //页面滚动高度
		const chosenGoodsModel = ref(false)

		const dpModalShow = ref(false)
		const dpModalTitle = ref('')
		const disabled_good_info = ref({});

		const promotionModelMap = reactive({})
		const promotionIdMap = reactive({})

		

		onMounted(() => {
			scrollHandle()
			window.addEventListener('scroll', scrollHandle) //绑定页面滚动事件
		})
		//页面监听token是否更新
		watchEffect(() => {
			cartData.data = store.state.cartListData
		})

		const scrollHandle = e => {
			if (e) {
				elementScrollTop.value = e.srcElement.scrollingElement.scrollTop
			}
			//实时获取屏幕的高度
			windowHeight.value = document.documentElement.clientHeight

			if (optionsBtn.value != null && optionsBtn.value != undefined) {
				optionsBtnTop.value = optionsBtn.value.offsetTop
				if (optionsBtnTop.value > windowHeight.value) {
					optionsBtnShow.value = true
				} else {
					optionsBtnShow.value = false
				}
				if (elementScrollTop.value + windowHeight.value > optionsBtnTop.value) {
					optionsBtnShow.value = false
				} else {
					optionsBtnShow.value = true
				}
			}
		}

		//更新本地缓存进货单数据
		const updateLocCartData = cartData => {
			//将进货单数据更新到vuex中的store中
			store.commit('updateCartListData', cartData)
		}

		//获取进货单数据
		const getCartData = () => {
			if (store.state.loginFlag) {
				//已登录
				let params = {}
				proxy
					.$get('v3/supplier/channel/cart/cartList', params)
					.then(res => {
						if (res.state == 200) {
							if (
								res.data.storeCartGroupList &&
								res.data.storeCartGroupList.length
							) {
								res.data.storeCartGroupList.map(item => {
									item.showCoupon = false
								})
							}
							cartData.data = proxy.$calculateSubtotal(res.data)
							initialCartPromotion()
						} else {
							ElMessage.error(res.msg)
						}
					})
					.then(() => {
						store.commit('updateCartListData', cartData.data) //将进货单数据存储到vuex的store中
					})
			}
			updateLocCartData(cartData.data)
		}
		getCartData()


		const initialCartPromotion = () => {
			let { storeCartGroupList } = cartData.data
			for (let store of storeCartGroupList) {
				let target = store.promotionList.find(i => i.promotionId == store.promotionId && i.promotionType == store.promotionType)
				if (!target) return

				Reflect.set(promotionIdMap, store.storeId, {
					promotionDesc: target.promotionDes,
					promotionType: target.promotionType,
					promotionId: target.promotionId,
					goodsPromotionId: target.goodsPromotionId,
				})
			}
		}

		/**编辑进货单商品数量
		 * type:编辑类型 reduce：减  edit：编辑 add：加
		 * curCartItem：编辑的当前项商品
		 * e:事件对象
		 */



		const editNumRequest = (curCartItem, curNumber) => {
			if (store.state.loginFlag) {
				//已登录
				let params = {
					cartId: curCartItem.cartId, //商品进货单id
					number: curNumber //修改后商品数量
				}

				proxy.$post('v3/supplier/channel/cart/changeNum', params).then(res => {
					if (res.state == 200) {
						cartData.data = proxy.$calculateSubtotal(res.data)
						curCartItem.promotionModel = false
						updateLocCartData(cartData.data)
					} else {
						ElMessage.error(res.msg)
					}
				})
			}
		}


		/**选中状态的更改
		 * type ： goods:商品， store :供应商 all,全部（全选或者全不选）
		 * isCheckedState：商品：当前商品的选中状态 供应商:供应商的选中状态
		 * curCartStoreGoodsId：商品：当前商品进货单信息 供应商：storeId
		 */
		const changeSelectState = (type, isCheckedState, curCartStoreGoodsId) => {
			//已登录
			let cartIds = ""; //商品的进货单id集
			if (type == 'spec') {
				cartIds = curCartStoreGoodsId.cartId
			} else if (type == "goods") {
				//选择商品
				let { goodsCartList } = curCartStoreGoodsId
				cartIds = goodsCartList.map(i => i.cartId).join(',')
			} else if (type == "store") {
				//选择供应商
				let { storeGoodsList } = curCartStoreGoodsId
				cartIds = storeGoodsList.map(i => i.goodsCartList).flat(1).map(s => (s.productState != 3 && s.productStock > 0) ? s.cartId : '').filter(o => o).join(',')
			} else if (type == "all") {
				//全选或全不选
				let checkArr = []
				let { storeCartGroupList } = cartData.data
				storeCartGroupList.map((storeItem) => {
					storeItem.storeGoodsList.map((cartItem) => {
						cartItem.goodsCartList.forEach(item => {
							if (item.productState != 3 && item.productStock > 0) {
								checkArr.push(item.cartId)
							}
						})
					});
				})
				cartIds = checkArr.join(',')
			}
			let params = {
				cartIds: cartIds, //进货单id集合
				checked: isCheckedState ? 0 : 1, //是否选中：0=全不选、1=全选中
			};
			proxy.$post('v3/supplier/channel/cart/checkedCarts', params).then(res => {
				if (res.state == 200) {
					cartData.data = proxy.$calculateSubtotal(res.data)
					updateLocCartData(cartData.data)
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		//移入收藏夹 cartId: 商品进货单id集(当前商品进货单id)
		const moveCartGoods = cartId => {
			let params = {
				cartIds: cartId
			}
			proxy
				.$post('v3/supplier/channel/cart/moveToCollection', params)
				.then(res => {
					if (res.state == 200) {
						cartData.data = res.data
						cartData.data = proxy.$calculateSubtotal(cartData.data)
						ElMessage.success(L['移入收藏夹成功！'])
						store.commit('updateCartListData', cartData.data)
					} else {
						ElMessage.error(res.msg)
					}
				})
		}

		//删除商品 type:'goods'单个商品 curCartItem: 当前商品信息    batch:批量
		const delCartGoods = (type, curCartItem) => {
			//已登录
			if (type == "goods") {
				delGoodsCartIds.value = curCartItem.cartId;
			} else if (type == "batch") {
				let delGoodsList = []
				cartData.data.storeCartGroupList.map((storeItem) => {
					storeItem.storeGoodsList.map((cartItem) => {
						let checkList = cartItem.goodsCartList.filter(i => i.isChecked).map(i => i.cartId)
						delGoodsList = delGoodsList.concat(checkList)
					});
				});
				delGoodsCartIds.value = delGoodsList.join(',')
			}
			chosenGoodsModel.value = false
			confirmDelGoodsModel()
		}

		//确定删除商品
		const confirmDelGoodsModel = () => {
			// 已登录
			let params = {
				cartIds: delGoodsCartIds.value
			}
			proxy.$post('v3/supplier/channel/cart/deleteCarts', params).then(res => {
				if (res.state == 200) {
					cartData.data = res.data
					ElMessage.success(L['删除成功！'])
					delGoodsCartIds.value = ""
					updateLocCartData(cartData.data)
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		//打开清空失效商品弹框
		const clearInvalidGoods = () => {
			clearInvalidGoodsModel.value = true
		}
		//确定清空失效商品
		const confirmClearInvalidModel = () => {
			let params = {}
			proxy.$post('v3/supplier/channel/cart/emptyInvalid', params).then(res => {
				if (res.state == 200) {
					cartData.data.invalidList = []
					ElMessage.success(L['清空失效商品成功！'])
				} else {
					ElMessage.error(res.msg)
				}
			})
			clearInvalidGoodsModel.value = false
		}

		//取消清空失效商品
		const cancelClearInvalidModel = () => {
			clearInvalidGoodsModel.value = false
		}

		//去商品详情页
		const goGoodsDetail = productId => {
			proxy.$goGoodsDetail(productId)
		}

		//去结算
		const { setCheckInfo, orderCheck } = useOrderCheck()
		const goBuy = preventMutiClick((continueExec) => {
			if (cartData.data.totalCheck > 0) {
				let flag = false;
				let name = '';
				let num = '';
				cartData.data.storeCartGroupList.map(item => {
					item.storeGoodsList.map(items => {
						items.goodsCartList.forEach(item2 => {
							if (item2.isChecked == 1 && item2.buyNum < item2.minBuyNum && !name) {
								flag = true;
								name = items.goodsName;
								num = items.minBuyNum;
							}
						})
					})
				})
				if (flag) {
					ElMessage.warning(L['商品：'] + name + L['起订量为'] + num);
					continueExec()
					return;
				}
				let query = {
					ifcart: true,
				}
				setCheckInfo({ isCart: true })
				orderCheck().then(res => {
					if (res.state == 267) {
						continueExec()
						let { state, stateValue } = res.data
						let stateset = [4, 3, 2, 1, 6]
						if (stateset.includes(state)) {
							dpModalShow.value = true
							dpModalTitle.value = stateValue
							disabled_good_info.value = res.data
						} else if (state == 7 || state == 5) {
							proxy.$confirm(`${res.data.stateValue}，请刷新`, L['提示'], {
								confirmButtonText: L['刷新'],
								showCancelButton: false,
								type: 'warning',
								confirmButtonClass: 'messageBox_custom_button_confirm',
								cancelButtonClass: 'messageBox_custom_button_cancel',
							}).then(() => {
								history.go(0)
							})
						} else {
							ElMessage.warning(res.data.stateValue)
						}
					} else if (res.state == 200) {
						router.push({ path: "/buy/confirm", query });
					} else {
						continueExec()
						ElMessage(res.msg)
					}
				})

			} else {
				ElMessage(L['结算商品不能为空！']);
			}
		})


		//修改选择促销活动 e:v-model的值，cartItem,当前项商品
		const changePromotion = (e, cartGroupItem) => {
			let target = cartGroupItem.promotionList.find(i => i.goodsPromotionId == e)
			Reflect.set(promotionIdMap, cartGroupItem.storeId, {
				promotionDes: target.promotionDes,
				promotionType: target.promotionType,
				promotionId: target.promotionId,
				goodsPromotionId: target.goodsPromotionId,
			})
		}

		//确定选择促销活动
		const selPromotion = (cartGroupItem) => {
			let target = promotionIdMap[cartGroupItem.storeId]
			let params = {
				storeId: cartGroupItem.storeId,
				promotionDesc: target.promotionDes,
				promotionId: target.promotionId,
				promotionType: target.promotionType
			}
			proxy.$post('v3/supplier/channel/cart/changePromotion', params).then(res => {
				if (res.state == 200) {
					cartData.data = proxy.$calculateSubtotal(res.data);
					Reflect.set(promotionModelMap, cartGroupItem.storeId, false)
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		const replacePromotionText = (title) => {
			return title?.replace(/<|>/g, '')
		}


		const getPromotionText = (value) => {
			if (!value) return ''

			let formatValue = value.replace(/<(.+?)>/g, (numText) => {
				let num = numText.replace(/<|>/g, '')
				return "<span style='color:var(--color_main)'>" + (isNaN(Number(num)) ? 0 : num) + "</span>"
			})
			return formatValue
		}

		const promotionShow = (cartGroupItem) => {
			Reflect.set(promotionModelMap, cartGroupItem.storeId, true)
		}

		//去首页
		const goIndex = () => {
			router.push({ path: '/index' })
		}

		//打开优惠券弹框
		const openCouponModel = (storeId, index, type) => {
			switch (type) {
				case 'open': {
					curStoreId.value = storeId ? storeId : curStoreId.value

					if (cartData.data.storeCartGroupList[index].showCoupon) {
						cartData.data.storeCartGroupList[index].showCoupon = false
						curStoreId.value = -1
					} else {
						//获取优惠券
						let params = {
							storeId: curStoreId.value,
							current: curCouponPage.value,
							pageSize: couponPageSize.value
						}
						proxy
							.$get('v3/supplier/channel/coupon/storeCouponList', params)
							.then(res => {
								if (res.state == 200) {
									couponList.data = res.data
								}
							})
						cartData.data.storeCartGroupList[index].showCoupon = true
					}
					break
				}

				case 'get': {
					//获取优惠券
					let params = {
						storeId: curStoreId.value,
						current: curCouponPage.value,
						pageSize: couponPageSize.value
					}
					proxy
						.$get('v3/supplier/channel/coupon/storeCouponList', params)
						.then(res => {
							if (res.state == 200) {
								couponList.data = res.data
							}
						})
				}
			}
		}
		//关闭优惠券弹窗
		const closeCouponModel = index => {
			cartData.data.storeCartGroupList[index].showCoupon = false
		}
		//上一页优惠券
		const handlePrevCilickChangeCoupon = () => {
			curCouponPage.value--
			openCouponModel(null, null, 'get')
		}
		//下一页优惠券
		const handleNextCilickChangeCoupon = () => {
			curCouponPage.value++
			openCouponModel(null, null, 'get')
		}
		//当前页数优惠券
		const handleCurrentChangeCoupon = () => {
			openCouponModel(null, null, 'get')
		}

		const delBatchGoods = () => {
			let { totalCheck } = cartData.data
			if (totalCheck == 0) {
				ElMessage.warning(L['请选择要删除的商品'])
			} else {
				chosenGoodsModel.value = true
			}
		}

		const kefu = cartGroupItem => {
			if (store.state.loginFlag) {
				let chatInfo = {
					storeId: cartGroupItem.storeId,
					vendorAvatar: cartGroupItem.storeLogo,
					storeName: cartGroupItem.storeName,
					source: '从进货单页进入',
					sourceType: 'cart',
					showData: {}
				}
				store.commit('saveChatBaseInfo', chatInfo)

				let newWin = router.resolve({
					path: '/service',
					query: {
						vid: cartGroupItem.storeId
					}
				})

				window.open(newWin.href, '_blank')
			}
		}

		const handleKey = e => {
			if (e.keyCode == 100) {
				return false;
			}
		}

		const refreshInfo = () => {
			history.go(0)
		}

		//暴露的变量及方法
		return {
			changePromotion,
			promotionIdMap,
			promotionModelMap,
			dpModalShow,
			dpModalTitle,
			disabled_good_info,
			promotionShow,
			replacePromotionText,
			editNumRequest,
			getPromotionText,
			refreshInfo,
			handleKey,
			L,
			token,
			cartData,
			clearInvalidGoods,
			clearInvalidGoodsModel,
			confirmClearInvalidModel,
			cancelClearInvalidModel,
			changeSelectState,
			confirmDelGoodsModel,
			moveCartGoods,
			delCartGoods,
			delGoodsCartIds,
			goGoodsDetail,
			goBuy,
			selPromotion,
			goIndex,
			couponModel,
			openCouponModel,
			closeCouponModel,
			couponList,
			cartListData,
			optionsBtn,
			optionsBtnTop,
			windowHeight,
			optionsBtnShow,
			curCouponPage,
			couponPageSize,
			handlePrevCilickChangeCoupon,
			handleNextCilickChangeCoupon,
			handleCurrentChangeCoupon,
			curStoreId,
			elementScrollTop,
			delBatchGoods,
			chosenGoodsModel,
			kefu,
			memberInfo,
		}
	}
}
</script>

<style lang="scss">
@import '../../style/base.scss';
@import '../../style/cartIndex.scss';


.markfied {
	font-style: normal;
	color: var(--color_main);
}



.sld_paginations .el-pager li.active {
	color: var(--color_coupon_main) !important;
}

.sld_paginations .el-pager li:hover {
	color: var(--color_coupon_main) !important;
}

.sld_paginations .el-input__inner:focus {
	border-color: var(--color_coupon_main);
}

.sld_paginations .el-pagination .btn-prev:hover {
	color: var(--color_coupon_main) !important;
}

.sld_paginations .el-pagination .btn-next:hover {
	color: var(--color_coupon_main) !important;
}

.full_reduc_activity {
	width: 1200px;
	height: 40px;
	border-bottom: 1px solid #dedede;
	padding-left: 20px;

	.full_reduc_title {
		width: 46px;
		height: 24px;
		background: var(--color_main_bg);
		border-radius: 3px;
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: bold;
		color: #ffffff;
		text-align: center;
		line-height: 24px;
		border-radius: 11px;
	}

	.full_reduc_des {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
		margin: 0 16px;
		margin-right: 12px;
		max-width: 400px;
	}

	.go_collect_bill {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #1a86ff;
	}

	.full_dis_icon {
		color: var(--color_main);
		font-size: 12px;
	}
}

.option_promotion {
	.el-radio {
		margin-bottom: 15px;
		white-space: unset;
		vertical-align: top;
		margin-right: 20px;
	}

	.el-radio__label {
		width: 240px;

		display: inline-block;
		word-break: break-all;
		vertical-align: top;
	}

	.el-radio__input.is-checked .el-radio__inner {
		border-color: var(--color_main);
		background: var(--color_main);
	}

	.el-radio__input.is-checked+.el-radio__label {
		color: var(--color_main);
	}

	.promotion_text {
		line-height: 20px;
	}

	.promotion_btn {
		span {
			width: 40px;
			height: 20px;
			background: var(--color_main_bg);
			border-radius: 3px;
			font-size: 12px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #ffffff;
			display: inline-block;
			text-align: center;
			line-height: 20px;
			font-weight: 600;
			cursor: pointer;

			&:nth-child(2) {
				margin-left: 40px;
				background: #ffffff;
				color: var(--color_main);
			}
		}
	}

	.el-overlay {
		background-color: rgba(0, 0, 0, 0.3);
	}
}


.el-radio {
	margin-bottom: 15px;
	white-space: unset;
	vertical-align: top;
	margin-right: 20px;
}

.el-radio__label {
	width: 240px;
	display: inline-block;
	word-break: break-all;
	vertical-align: top;
}

.el-radio__input.is-checked .el-radio__inner {
	border-color: var(--color_price);
	background: var(--color_price);
}

.el-radio__input.is-checked+.el-radio__label {
	color: var(--color_price);
}

.promotion_btn {
	span {
		width: 40px;
		height: 20px;
		background: var(--color_main);
		border-radius: 3px;
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #ffffff;
		display: inline-block;
		text-align: center;
		line-height: 20px;
		font-weight: 600;
		cursor: pointer;

		&:nth-child(2) {
			margin-left: 40px;
			background: #ffffff;
			color: var(--color_main);
		}
	}
}


.promotion_text {
	line-height: 20px;
}
</style>
