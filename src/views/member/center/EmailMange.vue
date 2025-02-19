<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-25 09:56:17
 * @LastEditors: Please set LastEditors
 * @Description: 邮箱管理
 * @FilePath: /java-pc/src/views/member/center/accountSafe.vue
-->
<template>
	<div class="sld_email_mange">
		<MemberTitle :memberTitle="L['邮箱管理']"></MemberTitle>
		<div class="container">
			<div class="title">
				{{
			memberInfo.data.userEmail ? L['修改电子邮箱'] : L['绑定电子邮箱']
		}}
			</div>
			<div class="mange_con">
				<!--会员未绑定邮箱 start-->
				<template v-if="!memberInfo.data.userEmail">
					<el-input class="password input" v-model="new_mobile" :placeholder="L['请输入邮箱']"></el-input>
					<div class="sms_code_con">
						<el-input v-model="new_sms_code" :placeholder="L['请输入邮箱验证码']" type="number" maxlength="6"></el-input>
						<div class="get_sms" @click="getSmsCode">
							{{ countDownM ? countDownM + L['s后获取'] : L['获取验证码'] }}
						</div>
					</div>
					<div class="error_tip">
						<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
						{{ errorMsg }}
					</div>
					<div class="next flex_row_center_center" @click="bindEmail">
						{{ L['确定'] }}
					</div>
				</template>
				<!--会员未绑定邮箱 end-->
				<!--会员修改邮箱 start-->
				<template v-if="memberInfo.data.userEmail">
					<span class="current">{{ L['当前邮箱'] }} {{ memberInfo.data.userEmail }}</span>
					<div v-if="step == 1" class="sms_code_con">
						<el-input v-model="old_sms_code" :placeholder="L['请输入邮箱验证码']" maxlength="6" type="number"></el-input>
						<div class="get_sms" @click="getSmsCode">
							{{ countDownM ? countDownM + L['s后获取'] : L['获取验证码'] }}
						</div>
					</div>
					<el-input v-if="step == 2" class="password input" v-model="new_mobile" :placeholder="L['请输入新邮箱']">
					</el-input>
					<div v-if="step == 2" class="sms_code_con">
						<el-input v-model="new_sms_code" :placeholder="L['请输入邮箱验证码']" maxlength="6"></el-input>
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
				</template>
				<!--会员修改邮箱 start-->
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
import { getCurrentInstance, reactive, ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import MemberTitle from '../../../components/MemberTitle'
export default {
	name: 'EmailMange',
	components: {
		ElInput,
		MemberTitle
	},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const step = ref(1)
		const errorMsg = ref('')
		const old_sms_code = ref('')
		const new_sms_code = ref('')
		const new_mobile = ref('')
		const timeOutId = ref('') //定时器的返回值
		const countDownM = ref(0) //短信验证码倒计时
		const memberInfo = reactive({ data: store.state.memberInfo })
		const preventFre = ref(false)

		const getSmsCode = () => {
			if (preventFre.value) {
				return
			}
			preventFre.value = true
			if (countDownM.value > 1) {
				preventFre.value = false
				return
			} else {
				//验证新邮箱是否正确
				if (memberInfo.data.userMobile && step.value == 2) {
					if (!new_mobile.value) {
						preventFre.value = false
						errorMsg.value = L['请输入邮箱号']
						return
					} else {
						let checkEmail = proxy.$checkEmail(new_mobile.value)
						if (checkEmail !== true) {
							errorMsg.value = checkEmail
							preventFre.value = false
							return
						} else {
							errorMsg.value = ''
						}
					}
				}
				var param = {}
				param.verifyType = 1
				//未绑定邮箱
				if (!memberInfo.data.userEmail) {
					param.verifyAddr = new_mobile.value
					param.changeType = ''
				} else {
					param.verifyAddr =
						step.value == 1 ? memberInfo.data.userEmail : new_mobile.value
					param.changeType = step.value == 1 ? 'old' : 'new'
				}
				proxy.$get('v3/supplier/channel/commons/sendVerifyCode', param).then(res => {
					if (res.state == 200) {
						countDownM.value = 60
						countDown()
						preventFre.value = false
					} else {
						ElMessage.error(res.msg)
						preventFre.value = false
					}
				})
			}
		}

		//绑定邮箱
		const bindEmail = () => {
			//验证邮箱是否正确
			if (memberInfo.data.userMobile && step.value == 2) {
				if (!new_mobile.value) {
					errorMsg.value = L['请输入邮箱号']
					return false
				} else {
					let checkEmail = proxy.$checkEmail(new_mobile.value)
					if (checkEmail !== true) {
						errorMsg.value = checkEmail
						return false
					}
				}
			}
			//验证码校验
			if (!new_sms_code.value) {
				errorMsg.value = L['请输入邮箱验证码']
				return false
			} else {
				let checkEmailCode = proxy.$checkEmailCode(new_sms_code.value)
				if (checkEmailCode !== true) {
					errorMsg.value = checkEmailCode
					return false
				} else {
					errorMsg.value = ''
				}
			}
			proxy.$post('v3/supplier/channel/userPassword/updateEmail', {
				userEmail: new_mobile.value,
				emailCode: new_sms_code.value
			}).then(res => {
				if (res.state == 200) {
					errorMsg.value = ''
					ElMessage.success(res.msg)
					//更新个人信息
					memberInfo.data.userEmail = new_mobile.value
					step.value = 1
					new_mobile.value = ''
					new_sms_code.value = ''
					old_sms_code.value = ''
					preventFre.value = false
					store.commit('updateMemberInfo', memberInfo.data)
				} else if (res.state == 267) {
					ElMessageBox.confirm(res.msg, L['提示'], {
						confirmButtonText: L['确定'],
						cancelButtonText: L['取消'],
						type: 'warning'
					}).then(() => {
						proxy.$post('v3/supplier/channel/userPassword/updateEmail', {
							userEmail: new_mobile.value,
							emailCode: new_sms_code.value,
							isUnbound: 1
						}).then(res => {
							if (res.state == 200) {
								ElMessage.success(res.msg)
								memberInfo.data.userEmail = new_mobile.value
								store.commit('updateMemberInfo', memberInfo.data)
								errorMsg.value = ''
								step.value = 1
								new_mobile.value = ''
								new_sms_code.value = ''
								old_sms_code.value = ''
								preventFre.value = false
								//更新个人信息
							} else {
								ElMessage.error(res.msg)
							}
						})
					})
				} else {
					errorMsg.value = res.msg
				}

				//清除验证码倒计时

				clearTimeout(timeOutId.value)
				countDownM.value = 0
				timeOutId.value = null
			})
		}
		const next = () => {
			let param = {}
			let url = ''
			preventFre.value = false
			if (step.value == 1) {
				//验证码校验
				if (!old_sms_code.value) {
					errorMsg.value = L['请输入邮箱验证码']
					return false
				} else {
					let checkEmailCode = proxy.$checkEmailCode(old_sms_code.value)
					if (checkEmailCode !== true) {
						errorMsg.value = checkEmailCode
						return false
					}
				}
				url = 'v3/supplier/channel/userPassword/verifyOldEmail'
				param.userEmail = memberInfo.data.userEmail
				param.emailCode = old_sms_code.value
			} else if (step.value == 2) {
				let checkEmail = proxy.$checkEmail(new_mobile.value)
				if (checkEmail !== true) {
					return false
				}

				url = 'v3/supplier/channel/userPassword/updateEmail'
				param.userEmail = new_mobile.value
				param.emailCode = new_sms_code.value
			}
			proxy.$post(url, param).then(res => {
				if (res.state == 200) {
					errorMsg.value = ''
					if (step.value == 1) {
						step.value = 2
					} else if (step.value == 2) {
						//更新个人信息
						memberInfo.data.userEmail = new_mobile.value
						store.commit('updateMemberInfo', memberInfo.data)
						step.value = 1
					}

				} else if (res.state == 267) {
					ElMessageBox.confirm(res.msg, L['提示'], {
						confirmButtonText: L['确定'],
						cancelButtonText: L['取消'],
						type: 'warning'
					}).then(() => {
						proxy
							.$post('v3/supplier/channel/userPassword/updateEmail', {
								userEmail: new_mobile.value,
								emailCode: new_sms_code.value,
								isUnbound: 1
							})
							.then(res => {
								if (res.state == 200) {
									ElMessage.success(res.msg)
									//更新个人信息
									memberInfo.data.userEmail = new_mobile.value
									store.commit('updateMemberInfo', memberInfo.data)
									errorMsg.value = ''
									step.value = 1
								} else {
									ElMessage.error(res.msg)
								}
							})
					})
				} else {
					errorMsg.value = res.msg
				}

				//清除验证码倒计时
				clearTimeout(timeOutId.value)
				countDownM.value = 0
				timeOutId.value = null
			})
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

		watch(new_mobile, () => {
			new_mobile.value = new_mobile.value.substring(0, 50)
			errorMsg.value = ''
		})

		watch([old_sms_code, new_sms_code], (nv) => {
			old_sms_code.value = nv[0].substring(0, 6)
			new_sms_code.value = nv[1].substring(0, 6)
			errorMsg.value = ''
		})

		onMounted(() => {
			if (!memberInfo.data.userEmail) {
				step.value = 2
			}
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
			bindEmail,
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
.sld_email_mange {
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

			.margin {
				margin-top: 20px;
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
