// 申请退款页面
<template>
	<div class="sld_apply_refund">
		<div class="apply_refund_top flex_row_end_center" @click="batchSelGoods"
			v-if="batchList.data && batchList.data.length > 0">
			<dynaIcon src="order/add.png" width="20" height="20" color="--color_vice" class="img">
			</dynaIcon>
			<span>{{ L['添加/编辑'] }}</span>
			<span>{{ L['（同订单商品可批量申请）'] }}</span>
			<!-- <span>（已选7件商品）</span> -->
		</div>
		<!-- 退款商品信息 start -->
		<refund-goods :refundOrderDetail="refundOrderDetail.data" v-if="batchGoods.data && batchGoods.data.length == 0">
		</refund-goods>
		<!-- 退款商品信息 end -->
		<div v-if="batchGoods.data && batchGoods.data.length > 0">
			<refund-goods :refundOrderDetail="batchGoodsItem" v-for="(batchGoodsItem, batchGoodsIndex) in batchGoods.data"
				:key="batchGoodsIndex"></refund-goods>
		</div>
		<!-- 退款详细信息 start -->
		<div class="apply_refund_info">
			<!-- 退款金额 start -->
			<div class="refund_amount flex_row_start_center marginBottom20">
				<div class="refund_title">{{ L['退款金额'] }}：</div>
				<!-- 不可编辑 -->
				<div class="refund_amount_edit flex_row_start_center" v-if="applyState == 100 || (curCargoStatus != 1)">
					<span class="refund_amount_price">R${{ $formatMoneyNum(refundDetail.data.maxReturnMoney || 0) }}</span>
					<div class="refund_amount_tips">
						（{{ L['退款金额不可修改，最多'] }}R${{ $formatMoneyNum(refundDetail.data.maxReturnMoney || 0) }}
						{{ refundDetail.data.returnExpressFee > 0 ? '(' + L['含运费'] + $formatMoneyNum(refundDetail.data.returnExpressFee || 0) + ')' : '（'
				+
				L['不含运费'] + '）' }}）
					</div>
				</div>
				<!-- 可编辑 -->
				<div v-else class="flex_row_start_center">
					<div class="refund_amount_edit flex_row_start_center" v-if="!editAmountShow">
						<span class="refund_amount_price">R${{ $formatMoneyNum(curEditRefundAmount || 0) }}</span>
						<span class="edit_price_btn" @click="editAmount">{{ L['修改金额'] }}</span>
						<span>（{{ L['退款金额可修改，最多'] }}R${{ $formatMoneyNum(refundDetail.data.maxReturnMoney || 0) }}
							{{ refundDetail.data.returnExpressFee > 0 ? '(' + L['含运费'] + $formatMoneyNum(refundDetail.data.returnExpressFee || 0) + ')' :
				'（'
				+
				L['不含运费'] + '）' }}）</span>
					</div>
					<div class="edit_refund_amount flex_row_start_center" v-if="editAmountShow">
						<el-input v-model="curEditRefundAmount" :placeholder="L['请输入退款金额']" type="number" class="amount_input"
							@blur="handleBlur">
						</el-input>
						<span class="cancel_edit_amount" @click="cancelEditAmount">{{ L['取消'] }}</span>
						<span class="ok_edit_amount" @click="okEditAmount">{{ L['确定'] }}</span>
					</div>
					<div class="refund_amount_tips" v-if="editAmountShow">
						（{{ L['退款金额可修改，最多'] }}R${{ $formatMoneyNum(refundDetail.data.maxReturnMoney || 0) }}
						{{ refundDetail.data.returnExpressFee > 0 ? '(' + L['含运费'] + $formatMoneyNum(refundDetail.data.returnExpressFee || 0) + ')' : '（'
				+
				L['不含运费'] + '）' }}）
					</div>
				</div>
			</div>
			<!-- 退款金额 end -->
			<!-- 申请件数 start -->
			<div class="apply_number flex_row_start_center marginBottom20">
				<div class="refund_title">{{ L['申请件数'] }}：</div>
				<!-- 不可修改 -->
				<div class="apply_number_con" v-if="applyState == 100 || (curApplyType == 0)">
					{{ applyNum }}
				</div>
				<!-- 可修改 -->
				<el-input-number v-model="applyNum" class="mx-4" :min="1" :max="refundDetail.data.number"
					controls-position="right" size="small" :disabled="batchGoods.data.length > 1 ? true : false"
					@change="handleApply" v-else />

			</div>
			<!-- 申请件数 end -->
			<!-- 申请类型 start-->
			<div class="apply_type flex_row_start_center marginBottom20" v-if="applyState > 100">
				<div class="refund_title"><span>*</span>{{ L['申请类型'] }}：</div>
				<el-radio-group class="cargo_status_btn flex_row_start_center" v-model="curApplyType"
					@change="changeApplyType($event)">
					<el-radio :label="applyTypeItem.value"
						v-for="(   applyTypeItem, applyTypeIndex   ) in    applyTypeList.data   " :key="applyTypeIndex">{{
				applyTypeItem.content }}
					</el-radio>
				</el-radio-group>
			</div>
			<!-- 申请类型 end -->
			<!-- 货物状态 start -->
			<div class="cargo_status flex_row_start_center marginBottom20" v-if="applyState > 100 && curApplyType == 0">
				<div class="refund_title"><span>*</span>{{ L['货物状态'] }}：</div>
				<el-radio-group class="cargo_status_btn flex_row_start_center" v-model="curCargoStatus"
					@change="changeCargoStatus($event)">
					<el-radio :label="cargoStatusItem.value" v-for="(cargoStatusItem, cargoStatusIndex) in cargoStatuslList.data"
						:key="cargoStatusIndex">{{
				cargoStatusItem.content }}
					</el-radio>
				</el-radio-group>
			</div>
			<!-- 货物状态 end -->
			<!-- 退款原因 start -->
			<div class="refund_reasons flex_row_start_center marginBottom20">
				<div class="refund_title">
					<span>*</span>{{ curApplyType == 0 ? L['退款原因'] : L['退货原因'] }}：
				</div>
				<el-select :placeholder="curApplyType == 0 ? L['请选择退款原因'] : L['请选择退货原因']
				" v-if="cancelList.data && cancelList.data.length > 0" @change="changeCancel($event)" v-model="curCancelReason"
					id="elSelect">
					<el-option v-for="cancelItem in cancelList.data" :key="cancelItem.reasonId" :label="cancelItem.content"
						:value="cancelItem.reasonId">
					</el-option>
				</el-select>
			</div>
			<!-- 退款原因 end -->
			<!-- 退款说明 start -->
			<div class="refund_instruction flex_row_start_start marginBottom20">
				<div class="refund_title">{{ L['问题描述'] }}：</div>
				<el-input type="textarea" v-model="refundInstruction" maxlength="200" show-word-limit
					:placeholder="L['请输入问题描述(选填)']"></el-input>
			</div>
			<!-- 退款说明 end -->
			<!-- 上传凭证 start -->
			<div class="upload_voucher flex_row_start_start marginBottom20">
				<div class="refund_title">{{ L['上传凭证'] }}：</div>
				<div>
					<div class="upload_count">
						总共上传<span style="color: var(--color_main);">{{ upLoadFile.data.length }}</span>/5张图片
					</div>
					<div class="upload">
						<el-upload :action="uploadImgUrl" list-type="picture-card" :on-preview="handlePictureCardPreview"
							:on-remove="handleRemove" limit="5" :data="upload_data" name="file" :on-success="uploadImg"
							:on-exceed="exceedHandle" id="elUpload" accept="image/*" :headers="headers">
							<template #default>
								<i class="el-icon-plus"></i>
							</template>
						</el-upload>
						<el-dialog v-model="dialogVisible" lock-scroll="false" top="10vh" width="60%">
							<div style="overflow: auto; width: 100%; display: flex; justify-content: center;">
								<img :src="dialogImageUrl" alt="" style="max-height: 700px;" />
							</div>
						</el-dialog>
					</div>
				</div>
			</div>
			<!-- 上传凭证 end -->
		</div>
		<!-- 退款详细信息 end -->
		<div class="apply_refund_btn" @click="submitApplyRefund">
			{{ L['确定'] }}
		</div>

		<!-- 批量选择商品的弹框 start -->
		<el-dialog width="620px" v-model="batchSelModel" append-to-body :title="L['批量售后商品选择']" lock-sroll="false"
			custom-class="custom_dialog">
			<div class="batch_selModel">
				<el-scrollbar>
					<div style="padding: 15px;">
						<div class="batch_default">
							<div class="batch_default_pre flex_row_start_center"
								v-for="(   batchGoodsItem, batchGoodsIndex   ) in    batchGoodsList.data   " :key="batchGoodsIndex">
								<el-checkbox :checked="batchGoodsItem.sel" @change="selGoods(batchGoodsItem.productId)"></el-checkbox>

								<div class="flex_row_between_center" style="flex: 1;">
									<div class="flex_row_start_center">
										<div :style="{
				backgroundImage: 'url(' + batchGoodsItem.productImage + ')'
			}" class="batch_default_img"></div>
										<div class="batch_default_des">
											<p class="goodsName">{{ batchGoodsItem.goodsName }}</p>
											<div class="flex_row_start_center">
												<p class="specValues">{{ batchGoodsItem.specValues }}</p>
												<p class="editNum">&nbsp;x{{
				batchGoodsItem.currNum }}</p>
											</div>
										</div>
									</div>

									<el-input-number v-model="batchGoodsItem.editNum" @change="handleEditBatchNum" :min="1" :max="batchGoodsItem.productNum > 999
				? 999
				: batchGoodsItem.productNum
				" label="描述文字" :class="edit_batch_num" size="small" class="el_diy_input_number"
										v-if="!(batchGoodsItem.afsButton == 100 || curApplyType == 0)"></el-input-number>
								</div>

							</div>
						</div>
					</div>

				</el-scrollbar>
			</div>
			<div class="batch_model_btn flex_row_end_center">
				<span @click="batchCancel">{{ L['取消'] }}</span>
				<span @click="batchOk">{{ L['确定'] }}</span>
			</div>
		</el-dialog>
		<!-- 批量选择商品的弹框 end -->
	</div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, computed } from 'vue'
