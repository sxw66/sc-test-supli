<template>
	<div class="confirm_order_wrap">
		<div class="top_order_info flex_row_start_center">
			<div class="top_logo">
				<router-link to="/" replace>
					<div :style="`background-image:url(${configInfo.supplier_main_site_logo})`"></div>
				</router-link>
			</div>
			<div class="top_info_progress flex_row_end_center">
				<div class="progress_item" v-if="pre_params.data.ifcart == 'true'">
					<div class="progress flex_row_center_center">
						<span class="active">1</span>
						<div class="progress_line">
							<div :class="{ content: true, active: true }"></div>
						</div>
					</div>
					<p class="progress_p">{{ L['进货单'] }}</p>
				</div>
				<div class="progress_item">
					<div class="progress flex_row_center_center">
						<span class="active">
							{{
						pre_params.data.ifcart == 'true' ? 2 : 1
					}}
						</span>
						<div class="progress_line">
							<div :class="{ content: true, active: false, current: false }"></div>
						</div>
					</div>
					<p style="margin-left: -11px">{{ L['确认订单'] }}</p>
				</div>
				<div class="progress_item">
					<div class="progress flex_row_center_center">
						<span :class="{ active: false }">
							{{
						pre_params.data.ifcart == 'true' ? 3 : 2
					}}
						</span>
						<div class="progress_line">
							<div :class="{ content: true, active: false }"></div>
						</div>
					</div>
					<p>{{ L['付款'] }}</p>
				</div>
				<div class="progress_item" style="margin-left: -24px">
					<div class="progress flex_row_end_center">
						<span :class="{ active: false }">
							{{
						pre_params.data.ifcart == 'true' ? 4 : 3
					}}
						</span>
					</div>
					<p class="progress_p_one">{{ L['支付成功'] }}</p>
				</div>
			</div>
		</div>
		<div class="affirm">{{ L['填写并核对订单信息'] }}</div>
		<div class="confirm_order_container">
			<div class="receive_info">
				<div v-if="virtual.isVG == 1">
					<div class="receive_info_title">
						<div class="line"></div>
						<span>{{ L['收货人信息'] }}</span>
						<div class="add_ress" @click="addAddress">{{ L['新增收货地址'] }}</div>
					</div>
					<div v-if="address_list.data.length" class="receive_info_content flex_row_start_center">
						<div style="width:100%" v-if="exhibition_show">
							<div class="content_left flex_column_between_start"
								:class="{ city_start: current_address_index == index }" v-for="(item, index) in address_list.data"
								:key="index" @click="confirmChangeAddress(index)">
								<div class="city_left">
									<img src="../../assets/city.png" alt class="city_img" />
									<div class="city_cont" :class="{ city_cont_sm: item.isDefault == 1 }">
										<span>{{ item.receiverName }}</span>
										<span>{{ item.receiverMobile }}</span>
										<span>
											<text>{{ item.addressAll }}</text>
											{{ item.detailAddress }}
										</span>
									</div>
									<div class="default_city flex_row_center_center" v-if="item.isDefault == 1">{{
						L['默认地址'] }}</div>
									<dynaIcon src="buy/corner_icon.png" width="23" height="22" color="--color_main" class="img_xuan"
										v-show="current_address_index == index"></dynaIcon>
								</div>
							</div>
						</div>
						<div class="content_left flex_column_between_start city_start" v-else>
							<div class="city_left">
								<img src="../../assets/city.png" alt class="city_img" />
								<div class="city_cont" :class="{ city_cont_sm: orderAddress.data.isDefault == 1 }">
									<span>{{ orderAddress.data.receiverName }}</span>
									<span>{{ orderAddress.data.receiverMobile }}</span>
									<span>
										<text>{{ orderAddress.data.addressAll }}</text>
										{{
						orderAddress.data.detailAddress }}
									</span>
								</div>
								<div v-if="orderAddress.data.isDefault == 1" class="default_city flex_row_center_center">{{ L['默认地址'] }}
								</div>
								<dynaIcon src="buy/corner_icon.png" width="23" height="22" color="--color_main" class="img_xuan">
								</dynaIcon>
							</div>
						</div>
					</div>
					<!-- <div v-if="address_list.data.length" class="exhibition" @click="exhibition">
						{{ exhibition_show ? L['收起地址'] : L['全部地址'] }}
						<img v-if="exhibition_show" src="../../assets/uparrow.png" alt />
						<img v-else src="../../assets/downarrow.png" alt />
					</div>
					<div v-else class="exhibition_none">{{ L['暂无收货地址'] }}</div>
					<div class="xian">
						<p></p>
					</div> -->
				</div>

				<div class="pre_message" v-if="virtual.isVG == 2 && virtual.virtualPre.length">
					<div class="pre_message_title">
						<div class="line"></div>
						<span>{{ L['预留信息'] }}</span>
					</div>
					<div class="pre_message_info">
						<table>
							<tr v-for="(item, index) in virtual.virtualPre" :key="index">
								<td>
									<div class="tag_pre">
										<strong v-if="item.isRequired == 1">*</strong>
										<span>
											{{ item.reserveName
											}}：
										</span>
									</div>
								</td>
								<td v-if="item.reserveType == 1 || item.reserveType == 3">
									<el-input id="pre_tag_input" v-model="item.reserveValue"
										:placeholder="`${L['请输入']}${item.reserveName}`" type="text"
										:maxlength="item.reserveType == 1 ? 11 : 50" clearable :key="index"
										@input="preMsgErr.index = -1"></el-input>
								</td>
								<td v-else-if="item.reserveType == 5">
									<el-input id="pre_tag_input" v-model="item.reserveValue"
										:placeholder="`${L['请输入']}${item.reserveName}`" type="text" :maxlength="30" clearable :key="index"
										@input="preMsgErr.index = -1"></el-input>
								</td>
								<td v-else>
									<el-input id="pre_tag_input" v-model="item.reserveValue"
										:placeholder="`${L['请输入']}${item.reserveName}`" type="text"
										:maxlength="item.reserveType == 2 ? 18 : 50" clearable :key="index"
										@input="preMsgErr.index = -1"></el-input>
								</td>
								<td v-if="index == preMsgErr.index">
									<span class="preMsgErr">{{ preMsgErr.errMsg }}</span>
								</td>
							</tr>
						</table>
					</div>
				</div>
				<!-- 预留信息 -->
				<div class="xian" v-if="virtual.isVG == 2 && virtual.virtualPre.length">
					<p></p>
				</div>
				<div class="receive_info_title">
					<div class="line"></div>
					<span>{{ L['商品清单'] }}</span>
					<div class="add_ress" v-if="pre_params.data.ifcart == 'true'" @click="goCart">{{ L['返回修改进货单'] }}
					</div>
				</div>
				<div class="confirm_title_info">
					<div class="shop">{{ L['供应商宝贝'] }}</div>
					<div class="unit_price">{{ L['单价'] }}</div>
					<div class="num">{{ L['数量'] }}</div>
					<div class="subtotal">{{ L['小计'] }}</div>
				</div>
				<!-- 供应商 -->
				<div v-for="(storeItem, index) in goods_data.data" :key="index" class="store_item">
					<div class="good_container">
						<!-- <div class="store_name">
							<span>{{ L['供应商：'] }}{{ storeItem.storeName }}</span>
						</div> -->
						<div v-for="(goodItem, index) in storeItem.productList" :key="index"
							class="good_item flex_row_start_center">
							<div class="good_info flex_row_start_center">
								<div class="good_image_con">
									<div class="virtual_tag" v-if="false">{{ L['虚拟'] }}</div>
									<img class="good_image" :src="goodItem.image" alt />
								</div>
								<div class="good_info_text flex_column_between_start">
									<div class="good_name overflow_ellipsis_two">{{ goodItem.goodsName }}</div>
									<div class="good_spec overflow_ellipsis">{{ goodItem.specValues }}</div>
								</div>
							</div>
							<div class="good_price">
								{{ L['R$'] }}<span>{{ $formatMoneyNum(goodItem.price || 0) }}</span>
							</div>
							<div class="num">
								<span>{{ L['x'] }}</span>
								{{ goodItem.buyNum }}
							</div>
							<div class="subtotal">
								{{
						L['R$']
					}}{{ $formatMoneyNum((goodItem.buyNum * goodItem.price)) }}
							</div>
						</div>
						<div v-for="(sendItem, index) in storeItem.sendProductList" :key="index"
							class="good_item flex_row_start_center">
							<div class="good_info flex_row_start_center">
								<img class="good_image" :src="sendItem.goodsImage" alt />
								<div class="good_info_text">
									<div class="good_name overflow_ellipsis_two">
										<span class="giftProduct">{{ L['赠品'] }}</span>
										{{ sendItem.goodsName }}
									</div>
									<div class="good_spec overflow_ellipsis">{{ L['赠完为止'] }}</div>
								</div>
							</div>
							<div class="good_price"></div>
							<div class="num">*{{ sendItem.num }}</div>
						</div>
					</div>
					<div class="additional">
						<div class="leaving_a_message">
							<div class="message_title">{{ L['给卖家留言：'] }}</div>
							<div class="store_coupon_con flex_row_start_center more_height">
								<el-input maxlength="100" v-model="storeItem.remark" type="textarea" :placeholder="L['选填，给卖家留言备注']"
									show-word-limit resize="none" rows="3" />
							</div>
						</div>
						<div class="discount_box">
							<div class="discount">
								<p>{{ L['使用优惠券'] }}</p>
								<div class="store_coupon_con flex_row_start_center">
									<span v-if="storeItem.availableCouponList.length == 0" class="title">
										{{ L['暂无可用优惠券'] }}
									</span>
									<el-select v-else class="voice_select" v-model="couponCode[index]"
										@change="changeCoupon(storeItem, index)" :placeholder="L['请选择']">
										<el-option :value="L['不使用优惠券']">
											{{ L['不使用优惠券'] }}
										</el-option>
										<el-option v-for="(couponItem, index) in storeItem.availableCouponList" :key="index" :label="couponItem.couponName +
						(couponItem.couponType == 2
							? `(${couponItem.value}${L['折']})`
							: `(${L['优惠']}${couponItem.value}${L['元']})`)
						" :value="couponItem.couponCode"></el-option>
									</el-select>
								</div>
							</div>
							<div class="settle_info">
								<div class="total_money">
									<span>{{ L['商品金额'] }}：</span>
									<span>{{ L['R$'] }}{{ $formatMoneyNum(storeItem.goodsAmount || 0) }}</span>
								</div>
								<div class="discounts">
									<span>{{ L['供应商总优惠'] }}：</span>
									<span class="red">-R${{ $formatMoneyNum(storeItem.totalDiscount || 0) }}</span>
								</div>
								<div class="shipping">
									<span>{{ L['运费'] }}：</span>
									<span class="red" v-if="storeItem.expressFee">
										+{{ L['R$'] }}{{ $formatMoneyNum(storeItem.expressFee || 0)
										}}
									</span>
									<span class="red" v-else>{{ L['免运费'] }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- // 原来的优惠券 -->

					<div class="store_coupon invoice" v-if="pre_params.data.ifcart == 'false'">
						<div class="store_coupon_title">
							<span>{{ L['发票'] }}</span>
						</div>
						<div class="invoice_con flex">
							<div class="no_select_invoice flex_row_center_center">
								<img :src="not_select" v-if="select_invoice_info.invoiceId == ''" alt @click="showVoiceDialog" />
								<dynaIcon :src="selected" width="19" height="18" color="--color_main" v-else>
								</dynaIcon>
								<span>{{ L['我要开发票'] }}</span>
								<div class="invoice_info" v-if="select_invoice_info.invoiceId">
									<span class="invoice_name">
										{{ select_invoice_info.invoiceTitle }}
									</span>
									<span class="invoice_type">
										{{ select_invoice_info.invoiceContentText }}
									</span>
									<span @click="showVoiceDialog" class="choose">
										{{ L['重新选择'] }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div class="xian">
						<p></p>
					</div>
					<!-- 发票 -->
					<div class="receive_info platform_discount" v-if="pre_params.data.ifcart == 'true'">
						<div class="receive_info_title">
							<div class="line"></div>
							<span>{{ L['发票'] }}</span>
						</div>
						<div class="invoice_con flex">
							<div class="no_select_invoice flex_row_center_center">
								<img :src="not_select" v-if="select_invoice_info.invoiceId == ''" alt @click="showVoiceDialog" />
								<!-- <dynaIcon :src="selected" width="19" height="18" color="--color_main" v-else></dynaIcon> -->
								<dynaIcon mode="iconfont" icon="icon-ziyuan12" color="--color_main" v-else>
								</dynaIcon>

								<span>{{ L['我要开发票'] }}</span>
								<div class="invoice_info" v-if="select_invoice_info.invoiceId">
									<span class="invoice_name">
										{{
						select_invoice_info.invoiceTitle
					}}
									</span>
									<span class="invoice_type">
										{{
							select_invoice_info.invoiceContentText
						}}
									</span>
									<span @click="showVoiceDialog" class="choose">
										{{
						L['重新选择']
					}}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="order_total_settle flex_column_between_end">
				<div class="order_price" v-if="allData.data.isVirtualGoods == 1">
					<span>{{ L['商品总额(含运费)'] }}：</span>
					<span>
						{{ L['R$'] }}
						{{
						$formatMoneyNum(
							(
							Number(order_settle_info.totalAmount) +
							Number(order_settle_info.totalDiscount)
						))
					}}
					</span>
				</div>
				<div class="order_price" v-if="order_settle_info.totalDiscount > 0">
					<span>{{ L['共优惠'] }}：</span>
					<span>-&nbsp;{{ L['R$'] }} {{ $formatMoneyNum(order_settle_info.totalDiscount || 0) }}</span>
				</div>

				<div class="order_price">
					<span>{{ L['应付金额'] }}：</span>
					<span class="order_price_money">
						R$
						<span>{{ $formatMoneyNum(order_settle_info.totalAmount || 0) }}</span>
					</span>
				</div>
				<div class="order_price" v-if="allData.data.isVirtualGoods == 1">
					<span>{{ L['送货至'] }}：</span>
					<span>
						<span>
							{{
						orderAddress.data.addressAll
							? orderAddress.data.addressAll
							: '--'
					}}{{ orderAddress.data.detailAddress }}
						</span>
						<span></span>
						<span class="order_Name">
							{{
						L['收货人：']
					}}{{ orderAddress.data.receiverName ? orderAddress.data.receiverName : '--' }}
						</span>
						<span class="order_mobile">{{ orderAddress.data.receiverMobile }}</span>
					</span>
				</div>
			</div>
			<div class="gopuy_box flex_row_end_center">
				<div class="gopuy flex_row_center_center" @click="submitOrderFn" style="cursor: pointer;"
					:style="{ opacity: submitLoading ? '0.5' : '1' }">
					<span>{{ L['提交订单'] }}</span>
					<i class="el-icon-loading" style="margin-left:10px" v-if="submitLoading"></i>
				</div>
			</div>

			<!-- 发票选择——编辑 start -->
			<el-dialog title="发票信息" v-model="edit_voice_dialog" customClass="voice_width" :before-close="handleClose"
				lock-scroll="false">
				<p v-if="!add_voice_content" class="voice_list_title">{{ L['发票历史信息选择'] }}：</p>
				<div v-if="!add_voice_content" class="voice_list">
					<div v-for="(voice, index) in invoice_list.data" :key="index" :title="voice.invoiceTitle" :class="{
						voice_item: true,
						active: voice.invoiceId == select_invoice_info.invoiceId,
						overflow_ellipsis: true,
						pointer: true
					}" @click="chooseVoice(voice)">
						<span>{{ voice.invoiceTitle }}</span>
						<span v-if="voice.isDefault">{{ L['默认'] }}</span>
						<dynaIcon mode="iconfont" icon="iconyixuan" color="--color_main" class="img"
							v-if="voice.invoiceId == select_invoice_info.invoiceId"></dynaIcon>
					</div>
					<div class="add_voice_btn" @click="showAddvoice">{{ L['新增发票'] }}</div>
					<div class="add_voice_btn add_voice_btn2" @click="removeAddvoice">{{ L['暂不开发票'] }}</div>
				</div>
				<div class="add_voice_content" v-if="add_voice_content">
					<el-scrollbar>
						<div style="padding: 0 20px;">
							<div class="item flex">
								<div class="title">{{ L['发票内容'] }}：</div>
								<div class="right_info flex_column_center_start">
									<div class="item_select flex">
										<div @click="changeInvoiceContent(1)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.invoiceContent == 1
					}">
											{{ L['商品明细'] }}
											<dynaIcon src="buy/corner_icon.png" width="20" height="20" color="--color_main" class="img"
												v-if="invoice_info.data.invoiceContent == 1"></dynaIcon>
										</div>
										<div @click="changeInvoiceContent(2)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.invoiceContent == 2
					}">
											{{ L['商品类别'] }}
											<!-- <img v-if="invoice_info.data.invoiceContent == 2" :src="invoice_selected"
                      alt />-->

											<dynaIcon src="buy/corner_icon.png" width="20" height="20" color="--color_main" class="img"
												v-if="invoice_info.data.invoiceContent == 2"></dynaIcon>
										</div>
									</div>
									<p>
										{{
						invoice_info.data.invoiceContent == 1
							? L[
							'发票内容将显示商品名称与价格信息，发票金额为实际支付金额，不含优惠等扣减金额'
							]
							: L[
							'发票内容将显示本单商品所属类别及价格信息，发票金额为实际支付金额，不含优惠等扣减金额。'
							]
					}}
									</p>
								</div>
							</div>
							<!-- 发票抬头 -->
							<div class="item flex">
								<div class="title">{{ L['发票抬头'] }}：</div>
								<div class="right_info flex_column_center_start">
									<div class="item_select flex">
										<div @click="changeInvoiceTitleType(1)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.titleType == 1
					}">
											个人
											<dynaIcon src="buy/corner_icon.png" width="20" height="20" color="--color_main" class="img"
												v-if="invoice_info.data.titleType == 1"></dynaIcon>
										</div>
										<div @click="changeInvoiceTitleType(2)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.titleType == 2
					}">
											{{ L['企业'] }}
											<dynaIcon src="buy/corner_icon.png" width="20" height="20" color="--color_main" class="img"
												v-if="invoice_info.data.titleType == 2"></dynaIcon>
										</div>
									</div>
									<el-input v-if="invoice_info.data.titleType == 1" class="input title" size="small"
										:placeholder="L['请在此填写发票抬头']" v-model="invoice_info.data.invoiceTitle" clearable
										maxlength="30"></el-input>
								</div>
							</div>
							<!-- 发票类型： -->
							<div class="item flex" v-if="invoice_info.data.titleType == 2">
								<div class="title">{{ L['发票类型'] }}：</div>
								<div class="right_info flex_column_center_start">
									<div class="item_select flex">
										<div @click="changeInvoiceType(1)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.invoiceType == 1
					}">
											{{ L['普通发票'] }}
											<dynaIcon src="buy/corner_icon.png" width="20" height="20" color="--color_main" class="img"
												v-if="invoice_info.data.invoiceType == 1"></dynaIcon>
										</div>
										<div @click="changeInvoiceType(2)" :class="{
						select_btn: true,
						pointer: true,
						active: invoice_info.data.invoiceType == 2
					}" v-if="allData.data.isVatInvoice">
											{{ L['增值税专用发票'] }}
											<dynaIcon src="buy/corner_icon.png" width="20" height="20" class="img" color="--color_vice"
												v-if="invoice_info.data.invoiceType == 2">
											</dynaIcon>
										</div>
									</div>
								</div>
							</div>
							<!-- 单位名称： -->
							<div class="item flex" v-if="invoice_info.data.titleType == 2">
								<div class="title">{{ L['单位名称'] }}：</div>
								<div class="right_info flex_column_center_start">
									<el-input class="input nomartop" size="small" :placeholder="L['请在此填写单位名称']"
										v-model="invoice_info.data.companyName" clearable maxlength="30"></el-input>
								</div>
							</div>
							<!-- 税号： -->
							<div class="item flex" v-if="invoice_info.data.titleType == 2">
								<div class="title">{{ L['税号'] }}：</div>
								<div class="right_info flex_column_center_start">
									<el-input class="input nomartop" size="small" :placeholder="L['请在此填写纳税人识别号']"
										v-model="invoice_info.data.taxCode" clearable maxlength="20"
										@blur="invoiceCheck('taxCode')"></el-input>
								</div>
							</div>

							<template v-if="invoice_info.data.invoiceType == 2">
								<div class="item flex">
									<div class="title">{{ L['注册地址：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入注册地址']"
											v-model="invoice_info.data.registerAddr" clearable maxlength="50"
											@blur="invoiceCheck('registerAddr')"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['注册电话：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入注册电话']"
											v-model="invoice_info.data.registerPhone" clearable maxlength="12"
											@blur="invoiceCheck('registerPhone')"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['开户银行：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入开户银行']"
											v-model="invoice_info.data.bankName" clearable maxlength="20"
											@blur="invoiceCheck('bankName')"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['银行账户：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入银行账户']"
											v-model="invoice_info.data.bankAccount" clearable maxlength="19"
											@blur="invoiceCheck('bankAccount')" type="number"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['收票人姓名'] }}：</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入收票人姓名']"
											v-model="invoice_info.data.receiverName" clearable maxlength="5"
											@blur="invoiceCheck('receiverName')"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['收票人电话：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入收票人电话']"
											v-model="invoice_info.data.receiverMobile" clearable maxlength="12"
											@blur="invoiceCheck('receiverMobile')"></el-input>
									</div>
								</div>
								<div class="item flex">
									<div class="title">{{ L['收票人地址：'] }}</div>
									<div class="right_info flex_column_center_start">
										<el-input class="input" size="small" :placeholder="L['请输入收票人地址']"
											v-model="invoice_info.data.receiverAddress" clearable maxlength="50"
											@blur="invoiceCheck('receiverAddress')"></el-input>
									</div>
								</div>
							</template>
							<!-- 收票邮箱： -->
							<div class="item flex" v-if="invoice_info.data.invoiceType != 2">
								<div class="title">{{ L['收票邮箱'] }}：</div>
								<div class="right_info flex_column_center_start input_email">
									<el-input class="input nomartop" size="small" :placeholder="L['请输入收票邮箱']"
										v-model="invoice_info.data.receiverEmail" clearable maxlength="50" show-word-limit
										@blur="invoiceCheck('receiverEmail')"></el-input>
								</div>
							</div>
							<div class="flex_row_end_center is_defalut">
								<span>{{ L['设为默认发票'] }}</span>
								<el-switch v-model="invoice_info.data.isDefault" active-color="#EC2116"
									inactive-color="#EEEEEE"></el-switch>
							</div>
							<div class="btn_con flex_row_center_center">
								<div class="return" @click="voiceReturn">{{ L['返回'] }}</div>
								<div class="confirm_add_voice" @click="confirmAddVoice">{{ L['确定'] }}</div>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</el-dialog>
			<!-- 发票选择——编辑 end -->

			<!-- 商品无货缺货弹窗 start -->
			<el-dialog :title="no_good_info.data.stateValue" v-model="out_stock_dialog" customClass="out_store_width"
				:before-close="handleClose" lock-sroll="false">
				<div class="out_stock_dialog">
					<div v-for="(outStockItem, index) in no_good_info.data.productList" :key="index" class="good_item flex">
						<img :src="outStockItem.image" alt />
						<div class="good_info">
							<span class="good_name overflow_ellipsis">
								{{
						outStockItem.goodsName
					}}
							</span>
							<div class="spec_num">
								<span class="good_spec">{{ outStockItem.specValues }}</span>
								<span class="good_num">*{{ outStockItem.buyNum }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="btn_con flex_row_center_center" v-if="no_good_info.data.state == 2 || no_good_info.data.state == 4">
					<div class="return" @click="returnLastPage">{{ L['返回'] }}</div>
					<div class="remove" @click="clearFailureGoods">{{ L['移除无货商品'] }}</div>
				</div>
				<div class="btn_con flex_row_center_center" v-if="no_good_info.data.state == 7">
					<div class="return" @click="returnLastPage">{{ L['返回'] }}</div>
					<div class="remove" @click="goNext">{{ L['继续下单'] }}</div>
				</div>
				<div class="btn_con flex_row_center_center" v-else>
					<div class="return red" @click="returnLastPage">{{ L['返回'] }}</div>
				</div>
			</el-dialog>
			<!-- 商品无货缺货弹窗 end -->

			<!-- 地址选择弹窗 start -->
			<el-dialog title="更换地址" v-model="show_select_address" customClass="select_address_width"
				:before-close="handleClose" lock-sroll="false">
				<div class="out_stock_dialog address_con">
					<div v-for="(item, index) in address_list.data" :key="index" @click="selectAddress(index)" :class="{
						address_item: true,
						flex_column_start_start: true,
						select: current_address_index == index
					}">
						<span>{{ L['收货人'] }}：{{ item.receiverName }}</span>
						<span>{{ L['联系方式'] }}：{{ item.receiverMobile }}</span>
						<div class="address_text" :title="item.addressAll + item.detailAddress">
							<span>{{ L['收货地址'] }}：</span>
							<span class="overflow_ellipsis_clamp2">{{ item.addressAll }} {{ item.detailAddress
								}}</span>
						</div>
						<img v-if="current_address_index == index" class="selected" :src="invoice_selected" alt />
					</div>
				</div>
				<div class="btn_con flex_row_center_center">
					<div class="remove red" @click="confirmChangeAddress()" style="cursor:pointer">{{ L['提交修改'] }}</div>
				</div>
			</el-dialog>
			<!-- 地址选择弹窗 end -->

			<SldAddressOperation v-if="addressVisibleFlag" @close="close" @refreshAddress="refreshAddress" :visibleFlag="true"
				:type="type" />
		</div>
	</div>
