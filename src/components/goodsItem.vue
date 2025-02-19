<template>
	<div class="sld_img sld_img_center">
		<router-link target="_blank" :to="`/goods/detail?productId=${goodsInfo.defaultProductId}`">
			<img :src="goodsInfo.goodsImage" alt="" />
		</router-link>
	</div>
	<p class="flex_row_between_center">
		<span class="sld_goods_price">R$<em>{{ $formatMoneyNum(goodsInfo.goodsPrice || 0) }}</em></span>
	</p>
	<div class="sld_h32_hide">
		<router-link class="sld_goods_name" target="_blank" :to="`/goods/detail?productId=${goodsInfo.defaultProductId}`">
			<span>{{ goodsInfo.goodsName }}</span>
		</router-link>
	</div>
	<div class="sale_num">
		<span>{{ L['已售'] }}</span>
		<span style="color: #596DA3;">{{ goodsInfo.saleNum }}</span>
	</div>
	<!-- <div class="sld_vendor_name">
		<router-link target="_blank" :to="`/store/index?vid=${goodsInfo.storeId}`" class="sld_vendor_name" @click.stop>
			<span>{{ goodsInfo.storeName }}</span>
			<span class="el-icon-arrow-right"></span>
		</router-link>
	</div> -->
	<div class="tag flex_row_start_center">
		<div class="is_own" v-if="goodsInfo.isOwnShop == 1">{{ L['自营'] }} </div>
		<div class="tag_b" :class="{ tag_b_pre_sale: goodsInfo.promotionType == 103 }"
			v-for="({ promotionName }, index) in goodsInfo.activityList" :key="index">
			{{ promotionName }}
		</div>
	</div>
	<div class="op_but flex_row_start_center">
		<div class="but_i first flex_row_center_center" @click.stop="collectGoods">
			<div class="flex_row_center_center">
				<i class="iconfont" style="line-height: 15px;"
					:class="{ iconaixin: !isFollowGoods, iconaixin1: isFollowGoods }"></i>{{ L['收藏']
				}}
			</div>
		</div>
		<div class="but_i second flex_row_center_center" @click.stop="addCart">
			<div class="flex_row_center_center">
				<dynaIcon src="goods/add_cart.png" width="18" height="17" class="collection" color="--color_main">
				</dynaIcon>
				<span style="margin-left: 5px;"> {{ L['加入进货单'] }}</span>
			</div>
		</div>
	</div>
</template>


<script>
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { watch, getCurrentInstance, toRef, computed } from 'vue';
export default {
	props: {
		goodsInfo: Object,
		openModal: Function,
		refresh: Function
	},

	setup (props) {
		const store = useStore()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const isFollowGoods = toRef(props.goodsInfo, 'isFollowGoods')
		const memberInfo = toRef(store.state, 'memberInfo')
		
		watch(() => props.goodsInfo, (nv) => {
			isFollowGoods.value = nv.isFollowGoods
		})

		//加入进货单
		const addCart = () => {
			let { defaultProductId: productId, goodsId, goodsImage, storeName, storeId, goodsPrice } = props.goodsInfo
			if (store.state.loginFlag) {
				let paramsData = {
					productId,
					number: 1
				}
				proxy.$addCart(paramsData)
			} else {
				let paramsData = {
					number: 1,
					goodsId,
					storeId,
					goodsPics: goodsImage,
					storeName,
					productPrice: goodsPrice,
					productStock: 999,
					productId
				}
				proxy.$addCart(paramsData)
			}
		}

		//收藏及取消收藏商品
		const collectGoods = () => {
			if (store.state.loginFlag) {
				//已登录
				let params = {
					productId: props.goodsInfo.defaultProductId,
					isCollect: !isFollowGoods.value
				}
				proxy.$post('v3/supplier/channel/followProduct/update', params).then(res => {
					if (res.state == 200) {
						ElMessage.success(res.msg)
						isFollowGoods.value = !isFollowGoods.value
					} else {
						ElMessage.error(res.msg)
					}
				})
			} else {
				//未登录提示登录
				props.openModal(true)
			}
		}

		return {
			L, addCart, collectGoods, memberInfo, isFollowGoods,
		}
	}
}

</script>


<style lang="scss" scoped>
.super_goods_price {
	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #666666;
	margin-left: 5px;
}
</style>