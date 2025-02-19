<template>
	<div class="goods_pre flex_row_start_center">
		<!-- 可选择 1-正常状态，2-商品失效（已删除），3-商品无货-->
		<div class="goods_pre_sel">
			<div v-if="cartItem.productState != 3">
				<div @click="changeSelectState('goods', cartItem.checkedAll, cartItem)" class="check_img">
					<myCheckBox :checked="cartItem.checkedAll"></myCheckBox>
				</div>
			</div>
			<!-- 不可选择 无货-->
			<div v-else>
				<img src="@/assets/cart/no_sel.png" alt="" class="store_sel" />
			</div>
		</div>

		<!-- 商品信息 -->
		<div class="flex_row_start_start goods_info_con">

			<div :style="{ backgroundImage: 'url(' + cartItem.mainImage + ')' }" class="goods_img"
				:class="{ no_stock_img: cartItem.productState == 3 }"
				@click="$goGoodsDetail(cartItem.goodsCartList[0].productId)">
			</div>
			<div class="goods_des" @click="$goGoodsDetail(cartItem.goodsCartList[0].productId)">
				<p class="goods_name" :class="{ no_stock_name: cartItem.productState == 3 }">
					{{ cartItem.goodsName }}
				</p>
				<p class="goods_spec" :class="{ no_stock_spec: cartItem.productState == 3 }">
					{{ cartItem.specValues }}
				</p>
			</div>

			<div class="sku_list">
				<div style="position:relative">
					<div v-for="(item, index) in cartItem.goodsCartList" :key="index" class="sku_item_wrap"
						style="margin-bottom:20px">
						<div class="flex_row_start_center sku_item">
							<!-- 单个sku规格 -->
							<div class="goods_sku flex_row_start_start">
								<div class="goods_pre_sel">
									<div v-if="(item.productState != 3 && item.productStock > 0)">
										<div @click="changeSelectState('spec', item.isChecked, item)">
											<myCheckBox :checked="item.isChecked == 1"></myCheckBox>
										</div>
									</div>
									<!-- 不可选择 无货-->
									<div class="invalid_sku" v-if="(item.productStock == 0)">
										{{ L['失效'] }}
									</div>
								</div>
								<div class="sku_spec">
									<div class="sku_value" @click="$goGoodsDetail(item.productId)">
										{{ item.specValues || L['默认'] }}</div>
									<div class="product_code" v-show="item.orderCode">
										{{ L['订货编码：'] }}{{ item.orderCode }}</div>
									<div class="product_code" v-show="item.productCode">
										{{ L['物料编码：'] }}{{ item.productCode }}</div>
								</div>
							</div>
							<!-- 数量 -->
							<div class="goods_num flex_row_start_start">
								<div class="flex_column_center_center">
									<div class="goods_edit_nem flex_row_center_center">
										<span @click="editNum('reduce', item)">-</span>
										<input type="number" v-model="item.buyNum" @input="editNum('edit', item, $event)"
											@blur="editNum('blur', item, $event)" @keyup="hanleKey" />
										<span @click="editNum('add', item)">+</span>
										<div class="disabled_mask" v-if="(item.productStock == 0)">
										</div>
									</div>
									<div class="goods_stocks" v-if="(item.productState == 1)">
										{{ L['库存'] }} {{ item.productStock }} {{ item.saleUnit }}
									</div>
									<div class="goods_stocks" v-if="(item.productState == 3)" style="color:#e2231a">
										{{ L['库存'] }} {{ item.productStock }} ({{ L['库存不足'] }})
									</div>
								</div>
								<div class="goods_edit_nem_after" v-if="item.saleUnit">
									{{ cartItem.saleUnit }}
								</div>

							</div>
							<!-- 单价 -->
							<div class="goods_price_prom">
								<div class="goods_price" :class="{ no_stock_price: (item.productState == 3 || item.productStock == 0) }"
									v-show="cartItem.ladderType != 2 || (cartItem.ladderType == 2 && cartItem.goodsCartList.length <= 1)">
									<priceComponent :ladderPrice="item.ladderPrice" :price="item.productPrice" :number="item.buyNum">
									</priceComponent>
								</div>
							</div>
							<!-- 小计 -->
							<div class="subtotal">
								{{ L['R$'] }}{{ $formatMoneyNum(item.totalAmount) }}
							</div>
							<!-- 操作 -->
							<div class="goods_btn flex_column_center_start">
								<span class="goods_collect" @click="emit('moveCartGoods', item.cartId)">
									{{ L['移入收藏夹'] }}
								</span>
								<el-popconfirm :title="L['确定删除选中商品？']" @confirm="emit('delCartGoods', 'goods', item)"
									:confirmButtonText="L['确定']" :cancelButtonText="L['取消']">
									<template #reference>
										<span class="goods_del">{{ L['删除'] }}</span>
									</template>
								</el-popconfirm>
							</div>
						</div>
					</div>

					<div class="price_for_ladder"
						v-if="cartItem.ladderType == 2 && cartItem.goodsCartList && cartItem.goodsCartList.length > 1">
						<div class="goods_price" :class="{ no_stock_price: (cartItem.productState == 3) }">
							<priceComponent :goodsItem="cartItem.goodsCartList[0]"
								:ladderPrice="cartItem.goodsCartList[0].ladderPrice" :price="cartItem.goodsCartList[0].goodsPrice"
								:number="cartItem.totalNum">
							</priceComponent>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, computed, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { debounceFn } from '@/utils/common'