</template>

<script>
import {
	reactive,
	getCurrentInstance,
	ref,
	onMounted,
	onUnmounted,
	watch,
	computed,
} from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SldAddressOperation from '../../components/Address/AddressOperation'
import { preventMutiClick } from '@/utils/common'
export default {
	name: 'ConfirmOrder',
	components: {
		SldAddressOperation,
	},
	setup () {
		const route = useRoute()
		const router = useRouter()
		const store = useStore()
		const addressVisibleFlag = ref(false)
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		
		const not_select = require('../../assets/buy/not_select.png')
		const selected = require('../../assets/buy/selected.png')
		const invoice_selected = require('../../assets/buy/invoice_selected.png')
		const memberInfo = ref(store.state.memberInfo);
		const couponCode = ref([])
		const navlist = reactive({ data: [] })
		const show_change_address = ref(false)
		const edit_voice_dialog = ref(false)
		const add_voice_content = ref(false)
		const out_stock_dialog = ref(false)
		const exhibition_show = ref(false) //地址展开收起
		const type = ref('add')
		const timer = ref(0) //定时器
		const no_good_info = reactive({ data: {} })
		const show_select_address = ref(false)
		const pre_params = reactive({ data: {} })
		const orderAddress = reactive({ data: '' })
		const address_list = reactive({ data: [] })
		const goods_data = reactive({ data: [] })
		const configInfo = ref(store.state.configInfo)
		const current_address_index = ref(0)
		const submitLoading = ref(false)
		const select_invoice_info = reactive({
			invoiceId: '',
			invoiceContent: '',
			invoiceContentText: '',
			invoiceTitle: ''
		})
		const selCouponStore = reactive({
			store: {},
			couponCode: ''
		})
		const rules = ref('')
		const invoice_list = reactive({ data: [] }) //发票列表
		const invoiceCheckState = ref(true)
		const invoice_info = reactive({
			data: {
				//新增发票信息
				bankAccount: '', //银行帐户(专用发票）
				bankName: '', //开户银行(专用发票）
				invoiceContent: 1, //发票内容：1-商品明细；2-商品类别
				invoiceTitle: '', //发票抬头(通用信息）
				invoiceType: 1, //发票类型：1-普通发票；2-增值税发票
				isDefault: false, //是否默认发票：0-非默认发票，1-默认发票
				receiverAddress: '', //收票人详细地址(通用信息）
				receiverEmail: '', //	收票邮箱(通用信息）
				receiverMobile: '', //收票人手机号(通用信息）
				receiverName: '', //收票人姓名(通用信息）
				registerAddr: '', //注册地址(专用发票）
				registerPhone: '', //注册电话(专用发票）
				taxCode: '', //纳税人识别号(通用信息）
				titleType: 1, //抬头类型：1-个人；2-公司
				companyName: '' //单位名称
			}
		})
		// 重置发票信息
		const resetVoiceInfo = () => {
			invoice_info.data.bankAccount = ''
			invoice_info.data.bankName = ''
			invoice_info.data.invoiceContent = 1
			invoice_info.data.invoiceTitle = ''
			invoice_info.data.invoiceType = 1
			invoice_info.data.isDefault = false
			invoice_info.data.receiverAddress = ''
			invoice_info.data.receiverEmail = ''
			invoice_info.data.receiverMobile = ''
			invoice_info.data.receiverName = ''
			invoice_info.data.registerAddr = ''
			invoice_info.data.registerPhone = ''
			invoice_info.data.taxCode = ''
			invoice_info.data.titleType = 1
			invoice_info.data.companyName = ''
		}
		const order_settle_info = reactive({
			totalAmount: '',
			totalDiscount: '',
			platformCouponList: [],
		})
		const allData = reactive({ data: {} })
		const virtual = reactive({
			isVG: null,
			virtualPre: []
		})

		const preMsgErr = reactive({
			index: null,
			errMsg: ''
		})
		const reserveInfoList = ref([])

		const changeCoupon = (storeItem, index) => {
			selCouponStore.store = storeItem
			selCouponStore.couponCode = couponCode.value[index]

			confirmOrder(2)
		}

		//用于切换地址，使用优惠券，获取信息，运费等
		const confirmOrder = type => {
			let param = {}
			param.source = type
			param.addressId = orderAddress.data.addressId

			//新加的参数----start
			if (route.query.productSets) {
				param.products = decodeURIComponent(route.query.productSets)
			}

			let storeInfoList = []
			goods_data.data.map(item => {
				let storeitem = {}
				if (selCouponStore.store.storeId == item.storeId) {
					storeitem.remark = selCouponStore.store.remark
					storeitem.storeCouponCode =
						selCouponStore.couponCode == L['不使用优惠券']
							? ''
							: selCouponStore.couponCode
					storeitem.storeId = item.storeId
				} else {
					storeitem.remark = item.remark
					storeitem.storeCouponCode =
						item.couponCode == L['不使用优惠券'] ? '' : item.couponCode
					storeitem.storeId = item.storeId
				}

				if (invoice_info.data.invoiceContent && invoice_info.data.invoiceId) {
					storeitem.invoiceContent = invoice_info.data.invoiceContent
					storeitem.invoiceId = invoice_info.data.invoiceId
				}

				storeInfoList.push(storeitem)
			})

			param.storeInfoList = storeInfoList
			if (pre_params.data.ifcart == 'true') {
				//来自于进货单
				param.isCart = true
			} else {
				//立即购买
				param.productId = pre_params.data.productId
				param.number = pre_params.data.numbers
				param.isCart = false
			}

			if (route.query.isAloneBuy) {
				param.isAloneBuy = true
			}

			if (pre_params.data.isAloneBuy) {
				param.isAloneBuy = true
			}

			proxy
				.$post(
					'v3/supplier/channel/orderOperate/confirm',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 200) {
						if (type == 1) {
							goods_data.data = res.data.storeGroupList
							goods_data.data.map((item, i) => {
								item.remark = ''
								let default_coupon = item.availableCouponList.filter(function (
									coupon
								) {
									return coupon.checked == true
								})
								if (default_coupon.length > 0) {
									item.couponCode = default_coupon[0].couponCode
									couponCode.value[i] = default_coupon[0].couponCode
								} else {
									item.couponCode = ''
									couponCode.value[i] = ''
								}
							})
						} else {
							let tmpRes = res.data.storeGroupList
							goods_data.data.map((item, index) => {
								if (tmpRes[index].availableCouponList.length) {
									let default_coupon = tmpRes[index].availableCouponList.filter(
										coupon => coupon.checked == true
									)
									if (default_coupon.length > 0) {
										item.couponCode = default_coupon[0].couponCode
										couponCode.value[index] = default_coupon[0].couponCode
											? default_coupon[0].couponCode
											: L['不使用优惠券']
									} else {
										item.couponCode = ''
										couponCode.value[index] = L['不使用优惠券']
									}
								}
								item.availableCouponList = tmpRes[index].availableCouponList
								item.expressFee = tmpRes[index].expressFee
								item.totalDiscount = tmpRes[index].totalDiscount
							})
						}
						allData.data = res.data
						order_settle_info.totalAmount = res.data.totalAmount

						if (type == 1) {
							virtual.isVG = allData.data.isVirtualGoods
							virtual.virtualPre = allData.data.reserveNameList.map(item => {
								item.reserveValue = ''
								return item
							})
						}
					} else {
						if (res.msg) {
							ElMessage(res.msg)
						}
					}
				})
		}
		//获取地址列表
		const getAddressList = () => {
			proxy
				.$get('v3/supplier/channel/userAddress/list')
				.then(res => {
					if (res.state == 200) {
						address_list.data = res.data.list
						if (res.data.list.length > 0 && !orderAddress.data.addressId) {
							let df_index = res.data.list.findIndex(function (item) {
								return item.isDefault == 1
							})

							if (df_index > -1) {
								orderAddress.data = res.data.list[df_index]
								current_address_index.value = df_index
							} else {
								orderAddress.data = res.data.list[0]
							}

							if (localStorage.getItem('addressId')) {
								let addressID = localStorage.getItem('addressId')
								let used_index = res.data.list.findIndex(
									i => i.addressId == addressID
								)
								if (used_index > -1) {
									current_address_index.value = used_index
									orderAddress.data = res.data.list[used_index]
								} else {
									current_address_index.value = -1
								}
							} else {
								current_address_index.value = -1
							}
						}
						confirmOrder(1)
					} else {
						confirmOrder(2)
						ElMessage(res.msg)
					}
				})
		}
		//切换地址
		const selectAddress = index => {
			current_address_index.value = index
		}

		//确认修改地址
		const confirmChangeAddress = index => {
			current_address_index.value = index
			orderAddress.data = address_list.data[current_address_index.value]
			show_select_address.value = false
			confirmOrder(2)
			localStorage.setItem('addressId', orderAddress.data.addressId)
		}
		//弹出地址选择框
		const changeAddress = () => {
			getAddressList()
			show_select_address.value = true
		}

		//返回进货单
		const goCart = () => {
			router.go(-1)
		}
		//弹出发票选择框
		const showVoiceDialog = () => {
			edit_voice_dialog.value = true
			getVoiceList()
		}
		const showAddvoice = () => {
			add_voice_content.value = true
		}
		//获取发票列表
		const getVoiceList = () => {
			proxy
				.$get('v3/supplier/channel/userInvoice/list')
				.then(res => {
					if (res.state == 200) {
						invoice_list.data = res.data.list
						if (!allData.data.isVatInvoice) {
							invoice_list.data = res.data.list.filter(i => i.invoiceType != 2)
						}
						if (invoice_list.data.length > 0) {
							add_voice_content.value = false
						} else {
							add_voice_content.value = true
						}
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		const removeAddvoice = () => {
			select_invoice_info.invoiceId = ''
			edit_voice_dialog.value = false
		}
		//切换发票内容
		const changeInvoiceContent = invoiceContent => {
			invoice_info.data.invoiceContent = invoiceContent
		}
		//切换发票抬头
		const changeInvoiceTitleType = titleType => {
			invoice_info.data.titleType = titleType
			if (titleType == 1) {
				invoice_info.data.invoiceType = 1
			}
		}
		//切换发票类型
		const changeInvoiceType = invoiceType => {
			invoice_info.data.invoiceType = invoiceType
		}

		watch(invoice_info.data, () => {
			invoice_info.data.registerPhone = invoice_info.data.registerPhone
				.toString()
				.substring(0, 12)
			invoice_info.data.receiverMobile = invoice_info.data.receiverMobile
				.toString()
				.substring(0, 12)
			invoice_info.data.bankAccount = invoice_info.data.bankAccount
				.toString()
				.substring(0, 19)
		})

		const invoiceCheck = type => {
			var reg = new RegExp(
				'^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
			)
			switch (type) {
				case 'receiverEmail': {
					if (
						invoice_info.data.receiverEmail &&
						!reg.test(invoice_info.data.receiverEmail)
					) {
						invoice_info.data.receiverEmail = ''
						ElMessage(L['邮箱格式不正确，请重新输入！'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'taxCode': {
					let regExp = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
					if (
						invoice_info.data.taxCode &&
						!regExp.test(invoice_info.data.taxCode)
					) {
						invoice_info.data.taxCode = ''
						ElMessage(L['请填写正确的税号'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'registerPhone': {
					if (
						invoice_info.data.registerPhone &&
						proxy.$checkMobile(invoice_info.data.registerPhone) != true
					) {
						invoice_info.data.registerPhone = ''
						ElMessage(L['请填正确填写注册电话'])
						invoiceCheckState.value = false
					}
					break
				}

				case 'receiverMobile': {
					if (
						invoice_info.data.receiverMobile &&
						proxy.$checkMobile(invoice_info.data.receiverMobile) != true
					) {
						invoice_info.data.receiverMobile = ''
						ElMessage(L['请填正确填写收票人电话'])
						invoiceCheckState.value = false
					}
					break
				}

				default: {
					invoiceCheckState.value = true
				}
			}
		}

		//新增发票
		const confirmAddVoice = () => {
			if (!invoiceCheckState.value) {
				invoiceCheckState.value = true
				return
			}

			if (invoice_info.data.titleType == 1) {
				var reg = new RegExp(
					'^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
				)
				if (invoice_info.data.invoiceTitle == '') {
					ElMessage(L['请填写发票抬头'])
					return
				} else if (invoice_info.data.receiverEmail == '') {
					ElMessage(L['请填写收票邮箱'])
					return
				} else if (!reg.test(invoice_info.data.receiverEmail)) {
					ElMessage(L['邮箱格式不正确，请重新输入！'])
					return
				}
			} else if (invoice_info.data.titleType == 2) {
				let regExp = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
				if (invoice_info.data.companyName == '') {
					ElMessage(L['请填写单位名称'])
					return
				} else if (invoice_info.data.taxCode == '') {
					ElMessage(L['请填写纳税人税号'])
					return
				} else if (regExp.test(invoice_info.data.taxCode) == false) {
					ElMessage(L['请填写正确的税号'])
					return
				} else if (invoice_info.data.invoiceType == 1) {
					if (invoice_info.data.receiverEmail == '') {
						ElMessage(L['请填写收票邮箱'])
						return
					}
				} else {
					//-----
					if (invoice_info.data.registerAddr == '') {
						ElMessage(L['请填写注册地址'])
						return
					}
					//-----
					if (invoice_info.data.registerPhone == '') {
						ElMessage(L['请填写注册电话'])
						return
					}
					if (
						proxy.$checkMobile(
							invoice_info.data.registerPhone,
							L['请正确填写注册电话']
						) != true
					) {
						ElMessage(
							proxy.$checkMobile(
								invoice_info.data.registerPhone,
								L['请正确填写注册电话']
							)
						)
						return
					}
					//-----
					if (invoice_info.data.bankName == '') {
						ElMessage(L['请填写开户银行'])
						return
					}
					//-----
					if (invoice_info.data.bankAccount == '') {
						ElMessage(L['请填写银行账户'])
						return
					}
					//-----
					if (invoice_info.data.receiverName == '') {
						ElMessage(L['请填写收票人姓名'])
						return
					}
					//-----
					if (invoice_info.data.receiverMobile == '') {
						ElMessage(L['请填写收票人电话'])
						return
					}
					if (
						proxy.$checkMobile(
							invoice_info.data.receiverMobile,
							L['请正确填写收票人电话']
						) != true
					) {
						ElMessage(L['请正确填写收票人电话'])
						return
					}

					//-----
					if (invoice_info.data.receiverAddress == '') {
						ElMessage(L['请填写收票人地址'])
						return
					}
					//-----
				}
			}

			var param = {}
			param.titleType = invoice_info.data.titleType
			param.invoiceType = invoice_info.data.invoiceType
			param.invoiceContent = invoice_info.data.invoiceContent
			if (invoice_info.data.isDefault) {
				param.isDefault = 1
			} else {
				param.isDefault = 0
			}
			if (invoice_info.data.invoiceType != 2) {
				param.receiverEmail = invoice_info.data.receiverEmail
			}
			if (invoice_info.data.titleType == 1) {
				param.invoiceTitle = invoice_info.data.invoiceTitle
			} else {
				param.taxCode = invoice_info.data.taxCode
				param.invoiceTitle = invoice_info.data.companyName
				if (invoice_info.data.invoiceType == 2) {
					param.registerAddr = invoice_info.data.registerAddr
					param.registerPhone = invoice_info.data.registerPhone
					param.bankName = invoice_info.data.bankName
					param.bankAccount = invoice_info.data.bankAccount
					param.receiverName = invoice_info.data.receiverName
					param.receiverMobile = invoice_info.data.receiverMobile
					param.receiverAddress = invoice_info.data.receiverAddress
				}
			}
			proxy
				.$post('v3/supplier/channel/userInvoice/add', param)
				.then(res => {
					if (res.state == 200) {
						if (res.state == 200) {
							select_invoice_info.invoiceTitle =
								invoice_info.data.titleType == 2
									? invoice_info.data.companyName
									: invoice_info.data.invoiceTitle
							select_invoice_info.invoiceContent =
								invoice_info.data.invoiceContent
							select_invoice_info.invoiceContentText =
								invoice_info.data.invoiceContent == 1
									? L['商品明细']
									: L['商品类别']
							select_invoice_info.invoiceId = res.data
							edit_voice_dialog.value = false
							add_voice_content.value = false
							resetVoiceInfo()
							ElMessage.success({
								message: res.msg,
								type: 'success'
							})
						}
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		//新增发票返回
		const voiceReturn = () => {
			if (invoice_list.data.length > 0) {
				add_voice_content.value = false
			} else {
				edit_voice_dialog.value = false
			}
			resetVoiceInfo()
		}
		//选择发票
		const chooseVoice = voice => {
			select_invoice_info.invoiceTitle = voice.invoiceTitle
			select_invoice_info.invoiceContent = voice.invoiceContent
			select_invoice_info.invoiceContentText =
				voice.invoiceContent == 1 ? L['商品明细'] : L['商品类别']
			select_invoice_info.invoiceId = voice.invoiceId
			edit_voice_dialog.value = false
		}
		//确认订单前校验商品是否可购买
		const checkOrder = (continueExec) => {
			let param = {}
			if (pre_params.data.ifcart == 'true') {
				param.isCart = true
			} else {
				let {
					promotionId,
					promotionType,
				} = goods_data.data[0].productList[0]

				param.isCart = false
				param.promotionId = promotionId
				param.promotionType = promotionType

				if (route.query.productSets) {
					param.products = decodeURIComponent(route.query.productSets)
				}

				if (route.query.isAloneBuy) {
					delete param.promotionId
					delete param.promotionType
				}
			}

			if (route.query.isAloneBuy) {
				param.isAloneBuy = true
			}

			reserveInfoList.value = []
			//预留信息校验start
			if (virtual.isVG == 2 && virtual.virtualPre.length > 0) {
				for (let i = 0; i < virtual.virtualPre.length; i++) {
					let {
						reserveName,
						reserveType,
						reserveValue,
						reserveNameId,
						isRequired
					} = virtual.virtualPre[i]
					if (
						checkPreMsg(reserveType, reserveValue, reserveName, isRequired) ==
						true
					) {
						reserveInfoList.value.push({
							reserveName,
							reserveValue,
							reserveNameId
						})
					} else {
						preMsgErr.errMsg = checkPreMsg(
							reserveType,
							reserveValue,
							reserveName,
							isRequired
						)
						preMsgErr.index = i
						ElMessage(
							checkPreMsg(reserveType, reserveValue, reserveName, isRequired)
						)
						continueExec()
						return
					}
				}
			}
			//预留信息校验end

			if (virtual.isVG == 2) {
				param.reserveInfoList = reserveInfoList.value
			}

			proxy
				.$post(
					'v3/supplier/channel/orderOperate/check',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 267) {
						let { state } = res.data
						no_good_info.data = res.data
						continueExec()
						if (
							state == 7 ||
							state == 4 ||
							state == 3 ||
							state == 2 ||
							state == 1 ||
							state == 6
						) {
							out_stock_dialog.value = true
						} else if (state == 5) {
							proxy
								.$confirm(
									L['商品促销信息发生变化，请返回后重新下单'],
									L['商品促销信息发生变化'],
									{
										confirmButtonText: L['返回'],
										type: 'warning'
									}
								)
								.then(() => {
									returnLastPage()
								})
						}
					} else if (res.state == 200) {
						goBuy(continueExec)
					} else {
						ElMessage(res.msg)
						continueExec()
					}
				})
		}

		//最终接受点击的函数，由防止多次点击方法包裹
		const submitOrderFn = preventMutiClick(checkOrder)


		//返回上一页
		const returnLastPage = () => {
			out_stock_dialog.value = false
			router.go(-1)
		}
		//移除无货商品
		const clearFailureGoods = () => {
			proxy.$post('v3/supplier/channel/cart/emptyInvalid').then(res => {
				if (res.state == 200) {
					out_stock_dialog.value = false
					confirmOrder(2)
					ElMessage.success(res.msg)
				} else {
					ElMessage(res.msg)
				}
			})
		}
		//跳转订单页
		const goBuy = (continueExec) => {
			let param = {}
			param.source = 3
			param.orderFrom = 1
			if (virtual.isVG == 1) {
				param.addressId = orderAddress.data.addressId
			}

			let storeInfoList = []
			goods_data.data.map(item => {
				let storeitem = {}
				storeitem.invoiceId = select_invoice_info.invoiceId
				storeitem.invoiceContent = select_invoice_info.invoiceContent
				storeitem.remark = item.remark
				storeitem.storeCouponCode = item.couponCode == L['不使用优惠券'] ? '' : item.couponCode
				storeitem.storeId = item.storeId
				storeInfoList.push(storeitem)
			})
			param.storeInfoList = storeInfoList
			if (pre_params.data.ifcart == 'true') {
				//来自于进货单
				param.isCart = true
			} else {
				//立即购买
				param.isCart = false
				param.products = decodeURIComponent(route.query.productSets)
			}

			if (route.query.isAloneBuy) {
				param.isAloneBuy = true
			}

			if (virtual.isVG == 2) {
				param.reserveInfoList = reserveInfoList.value
			}

			proxy
				.$post(
					'v3/supplier/channel/orderOperate/submit',
					param,
					'application/json'
				)
				.then(res => {
					if (res.state == 200) {
						let paySn = res.data.paySn
						submitLoading.value = true
						queryPayState(paySn, continueExec)
					} else {
						ElMessage(res.msg)
						continueExec()
					}
				})
		}

		const queryPayState = async (paySn, continueExec) => {
			const res = await getPayInfo(paySn, continueExec)
			if (res.data) {
				if (res.state == 267) {
					ElMessage.success(res.msg + L[',2s后自动跳转订单列表'])
					//清除定时器
					if (timer.value) {
						clearTimeout(timer.value)
						timer.value = 0
					}
					setTimeout(() => {
						router.replace({
							path: '/member/order/list'
						})
					}, 2000)
				} else if (res.data.dealState == 3 || res.data.dealState == 2) {
					//清除定时器
					if (timer.value) {
						clearTimeout(timer.value)
						timer.value = 0
					}
					if (res.data.dealState == 2) {
						ElMessage(res.data.failReason || L['提交订单失败，请稍后重试'])
						continueExec()
						submitLoading.value = false
					} else {
						proxy.$sldStatEvent({ behaviorType: 'buy', paySn })
						router.replace({
							path: 'Pay',
							query: {
								paySn: paySn,
								payFrom: 1,
								ifcart: pre_params.data.ifcart
							}
						})
					}
				} else {
					Promise.resolve().then(() => {
						timer.value = setTimeout(() => queryPayState(paySn, continueExec), 100)
					})
				}
			}

		}

		//获取订单支付数据
		const getPayInfo = async (paySn, continueExec) => {
			try {
				const res = await proxy.$get('v3/supplier/channel/orderPay/payInfo', { paySn: paySn, payFrom: 1 })
				if (res.state == 200 || res.state == 267) {
					return res
				} else {
					submitLoading.value = false
					ElMessage.error(res.msg)
					continueExec()
					return {}
				}
			} catch (error) {
				submitLoading.value = false
				continueExec()
				return {}
			}
		}
		onUnmounted(() => {
			if (timer.value) {
				clearTimeout(timer.value)
				timer.value = 0
			}
		})
		//关闭弹窗
		const close = () => {
			addressVisibleFlag.value = false
		}
		//展开地址
		const exhibition = () => {
			exhibition_show.value = !exhibition_show.value
		}
		//弹出新建地址窗口
		const addAddress = () => {
			addressVisibleFlag.value = true
		}
		const refreshAddress = (addressInfo, addressId) => {
			orderAddress.data = addressInfo
			orderAddress.data.addressId = addressId
			getAddressList()
			localStorage.setItem('addressId', orderAddress.data.addressId)
		}

		//校验预留信息
		const checkPreMsg = (type, value, name, isRequired) => {
			switch (type) {
				case 1: {
					if (isRequired == 1) {
						return proxy.$checkPhone(value)
					} else {
						let regMobile = /(1[3-9]\d{9}$)/
						if (value && !regMobile.test(value)) {
							return `${L['请输入正确的']}${name}!`
						} else {
							return true
						}
					}

				}
				case 2: {
					if (isRequired == 1) {
						return proxy.$checkIdentity(value)
					} else {
						if (value) {
							let reg18 = /^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/
							let reg15 = /^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/
							if (reg18.test(value) || reg15.test(value)) {
								return true
							} else {
								return `${L['请输入正确的']}${name}`
							}
						} else {
							return true
						}
					}

				}
				case 3: {
					let regNum = /[0-9]+(.[0-9]+)?/
					if (isRequired == 1) {
						if (!value) {
							return `${L['请输入']}${name}`
						} else if (!regNum.test(value)) {
							return `${L['请输入正确的']}${name}`
						} else {
							return true
						}
					} else {
						return true
					}
				}
				case 4: {
					if (isRequired == 1) {
						if (!value) {
							return `${L['请输入']}${name}`
						} else if (type == 4) {
							return true
						}
					} else {
						return true
					}
					break
				}
				case 5: {
					if (isRequired == 1) {
						return proxy.$checkEmail(value)
					} else {
						let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
						if (value && !reg.test(value)) {
							return `${L['请输入正确的']}${name}!`
						} else {
							return true
						}
					}
				}
			}
		}

		const goNext = () => {
			out_stock_dialog.value = false
			goBuy()
		}

		onMounted(() => {
			pre_params.data = route.query
			getAddressList()
		})

		return {
			submitOrderFn,
			navlist,
			memberInfo,
			not_select,
			selected,
			show_change_address,
			edit_voice_dialog,
			showVoiceDialog,
			invoice_selected,
			add_voice_content,
			showAddvoice,
			removeAddvoice,
			out_stock_dialog,
			orderAddress,
			changeAddress,
			show_select_address,
			address_list,
			current_address_index,
			selectAddress,
			confirmChangeAddress,
			goods_data,
			pre_params,
			invoice_info,
			changeInvoiceContent,
			changeInvoiceTitleType,
			changeInvoiceType,
			confirmAddVoice,
			invoice_list,
			select_invoice_info,
			voiceReturn,
			chooseVoice,
			order_settle_info,
			confirmOrder,
			checkOrder,
			goBuy,
			returnLastPage,
			clearFailureGoods,
			no_good_info,
			addressVisibleFlag,
			close,
			type,
			refreshAddress,
			addAddress,
			couponCode,
			configInfo,
			rules,
			changeCoupon,
			allData,
			L,
			invoiceCheck,
			virtual,
			preMsgErr,
			goNext,
			invoiceCheckState,
			exhibition,
			exhibition_show,
			goCart,
			submitLoading,
		}
	},
	beforeRouteEnter (to, from, next) {
		// ...
		if (from.name == 'Login') {
			next('/index')
		} else {
			next()
		}
	}
}
</script>

<style lang="scss">
@import '../../style/confirmOrder.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

input[type='number'] {
	-moz-appearance: textfield;
}

.voice_width {
	width: 605px !important;
}

.add_voice_btn2 {
	margin: -30px 114px 10px !important;
}

.out_store_width {
	width: 480px !important;
}

.select_address_width {
	width: 500px !important;
}

.el-dialog__body {
	padding-top: 10px;
}

.el-input__inner {
	font-size: 12px;
	line-height: 1px !important;
	/**
		* 解决el-input设置类型为number时，中文输入法光标上移问题
		**/
}

.confirm_order_container .input_email .el-input__inner {
	padding-right: 80px;
}

.el-select .el-input__inner:focus {
	border-color: var(--color_main);
}

.el-select .el-input.is-focus .el-input__inner {
	border-color: var(--color_main);
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
	border-color: var(--color_main);
	outline: 0;
}

.validateMessage {
	font-size: 12px;
	color: var(--color_main);
	margin-top: 5px;
	padding-left: 80px;
	height: 12px;
}

.giftProduct {
	display: inline-block;
	border: 1px solid var(--color_main);
	color: var(--color_main);
	width: 33px;
	height: 16px;
	border-radius: 3px;
	font-size: 12px;
	line-height: 16px;
	text-align: center;
	margin-right: 4px;
}

.integral_dialog .el-dialog__body {
	padding: 0;
}

#pre_tag_input {
	height: 30px;
	width: 320px;
}

.preMsgErr {
	color: var(--color_main);
	margin-left: 13px;
}
</style>
