<!--
 * @Author: heyimin
 * @Date: 2024-9-5
 * @Description: 供应商注册 - 注册协议页
-->
<template>
	<div class="protocol">
		<div class="container">
			<div class="title">入驻协议</div>
			<div class="content_wrap">
				<div class="content-title">TFshop跨境供应链平台注册协议</div>
				<div class="content" v-html="protocolContent"></div>
			</div>
			<div class="agree">
				<el-checkbox @change="toggleAgree" v-model="protocolAgreed">我已阅读并同意以上协议</el-checkbox>
			</div>
			<div class="mange_con">
				<div class="next flex_row_center_center" @click="next">
					下一步
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ElMessage} from 'element-plus'
import { getCurrentInstance, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import protocolContent from './protocolContent';


export default {
	name: 'Protocol',
	components: {
	},
	setup (props, { emit }) {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const protocolAgreed = ref(false)

		// 点击同意框切换是否同意
		const toggleAgree = () => {
			protocolAgreed.value = !protocolAgreed.value
			console.log(protocolAgreed.value, 'protocolagre');
			
		}

		// 点击下一步
		const next = () => {
			if (!protocolAgreed.value) {
				ElMessage.warning('请阅读并同意注册协议')
			} else
			emit('clickNext')
		}

		onMounted(() => {})

		return {
			L,
			next,
			toggleAgree,
			protocolContent
		}
	}
}
</script>

<style lang="scss" scoped>
.protocol {
	width: 1007px;
	float: left;
	margin-left: 10px;

	.container {
		background-color: white;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eaeaea;
		padding: 25px 40px;
		min-height: 600px;

		.title {
			font-size: 18px;
			border-bottom: 1px dashed #eaeaea;
			padding-bottom: 25px;
			font-weight: 600;
			margin-bottom: 20px;
		}

		.content_wrap {
			border: 1px solid #eaeaea;
			border-radius: 5px;
			padding: 20px 10px 20px 15px;

			.content-title {
				margin: 0 auto 20px;
				text-align: center;
				font-size: 16px;
			}

			.content {
				font-size: 12px;
				color: #555;
				line-height: 20px;
				height: 400px;
				overflow: auto;
			}
		}

		.agree {
			margin-top: 20px;
		}

		.mange_con {
			width: 360px;
			margin: 42px auto 20px;

			.next {
				width: 170px;
				height: 40px;
				background: var(--color_main);
				color: #fff;
				font-size: 18px;
				font-weight: bold;
				text-align: center;
				color: white;
				margin-top: 20px;
				line-height: 40px;
				border-radius: 3px;
				margin: 42px auto 0;
				cursor: pointer;
			}
		}
	}
}
</style>
