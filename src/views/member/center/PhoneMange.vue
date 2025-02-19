<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2024-09-26 21:52:12
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: 手机号管理
 * @FilePath: /java-pc/src/views/member/center/accountSafe.vue
-->
<template>
	<div class="sld_phone_mange">
		<MemberTitle :memberTitle="L['手机号管理']"></MemberTitle>
		<div class="container">
			<div class="title">{{ L['手机号管理'] }}</div>
			<div class="mange_con">
				<span class="current" v-if="memberInfo.data.userMobile">{{ L['当前手机号'] }} {{ memberInfo.data.userMobile }}</span>
				<div v-if="step == 1" class="sms_code_con">
					<el-input v-model="old_sms_code" :placeholder="L['请输入短信验证码']" type="number"></el-input>
					<div class="get_sms" @click="getSmsCode">
						{{ countDownM ? countDownM + L['s后获取'] : L['获取验证码'] }}
					</div>
				</div>
				<div class="sms_code_con">
					<el-input v-if="step == 2" class="new-phone-number" v-model="new_mobile" :placeholder="L['请输入新手机号']"
					  type="number">
					</el-input>
				</div>
				<div v-if="step == 2" class="sms_code_con">
					<el-input v-model="new_sms_code" :placeholder="L['请输入短信验证码']" type="number"></el-input>
					<div class="get_sms" @click="getSmsCode">
						{{ countDownM ? countDownM + L['s后获取'] : L['获取验证码'] }}
					</div>
				</div>
				<div class="error_tip">
					<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
					{{ errorMsg }}
				</div>
				<div class="next flex_row_center_center" @click="next">
					{{ step == 1 ? L['下一步'] : L['确定'] }}
				</div>
			</div>
			<div class="manage_tips">
				<p class="tips_title">{{ L['温馨提示'] }}：</p>
				<p>• {{ L['为了保障您的账号安全，变更重要信息需进行身份验证。'] }}</p>
				<p>• {{ L['变更过程中有任何疑问请联系在线客服解决。'] }}</p>
				<p>
					•
					{{ L['如手机号/邮箱已不再使用无法获取验证码，请联系在线客服解决。'] }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { getCurrentInstance, reactive, ref, watch,onMounted} from 'vue'
import { useStore } from 'vuex'
import MemberTitle from '../../../components/MemberTitle'

export default {
	name: 'PhoneMange',
	components: {
		ElInput,
		MemberTitle
	},
	setup () {
		const { proxy } = getCurrentInstance()
		const errorMsg = ref('')
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const step = ref(1)
		const old_sms_code = ref('')
		const new_sms_code = ref('')
		const new_mobile = ref('')
		const timeOutId = ref('') //定时器的返回值
		const countDownM = ref(0) //短信验证码倒计时
		const memberInfo = reactive({ data: store.state.memberInfo })
		const preventFre = ref(false)
        onMounted(() => {
			if(memberInfo.data.userMobile){
                step.value = 1
            }else {
                step.value = 2
            }
		})
		const getSmsCode = () => {
			if (preventFre.value) {
				return false
			}
			preventFre.value = true
			if (step.value == 2) {
				//手机号验证
				if (!new_mobile.value) {
					preventFre.value = false
					errorMsg.value = L['请输入手机号']
					return false
				} else {
					let checkMobile = proxy.$checkPhone(new_mobile.value)
					if (checkMobile !== true) {
						errorMsg.value = checkMobile
						preventFre.value = false
						return false
					}
				}
			}
			if (countDownM.value) {
				return false
			}
			var param = {}
			param.verifyType = 2
			param.changeType = step.value == 1 ? 'old' : 'new'
			param.verifyAddr =
				step.value == 1 ? memberInfo.data.userMobile : new_mobile.value

			proxy.$get('v3/supplier/channel/commons/sendVerifyCode', param).then(res => {
				if (res.state == 200) {
					errorMsg.value = ''
					countDownM.value = 60
					countDown()
				} else {
					preventFre.value = false
					ElMessage.error(res.msg)
				}
			})
		}
		const next = () => {
			preventFre.value = false
			if (step.value == 1) {
				//验证码校验
				if (!old_sms_code.value) {
					errorMsg.value = L['请输入短信验证码']
					return false
				} else {
					let checkSmsCode = proxy.$checkSmsCode(old_sms_code.value)
					if (checkSmsCode !== true) {
						errorMsg.value = checkSmsCode
						return false
					}
				}
				proxy
					.$post('v3/supplier/channel/userPassword/verifyOldMobile', {
						userMobile: memberInfo.data.userMobile,
						smsCode: old_sms_code.value
					})
					.then(res => {
						if (res.state == 200) {
							step.value = 2
							clearTimeout(timeOutId.value)
							countDownM.value = 0
							errorMsg.value = ''
						} else {
							errorMsg.value = res.msg
						}
					})
			} else if (step.value == 2) {
				//验证码校验
				if (!new_sms_code.value) {
					errorMsg.value = L['请输入短信验证码']
					return false
				} else {
					let checkSmsCode = proxy.$checkSmsCode(new_sms_code.value)
					if (checkSmsCode !== true) {
						errorMsg.value = checkSmsCode
						return false
					}
				}
				proxy
					.$post('v3/supplier/channel/userPassword/updateMobile', {
						userMobile: new_mobile.value,
						smsCode: new_sms_code.value
					})
					.then(res => {
						if (res.state == 200) {
							clearTimeout(timeOutId.value)
							//更新个人信息
							memberInfo.data.userMobile = new_mobile.value
							store.commit('updateMemberInfo', memberInfo.data)
							countDownM.value = 0
							ElMessage.success(res.msg)
							step.value = 1
							old_sms_code.value = ''
							errorMsg.value = ''
						} else if (res.state == 267) {
							ElMessageBox.confirm(res.msg, L['提示'], {
								confirmButtonText: L['确定'],
								cancelButtonText: L['取消'],
								type: 'warning'
							}).then(() => {
								proxy
									.$post('v3/supplier/channel/userPassword/updateMobile', {
										userMobile: new_mobile.value,
										smsCode: new_sms_code.value,
										isUnbound: 1
									})
									.then(res => {
										if (res.state == 200) {
											//更新个人信息
											memberInfo.data.userMobile = new_mobile.value
											store.commit('updateMemberInfo', memberInfo.data)
											ElMessage.success(res.msg)
											step.value = 1
											old_sms_code.value = ''
										} else {
											ElMessage.error(res.msg)
										}
									})
							})
						} else {
							errorMsg.value = res.msg
						}


						//清除验证码倒计时
						preventFre.value = false
						clearTimeout(timeOutId.value)
						countDownM.value = 0
						timeOutId.value = null
					})
			}
		}
		//倒计时
		const countDown = () => {
			countDownM.value--
			if (countDownM.value == 0) {
				preventFre.value = false
				clearTimeout(timeOutId.value)
			} else {
				timeOutId.value = setTimeout(countDown, 1000)
			}
		}

		watch([old_sms_code, new_sms_code, new_mobile], () => {
			old_sms_code.value = old_sms_code.value.substring(0, 6)
			new_sms_code.value = new_sms_code.value.substring(0, 6)
			// new_mobile.value = new_mobile.value.substring(0, 11)
			errorMsg.value = ''
		})

		return {
			L,
			memberInfo,
			countDownM,
			getSmsCode,
			new_mobile,
			old_sms_code,
			new_sms_code,
			next,
			step,
			errorMsg
		}
	}
}
</script>

<style lang="scss" scoped>
.el-input {
	:deep(.el-input__wrapper){
	   border-top-right-radius: 0;
	   border-bottom-right-radius: 0;
	   height: 40px;
       width: 280px;
	}
	:deep(.is-focus){
		box-shadow: 0 0 0 1px var(--color_main) inset;
	}
}
.sld_phone_mange {
	width: 1007px;
	float: left;
	margin-left: 10px;

	.container {
		background-color: white;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eaeaea;
		padding: 25px 40px;

		.title {
			font-size: 18px;
			border-bottom: 1px dashed #eaeaea;
			padding-bottom: 25px;
			font-weight: 600;
			margin-bottom: 20px;
		}

		.mange_con {
			min-width: 360px;
			margin: 62px auto 0;

			.current {
				line-height: 56px;
				font-size: 14px;
				color: #333333;
				width: 100%;
				text-align: center;
				display: block;
			}

			.error_tip {
				height: 15px;
				margin-top: 10px;
				color: var(--color_main);
				text-align: center;

				i {
					margin-right: 10px;
				}
			}

			.sms_code_con {
				display: flex;
    			justify-content: center;
				.el-input {
				   width: 280px;
				   height: 40px;
				}
				.new-phone-number{
					margin-right: 100px;
					margin-bottom: 20px;
				}
				.get_sms {
					width: 100px;
					height: 40px;
					line-height: 38px;
					background: var(--color_main);
					text-align: center;
					color: white;
					font-size: 14px;
					border-radius: 0 3px 3px 0;
				    cursor: pointer;
				}
			}


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

		.manage_tips {
			width: 938px;
			background: #fffdee;
			border: 1px solid #edd28b;
			padding: 15px 36px;
			margin-top: 117px;

			p {
				color: #555555;
				margin-top: 10px;
			}

			.tips_title {
				font-weight: bold;
				margin-bottom: 11px;
				margin-top: 0;
			}
		}
	}
}
</style>
<style lang="scss">

input[type='number'] {
	-moz-appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/**
* 解决el-input设置类型为number时，中文输入法光标上移问题
**/
.el-input__inner {
	line-height: 1px !important;
}
</style>
