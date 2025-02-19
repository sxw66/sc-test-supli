<!--
 * @Author: wangwei
 * @Date: 2020-12-29 15:56:16
 * @LastEditTime: 2024-09-20 14:56:26 
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: 订单支付页面
 * @FilePath: /java-pc/src/views/buy/pay.vue
-->
<template> 
	<div id="pay">
		<!-- 超时页，暂未启用 -->
		<OverTime v-if="overTime" 
				  :pay_info="pay_info"/>
		<!-- 成功页，暂未启用 -->
		<Success v-if="orderState === 267" :orderSn="pay_info.data.orderSn"/>
		<WaitingPayment v-else 
						:pay_info="pay_info"
						:pay_data="payData"
						:pix_pay_qr_img="pixPayQrImg"
						:pay_id="pay_id"
						:time_count="timeCount"/>
	</div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { preventMutiClick } from '@/utils/common'
import WaitingPayment from './components/waitingPayment.vue'
import OverTime from './components/overTime.vue'
import Success from './components/success.vue'
// Importing images
import balance from '../../assets/buy/balance.png'
import otherPay from '../../assets/buy/otherPay.png'
import wechat from '../../assets/buy/wechat.png'
import wx_pay_tip from '../../assets/buy/wx_pay_tip.png'
export default {
	name: 'Pay',
	components: {
		WaitingPayment,
		OverTime,
		Success
	},
	setup () {
		const ifcart = ref('')
		// const balance = require('../../assets/buy/balance.png')
		// const otherPay = require('../../assets/buy/otherPay.png')
		// const wechat = require('../../assets/buy/wechat.png')
		// const wx_pay_tip = require('../../assets/buy/wx_pay_tip.png')
		const route = useRoute()
		const router = useRouter()
		const store = useStore()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const pay_method = reactive({ data: [] })
		const pay_info = reactive({ data: {} })
		const paySn = ref('')
		const current_pay_method = reactive({ data: {
			payType: 'PIX',
			payMethod: 'pix'
		} })
		const balance_list = reactive({ data: [] })
		const other_pay_list = reactive({ data: [] })
		const buy_name_list = ref('')
		const password = ref('')
		const show_wx_pay = ref(false)
        const show_pix_pay = ref(false)
		const payData = ref('') // 微信支付二维码（无前缀）
        const pixPayQrImg = ref('')
		const wxPayQrImg = ref('') //微信支付二维码
		const pay_id = ref('') // 支付码（复制码）
		const timer = ref(0) //定时器
		const show_detail = ref(true)
		const hasPayMethod = ref(true)
		const configInfo = ref(store.state.configInfo)
		const memberInfo = ref(store.state.memberInfo)
		const orderState = ref(200) // 订单状态
		const overTime = ref(false) // 支付超时
		const timeCountSeconds = ref(0) // 超时计时(秒)
		const timeCount = ref(0) // 超时计时（分秒）
		const countInterval = ref(null)

		//获取支付方式
		const getPayMethod = () => {
			proxy
				.$get('v3/supplier/channel/orderPay/payMethod', {
					source: 'pc',
					type: 1
				})
				.then(res => {
					if (res.state == 200) {
						hasPayMethod.value = res.data.length > 0 ? true : false
						res.data.map(item => {
							if (item.payMethod == 'balance') {
								balance_list.data.push(item)
							} else {
								other_pay_list.data.push(item)
							}
						})
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		//获取订单支付数据
		const getPayInfo = () => {
			proxy
				.$get('v3/supplier/channel/orderPay/payInfo', {
					paySn: route.query.paySn,
					payFrom: route.query.payFrom
				})
				.then(res => {
					if (res.state == 200) {
						pay_info.data = res.data
						buy_name_list.value = res.data.goodsNameList.join(' + ')
						if (!overTime.value && timeCount.value === 0) {
							refreshWxQrcode()
						}
					} else if (res.state == 267 || res.state == 255) {
						ElMessage.success(res.msg + L[',2s后自动跳转订单列表'])
						//清除定时器
						if (timer.value) {
							clearInterval(timer.value)
							timer.value = 0
						}
						setTimeout(() => {
							router.replace({
								path: '/member/order/list'
							})
						}, 2000)
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		const changePayMethod = pay_method => {
			current_pay_method.data = pay_method
		}
		//去支付
		const payComplete = ref(false)

		const pay = (continueExec) => {
			if (!current_pay_method.data.payMethod) {
				ElMessage.warning(L['请选择支付方式'])
				continueExec()
				return
			}
			
			let param = {}
			param.payType = current_pay_method.data.payType
			param.payMethod = current_pay_method.data.payMethod
			param.paySn = pay_info.data.paySn

			if (timer.value) {
				clearInterval(timer.value)
				timer.value = null
			}


			//请求支付接口
			proxy.$sldStatEvent({ behaviorType: 'payApply', paySn: pay_info.data.paySn })
			proxy
				.$post('v3/supplier/channel/orderPay/newDoPay', param, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(res => {
					continueExec()
					if (res.state == 200) {
						if (param.payMethod == 'balance') {
							ElMessage.success(L['支付成功,2s后自动跳转订单列表'])
							payComplete.value = true
							//清除定时器
							setTimeout(() => {
								router.replace({
									path: '/member/order/list'
								})
							}, 2000)
						} else if (param.payMethod == 'alipay') {
							document.write(res.data.payData) //自动提交表单数据
						} else if (param.payMethod == 'wx') {
							show_wx_pay.value = true
							wxPayQrImg.value = 'data:image/png;base64,' + res.data.payData //微信支付二维码
							// 定时查询是否支付成功
							timer.value = setInterval(() => {
								queryPayState()
							}, 3000)
							//两小时自动跳转订单列表
							setTimeout(() => {
								router.replace({
									path: '/member/order/list'
								})
							}, 432000000)
						}else if(param.payMethod == 'pix'){
							timeCountSeconds.value = res.data.timeout // 超时时间（秒）
							timeCount.value = transSToMN(timeCountSeconds.value) // 超时时间（分+秒）
                            show_pix_pay.value = true
							pixPayQrImg.value = `data:image/png;base64,${res.data.payData}` //微信支付二维码
							payData.value = res.data.payData //微信支付二维码（无前缀）
							pay_id.value = res.data.qrCode //支付码（复制码）
							
							// 定时查询是否支付成功
							timer.value = setInterval(() => {
								queryPayState()
							}, 3000)
							// 开始超时计时
							countInterval.value = setInterval(() => {
								if (timeCountSeconds.value >= 1) {
									timeCountSeconds.value = timeCountSeconds.value - 1
									timeCount.value = transSToMN(timeCountSeconds.value)
								} else {
									clearInterval(countInterval.value)
									// overTime.value = true
								}
							}, 1000);
							//两小时自动跳转订单列表
							setTimeout(() => {
								router.replace({
									path: '/member/order/list'
								})
							}, 432000000)
                            
                        }
					} else if (res.state == 267) {
						proxy.$confirm(res.msg, '提示', {
							confirmButtonText: '去设置',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							router.push('/member/pwd/pay')
						})
					} else {
						ElMessage(res.msg)
					}
				})
		}

		// 秒转分秒
		const transSToMN = (s) => {
			return {
				minutes: Math.floor(s / 60),
				seconds: s % 60
			}
		}

		const submitPay = preventMutiClick(pay)

		// 定时查询是否支付成功
		const queryPayState = () => {
			if (!timer.value) return
			getPayInfo()
		}
		//隐藏微信支付内容
		const hideWxPay = () => {
			show_wx_pay.value = false
			clearInterval(timer.value)
			timer.value = null
		}
        const hidePixPay = () => {
			show_wx_pay.value = false
			clearInterval(timer.value)
			timer.value = null
		}
		//刷新微信支付二维码
		const refreshWxQrcode = () => {
			submitPay()
		}
		//收起展开详情
		const showDetail = () => {
			show_detail.value = !show_detail.value
		}

		const rechargeEnble = ref(false)

		const getRechargeEnble = () => {
			proxy.$get('v3/system/common/getSettings', {
				names: 'recharge_is_enable'
			}).then(res => {
				if (res.state == 200) {
					rechargeEnble.value = res.data[0] == '1'
				}
			})
		}


		onMounted(() => {
			paySn.value = route.query.paySn
			ifcart.value = route.query.ifcart
			getPayMethod()
			getPayInfo()
			getRechargeEnble()
		})
		const goRecharge = () => {
			router.push('/member/recharge')
		}
		const forgetPassword = () => {
			router.push('/member/pwd/reset')
		}
		onUnmounted(() => {
			if (timer.value) {
				clearInterval(timer.value)
				timer.value = null
			}
		})
		return {
			L,
			pay_method,
			balance,
			otherPay,
			pay_id,
			wechat,
			pay_info,
			current_pay_method,
			balance_list,
			other_pay_list,
			changePayMethod,
			buy_name_list,
			password,
			pay,
			wx_pay_tip,
			show_wx_pay,
			payData,
            pixPayQrImg,
            show_pix_pay,
			hideWxPay,
            hidePixPay,
			refreshWxQrcode,
			wxPayQrImg,
			goRecharge,
			forgetPassword,
			showDetail,
			show_detail,
			hasPayMethod,
			configInfo,
			memberInfo,
			payComplete,
			rechargeEnble,
			submitPay,

			orderState,
			overTime,
			timeCount
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
@import '../../style/pay.scss';
@import '../../style/base.scss';

.refresh {
	cursor: pointer;
}

.no_payMethod {
	margin: 0 auto;
	width: 1200px;
	height: 560px;
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	img {
		width: 190px;
		height: 140px;
	}

	p {
		margin-top: 39px;
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
	}
}
</style>
