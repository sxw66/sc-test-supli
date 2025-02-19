<!--
 * @Author: wangwei
 * @Date: 2020-12-28 16:06:28
 * @LastEditTime: 2024-09-20 14:58:21
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: 订单详情
 * @FilePath: /java-pc/src/views/member/order/List.vue
-->
<template>
	<div class="sld_order_detail">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" style="line-height: 40px;font-size: 13px;">
			<el-breadcrumb-item :to="{ path: '/index' }">{{
				L['首页']
			}}</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/member/index' }">{{
				L['个人中心']
			}}</el-breadcrumb-item>
			<el-breadcrumb-item>{{ L['订单详情'] }}</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="container">
			<div class="top_info flex_row_start_center">
				<div class="top_info_state flex_column_center_center">
					<p class="state">{{ orderStateValue }}</p>
					<p v-if="(order_info.data.orderState == 0 &&
				order_info.data.payState == 0) ||
				(order_info.data.orderState == 0 && order_info.data.payState == 1)" class="refuse_reason">
						{{ order_info.data.refuseReason }}
					</p>

					<p class="refuse_reason" v-if="order_info.data.orderType == 103 &&
				order_info.data.orderSubState == 102 &&
				!(order_info.data.presellInfo && order_info.data.presellInfo.isStartRemainPay)">
						{{ order_info.data.presellInfo.remainStartTime }}{{ L['开始付尾款'] }}
					</p>


					<template v-if="order_info.data.orderState == 30">
						<div class="oprate_btn pointer" @click="confirmReceipt(order_info.data.orderSn)">
							{{ L['确认收货'] }}
						</div>
					</template>


					<template v-if="order_info.data.orderState == 10">
						<div v-if="!(
				(order_info.data.orderType == 105 &&
					order_info.data.orderSubState == 102 &&
					order_info.data.ladderGroupDetailInfo.depositRemainTime >
					0) ||
				(order_info.data.orderType == 103 &&
					order_info.data.orderSubState == 102 &&
					order_info.data.presellInfo.remainEndTime > 0)
			) ||
				(order_info.data.presellInfo &&
					order_info.data.presellInfo.isStartRemainPay)
				">
							<div v-if="order_info.data.orderState == 10" class="oprate_btn pointer"
								@click="goPay(order_info.data.paySn)">
								{{ L['立即支付'] }}
							</div>
						</div>
					</template>
					<div v-if="order_info.data.orderState == 40 &&
				order_info.data.evaluateState != 3
				" class="oprate_btn pointer" @click="remainEvaluated(order_info.data.orderSn)">
						{{ L['评价'] }}
					</div>
					<p class="cancel flex_row_center_center" v-if="afsState">
						<span class="pointer" v-if="order_info.data.orderState == 10"
							@click="showSelectReasonDialog(order_info.data.parentSn)">{{ L['取消订单'] }}</span>
						<span class="pointer"
							v-if="order_info.data.orderState == 10 && order_info.data.isVirtualGoods == 1"
							@click="editAddress(order_info.data)">{{ L['修改地址'] }}</span>
						<span class="pointer"
							v-if="order_info.data.orderState == 0 || (order_info.data.orderState == 40 && order_info.data.evaluateState == 3)"
							@click="delOrder(order_info.data.orderSn)">{{ L['删除订单'] }}</span>
					</p>
				</div>

				<OrderProcess :orderInfo="order_info.data" :orderLogs="order_info.data.orderLogList" />
			</div>

			<div class="order_info">
				<div>
					<p>{{ L['订单信息'] }}</p>
					<div class="order_info_item flex">
						<div>
							<span>{{ L['订单号'] }}：</span>
							{{ order_info.data.orderSn }}
						</div>
						<div v-if="order_info.data.invoice">
							<span>{{ L['发票内容'] }}：</span>
							{{ invoiceContent[order_info.data.invoice.invoiceContent] }}
						</div>

					</div>
					<div class="order_info_item flex">
						<div>
							<span>{{ L['下单时间'] }}：</span>
							{{ order_info.data.createTime }}
						</div>



						<div v-if="order_info.data.invoice">
							<span>{{ L['发票抬头'] }}：</span>
							{{ order_info.data.invoice.invoiceTitle }}
						</div>
					</div>

					<div class="order_info_item flex"
						v-if="order_info.data.orderState >= 30 && order_info.data.deliverMethod == 2">
						<div>
							<span>{{ L['备货时间'] }}：</span>
							{{ order_info.data.deliverTime }}
						</div>
					</div>


					<div class="order_info_item" v-if="order_info.data.isVirtualGoods == 1">
						<div class="overflow_ellipsis_two"
							:title="order_info.data.receiverAreaInfo + order_info.data.receiverAddress">
							<span>{{ L['收货地址'] }}：</span>
							{{ order_info.data.receiverAreaInfo }}
							{{ order_info.data.receiverAddress }}
						</div>
					</div>
					<div class="order_info_item" v-if="order_info.data.isVirtualGoods == 1">
						<div>
							<span>{{ L['收货人信息'] }}：</span>
							{{ order_info.data.receiverName }}
							{{ order_info.data.receiverMobile }}
						</div>
					</div>

					<div class="order_info_item" v-if="order_info.data.tradeSn">
						<div>
							<span>{{ L['交易流水号'] }}：</span>
							{{ order_info.data.tradeSn }}
						</div>
					</div>
					<div v-if="order_info.data.isVirtualGoods == 2 && order_info.data.orderReserveList.length">
						<template v-for="(item, index) in order_info.data.orderReserveList" :key="index">
							<div v-show="item.reserveValue" class="order_info_item">
								<div>
									<span>{{ item.reserveName }}：</span>
									{{ item.reserveValue }}
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>


			<div class="order_mark" v-if="order_info.data.orderState == 0">
				<p>
					{{ L['订单取消备注'] }}
				</p>
				<div class="order_mark_item">
					<span>{{ order_info.data.refuseRemark ? order_info.data.refuseRemark : '--' }}</span>
				</div>
			</div>

			<div id="logistics">
				<!-- 物流信息 start -->
				<div v-if="order_info.data.orderDeliver || order_info.data.orderDeliverList" style="padding: 1px;">
					<div class="sld_deliver_title">物流信息</div>
					<!-- 齐套发货 -->
					<!-- 订单状态为待收货或者已完成而且只有一个包裹的一定是齐套发货，否则就是分批发货 -->
					<template
						v-if="(order_info.data.orderState == 30 || order_info.data.orderState == 40) && order_info.data.orderDeliverList.length == 1">
						<div class="sld_deliver_box">
							<div class="logistics_info_name">
								<p v-if="logistics_info.data.type == 1">
									<span>物流方式：</span>
									<span>自行配送</span>
								</p>
								<p>
									<span>{{ logistics_info.data.type == 1 ? L['联系人'] : L['承运人'] }}：</span>
									<span>{{ logistics_info.data.expressName }}</span>
								</p>
								<p>
									<span>{{ logistics_info.data.type == 1 ? L['联系电话'] : L['运单号'] }}：</span>
									<span>{{ logistics_info.data.expressNumber }}</span>
								</p>
							</div>
							<div class="logistics_list_con"
								v-if="logistics_info.data.routeList && logistics_info.data.routeList.length > 0">
								<el-timeline>
									<el-timeline-item v-for="(logistics, index) in logistics_info.data.routeList"
										:key="index" :timestamp="logistics.dtHrCriado">{{ logistics.unidade.endereco.cidade +' '+logistics.unidade.endereco.uf +' '+ (logistics.unidade.endereco.bairro ? logistics.unidade.endereco.bairro : '') +' '+ (logistics.unidade.endereco.numero ? logistics.unidade.endereco.numero : '')
										}}</el-timeline-item>
								</el-timeline>
							</div>
							<SldCommonEmpty v-else-if="logistics_info.data.type != 1" :tip="logistics_info.data.reason"
								totalWidth="934px" />

						</div>
					</template>
					<!-- 分批发货 -->
					<template v-else>
						<div class="sld_order_nav">
							<div class="sld_order_nav_con flex_row_start_center">
								<div v-for="(item, index) in order_info.data.orderDeliverList" :key="item" class="item"
									:class="{ active: deliverIndex == index }" @click="changeDeliver(index)">
									包裹{{ order_info.data.orderDeliverList.length > 1 ? index + 1 : '' }}</div>
								<div v-if="remainProduct.data.length > 0" class="item" @click="showRemain"
									:class="{ active: deliverIndex == order_info.data.orderDeliverList.length }">
									待发货</div>
							</div>
						</div>
						<div class="sld_deliver_box">
							<div class="section3">
								<span class="word1">商品详情</span>
								<span class="word2">单价</span>
								<span class="word3">数量</span>
								<span class="word4">总价</span>
							</div>
							<!-- 已发货数据 -->
							<template v-if="deliverIndex < order_info.data.orderDeliverList.length">
								<template v-if="order_info.data.orderDeliverList[deliverIndex].productInfoList.length > 0">
									<template v-for="item in order_info.data.orderDeliverList[deliverIndex].productInfoList" :key="item">
										<div class="section4 flex-col">
											<div class="mod6 flex-row">
												<div class="mod7 flex-col" @click="goodsDetail(item.productId)">
													<img class="section5 flex-col" :src="item.productImage" />
												</div>
												<div class="mod8 flex-col">
													<span class="infoBox1 overflow_ellipsis_two" @click="goodsDetail(item.productId)"
														:title="(item.goodsName && item.goodsName.length > 56) ? item.goodsName : ''">
														{{ item.goodsName }}</span>
													<span class="word42 overflow_ellipsis_two" @click="goodsDetail(item.productId)"
														:title="(item.goodsSpec && item.goodsSpec.length > 56) ? item.goodsSpec : ''">
														{{ item.goodsSpec }}</span>
												</div>
												<span class="word5">R${{ $formatMoneyNum(item.productPrice) }}</span>
												<span class="word6">{{ item.deliverNum }}</span>
												<span class="word7">R${{ $formatMoneyNum(item.totalAmount) }}</span>
											</div>
										</div>
									</template>
								</template>
								<SldCommonEmpty v-else tip="暂无已发货商品信息" totalWidth="1108px" />
								<template v-if="logistics_info.data.type">
									<div class="logistics_info_name">
										<p v-if="logistics_info.data.type == 1">
											<span>物流方式：</span>
											<span>自行配送</span>
										</p>
										<p>
											<span>{{ logistics_info.data.type == 1 ? L['联系人'] : L['承运人']
												}}：</span>
											<span>{{ logistics_info.data.expressName }}</span>
										</p>
										<p>
											<span>{{ logistics_info.data.type == 1 ? L['联系电话'] : L['运单号']
												}}：</span>
											<span>{{ logistics_info.data.expressNumber }}</span>
										</p>
									</div>
									<div class="logistics_list_con"
										v-if="logistics_info.data.routeList && logistics_info.data.routeList.length > 0">
										<el-timeline>
                                            <el-timeline-item v-for="(logistics, index) in logistics_info.data.routeList"
                                                :key="index" :timestamp="logistics.dtHrCriado">{{ logistics.unidade.endereco.cidade +' '+logistics.unidade.endereco.uf +' '+ (logistics.unidade.endereco.bairro ? logistics.unidade.endereco.bairro : '') +' '+ (logistics.unidade.endereco.numero ? logistics.unidade.endereco.numero : '')
                                                }}</el-timeline-item>
                                        </el-timeline>
									</div>
									<SldCommonEmpty v-else-if="Number(logistics_info.data.type) != 1" :tip="logistics_info.data.reason"
										totalWidth="934px" />
								</template>
							</template>
							<!-- 待发货数据 -->
							<template v-else>
								<template v-for="item in remainProduct.data" :key="item">
									<div class="section4 flex-col">
										<div class="mod6 flex-row">
											<div class="mod7 flex-col" @click="goodsDetail(item.productId)">
												<img class="section5 flex-col" :src="item.productImage" />
											</div>
											<div class="mod8 flex-col">
												<span class="infoBox1 overflow_ellipsis_two" @click="goodsDetail(item.productId)"
													:title="(item.goodsName && item.goodsName.length > 56) ? item.goodsName : ''">
													{{ item.goodsName }}</span>
												<span class="word42 overflow_ellipsis_two" @click="goodsDetail(item.productId)"
													:title="(item.specValues && item.specValues.length > 56) ? item.specValues : ''">
													{{ item.specValues }}</span>
											</div>
											<span class="word5">R${{ $formatMoneyNum(item.productPrice) }}</span>
											<span class="word6">{{ item.deliverNum }}</span>
											<span class="word7">R${{ $formatMoneyNum(item.moneyAmount) }}</span>
										</div>
									</div>
								</template>
							</template>
						</div>
					</template>
				</div>
				<!-- 物流信息 end -->
			</div>


			<div class="shop_info" v-if="order_info.data.childOrderList">
				<p>{{ L['商品信息'] }}</p>
				<section>

					<div v-for="storeItem in order_info.data.childOrderList" :key="storeItem.orderSn">

						<!-- <router-link :to="`/store/index?vid=${storeItem.supplierStoreId}`">
							<div class="flex_row_start_center store_name">
								<span>{{ storeItem.supplierStoreName }}</span>
								<span class="iconfont iconziyuan11"></span>
							</div>
						</router-link> -->


						<OrderStore :storeItem="storeItem" :orderInfo="order_info.data" />
					</div>



				</section>
			</div>
			<div class="settle_info">
				<p>
					{{ L['商品总额'] }}：
					<span>R${{ $formatMoneyNum(order_info.data.totalMoney) }}</span>
				</p>
				<p>
					{{ L['满优惠'] }}：
					<span>{{ L['-R$'] }}{{ $formatMoneyNum(order_info.data.fullDiscountAmount) }}</span>
				</p>
				<p>
					{{ L['运费金额'] }}：
					<span>{{ L['R$'] }}{{ $formatMoneyNum(order_info.data.totalExpress) }}</span>
				</p>
				<p v-if="order_info.data.storeVoucherAmount > 0">
					{{ L['供应商优惠券'] }}：
					<span>{{ L['-R$'] }}{{ $formatMoneyNum(order_info.data.storeVoucherAmount) }}</span>
				</p>
				<p v-if="order_info.data.platformVoucherAmount > 0">
					{{ L['平台优惠券'] }}：
					<span>{{ L['-R$'] }}{{ $formatMoneyNum(order_info.data.platformVoucherAmount) }}</span>
				</p>
				<p v-if="order_info.data.integralCashAmount > 0">
					{{ L['积分抵扣'] }}：
					<span>{{ L['-R$'] }}{{ $formatMoneyNum(order_info.data.integralCashAmount) }}</span>
				</p>
				<p class="total">
					{{ L['实际金额'] }}：
					<span>{{ L['R$'] }}{{ $formatMoneyNum(order_info.data.actualPayment) }}</span>
				</p>
			</div>
		</div>





		<!-- 取消地址理由弹窗 start -->
		<el-dialog :title="L['取消订单理由']" v-model="cancel_order" customClass="select_reason_width" :before-close="handleClose"
			lock-sroll="false">
			<div class="cancel_list_con">
				<div v-for="(reasonItem, index) in cancel_list.data" :key="index" :class="{
				reason_item: true,
				flex_row_between_center: true,
				active: current_reason_id == reasonItem.reasonId
			}" @click="selectReason(reasonItem.reasonId)">
					<span class="reason_text">{{ reasonItem.content }}</span>
					<div style="cursor:pointer">
						<dynaIcon mode="iconfont" :icon="current_reason_id == reasonItem.reasonId ? 'iconduihao1' : 'iconyuanquan1'"
							:color="current_reason_id == reasonItem.reasonId ? '--color_vice' : '#999'" class="img">
						</dynaIcon>
					</div>
				</div>
			</div>
			<div class="confirm_cancel_btn" @click="confirmCancel()">
				{{ L['确定'] }}
			</div>
		</el-dialog>
		<!--  取消地址理由弹窗 end  -->


		<!-- 地址选择弹窗 start -->
		<AdrListModal v-model:visible="show_select_address" mode="order"
			:orderAddress="extraProperty(order_info.data, ['receiverAddress', 'receiverAreaInfo', 'receiverMobile', 'receiverName'])"
			@confirmAddress="confirmChangeAddress" v-if="order_info.data.receiverAddress" />
		<!-- 地址选择弹窗 end -->


	</div>
