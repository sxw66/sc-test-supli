<template>
	<div class="good_item">
		<div class="flex">
			<div class="good_info flex">
				<div class="image flex_row_center_center">
					<coverImage :src="goodItem.productImage" width="64" height="64">
					</coverImage>
				</div>
				<div class="good_info_con">
					<router-link :to="`/goods/detail?sourcePath=/member/order/detail&productId=${goodItem.productId}`"
						class="name" target="_blank">
						<span class="gift" v-if="goodItem.isGift == 1">
							{{ L['赠品'] }}
						</span>
						{{ goodItem.goodsName }}
					</router-link>
					<div class="spec">{{ goodItem.specValues }}</div>
				</div>
			</div>

			<div class="price flex_row_center_center">
				R${{ $formatMoneyNum(goodItem.productShowPrice) }}
			</div>
			<div class="num flex_row_center_center">
				*{{ goodItem.productNum }}
			</div>
			<div v-if="showOperateTab" class="oprate flex_row_center_center">
				<!-- 退款中 可查看退款详情  售后按钮，100-退款（商家未发货），200-退款（商家发货,买家未收货），300-申请售后，401-退款中，402-退款完成,403-换货中，404-换货完成	301,退款失败-平台审核失败-->
				<span class="refund_btn pointer " v-if="showDetail" @click.stop="goRefundDetail(goodItem.afsSn)">{{
						goodItem.afsButtonValue }}</span>
				<!-- 退款 可申请退款-->
				<span class="refund_btn pointer" v-else-if="showSelectService"
					@click.stop="selectService(goodItem.orderProductId, orderInfo.orderSn)">{{
						goodItem.afsButtonValue }}</span>

				<!-- 赠品不能申请售后 -->
				<span class="refund_btn" v-else>--</span>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

export default {
	props: {
		storeItem: {
			type: Object,
			default: () => { }
		},
		goodItem: {
			type: Object,
			default: () => { }
		},
		orderInfo: {
			type: Object,
			default: () => { }
		}
	},
	components: {},
	setup (props) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const router = useRouter()

		const showOperateTab = computed(() => {
			let state = [20, 30, 31, 40]
			return state.includes(props.orderInfo.orderState)
		})

		const showDetail = computed(() => {
			let afsState = [401, 402, 403, 404, 301]
			let { isGift, afsButton } = props.goodItem
			return afsState.includes(afsButton) && isGift == 0
		})

		const showSelectService = computed(() => {
			let afsState = [100, 200, 300]
			let { isGift, afsButton } = props.goodItem
			return afsState.includes(afsButton) && isGift == 0
		})
		

		//查看售后详情
		const goRefundDetail = afsSn => {
			router.push({
				path: '/member/order/refund/detail',
				query: {
					orderState: props.orderInfo.orderState,
					afsSn
				}
			})
		}

		//选择售后服务
		const selectService = (orderProductId, orderSn) => {
			proxy
				.$get('v3/supplier/channel/return/apply/applyInfo', {
					orderSn,
					orderProductId
				})
				.then(res => {
					if (res.state == 200) {
						router.push({
							path: '/member/order/refund/apply',
							query: {
								orderState: props.orderInfo.orderState,
								orderProductId
							}
						})
					} else {
						ElMessage(res.msg)
					}
				})
		}


		return {
			showSelectService,
			showDetail,
			showOperateTab,
			L,
			goRefundDetail,
			selectService,
		}
	},
}
</script>

<style lang='scss' scoped>
.good_item {
	padding: 25px 0;


	.good_info {
		flex: 1;

		.image {
			width: 64px;
			height: 64px;
			border: 1px solid #efeff3;

			img {
				max-width: 100%;
				max-height: 100%;
			}
		}

		.good_info_con {
			margin-left: 10px;

			.name,
			.spec {
				margin-top: 5px;
			}

			.gift {
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

			a {
				color: #333;
			}
		}
	}

	.price {
		flex: 1;
		text-align: center;
	}

	.num {
		width: 15%;
		text-align: center;
	}

	.oprate {
		width: 15%;
		text-align: center;

		&:hover {
			color: var(--color_vice);
		}
	}
}
</style>
