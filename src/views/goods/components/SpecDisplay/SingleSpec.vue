<template>
	<div class="last_spec_pre">
	  <table>
		<tbody>
		  <tr class="last_spec_item single_spec_item">
			<td>
			  <div class="flex_row_start_start" style="margin-right: 20px;">
				<SpecCheckIcon :checkState="1" :disabled="defaultProduct.productStock == 0" style="margin-top: 9px;" />
				<div>
				  <SpecValueItem :specValue="{ checkState: 1, specValue: defaultProduct.getSpecValues ? defaultProduct.getSpecValues : L['默认'] }" />
				  <div class="code_text" v-if="defaultProduct.goodsCode">
					<span>{{ L['商品编码'] }} &nbsp;</span>
					<span>{{ defaultProduct.goodsCode }}</span>
				  </div>
				</div>
			  </div>
			</td>
  
			<td>
			  <div class="product_price flex_row_center_center" style="font-size:14px;">
				<div v-if="defaultProduct.ladderPrice">
				  <priceComponent :ladderPrice="defaultProduct.ladderPrice" :number="currentSpecNum" :price="saleModelPrice" />
				</div>
				<template v-else>
				  <span>{{ L['价格'] }}：</span>
				  <span>{{ saleModelPrice }}</span>
				</template>
			  </div>
			</td>
  
			<td>
			  <div class="flex_row_center_start">
				<div class="flex_column_center_center">
				  <SpecItemEdit :specValue="defaultProduct" :minBuyNum="staticInfo.minBuyNum" v-model:editNum="currentSpecNum" from="single" />
				  <div class="product_stock" v-if="defaultProduct.productStock">
					{{ L['库存'] }}&nbsp;{{ defaultProduct.productStock }}
				  </div>
				  <div class="product_stock" v-else>
					{{ L['库存不足'] }}
				  </div>
				  <div class="sale_unit_des" v-if="staticInfo.saleUnitDes">
					{{ staticInfo.saleUnitDes }}
				  </div>
				</div>
				<span style="margin-left: 10px;margin-top: 10px;" v-if="staticInfo.saleUnit">{{ staticInfo.saleUnit }}</span>
			  </div>
			</td>
		  </tr>
		</tbody>
	  </table>
	</div>
  </template>  
<script>
import { defineComponent, ref, watch, computed } from 'vue';
import { getCurLanguage } from '@/utils/common';
import { SpecCheckIcon, SpecValueItem, SpecItemEdit } from './SpecValueItem.js'
import priceComponent from '@/components/priceComponent'
export default defineComponent({
	components: {
		SpecCheckIcon, SpecValueItem, SpecItemEdit, priceComponent
	},
	props: {
		defaultProduct: Object,
		staticInfo: Object
	},
	setup (props, { emit }) {
		const currentSpecNum = ref(props.staticInfo.minBuyNum ?? 1)
		const L = getCurLanguage()
		let timer = null

		const saleModelPrice = computed(() => props.staticInfo.saleModel == 1 ? props.defaultProduct.productPrice : props.staticInfo.wholesalePrice)


		watch(currentSpecNum, () => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				emit('changeNum', currentSpecNum.value)
			}, 500);
		})

		return {
			currentSpecNum,
			L,
			saleModelPrice
		}
	}
})
</script>
<style lang="scss">
.last_spec_pre {
	width: 100%;
	padding-left: 10px;

	table {
		width: 100%;

		&.fold_state {
			tr:nth-child(n + 4) {
				display: none;
			}
		}

		td {
			width: 30%;
			vertical-align: top;
			padding: 14px 0;
		}
	}

	.last_spec_item {
		&:not(:last-child) td {
			border-bottom: 1px dashed #e5e5e5 !important;
		}

		&:first-child td {
			padding-top: 0;
		}

		&.single_spec_item td {
			padding-bottom: 0;
		}

		.iconduihao1,
		.iconyuanquan1 {
			font-size: 15px;
			margin-right: 15px;
			cursor: pointer;
		}

		.iconduihao1 {
			color: var(--color_main);
		}

		.specval_pre {
			margin-right: 7px;
			width: fit-content;

			.specval_pre_image {
				width: 48px;
				height: 48px;
				border-radius: 3px;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
			}

			span {
				max-width: 190px;
				color: #333333;
				font-size: 14px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				background: #ffffff;
				border: 1px solid #dfdfdf;
				border-radius: 3px;
				box-sizing: border-box;
				line-height: 1.6;
				white-space: normal;
				padding: 4px 10px;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				word-break: break-all;
				text-overflow: ellipsis;
				cursor: default;
			}
		}

		.specval_pre_active {
			position: relative;

			span {
				// display: inline-block;
				// max-width: 184px;
				border: 1px solid var(--color_main);
			}

			.iconyixuan {
				position: absolute;
				bottom: -0.5px;
				right: 0.5px;
				color: var(--color_main);
			}
		}

		.specval_pre_disabled {
			position: relative;
			opacity: 0.2;
		}

		.goodsSpec {
			font-size: 14px;
			font-family: SourceHanSansCN-Regular;
			color: #333333;
			margin-left: 30px;
		}

		.product_stock {
			font-weight: 400;
			font-size: 12px;
			color: #999999;
			line-height: 18px;
			margin-top: 3px;
		}

		.product_price {
			font-size: 16px;
			font-family: Source Han Sans CN;
			font-weight: bold;
			line-height: 17px;
			color: var(--color_price);
			margin-right: 20px;
			text-align: center;
		}

		.quantity_inventory {
			margin-top: 0;
		}
	}
}



// 数量加减及库存 start
.quantity_inventory_multi {
	.quantity_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
		line-height: 30px;
		letter-spacing: 12px;
	}

	.quantity_edit {
		border: 1px solid #dfdfdf;
		position: relative;
		border-radius: 3px;
		overflow: hidden;
		font-weight: bold;

		span {
			-moz-user-select: none;
			/*火狐*/
			-webkit-user-select: none;
			/*webkit浏览器*/
			-ms-user-select: none;
			/*IE10*/
			user-select: none;
			display: block;
			width: 30px;
			height: 30px;
			border: none;
			border-radius: 3px;
			text-align: center;
			line-height: 29px;
			cursor: pointer;
			font-size: 16px;
			color: #333333;
		}

		input {
			width: 48px;
			height: 30px;
			border: none;
			border-left: 1px solid #ddd;
			border-right: 1px solid #ddd;
			text-align: center;
			cursor: pointer;
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

	.inventory {
		font-size: 12px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: $colorH;
		line-height: 30px;
		margin-left: 17px;
	}
}

.code_text {
	font-family: Microsoft YaHei;
	font-weight: 400;
	font-size: 11px;
	color: #999999;
	line-height: 14px;
	margin-top: 5px;
}
</style>
