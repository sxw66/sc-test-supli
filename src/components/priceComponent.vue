<template>
	<div>
		<template v-if="ladderPriceArr.length > 1">
			<template v-if="ladderDisplay == 'ladder'">
				<div :class="[ladderCurrent == inx ? 'price_main' : 'price_sub']" v-for="(ite, inx) in ladderPriceArr"
					:key="inx" class="ladder_price">
					R${{ $formatMoneyNum(ite[1]) }}（≥{{ ite[0] }}）
				</div>
			</template>

			<template v-else-if="ladderDisplay == 'single'">
				<span>R$</span>
				<span>{{ $formatMoneyNum(ladderPriceArr[ladderCurrent][1]) }}</span>
			</template>

		</template>
		<template v-else>
			<span>R$</span>
			<span>{{ $formatMoneyNum(price) }}</span>
		</template>
	</div>
</template>

<script>
import { unref, watch, computed } from 'vue'
import { useLadderPrice } from '@/utils/hooks'
import { useStore } from 'vuex'

export default {

	props: {
		goodsItem: Object,
		ladderPrice: Array,
		number: Number,
		price: [Number, String],
		ladderDisplay: {
			type: String,
			default: 'ladder'
		}
	},

	setup (props, { emit }) {
		

		const { ladderPriceArr, ladderCurrent, setNumber } = useLadderPrice(props.ladderPrice, props.number)

		watch(() => props.number, () => {
			setNumber(props.number)
			if (unref(ladderPriceArr).length) {
				let currentLadderPrice = unref(ladderPriceArr)[unref(ladderCurrent)][1]
				emit('getCurrentLadderPrice', Number(currentLadderPrice))
			}
		})

		return {
			ladderCurrent,
			ladderPriceArr,
		}
	}
}
</script>

<style lang="scss" scoped>
.price_main {
	font-weight: bold;
	color: var(--color_price);
	font-size: 13px;
}

.price_sub {
	color: #666 !important;
	font-size: 13px;
	font-weight: 400 !important;
}
</style>, watch