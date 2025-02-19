<template>
	<div class="confirm_order_wrap">
		<div class="confirm_order">
			<!-- 收货信息 -->
			<div class="receive_info">
				<div class="top_logo">
					<router-link to="/" replace>
						<div :style="`background-image:url(${configInfo.supplier_main_site_logo})`"></div>
					</router-link>
					<span class="cart">{{ L['购物车'] }}</span>
				</div>
				<!-- 联系 -->
				<div class="contact">
					<div class="receive_info_title">{{ L['联系'] }}</div>
					<div class="notice">{{ L['我们应该向谁交付？'] }}</div> 
					<el-form class="info"
							 :model="contact_info"
							 ref="contact_info_form"
							 :rules="contact_info_rules">
						<el-form-item class="name" prop="receiverName">
							<el-input class="name-input" 
									  :placeholder="L['请输入全名']"
									  maxlength="51"
									  v-model="contact_info.receiverName">
								<template #prepend>{{ L['全名'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="CNPJ" prop="cpfCnpj">
							<el-input class="CNPJ-input" 
									  :placeholder="L['请输入CPF/CNPJ']"
									  maxlength="18"
									  v-model="contact_info.cpfCnpj">
								<template #prepend>CPF/CNPJ</template>
							</el-input>
						</el-form-item>
						<el-form-item class="phone half" prop="receiverMobile">
							<el-input class="phone-input " 
									  :placeholder="L['请输入手机号']"
									  maxlength="11"
									  type="number"
									  v-model="contact_info.receiverMobile">
								<template #prepend>{{ L['手机号'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="email half right" prop="receiverEmail">
							<el-input class="email-input" 
									  :placeholder="L['请输入邮箱']"
									  maxlength="100"
									  v-model="contact_info.receiverEmail">
								<template #prepend>{{ L['邮箱'] }}</template>
							</el-input>
						</el-form-item>
					</el-form>
				</div>
				<!-- 送货地址 -->
				<div class="address">
					<div class="receive_info_title">{{ L['送货地址'] }}</div>
					<div class="notice">{{ L['我们应该在哪里交付订单？'] }}</div> 
					<el-form class="info"
							 :model="address_info"
							 ref="address_info_form"
							 :rules="address_info_rules">
						<el-form-item class="postCode" prop="postalCode">
							<el-input class="postCode-input" 
									  :placeholder="L['请输入邮政编码']"
									  maxlength="8"
									  v-model="address_info.postalCode"
									  @input="handleChangePostCode">
								<template #prepend>{{ L['邮政编码'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="state half">
							<el-input class="state-input" 
									  :placeholder="L['输入邮编自动查询']"
									  disabled
									  v-model="address_info.uf">
								<template #prepend>{{ L['州'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="district half right" >
							<el-input class="district-input " 
									  :placeholder="L['输入邮编自动查询']"
									  disabled
									  v-model="address_info.bairro">
								<template #prepend>{{ L['区'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="street half">
							<el-input class="street-input" 
									  :placeholder="L['输入邮编自动查询']"
									  disabled
									  v-model="address_info.abreviatura">
								<template #prepend>{{ L['街道'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="houseNumber half right" prop="houseNumber">
							<el-input class="houseNumber-input" 
									  :placeholder="L['请输入门牌号']"
									  maxlength="11"
									  v-model="address_info.houseNumber">
								<template #prepend>{{ L['门牌号'] }}</template>
							</el-input>
						</el-form-item>
						<el-form-item class="addtionalInfo"  prop="receiverAddress">
							<el-input class="addtionalInfo-input" 
									  :placeholder="L['其它信息补充']"
									  maxlength="101"
									  v-model="address_info.receiverAddress">
								<template #prepend>{{ L['补充信息'] }}</template>
							</el-input>
						</el-form-item>
					</el-form>
				</div>
				<!-- 付款方式 -->
				<div class="payType">
					<div class="receive_info_title">{{ L['付款方式'] }}</div>
					<div class="notice">{{ L['使用pix付款（不久后会支持信用卡支付）'] }}</div> 
					<el-form class="info">
						<el-form-item class="type">
							<el-radio class="type-radio"
									  v-model="payType"
									  label="1"
									  border
									  >
									  <span class="content-wrap">
										<span class="txt">PIX</span>
										<img :src="pix" alt class="ico">
									  </span>
							</el-radio>
						</el-form-item>
					</el-form>
				</div>
				<!-- 前往付款 -->
				 <el-button class="goPay" @click="submitOrderFn">
					{{ L['前往付款'] }}
				 </el-button>
			</div>
			<!-- 商品信息 -->
			<div class="goodsInfo">
				<!-- 商品 -->
				 <div class="goodList">
					<template v-if="goods_data.data.length">
						<div v-for="item in goods_data.data[0].productList"
							:key="item.productId"
							class="goods" >
							<img :src="item.image" alt class="img">
							<div class="right">
								<div class="title">{{ item.goodsName }}</div>
								<div class="specifications">{{ item.specValues }}</div>
								<div class="line3">
									<span class="number-wrap">
										<span class="symbol">x</span>
										<span class="number">{{ item.buyNum }}</span>
									</span>
									<span class="mutiPrice price-wrap">
										<span class="unit">R$</span>
										<span class="price">{{ $formatMoneyNum(item.price * item.buyNum || 0) }}</span>
									</span>
									<span v-if="item.buyNum > 1"
										class="singlePrice">
										（ {{ L['单价'] }}
										<span class="price-wrap">
											<span class="unit">R$</span>
											<span class="price">{{ $formatMoneyNum(item.price || 0) }}</span>
										</span>
										）
									</span>
								</div>
							</div>
						</div>
					</template>
				 </div>
				<!-- 其它 -->
				<div class="transport baseline">
					<span class="name">{{ L['运输方式'] }}</span>
					<el-select class="type" v-model="selectedExpress" @change="getFeeEstimate">
						<el-option v-for="item in expressList.data" 
								   :key="item.value"
								   :value="item.value"
								   :label="item.content">
						</el-option>
					</el-select>
					<span class="time">{{ feeEstimate.data.storeFeeEstimateList[0].expressValidity }}</span>
					<span class="price-wrap right">
						<span class="unit">R$</span>
						<span class="price">{{ $formatMoneyNum(feeEstimate.data.storeFeeEstimateList[0].totalExpressFee || 0) }}</span>
					</span>
				</div>
				<div class="smallTotal baseline">
					<span class="name">{{ L['小计'] }}</span>
					<span class="price-wrap right">
						<span class="unit">R$</span>
						<span v-if="goods_data.data.length"
								class="price">{{ $formatMoneyNum(feeEstimate.data.totalGoodsFee || 0) }}</span>
						<!-- <span v-if="goods_data.data.length"
								class="price">{{ goods_data.data[0].smallTotal }}</span> -->
					</span>
				</div>
				<div class="totalFreight baseline">
					<div class="line1">
						<span class="name">{{ L['总运费'] }}</span>
						<span class="price-wrap right">
							<span class="origin-totalFreight price-wrap">
								<span class="unit">R$</span>
								<span class="price">{{ $formatMoneyNum(feeEstimate.data.storeFeeEstimateList[0].totalExpressFee || 0) }}</span>
							</span>
							<span class="counted-totalFreight price-wrap">
								<span class="unit">R$</span>
								<span class="price">{{ $formatMoneyNum(feeEstimate.data.totalExpressFee || 0) }}</span>
							</span>
						</span>
					</div>
					<div class="line2">{{ L['根据您购买的商品尺寸/重量、数量预估运费，实际运费以发货包裹为准。'] }}</div>
				</div>
				<div class="discount baseline">
					<span class="name">{{ L['折扣'] }}</span>
					<span class="price-wrap right">
						<span class="unit">R$</span>
						<span class="price">{{ $formatMoneyNum(feeEstimate.data.totalDiscount || 0) }}</span>
						<!-- <span class="price">2000</span> -->
					</span>
				</div>
				<div class="total baseline">
					<span class="name">{{ L['合计'] }}</span>
					<span class="price-wrap right">
						<span class="unit">R$</span>
						<span class="price">{{ $formatMoneyNum(feeEstimate.data.totalAmount || 0) }}</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	reactive,
	getCurrentInstance,
	ref,
	onMounted,
	onUnmounted,
	watch,
	computed,
} from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SldAddressOperation from '../../components/Address/AddressOperation'
import { preventMutiClick } from '@/utils/common'
export default {
	name: 'ConfirmOrder',
	components: {
		SldAddressOperation,
	},
	setup () {
		const route = useRoute()
		const router = useRouter()
		const store = useStore()

		
		const contact_info_form = ref(null) // 表格 - 联系
		const address_info_form = ref(null) // 表格 - 送货地址
		const payType = ref('1') // 支付方式
		const pix = require('../../assets/buy/pix.png') // pix图标

		const contact_info = reactive({  // 地址信息
			receiverName: '', // 全名
			cpfCnpj: '', // CNPJ
			intlAreaCode: '+55', // 国际区号
			receiverMobile: '', // 手机号
			receiverEmail: '', // 邮箱
		})

		const address_info = reactive({ // 地址信息
			postalCode: '', // 邮编
			uf: '', // 州
			bairro: '', // 区
			houseNumber: '', // 门牌号
			receiverAddress: '', // 补充信息
		})

		const { proxy } = getCurrentInstance()

		const L = proxy.$getCurLanguage()

		// 联系校验
		const contact_info_rules = {
			receiverName: [
				{ required: true, message: L['请输入全名'] },
				{ max: 50, message: L['最大允许输入50字符'], trigger: ["change", "blur"] }
			],
			cpfCnpj: [
				{ required: true, message: L['请输入CPF/CNPJ'] },
			],
			receiverMobile: [
				{ required: true, message: L['请输入手机号'] },
			],
			receiverEmail: [
				{ required: true, message: L['请输入邮箱'] },
				{
					pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
					message: L['请输入正确的邮箱'],
					trigger: 'blur'
				}
			],
		}
		
		// 送货地址校验
		const address_info_rules = {
			postalCode: [
				{ required: true, message: L['请输入收货地邮政编码'] },
			],
			houseNumber: [
				{ required: true, message: L['请输入门牌号'] },
				{ max: 10, message: L['最大允许输入10字符'], trigger: ["change", "blur"] }
			],
			receiverAddress: [
				{ max: 100, message: L['最大允许输入100字符'], trigger: ["change", "blur"] }
			],
		}

		const expressList = reactive({ data: [] }) // 物流列表
		const selectedExpress = ref('') // 所选物流
		const storeTotalGoodsFee = ref('') // 店铺运费
		const totalGoodsFee = ref('') // 总运费（折扣前）
		const feeEstimate = reactive({ data: { // 订单费用
			storeFeeEstimateList: [
				{ totalExpressFee: '0.00' }
			]
		} })

		const addressVisibleFlag = ref(false)
		const not_select = require('../../assets/buy/not_select.png')
		const selected = require('../../assets/buy/selected.png')
		const invoice_selected = require('../../assets/buy/invoice_selected.png')
		const memberInfo = ref(store.state.memberInfo);
		const couponCode = ref([])
		const navlist = reactive({ data: [] })
		const show_change_address = ref(false)
		const edit_voice_dialog = ref(false)
		const add_voice_content = ref(false)
		const out_stock_dialog = ref(false)
		const exhibition_show = ref(false) //地址展开收起
		const type = ref('add')
		const timer = ref(0) //定时器
		const no_good_info = reactive({ data: {} })
		const show_select_address = ref(false)
		const pre_params = reactive({ data: {} })
		const orderAddress = reactive({ data: '' })
		const address_list = reactive({ data: [] })
		const goods_data = reactive({ data: [] })
		const configInfo = ref(store.state.configInfo)
		const current_address_index = ref(0)
		const submitLoading = ref(false)
		const select_invoice_info = reactive({
			invoiceId: '',
			invoiceContent: '',
			invoiceContentText: '',
			invoiceTitle: ''
		})
		const selCouponStore = reactive({
			store: {},
			couponCode: ''
		})
		const rules = ref('')
		const invoice_list = reactive({ data: [] }) //发票列表
		const invoiceCheckState = ref(true)
		const invoice_info = reactive({
			data: {
				//新增发票信息
				bankAccount: '', //银行帐户(专用发票）
				bankName: '', //开户银行(专用发票）
				invoiceContent: 1, //发票内容：1-商品明细；2-商品类别
				invoiceTitle: '', //发票抬头(通用信息）
				invoiceType: 1, //发票类型：1-普通发票；2-增值税发票
				isDefault: false, //是否默认发票：0-非默认发票，1-默认发票
				receiverAddress: '', //收票人详细地址(通用信息）
				receiverEmail: '', //	收票邮箱(通用信息）
				receiverMobile: '', //收票人手机号(通用信息）
				receiverName: '', //收票人姓名(通用信息）
				registerAddr: '', //注册地址(专用发票）
				registerPhone: '', //注册电话(专用发票）
				taxCode: '', //纳税人识别号(通用信息）
				titleType: 1, //抬头类型：1-个人；2-公司
				companyName: '' //单位名称
			}
		})
		// 重置发票信息
		const resetVoiceInfo = () => {
			invoice_info.data.bankAccount = ''
			invoice_info.data.bankName = ''
			invoice_info.data.invoiceContent = 1
			invoice_info.data.invoiceTitle = ''
			invoice_info.data.invoiceType = 1
			invoice_info.data.isDefault = false
			invoice_info.data.receiverAddress = ''
			invoice_info.data.receiverEmail = ''
			invoice_info.data.receiverMobile = ''
			invoice_info.data.receiverName = ''
			invoice_info.data.registerAddr = ''
			invoice_info.data.registerPhone = ''
			invoice_info.data.taxCode = ''
			invoice_info.data.titleType = 1
			invoice_info.data.companyName = ''
		}
		const order_settle_info = reactive({
			totalAmount: '',
			totalDiscount: '',
			platformCouponList: [],
		})
		const allData = reactive({ data: {} })
		const virtual = reactive({
			isVG: null,
			virtualPre: []
		})

		const preMsgErr = reactive({
			index: null,
			errMsg: ''
		})
		const reserveInfoList = ref([])

		// 商品列表字符串转对象
		const ParseProductStringToObj = (productsStr) => {
			const items = productsStr.split(',');

			const parsedData = items.map(item => {
				const [productId, num] = item.split('-');
				return {
					productId: Number(productId),
					num: Number(num)
				};
			});
			return parsedData
		}

		// 邮编填写事件
		const handleChangePostCode = (value) => {
			if (value.length === 8) {
				const param = {
					postalCode: value
				}
				proxy
					.$post(
						'v3/supplier/channel/orderOperate/getAddressDetailByPostalCode',
						param,
						'application/json'
					)
					.then(res => {
						if (res.state == 200) {
							address_info.uf = res.data.uf
							address_info.bairro = res.data.bairro
							address_info.abreviatura = res.data.abreviatura
							getFeeEstimate()
						} else {
							address_info.uf = ''
							address_info.bairro = ''
							address_info.abreviatura = ''
							if (res.msg) {
								ElMessage(res.msg)
							}
						}
					})
			} else {
				address_info.uf = ''
				address_info.bairro = ''
				address_info.abreviatura = ''
				feeEstimate.data.storeFeeEstimateList = [
					{ totalExpressFee: '0.00' }
				]
				feeEstimate.data.totalExpressFee = '0.00'
			}
		}

		// 多件商品价格计算
		const calcMutiProductsPrice = (singlePrice, num) => {
			const noCommaPrice = singlePrice.replace(',', '')
			const mutiPrice = (noCommaPrice * num).toFixed(2)
			return Number(mutiPrice).toLocaleString(
				'en-US', 
				{ minimumFractionDigits: 2, maximumFractionDigits: 2 }
			)
		}

		// 获取物流方式列表
		const getExpressList = () => {
			const param = {}
			proxy
				.$post(
					'/v3/supplier/channel/orderOperate/getExpressList',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 200) {
						const newExpressList = []
						res.data.forEach(itemGroup => {
							itemGroup.serviceList.forEach(itemService => {
								newExpressList.push({
									value: JSON.stringify({
										expressCode: itemGroup.code,
										expressServiceCode: itemService.code
									}),
									content: `${itemGroup.name}-${itemService.name}`
								})
							})
						})
						expressList.data = newExpressList
						selectedExpress.value = expressList.data[0].value
					} else {
						if (res.msg) {
							ElMessage(res.msg)
						}
					}
				})
		}

		// 获取订单费用
		const getFeeEstimate = () => {
			const expressList = [JSON.parse(selectedExpress.value)]
			expressList[0].storeId = goods_data.data[0].storeId
			
			const products = route.query.productSets
			const param = {
				orderFrom: 1,
				source: 1,
				productList: products ? ParseProductStringToObj(decodeURIComponent(products)) : [],
				expressList,
				receipt: address_info
			}
			proxy
				.$post(
					'/v3/supplier/channel/orderOperate/feeEstimate',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 200) {
						// totalGoodsFee = res.data.totalGoodsFee
						feeEstimate.data = res.data
					} else {
						if (res.msg) {
							ElMessage(res.msg)
						}
					}
				})
		}

		const changeCoupon = (storeItem, index) => {
			selCouponStore.store = storeItem
			selCouponStore.couponCode = couponCode.value[index]

			confirmOrder(2)
		}

		//用于切换地址，使用优惠券，获取信息，运费等
		const confirmOrder = type => {
			let param = {}
			param.source = type
			param.addressId = orderAddress.data.addressId

			param.orderFrom = 1

			//新加的参数----start
			if (route.query.productSets) {
				param.products = decodeURIComponent(route.query.productSets)
				param.productList = ParseProductStringToObj(param.products)
				
			}

			let storeInfoList = []
			goods_data.data.map(item => {
				let storeitem = {}
				if (selCouponStore.store.storeId == item.storeId) {
					storeitem.remark = selCouponStore.store.remark
					storeitem.storeCouponCode =
						selCouponStore.couponCode == L['不使用优惠券']
							? ''
							: selCouponStore.couponCode
					storeitem.storeId = item.storeId
				} else {
					storeitem.remark = item.remark
					storeitem.storeCouponCode =
						item.couponCode == L['不使用优惠券'] ? '' : item.couponCode
					storeitem.storeId = item.storeId
				}

				if (invoice_info.data.invoiceContent && invoice_info.data.invoiceId) {
					storeitem.invoiceContent = invoice_info.data.invoiceContent
					storeitem.invoiceId = invoice_info.data.invoiceId
				}

				storeInfoList.push(storeitem)
			})

			param.storeInfoList = storeInfoList
			if (pre_params.data.ifcart == 'true') {
				//来自于进货单
				param.isCart = true
			} else {
				//立即购买
				param.productId = pre_params.data.productId
				param.number = pre_params.data.numbers
				param.isCart = false
			}

			if (route.query.isAloneBuy) {
				param.isAloneBuy = true
			}

			if (pre_params.data.isAloneBuy) {
				param.isAloneBuy = true
			}

			proxy
				.$post(
					'v3/supplier/channel/orderOperate/getOrderConfirmInfo',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 200) {
						if (type == 1) {
							goods_data.data = res.data.storeGroupList
							// 计算小计
							goods_data.data[0].smallTotal = goods_data.data[0].productList.reduce((acc, item) => {
								return acc + (item.buyNum * item.price)
							}, 0)
							getFeeEstimate()

							goods_data.data.map((item, i) => {
								item.remark = ''
								let default_coupon = item.availableCouponList.filter(function (
									coupon
								) {
									return coupon.checked == true
								})
								if (default_coupon.length > 0) {
									item.couponCode = default_coupon[0].couponCode
									couponCode.value[i] = default_coupon[0].couponCode
								} else {
									item.couponCode = ''
									couponCode.value[i] = ''
								}
							})
						} else {
							let tmpRes = res.data.storeGroupList
							goods_data.data.map((item, index) => {
								if (tmpRes[index].availableCouponList.length) {
									let default_coupon = tmpRes[index].availableCouponList.filter(
										coupon => coupon.checked == true
									)
									if (default_coupon.length > 0) {
										item.couponCode = default_coupon[0].couponCode
										couponCode.value[index] = default_coupon[0].couponCode
											? default_coupon[0].couponCode
											: L['不使用优惠券']
									} else {
										item.couponCode = ''
										couponCode.value[index] = L['不使用优惠券']
									}
								}
								item.availableCouponList = tmpRes[index].availableCouponList
								item.expressFee = tmpRes[index].expressFee
								item.totalDiscount = tmpRes[index].totalDiscount
							})
						}
						allData.data = res.data
						order_settle_info.totalAmount = res.data.totalAmount

						if (type == 1) {
							virtual.isVG = allData.data.isVirtualGoods
							virtual.virtualPre = allData.data.reserveNameList.map(item => {
								item.reserveValue = ''
								return item
							})
						}
					} else {
						if (res.msg) {
							ElMessage(res.msg)
						}
					}
				})
		}
		
		//获取地址列表
		const getAddressList = () => {
			proxy
				.$get('v3/supplier/channel/userAddress/list')
				.then(res => {
					if (res.state == 200) {
						address_list.data = res.data.list
						if (res.data.list.length > 0 && !orderAddress.data.addressId) {
							let df_index = res.data.list.findIndex(function (item) {
								return item.isDefault == 1
							})

							if (df_index > -1) {
								orderAddress.data = res.data.list[df_index]
								current_address_index.value = df_index
							} else {
								orderAddress.data = res.data.list[0]
							}

							if (localStorage.getItem('addressId')) {
								let addressID = localStorage.getItem('addressId')
								let used_index = res.data.list.findIndex(
									i => i.addressId == addressID
								)
								if (used_index > -1) {
									current_address_index.value = used_index
									orderAddress.data = res.data.list[used_index]
								} else {
									current_address_index.value = -1
								}
							} else {
								current_address_index.value = -1
							}
						}
						confirmOrder(1)
					} else {
						confirmOrder(2)
						ElMessage(res.msg)
					}
				})
		}
		//切换地址
		const selectAddress = index => {
			current_address_index.value = index
		}

		//确认修改地址
		const confirmChangeAddress = index => {
			current_address_index.value = index
			orderAddress.data = address_list.data[current_address_index.value]
			show_select_address.value = false
			confirmOrder(2)
			localStorage.setItem('addressId', orderAddress.data.addressId)
		}
		//弹出地址选择框
		const changeAddress = () => {
			getAddressList()
			show_select_address.value = true
		}

		//返回进货单
		const goCart = () => {
			router.go(-1)
		}
		//弹出发票选择框
		const showVoiceDialog = () => {
			edit_voice_dialog.value = true
			getVoiceList()
		}
		const showAddvoice = () => {
			add_voice_content.value = true
		}
		//获取发票列表
		const getVoiceList = () => {
			proxy
				.$get('v3/supplier/channel/userInvoice/list')
				.then(res => {
					if (res.state == 200) {
						invoice_list.data = res.data.list
						if (!allData.data.isVatInvoice) {
							invoice_list.data = res.data.list.filter(i => i.invoiceType != 2)
						}
						if (invoice_list.data.length > 0) {
							add_voice_content.value = false
						} else {
							add_voice_content.value = true
						}
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		const removeAddvoice = () => {
			select_invoice_info.invoiceId = ''
			edit_voice_dialog.value = false
		}
		//切换发票内容
		const changeInvoiceContent = invoiceContent => {
			invoice_info.data.invoiceContent = invoiceContent
		}
		//切换发票抬头
		const changeInvoiceTitleType = titleType => {
			invoice_info.data.titleType = titleType
			if (titleType == 1) {
				invoice_info.data.invoiceType = 1
			}
		}
		//切换发票类型
		const changeInvoiceType = invoiceType => {
			invoice_info.data.invoiceType = invoiceType
		}

		watch(invoice_info.data, () => {
			invoice_info.data.registerPhone = invoice_info.data.registerPhone
				.toString()
				.substring(0, 12)
			invoice_info.data.receiverMobile = invoice_info.data.receiverMobile
				.toString()
				.substring(0, 12)
			invoice_info.data.bankAccount = invoice_info.data.bankAccount
				.toString()
				.substring(0, 19)
		})

		const invoiceCheck = type => {
			var reg = new RegExp(
				'^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
			)
			switch (type) {
				case 'receiverEmail': {
					if (
						invoice_info.data.receiverEmail &&
						!reg.test(invoice_info.data.receiverEmail)
					) {
						invoice_info.data.receiverEmail = ''
						ElMessage(L['邮箱格式不正确，请重新输入！'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'taxCode': {
					let regExp = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
					if (
						invoice_info.data.taxCode &&
						!regExp.test(invoice_info.data.taxCode)
					) {
						invoice_info.data.taxCode = ''
						ElMessage(L['请填写正确的税号'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'registerPhone': {
					if (
						invoice_info.data.registerPhone &&
						proxy.$checkMobile(invoice_info.data.registerPhone) != true
					) {
						invoice_info.data.registerPhone = ''
						ElMessage(L['请填正确填写注册电话'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'receiverMobile': {
					if (
						invoice_info.data.receiverMobile &&
						proxy.$checkMobile(invoice_info.data.receiverMobile) != true
					) {
						invoice_info.data.receiverMobile = ''
						ElMessage(L['请填正确填写收票人电话'])
						invoiceCheckState.value = false
					}
					break
				}

				default: {
					invoiceCheckState.value = true
				}
			}
		}

		//新增发票
		const confirmAddVoice = () => {
			if (!invoiceCheckState.value) {
				invoiceCheckState.value = true
				return
			}

			if (invoice_info.data.titleType == 1) {
				var reg = new RegExp(
					'^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
				)
				if (invoice_info.data.invoiceTitle == '') {
					ElMessage(L['请填写发票抬头'])
					return
				} else if (invoice_info.data.receiverEmail == '') {
					ElMessage(L['请填写收票邮箱'])
					return
				} else if (!reg.test(invoice_info.data.receiverEmail)) {
					ElMessage(L['邮箱格式不正确，请重新输入！'])
					return
				}
			} else if (invoice_info.data.titleType == 2) {
				let regExp = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
				if (invoice_info.data.companyName == '') {
					ElMessage(L['请填写单位名称'])
					return
				} else if (invoice_info.data.taxCode == '') {
					ElMessage(L['请填写纳税人税号'])
					return
				} else if (regExp.test(invoice_info.data.taxCode) == false) {
					ElMessage(L['请填写正确的税号'])
					return
				} else if (invoice_info.data.invoiceType == 1) {
					if (invoice_info.data.receiverEmail == '') {
						ElMessage(L['请填写收票邮箱'])
						return
					}
				} else {
					//-----
					if (invoice_info.data.registerAddr == '') {
						ElMessage(L['请填写注册地址'])
						return
					}
					//-----
					if (invoice_info.data.registerPhone == '') {
						ElMessage(L['请填写注册电话'])
						return
					}
					if (
						proxy.$checkMobile(
							invoice_info.data.registerPhone,
							L['请正确填写注册电话']
						) != true
					) {
						ElMessage(
							proxy.$checkMobile(
								invoice_info.data.registerPhone,
								L['请正确填写注册电话']
							)
						)
						return
					}
					//-----
					if (invoice_info.data.bankName == '') {
						ElMessage(L['请填写开户银行'])
						return
					}
					//-----
					if (invoice_info.data.bankAccount == '') {
						ElMessage(L['请填写银行账户'])
						return
					}
					//-----
					if (invoice_info.data.receiverName == '') {
						ElMessage(L['请填写收票人姓名'])
						return
					}
					//-----
					if (invoice_info.data.receiverMobile == '') {
						ElMessage(L['请填写收票人电话'])
						return
					}
					if (
						proxy.$checkMobile(
							invoice_info.data.receiverMobile,
							L['请正确填写收票人电话']
						) != true
					) {
						ElMessage(L['请正确填写收票人电话'])
						return
					}

					//-----
					if (invoice_info.data.receiverAddress == '') {
						ElMessage(L['请填写收票人地址'])
						return
					}
					//-----
				}
			}

			var param = {}
			param.titleType = invoice_info.data.titleType
			param.invoiceType = invoice_info.data.invoiceType
			param.invoiceContent = invoice_info.data.invoiceContent
			if (invoice_info.data.isDefault) {
				param.isDefault = 1
			} else {
				param.isDefault = 0
			}
			if (invoice_info.data.invoiceType != 2) {
				param.receiverEmail = invoice_info.data.receiverEmail
			}
			if (invoice_info.data.titleType == 1) {
				param.invoiceTitle = invoice_info.data.invoiceTitle
			} else {
				param.taxCode = invoice_info.data.taxCode
				param.invoiceTitle = invoice_info.data.companyName
				if (invoice_info.data.invoiceType == 2) {
					param.registerAddr = invoice_info.data.registerAddr
					param.registerPhone = invoice_info.data.registerPhone
					param.bankName = invoice_info.data.bankName
					param.bankAccount = invoice_info.data.bankAccount
					param.receiverName = invoice_info.data.receiverName
					param.receiverMobile = invoice_info.data.receiverMobile
					param.receiverAddress = invoice_info.data.receiverAddress
				}
			}
			proxy
				.$post('v3/supplier/channel/userInvoice/add', param)
				.then(res => {
					if (res.state == 200) {
						if (res.state == 200) {
							select_invoice_info.invoiceTitle =
								invoice_info.data.titleType == 2
									? invoice_info.data.companyName
									: invoice_info.data.invoiceTitle
							select_invoice_info.invoiceContent =
								invoice_info.data.invoiceContent
							select_invoice_info.invoiceContentText =
								invoice_info.data.invoiceContent == 1
									? L['商品明细']
									: L['商品类别']
							select_invoice_info.invoiceId = res.data
							edit_voice_dialog.value = false
							add_voice_content.value = false
							resetVoiceInfo()
							ElMessage.success({
								message: res.msg,
								type: 'success'
							})
						}
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		//新增发票返回
		const voiceReturn = () => {
			if (invoice_list.data.length > 0) {
				add_voice_content.value = false
			} else {
				edit_voice_dialog.value = false
			}
			resetVoiceInfo()
		}
		//选择发票
		const chooseVoice = voice => {
			select_invoice_info.invoiceTitle = voice.invoiceTitle
			select_invoice_info.invoiceContent = voice.invoiceContent
			select_invoice_info.invoiceContentText =
				voice.invoiceContent == 1 ? L['商品明细'] : L['商品类别']
			select_invoice_info.invoiceId = voice.invoiceId
			edit_voice_dialog.value = false
		}
		//确认订单前校验商品是否可购买
		const checkOrder = (continueExec) => {
			let param = {}
			if (pre_params.data.ifcart == 'true') {
				param.isCart = true
			} else {
				let {
					promotionId,
					promotionType,
				} = goods_data.data[0].productList[0]

				param.isCart = false
				param.promotionId = promotionId
				param.promotionType = promotionType

				if (route.query.productSets) {
					param.products = decodeURIComponent(route.query.productSets)
				}

				if (route.query.isAloneBuy) {
					delete param.promotionId
					delete param.promotionType
				}
			}

			if (route.query.isAloneBuy) {
				param.isAloneBuy = true
			}

			reserveInfoList.value = []
			//预留信息校验start
			if (virtual.isVG == 2 && virtual.virtualPre.length > 0) {
				for (let i = 0; i < virtual.virtualPre.length; i++) {
					let {
						reserveName,
						reserveType,
						reserveValue,
						reserveNameId,
						isRequired
					} = virtual.virtualPre[i]
					if (
						checkPreMsg(reserveType, reserveValue, reserveName, isRequired) ==
						true
					) {
						reserveInfoList.value.push({
							reserveName,
							reserveValue,
							reserveNameId
						})
					} else {
						preMsgErr.errMsg = checkPreMsg(
							reserveType,
							reserveValue,
							reserveName,
							isRequired
						)
						preMsgErr.index = i
						ElMessage(
							checkPreMsg(reserveType, reserveValue, reserveName, isRequired)
						)
						continueExec()
						return
					}
				}
			}
			//预留信息校验end

			if (virtual.isVG == 2) {
				param.reserveInfoList = reserveInfoList.value
			}

			proxy
				.$post(
					'v3/supplier/channel/orderOperate/check',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 267) {
						let { state } = res.data
						no_good_info.data = res.data
						continueExec()
						if (
							state == 7 ||
							state == 4 ||
							state == 3 ||
							state == 2 ||
							state == 1 ||
							state == 6
						) {
							out_stock_dialog.value = true
						} else if (state == 5) {
							proxy
								.$confirm(
									L['商品促销信息发生变化，请返回后重新下单'],
									L['商品促销信息发生变化'],
									{
										confirmButtonText: L['返回'],
										type: 'warning'
									}
								)
								.then(() => {
									returnLastPage()
								})
						}
					} else if (res.state == 200) {
						goBuy(continueExec)
					} else {
						ElMessage(res.msg)
						continueExec()
					}
				})
		}

		//最终接受点击的函数，由防止多次点击方法包裹
		const submitOrderFn = preventMutiClick(checkOrder)


		//返回上一页
		const returnLastPage = () => {
			out_stock_dialog.value = false
			router.go(-1)
		}
		//移除无货商品
		const clearFailureGoods = () => {
			proxy.$post('v3/supplier/channel/cart/emptyInvalid').then(res => {
				if (res.state == 200) {
					out_stock_dialog.value = false
					confirmOrder(2)
					ElMessage.success(res.msg)
				} else {
					ElMessage(res.msg)
				}
			})
		}
		//跳转订单页
		const goBuy =  async  (continueExec) => {
			try {
				const [contactValid, addressValid] = await Promise.all([
					contact_info_form.value.validate(),
					address_info_form.value.validate()
				]);
				
				if (contactValid && addressValid) {
					let param = {}
					param.source = 3
					param.orderFrom = 1
					if (virtual.isVG == 1) {
						param.addressId = orderAddress.data.addressId
					}

					let storeInfoList = []
					goods_data.data.map(item => {
						let storeitem = {}
						storeitem.invoiceId = select_invoice_info.invoiceId
						storeitem.invoiceContent = select_invoice_info.invoiceContent
						storeitem.remark = item.remark
						storeitem.storeCouponCode = item.couponCode == L['不使用优惠券'] ? '' : item.couponCode
						storeitem.storeId = item.storeId
						storeInfoList.push(storeitem)
					})
					param.storeInfoList = storeInfoList
					if (pre_params.data.ifcart == 'true') {
						//来自于进货单
						param.isCart = true
					} else {
						//立即购买
						param.isCart = false
						param.products = decodeURIComponent(route.query.productSets)
					}

					if (route.query.isAloneBuy) {
						param.isAloneBuy = true
					}

					if (virtual.isVG == 2) {
						param.reserveInfoList = reserveInfoList.value
					}

					// 新UI参数处理
					param.consignee = contact_info
					param.receipt = address_info
					const expressList = [JSON.parse(selectedExpress.value)]
					expressList[0].storeId = goods_data.data[0].storeId
					param.expressList = expressList
					const products = route.query.productSets
					param.productList = products ? ParseProductStringToObj(decodeURIComponent(products)) : []

					proxy
						.$post(
							'v3/supplier/channel/orderOperate/newSubmit',
							param,
							'application/json'
						)
						.then(res => {
							if (res.state == 200) {
								let paySn = res.data.paySn
								submitLoading.value = true
								queryPayState(paySn, continueExec)
							} else {
								ElMessage(res.msg)
								continueExec()
							}
						})
				} else {
					continueExec()
					return false;
				}
			} catch (error) {
				continueExec()
				return false;
			}
		}

		const queryPayState = async (paySn, continueExec) => {
			const res = await getPayInfo(paySn, continueExec)
			if (res.data) {
				if (res.state == 267) {
					ElMessage.success(res.msg + L[',2s后自动跳转订单列表'])
					//清除定时器
					if (timer.value) {
						clearTimeout(timer.value)
						timer.value = 0
					}
					setTimeout(() => {
						router.replace({
							path: '/member/order/list'
						})
					}, 2000)
				} else if (res.data.dealState == 3 || res.data.dealState == 2) {
					//清除定时器
					if (timer.value) {
						clearTimeout(timer.value)
						timer.value = 0
					}
					if (res.data.dealState == 2) {
						ElMessage(res.data.failReason || L['提交订单失败，请稍后重试'])
						continueExec()
						submitLoading.value = false
					} else {
						proxy.$sldStatEvent({ behaviorType: 'buy', paySn })
						router.replace({
							path: 'Pay',
							query: {
								paySn: paySn,
								payFrom: 1,
								ifcart: pre_params.data.ifcart
							}
						})
					}
				} else {
					Promise.resolve().then(() => {
						timer.value = setTimeout(() => queryPayState(paySn, continueExec), 100)
					})
				}
			}

		}

		//获取订单支付数据
		const getPayInfo = async (paySn, continueExec) => {
			try {
				const res = await proxy.$get('v3/supplier/channel/orderPay/payInfo', { paySn: paySn, payFrom: 1 })
				if (res.state == 200 || res.state == 267) {
					return res
				} else {
					submitLoading.value = false
					ElMessage.error(res.msg)
					continueExec()
					return {}
				}
			} catch (error) {
				submitLoading.value = false
				continueExec()
				return {}
			}
		}
		onUnmounted(() => {
			if (timer.value) {
				clearTimeout(timer.value)
				timer.value = 0
			}
		})
		//关闭弹窗
		const close = () => {
			addressVisibleFlag.value = false
		}
		//展开地址
		const exhibition = () => {
			exhibition_show.value = !exhibition_show.value
		}
		//弹出新建地址窗口
		const addAddress = () => {
			addressVisibleFlag.value = true
		}
		const refreshAddress = (addressInfo, addressId) => {
			orderAddress.data = addressInfo
			orderAddress.data.addressId = addressId
			getAddressList()
			localStorage.setItem('addressId', orderAddress.data.addressId)
		}

		//校验预留信息
		const checkPreMsg = (type, value, name, isRequired) => {
			switch (type) {
				case 1: {
					if (isRequired == 1) {
						return proxy.$checkPhone(value)
					} else {
						let regMobile = /(1[3-9]\d{9}$)/
						if (value && !regMobile.test(value)) {
							return `${L['请输入正确的']}${name}!`
						} else {
							return true
						}
					}

				}
				case 2: {
					if (isRequired == 1) {
						return proxy.$checkIdentity(value)
					} else {
						if (value) {
							let reg18 = /^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/
							let reg15 = /^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/
							if (reg18.test(value) || reg15.test(value)) {
								return true
							} else {
								return `${L['请输入正确的']}${name}`
							}
						} else {
							return true
						}
					}

				}
				case 3: {
					let regNum = /[0-9]+(.[0-9]+)?/
					if (isRequired == 1) {
						if (!value) {
							return `${L['请输入']}${name}`
						} else if (!regNum.test(value)) {
							return `${L['请输入正确的']}${name}`
						} else {
							return true
						}
					} else {
						return true
					}
				}
				case 4: {
					if (isRequired == 1) {
						if (!value) {
							return `${L['请输入']}${name}`
						} else if (type == 4) {
							return true
						}
					} else {
						return true
					}
					break
				}
				case 5: {
					if (isRequired == 1) {
						return proxy.$checkEmail(value)
					} else {
						let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
						if (value && !reg.test(value)) {
							return `${L['请输入正确的']}${name}!`
						} else {
							return true
						}
					}
				}
			}
		}

		const goNext = () => {
			out_stock_dialog.value = false
			goBuy()
		}

		onMounted(() => {
			pre_params.data = route.query
			getAddressList()
			getExpressList()
		})

		return {
			contact_info_form,
			address_info_form,
			contact_info_rules,
			address_info_rules,
			payType,
			pix,
			handleChangePostCode,
			contact_info,
			address_info,
			expressList,
			selectedExpress,
			feeEstimate,
			getFeeEstimate,
			calcMutiProductsPrice,

			submitOrderFn,
			navlist,
			memberInfo,
			not_select,
			selected,
			show_change_address,
			edit_voice_dialog,
			showVoiceDialog,
			invoice_selected,
			add_voice_content,
			showAddvoice,
			removeAddvoice,
			out_stock_dialog,
			orderAddress,
			changeAddress,
			show_select_address,
			address_list,
			current_address_index,
			selectAddress,
			confirmChangeAddress,
			goods_data,
			pre_params,
			invoice_info,
			changeInvoiceContent,
			changeInvoiceTitleType,
			changeInvoiceType,
			confirmAddVoice,
			invoice_list,
			select_invoice_info,
			voiceReturn,
			chooseVoice,
			order_settle_info,
			confirmOrder,
			checkOrder,
			goBuy,
			returnLastPage,
			clearFailureGoods,
			no_good_info,
			addressVisibleFlag,
			close,
			type,
			refreshAddress,
			addAddress,
			couponCode,
			configInfo,
			rules,
			changeCoupon,
			allData,
			L,
			invoiceCheck,
			virtual,
			preMsgErr,
			goNext,
			invoiceCheckState,
			exhibition,
			exhibition_show,
			goCart,
			submitLoading,
		}
	},
	beforeRouteEnter (to, from, next) {
		// ...
		if (from.name == 'Login') {
			next('/index')
		} else {
			next()
		}
	}
}
</script>

<style lang="scss">
@import '../../style/confirmOrder.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

input[type='number'] {
	-moz-appearance: textfield;
}

.voice_width {
	width: 605px !important;
}

.add_voice_btn2 {
	margin: -30px 114px 10px !important;
}

.out_store_width {
	width: 480px !important;
}

.select_address_width {
	width: 500px !important;
}

.el-dialog__body {
	padding-top: 10px;
}

.el-input__inner {
	font-size: 12px;
	line-height: 1px !important;
	/**
		* 解决el-input设置类型为number时，中文输入法光标上移问题
		**/
}

.confirm_order_container .input_email .el-input__inner {
	padding-right: 80px;
}

.el-select .el-input__inner:focus {
	border-color: var(--color_main);
}

.el-select .el-input.is-focus .el-input__inner {
	border-color: var(--color_main);
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
	border-color: var(--color_main);
	outline: 0;
}


.validateMessage {
	font-size: 12px;
	color: var(--color_main);
	margin-top: 5px;
	padding-left: 80px;
	height: 12px;
}

.giftProduct {
	display: inline-block;
	border: 1px solid var(--color_main);
	color: var(--color_main);
	width: 33px;
	height: 16px;
	border-radius: 3px;
	font-size: 12px;
	line-height: 16px;
	text-align: center;
	margin-right: 4px;
}

.integral_dialog .el-dialog__body {
	padding: 0;
}

#pre_tag_input {
	height: 30px;
	width: 320px;
}

.preMsgErr {
	color: var(--color_main);
	margin-left: 13px;
}
</style>
