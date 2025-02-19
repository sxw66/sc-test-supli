<template>
	<div class="left">
		<!-- <div class="store_info">
			<div class="store_info_title flex_row_start_center">
				<span class="store_type" v-if="storeInfo.isOwnStore == 1">{{ L['自营'] }}</span>
				<span class="store_title" @click="goStore()" :title="storeInfo.storeName">
					{{ storeInfo.storeName }}
				</span>
				<dynaIcon src="goods/link_server.png" width="20" height="20" class="img" style="margin-right: 5px;"
					color="--color_main" @click="kefu"></dynaIcon>
			</div>
			<div class="store_des">
				<div class="store_des_pre" v-show="storeInfo.isOwnStore != 1">
					<span>{{ L['供应商等级'] }}</span>
					<span>{{ storeInfo.storeGradeName }}</span>
				</div>
				<div class="store_des_pre">
					<span>{{ L['商品评价'] }}</span>
					<span :class="storeInfo.descriptionScore < 2 ? 'evaluationes' : ''">{{
					storeInfo.descriptionScore }}</span>
					<span v-if="storeInfo.descriptionScore > 4">
						{{ L['高'] }}
					</span>
					<span v-else-if="storeInfo.descriptionScore < 2" class="evaluationes">{{ L['低']
						}}</span>
					<span v-else>{{ L['中'] }}</span>
				</div>
				<div class="store_des_pre pre_deliver">
					<span>{{ L['物流评价'] }}</span>
					<span :class="storeInfo.deliverScore < 2 ? 'evaluationes' : ''">
						{{ storeInfo.deliverScore }}
					</span>
					<span v-if="storeInfo.deliverScore > 4">
						{{ L['高'] }}
					</span>
					<span v-else-if="storeInfo.deliverScore < 2" class="evaluationes">{{ L['低']
						}}</span>
					<span v-else>{{ L['中'] }}</span>
				</div>
				<div class="store_des_pre pre_service">
					<span>{{ L['售后服务'] }}</span>
					<span :class="storeInfo.serviceScore < 2 ? 'evaluationes' : ''">
						{{ storeInfo.serviceScore }}</span>
					<span v-if="storeInfo.serviceScore > 4">
						{{ L['高'] }}
					</span>
					<span v-else-if="storeInfo.serviceScore < 2" class="evaluationes">{{ L['低']
						}}</span>
					<span v-else>{{ L['中'] }}</span>
				</div>
			</div>
			<div class="store_btn flex_row_center_center">
				<div class="store_btn_pre flex_row_center_center">
					<dynaIcon src="goods/store.png" width="16" height="16" style="margin-right: 5px;" color="--color_main">
					</dynaIcon>
					<router-link target="_blank" :to="`/store/index?vid=${storeInfo.storeId}`" class="go_store_btn">
						{{ L['进入供应商'] }}
					</router-link>
				</div>
				<div class="store_btn_pre flex_row_center_center" @click="focusStore">
					<div>
						<dynaIcon src="goods/collection.png" width="21" height="21" style="margin-right: 5px;" color="--color_main"
							v-if="storeInfo.isFollowStore"></dynaIcon>
						<img src="@/assets/goods/no_collection.png" alt="" v-else />
					</div>
					<span>{{ storeInfo.isFollowStore ? L['取消关注'] :
					L['关注供应商'] }}</span>
				</div>
			</div>
		</div> -->
		<!-- 供应商推荐及热门收藏 start -->
		<div class="store_popular">
			<div class="store_popular_btn flex_row_between_center">
				<!-- <span @click="getStorePopular('recommend')" :class="{ store_popular_active: storePopularType == 'recommend' }">
					{{ L['供应商热销'] }}
				</span> -->
				<span @click="getStorePopular('collection')"
					:class="{ store_popular_active: storePopularType == 'collection' }">
					{{ L['热门收藏'] }}
				</span>
			</div>
			<div class="store_popular_list" v-if="storePopularList.length">
				<div class="store_popular_pre" v-for="(storePopularItem, storePopularIndex) in storePopularList"
					:key="storePopularIndex" @click="$goGoodsDetail(storePopularItem.defaultProductId)">
					<div class="store_popular_img flex_row_center_center">
						<img :src="storePopularItem.goodsImage" :title="storePopularItem.goodsName" />
					</div>
					<p>{{ storePopularItem.goodsName }}</p>
					<p class="flex_row_between_center">
						<span>{{ L['已售'] }}{{ storePopularItem.saleNum }}</span>
						<span>{{ L['R$'] }}{{ $formatMoneyNum(storePopularItem.goodsPrice || 0) }}</span>
					</p>
				</div>
			</div>
			<div class="popular_list_empty flex_row_center_center" v-show="!storePopularList.length">
				<p>[{{ L['暂无数据'] }}]</p>
			</div>
		</div>
		<!-- 供应商推荐及热门收藏 end -->
	</div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
	props: {
		storeInfo: {
			type: Object,
			default: () => { }
		}
	},
	components: {},
	setup (props, { emit }) {
		const store = useStore()
		const router = useRouter()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const storePopularType = ref('recommend')
		const storePopularList = ref([])

		

		//关注供应商及取消关注
		const focusStore = () => {
			emit('focusStore')
		}

		//获取供应商推荐的商品(销量数);获取热门收藏的商品(收藏数)  type:recommend销量数  collection:收藏数
		const getStorePopular = (type = 'recommend') => {
			storePopularType.value = type
			let params = {
				storeId: props.storeInfo.storeId,
				sort: storePopularType.value == 'recommend'
					? 1
					: storePopularType.value == 'collection'
						? 6
						: '',
				pageSize: 6,
				current: 1
			}
			proxy.$get('v3/supplier/channel/goods/goodsList', params).then(res => {
				if (res.state == 200) {
					let result = res.data
					storePopularList.value = result.list
				} else {
					ElMessage.error(res.msg)
				}
			})
		}

		const kefu = () => {
			if (store.state.loginFlag) {
				let chatInfo = {
					storeId: props.storeInfo.storeId,
					vendorAvatar: props.storeInfo.storeLogo,
					storeName: props.storeInfo.storeName,
					source: L['从商品详情页进入'],
					sourceType: 'store',
				}
				store.commit('saveChatBaseInfo', chatInfo)

				let newWin = router.resolve({
					path: '/service',
					query: {
						vid: props.storeInfo.storeId
					}
				})

				window.open(newWin.href, "_blank")
			} else {
				//未登录提示登录
				emit('login')
			}
		};


		onMounted(()=>{
			getStorePopular('collection')
		})

		return {
			kefu,
			getStorePopular,
			storePopularType,
			L,
			focusStore,
			storePopularList,
		}
	},
}
</script>

