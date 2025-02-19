<!--
 * @Author: heyimin
 * @Date: 2024-10-30 
 * @Description: 订单支付-待支付状态
-->
<template>
	<div id="success">
		<div class="content-wrap">
			<div class="top">
				<div class="top_logo">
					<div :style="`background-image:url(${configInfo.supplier_main_site_logo})`"></div>
				</div>
				<span class="txt">支付结果</span>
			</div>
			<div class="img-wrap">
				<img src="@/assets/order/order_success.png" alt class="img">
				<div class="txt">支付成功</div>
			</div> 
			<div class="notice">
				<div class="line1">感谢您的购买，我们将尽快为您安排发货</div>
				<div class="line2">您的订单号为：{{ orderSn }}
					<el-button class="copy" @click="copyText">复制</el-button>
					 ，稍晚可登录TF商城使用追踪物流信息。
				</div>
			</div>
			<div class="action-wrap">
				<el-button class="backHome btn" @click="backHome">返回首页</el-button>
				<el-button class="reorder btn" @click="checkOrder">查看订单</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { preventMutiClick } from '@/utils/common'

export default {
	name: 'success',
	props: ['orderSn'],
	components: {
	},
	setup (props) {
		const ifcart = ref('')
		const route = useRoute()
		const router = useRouter()
		const store = useStore()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const paySn = ref('')
		const configInfo = ref(store.state.configInfo)
		const orderSn = ref(props.orderSn);
		
		watch(props, (oldVal, newVal) => {
			orderSn.value = newVal.orderSn
		})

		// 返回首页
		const backHome = () => {
			router.push({ name: 'HomeIndex' })
		}

		// 查看订单
		const checkOrder = () => {
			router.push({
				path: '/member/order/detail',
				query: {
					orderSn: orderSn.value
				}
			})
		}
		
		// 复制
		const copyText = async () => {
			try {
				await navigator.clipboard.writeText(orderSn.value);
				ElMessage.success('复制成功!');
			} catch (err) {
				ElMessage.error('复制失败，请手动复制');
			}
		}

		onMounted(() => {
			paySn.value = route.query.paySn
			ifcart.value = route.query.ifcart
		})

		onUnmounted(() => {
		})

		return {
			L,
			configInfo,
			backHome,
			copyText,
			checkOrder,
			orderSn
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
@import '../style/success.scss';
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
