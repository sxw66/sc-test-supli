<template>
	<div class="sld_login">
		<TopChangeLanguage />
		<div class="sld_login_header">
			<div class="content">
				<!-- <router-link tag="a" class="l_logo" :to="`/index`">
					<img class="img" :src="configInfo.supplier_main_site_logo" alt />
				</router-link> -->
				<div class="r_register_wrap">
					{{ L['已有账号？'] }}
					<a href="javascript:void(0)" class="go_register_btn" @click="goToPage('/login')">
						{{ L['去登录'] }}
					</a>
				</div>
			</div>
		</div>
		<div class="sld_login_content">
			<img class="bg" :src="configInfo.supplier_main_user_logon_bg" alt />
			<div class="login">
				<div class="login_box">
                    <div class="top">
                        <!-- <div :class="{ item: true, active: loginType == 1 }" @click="changeLoginType(1)">
                            {{ L['邮箱注册'] }}
                        </div> -->
                        <div :class="{ item: true, active: loginType == 2 }" @click="changeLoginType(2)">
                            {{ L['创建账号'] }}
                        </div>
                    </div>
					<!-- 创建账号 -->
					<div class="center" v-if="loginType == 2">
						<div class="item password">
							<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconshouji2"></span>
							<input type="text" v-model="name" :placeholder="L['请输入您的称呼（3至20个字符）']" class="input" />
						</div>
						<!-- 图形验证码 -->
						<!-- <div class="item password">
							<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
							<input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
							<img :src="showCodeImg" class="img_code" @click="getImgCode" />
						</div> -->
						<!-- 手机号 -->
						<div class="item account">
                            <el-select class="voice_select" v-model="code"
                            @change="change" :placeholder="L['请选择']" v-if="codelist.data.length">
                            <el-option  v-for="(item, index) in codelist.data" :key="index" :value="item.countryTelCode">{{
                                item.codeText
                            }}</el-option>
                            </el-select>
							<input type="text" v-model="phone" :placeholder="L['请输入手机号']" maxlength="11" class="input" style="width:200px;padding:0 40px 0 10px" />			
						</div>
						<!-- 手机验证码 -->
						<div class="item password">
							<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
							<input type="text" v-model="phoneCode" :placeholder="L['请输入手机验证码']" maxlength="6" class="input" />
							<a href="javascript:void(0);" class="send_code" @click="getSmsCode">{{
								countM ? countM + L['s后获取'] : L['获取验证码']
							}}</a>
						</div>
						<!-- 邮箱 -->
                        <div class="item account">
							<span
								style="color: #BBB;font-size: 21px;padding-top: 7px"
								class="icon iconfont iconshouji2"
							></span>
							<input
								type="text"
								v-model="email"
								:placeholder="L['请输入邮箱']"
								class="input"
							/>
							<div
								data-type="name"
								class="cancel"
								@click="clearInputVal('name')"
							>
								<span style="color: #bbb;" class=" iconfont icon-cuowu"></span>
							</div>
                        </div>

                        <div class="item password">
							<span
								style="color: #BBB;font-size: 18px;padding-top: 8px"
								class="icon iconfont iconyanzhengma2"
							></span>
							<input
								type="text"
								v-model="emailCode"
								:placeholder="L['请输入邮箱验证码']"
								class="input"
								maxlength="6"
							/>
							<a
								href="javascript:void(0);"
								class="send_code"
								@click="getEmailCode"
								>{{
								countE ? countE + L['s后获取'] : L['获取验证码']
								}}</a
							>
                        </div>
                        <div class="item password">
							<span
								style="color: #BBB;font-size: 18px;padding-top: 8px"
								class="icon iconfont iconmima1"
							></span>
							<input
								type="password"
								v-model="password"
								:placeholder="L['请输入密码']"
								class="input password"
							/>
                        </div>
                        <div class="item password">
							<span
								style="color: #BBB;font-size: 18px;padding-top: 8px"
								class="icon iconfont iconmima1"
							></span>
							<input
								type="password"
								v-model="confirmPassword"
								:placeholder="L['请再次输入密码']"
								class="input password"
							/>
                        </div>
						<div class="error">
							<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
							{{ errorMsg }}
						</div>
						<a href="javascript:void(0)" @click="login" class="login_btn">{{
							L['立即注册']
						}}</a>
					</div>
                    <div class="center" v-if="loginType == 1">
                        <div class="item account">
							<span
								style="color: #BBB;font-size: 21px;padding-top: 7px"
								class="icon iconfont iconshouji2"
							></span>
							<input
								type="text"
								v-model="name"
								:placeholder="L['请输入邮箱']"
								class="input"
							/>
                        <div
                            data-type="name"
                            class="cancel"
                            @click="clearInputVal('name')"
                        >
                            <span style="color: #bbb;" class=" iconfont icon-cuowu"></span>
                        </div>
                        </div>
                        <div class="item password">
                        <span
                            style="color: #BBB;font-size: 18px;padding-top: 8px"
                            class="icon iconfont iconyanzhengma2"
                        ></span>
                        <input
                            type="text"
                            v-model="imgCode"
                            :placeholder="L['请输入图形验证码']"
                            class="input"
                        />
                        <img :src="showCodeImg" class="img_code" @click="getImgCode" />
                        </div>
                        <div class="item password">
                        <span
                            style="color: #BBB;font-size: 18px;padding-top: 8px"
                            class="icon iconfont iconyanzhengma2"
                        ></span>
                        <input
                            type="text"
                            v-model="password"
                            :placeholder="L['请输入验证码']"
                            class="input"
                        />
                        <a
                            href="javascript:void(0);"
                            class="send_code"
                            @click="getSmsCode"
                            >{{
                            countM ? countM + L['s后获取'] : L['获取验证码']
                            }}</a
                        >
                        </div>
                        <div class="error">
                        <span
                            v-if="errorMsg"
                            style="color: #e1251b;font-size: 14px"
                            class="iconfont icon-jubao"
                        ></span>
                        {{ errorMsg }}
                        </div>
                        <a href="javascript:void(0)" @click="login" class="login_btn">{{
                        L['立即注册']
                        }}</a>
                    </div>
					<div :class="{
						bottom: true,
						flex_row_between_center: wxEnable == 1,
						flex_row_end_center: wxEnable != 1
					}">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { ref, getCurrentInstance, onMounted, watch ,reactive, onUnmounted} from 'vue'
