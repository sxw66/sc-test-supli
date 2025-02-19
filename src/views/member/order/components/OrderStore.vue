<template>
	<div class="order_store">

		<div class="shop_title flex">
			<div class="detail">{{ L['商品详情'] }}</div>
			<div class="price">{{ L['单价'] }}</div>
			<div class="num">{{ L['数量'] }}</div>
			<div v-if="showOperateTab" class="oprate">
				{{ L['操作'] }}
			</div>
		</div>


		<OrderGoods v-for="goodItem in storeItem.orderProductList" :key="goodItem.productId" :storeItem="storeItem"
			:goodItem="goodItem" :orderInfo="orderInfo" />
		<div class="order_remark flex" v-if="storeItem.orderRemark">
			<div>订单备注：</div>
			<div>{{ storeItem.orderRemark }}</div>
		</div>

		<div class="extra_info flex_column_start_end" v-if="orderInfo.orderState == 10">

			<div class="settle_info_store">
				<div class="label_info">
					<span class="label">{{ L['商品总额'] }}：</span>
					<span class="value">R${{ $formatMoneyNum(storeItem.goodsAmount) }}</span>
				</div>
				<div class="label_info" v-if="storeItem.activityDiscountAmount">
					<span class="label">{{ L['优惠'] }}：</span>
					<span class="value">{{ L['-R$'] }}{{ $formatMoneyNum(storeItem.activityDiscountAmount) }}</span>
				</div>
				<div class="label_info">
					<span class="label">{{ L['运费金额'] }}：</span>
					<span class="value">{{ L['R$'] }}{{ $formatMoneyNum(storeItem.expressFee) }}</span>
				</div>
				<div class="total label_info">
					<span class="label">{{ L['需付款'] }}：</span>
					<span class="value">{{ L['R$'] }}{{ $formatMoneyNum(storeItem.orderAmount) }}</span>
				</div>
			</div>

		</div>


	</div>
</template>

<script>
import { getCurrentInstance, computed } from 'vue'
import OrderGoods from './OrderGoods.vue'
import { useStore } from 'vuex'
export default {
	props: {
		storeItem: {
			type: Object,
			default: () => { }
		},
		orderInfo: {
			type: Object,
			default: () => { }
		}
	},
	components: { OrderGoods },
	setup (props) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()

		const showOperateTab = computed(() => {
			let state = [20, 30, 31, 40]
			return state.includes(props.orderInfo.orderState)
		})

		return {
			L,
			showOperateTab,
		}
	},
}
</script>

<style lang='scss' scoped>
.order_remark {
	margin-bottom: 20px;
	line-height: 30px;
	word-break: break-all;
}

.order_store {
	border-top: 1px solid #e8e8f1;

}

.cursor-pointer {
	cursor: pointer;

}

.extra_info {
	padding: 0px 20px;
	padding-bottom: 20px;

}

.order_store .settle_info_store {
	box-sizing: border-box;
	font-size: 14px;
	text-align: right;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 230px;

	.label_info {
		font-size: 12px;
		width: 230px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;

		.label {
			color: #888;
		}

		.value {
			color: #333
		}
	}

	.total {
		font-weight: bold;

		.value {
			color: var(--color_price);
		}
	}
}

.shop_title {
	width: 100%;
	height: 36px;
	background-color: #efeff3;
	line-height: 36px;

	.detail {
		flex: 1;
		text-align: center;
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
	}
}
</style>
