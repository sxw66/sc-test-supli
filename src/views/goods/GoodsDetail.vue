<!-- // 商品详情页面 -->
<template>
	<div>
		<StoreHeaderCat ref="headercat" @updateFllow="updateFllow" />
		<div class="sld_goods_detail">
			<!-- 内容区顶部固定 start -->
			<div class="contain_con" v-if="containCon">
				<div class="contain_content flex_row_center_center">
					<div class="contain_con_left flex_row_start_center">
						<span class="store_type" v-if="goodsDetail.data.storeInfo && goodsDetail.data.storeInfo.isOwnStore == 1">{{L['自营'] }}</span>
						<span class="store_title">{{ goodsDetail.data.storeInfo.storeName }}</span>
						<img src="@/assets/goods/link_server.png" @click="kefu" />
					</div>
					<div class="contain_con_right">
						<div class="goods_description_title flex_row_between_center">
							<div class="description_title_left flex_row_start_center">
								<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'detail' }"
									@click="goodsDescType('detail')">{{ L['商品详情'] }}</span>
								<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'evaluate' }"
									@click="goodsDescType('evaluate')">{{ L['评价'] }}({{ commentCount }})</span>
								<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'service' }"
									@click="goodsDescType('service')">{{ L['商品服务'] }}</span>
								<!-- <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'salestore' }"
									@click="goodsDescType('salestore')">{{ L['供应商热销'] }}</span> -->
							</div>
							<div class="description_title_right flex_row_end_center">
								<div class="go_add_cart cursor_pointer" @click="addCart"
									v-if="goodsDetail.data.isVirtualGoods == 1 && !goodsDetail.data.defaultProduct.promotionType">
									{{ L['加入进货单'] }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 内容区顶部固定 end -->
			<div class="goods_detail_content" v-if="goodsDetail.data">
				<!-- 商品所属分类 ，联系客服，关注供应商 start-->
				 <!-- 1. 隐藏面包屑
				      2. 隐藏店铺名称、联系客服、关注按钮 
				-->
				<!-- <div class="goods_about_con">
					<div class="goods_about flex_row_between_center">
						<div class="goods_classify">
							<span v-for="(item, index) in goodsDetail.data.categoryPath" :key="index" class="category-name">
								<router-link :to="`/goods/list?categoryId=${goodsDetail.data.categoryIdPath[index]
									}&g=${index + 1}${index > 0
										? '&pid=' + goodsDetail.data.categoryIdPath[index - 1]
										: '&pid=0'
									}`
								">
									{{ item }}</router-link>
								<i> > </i>
							</span>
							<span style="color: #333333;">{{ goodsDetail.data.goodsName }}</span>
						</div>
						<div class="goods_about_right flex_row_between_center">
							<router-link target="_blank" :to="`/store/index?vid=${goodsDetail.data.storeInfo.storeId}`"
								class="goods_about_store flex_row_between_center" v-if="goodsDetail.data.storeInfo">
								<span>{{ goodsDetail.data.storeInfo.storeName }}</span>
								<span v-if="goodsDetail.data.storeInfo && goodsDetail.data.storeInfo.isOwnStore == '1'">{{ L['自营']
									}}</span>
							</router-link>
							<div class="contact_service flex_row_between_center" @click="kefu">
								<span>{{ L['联系客服'] }}</span>
								<dynaIcon src="goods/server.png" :width="22" :height="22" class="contact_service_kf" color="--color_main"
									@click="kefu" :title="L['联系客服']"></dynaIcon>
							</div>
							<div class="contact_service focus_store flex_row_start_center" @click="focusStore"
								v-if="goodsDetail.data.storeInfo">
								<div class="flex_row_start_center">
									<dynaIcon src="goods/collection.png" :width="24" :height="22"
										v-show="goodsDetail.data.storeInfo.isFollowStore == true" color="--color_main">
									</dynaIcon>
									<img src="@/assets/goods/no_collection.png" alt=""
										v-show="goodsDetail.data.storeInfo.isFollowStore == false" />
								</div>
								<span style="margin-left: 5px;">
									{{ goodsDetail.data.storeInfo.isFollowStore ? L['已关注'] : L['关注供应商'] }}
								</span>
							</div>
						</div>
					</div>
				</div> -->
				<!-- 商品所属分类 ，联系客服，关注供应商 end-->
				<!-- 商品主要信息 start -->
				<div class="main_con">
					<!-- 商品相关 start -->
					<div class="goods_des">
						<!-- 商品图片列表 start -->
						<div class="goods_des_left">
							<!-- 商品主图start -->
							<detailImage :firstLoading="firstLoading" :info="goodsDetail.data.defaultProduct"
								:videoInfo="goodsDetail.data.goodsVideo"></detailImage>
							<!-- 商品主图end -->

							<!-- 商品分享和收藏 start -->
							<div class="collection_share_btn flex_row_start_start" v-if="goodsDetail.data.state == 3">
								<div class="collection_btn flex_row_start_center cursor_pointer" @click="collectGoods">
									<div class="collect_area">
										<dynaIcon width="20" height="20" src="goods/collected.svg" color="--color_main"
											v-if="goodsDetail.data.followGoods"></dynaIcon>
										<dynaIcon width="20" height="20" src="goods/collect.svg" v-else>
										</dynaIcon>
									</div>
									<span>{{ goodsDetail.data.followGoods ? L['已收藏'] : L['收藏'] }}</span>
								</div>
							</div>
							<!-- 商品分享和收藏 end -->
						</div>
						<!-- 商品图片列表 end -->
						<!-- 商品详细信息 start -->
						<div class="m_item_inner">
							<div class="item_info">
								<div :class="{ detaile_name: true, skeleton_detaile_name: firstLoading }">
									{{ goodsDetail.data.goodsName }}
								</div>
								<div :class="{ p_ad: true, skeleton_p_ad: firstLoading }" v-if="goodsDetail.data.goodsBrief">
									{{ goodsDetail.data.goodsBrief }}
								</div>
								<!-- 商品未下架即正常商品 start -->
								<div v-if="goodsDetail.data.state == 3 || firstLoading">

									<!-- 促销活动信息 @refresh="getGoodsDetail"-->
									<PromotionBanner @register="promotionRegister"
										:promotionType="defaultProduct.promotionType" :promotionInfo="promotionInfo"></PromotionBanner>
									<!-- 促销活动信息end -->


									<div class="summary">
										<div class="sld_summary_item summary_goods clearfix" v-if="goodsDetail.data.defaultProduct">
											<div class="sld_summary_goods_left">
												<div class="goods_price flex_row_start_center">
													<!-- 在售价 -->
													<PriceSummary :firstLoading="firstLoading" :promotionInfo="promotionInfo"
														:promotionShowPrice="promotionShowPrice" :promotionType="defaultProduct.promotionType"
														:ladderPrice="defaultProduct.ladderPrice" :number="currentSpecNum" :priceRange="priceRange"
														:productPrice="productPrice" :isMultipleSpec="!!specProductList.length"
														:ladderType="goodsDetail.data.ladderType" @getCurrentLadderPrice="getCurrentLadderPrice"
														:minBuyNum="goodsDetail.data.minBuyNum" :saleUnit="goodsDetail.data.saleUnit" />

													<!-- 市场价,预售、拼团、秒杀，阶梯团原价 -->
													<section>
														<template v-if="defaultProduct.promotionType">
															<div class="market_price activity_style" v-if="promotionShowPriceBefore">
																<span>{{ `${promotionInfo.promotionName}${L['价']}` }}</span>
																<span>{{ L['R$'] }}{{ $formatMoneyNum(promotionShowPriceBefore || 0) }}</span>
															</div>
															<div class="market_price" v-else>
																<span>{{ L['原价'] }}</span>
																<span>{{ L['R$'] }}{{ $formatMoneyNum(promotionInfo.productPrice) }}</span>
															</div>
														</template>

														<div class="market_price" v-else-if="defaultProduct.marketPrice">
															{{ L['R$'] }}{{ $formatMoneyNum(defaultProduct.marketPrice) }}
														</div>
													</section>
													<!-- 市场价,预售、拼团、秒杀，阶梯团原价 -->
												</div>
												<div class="actual_sales">
													{{ L['销量'] }}
													<span>{{ goodsDetail.data.sales }}</span>
												</div>
											</div>
										</div>
										<!-- 优惠券start -->
										<div v-if="goodsDetail.data.storeInfo && goodsDetail.data.storeInfo.storeId">
											<Coupon :storeId="goodsDetail.data.storeInfo.storeId">
											</Coupon>
										</div>
										<!-- 优惠券end -->

										<!-- 满优惠start -->
										<FullDistProduct />
										<!-- 满优惠end -->


										<!-- 预售发货描述 -->
										<section v-if="defaultProduct.promotionType == 103 && promotionInfo.state != 3">
											<div class="activity_addDesc">
												<div class="preSale_addDesc" v-if="promotionInfo.type == 1">
													{{ L['(付尾款时间：'] }}
													{{ promotionInfo.remainStartTime
													}}～{{ promotionInfo.remainEndTime }})
												</div>
												<div class="preSale_addDesc">
													{{ L[' (发货时间：'] }}
													{{ promotionInfo.deliverTime }})
												</div>
											</div>
										</section>
										<!-- 预售发货描述end -->
									</div>
									<!-- 配送至地区 start -->
									<!-- <div v-if="!firstLoading && goodsDetail.data.isVirtualGoods == 1"
										class="delivery flex_row_start_center">
										<DetailAddr @change="getUserEx"></DetailAddr>
									</div> -->
									<!-- 配送至地区 end -->
									<!-- 运费 start -->
									<!-- <div v-if="!firstLoading" class="freight flex_row_start_center">
										<div class="freight_title">{{ L['运费'] }}</div>
										<span :class="{ freight_amount: firstLoading }" v-if="goodsDetail.data && Number(expressFee) > 0">
											R${{ expressFee }}
										</span>
										<span v-else>{{ L['免运费'] }}</span>
									</div> -->
									<!-- 运费 end -->


									<!-- 规格 start -->
									<div v-if="!firstLoading && specProductList && specProductList.length" style="padding-left: 20px;">
										<spec :specs="specList" :specProductList="specProductList" :defaultProduct="specInfo.defaultProduct"
											@selectSpecVal="selectSpecVal" :staticInfo="specInfo" :minBuyNum="specInfo.minBuyNum" ref="spec"
											@changeNum="getChangeNum">
										</spec>
									</div>
									<!-- 规格 end -->

									<!-- 数量加减及库存 start -->
									<div v-else>
										<div class="goods_spec_pre flex_row_start_start line_label">
											<div class="goods_spec_pre_title label_title" style="padding-top:10px">
												{{ L['订货量'] }}
											</div>
											<SingleSpec :defaultProduct="goodsDetail.data.defaultProduct" :staticInfo="goodsDetail.data"
												v-if="!firstLoading && goodsDetail.data.defaultProduct" @changeNum="getChangeNum">
											</SingleSpec>
										</div>
										<div class="series flex_row_between_center line_label" style="margin-top: 30px; padding-left:20px">
											<div class="flex_row_start_center">
												<div class="label_title">
													<span class="series_title">{{ L['合计'] }}</span>
												</div>
												<div :class="{ series_total: true, skeleton_series_total: firstLoading }">
													<section v-if="(totalPrice)">
														<span style="font-size: 16px;margin-right: 1px">R$</span>
														<span v-if="totalPrice">{{ totalPrice }}</span>
														<span v-else>&nbsp;0,00</span>
													</section>
													<section v-else>
														<span>--</span>
													</section>
												</div>
												<div class="choose_num">
													<span>{{ L['已选'] }} {{ currentSpecNum }}&nbsp; </span>
													<span v-if="goodsDetail.data.saleUnit">{{ goodsDetail.data.saleUnit }}</span>
												</div>
											</div>

										</div>
									</div>
									<!-- 数量加减及库存 end-->
								</div>
								<!-- 商品未下架即正常商品 end -->

								<template v-if="!firstLoading">
									<!-- 立即购买 加入进货单 收藏 ，分享 start-->

									<!-- 商品已下架 start -->
									<div class="options_btn" v-if="goodsDetail.data.state && goodsDetail.data.state != 3">
										<p class="option_desc">
											{{ L['商品已下架，欢迎挑选其他商品~'] }}
										</p>
										<div class="goods_off_shelves">{{ L['商品已下架'] }}</div>

										<!-- 商品下架时的推荐商品 start -->
										<div class="recoOffShop">
											<div class="reCon"
												v-for="({ goodsImage, goodsName, goodsPrice, defaultProductId }, index) in recomOffShop.data"
												:key="index">
												<div class="reComImg">
													<router-link :to="`/goods/detail?productId=${defaultProductId}`" target="_blank">
														<img :src="goodsImage" alt="" />
													</router-link>
												</div>
												<router-link class="recomName" :to="`/goods/detail?productId=${defaultProductId}`"
													target="_blank">
													{{ goodsName }}
												</router-link>
												<span class="recomPrice">R${{ $formatMoneyNum(goodsPrice) }}</span>
											</div>
										</div>
										<!-- 商品下架时的推荐商品 end -->
									</div>
									<!-- 商品已下架 end -->

									<!-- 商品库存不足 start -->
									<div class="options_btn flex_row_between_center"
										v-else-if="!goodsDetail.data.defaultProduct.productStock">
										<div class="goods_out_stock">{{ L['库存不足'] }}</div>
									</div>
									<!-- 商品库存不足 end -->

									<!-- 普通(活动)正常商品 start -->
									<div class="options_btn flex_row_start_center" v-else>
										<div class="goods_code" id="qrcodeAct" v-show="isShowQr"></div>

										<!-- 预售 -->
										<template v-if="defaultProduct.promotionType == 103 && promotionInfo.state != 3">
											<div class="preSell_but" @click="isShowQr = !isShowQr">
												<img src="@/assets/activity/qrcode.png" alt="" />
												{{ L['扫码参加预售'] }}
											</div>
										</template>
										<!-- 预售 -->

										<!-- 拼团 -->
										<template v-else-if="defaultProduct.promotionType == 102 && promotionInfo.state == 1">
											<div class="buy_now p_price_one flex_column_center_center" @click="isShowQr = !isShowQr">
												<span class="pin_but_text">
													{{ L['R$'] }}
													{{ promotionInfo.leaderIsPromotion == 1 ? $formatMoneyNum(promotionInfo.leaderPrice) : $formatMoneyNum(promotionInfo.spellPrice)
													}}
												</span>
												<span class="pin_but_text">{{ L['扫码开团'] }}</span>
											</div>
											<div class="add_cart p_price_one flex_column_center_center" @click="goBuy">
												<span class="pin_but_text">{{ L['R$'] }}{{ $formatMoneyNum(promotionInfo.productPrice) }}</span>
												<span class="pin_but_text">{{ L['原价购买'] }}</span>
											</div>
										</template>
										<!-- 拼团 -->

										<!-- 阶梯团 -->
										<template v-else-if="defaultProduct.promotionType == 105 && promotionInfo.state == 2">
											<div class="buy_now p_price_three flex_column_center_center" @click="isShowQr = !isShowQr">
												<span class="pin_but_text">{{ L['R$'] }}{{ $formatMoneyNum(ladderInfo.data.currentPrice || 0) }}</span>
												<span class="pin_but_text">{{ L['扫码参团'] }}</span>
											</div>
										</template>
										<!-- 阶梯团 -->

										<!-- 秒杀 -->
										<template v-else-if="defaultProduct.promotionType == 104 && promotionInfo.state == 2">
											<div class="add_cart p_price_four flex_row_center_center" @click="goBuy">
												{{ L['立即购买'] }}
											</div>
										</template>
										<!-- 秒杀 -->

										<template v-else>
											<div class="buy_now flex_row_center_center" @click="goBuy">
												{{ L['立即购买'] }}
											</div>
											<div class="add_cart flex_row_center_center" @click="addCart"
												v-if="goodsDetail.data.isVirtualGoods == 1">
												<img src="@/assets/goods/cart.png" alt="" />
												<span>{{ L['加入进货单'] }}</span>
											</div>
										</template>
									</div>
									<!-- 普通(活动)正常商品 end -->

									<!-- 立即购买 加入进货单 收藏 ，分享 end-->
								</template>
							</div>
						</div>
						<!-- 商品详细信息 end -->
						<!-- 相关推荐 start -->
						<MoreGoods v-if="goodsDetail.data.state == 3" :vid="goodsDetail.data.storeInfo.storeId"></MoreGoods>
						<!-- 相关推荐 end -->
					</div>
					<!-- 商品相关 end -->




					<!-- 供应商，及各种信息的切换 start -->
					<div class="container flex_row_start_start" ref="container" id="container">
						<PopularLeft :storeInfo="goodsDetail.data.storeInfo" v-if="goodsDetail.data.storeInfo"
							@focusStore="focusStore" />

						<!-- 商品详情 评价 商品服务 供应商热销  start-->
						<div class="goods_description">
							<div class="goods_description_title flex_row_between_center">
								<div class="description_title_left flex_row_start_center">
									<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'detail' }"
										@click="goodsDescType('detail')">{{ L['商品详情'] }}</span>
									<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'evaluate' }"
										@click="goodsDescType('evaluate')">
										{{ L['评价'] }}&nbsp;({{ commentCount }})
									</span>
									<span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'service' }"
										@click="goodsDescType('service')">{{ L['商品服务'] }}</span>
									<!-- <span class="cursor_pointer" :class="{ description_active: goodsDesctionType == 'salestore' }"
										@click="goodsDescType('salestore')">{{ L['供应商推荐'] }}</span> -->
									<!-- 改为供应商推荐  -->
								</div>
								<div class="description_title_right flex_row_end_center">
									<div class="go_add_cart cursor_pointer" @click="addCart"
										v-if="goodsDetail.data.isVirtualGoods == 1 && !defaultProduct.promotionType">
										{{ L['加入进货单'] }}
									</div>
								</div>
							</div>
							<div class="goods_description_con">
								<!-- 商品详情,规格参数,及详情富文本 start-->
								<div class="goods_des_con" v-if="goodsDesctionType == 'detail'">
									<div v-if="goodsDetail.data.brandName ||
										(goodsDetail.data.goodsParameterList &&
											goodsDetail.data.goodsParameterList.length > 0) ||
										goodsDetail.data.goodsDetails ||
										goodsDetail.data.bottomTemplateContent ||
										goodsDetail.data.topTemplateContent
									">
										<div class="brand" v-if="goodsDetail.data.brandName">
											<span>{{ L['品牌'] }}: </span>
											<router-link :to="`/goods/list?brandId=${goodsDetail.data.brandId}`">
												<span class="brand_name">{{ goodsDetail.data.brandName }}</span>
											</router-link>
										</div>
										<div v-if="goodsDetail.data.goodsParameterList &&
											goodsDetail.data.goodsParameterList.length > 0
										">
											<div class="goods_parameter_list" :class="{ goods_paramter_more: !parameterShow }">
												<div class="goods_parameter_pre" v-for="(parameterItem, paramterIndex) in goodsDetail.data.goodsParameterList"
												 :key="paramterIndex">
													<span>{{ parameterItem.parameterName }}: </span>
													<span>{{ parameterItem.parameterValue }}</span>
												</div>
											</div>
											<div class="collapse_unfold flex_row_center_center cursor_pointer"
												v-if="goodsDetail.data.goodsParameterList.length > 16" @click="openParameter">
												<span>{{ !parameterShow ? L['查看全部'] : L['收起全部'] }}</span>
												<i class="iconfont iconziyuan11-copy" v-if="!parameterShow"></i>
												<i class="iconfont iconziyuan11-copy-copy" v-else></i>
											</div>
										</div>
										<div v-if="goodsDetail.data.topTemplateContent != undefined &&
											goodsDetail.data.topTemplateContent
											" class="goods_html" :style="goodsDetail.data.topTemplateContentBg">
											<div class="goods_htmls" v-html="goodsDetail.data.topTemplateContent">
											</div>
										</div>
										<div v-if="goodsDetail.data.goodsDetails != undefined &&
											goodsDetail.data.goodsDetails
											" class="goods_html" :style="goodsDetail.data.goodsDetailsBg">
											<div class="goods_htmls" v-html="goodsDetail.data.goodsDetails">
											</div>
										</div>
										<div v-if="goodsDetail.data.bottomTemplateContent != undefined &&
											goodsDetail.data.bottomTemplateContent
											" class="goods_html" :style="goodsDetail.data.bottomTemplateContentBg">
											<div class="goods_htmls" v-html="goodsDetail.data.bottomTemplateContent">
											</div>
										</div>
									</div>
									<div v-else>
										<SldCommonEmpty :tip="L['该商品暂无详情~']" totalWidth="934px" />
									</div>
								</div>
								<!-- 商品详情,规格参数,及详情富文本 end-->
								<!-- 商品评价 start -->
								<div v-show="goodsDesctionType == 'evaluate'">
									<Comments :productId="defaultProduct.productId" @getCommentCount="getCommentCount" />
								</div>
								<!-- 商品评价 end -->
								<!-- 商品服务 start -->
								<div class="goods_server_list" v-if="goodsDesctionType == 'service'">
									<div v-if="goodsDetail.data.serviceLabels &&
										goodsDetail.data.serviceLabels.length > 0
									">
										<div class="goods_server_pre" v-for="(serverItem, serverIndex) in goodsDetail.data.serviceLabels" :key="serverIndex">
											<div class="server_pre_top flex_row_start_center">
												<span class="server_pre_tips"></span>
												<span class="server_pre_name">{{serverItem.labelName}}</span>
											</div>
											<div class="server_pre_content">
												{{ serverItem.description }}
											</div>
										</div>
									</div>
									<div v-else>
										<SldCommonEmpty :tip="L['暂无商品服务~']" totalWidth="934px" />
									</div>
								</div>
								<!-- 商品服务 end -->
								<!-- 供应商推荐 start -->
								<div v-show="goodsDesctionType == 'salestore'">
									<StoreRecommend :vid="vid" :goodsId="goodsDetail.data.goodsId" v-if="goodsDetail.data.goodsId" />
								</div>
								<!-- 供应商推荐 end -->
							</div>
						</div>
						<!-- 商品详情 评价 商品服务 供应商热销  end-->
					</div>
					<!-- 供应商，及各种信息的切换 end -->
				</div>
				<!-- 商品主要信息 end -->
			</div>

		</div>
	</div>
</template>

<script>
import {
	reactive,
	getCurrentInstance,
	ref,
	onMounted,
	computed,
	unref
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { qrcanvas } from 'qrcanvas'
import StoreHeaderCat from '../store/StoreHeaderCat'
import Coupon from './components/Coupon'
import FullDistProduct from './components/FullDistProduct'
import { useStore } from 'vuex'
import SldCommonEmpty from '../../components/SldCommonEmpty'
import detailImage from './components/detailImage.vue'
import PromotionBanner from './components/PromotionBanner.vue'
import { usePromotion } from './actions/usePromotion'
// import DetailAddr from './components/DetailAddr'
import MoreGoods from './components/MoreGoods.vue'
import Comments from './components/Comments'
import PopularLeft from './components/PopularLeft'
import StoreRecommend from './components/StoreRecommend.vue'
import PriceSummary from './components/PriceSummary.vue'
import spec from './components/SpecDisplay/spec'
import SingleSpec from './components//SpecDisplay/SingleSpec.vue'
import lodash from 'lodash'
import { useOrderCheck } from '@/utils/hooks'
export default {
	name: 'goods-detail',
	components: {
		StoreHeaderCat,
		Coupon,
		SldCommonEmpty,
		detailImage,
		PromotionBanner,
		FullDistProduct,
		// DetailAddr,
		MoreGoods,
		Comments,
		PopularLeft,
		StoreRecommend,
		PriceSummary,
		spec,
		SingleSpec
	},
	setup () {
		const firstLoading = ref(true) //是否第一次加载
		const router = useRouter()
		const route = useRoute()
		const store = useStore()
		const vid = ref(0) //供应商id
		const { proxy } = getCurrentInstance()

		const L = proxy.$getCurLanguage()
		const $formatMoneyNum = proxy.$formatMoneyNum;
		const goodsDetail = reactive({ data: {} }) //商品详情数据
		const isChoice = ref('default') //是默认选中的,还是点击选择规格之后的  default:默认  choice:选择
		const productId = ref('') //货品id
		const currentSpecNum = ref(1) //商品编辑数量，默认数量为1
		const goodsDesctionType = ref('detail') //商品详情,评价,商品服务,供应商热销,默认显示商品详情
		const cartListData = reactive({ data: store.state.cartListData }) //获取vux的store中的进货单数据
		const container = ref(null) // 商品详情页底部内容区
		const containerTop = ref(0) //商品详情页底部内容区的top值
		const containCon = ref(false) //固定内容区头部
		const goodsPictureList = ref(null) //商品图片列表
		const wxShareCode = ref(false) //微信分享二维码是否显示
		const parameterShow = ref(false) //规格参数查看是否查看全部，默认为否
		const score = ref(0) //好评率
		const colors = ref(['var(--color_main)', 'var(--color_main)', 'var(--color_main)']) //星星颜色
		const logFlag = ref(store.state.loginFlag)
		const memberInfo = ref(store.state.memberInfo)
		const expressFee = ref(0)
		const curAddr = ref(0)
		const isShowQr = ref(false)
		const specProductList = ref([])
		const specInfo = ref({})
		const specList = ref([])
		const defaultProduct = ref({})
		const [promotionRegister, { promotionInfo, promotionShowPrice, getPromotionInfo, promotionShowPriceBefore }] = usePromotion()
		const productPrice = ref(0)
		const priceRange = reactive({ max: 0, min: 0 })
		// 促销活动信息end
		
		onMounted(() => {
			getInitDataStatic(route.query.productId)
			productId.value = route.query.productId
			containerTop.value = offset(container.value).top
			window.addEventListener('scroll', scrollHandle) //绑定页面滚动事件

		})

		//考虑阶梯价
		const totalPrice = computed(() => {
			if (unref(productPrice) && currentSpecNum.value) {
				const _total = Number(currentSpecNum.value * Number(unref(productPrice))).toFixed(2);
				return $formatMoneyNum(_total);
			} else {
				return '0,00';
			}
		})

		const scrollHandle = async e => {
			let elementScrollTop = e.srcElement.scrollingElement.scrollTop //获取页面滚动高度
			if (
				document.getElementById('container') &&
				elementScrollTop > document.getElementById('container').offsetTop
			) {
				containCon.value = true
				await proxy.$nextTick()

				if (goodsDetail.data.qrCodeImage) {
					handleQrImage(goodsDetail.data.qrCodeImage, 'top')
				} else {
					getBigcode(goodsDetail.data.shareLink, 'top')
				}
			} else {
				getBigcode(goodsDetail.data.shareLink)
				containCon.value = false
			}
		}

		//获取商品详情数据
		const getInitDataStatic = proId => {
			let params = {
				productId: proId
			}
			proxy
				.$get('v3/supplier/channel/goods/details', params)
				.then(res => {
					if (res.state == 200) {
						let staticData = [
							'brandId',
							'brandName',
							'categoryPath',
							'categoryIdPath',
							'goodsBrief',
							'goodsDetails',
							'goodsBrief',
							'goodsId',
							'goodsName',
							'goodsParameterList',
							'goodsVideo',
							'topTemplateContent',
							'bottomTemplateContent',
							'serviceLabels',
							'qrCodeImage'
						]

						staticData.forEach(item => {
							if (item == 'categoryPath') {
								goodsDetail.data.categoryPath = res.data.categoryPath.split(
									'->'
								)
							} else if (item == 'categoryIdPath') {
								goodsDetail.data.categoryIdPath = [res.data.categoryId1, res.data.categoryId2, res.data.categoryId3]
							} else if (item == 'goodsName' && res.data[item]) {
								goodsDetail.data[item] = res.data[item]
								document.title = res.data[item]
							} else {
								goodsDetail.data[item] = res.data[item]
							}
						})
						if (goodsDetail.data.topTemplateContent) {
							goodsDetail.data.topTemplateContent = proxy.$quillEscapeToHtml(
								goodsDetail.data.topTemplateContent
							)
							//处理背景样式
							if (
								goodsDetail.data.topTemplateContent.indexOf(
									'<p style="display:none;" data-background="'
								) != -1
							) {
								let bg = goodsDetail.data.topTemplateContent
									.split('<p style="display:none;" data-background="')[1]
									.split('">')[0]
								goodsDetail.data.topTemplateContentBg = bg
							}
						}
						if (goodsDetail.data.goodsDetails) {
							goodsDetail.data.goodsDetails = proxy.$quillEscapeToHtml(
								goodsDetail.data.goodsDetails
							)
							//处理背景样式
							if (
								goodsDetail.data.goodsDetails.indexOf(
									'<p style="display:none;" data-background="'
								) != -1
							) {
								let bg = goodsDetail.data.goodsDetails
									.split('<p style="display:none;" data-background="')[1]
									.split('">')[0]
								goodsDetail.data.goodsDetailsBg = bg
							}
						}
						if (goodsDetail.data.bottomTemplateContent) {
							goodsDetail.data.bottomTemplateContent = proxy.$quillEscapeToHtml(
								goodsDetail.data.bottomTemplateContent
							)
							//处理背景样式
							if (
								goodsDetail.data.bottomTemplateContent.indexOf(
									'<p style="display:none;" data-background="'
								) != -1
							) {
								let bg = goodsDetail.data.bottomTemplateContent
									.split('<p style="display:none;" data-background="')[1]
									.split('">')[0]
								goodsDetail.data.bottomTemplateContentBg = bg
							}
						}
						vid.value = res.data.storeInfo.storeId

						/** clickLink-事件触发按钮位置
							* index-平台首页  goods-商品详情页  cart-进货单页  pay-支付成功页  order_list-订单列表页
							* order_detail-订单详情页  collect-收藏商品页  follow-关注供应商页  member-个人中心页  look-我的足迹页
							*/
						let clickLink = 'goods';
						if (route.query && route.query.sourcePath) {
							switch (route.query.sourcePath) {
								case '/index':
									clickLink = 'index';
									break
								case '/cart/index':
									clickLink = 'cart';
									break
								case '/buy/pay':
									clickLink = 'pay';
									break
								case '/member/order/list':
									clickLink = 'order_list';
									break
								case '/member/order/detail':
									clickLink = 'order_detail';
									break
								case '/member/collect':
									clickLink = 'collect';
									break
								case '/member/collectStore':
									clickLink = 'follow';
									break
								case '/member/index':
									clickLink = 'member';
									break
								case '/footprint':
									clickLink = 'look';
									break
							}
						}
						proxy.$sldStatEvent({
							behaviorType: 'gpv',
							goodsId: goodsDetail.data.goodsId,
							storeId: vid.value,
							clickLink
						})
					} else {
						ElMessage.error(res.msg)
					}
				})
				.then(() => {
					getInitDataDynamic(productId.value)
					addLog()
					getUserEx()
					if (goodsDetail.data.qrCodeImage) {
						handleQrImage(goodsDetail.data.qrCodeImage)
					} else {
						getBigcode(goodsDetail.data.shareLink)
					}
				})
		}

		const getInitDataDynamic = (proId) => {
			let params = {
				productId: proId
			}
			proxy
				.$get('v3/supplier/channel/goods/details2', params)
				.then(res => {
					if (res.state == 200) {
						let dynamicData = [
							'defaultProduct',
							'effectSpecValueIds',
							'followGoods',
							'specs',
							'storeInfo',
							'sales',
							'state',
							'shareLink',
							'shareImage',
							'isVirtualGoods',
							'minBuyNum',
							'takeOffNum',
							'ladderType',
							'highestPrice', 'lowestPrice',
							'wholesalePrice', 'saleModel'
						]
						dynamicData.forEach(item => {
							goodsDetail.data[item] = res.data[item]
						})

						defaultProduct.value = goodsDetail.data.defaultProduct
						specProductList.value = res.data.specProductList
						specInfo.value = lodash.cloneDeep(goodsDetail.data)
						specList.value = res.data.specs

						if (specProductList.value.length) {
							priceRange.max = goodsDetail.data.highestPrice
							priceRange.min = goodsDetail.data.lowestPrice
						} else {
							productPrice.value = goodsDetail.data.saleModel == 1 ? defaultProduct.value.productPrice : goodsDetail.data.wholesalePrice
							currentSpecNum.value = goodsDetail.data.minBuyNum
						}

						if (goodsDetail.data.state != 3) {
							getRecom()
						}


						if (defaultProduct.value.promotionType) {
							getPromotionInfo({ promotionType: defaultProduct.value.promotionType, promotionId: defaultProduct.value.promotionId, productId: defaultProduct.value.productId }).then(() => {
								genQrcode()
							})
						}
						firstLoading.value = false
					}
				})
		}
		const handleQrImage = (qrCodeImage, type) => {
			let img = document.createElement('img')
			img.src = `data:image/png;base64,${qrCodeImage}`
			img.width = 145
			img.height = 145

			if (type == 'top') {
				if (document.getElementById('qrcodeBig1')) {
					document.getElementById('qrcodeBig1').innerHTML = ''
					document.getElementById('qrcodeBig1').appendChild(img)
				}
			}
		}

		const genQrcode = () => {
			let promotionStock = promotionInfo.value.showStock ?? defaultProduct.value.productStock
			if (promotionStock == 0) {
				return
			}
			proxy.$nextTick(() => {
				let canvas
				if (goodsDetail.data.qrCodeImage) {
					canvas = document.createElement('img')
					canvas.src = `data:image/png;base64,${goodsDetail.data.qrCodeImage}`
					canvas.width = 135
					canvas.height = 135
				} else {
					canvas = qrcanvas({
						data: goodsDetail.data.shareLink, //二维码内容
						size: 125,
						colorDark: 'red'
					})
				}
				setTimeout(() => {
					document.getElementById('qrcodeAct').innerHTML = ''
					document.getElementById('qrcodeAct').appendChild(canvas)
				}, 10)
			})
		}

		// 促销活动信息end

		const recomOffShop = reactive({ data: [] })
		const getRecom = () => {
			proxy
				.$get('v3/supplier/channel/goods/goodsList', {
					storeId: goodsDetail.data.categoryId1
				})
				.then(res => {
					if (res.state == 200) {
						let top = Math.floor(Math.random() * (res.data.list.length - 8)) + 8
						let end = top - 8
						recomOffShop.data = res.data.list
							.filter(
								item =>
									item.defaultProductId !=
									goodsDetail.data.defaultProduct.productId
							)
							.slice(end, top)
					}
				})
		}

		//添加足迹
		const addLog = () => {
			let params = {
				productId: productId.value
			}
			proxy.$post('v3/supplier/channel/productLookLog/add', params).then(res => {
				if (res.state == 200) {
					console.log()
				}
			})
		}
		//跳转去商品详情页
		const goGoodsDetail = productId => {
			proxy.$goGoodsDetail(productId)
		}

		//获取商品的shareLink二维码
		const getBigcode = (link, type) => {
			proxy.$nextTick(() => {
				let canvas = qrcanvas({
					data: link, //二维码内容
					size: 125,
					colorDark: 'red'
				})
				if (type == 'top') {
					if (document.getElementById('qrcodeBig1')) {
						document.getElementById('qrcodeBig1').innerHTML = ''
						document.getElementById('qrcodeBig1').appendChild(canvas)
					}
				}
			})
		}


		/**
		 * 选择规格值
		 * @param type:类型  值:choice,规格选择  default:默认
		 * @param specId:父级规格值
		 * @param specValueId:点击的当前的规格值
		 */
		const selectSpecVal = (proId) => {
			let params = {
				productId: proId
			}
			proxy.$get('v3/supplier/channel/goods/details2', params).then(res => {
				if (res.state == 200) {
					specInfo.value = res.data
					specList.value = res.data.specs
					specProductList.value = res.data.specProductList ?? []
				}
			})
		}

		//加入进货单
		const addCart = () => {
			if (specProductList.value.length) {
				let checkList = handleMultiSpecData()
				if (!checkList) return
				proxy.$post('v3/supplier/channel/cart/batchAdd', checkList, 'json').then(res => {
					if (res.state == 200) {
						ElMessage.success(res.msg)
						proxy.$getLoginCartListData()
					} else {
						ElMessage(res.msg)
					}
				})
			} else {
				if (currentSpecNum.value < goodsDetail.data.minBuyNum) {
					ElMessage('数量应大于最小起批量')
					return
				}
				let paramData = {
					productId: goodsDetail.data.defaultProduct.productId,
					number: currentSpecNum.value
				}
				proxy.$addCart(paramData)
			}
		}


		const handleMultiSpecData = () => {
			let { chosenSpecList } = proxy.$refs.spec.returnChosenSpec()
			if (!chosenSpecList.length) {
				ElMessage('请选择规格')
				return null
			}
			let numMap = chosenSpecList.map(i => i.buyNum)
			let totalNum = numMap.reduce((total, prev) => total + prev)
			if (totalNum < goodsDetail.data.minBuyNum) {
				ElMessage('数量应大于最小起批量')
				return
			}
			let checkList = chosenSpecList.map(i => {
				return {
					number: i.buyNum,
					productId: i.productId
				}
			})

			return checkList
		}

		const { setCheckInfo, orderCheck } = useOrderCheck()

		//立即购买
		const goBuy = () => {
			let checkList = []
			if (specProductList.value.length) {
				checkList = handleMultiSpecData()
				if (!checkList) return
			} else {
				if (currentSpecNum.value < goodsDetail.data.minBuyNum) {
					ElMessage('数量应大于最小起批量')
					return
				}
				checkList = [{ productId: goodsDetail.data.defaultProduct.productId, number: currentSpecNum.value }]
			}
			let param = {
				products: checkList.map(item => `${item.productId}-${item.number}`).toString(),
				isCart: false,
				source: 1
			}
			setCheckInfo(param)
			orderCheck().then(res => {
				if (res.state == 200) {
					router.push({
						path: '/buy/confirm',
						query: {
							productSets: param.products,
							isCart: false,
							source: 1
						}
					})
				}
			})
		}



		//切换商品详情,评价,服务,热销
		const goodsDescType = type => {
			let elementScrollTop =
				window.pageYOffset ||
				document.documentElement.scrollTop ||
				document.body.scrollTop //获取页面滚动高度
			if (elementScrollTop > containerTop.value + 33 + 48) {
				window.scrollTo({
					top: containerTop.value,
					behavior: 'smooth'
				})
			}

			if (type == '' || !type) {
				goodsDesctionType.value = 'detail'
			} else {
				goodsDesctionType.value = type
			}
		}

		//关注供应商及取消关注
		const focusStore = () => {
			if (store.state.loginFlag) {
				//已登录
				let params = {
					storeId: goodsDetail.data.storeInfo.storeId,
					isCollect: !goodsDetail.data.storeInfo.isFollowStore
				}
				proxy.$post('v3/supplier/channel/followStore/update', params).then(res => {
					if (res.state == 200) {
						goodsDetail.data.storeInfo.isFollowStore = !goodsDetail.data.storeInfo
							.isFollowStore
						proxy.$refs.headercat.storeData.info.isFollow = goodsDetail.data
							.storeInfo.isFollowStore
							? 'true'
							: 'false'
						if (goodsDetail.data.storeInfo.isFollowStore) {
							proxy.$sldStatEvent({
								behaviorType: 'fol',
								storeId: goodsDetail.data.storeInfo.storeId
							})
						}
					}
				})
			}
		}
		//商品收藏及取消收藏
		const collectGoods = () => {
			if (store.state.loginFlag) {
				//已登录
				let params = {
					productId: productId.value,
					isCollect: !goodsDetail.data.followGoods
				}
				proxy.$post('v3/supplier/channel/followProduct/update', params).then(res => {
					if (res.state == 200) {
						goodsDetail.data.followGoods = !goodsDetail.data.followGoods
						if (goodsDetail.data.followGoods) {
							proxy.$sldStatEvent({
								behaviorType: 'fav',
								goodsId: goodsDetail.data.goodsId,
								storeId: goodsDetail.data.storeInfo.storeId
							})
						}
					} else {
						ElMessage.error(res.msg)
					}
				})
			}else{
				ElMessage({
				message: L['请登录'],
				type: 'warning',
				})
				store.state.loginState = 1;
				return;
			}
		}


		//点击查看全部查看全部的商品规格参数
		const openParameter = () => {
			parameterShow.value = !parameterShow.value
		}



		//获取元素距离父元素的顶部及左边的距离
		const offset = el => {
			let top = el.offsetTop
			let left = el.offsetLeft
			if (el.offsetParent) {
				el = el.offsetParent
				top += el.offsetTop
				left += el.offsetLeft
			}
			return {
				left: left,
				top: top
			}
		}

		const kefu = () => {
			if (store.state.loginFlag) {
				let chatInfo = {
					storeId: goodsDetail.data.storeInfo.storeId,
					vendorAvatar: goodsDetail.data.storeInfo.storeLogo,
					storeName: goodsDetail.data.storeInfo.storeName,
					source: L['从商品详情页进入'],
					sourceType: 'goods',
					showData: {
						productId: goodsDetail.data.defaultProduct.productId,
						goodsName: goodsDetail.data.goodsName,
						goodsImage: goodsDetail.data.shareImage,
						productPrice: goodsDetail.data.defaultProduct.productPrice,
						goodsId: goodsDetail.data.goodsId
					}
				}
				store.commit('saveChatBaseInfo', chatInfo)

				let newWin = router.resolve({
					path: '/service',
					query: {
						vid: goodsDetail.data.storeInfo.storeId
					}
				})

				window.open(newWin.href, '_blank')
			}
		}

		//进入供应商
		const goStore = () => {
			let tarUrl = router.resolve({
				path: '/store/index',
				query: {
					vid: vid.value
				}
			})
			window.open(tarUrl.href, '_blank')
		}

		//分享
		const share = type => {
			let title = goodsDetail.data.goodsName //需要分享的标题,这里取商品名字
			let url = goodsDetail.data.shareLink //分享的地址，用户点击可以进入到该商品
			let content = goodsDetail.data.goodsBrief //自定义内容,这里取商品广告词
			let targetUrl = '' //跳转的url地址
			if (type == 'weixin') {
				wxShareCode.value = true
				//微信
				let canvas = qrcanvas({
					data: url, //二维码内容
					size: 100,
					colorDark: 'red'
				})
				let share_wx_qrcode = document.getElementById('share_wx_qrcode')
				if (
					wxShareCode.value &&
					share_wx_qrcode != null &&
					share_wx_qrcode != undefined
				) {
					document.getElementById('share_wx_qrcode').innerHTML = ''
					document.getElementById('share_wx_qrcode').appendChild(canvas)
				}
			} else if (type == 'qzone') {
				wxShareCode.value = false
				//QQ空间
				targetUrl =
					'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=' +
					encodeURIComponent(title) +
					'&desc=' +
					encodeURIComponent(content) +
					'&summary=' +
					encodeURIComponent(content) +
					'&url=' +
					encodeURIComponent(url)
				window.open(targetUrl, '_blank')
			} else if (type == 'sina') {
				wxShareCode.value = false
				//新浪微博
				targetUrl =
					'https://service.weibo.com/share/share.php?title=' +
					encodeURIComponent(content + '「' + title + '」' + L[' 点这里'] + url)
				window.open(targetUrl, '_blank')
			}
		}




		//用于切换用户的地址，获取信运费等
		const getUserEx = (cityCode, addressId) => {


			let param = {
				productId: productId.value,
				num: currentSpecNum.value,
			}

			cityCode && (param.cityCode = cityCode)

			proxy.$get('v3/supplier/channel/goods/calculateExpress', param).then(res => {
				if (res.state == 200) {
					expressFee.value = res.data
				}
			})


			if (store.state.logFlag) {
				if (addressId && addressId != curAddr.value) {
					curAddr.value = addressId
					if (curAddr.value >= 0) {
						proxy
							.$post('v3/supplier/channel/userAddress/changeDefaultAddress', {
								addressId,
								isDefault: 1
							})
							.then(() => { })
							.catch(() => { })
					}
				}
			}
		}

		const refreshInfo = () => {
			history.go(0)
		}

		const updateFllow = e => {
			goodsDetail.data.storeInfo.isFollowStore = e.state == 'true' ? true : false
		}

		const commentCount = ref(0)
		const getCommentCount = (e) => {
			commentCount.value = e
		}

		const getChangeNum = (num) => {
			currentSpecNum.value = num
		}

		const getCurrentLadderPrice = (price) => {
			productPrice.value = price
		}

		//暴露的变量及方法
		return {
			getCurrentLadderPrice,
			specList,
			specInfo,
			getUserEx,
			getChangeNum,
			priceRange,
			productPrice,
			commentCount,
			getCommentCount,
			promotionRegister,
			expressFee,
			L,
			productId,
			goodsDetail,
			isChoice,
			selectSpecVal,
			currentSpecNum,
			addCart,
			goBuy,
			goodsDesctionType,
			goodsDescType,
			focusStore,
			collectGoods,
			goGoodsDetail,
			vid,
			cartListData,
			firstLoading,
			container,
			containerTop,
			containCon,
			kefu,
			goStore,
			goodsPictureList,
			share,
			wxShareCode,
			openParameter,
			parameterShow,
			score,
			colors,
			recomOffShop,
			genQrcode,
			isShowQr,
			logFlag,
			refreshInfo,
			updateFllow,
			memberInfo,
			defaultProduct,
			promotionInfo,
			promotionShowPrice,
			promotionShowPriceBefore,
			specProductList,
			totalPrice,
		}
	}
}
</script>

<style lang="scss">
@import '../../style/base.scss';
@import '../../style/goodsDetail.scss';

.sld_goods_detail {
	.goods_html {
		p {
			line-height: 20px;
		}
	}
}

.popular_list_empty {
	height: 95px;

	font-size: 14px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #666666;
}

.imageBorder {
	border: 1px solid #eee;
}

.goods_picture_big {
	border: 1px solid #eee;
}

.usual_addr {
	.el-radio__inner:hover {
		border-color: var(--color_main);
	}

	.el-radio__input.is-checked .el-radio__inner {
		border-color: var(--color_main);
		background: var(--color_main_bg);
	}

	.el-radio__input.is-checked+.el-radio__label {
		color: var(--color_main);
	}

	.el-radio {
		margin-bottom: 10px;
		display: flex;
		align-items: flex-start;
		white-space: unset;
		margin-right: unset;
	}

	.el-radio-button__inner,
	.el-radio-group {
		/* display: block; */
		line-height: 1;
		vertical-align: middle;
	}

	.el-radio__label {
		font-size: 13px;
		width: 320px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		line-height: 22px;
		margin-top: -5px;
	}
}



.evaluationes {
	color: #3b4 !important;
}

.sld_goods_detail .goods_htmls .ql-video {
	width: 525px;
	height: 315px;
}

.sld_goods_detail .goods_htmls a {
	display: inline-block;
	margin: 5px auto;
	color: #0000ff;
	text-decoration: underline;
}

.sld_goods_detail .goods_htmls table {
	border-collapse: collapse;
	padding: 0;
}

.sld_goods_detail .goods_htmls td,
.sld_goods_detail .goods_htmls th {
	border: 1px solid #ddd;
	padding: 5px 10px;
}

.sld_goods_detail .goods_htmls ol,
.sld_goods_detail .goods_htmls ul {
	padding-left: 10px;
}

.sld_goods_detail .goods_htmls ol li,
.sld_goods_detail .goods_htmls ul li {
	list-style: unset;
}

.series {
	.series_title {
		min-width: 62px;
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
	}

	.series_go {
		display: inline-block;
		border-bottom: 1px solid var(--color_main);
		color: var(--color_main);
		cursor: pointer;

		&.skeleton_series_go {
			width: 64px;
			height: 18px;
			background: $colorSkeleton;
			border-bottom: none;
		}
	}

	.series_total {
		font-size: 20px;
		font-family: SourceHanSansCN-Regular, SourceHanSansCN;
		font-weight: 400;
		color: var(--color_price);

		&.skeleton_series_total {
			width: 74px;
			height: 23px;
			background: $colorSkeleton;
			color: $colorSkeleton;
		}
	}

	.choose_num {
		margin-left: 10px;
		margin-top: 2px;

		span {
			color: #666
		}
	}

	.select_vals {
		font-size: 14px;
		font-family: SourceHanSansCN-Regular;
		line-height: 21px;
		color: var(--color_main);
		cursor: pointer;
		margin-right: 20px;
		transition: all 0.3s;

		.el-icon-arrow-down,
		.el-icon-arrow-up {
			margin-left: 5px;
			font-weight: bold;
		}
	}
}
</style>
