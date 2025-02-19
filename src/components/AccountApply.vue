<!--申请供应商/买家弹框 @hym-2024-09-03-->
<template>
	<div class="account_apply_modal">
		<el-dialog :title="'账号注册'" 
			v-model="modalVisible" 
			@close="close_dialog"
			:top="'15vh'" 
			center>
			<div class="select-btn-wrap">
				<el-button class="select-btn seller" 
					@blur="selectBtnBlur" 
					@click="clickSelectBtn('seller')">
					我想成为供应商
				</el-button>
				<el-button class="select-btn"  
					@blur="selectBtnBlur" 
					@click="clickSelectBtn('buyer')">
					我要采购
				</el-button>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" class="confirm" round @click="clickConfirm">{{ L['确 定']
						}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { ElMessage } from 'element-plus'

export default {
	name: "AccountApply",
	components: {},
	props: ["visibleFlag", "type", "addressInfo"],
	setup (props, { emit }) {
		const { proxy } = getCurrentInstance();
		const L = proxy.$getCurLanguage();
		const modalVisible = ref(true);
		const applyType = ref('')

		
		const close_dialog = () => {
			emit("close");
			document.body.style.overflow = 'visible'
		};

		// 点击类型按钮
		const clickSelectBtn = (type) => {
			applyType.value = type
		}

		// 类型按钮失去焦点事件
		const selectBtnBlur = (e) => {
			const classList = e?.relatedTarget?.classList && Array.from(e?.relatedTarget?.classList)
			
			if (!classList || !classList.includes('select-btn') && !classList.includes('confirm')) {
				applyType.value = ''
			}	
		}

		// 点击确定
		const clickConfirm = () => {
			switch (applyType.value) {
				case 'seller':
					//跳转大B注册地址
					break;
				case 'buyer':
					//跳转小B注册地址
					break;
				case '':
					ElMessage.warning('请先选择注册类型')
					break;
			
				default:
					break;
			}
		}


		onMounted(() => {
		})

		return {
			L,
			modalVisible,
			close_dialog,
			clickSelectBtn,
			selectBtnBlur,
			clickConfirm
		};
	}
};
</script>

<style lang="scss">
.account_apply_modal {
	.el-dialog {
		width: 500px !important;
		height: 600px;
	}

	.select-btn-wrap {
		.select-btn {
			display: block;
			margin: 30px auto;
			width: 300px;
			height: 50px;
		}

		.seller {
			margin-top: 130px;
		}
	}

	.confirm {
		width: 400px;
		margin: 100px auto 30px;
	}
}
</style>
