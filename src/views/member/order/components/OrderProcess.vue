<template>
	<div>
		<!-- 正常订单 -->
		<div v-if="orderInfo.orderState != 0" class="order_top_info_progress flex_row_center_center">
			<div class="progress_item">
				<p>{{ L['提交订单'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderLogs.length >= 1 }">1</span>
					<div class="progress_line">
						<div class="content"
							:class="{ active: orderLogs.length >= 1, current: orderLogs.length == 1 }">
						</div>
					</div>
				</div>
			</div>
			<div class="progress_item">
				<p>{{ L['支付订单'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderLogs.length >= 2 }">2</span>
					<div class="progress_line">
						<div
							:class="{ content: true, active: orderLogs.length >= 2, current: orderLogs.length == 2 }">
						</div>
					</div>
				</div>
			</div>
			<div class="progress_item">
				<p>{{ L['商家发货'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderLogs.length >= 3 }">3</span>
					<div class="progress_line">
						<div
							:class="{ content: true, active: orderLogs.length >= 3, current: orderLogs.length == 3 }">
						</div>
					</div>
				</div>
			</div>
			<div class="progress_item">
				<p>{{ L['确认收货'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderLogs.length >= 4 }">4</span>
					<div class="progress_line">
						<div
							:class="{ content: true, active: orderLogs.length >= 4, current: orderLogs.length == 4 && orderInfo.evaluateState != 3 }">
						</div>
					</div>
				</div>
			</div>
			<div class="progress_item">
				<p>{{ L['评价'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderInfo.evaluateState == 3 }">5</span>
				</div>
			</div>
		</div>
		<!-- 交易关闭订单 -->
		<div v-if="orderInfo.orderState == 0" class="order_top_info_progress flex_row_center_center">
			<div class="progress_item">
				<p>{{ L['提交订单'] }}</p>
				<div class="progress flex_row_center_center">
					<span :class="{ active: orderLogs.length >= 1 }">1</span>
					<div class="progress_line">
						<div class="content"
							:class="{ active: orderLogs.length >= 1, current: orderLogs.length == 1 }">
						</div>
					</div>
				</div>
			</div>
			<div class="progress_item">
				<p>{{ L['交易关闭'] }}</p>
				<div class="progress flex_row_start_center">
					<span class="active">2</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { getCurrentInstance } from 'vue'
export default {
	props: {
		orderLogs: {
			type: Array,
			default: () => []
		},
		orderInfo: {
			type: Object,
			default: () => { }
		}
	},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		return {
			L
		}
	}
}
</script>
<style lang="scss">
.order_top_info_progress {
	width: 850px;

	.progress_item {
		.progress {
			text-align: center;
			margin-top: 20px;

			span {
				position: relative;
				display: inline-block;
				width: 24px;
				height: 24px;
				line-height: 14px;
				border: 5px solid #eeeeee;
				border-radius: 50%;
				color: #9f9f9f;
				z-index: 2;

				&.active {
					border: 5px solid var(--color_main);
					color: var(--color_main);
				}
			}

			.progress_line {
				width: 140px;
				height: 6px;
				background-color: #eeeeee;
				z-index: 1;

				.content {
					width: 100%;
					height: 100%;

					&.active {
						background-color: var(--color_main);
					}

					&.current {
						width: 60%;
					}
				}
			}
		}
	}
}
</style>