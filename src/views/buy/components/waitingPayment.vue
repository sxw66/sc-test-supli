<!--
 * @Author: heyimin
 * @Date: 2024-10-30 
 * @Description: 订单支付-待支付状态
-->
<template>
	<div id="waitingPayment">
		<div class="content-wrap">
			<!-- 顶部模块 -->
			<div class="top">
				<div class="top_logo">
					<div :style="`background-image:url(${configInfo.supplier_main_site_logo})`"></div>
				</div>
				<span class="txt">{{ L['支付结果'] }}</span>
			</div>
			<div class="submitInfo-line">
				<span class="notice">
					· {{ L['订单提交成功，请尽快付款。'] }}
				</span>
				<span class="right">
					{{ L['应付金额'] }}
					<span class="price-wrap">
						R$ <span class="price">{{ $formatMoneyNum(payInfo.data.data.orderAmount || 0) }}</span>
					</span>
				</span>
			</div>
			<!-- 二维码模块 -->
			<div class="QRcode-module-wrap">
				<div class="time-line">
					{{ L['距离PIX二维码和代码过期还剩'] }}
					<span class="time">{{ timeCount.minutes }} {{ L['分'] }} {{ timeCount.seconds }} {{ L['秒'] }}</span>
				</div>
				<div class="QRcode-wrap">
					<img v-if="pixPayQrImg" :src="pixPayQrImg" alt class="QRcode">
				</div>
				<div class="url-line">
					<div class="url">{{ payId }}</div>
				</div>
				<el-button class="copy-btn" @click="copyText">{{ L['复制'] }}</el-button>
				<div class="notice-wrap">
					<div class="question">{{ L['如何支付您的订单？'] }}</div>
					<div class="notice-item scan">
						<div class="title">{{ L['扫码支付'] }}</div>
						<div class="txt">
							1. {{ L['打开您的银行应用程序，在PIX付款选项中选择QR码。'] }} <br/>
							2. {{ L['使用手机摄像头扫描QR码，确保订单数据正确并完成付款。'] }}
						</div>
					</div>
					<div class="notice-item copy">
						<div class="title">{{ L['复制代码支付'] }}</div>
						<div class="txt">
							1. {{ L['通过单击复制上面的代码。'] }}<br/>
							2. {{ L['打开银行的应用程序，然后从 PIX 付款选项中选择“复制和粘贴”。请确保订单数据正 确无误并完成付款。'] }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { preventMutiClick } from '@/utils/common'

export default {
	name: 'waitingPayment',
	props: [
		"pay_info", 
		"pix_pay_qr_img", 
		'pay_data', 
		'pay_id', 
		'time_count'
	],
	components: {
	},
	setup (props) {
		const ifcart = ref('')
		const route = useRoute()
		const router = useRouter()
		const store = useStore()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const payInfo = reactive({ data: props.pay_info })
		const paySn = ref('')
		const payId = ref(props.pay_id)
		const current_pay_method = reactive({ data: {} })
        const show_pix_pay = ref(false)
        const timeCount = ref(props.time_count) // 倒计时
        const pixPayQrImg = ref(props.pix_pay_qr_img) // 二维码图片
        const payData = ref(props.pay_data) // 支付数据
		const timer = ref(0) //定时器
		const configInfo = ref(store.state.configInfo)
		
		
		watch(props, (oldVal, newVal) => {
			payInfo.data = newVal.pay_info
			payData.value = newVal.pay_data
			payId.value = newVal.pay_id
			pixPayQrImg.value = newVal.pix_pay_qr_img
			timeCount.value = newVal.time_count
		})

		// 复制
		const copyText = async () => {
			try {
				await navigator.clipboard.writeText(payId.value);
				ElMessage.success(L['复制成功!']);
			} catch (err) {
				ElMessage.error(L['复制失败，请手动复制!']);
			}
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
					} else if (res.state == 267) {
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
				.$post('v3/supplier/channel/orderPay/doPay', param)
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
                            show_pix_pay.value = true
							pixPayQrImg.value = 'data:image/png;base64,' + res.data.payData //微信支付二维码
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

		const submitPay = preventMutiClick(pay)

		// 二维码过期计时
		const countQRcodeTime = () => {
				console.log(payInfo.data, 'payInfo.data.codeTime');
			// setInterval(() => {
			// 	payInfo.data.codeTime = payInfo.data.codeTime - 1
			// 	console.log(payInfo.data.codeTime, 'payInfo.data.codeTime');
				
			// }, 1000);
		}

		// 定时查询是否支付成功
		const queryPayState = () => {
			if (!timer.value) return
			getPayInfo()
		}

		onMounted(() => {
			paySn.value = route.query.paySn
			ifcart.value = route.query.ifcart
			getPayInfo()
			countQRcodeTime()
		})
		onUnmounted(() => {
			if (timer.value) {
				clearInterval(timer.value)
				timer.value = null
			}
		})
		return {
			L,
			payInfo,
			copyText,

			current_pay_method,
			pay,
			payId,
			payData,
            pixPayQrImg,
			timeCount,
            show_pix_pay,
			configInfo,
			payComplete,
			submitPay,
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
@import '../style/waitingPayment.scss';
@import '../../../style/base.scss';

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
