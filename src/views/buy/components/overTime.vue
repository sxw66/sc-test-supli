<!--
 * @Author: heyimin
 * @Date: 2024-10-30 
 * @Description: 订单支付-待支付状态
-->
<template>
	<div id="overTime">
		<div class="content-wrap">
			<div class="top">
				<div class="top_logo">
					<div :style="`background-image:url(${configInfo.supplier_main_site_logo})`"></div>
				</div>
			</div>
			<div class="img-wrap">
				<img src="@/assets/order/order_overTime.png" alt class="img">
				<div class="txt">PIX已过期</div>
			</div> 
			<div class="notice">
				· 如果您已经为此订单付款，请不要担心，您的订单将自动更新。 <br />
				· 如果您没有为此订单付款，您可以选择重新下单。
			</div>
			<div class="action-wrap">
				<el-button class="backHome btn" @click="backHome">返回首页</el-button>
				<el-button class="reorder btn" @click="$goGoodsDetail(productId)">重新下单</el-button>
			</div>
		</div>
	</div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { preventMutiClick } from '@/utils/common'

export default {
	name: 'overTime',
	props: ['productId'],
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
		const productId = ref(props.productId);

		// 返回首页
		const backHome = () => {
			router.push({ name: 'HomeIndex' })
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
			productId
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
@import '../style/overTime.scss';
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
