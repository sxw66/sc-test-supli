<template>
	<div>

		<!-- 阶梯价情况 -->
		<template v-if="ladderPrice">
			<!-- SKu统一设置SKu情况 -->
			<div class="price_line flex_row_start_start ladder_line" v-if="ladderType == 2">
				<div>
					<div class="price_title ladder_title">{{ L['价格'] }}</div>
					<div class="price_title ladder_title">{{ L['采购量'] }}</div>
				</div>

				<div class="ladder_con">
					<el-scrollbar>
						<div class="flex_row_start_center">
							<div class="ladder_price_item" v-for="(item, index) in ladderPriceArr" :key="index"
								:class="{ price_selected: ladderCurrent == index }">
								<div class="ladder_price_item_p">
									<span class="symbol">{{ L['R$'] }}</span>
									<span class="int">{{ $formatMoneyNum(item[1]) }}</span>
									<!-- <span class="decimal">{{ $getPartNumber(item[1], 'decimal') }}</span> -->
								</div>
								<div class="min_num">
									{{ index == 0 ? (saleUnit ? `${minBuyNum}${saleUnit}起订` : `≥${minBuyNum}`) : `≥${item[0]}` }}
								</div>
							</div>
						</div>
						<div></div>
					</el-scrollbar>
				</div>
				<!-- SKu统一设置SKu情况 -->
			</div>

			<div v-if="ladderType == 3" class="price_line flex_row_start_center">
				<!-- SKU单独设置阶梯价情况，仅展示价格区间 -->
				<div class="price_title">{{ L['价格'] }}</div>
				<template v-if="Number(priceRange.max) > Number(priceRange.min)">
					<div class="flex_row_start_center">
						<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
							<span>{{ L['R$'] }}</span>
							<span>
								<span>{{ $formatMoneyNum(priceRange.min)
									}}</span>
							</span>
						</strong>
						<strong class="p_price">&nbsp;&nbsp;~&nbsp;&nbsp;</strong>
						<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
							<span>{{ L['R$'] }}</span>
							<span>
								<span>{{ $formatMoneyNum(priceRange.max)
									}}</span>
							</span>
						</strong>
						<div class="market_price activity_style" v-if="seckillInfo && seckillInfo.state == 1">
							{{ L['秒杀价'] }}：{{ $formatMoneyNum(seckillInfo.seckillPrice) }}</div>
					</div>
				</template>
				<template v-else>
					<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
						<span>{{ L['R$'] }}</span>
						<span>
							<span>{{ $formatMoneyNum(priceRange.min)
								}}</span>
						</span>
					</strong>
				</template>
			</div>
			<!-- 多规格价格end -->

		</template>
		<!-- 阶梯价情况 -->


		<div class="price_line flex_row_start_center" v-else>
			<span class="price_title" :class="{ activity_title: promotionType }">{{ promotionType
			? `${promotionInfo.promotionName}${L['价']}` : L['价格'] }}</span>
			<!-- 多规格价格start -->
			<!-- 正常价格 -->
			<div class="flex_row_start_center" v-if="isMultipleSpec">
				<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
					<span>{{ L['R$'] }}</span>
					<span>
						<span>{{ $formatMoneyNum(priceRange.min)
							}}</span>
					</span>
				</strong>
				<strong class="p_price">&nbsp;&nbsp;~&nbsp;&nbsp;</strong>
				<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
					<span>{{ L['R$'] }}</span>
					<span>
						<span>{{ $formatMoneyNum(priceRange.max)
							}}</span>
					</span>
				</strong>
			</div>
			<!-- 多规格价格end -->

			<!-- 单规格价格start -->
			<div v-else class="flex_row_start_center">
				<strong :class="{ p_price: true, skeleton_p_price: firstLoading }">
					<span>{{ L['R$'] }}</span>
					<span v-if="promotionShowPrice">{{ $formatMoneyNum(promotionShowPrice) }}</span>
					<span v-else>{{ $formatMoneyNum(productPrice) }}</span>
				</strong>
			</div>
			<!-- 单规格价格end -->
		</div>
	</div>

</template>
<script>
import { defineComponent, computed, unref, watch, onMounted } from "vue";
import { getCurLanguage } from '@/utils/common';
import { useStore } from "vuex";

export default defineComponent({
	props: {
		firstLoading: Boolean,
		promotionInfo: Object,
		ladderPrice: String,
		number: Boolean,
		priceRange: Object,
		productPrice: Number,
		isMultipleSpec: Boolean,
		ladderType: [Number, String],
		minBuyNum: Number,
		saleUnit: String,
		promotionType: Number,
		promotionShowPrice: Number
	},

	setup (props, { emit }) {
		const L = getCurLanguage()

		const ladderPriceArr = computed(() => {
			if (props.ladderPrice) {
				let arr = props.ladderPrice.split(",")
				return arr.map(a => a.split('-'))
			} else {
				return []
			}
		})

		const ladderCurrent = computed(() => {
			let index = 0
			unref(ladderPriceArr).forEach((ar, indx) => {
				if (props.number >= Number(ar[0])) {
					index = indx
				}
			});
			return index
		})

		

		watch(props, () => {
			if (unref(ladderPriceArr).length && !props.isInquire) {
				let currentLadderPrice = unref(ladderPriceArr)[unref(ladderCurrent)][1]
				emit('getCurrentLadderPrice', currentLadderPrice)
			}
		}, { immediate: true })



		onMounted(() => {
			console.log(props.priceRange, 'priceRange');
			
		})

		return {
			L,
			ladderPriceArr,
			ladderCurrent,
		}
	}


})
</script>
<style lang="scss">
.ladder_title {
	margin-top: 11px;
	white-space: nowrap;

	&:last-child {
		margin-top: 14px
	}
}


.ladder_con {
	max-width: 400px;
	height: 75px;
}

.ladder_price_item {
	margin-right: 30px;

	&.price_selected {

		.ladder_price_item_p {
			font-weight: bold;
			color: var(--color_price);
		}


		.ladder_price_item_p,
		.min_num {
			color: var(--color_price);

		}
	}

	.ladder_price_item_p {
		.symbol {
			font-size: 16px;
		}

		.int {
			font-size: 26px;
		}

		.decimal {
			font-size: 18px;
		}
	}

	.min_num {
		font-size: 14px;
		color: #333333;
		margin-top: 10px;
		padding-left: 10px
	}
}
</style>