<template>
	<div class="sld_collect_wrapper">
		<MemberTitle :memberTitle="collectIndex == 1 ? L['收藏的商品'] : L['收藏的供应商']" style="padding-left:20px"></MemberTitle>
		<div class="wrapper_main myorder sld_collect">
			<div class="sld_follow_m">
				<!-- 选择横幅 -->
				<div class="sld_h3_wrap clearfix">
					<div class="sld_grade_nav fl">
						<a :class="1 === collectIndex ? 'on' : ''" @click="switchCollect(1)">
							{{ L['收藏的商品'] }}</a>
						<!-- <a :class="2 === collectIndex ? 'on' : ''" @click="switchCollect(2)">
							{{ L['收藏的供应商'] }}
						</a> -->
					</div>
					<div class="sld_option flex_row_end_center" v-show="1 === collectIndex && collectGoodsData.list.length">
						<div class="sld_option_list flex_row_end_center" v-show="optAct" @click="selectAll(true)">
							<dynaIcon :src="collectGoodsChoose" width="20" height="20" color="--color_main">
							</dynaIcon>
							<span ref="chooseWord">{{ L['全选'] }}</span>
						</div>
						<div class="sld_option_list fl" v-show="optAct" @click="selectAll(false)">
							<span>{{ L['取消全选'] }}</span>
						</div>
						<div class="sld_option_list fl" v-show="optAct" @click="cancelCollect">
							<img src="../../assets/member/delete.png" alt="" />
							<span>{{ L['取消收藏'] }}</span>
						</div>
						<button class="sld_option_btn fr" @click="optAct = !optAct">
							{{ L['管理'] }}
						</button>
					</div>
				</div>

				<div>
					<!-- 收藏的商品 -->
					<div class="fav_goods_list" v-show="1 === collectIndex">
						<ul class="clearfix">
							<li class="sld_follow_goods" v-for="(item, index) in collectGoodsData.list" :key="index">
								<div class="cg_img">
									<router-link :to="`/goods/detail?sourcePath=/member/collect/goods&productId=${item.productId}`">
										<coverImage :src="item.productImage" class="lazy" />
									</router-link>
								</div>
								<p class="cg_price clearfix">
									<span class="fl">R$<strong>{{ $formatMoneyNum(item.productPrice) }}</strong></span>
									<span class="fr">{{ L['成交量'] }}<em>{{ item.salesNum }}</em></span>
								</p>
								<p class="cg_name">
									<em v-if="isOwnStore">{{ L['自营'] }}</em>
									{{ item.goodsName }} {{ item.goodsBrief }}
								</p>
								<div class="cg_btns">
									<!-- <router-link :to="`/store/index?vid=${item.storeId}`" class="govendor">{{
			L['进入供应商'] }}</router-link> -->
									<a class="govendor" @click="addCart(item)">{{
			L['加入进货单']
		}}</a>
								</div>
								<div class="check_wrap" v-show="optAct">
									<input type="checkbox" name="option" :id="`GoodsCheck${index}`" class="item_check"
										:value="item.productId" v-model="chosedItem" />
									<label :for="`GoodsCheck${index}`" class="border">
										<dynaIcon src="member/chosen_1.png" width="31" height="31" class="checklogo" color="--color_main">
										</dynaIcon>
									</label>
								</div>
							</li>
							<SldCommonEmpty v-show="!collectGoodsData.list.length" totalWidth="1003" :tip="L['暂无收藏商品~']" />
						</ul>
						<!-- 分页 -->
						<div class="flex_row_end_center sld_pagination">
							<el-pagination @current-change="handleCurrentChange" v-model:currentPage="pageData.current"
								:page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
								:hide-on-single-page="true">
							</el-pagination>
						</div>
					</div>

					<!-- 收藏的供应商 -->
					<div class="fav_store_list" v-show="2 === collectIndex">
						<div class="fav_store_type">
							<span :class="1 === collectStoreIndex ? 'on' : ''" @click="switchStoreType(1)">{{
			L['特别关注'] }}</span>
							<span :class="2 === collectStoreIndex ? 'on' : ''" @click="switchStoreType(2)">{{
			L['普通关注'] }}</span>
						</div>
						<!-- 特殊关注的供应商 -->
						<div v-if="1 === collectStoreIndex">
							<div v-for="(item, index) in specialFollowStore" :key="index">
								<collectStoreItem :item="item" :ItemIndex="index" @collectStoreUpdate="collectStoreUpdate"
									collectStoreIndex="1">
								</collectStoreItem>
							</div>
							<SldCommonEmpty v-show="!collectLength.specialLength" totalWidth="1003" :tip="L['暂无收藏供应商']" />
						</div>
						<!-- 普通关注的供应商 -->
						<div v-else>
							<div v-for="(item1, index1) in commonFollowStore" :key="index1">
								<collectStoreItem :item="item1" :ItemIndex="index1" @collectStoreUpdate="collectStoreUpdate"
									collectStoreIndex="2">
								</collectStoreItem>
							</div>
							<SldCommonEmpty v-show="!collectLength.commonLength" totalWidth="1003" :tip="L['暂无收藏供应商']" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { ElMessage } from 'element-plus'