import { useStore } from 'vuex'
import {
  ElMessage
} from "element-plus";
import TopChangeLanguage from '../../../components/TopChangeLanguage'

export default {
	name: 'Register',
	components: {
		TopChangeLanguage
	},
	setup () {
		const store = useStore()
		const route = useRoute()
		const agreeFlag = ref(false) //同意注册协议标识，默认不同意
		const name = ref('') //用户名
		const phone = ref('') //手机号
		const email = ref('') //邮箱
		const errorMsg = ref() //错误提示
		const phoneCode = ref('') //手机验证码
		const emailCode = ref('') //邮箱验证码
		const password = ref('') //密码
		const confirmPassword = ref('') //确认密码
		const imgCode = ref('') //图形验证码
		const router = useRouter()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const countM = ref(0) //短信验证码倒计时
		const countE = ref(0) //邮箱验证码倒计时
		const timeOutId = ref(null) //定时器的返回值
		const timerEmail = ref(null);
		const showCodeImg = ref('') //图形验证码图片
		const imgCodeKey = ref('') //图形验证码的key
		const configInfo = ref(store.state.configInfo)
		const defaultImg = ref(
			'this.src="' + require('../../../assets/common_top_logo.png') + '"'
		)
		const defaultBgImg = ref(
			'this.src="' + require('../../../assets/login_bg.png') + '"'
		)
		const preventFreM = ref(false) //禁用获取短信验证码
		const preventFreE = ref(false) //禁用获取邮箱验证码
		const wxEnable = ref('')
		const pcAppid = ref('')
		const fromurl = ref('')
        const code = ref('+55') //区号
        const loginType = ref(2) //找回方式：1-手机验证码，2-邮箱验证码

        const changeLoginType = type => {
        	loginType.value = type
			name.value = ''
			password.value = ''
			imgCode.value = ''
			errorMsg.value = ''
        }
        const codelist = reactive({data: [
            {
                countryTelCode:"+55",
                codeText:"巴西(+55)",
                countryLanguageTag:"en",
            },
            // {
            //     countryTelCode:"+86",
            //     codeText:"中国(+86)",
            //     countryLanguageTag:"zh",
            // },
            // {
            //     countryTelCode:58,
            //     codeText:"委内瑞拉(+58)",
            //     countryLanguageTag:"pt",
            // }
        ]})
        const change = (e) => {
        console.log(e)
        }
		// 微信二维码注册
		const wetChatLogin = () => {
			let href = `https://open.weixin.qq.com/connect/qrconnect?appid=${pcAppid.value
				}&redirect_uri=${encodeURIComponent(
					fromurl.value
				)}&response_type=code&scope=snsapi_login&state=2or3m#wechat_redirect`
			window.open(href, '_blank')
		}
		const getWxEnbale = () => {
			proxy
				.$get('v3/system/front/setting/getSettings', {
					names: 'login_wx_pc_is_enable,login_wx_pc_appid'
				})
				.then(res => {
					if (res.state == 200) {
						wxEnable.value = res.data[0]
						pcAppid.value = res.data[1]
					}
				})
		}
		function sleep(duration) {
			return new Promise((resolve) => {
				setTimeout(resolve, duration);
			})
		}
		const isSubmitting = ref(false);
		// 注册
		const login = () => {
			let param = {}
			
			// param.verifyCode = imgCode.value
			param.verifyKey = imgCodeKey.value
            
			param.source = 1
			if(loginType.value == 1) {
                param.email = name.value
                param.vCode = password.value
                //邮箱验证
                    if (!param.email) {
                        errorMsg.value = L['请输入邮箱']
                        return false
                    } else {
                        let checkEmail = proxy.$checkEmail(param.email)
                        if (checkEmail !== true) {
                            errorMsg.value = checkEmail
                            return false
                        }
                    }
                    //验证码校验
                    if (!param.vCode) {
                        errorMsg.value = L['请输入邮箱验证码']
                        return false
                    } 
                   
			} else {
				param.memberNickName = name.value
				param.phone = `${code.value}${phone.value}`
				param.phoneCode = phoneCode.value
				param.email = email.value
				param.emailCode = emailCode.value
				param.preCode = code.value
				param.loginPwd = proxy.$base64Encrypt(password.value)
				if(!param.preCode){
					errorMsg.value = L['请选择区号']
					return
				}
				//手机号校验
				if (!param.phone) {
					errorMsg.value = L['请输入手机号']
					return false
				} else {
					let checkPhone = proxy.$checkPhone(phone.value,null,code.value)
					// let checkPhone = proxy.$checkPhone(param.phone,null,code.value)
					if (checkPhone !== true) {
						errorMsg.value = checkPhone
						return false
					}
				}
				//手机验证码校验
				if (!param.phoneCode) {
					errorMsg.value = L['请输入短信验证码']
					return false
				} else {
					let checkSmsCode = proxy.$checkSmsCode(param.phoneCode)
					if (checkSmsCode !== true) {
					errorMsg.value = checkSmsCode
					return false
					}
				}
				//邮箱校验
				if (!param.email) {
					errorMsg.value = L['请输入邮箱']
					return false
				} else {
					let checkEmail = proxy.$checkEmail(param.email)
					if (checkEmail !== true) {
						errorMsg.value = checkEmail
						return false
					}
				}
				//邮箱验证码校验
				if (!param.emailCode) {
					errorMsg.value = L['请输入邮箱验证码']
					return false
				} 
				//密码校验
				if (!param.loginPwd) {
					errorMsg.value = L['请输入密码']
					return false
				} 
				// else if (!/^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,15}$/.test(param.loginPwd)) {
				// 	errorMsg.value = L['请输入6~15位密码，包含数字、字母、特殊字符中的两种']
				// 	return false
				// } else if (password.value !== confirmPassword.value) {
				// 	errorMsg.value = L['两次密码不一致']
				// 	return false
				// }
				
			}

			// if(!param.verifyCode){
			// 	errorMsg.value = L['请输入图形验证码']
			// 	return false
			// }
			if(isSubmitting.value) return;
			isSubmitting.value = true;
			proxy.$post('v3/channelLogin/oauth/register', param, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).then(async res => {
				if (res.state == 200) {
					//将用户信息存缓存，并跳转到首页
					store.commit('loginUpdate', {
						access_token: res.data.access_token,
						refresh_token: res.data.refresh_token
					})
					ElMessage.success(L["注册成功,即将跳转首页"]);
					await sleep(1000);
					//获取用户信息，并同步信息到vuex
					proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
						if (res.state == 200) {
							//清空购物车store
							store.commit('updateMemberInfo', res.data)
							isSubmitting.value = false;
							router.replace('/');
						}
					})
				} else {
					//提示错误
					// getImgCode()
					errorMsg.value = res.msg
					isSubmitting.value = false;
				}
			})
		}
		//清空输入框内容
		const clearInputVal = type => {
			if (type == 'name') {
				name.value = ''
			} else if (type == 'password') {
				password.value = ''
			}
		}

		//获取短信验证码
		const getSmsCode = () => {
			if (preventFreM.value || countM.value)  return;
			preventFreM.value = true;
			let checkImgCode = proxy.$checkImgCode(imgCode.value)
            // if (checkImgCode !== true) {
			// 	errorMsg.value = checkImgCode
			// 	preventFreM.value = false
			// } else {
				let param = {}
				param.verifyCode = imgCode.value
				param.verifyKey = imgCodeKey.value
				param.mobile = phone.value
				param.preCode = code.value
				if(!param.preCode){
					errorMsg.value = L['请选择区号']
					return
				}
				if (!param.mobile) {
					errorMsg.value = L['请输入手机号']
					return
				}
				
				proxy.$get('v3/msg/front/commons/getCaptcha', param).then(res => {
					if (res.state == 200) {
						countM.value = 60
						countDownM()
					} else {
						//提示错误
						// getImgCode()
						errorMsg.value = res.msg
						preventFreM.value = false
					}
				})
			// }
		}

		//获取邮箱验证码
		const getEmailCode = () => {
			if (preventFreE.value || countE.value) return;
			preventFreE.value = true;
			let checkImgCode = proxy.$checkImgCode(imgCode.value)
			// if (checkImgCode !== true) {
			// 	errorMsg.value = checkImgCode
			// 	preventFreE.value = false
			// } else {
				let param = {}
				param.verifyCode = imgCode.value
				param.verifyKey = imgCodeKey.value
				param.email = email.value

				if (!param.email) {
					errorMsg.value = L['请输入邮箱']
					return
				}
				if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(param.email)) {
					errorMsg.value = L['请输入正确格式的邮箱']
					return
				}
				
				proxy.$get('v3/channelLogin/oauth/getCaptcha', param).then(res => {
					if (res.state == 200) {
						countE.value = 60
						countDownE()
					} else {
						//提示错误
						// getImgCode()
						errorMsg.value = res.msg
						preventFreE.value = false
					}
				})
			// }
		}

		//短信倒计时
		const countDownM = () => {
			countM.value--
			if (countM.value == 0) {
				preventFreM.value = false
				clearTimeout(timeOutId.value)
			} else {
				timeOutId.value = setTimeout(countDownM, 1000)
			}
		}
		
		//邮箱倒计时
		const countDownE = () => {
			countE.value--
			if (countE.value == 0) {
				preventFreE.value = false
				clearTimeout(timerEmail.value)
			} else {
				timerEmail.value = setTimeout(countDownE, 1000)
			}
		}
		
		//获取图形验证码
		const getImgCode = () => {
			proxy.$get('v3/captcha/common/getCaptcha', {}).then(res => {
				if (res.state == 200) {
					showCodeImg.value = 'data:image/png;base64,' + res.data.captcha
					imgCodeKey.value = res.data.key
				}
			})
		}
		//是否同意用户注册协议
		const agree = () => {
			agreeFlag.value = !agreeFlag.value
		}

		//通过replace方式跳转页面
		const goToPage = type => {
			router.replace({
				path: type
			})
		}

		watch([name, imgCode, password], () => {
			password.value = password.value.substring(0, 20)
			imgCode.value = imgCode.value.substring(0, 4)
			// name.value = name.value.substring(0, 11)
			if (password.value || imgCode.value || name.value) {
				errorMsg.value = ''
			}
		})

		onMounted(() => {
			getWxEnbale()
			if (route.query.redirectUrl) {
				fromurl.value =
					window.location.origin + decodeURIComponent(route.query.redirectUrl)
			} else {
				fromurl.value = window.location.origin
			}

			getImgCode() //获取图形验证码
			document.body.classList.remove('el-popup-parent--hidden')
		})
		onUnmounted(() => {
			timerEmail.value && clearTimeout(timerEmail.value);
			preventFreE.value = false;
			timeOutId.value && clearTimeout(timeOutId.value);
			preventFreM.value = false;
		})
		return {
			L,
			login,
			name,
			phone,
			email,
			phoneCode,
			emailCode,
			password,
			confirmPassword,
			clearInputVal,
			errorMsg,
			getSmsCode,
			getEmailCode,
			countM,
			countE,
			imgCode,
			showCodeImg,
			imgCodeKey,
			getImgCode,
			agreeFlag,
			agree,
			goToPage,
			configInfo,
			defaultImg,
			defaultBgImg,
			wxEnable,
			pcAppid,
			fromurl,
			wetChatLogin,
			getWxEnbale,
            codelist,
            code,
            change,
            changeLoginType,
            loginType,
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../../style/register.scss';
.voice_select{
  ::v-deep(.el-input__inner){
      color: #415058;
      border-color: #e8e8e8 !important;
      outline: none;
      &::placeholder{
      color: #BEBEBE;
    }
  }
}
.el-popup-parent--hidden {
	overflow: visible;
}
</style>