</template>
<script>
import { reactive, getCurrentInstance, ref, onMounted, nextTick, computed } from 'vue'
import {
	ElMessage,
	ElDialog,
	ElMessageBox,
	ElTimeline,
	ElTimelineItem
} from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import OrderProcess from './components/OrderProcess.vue'
import AdrListModal from '@/components/Address/AddressListModal.vue';
import { extraProperty } from '@/utils/common'
import OrderStore from './components/OrderStore.vue'
export default {
	name: 'order-detail',
	components: {
		ElDialog,
		ElTimeline,
		ElTimelineItem,
		OrderProcess,
		AdrListModal,
		OrderStore,
	},
	setup () {
		const store = useStore()
		const router = useRouter()
		const route = useRoute()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const order_info = reactive({ data: {} })
		const express_empty = require('../../../assets/order/express_empty.png')
		const not_select = require('../../../assets/order/not_select.png')
		const selected = require('../../../assets/order/selected.png')
		const invoice_selected = require('../../../assets/buy/invoice_selected.png')
		const cancel_list = reactive({ data: [] })
		const cancel_order = ref(false) //是否显示取消订单弹窗
		const current_reason_id = ref() //记录当前已选择理由id
		const order_sn = ref('') //记录当前操作的订单号
		const show_select_address = ref(false) //是否显示选择地址弹窗

		const invoiceContent = {
			1: '商品明细',
			2: '商品类别'
		}
		const logistics_info = reactive({
			data: {
				type: '',
				expressName: '',
				expressNumber: '',
				routeList: [],
				reason: ' '
			}
		}) //物流信息
		const configInfo = store.state.configInfo
		const afsState = ref(true)
		const remainProduct = reactive({ data: [] }); //待发货数据
		const deliverIndex = ref(0); //物流信息导航栏下标
		const deliverId = ref(null); //物流id

		const showOperateTab = computed(() => {
			let state = [20, 30, 31, 40]
			return state.includes(order_info.data?.orderState)
		})

		const orderStateValue = computed(() => {
			let { deliverMethod } = order_info.data
			switch (order_info.data.orderState) {
				case 20: {
					return deliverMethod == 2 ? L['等待卖家备货完成'] : order_info.data.orderStateValue
				}
				case 30: {
					return deliverMethod == 2 ? L['等待买家提货'] : order_info.data.orderStateValue
				}
				default: {
					return order_info.data.orderStateValue
				}
			}
		})

		

		const getOrderDetail = () => {
			proxy
				.$post('v3/supplier/channel/orderInfo/detail', {
					orderSn: route.query.orderSn
				})
				.then(res => {
					if (res.state == 200) {
						order_info.data = res.data
						if (order_info.data.orderState >= 30) {
							lookLogistics();
						}
					} else {
						ElMessage(res.msg)
					}
				})

		}

		// 获取订单取消理由列表
		const getCancelList = () => {
			proxy
				.$get('v3/system/common/list', {
					type: 104
				})
				.then(res => {
					if (res.state == 200) {
						cancel_list.data = res.data
					} else {
						ElMessage(res.msg)
					}
				})
		}

		//选择理由
		const selectReason = id => {
			current_reason_id.value = id
		}
		//显示选择理由弹窗
		const showSelectReasonDialog = orderSn => {
			if (
				!order_info.data.isRefundDeposit &&
				(order_info.data.orderType == 105 ||
					order_info.data.orderType == 103) &&
				order_info.data.orderSubState == 102
			) {
				ElMessageBox.confirm(L['取消该订单定金不予退还,确定取消?'], L['提示'], {
					confirmButtonText: L['确定'],
					cancelButtonText: L['取消'],
					type: 'warning'
				}).then(() => {
					cancel_order.value = true
					order_sn.value = orderSn
				})
			} else {
				cancel_order.value = true
				order_sn.value = orderSn
			}
		}

		//确认取消订单
		const confirmCancel = () => {
			if (!current_reason_id.value) {
				ElMessage.warning(L['请选择取消理由'])
				return
			}

			let current_reason_target = cancel_list.data.find(i => i.reasonId == current_reason_id.value)

			proxy
				.$post('v3/supplier/channel/orderOperate/cancel', {
					parentSn: order_sn.value,
					refuseReason: current_reason_target.content
				})
				.then(res => {
					if (res.state == 200) {
						ElMessage.success(L['取消订单成功'])
						cancel_order.value = false
						getOrderDetail()
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		//删除订单
		const delOrder = orderSn => {
			ElMessageBox.confirm(L['确认删除该订单?'], L['提示'], {
				confirmButtonText: L['确定'],
				cancelButtonText: L['取消'],
				type: 'warning'
			}).then(() => {
				proxy
					.$post('v3/supplier/channel/orderOperate/delete', {
						orderSn
					})
					.then(res => {
						if (res.state == 200) {
							ElMessage.success(L['删除订单成功'])
							router.go(-1)
						} else {
							ElMessage(res.msg)
						}
					})
			})
		}
		//确认收货
		const confirmReceipt = orderSn => {
			ElMessageBox.confirm(L['确认收货?'], L['提示'], {
				confirmButtonText: L['确定'],
				cancelButtonText: L['取消'],
				type: 'warning'
			})
				.then(() => {
					proxy
						.$post('v3/supplier/channel/orderOperate/receive', {
							orderSn
						})
						.then(res => {
							if (res.state == 200) {
								ElMessage.success(L['确认收货成功'])
								getOrderDetail()
							} else {
								ElMessage(res.msg)
							}
						})
						.catch(() => {
							//异常处理
						})
				})
				.catch(() => { })
		}
		//选择地址
		const editAddress = () => {
			show_select_address.value = true
		}

		//确认修改地址
		const confirmChangeAddress = (address) => {
			proxy
				.$post('v3/supplier/channel/orderOperate/updateAddress', {
					orderSn: order_info.data.orderSn,
					addressId: address.addressId
				})
				.then(res => {
					if (res.state == 200) {
						ElMessage.success(L['切换地址成功'])
						show_select_address.value = false
						getOrderDetail()
					} else {
						ElMessage(res.msg)
					}
				})
		}
		//显示查看物流信息
		const lookLogistics = () => {
			let param = {}
			if (order_info.data.orderDeliver) {
				param.deliverId = order_info.data.orderDeliver.deliverId
			} else if (order_info.data.orderDeliverList && order_info.data.orderDeliverList.length > 0) {
				param.deliverId = order_info.data.orderDeliverList[deliverIndex.value].deliverId
			} else {
				return;
			}
			// 获取已发货数据
			proxy.$get("v3/supplier/channel/logistics/order/getTrace", param).then(res => {
				if (res.state == 200) {
					if (!res.data.reason) {
						res.data.reason = '暂无详细物流信息';
					}
					logistics_info.data = res.data;
					//如果传过来的路由参数有hash值，一般是该dom元素的id值，让其滚入视图上
					if (route.hash) {
						nextTick(() => {
							document.querySelector(route.hash).scrollIntoView({
								block: "center",
								inline: "nearest",
								behavior: 'smooth'
							})
						})
					}
				} else {
					ElMessage(res.msg);
				}
			})
			if (order_info.data.orderDeliverList && order_info.data.orderDeliverList.length > 0) {
				let params = { orderSn: route.query.orderSn }
				// 获取待发货数据
				proxy.$get("v3/supplier/channel/orderInfo/orderProductList", params).then(res => {
					if (res.state == 200) {
						remainProduct.data = res.data;
					}
				})
			}
		}
		//切换发货方式
		const changeDeliver = (index) => {
			deliverIndex.value = index;
			logistics_info.routeList = [];
			lookLogistics();
		};
		//查看待发货
		const showRemain = () => {
			deliverIndex.value = order_info.data.orderDeliverList.length;
		};
		//评价订单
		const remainEvaluated = orderSn => {
			router.push({
				path: '/member/order/evaluate',
				query: {
					orderSn: orderSn
				}
			})
		}
		//立即支付
		const goPay = orderSn => {
			router.push({
				path: '/buy/pay',
				query: {
					paySn: orderSn,
					payFrom: 2
				}
			})
		}

		const goodsDetail = (productId) => proxy.$goGoodsDetail(productId)

		onMounted(() => {
			getOrderDetail()
			getCancelList()
		})
		return {
			showOperateTab,
			show_select_address,
			extraProperty,
			orderStateValue,
			invoiceContent,
			goodsDetail,
			L,
			order_sn,
			order_info,
			express_empty,
			showSelectReasonDialog,
			cancel_list,
			current_reason_id,
			selectReason,
			cancel_order,
			not_select,
			selected,
			confirmCancel,
			delOrder,
			confirmReceipt,
			editAddress,
			confirmChangeAddress,
			invoice_selected,
			logistics_info,
			remainEvaluated,
			goPay,
			afsState,
			configInfo,
			lookLogistics,
			deliverIndex,
			deliverId,
			changeDeliver,
			remainProduct,
			showRemain,
		}
	}
}
</script>
<style lang="scss">
@import '../../../style/member/orderDetail.scss';
</style>