import {
	reactive,
	getCurrentInstance,
	onMounted,
	ref,
	watchEffect,
	watch,
	computed,
} from 'vue'
import collectStoreItem from './collectStoreItem'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MemberTitle from '../../components/MemberTitle'
import SldCommonEmpty from '../../components/SldCommonEmpty'
import router from '../../router'
export default {
	name: 'MemberCollect',
	components: {
		collectStoreItem,
		MemberTitle,
		SldCommonEmpty,
	},
	setup () {
		const route = useRoute()
		const store = useStore()
		

		const collectIndex = ref(1) //收藏的商品和供应商的切换标志
		const collectStoreIndex = ref(1) //切换收藏供应商 普通关注和特别关注 的标志值
		const collectGoodsData = reactive({
			list: []
		}) //收藏的商品

		const specialFollowStore = ref([]) //特殊收藏的供应商
		const commonFollowStore = ref([]) //普通收藏的供应商

		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const optAct = ref(false) //显示操作
		const isOwnStore = ref(false) //显示操作
		const chosedItem = ref([]) //取消收藏选择的商品集合
		const collectGoodsChoose = ref(require('../../assets/member/chooseAll.png'))
		const cartListData = reactive({ data: store.state.cartListData }) //获取vux的store中的进货单数据
		const collectLength = reactive({
			commonLength: 0,
			specialLength: 0
		})
		const pageData = reactive({
			current: 1,
			pageSize: 10,
			total: null
		})
		const params = reactive({
			current: pageData.current
		})
		//获取数据，初始化
		const getInitData = params => {
			proxy.$get('v3/supplier/channel/followProduct/list', params).then(res => {
				//获取收藏商品信息
				if (res.state == 200) {
					collectGoodsData.list = res.data.list
					pageData.current = res.data.pagination.current
					pageData.pageSize = res.data.pagination.pageSize
					pageData.total = res.data.pagination.total
				}
			})
		}

		const getStoreData = () => {
			proxy.$get('v3/supplier/channel/followStore/list').then(res => {
				//获取收藏供应商信息
				if (res.state == 200) {
					specialFollowStore.value = res.data.storeList.filter(
						item => item.isTop == 1
					)
					commonFollowStore.value = res.data.storeList.filter(
						item => item.isTop == 0
					)
					collectLength.specialLength = specialFollowStore.value.length
					collectLength.commonLength = commonFollowStore.value.length
				}
			})
		}

		// 加入进货单的post操作
		const addCart = item => {
			if (store.state.cartListData) {
				let paramsData = {
					productId: item.productId,
					number: 1
				}
				proxy.$addCart(paramsData)
			} else {
				let paramsData = {
					goodsDetailData: item,
					number: 1,
					cartListData: cartListData.data
				}
				proxy.$addCart(paramsData)
			}
		}

		//切换收藏商品和供应商
		const switchCollect = index => {
			collectIndex.value = index
			router.replace(collectIndex.value == 1 ? '/member/collect/goods' : '/member/collect/store')
		}

		const handlePrevClickChange = e => {
			proxy.$refs.chooseWord.style.color = ''
			params.current = e
			getInitData(params)
		}

		const handleNextClickChange = e => {
			proxy.$refs.chooseWord.style.color = ''
			params.current = e
			getInitData(params)
		}

		const handleCurrentChange = e => {
			proxy.$refs.chooseWord.style.color = ''
			params.current = e
			getInitData(params)
		}

		//切换收藏供应商的特别关注和普通关注
		const switchStoreType = index => {
			collectStoreIndex.value = index
		}

		//取消商品收藏的post操作
		const cancelCollect = () => {
			if (chosedItem.value.length > 0) {
				proxy
					.$confirm(L['确定取消收藏吗?'], L['提示'], {
						confirmButtonText: L['确定'],
						cancelButtonText: L['取消'],
						type: 'warning'
					})
					.then(() => {
						cancelConfirm()
					})
					.catch(() => { })
			} else {
				ElMessage.warning({
					message: L['请选择商品'],
					offset: 95,
					center: true
				})
			}
		}
		//取消收藏的确认事件
		const cancelConfirm = () => {
			let params = {
				isCollect: false,
				productId: chosedItem.value.join(',')
			}
			proxy.$post('v3/supplier/channel/followProduct/update', params).then(res => {
				if (res.state == 200) {
					chosedItem.value = []
					getInitData()
					ElMessage(res.msg)
				}
			})
		}

		const collectStoreUpdate = () => {
			getStoreData()
		}

		//全选或反选操作
		const selectAll = checks => {
			if (checks) {
				let listArr = []
				collectGoodsData.list.forEach(item => {
					listArr.push(item.productId)
				})
				chosedItem.value = listArr
				proxy.$refs.chooseWord.style.color = 'var(--color_main)'
				collectGoodsChoose.value = require('../../assets/member/chooseAll_red.png')
			} else {
				chosedItem.value = []
				proxy.$refs.chooseWord.style.color = ''
				collectGoodsChoose.value = require('../../assets/member/chooseAll.png')
			}
		}
		watch(chosedItem, () => {
			if (chosedItem.value.length == collectGoodsData.list.length) {
				proxy.$refs.chooseWord.style.color = 'var(--color_main)'
				collectGoodsChoose.value = require('../../assets/member/chooseAll_red.png')
			} else {
				proxy.$refs.chooseWord.style.color = ''
				collectGoodsChoose.value = require('../../assets/member/chooseAll.png')
			}
		})

		watchEffect(() => {
			if (route.params.type == 'store') {
				collectIndex.value = 2
			} else if (route.params.type == 'goods') {
				collectIndex.value = 1
			}
		})

		onMounted(() => {
			getInitData(params)
			getStoreData()
			if (route.params.type == 'store') {
				collectIndex.value = 2
			} else if (route.params.type == 'goods') {
				collectIndex.value = 1
			}
		})

		return {
			isOwnStore,
			collectGoodsData,
			L,
			addCart,
			collectIndex,
			switchCollect,
			commonFollowStore,
			specialFollowStore,
			optAct,
			cancelCollect,
			chosedItem,
			cancelConfirm,
			collectStoreIndex,
			switchStoreType,
			selectAll,
			cartListData,
			collectLength,
			collectStoreUpdate,
			handlePrevClickChange,
			handleNextClickChange,
			handleCurrentChange,
			pageData,
			collectGoodsChoose,
		}
	}
}
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
@import '@/style/member/collect.scss';

.sld_pagination {
	margin-top: 20px;
}
</style>
<style lang="scss">
.el-button--primary {
	color: #fff;
	background-color: var(--color_main) !important;
	border-color: var(--color_main) !important;
}

.el-button--primary:hover {
	background-color: var(--color_main) !important;
	border-color: var(--color_main) !important;
}
</style>