import { ElMessage, ElInput } from 'element-plus'
import RefundGoods from '../../../components/RefundGoods'
import { apiUrl } from '../../../utils/config'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
	components: {
		RefundGoods,
		ElInput
	},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const route = useRoute()
		const router = useRouter()
		
		const refundOrderDetail = reactive({ data: {} }) //退款商品信息
		const store = useStore()
		const upload_data = reactive({
			source: 'afterSale'
		})
		const cargoStatuslList = reactive({
			data: [
				//货物状态
				{
					content: L['未收到货'],
					value: 0,
					cargoStatusCurId: 0
				},
				{
					content: L['已收到货'],
					value: 1,
					cargoStatusCurId: 1
				}
			]
		})
		const applyTypeList = reactive({
			//申请类型列表
			data: [
				{
					content: L['仅退款'],
					value: 0
				},
				{
					content: L['退款退货'],
					value: 1
				}
			]
		})
		const curCargoStatus = ref(0) //货物状态，默认选中第一个（未收到货）
		const returnAmount = ref('') //退款金额
		const applyNum = ref(1) //申请件数
		const refundDetail = reactive({ data: {} }) //退款详情
		const cancelList = reactive({ data: [] }) //取消原因列表
		const curCancelReason = ref('') //当前选中的取消原因
		const curCancelReasonId = ref(-1) //当前选中的取消原因的id
		const refundInstruction = ref('') //退款说明
		const uploadImgUrl = apiUrl + 'v3/oss/channel/upload' //图片上传路径
		const orderState = ref(20) //orderState:订单状态，20，待发货 30,待收货
		const cargoStatusCurId = ref(0) //当前已选择的货物状态id
		const curEditRefundAmount = ref('')
		const batchSelModel = ref(false) //批量申请售后弹框
		const curApplyType = ref(0) //当前申请类型 0：仅退款 1：退款退货 2.换货
		const batchList = reactive({ data: [] }) //批量售后商品列表
		const defaultGoods = reactive({ data: {} }) //默认选中的商品
		const batchGoodsList = reactive({ data: [] }) //同订单其他的商品
		const batchGoods = reactive({ data: [], ids: [] }) //批量选择后的商品列表
		const editAmountShow = ref(false) //修改金额是否显示
		const orderProductId = ref(410) //订单商品id
		const dialogVisible = ref(false) //图片预览弹框是否显示
		const dialogImageUrl = ref('') //图片预览图片地址
		const upLoadFile = reactive({ data: [] }) //用于传给后端的文件列表
		const headers = reactive({ Authorization: 'Bearer ' + store.getters.accessToken })
		const applyState = ref(100)
		onMounted(() => {
			orderState.value = route.query.orderState
			orderProductId.value = route.query.orderProductId
			getRefundOrderDetail()
		})

		//获取售后订单货品详情
		const getRefundOrderDetail = () => {
			let params = {
				orderProductId: orderProductId.value
			}
			proxy
				.$get(
					'v3/supplier/channel/return/apply/getOrderProductDetail',
					params
				)
				.then(res => {
					if (res.state == 200) {
						refundOrderDetail.data = res.data
						applyState.value = res.data.afsButton
					} else {
						ElMessage.error(res.msg)
					}
				})
				.then(() => {
					getRefundDetail()
					getCancelList()
					getBatchOrderDetail()
				})
		}
		//获取计算售后退款信息，计算结果未此次最多可退金额
		const getRefundDetail = (type, Infos, num) => {
			let params = {}
			if (type == 'batch') {
				params = {
					orderSn: refundOrderDetail.data.orderSn,
					orderProductInfos: Infos.join(',') //退换的订单货品列表，格式为：id1-num1,id2-num2...num为空时表示此订单货品全部退换
				}
			} else {
				//单个商品
				let orderProductInfos = ''
				orderProductInfos =
					refundOrderDetail.data.orderProductId +
					'-' +
					(num || refundOrderDetail.data.productNum)
				params = {
					orderSn: refundOrderDetail.data.orderSn,
					orderProductInfos: orderProductInfos
				}
			}
			proxy
				.$get('v3/supplier/channel/return/apply/countReturnMoney', params)
				.then(res => {
					if (res.state == 200) {
						let result = res.data
						if (num) {
							Object.keys(result).forEach(i => {
								if (i != 'number' || !refundDetail.data.number) {
									refundDetail.data[i] = result[i]
								}
							})
						} else {
							refundDetail.data = result
						}
						returnAmount.value = result.maxReturnMoney
						curEditRefundAmount.value = refundDetail.data.maxReturnMoney
						applyNum.value = result.number
					} else {
						ElMessage.error(res.msg)
					}
				})
		}
		const editAmount = () => {
			editAmountShow.value = true
		}
		//取消修改退款金额
		const cancelEditAmount = () => {
			curEditRefundAmount.value = refundDetail.data.maxReturnMoney
			editAmountShow.value = false
		}
		//确定修改退款金额
		const okEditAmount = () => {
			editAmountShow.value = false
			if (curEditRefundAmount.value <= 0) {
				ElMessage(L['退款金额不可为0或者负值！'])
				curEditRefundAmount.value = refundDetail.data.maxReturnMoney
			} else if (curEditRefundAmount.value > refundDetail.data.maxReturnMoney) {
				ElMessage(L['不可超过最大退款金额！'])
				curEditRefundAmount.value = refundDetail.data.maxReturnMoney
			}
		}
		//获取退款原因
		const getCancelList = () => {
			// 参数：curApplyType.value 0:仅退款 1：退货退款
			// 参数: cargoStatusCurId.value 0 :未收到货 1：已收到货
			let type = -1
			if (orderState.value == 20) {
				type = 105
			} else {
				if (curApplyType.value == 0 && cargoStatusCurId.value == 0) {
					//仅退款未收到货
					type = 105
				}
				if (curApplyType.value == 0 && cargoStatusCurId.value == 1) {
					//仅退款已收货
					type = 106
				}
				if (curApplyType.value == 1) {
					//退货退款
					type = 107
				}
			}
			let params = {
				type: type
			}
			//原因类型：101-违规下架；102-商品审核拒绝；103-入驻审核拒绝；104-会员取消订单；105-仅退款-未收货；106-仅退款-已收货；107-退款退货原因；108-商户取消订单
			proxy.$get('v3/system/common/list', params).then(res => {
				if (res.state == 200) {
					let result = res.data
					cancelList.data = result || []
				} else {
					ElMessage.error(res.msg)
				}
			})
		}
		//选择退款原因
		const changeCancel = e => {
			cancelList.data &&
				cancelList.data.map(cancelItem => {
					if (cancelItem.reasonId == e) {
						curCancelReason.value = cancelItem.content
						curCancelReasonId.value = cancelItem.reasonId
					}
				})
		}
		//选择货物状态
		const changeCargoStatus = e => {
			curCargoStatus.value = e
			curCancelReason.value = ''
			curCancelReasonId.value = ''
			cargoStatuslList.data.map(cargoStatusItem => {
				if (cargoStatusItem.value == e) {
					cargoStatusCurId.value = e
				}
			})
			getCancelList()
		}
		//选择申请类型
		const changeApplyType = e => {
			curCancelReason.value = ''
			curCancelReasonId.value = ''
			applyTypeList.data.map(applyItem => {
				if (applyItem.value == e) {
					curApplyType.value = e
				}
			})
			if (e == 0) {
				getRefundDetail()
			} else {
				curCargoStatus.value = 0
			}
			getCancelList()
		}
		//批量选择商品
		const batchSelGoods = () => {
			batchSelModel.value = true
			defaultGoods.data.editNum = defaultGoods.data.currNum
			batchGoodsList.data.forEach(item => {
				if (batchGoods.ids.indexOf(item.goodsId) != -1) {
					item.sel = true
				} else {
					item.sel = false
				}
				item.editNum = item.currNum
			})
		}
		//获取售后商品选择的商品数据
		const getBatchOrderDetail = () => {
			let params = {
				orderSn: refundOrderDetail.data.orderSn,
				orderProductId: refundOrderDetail.data.orderProductId
			}
			proxy
				.$get('v3/supplier/channel/return/apply/getOrderProductList', params)
				.then(res => {
					if (res.state == 200) {
						let result = res.data.filter(ba => ba.afsButton == applyState.value)
						batchList.data = result
						// 主商品
						defaultGoods.data = batchList.data[0]
						defaultGoods.data.currNum = batchList.data[0].productNum
						defaultGoods.data.sel = true //sel是否选中
						// 同订单其他商品
						batchList.data.splice(0, 1)
						batchGoodsList.data = batchList.data
						batchGoodsList.data.map(batchGoodsItem => {
							batchGoodsItem.currNum = batchGoodsItem.productNum
							batchGoodsItem.sel = false
						})
					} else {
						ElMessage.error(res.msg)
					}
				})
		}
		//批量售后，商品状态的选择
		const selGoods = productId => {
			batchGoodsList.data &&
				batchGoodsList.data.map(batchGoodsItem => {
					if (batchGoodsItem.productId == productId) {
						batchGoodsItem.sel = !batchGoodsItem.sel
					}
				})
		}
		//批量售后，取消
		const batchCancel = () => {
			batchSelModel.value = false
		}
		//批量售后，确定
		const batchOk = () => {
			batchSelModel.value = false
			defaultGoods.data.currNum = defaultGoods.data.editNum
			//批量多个商品
			let batchSelList = []
			let ids = []
			batchSelList.push(defaultGoods.data)
			batchGoodsList.data.map(batchGoodsItem => {
				batchGoodsItem.currNum = batchGoodsItem.editNum
				if (batchGoodsItem.sel) {
					batchSelList.push(batchGoodsItem)
					ids.push(batchGoodsItem.goodsId)
				}
			})
			batchSelList.forEach(batchSelItem => {
				batchSelItem.infopre =
					batchSelItem.orderProductId + '-' + batchSelItem.currNum
			})
			let Infos = []
			batchSelList.forEach(batchSelItem => {
				Infos.push(batchSelItem.infopre)
			})
			//同订单其他商品
			batchGoods.data = batchSelList
			batchGoods.ids = ids
			batchGoodsList.data = batchList.data

			getRefundDetail('batch', Infos)
		}
		//图片预览
		const handlePictureCardPreview = response => {
			dialogVisible.value = true
			dialogImageUrl.value = response.url
		}
		//上传图片
		const uploadImg = response => {
			if (response.state == 200) {
				upLoadFile.data.push(response.data.path)
			}
			if (upLoadFile.data.length == 5) {
				document.getElementById('elUpload').children[1].style.display = 'none'
			}
		}
		const handleRemove = file => {
			if (file.status == 'success') {
				upLoadFile.data = upLoadFile.data.filter(
					item => item != file.response.data.path
				)
			}
			if (upLoadFile.data.length < 5) {
				document.getElementById('elUpload').children[1].style.display =
					'inline-block'
			}
		}

		//上传图片，图片超出限制
		const exceedHandle = () => {
			ElMessage(L['最多上传5张！'])
		}
		//确定提交申请
		const submitApplyRefund = () => {
			if (curCancelReason.value == '' && curApplyType.value == '0') {
				ElMessage(L['请选择退款原因'])
			} else if (curCancelReason.value == '' && curApplyType.value == '1') {
				ElMessage(L['请选择退货原因'])
			} else {
				let productList = []
				if (batchGoods.data.length == 0) {
					//单个商品
					let orderProduct = {}
					orderProduct.orderProductId = refundOrderDetail.data.orderProductId
					orderProduct.afsNum = applyNum.value
					productList.push(orderProduct)
				} else {
					//批量申请
					productList =
						batchGoods.data &&
						batchGoods.data.map(function (batchGoodsItem) {
							return {
								orderProductId: batchGoodsItem.orderProductId,
								afsNum: batchGoodsItem.currNum
							}
						})
				}
				let params = {
					orderSn: refundOrderDetail.data.orderSn,
					afsType: curApplyType.value == '0' ? 1 : 2, //申请类型（售后服务单类型，1-退货退款单（需关联处理退款金额），2-换货单，3-仅退款单）
					applyReasonContent: curCancelReason.value, //售后原因
					afsDescription: refundInstruction.value, //问题描述
					applyImage: upLoadFile.data.join(','), //上传凭证图片,多个图片用英文逗号隔开
					productList: productList, //订单货品列表
					goodsState: cargoStatusCurId.value, //货物状态
					finalReturnAmount: curEditRefundAmount.value //退款金额
				}
				params = JSON.stringify(params)
				proxy
					.$post('v3/supplier/channel/return/apply/submit', params, 'json')
					.then(res => {
						if (res.state == 200) {
							ElMessage.success(res.msg)
							router.go(-1)
						} else {
							ElMessage.error(res.msg)
						}
					})
			}
		}

		const handleBlur = () => {
			if (curEditRefundAmount.value.toString().split('.').length) {
				let tmp = curEditRefundAmount.value.toString().split('.')[0]
				curEditRefundAmount.value =
					tmp.length > 2
						? curEditRefundAmount.value.toFixed(2)
						: curEditRefundAmount.value
			}
		}

		const handleApply = () => {
			applyNum.value && getRefundDetail(null, null, applyNum.value)
		}

		const blurApply = () => {
			let reg = /\./g
			let reg0 = /0+\d/

			if (
				reg.test(applyNum.value) ||
				reg0.test(applyNum.value) ||
				applyNum.value <= 0
			) {
				applyNum.value = 1
			}
		}

		return {
			blurApply,
			L,
			applyState,
			refundOrderDetail,
			cargoStatuslList,
			curCargoStatus,
			returnAmount,
			applyNum,
			refundDetail,
			cancelList,
			changeCancel,
			curCancelReason,
			changeCargoStatus,
			refundInstruction,
			uploadImgUrl,
			submitApplyRefund,
			cargoStatusCurId,
			curEditRefundAmount,
			cancelEditAmount,
			okEditAmount,
			batchSelGoods,
			batchSelModel,
			applyTypeList,
			curApplyType,
			changeApplyType,
			batchList,
			defaultGoods,
			batchGoodsList,
			selGoods,
			batchCancel,
			batchOk,
			batchGoods,
			orderState,
			editAmountShow,
			editAmount,
			orderProductId,
			dialogImageUrl,
			dialogVisible,
			handlePictureCardPreview,
			upload_data,
			uploadImg,
			upLoadFile,
			getCancelList,
			exceedHandle,
			handleRemove,
			handleBlur,
			handleApply,
			headers,
		}
	}
}
</script>

