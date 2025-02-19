<template>
	<div class="sld_address_list">
		<MemberTitle :memberTitle="L['收货地址']"></MemberTitle>
		<div class="add_default_con">
			<div class="title flex_row_start_center">
				<span>{{ L['地址管理'] }}</span>
				<span class="little_tip">{{ $L['（至多添加20个收货地址）'] }}</span>
			</div>
			<div class="flex_row_start_center">
				<div class="address_item" v-if="default_address.data.length > 0"
					:style="{ backgroundImage: 'url(' + addressbg2 + ')' }">
					<div class="defalut_edit flex_row_between_center">
						<span class="red">{{ L['默认地址'] }}</span>
						<div class="oprate">
							<i class="iconfont iconbianji pointer" @click="editAddress(default_address.data[0])"></i>
						</div>
					</div>
					<div class="name_phone">
						<span class="name">{{ default_address.data[0].receiverName }}</span>
						<span class="phone">{{ default_address.data[0].receiverMobile }}</span>
					</div>
					<div class="add_info" :title="default_address.data[0].addressAll">{{
			default_address.data[0].addressAll }}</div>
					<div class="add_detail overflow_ellipsis_two" :title="default_address.data[0].detailAddress">
						{{ default_address.data[0].detailAddress }}
					</div>
				</div>
				<div class="add_address flex_column_center_center pointer" @click="addAddress">
					<i class="iconfont iconxinzengdizhi"></i>
					<p>{{ L['新增地址'] }}</p>
				</div>
			</div>
		</div>
		<div class="address_list_con">
			<p class="title mange">{{ L['全部地址'] }}({{ address_list.data.length }})</p>
			<div class="container flex_row_start_center">
				<div v-for="(addressItem, index) in address_list.data" :key="index" class="address_item"
					:style="{ backgroundImage: 'url(' + addressbg + ')' }">
					<div class="defalut_edit flex_row_between_center">
						<span class="red">{{
			addressItem.isDefault == 1 ? L['默认地址'] : ' '
		}}</span>
						<div class="oprate">
							<i class="iconfont iconduihao1 pointer" @click="setDefault(addressItem.addressId)"
								v-if="addressItem.isDefault != 1" :title="L['设置为默认']"></i>
							<i class="iconfont iconbianji pointer" @click="editAddress(addressItem)" :title="L['编辑地址']"></i>
							<i class="iconfont iconlajitong pointer" @click="delAddress(addressItem.addressId)"
								:title="L['删除地址']"></i>
						</div>
					</div>
					<div class="name_phone">
						<span class="name">{{ addressItem.receiverName }}</span>
						<span class="phone">{{ addressItem.receiverMobile }}</span>
					</div>
					<div class="add_info" :title="addressItem.addressAll">{{ addressItem.addressAll }}</div>
					<div class="add_detail overflow_ellipsis_two" :title="addressItem.detailAddress">
						{{ addressItem.detailAddress }}
					</div>
				</div>
			</div>
			<SldCommonEmpty v-if="address_list.data.length == 0" :tip="L['暂无收货地址～']" totalHeight="300" totalWidth="934" />
		</div>
	</div>
	<SldAddressOperation v-if="addressVisibleFlag" @close="close" @refreshAddress="refreshAddress" :visibleFlag="true"
		:type="type" :addressInfo="addressInfo" />
	<!-- <AccountApply v-if="addressVisibleFlag" @close="close" @refreshAddress="refreshAddress" :visibleFlag="true"
		:type="type" :addressInfo="addressInfo" /> -->
</template>
<script>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import SldAddressOperation from '../../components/Address/AddressOperation'
import SldCommonEmpty from '../../components/SldCommonEmpty'
// import AccountApply from '../../components/AccountApply.vue'
import MemberTitle from '../../components/MemberTitle'
export default {
	name: 'MemberAddressList',
	components: {
		SldAddressOperation,
		SldCommonEmpty,
		MemberTitle,
		// AccountApply
	},
	setup () {
		const addressVisibleFlag = ref(false)
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const addressbg = require('../../assets/addressbg.png')
		const addressbg2 = require('../../assets/addressbg2.png')
		const address_list = reactive({ data: [] })
		const default_address = reactive({ data: [] })
		const addressInfo = reactive({ data: {} })
		const type = ref('add')
		//点击添加地址事件
		const addAddress = () => {

			if (address_list.data.length >= 20) {
				ElMessage.warning(L['至多添加20个收货地址'])
				return
			}

			type.value = 'add'
			addressVisibleFlag.value = true
		}
		//编辑地址事件
		const editAddress = address => {
			addressInfo.data = address
			type.value = 'edit'
			addressVisibleFlag.value = true
		}
		//关闭弹窗
		const close = () => {
			addressVisibleFlag.value = false
		}
		//获取地址列表
		const getAddressList = () => {
			proxy
				.$get('v3/supplier/channel/userAddress/list', {
					pageSize: 1000
				})
				.then(res => {
					if (res.state == 200) {
						address_list.data = res.data.list
						default_address.data = res.data.list.filter(function (item) {
							return item.isDefault == 1
						})
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		//删除地址
		const delAddress = addressId => {
			ElMessageBox.confirm(L['确定删除该地址?'], L['提示'], {
				confirmButtonText: L['确定'],
				cancelButtonText: L['取消'],
				type: 'warning'
			}).then(() => {
				proxy
					.$post('v3/supplier/channel/userAddress/delete', {
						addressId
					})
					.then(res => {
						if (res.state == 200) {
							ElMessage.success(res.msg)
							getAddressList()
						} else {
							ElMessage(res.msg)
						}
					})
			})
		}
		//设为默认
		const setDefault = addressId => {
			proxy
				.$post('v3/supplier/channel/userAddress/changeDefaultAddress', {
					addressId: addressId,
					isDefault: 1
				})
				.then(res => {
					if (res.state == 200) {
						ElMessage.success(res.msg)
						getAddressList()
					} else {
						ElMessage(res.msg)
					}
				})
				.catch(() => {
					//异常处理
				})
		}
		const refreshAddress = () => {
			getAddressList()
		}
		onMounted(() => {
			getAddressList()
		})
		return {
			addressVisibleFlag,
			addAddress,
			addressbg,
			addressbg2,
			L,
			address_list,
			default_address,
			delAddress,
			refreshAddress,
			type,
			addressInfo,
			editAddress,
			close,
			setDefault
		}
	}
}
</script>
<style lang="scss">
@import '../../style/addressList.scss';

.el-button--primary {
	color: #fff;
	background-color: var(--color_main);
	border-color: var(--color_main);
}

.add_info {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.little_tip {
	font-size: 12px;
	color: #999;
	font-weight: 400 !important;
}
</style>
