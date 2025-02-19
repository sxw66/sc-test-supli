<template>
	<div class="coupon flex_row_start_center" v-show="couponList.length > 0">
		<div class="coupon_title">{{ L['优惠券'] }}</div>
		<div class="coupon_list flex_row_start_center">
			<span class="coupon_pre_rules cursor_pointer" v-for="(couponItem, couponIndex) in couponList"
				:key="couponIndex" v-show="couponIndex < 4" @click="openCouponModel">{{ couponItem.couponContent
				}}</span>
		</div>
		<!-- 优惠券弹框 start -->
		<el-dialog v-model="couponModel" :title="L['领取优惠券']" width="880px" lock-sroll="false">
			<div class="coupon_model" lock-sroll="false">
				<div class="model_coupon_list">
					<CouponItem v-for="(couponItem, couponIndex) in couponList" :key="couponIndex"
						:coupon_item="couponItem" @refreshCouponList="openCouponModel">
					</CouponItem>
				</div>
				<div class="flex_row_end_center sld_pagination sld_page_bottom">
					<el-pagination @current-change="handleCurrentChangeCoupon" v-model:currentPage="curCouponPage"
						:page-size="6" layout="prev, pager, next, jumper" :total="couponPage.total"
						:hide-on-single-page="true">
					</el-pagination>
				</div>
			</div>
		</el-dialog>
		<!-- 优惠券弹框 end -->
	</div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from 'vue'
import CouponItem from '@/components/CouponItem.vue'
export default {
	props: {
		storeId: Number
	},
	components: {
		CouponItem
	},
	setup (props) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const couponList = ref([]) //获取供应商优惠券列表
		const couponPage = ref({})
		const curCouponPage = ref(1)
		const couponModel = ref(false)

		//打开优惠券弹框
		const openCouponModel = () => {
			couponModel.value = true
			getCouponList()
		}
		//上一页优惠券
		const handlePrevCilickChangeCoupon = () => {
			curCouponPage.value--
			getCouponList()
		}
		//下一页优惠券
		const handleNextCilickChangeCoupon = () => {
			curCouponPage.value++
			getCouponList()
		}
		//当前页数优惠券
		const handleCurrentChangeCoupon = () => {
			getCouponList()
		}

		onMounted(() => {
			getCouponList()
		})


		//获取供应商优惠券列表
		const getCouponList = () => {
			let params = {
				storeId: props.storeId,
				current: curCouponPage.value,
				pageSize: 6
			}
			proxy.$get('v3/supplier/channel/coupon/storeCouponList', params).then(res => {
				if (res.state == 200) {
					let result = res.data
					couponList.value = result.list
					couponPage.value = result.pagination
				}
			})
		}


		return {
			curCouponPage,
			couponList,
			couponPage,
			openCouponModel,
			handlePrevCilickChangeCoupon,
			handleNextCilickChangeCoupon,
			handleCurrentChangeCoupon,
			L,
			couponModel
		}
	},
}
</script>

<style lang='scss' scoped>
/**优惠券弹框 start**/
.coupon_model {
	.model_coupon_list {
		display: flex;
		flex-wrap: wrap;

		.sld_coupon_item {
			margin-right: 10px !important;
		}

		.sld_coupon_item:nth-child(2n) {
			margin-right: 0 !important;
		}
	}
}

/**优惠券弹框 end**/
.coupon {
	.el-dialog__header {
		padding-top: 18px;
		padding-bottom: 18px;

		.el-dialog__title {
			color: #333333;
			font-family: Microsoft YaHei;
			font-weight: bold;
		}

		.el-dialog__close {
			color: #333333;
			font-size: 20px;
		}
	}

	.el-dialog__body {
		background: #f8f8f8;
	}

	margin-top: 10px;

	.coupon_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
		line-height: 30px;
		white-space: nowrap;
		margin: 5px 0;
	}

	.coupon_list {
		margin-left: 22px;
		flex-wrap: wrap;

		.coupon_pre_rules {
			height: 26px;
			border: 1px solid var(--color_main);
			border-radius: 3px;
			background: var(--color_halo);
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: 500;
			color: var(--color_main);
			line-height: 26px;
			padding: 0 8px;
			text-align: center;
			margin: 5px 0;
			margin-right: 10px;
			overflow: hidden;
		}
	}
}
</style>