<style lang="scss">
@import '../../../style/base.scss';
@import '../../../style/applyRefund.scss';

.custom_dialog {
	padding: 20px;

	.el-dialog__body {
		padding: 0;
	}

	.el-dialog__header {
		padding-top: 0;
		padding-left: 0;
		padding-bottom: 19px;
	}
}

.el-input__inner {
	line-height: 1px !important;
	/**
		* 解决el-input设置类型为number时，中文输入法光标上移问题
		**/
}

.el_diy_input_number {
	width: 112px;

	.el-input__inner {
		border-radius: 0px;
	}
}

.el-radio {
	display: flex;
	align-items: center;
}

.el-radio__label {
	width: 240px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	padding-bottom: 2px;
}

.el-icon-close-tip {
	display: none !important;
}

.el-upload-list__item-status-label {
	display: none !important;
}

.el-radio__input.is-checked .el-radio__inner {
	border-color: var(--color_main);
	background: var(--color_main);
}

.el-radio__input.is-checked+.el-radio__label {
	color: var(--color_main);
}


.sld_apply_refund {
	.el-textarea {
		width: 786px;
		resize: none;
	}

	textarea {
		resize: none !important;
	}
}



input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

input[type='number'] {
	-moz-appearance: textfield;
}

.upload_count {
	font-size: 14px;
	margin-bottom: 10px;
}
</style>
