<template>
	<!-- 相关推荐 start -->
	<div class="more_goods">
		<div class="more_goods_title flex_row_center_center">
			<span class="dot"></span>
			<div class="see_title">{{ L['看了又看'] }}</div>
			<span class="dot"></span>
		</div>
		<div class="more_goods_list flex_column_center_center">
			<template v-if="firstLoading">
				<div class="more_goods_pre" v-for="(recommendItem, recommendIndex) in [{ a: 1 }, { b: 2 }, { c: 3 }]"
					:key="recommendIndex">
					<div :class="{ more_goods_pre_img: true, skeleton_more_goods_pre_img: firstLoading }"></div>
					<p :class="{ skeleton_more_goods_pre_goods_name: firstLoading }">
						{{ recommendItem.goodsName }}
					</p>
					<p>
						<span :class="{ skeleton_more_goods_pre_goods_price: firstLoading }"></span>
					</p>
				</div>
			</template>
			<template v-else>
				<div class="more_goods_pre" v-for="(recommendItem,
				recommendIndex) in recommendeList" :key="recommendIndex" v-show="recommendIndex < 3"
					@click="$goGoodsDetail(recommendItem.defaultProductId)">
					<div class="more_goods_pre_img flex_row_center_center">
						<img :src="recommendItem.goodsImage" :title="recommendItem.goodsName" />
					</div>
					<p>{{ recommendItem.goodsName }}</p>
					<p>{{ L['R$'] }}{{ $formatMoneyNum(recommendItem.goodsPrice) }}</p>
				</div>
			</template>
		</div>
	</div>
	<!-- 相关推荐 end -->
</template>

<script>
import { getCurrentInstance, ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from "vuex";

export default {
	props: {
		vid: Number
	},
	setup (props) {

		const firstLoading = ref(false)
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const recommendeList = ref([])
		
		//获取看了又看商品(人气数)
		const getRecommend = () => {
			let params = {
				storeId: props.vid,
				sort: 5,
				pageSize: 3,
				current: 1
			}
			proxy.$get('v3/supplier/channel/goods/goodsList', params).then(res => {
				if (res.state == 200) {
					firstLoading.value = false
					let result = res.data
					recommendeList.value = result.list
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		watch(() => props.vid, getRecommend)


		onMounted(() => {
			firstLoading.value = true
			getRecommend()
		})

		return {
			L,
			firstLoading,
			recommendeList,
		}
	}
}

</script>

<style lang="scss" scoped>
.more_goods {
	margin-left: 24px;

	.more_goods_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #333333;
		line-height: 30px;
		text-align: center;
		margin-bottom: 10px;

		.see_title {
			margin: 0 11px;
		}

		.dot {
			display: block;
			width: 35px;
			height: 1px;
			background: #eee;
		}
	}

	.more_goods_list {
		.more_goods_pre {
			margin-bottom: 10px;
			cursor: pointer;

			.skeleton_more_goods_pre_goods_name {
				background: $colorSkeleton;
				width: 100%;
				height: 13px;
			}

			.skeleton_more_goods_pre_goods_price {
				background: $colorSkeleton;
				height: 13px;
				width: 60px;
				display: inline-block;
			}

			.more_goods_pre_img {
				width: 150px;
				height: 150px;
				overflow: hidden;

				&.skeleton_more_goods_pre_img {
					background: $colorSkeleton;
				}

				&:hover {
					img {
						-webkit-transform: scale(1.05);
						-ms-transform: scale(1.05);
						-o-transform: scale(1.05);
						-moz-transform: scale(1.05);
						transform: scale(1.05);
					}
				}

				img {
					max-height: 100%;
					max-width: 100%;
					-webkit-transition: -webkit-transform 0.5s;
					transition: -webkit-transform 0.5s;
					-moz-transition:
						transform 0.5s,
						-moz-transform 0.5s;
					transition: transform 0.5s;
					transition:
						transform 0.5s,
						-webkit-transform 0.5s,
						-moz-transform 0.5s;
				}
			}

			p:nth-of-type(1) {
				width: 150px;
				font-size: 13px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #333333;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				text-align: center;
				margin: 10px 0;
				margin-bottom: 5px;
			}

			p:nth-of-type(2) {
				width: 150px;
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: bold;
				color: var(--color_price);
				text-align: center;
			}
		}
	}
}
</style>