<template>
	<div v-if="!firstLoading" class="delivery flex_row_start_center">
		<div class="delivery_title">{{ L['配送至'] }}</div>
		<label class="delivery_address flex_row_between_center" @click.stop="addrDialogVisible = !addrDialogVisible"
			for="invisibleInput">
			<span>{{ curAddrName ? curAddrName : L['请选择地址'] }}</span>
			<i class="iconfont iconziyuan11-copy"></i>
		</label>

		<div class="address_dia" v-if="addrDialogVisible">
			<div class="add_dia_top">
				<div :class="{ dia_top_item: true, sel_item: addrIdx == 0 }" @click.stop="addrIdx = 0"
					v-if="logFlag && address_list.data.length">
					{{ L['常用地址'] }}
				</div>
				<div :class="{ dia_top_item: true, sel_item: addrIdx == 1 }" @click.stop="addrIdx = 1">
					{{ L['其他地址'] }}
				</div>
			</div>
			<div class="add_dia_bottom">
				<div class="usual_addr" v-if="addrIdx == 0 && logFlag && address_list.data.length">
					<el-radio-group v-model="curAddr" @change="changeAddr($event)" text-color="#333333" fill="var(--color_main)"
						v-if="address_list.data && address_list.data.length">
						<el-radio v-for="(item, index) in address_list.data" :key="index" :label="item.addressId"
							class="promotion_radio" @click.stop="() => { }">
							{{ item.addressAll }}{{ item.detailAddress }}
						</el-radio>
					</el-radio-group>
				</div>
				<div class="other_addr" v-if="addrIdx == 1">
					<div class="o_add_top">
						<div :class="{ o_addr_item: true, o_sel: otherAddrIdx == id }" v-for="(it, id) in otherTree" :key="id"
							@click.stop="selRegion(id)">
							{{ it.regionName }}
						</div>
					</div>
					<div class="o_add_bottom">
						<div :class="{ o_addrC_item: true, o_selected: othTopIdx[otherAddrIdx] == index }"
							v-for="(item, index) in othAddrDe" :key="index" @click.stop="selRegionChild(index, otherAddrIdx)">
							{{ item.regionName }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import addrData from '@/assets/area.json'
import { useStore } from 'vuex'
export default {
	props: {},
	components: {},
	setup (_, { emit }) {
		const { proxy } = getCurrentInstance();
		const store = useStore()
		const curAddr = ref(-1);
		const curAddrName = ref('')
		const addrIdx = ref(0)
		const otherAddrIdx = ref(0)
		const L = proxy.$getCurLanguage()
		const othTopIdx = reactive({
			0: 0,
			1: 0,
			2: 0
		})
		const otherTree = ref([addrData[othTopIdx["0"]], addrData[othTopIdx["0"]].children[othTopIdx["1"]]])
		const othAddrDe = ref(addrData)
		const addrDialogVisible = ref(false)
		const address_list = reactive({ data: [] });
		const logFlag = ref(store.state.loginFlag)
		const regionCode = ref(0)

		//获取地址列表
		const getAddressList = () => {
			proxy.$get('v3/supplier/channel/userAddress/list', {
				pageSize: 1000
			}).then(res => {
				if (res.state == 200) {
					if (res.data.list.length > 0) {
						address_list.data = res.data.list
						if (address_list.data.findIndex(i => i.isDefault == 1) > 0) {
							let index = address_list.data.findIndex(i => i.isDefault == 1)
							curAddrName.value = address_list.data[index].addressAll + '' + address_list.data[index].detailAddress
							curAddr.value = address_list.data[index].addressId
							regionCode.value = address_list.data[index].cityCode
						} else if (address_list.data.length) {
							curAddrName.value = address_list.data[0].addressAll + '' + address_list.data[0].detailAddress
							curAddr.value = address_list.data[0].addressId
							regionCode.value = address_list.data[0].cityCode
						}
						emit('change', regionCode.value, curAddr.value)


						if (localStorage.getItem('addressId')) {
							let addressID = localStorage.getItem('addressId')
							if (res.data.list.filter(i => i.addressId == addressID)[0]) {
								let tmp = res.data.list.filter(i => i.addressId == addressID)[0]
								curAddr.value = tmp.addressId
								curAddrName.value = tmp.addressAll + '' + tmp.detailAddress
								regionCode.value = tmp.cityCode
							}
						}
					} else {
						curAddrName.value = ''
						addrIdx.value = 1
					}
				}
			})
		}


		//修改选择地址列表
		const changeAddr = e => {
			curAddr.value = e
			let tmp = address_list.data.filter(i => i.addressId == e)[0]
			curAddrName.value = tmp.addressAll + '' + tmp.detailAddress
			addrDialogVisible.value = false
			regionCode.value = tmp.cityCode
			emit('change', regionCode.value, curAddr.value)


		}


		// 选择其他地址的顶部选项
		const selRegion = index => {
			otherAddrIdx.value = index
			switch (index) {
				case 0: {
					othAddrDe.value = addrData
					break
				}
				case 1: {
					othAddrDe.value = addrData[othTopIdx['0']].children
					break
				}
				case 2: {
					othAddrDe.value = addrData[othTopIdx['0']].children[othTopIdx['1']].children
					break
				}
			}
			otherTree.value[otherAddrIdx.value] = othAddrDe.value[othTopIdx[otherAddrIdx.value]]
		}

		// 选择其他地址的顶部选项下的子选项
		const selRegionChild = (index, otherIdx) => {
			othTopIdx[otherIdx] = index
			otherTree.value[otherAddrIdx.value] = othAddrDe.value[othTopIdx[otherIdx]]
			if (
				othAddrDe.value[othTopIdx[otherAddrIdx.value]].children &&
				othAddrDe.value[othTopIdx[otherAddrIdx.value]].children.length
			) {
				otherTree.value.splice(otherAddrIdx.value + 1)
				othTopIdx[otherIdx + 1] = 0
				selRegion(otherAddrIdx.value + 1)
			} else {
				regionCode.value = otherTree.value[otherAddrIdx.value - 1].regionCode
				addrDialogVisible.value = false
				curAddr.value = -1
				curAddrName.value = ''
				otherTree.value.map(i => {
					curAddrName.value += i.regionName
				})
				emit('change', regionCode.value, curAddr.value)
			}
		}

		onMounted(() => {
			if (store.state.loginFlag) {
				getAddressList()
			}

			window.addEventListener('click', () => {
				addrDialogVisible.value = false
			})
			if (!logFlag.value) {
				addrIdx.value = 1
			}
		})

		return {
			address_list,
			addrDialogVisible,
			addrIdx,
			curAddrName,
			otherAddrIdx,
			logFlag,
			L,
			otherTree,
			changeAddr,
			selRegionChild,
			othAddrDe,
			othTopIdx,
			selRegion,
			curAddr,
		}
	},
}
</script>

<style lang='scss' scoped>
// 配送地 start
.delivery {
	padding-left: 20px;
	margin-top: 22px;
	position: relative;

	.delivery_title {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #666666;
		line-height: 30px;
	}

	.delivery_address {
		height: 30px;
		background: #ffffff;
		border: 1px solid #dfdfdf;
		border-radius: 3px;
		padding: 0 11px;
		box-sizing: border-box;
		margin-left: 18px;
		cursor: pointer;

		span {
			display: inline-block;
			font-size: 14px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #999999;
			line-height: 30px;
			text-overflow: ellipsis;
			max-width: 275px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		i {
			font-size: 12px;
			margin-left: 10px;
		}
	}

	.address_dia {
		position: absolute;
		z-index: 1000;
		height: 310px;
		border: 1px solid #dfdfdf;
		background: #ffffff;
		top: 32px;
		width: 397px;
		left: 81px;
		overflow: auto;

		.add_dia_top {
			height: 30px;
			background: #f8f8f8;
			display: flex;

			.dia_top_item {
				padding: 0 25px;
				line-height: 30px;
				font-size: 13px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #666666;
				cursor: pointer;
			}

			.sel_item {
				background: #ffffff !important;
				color: var(--color_main);
				box-shadow: 0 2px 0px var(--color_main) inset;
			}
		}

		.add_dia_bottom {
			margin-top: 10px;
			padding: 0 20px;

			.usual_addr {
				padding-top: 10px;
			}

			.other_addr {
				.o_add_top {
					display: flex;

					.o_addr_item {
						padding: 4px 11px;
						border: 1px solid #dfdfdf;
						background: #eeeeee;
						color: #333333;
						font-size: 12px;
						font-weight: 400;
						cursor: pointer;
					}

					.o_sel {
						border-bottom: none;
						font-family: Microsoft YaHei;
						background: #fff !important;
					}
				}

				.o_add_bottom {
					border-top: 1px solid #dfdfdf;
					margin-top: -1px;
					padding-top: 15px;
					display: flex;
					flex-wrap: wrap;

					.o_addrC_item {
						padding: 2px 6px;
						margin: 5px 9px;
						font-size: 12px;
						color: #333333;
						cursor: pointer;

						&:hover {
							color: var(--color_main);
						}
					}

					.o_selected {
						color: var(--color_main);
					}
				}
			}
		}
	}
}

// 配送地 end</style>
