<template>
	<div v-if="couponList.length > 0">
		<div class="paging flex_row_end_center" v-if="couponList.length > 8">
			<span class="iconfont iconfanhui" @click="changePage('prev')"></span>
			<span class="page flex_row_center_center">{{ current }}</span>
			<span class="xie">/</span>
			<span class="total flex_row_center_center">{{ total }}</span>
			<span class="iconfont iconfanhui" style="transform:rotate(-180deg)" @click="changePage('next')"></span>
		</div>
		<div class="coupon_list">
			<template v-for="(item, index) in couponList" :key="index">
				<div class="coupon_cont flex_row_between_center" :class="{ coupon_contone: item.checked }"
					:style="{ cursor: 'pointer' }" v-if="index >= start && index <= end" @click="checkCoupon(item)">
					<div class="coupons">
						{{ getCouponName(item.couponType) }}
					</div>
					<div class="coupon_cont_box flex_column_between_start">
						<div>
							<div class="money cp_chosen" v-if="item.couponType != 2">
								<span>{{ L['R$'] }}</span>{{ $formatMoneyNum(item.discount || 0) }}
							</div>
							<template v-else-if="item.couponType == 4">
								<div class="money" :class="{ cp_chosen: item.checked }" v-if="item.value > 0">
									{{ L['R$'] }}{{ $formatMoneyNum(item.value || 0) }}
								</div>
								<div class="money" style="font-size:18px" :class="{ cp_chosen: item.checked }" v-else>
									免运费
								</div>
							</template>
							<div class="money cp_chosen" v-else>
								{{ $formatMoneyNum(item.value) }}<span>{{ L['折'] }}</span>
							</div>
						</div>

						<div class="full_minus flex_row_center_center">
							{{ item.content }}
						</div>
						<div class="coupon_time">{{ item.useTime }}</div>
						<div class="user_rule">
							<span>{{ L['使用规则：'] }}</span>{{ item.description }}
						</div>
					</div>
					<img src="@/assets/coupon.png" alt="" class="img_coupon" v-if="item.checked == false" />
					<div class="coupon_img" v-else>
						<dynaIcon src="buy/corner_icon.png" color="--color_coupon_main" width="23" height="23">
						</dynaIcon>
					</div>
				</div>
			</template>
		</div>
	</div>
	<div v-else>
		<SldCommonEmpty :tip="`暂无${type == 'platForm' ? '平台优惠券' : '运费券'}`" :totalHeight="230" :paddingTop="10" />
	</div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, watch, computed } from 'vue';
import { useStore } from 'vuex';
export default {
	props: {
		couponList: Array,
		invokeFn: Function,
		type: String
	},
	setup (props) {

		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const total = ref(props.totalNum)

		

		const getCouponName = (couponType) => {
			switch (couponType) {
				case 1: {
					return L['固定金额券']
				}
				case 2: {
					return L['折扣券']
				}
				case 3: {
					return L['随机金额券']
				}
				case 4: {
					return L['运费券']
				}
				default: {
					return ''
				}
			}
		}

		const current = ref(1)
		const start = ref(0)
		const end = ref(7)
		const currentCouponCode = ref('')

		const changePage = (type) => {
			if (type == 'prev') {
				if (current.value == 1) return
				current.value--
			} else {
				if (current.value == total.value) return
				current.value++
			}
			start.value = (current.value - 1) * 8
			end.value = (current.value) * 8 - 1
		}

		const checkCoupon = (val) => {
			//运费券可以多选
			if (props.type == 'freight') {
				val.checked = !val.checked
				let checkedCoupon =props.couponList.filter(item=>item.checked).map(jtem=>jtem.couponCode)
				props.invokeFn(checkedCoupon.toString())
				return
			}

			val.checked = !val.checked
			if (currentCouponCode.value == val.couponCode) {
				currentCouponCode.value = ''
			} else {
				currentCouponCode.value = val.couponCode
			}
			props.invokeFn(currentCouponCode.value)
		}

		watch(() => props.couponList, (nv) => {
			total.value = Math.ceil(nv.length / 8)
		}, { deep: true })

		onMounted(() => {
			total.value = Math.ceil(props.couponList.length / 8)
		})


		return {
			total,
			checkCoupon,
			getCouponName,
			current,
			start,
			end,
			changePage,
			L,
			currentCouponCode,
		}
	}
}
</script>

<style lang="scss">
.iconfanhui {
	color: #999;
	cursor: pointer;
}

.iconfanhui:hover {
	color: var(--color_main);
}
</style>