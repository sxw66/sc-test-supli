<template>
	<el-dialog :modelValue="visible" :title="L['更换地址']" customClass="select_address_width" lock-scroll="false">
		<div class="address_con">
			<div v-for="(item, index) in address_list" :key="index" @click="selectAddress(index)"
				class="address_item flex_column_start_start" :class="{ select: current_address_index == index }">
				<span>{{ L['收货人'] }}：{{ item.receiverName }}</span>
				<span>{{ L['联系方式'] }}：{{ item.receiverMobile }}</span>
				<div class="address_text" :title="item.addressAll + item.detailAddress">
					<span>{{ L['收货地址'] }}：</span>
					<span class="overflow_ellipsis_clamp2">
						{{ item.addressAll }} {{ item.detailAddress }}
					</span>
				</div>
				<dynaIcon icon="iconyixuan" mode="iconfont" v-if="current_address_index == index" class="selected"
					color="--color_main">
				</dynaIcon>
			</div>
		</div>
		<template #footer>
			<el-button type="primary" @click="confirmChangeAddress">确认修改</el-button>
		</template>
	</el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
export default defineComponent({
	name: 'address_list',
	props: {
		visible: Boolean,
		orderAddress: Object,
		mode: String
	},
	setup (props, { emit }) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()

		const address_list = ref([])
		const current_address_index = ref(-1)

		//获取地址列表
		const getAddressList = () => {
			proxy.$get("v3/supplier/channel/userAddress/list")
				.then(res => {
					if (res.state == 200) {
						address_list.value = res.data.list;
						handleAddress()

					} else {
						ElMessage.error(res.msg);
					}
				})
		};

		const handleAddress = () => {
			let storagedAddressId = localStorage.getItem('addressId')
			let defaultAddress = address_list.value.findIndex(i => i.isDefault == 1)
			let storagedAddress = address_list.value.findIndex(i => i.addressId == storagedAddressId)
			if (props.mode == 'confirm') {
				current_address_index.value = storagedAddress > -1 ? storagedAddress : (defaultAddress > -1 ? defaultAddress : 0)
				emit('confirmAddress', address_list.value[current_address_index.value], 'default')
			} else if (props.mode == 'order') {

				let index = address_list.value.findIndex(i => {
					let { addressAll, receiverName, receiverMobile, detailAddress } = i
					if (
						receiverName == props.orderAddress.receiverName &&
						receiverMobile == props.orderAddress.receiverMobile &&
						detailAddress == props.orderAddress.receiverAddress &&
						addressAll == props.orderAddress.receiverAreaInfo
					) {
						return true
					} else {
						return false
					}
				})
				if (index > -1) {
					current_address_index.value = index
				} else {
					current_address_index.value = -1
				}
			}

		}

		//切换地址
		const selectAddress = index => {
			current_address_index.value = index;
		};

		//确认修改地址
		const confirmChangeAddress = () => {
			let address = address_list.value[current_address_index.value];
			if (address) {
				localStorage.setItem('addressId', address.addressId)
			}
			emit('confirmAddress', address)
			emit('update:visible', false)
		};

		onMounted(() => {
			getAddressList()
		})

		return {
			confirmChangeAddress,
			L,
			address_list,
			current_address_index,
			selectAddress,
			getAddressList
		}
	}
})
</script>

<style lang="scss">
// 选择地址
.address_con {
	height: 330px;
	overflow-y: scroll;
	scrollbar-width: none !important;
	-ms-overflow-style: none !important;

	.address_item {
		&:not(:first-child) {
			margin-top: 20px;
		}

		width: 458px;
		box-sizing: border-box;
		border: 1px solid #dfdfdf;
		position: relative;
		padding: 20px;

		span,
		div:not(:first-child) {
			margin-top: 12px;
		}

		.address_text {
			display: flex;
			width: 400px;
		}

		.selected {
			position: absolute;
			right: -0.5px;
			bottom: -1px;
		}
	}

	.select {
		border: 1px solid var(--color_main);
	}
}
</style>