<style lang='scss' scoped>
/**供应商信息 start**/
.store_info {
	width: 250px;
	background: #ffffff;
	border: 1px solid #eee;
	border-radius: 2px;
	padding-bottom: 15px;

	.store_info_title {
		width: 248px;
		height: 48px;
		background: #f9f9f9;
		border-radius: 2px 2px 0 0;
		padding-left: 15px;
		box-sizing: border-box;

		.store_type {
			width: 31px;
			height: 16px;
			background: var(--color_main_bg);
			border-radius: 3px;
			font-size: 12px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #ffffff;
			line-height: 16px;
			text-align: center;
		}

		.store_title {
			font-size: 16px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #333333;
			margin: 0 10px;
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.img {
			width: 20px;
			height: 20px;
			cursor: pointer;
		}
	}

	.store_des {
		.store_des_pre {
			padding-left: 15px;
			margin-top: 18px;

			span:nth-of-type(1) {
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #666666;
				margin-right: 18px;
			}

			span:nth-of-type(2),
			span:nth-of-type(3) {
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: var(--color_main);
				margin-right: 18px;
			}
		}

		.pre_deliver {

			span:nth-of-type(2),
			span:nth-of-type(3) {
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: var(--color_main);
			}
		}

		.pre_service {

			span:nth-of-type(2),
			span:nth-of-type(3) {
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: var(--color_main);
			}
		}
	}

	.store_btn {
		margin-top: 14px;

		.store_btn_pre {
			-moz-user-select: none;
			/*火狐*/
			-webkit-user-select: none;
			/*webkit浏览器*/
			-ms-user-select: none;
			/*IE10*/
			user-select: none;
			width: 103px;
			height: 29px;
			background: #ffffff;
			border-radius: 3px;
			margin-right: 14px;
			cursor: pointer;
			border: 1px solid #dfdfdf;
           
            span {
                max-width: 110px;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                white-space: nowrap;
            }
			img {
				width: 20px;
				height: 20px;
				margin-right: 5px;
			}

			.go_store_btn {
				font-size: 12px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #333333;
				line-height: 39px;
				margin-top: 3px;
                max-width: 110px;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                white-space: nowrap;
			}

			.btn_pre_img {
				width: 16px;
				height: 16px;
			}

			&:nth-child(2) {
				margin-right: 0;
				border: 1px solid #dfdfdf;
				background: #ffffff;

				span {
					color: #333333;
				}
			}
		}
	}
}

/**供应商信息 end**/
/**供应商推荐及热门收藏 start**/
.store_popular {
	width: 250px;
	background: #ffffff;
	border: 1px solid #eee;
	border-radius: 3px;
	// margin-top: 15px;

	.store_popular_btn {
		span {
			width: 125px;
			height: 40px;
			background: var(--color_main_bg);
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: bold;
			background: #f8f8f8;
			color: #333333;
			line-height: 40px;
			text-align: center;
			display: block;
			cursor: pointer;
		}

		.store_popular_active {
			background: var(--color_main_bg);
			color: #ffffff;
		}
	}

	.store_popular_list {
		padding: 20px 21px 0;

		.store_popular_pre {
			margin-bottom: 20px;
			border-bottom: 1px solid #f2f2f2;

			&:nth-last-child(1) {
				border-bottom: none;
			}

			cursor: pointer;

			.store_popular_img {
				width: 208px;
				height: 208px;
				border-radius: 2px;
				overflow: hidden;

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
					max-width: 100%;
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

			p {
				width: 197px;
				font-size: 14px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #333333;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
				margin-top: 14px;
			}

			p:nth-of-type(2) {
				margin: 21px 0 13px;

				span {
					font-size: 12px;
					font-family: Microsoft YaHei;
					font-weight: 400;
					color: #999999;

					&:nth-child(2) {
						font-size: 14px;
						font-family: Microsoft YaHei;
						font-weight: bold;
						color: var(--color_price);
					}
				}
			}
		}
	}
}
</style>