import priceComponent from '@/components/priceComponent';
export default {
	props: {
		cartItem: {
			type: Object,
			default: () => ({})
		}
	},
	components: {
		priceComponent
	},
	setup (props, { emit }) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const { loginFlag } = store.state
		const buyNum = ref(props.cartItem['buyNum'])

		

		const subTotal = computed(() => {
			let { buyNum, productPrice } = props.cartItem

			if (buyNum) {
				return (Number(buyNum) * Number(productPrice)).toFixed(2)
			}

			return Number(productPrice).toFixed(2)
		})

		const changeSelectState = (type, checkState, target) => {
			emit('selectState', type, checkState, target)
		}

		const debounceEdit = debounceFn((pC, c) => emit('editNum', pC, c), 450)


		const editNum = (type, item) => {
			let { takeOffNum, minBuyNum } = item
			let maxMin = Math.min(props.cartItem.productStock, 99999)
			switch (type) {
				case 'reduce': {
					if (item.buyNum > minBuyNum) {
						item.buyNum -= takeOffNum
					} else {
						item.buyNum = minBuyNum
						ElMessage(`最低限购${minBuyNum}件!`)
					}
					break
				}

				case 'add': {
					item.buyNum += takeOffNum
					if (item.buyNum > maxMin) {
						ElMessage(L['数量超出购买范围！'])
						item.buyNum = maxMin
					}
					break
				}

				case 'edit': {
					if (item.buyNum == 0 && item.buyNum == '') {
						item.buyNum = 1
					} else {
						item.buyNum = item.buyNum.replace(/\D/g, '')
						if (item.buyNum > maxMin) {
							item.buyNum = maxMin
						}
					}
					break
				}
				case 'blur': {
					if (item.buyNum == '') {
						item.buyNum = 1
					}
				}
			}
			let curNumber = item.buyNum
			debounceEdit(item, curNumber)
		}


		return {
			editNum,
			L,
			subTotal,
			loginFlag,
			changeSelectState,
			emit,
			buyNum,
		}
	},
}
</script>

<style lang='scss' scoped>
.goods_pre {
	padding: 0px 0 0px 20px;
	width: 100%;
	position: relative;

	&:nth-last-child(1) {
		.goods_info_con {
			border: none;
		}
	}


	background: #faf4ee;

	&:nth-child(1) {
		border-radius: 10px 10px 0px 0px;
		// overflow: hidden;
	}

	.goods_pre_sel {
		width: 14px;
		height: 14px;
		cursor: pointer;

		img {
			width: 14px;
			height: 14px;
		}
	}

	.goods_info_con {
		border-bottom: 1px solid #dedede;
		flex: 1;
		margin-left: 20px;
		padding: 20px 0;
	}

	.goods_img {
		width: 100px;
		height: 100px;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		margin: 0 19px 0 0;

		&.no_stock_img {
			opacity: 0.6;
		}
	}

	.goods_des {
		margin-right: 15px;

		.goods_name {
			width: 205px;
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #333333;
			line-height: 18px;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;

			&.no_stock_name {
				color: #999999;
			}
		}

		.goods_spec {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #999999;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
			margin-top: 21px;
			line-height: 20px;

			&.no_stock_spec {
				color: #bbbbbb;
			}
		}
	}

	.goods_price_prom {
		width: 155px;

		.goods_price {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #333333;
			width: 120px;
			text-align: center;
			margin-left: 35px;

			&.no_stock_price {
				color: #999999;
			}

		}

		.promotion {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: var(--color_main);
			text-align: center;
			margin-top: 18px;

			i {
				color: var(--color_main);
				font-size: 10px;
				margin-left: 4px;
			}
		}
	}

	.sku_list {
		position: relative;

		.sku_item:nth-child(n + 2) {
			margin-top: 20px;
		}

		.price_for_ladder {
			width: 110px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 242px;
			text-align: center;
		}
	}

	.goods_sku {
		margin-right: 5px;
		width: 185px;
		height: 100%;
		align-self: flex-start;

		.sku_spec {
			margin-left: 5px;
			margin-top: 2px;

			.sku_value {
				font-size: 12px;
				font-family: SourceHanSansCN-Regular;
				color: #333333;
				cursor: pointer;

				&:hover {
					color: var(--color_main);
				}
			}

			.product_code {
				font-size: 12px;
				font-family: SourceHanSansCN-Regular;
				color: $colorH;
				margin-top: 5px;
				word-break: break-all;
			}
		}
	}

	.goods_num {
		width: 156px;
		margin-left: 18px;


		.goods_edit_nem {
			width: 99px;
			background: #ffffff;
			border: 1px solid #dddddd;

			span {
				width: 30px;
				height: 30px;
				background: #fafafa;
				text-align: center;
				display: block;
				line-height: 30px;
				cursor: pointer;
			}

			input {
				width: 39px;
				height: 30px;
				border: none;
				border-left: 1px solid #dddddd;
				border-right: 1px solid #dddddd;
				text-align: center;
				line-height: 30px;
			}

			/*** 消除input元素 type="number" 时默认的 加减按钮*/
			input[type="number"]::-webkit-inner-spin-button,
			input[type="number"]::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}

			/*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
			input[type="number"] {
				-moz-appearance: textfield;
			}
		}

		.goods_stocks {
			font-size: 12px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #333333;
			margin-top: 11px;

			&.goods_stocks_red {
				color: $colorMain;
			}

			&.goods_stocks_no {
				color: $colorMain;
			}
		}
	}

	.subtotal {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: var(--color_price);
		text-align: center;
		margin-left: 14px;
		width: 130px;

	}

	.goods_btn {
		margin-left: 30px;

		.goods_collect {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #333;
			cursor: pointer;
			margin-bottom: 12px;

			&:hover {
				color: var(--color_vice);
			}
		}

		.goods_del {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #333;
			cursor: pointer;

			&:hover {
				color: var(--color_vice);
			}
		}
	}
}
</style>
