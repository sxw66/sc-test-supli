<!-- 满优惠组件--商品详情 -->
<template>
	<section name="full_discount_product_detail">
		<div class="promotion flex_row_between_center" v-if="fullDisList.length > 0">
			<div class="promotion_left flex_row_start_center">
				<div class="promotion_title">{{ L['促销'] }}</div>
				<div class="promotion_list">
					<template v-for="(fullDisItem, fullDisIndex) in fullDisList" :key="fullDisIndex">
						<span class="promotion_pre" v-for="(descriptionItem, descriptionIndex) in fullDisItem.descriptionList"
							:key="descriptionIndex"><i v-html="descriptionItem"></i>,
						</span>
					</template>
				</div>
			</div>
			<div class="promotion_right" @click="lookFullDiscount">
				{{ L['查看详情'] }} >
			</div>
			<el-dialog v-model="fullDiscountModel" :title="L['满优惠']" width="520px" top="32vh" lock-sroll="false">
				<div class="full_discount_model">
					<div class="full_discount_pre flex_row_start_start" v-for="(fullDisItem, fullDisIndex) in fullDisList"
						:key="fullDisIndex">
						<div class="full_pre_tips"></div>
						<div class="full_pre_con">
							<div class="full_pre_title">
								{{ fullDisItem.promotionName }}
							</div>
							<div class="full_pre_des" v-for="(descriptionItem, descriptionIndex) in fullDisItem.descriptionList"
								:key="descriptionIndex">
								<div class="full_pre_name flex_row_start_center">
									<span v-html="descriptionItem"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</el-dialog>
		</div>
	</section>
</template>
<script>
import { getCurrentInstance, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
export default {

	setup () {
		const { proxy } = getCurrentInstance()
		const fullDisList = ref([])
		const L = proxy.$getCurLanguage()
		const fullDiscountModel = ref(false)
		const route = useRoute()


		//查看满优惠
		const lookFullDiscount = () => {
			fullDiscountModel.value = true
		}

		//获取满优惠促销列表
		const getFullDiscountList = (productId) => {
			let params = {
				productId
			}
			proxy.$get('v3/supplier/channel/goods/activityList', params).then(res => {
				if (res.state == 200) {
					let result = res.data
					res.data.map((item) => {
						item.descriptionList = item.descriptionList.map(i =>
							i.replace(/<(.+?)>/g, function (num) {
								return (
									"<text style='color:var(--color_main)'>" +
									num.slice(1, num.length - 1) +
									'</text>'
								)
							})
						)
						item.descriptionList = item.descriptionList.map(i =>
							i.replace(/x[\d]/g, function (num) {
								return "<text style='color:var(--color_main)'>" + num + '</text>'
							})
						)
					})
					fullDisList.value = result
				}
			})
		}


		onMounted(() => {
			if (route.query.productId) {
				getFullDiscountList(route.query.productId)
			}
		})


		return {
			lookFullDiscount,
			fullDisList,
			L,
			fullDiscountModel
		}
	}
}
</script>
<style lang="scss">
// 促销 start
.promotion {
	margin-top: 10px;

	.promotion_left {
		.promotion_title {
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #666666;
			line-height: 30px;
			margin-right: 20px;
			letter-spacing: 10px;
		}

		.promotion_list {
			width: 415px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;

			.promotion_block {
				.promotion_pre {
					font-size: 14px;
					font-family: Microsoft YaHei;
					font-weight: 400;
					color: #666666;
					line-height: 30px;
				}
			}
		}
	}

	.promotion_right {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #306fbc;
		line-height: 30px;
		cursor: pointer;
	}

	.p_price_four {
		color: var(--color_seckill_main);
	}

	.full_discount_model {
		height: 250px;
		overflow-y: auto;

		.full_discount_pre {
			.full_pre_tips {
				width: 5px;
				height: 5px;
				background: var(--color_main);
				border-radius: 50%;
				margin-top: 5px;
			}

			.full_pre_con {
				margin-left: 10px;
				margin-bottom: 15px;

				.full_pre_title {
					font-size: 16px;
					font-family: Microsoft YaHei;
					font-weight: bold;
					color: #333333;
				}

				.full_pre_des {
					width: 450px;
					border-bottom: 1px dashed #e6e6e6;
					border-radius: 2px;
					padding: 10px;
					box-sizing: border-box;
					margin-top: 10px;

					.full_pre_name {
						span {
							display: block;

							&:nth-child(1) {
								// width: 159px;
								font-size: 14px;
								font-family: Microsoft YaHei;
								font-weight: bold;
								color: #333333;
								border-radius: 8px;
								font-family: Microsoft YaHei;
								font-weight: 400;
								line-height: 16px;
								// text-align: center;
							}

							&:nth-child(2) {
								font-size: 12px;
								font-family: Microsoft YaHei;
								font-weight: 400;
								color: #999999;
								margin-left: 20px;
							}
						}
					}

					.full_pre_desc {
						margin-top: 10px;

						.full_pre_img {
							width: 40px;
							height: 40px;
							background: #ffffff;
							border-radius: 2px;
							background-size: contain;
							background-repeat: no-repeat;
							background-position: center;
							margin-right: 7px;
						}

						.full_pre_right {

							p,
							span {
								width: 328px;
								font-size: 12px;
								font-family: Microsoft YaHei;
								font-weight: 400;
								color: #333333;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							span {
								color: #666666;
								margin-top: 6px;
							}
						}
					}
				}
			}
		}
	}
}

i {
	font-style: normal;
}

// 促销 end</style>