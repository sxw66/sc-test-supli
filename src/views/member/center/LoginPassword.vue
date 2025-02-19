<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-15 19:08:07
 * @LastEditors: Please set LastEditors
 * @Description: 登录密码
 * @FilePath: /java-pc/src/views/member/center/accountSafe.vue
-->
<template>
	<div class="sld_login_password_mange">
		<MemberTitle :memberTitle="L['登录密码']"></MemberTitle>
		<div class="container">
			<div class="title">
				{{ memberInfo.data.hasLoginPassword ? L['修改'] : L['设置']
				}}{{ L['登录密码'] }}
			</div>
			<div class="mange_con">
				<div class="without_phone_tip" v-if="!memberInfo.data.userMobile">
					{{ L['请先绑定手机号，再进行登陆密码操作!'] }}
				</div>
				<!-- 设置登录密码 start -->
				<template v-if="!memberInfo.data.hasLoginPassword">
					<span class="current">{{ L['当前手机号 ']
						}}{{
			memberInfo.data.userMobile ? memberInfo.data.userMobile : '--'
		}}</span>

					<div class="sms_code_con flex_row_center_center">
						<el-input v-model="sms_code" :placeholder="L['请输入短信验证码']"></el-input>
						<div class="get_sms pointer" @click="getSmsCode">
							{{ countDownM ? countDownM + L['s后获取'] : L['获取验证码'] }}
						</div>
					</div>
					<el-input type="password" v-model="password" :placeholder="L['请输入密码']"></el-input>
					<el-input type="password" v-model="confirm_password"
						:placeholder="L['请再次输入密码']"></el-input>
					<div class="error_tip">
						<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
						{{ errorMsg }}
					</div>
					<div class="next flex_row_center_center pointer" @click="next">
						{{ L['设置密码'] }}
					</div>
				</template>
				<!-- 设置登录密码 end -->
				<!-- 修改登录密码 start -->
				<template v-if="memberInfo.data.hasLoginPassword">
					<el-input type="password" v-model="old_password" :placeholder="L['请输入原密码']"></el-input>
					<el-input type="password" v-model="password" :placeholder="L['请输入新密码']"></el-input>
					<el-input type="password" v-model="confirm_password"
						:placeholder="L['请再次输入新密码']"></el-input>
					<div class="error_tip">
						<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
						{{ errorMsg }}
					</div>
					<div class="next flex_row_center_center pointer" @click="next">
						{{ L['修改密码'] }}
					</div>
				</template>
				<!-- 修改登录密码 end -->
			</div>
			<div class="manage_tips">
				<p class="tips_title">{{ L['温馨提示'] }}：</p>
				<p>• {{ L['为了保障您的账号安全，变更重要信息需进行身份验证。'] }}</p>
				<p>• {{ L['变更过程中有任何疑问请联系在线客服解决。'] }}</p>
				<p>
					•
					{{ L['如手机号/邮箱已不再使用无法获取验证码，请联系在线客服解决。'] }}
				</p>
				<p>• {{ L['复杂的密码可使账号更安全且建议定期更换密码。'] }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import { ElInput, ElMessage } from 'element-plus'
import { getCurrentInstance, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import MemberTitle from '../../../components/MemberTitle'

export default {
	name: 'LoginPassword',
	components: {
		ElInput,
		MemberTitle
	},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const sms_code = ref('')
		const errorMsg = ref('')
		const password = ref('') //输入新密码
		const confirm_password = ref('') //再次输入新密码
		const old_password = ref('') //输入旧密码
		// const confirm_password = ref("");
		const timeOutId = ref('') //定时器的返回值
		const countDownM = ref(0) //短信验证码倒计时
		const memberInfo = reactive({ data: store.state.memberInfo })
		const isSmsClick = ref(false)

		const getSmsCode = () => {
			if (isSmsClick.value) {
				return
			} else if (countDownM.value) {
				return
			}
			isSmsClick.value = true
			var param = {}
			param.verifyType = 2
			param.verifyAddr = memberInfo.data.userMobile
			proxy.$get('v3/supplier/channel/commons/sendVerifyCode', param).then(res => {
				if (res.state == 200) {
					countDownM.value = 60
					countDown()
					isSmsClick.value = false
				} else {
					ElMessage.error(res.msg)
					isSmsClick.value = false
				}
			})
		}
		const next = () => {
			isSmsClick.value = false
			if (!memberInfo.data.userMobile) {
				ElMessage.warning(L['请先绑定手机号，再进行操作!'])
				return false
			}
			let url = ''
			let param = {}
			if (memberInfo.data.hasLoginPassword) {
				//修改登录密码
				if (!old_password.value) {
					errorMsg.value = L['请输入旧密码']
					return false
				}
				if (!password.value) {
					errorMsg.value = L['请输入新密码']
					return false
				}
				if (!confirm_password.value) {
					errorMsg.value = L['请再次输入新密码']
					return false
				}

				if (password.value != confirm_password.value) {
					errorMsg.value = L['请输入一致的新密码']
					return false
				}

				//验证新密码是否符合规则
				let checkPwd = proxy.$checkPwd(password.value)
				if (checkPwd !== true) {
					errorMsg.value = checkPwd
					return false
				}

				url = 'v3/supplier/channel/userPassword/editLoginPwd'
				param.oldLoginPwd = proxy.$base64Encrypt(old_password.value)
				param.loginPwd = proxy.$base64Encrypt(password.value)
			} else {
				//验证码校验
				if (!sms_code.value) {
					errorMsg.value = L['请输入短信验证码']
					return false
				} else {
					let checkSmsCode = proxy.$checkSmsCode(sms_code.value)
					if (checkSmsCode !== true) {
						errorMsg.value = checkSmsCode
						return false
					}
				}

				if (!password.value) {
					errorMsg.value = L['请输入密码']
					return false
				}
				if (!confirm_password.value) {
					errorMsg.value = L['请再次输入密码']
					return false
				}

				if (password.value != confirm_password.value) {
					errorMsg.value = L['请输入一致的密码']
					return false
				}

				//验证新密码是否符合规则
				let checkPwd = proxy.$checkPwd(password.value)
				if (checkPwd !== true) {
					errorMsg.value = checkPwd
					return false
				}

				//设置登录密码
				url = 'v3/supplier/channel/userPassword/addLoginPwd'
				param.userMobile = memberInfo.data.userMobile
				param.verifyCode = sms_code.value
				param.loginPwd = proxy.$base64Encrypt(password.value)
			}
			proxy.$post(url, param).then(res => {
				if (res.state == 200) {
					ElMessage.success(res.msg)
					if (!memberInfo.data.hasLoginPassword) {
						memberInfo.data.hasLoginPassword = 1
						store.commit('updateMemberInfo', memberInfo.data)
					}
					errorMsg.value = ''
					password.value = ''
					confirm_password.value = ''
					old_password.value = ''
				} else {
					errorMsg.value = res.msg
				}

				//清除验证码倒计时
				isSmsClick.value = false
				clearTimeout(timeOutId.value)
				countDownM.value = 0
				timeOutId.value = null
			})
		}
		//倒计时
		const countDown = () => {
			countDownM.value--
			if (countDownM.value == 0) {
				isSmsClick.value = false
				clearTimeout(timeOutId.value)
			} else {
				timeOutId.value = setTimeout(countDown, 1000)
			}
		}

		watch([old_password, password, confirm_password], () => {
			old_password.value = old_password.value.substring(0, 20)
			password.value = password.value.substring(0, 20)
			confirm_password.value = confirm_password.value.substring(0, 20)
		})

		return {
			L,
			memberInfo,
			countDownM,
			getSmsCode,
			next,
			password,
			old_password,
			confirm_password,
			sms_code,
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
	   margin: 10px 0;
       width: 280px;
	}
	:deep(.is-focus){
		box-shadow: 0 0 0 1px var(--color_main) inset;
	}
}
.sld_login_password_mange {
	width: 1007px;
	float: left;
	margin-left: 10px;

	.container {
		background-color: white;
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #eaeaea;
		padding: 25px 40px;

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

		.title {
			font-size: 18px;
			border-bottom: 1px dashed #eaeaea;
			padding-bottom: 25px;
			font-weight: 600;
			margin-bottom: 20px;
		}

		.mange_con {
			width: 360px;
			margin: 62px auto 0;

			.current {
				line-height: 56px;
				font-size: 14px;
				color: #000000;
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

			.without_phone_tip {
				line-height: 56px;
				font-size: 16px;
				color: var(--color_main);
			}

			.sms_code_con {
				width: 100%;

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
			}
		}
	}
}
</style>
