<template>
	<div class="store_hot_sales">
		<div v-if="recommendedList.length > 0">
			<div class="store_hot_sales_list">
				<div class="goods_pre flex_column_between_start" v-for="(recommendItem, recommendIndex) in recommendedList"
					:key="recommendIndex" @click="$goGoodsDetail(recommendItem.defaultProductId)">
					<div class="flex_column_start_start">
						<div class="goods_pre_img" :style="{ backgroundImage: 'url(' + recommendItem.goodsImage + ')' }"></div>
						<div class="goods_name">
							{{ recommendItem.goodsName }}
						</div>
					</div>
					<div class="goods_price">
						<div class="selling_price">
							R${{ $formatMoneyNum(recommendItem.goodsPrice || 0) }}
						</div>
					</div>
				</div>
			</div>
			<div class="flex_row_end_center sld_pagination sld_page_bottom">
				<el-pagination @current-change="handleCurrentChangeSales" v-model:currentPage="page.current"
					:page-size="page.pageSize" layout="prev, pager, next, jumper" :total="page.total" :hide-on-single-page="true">
				</el-pagination>
			</div>
		</div>
		<div v-if="recommendedList.length == 0" class="flex_column_center_center empty_data">
			<SldCommonEmpty :tip="L['暂无相关商品~']" totalWidth="934px" />
		</div>
	</div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

export default {
	props: {
		vid: Number,
		goodsId: Number
	},
	components: {},
	setup (props) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		
		const recommendedList = ref([])
		const page = ref({})
		//获取热销供应商推荐
		const getSalestore = (current) => {
			let params = {
				storeId: props.vid,
				sort: 7,
				pageSize: 20,
				current: current
			}
			proxy.$get('v3/supplier/channel/goods/goodsList', params).then(res => {
				if (res.state == 200) {
					let result = res.data
					page.value = res.data.pagination
					recommendedList.value = result.list.filter(i => i.goodsId != props.goodsId)
					recommendedList.value.map(
						item => (item.goodsPrice = new Number(item.goodsPrice).toFixed(2))
					)
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		const handleCurrentChangeSales = (e) => {
			getSalestore(e)
		}

		onMounted(() => {
			getSalestore(1)
		})

		return {
			L,
			recommendedList,
			page,
			handleCurrentChangeSales,
		}
	},
}
</script>

<style lang='scss' scoped></style>
