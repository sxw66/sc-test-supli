<template>
	<!-- 失效商品 start -->
	<div class="invalid_goods">
		<div class="invalid_goods_title">
			<span>{{ L['失效商品'] }}</span>
			<span @click="emit('clearInvalidGoods')">{{ L['清空'] }}</span>
		</div>
		<div class="invalid_goods_list">
			<div class="invalid_goods_pre flex_row_start_center" v-for="(invalidItem, invalidIndex) in invalidList"
				:key="invalidIndex">
				<span class="invalid_tips">{{ L['失效'] }}</span>
				<div :style="{
				backgroundImage: 'url(' + invalidItem.productImage + ')'
			}" class="invalid_img"></div>
				<div class="invalid_des">
					<p class="invalid_name">{{ invalidItem.goodsName }}</p>
					<p class="invalid_spec">{{ invalidItem.specValues }}</p>
				</div>
				<div class="invalid_num flex_column_center_center">
					<div class="invalid_edit_num flex_row_center_center">
						<span>-</span>
						<input type="number" disabled :value="invalidItem.buyNum" />
						<span>+</span>
					</div>
				</div>
				<div class="invalid_price">R${{ $formatMoneyNum(invalidItem.productPrice || 0) }}</div>

				<div class="invalid_subtotal">R${{ $formatMoneyNum(invalidItem.subtotal || 0) }}</div>
				<div class="invalid_btn flex_column_center_start">

					<span class="invalid_del" @click="delCartGoods('goods', invalidItem)">{{ L['删除']
						}}</span>
				</div>
			</div>
		</div>
	</div>
	<!-- 失效商品 -->
</template>

<script>
import { getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'
export default {
	props: {
		invalidList: {
			type: Array,
			default: () => []
		}
	},
	components: {},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const loginFlag = store.state.loginFlag
		
		return {
			loginFlag,
			L,
		}
	},
}
</script>

<style lang='scss' scoped></style>
