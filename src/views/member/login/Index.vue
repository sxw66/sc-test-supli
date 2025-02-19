<template>
	<div class="sld_login">
		<TopChangeLanguage />
		<div class="sld_login_header">
			<div class="content">
				<!-- <router-link tag="a" class="l_logo" :to="`/index`">
					<img class="img" :src="configInfo.supplier_main_site_logo" alt />
				</router-link> -->
				<div class="r_register_wrap">
					{{ L['还没注册？'] }}
					<a class="go_register_btn" href="javascript:void(0)" @click="goToPage('/register')">{{ L['去注册']
					}}</a>
				</div>
			</div>
		</div>
		<div class="sld_login_content">
			<img class="bg" :src="configInfo.supplier_main_user_logon_bg" alt />
			<div class="login">
				<div class="login_box">
					<div class="qrLogin" @click="changeQrlog" v-if="appEnable == 1">
						<div class="make_shadow">
							<dynaIcon class="qrLeft" :src="QRcodeLogin ? idCode : qrCode" width="30" height="30" color="--color_main">
							</dynaIcon>
						</div>
					</div>
					<template v-if="!QRcodeLogin">
						<div class="top">
							<!-- <div :class="{ item: true, active: loginType == 1 }" @click="changeLoginType(1)">
								{{ L['账号登录'] }}
							</div> -->
							<div :class="{ item: true, active: loginType == 2 }" @click="changeLoginType(2)">
								{{ L['手机登录'] }}
							</div>
                            <div :class="{ item: true, active: loginType == 3 }" @click="changeLoginType(3)">
                                {{ L['邮箱登录'] }}
                            </div>
						</div>
						<div class="center">
							<template v-if="loginType == 1">
								<div class="item account">
									<span style="color: #BBB;font-size: 19px;padding-top: 7px" class="icon iconfont iconwode"></span>
									<input type="text" v-model="name" :placeholder="L['请输入账号/手机号']" class="input" autocomplete="off" />
									<div data-type="userName" class="cancel" @click="clearInputVal('name')">
										<span style="color: #bbb;" class="iconfont iconcuowu"></span>
									</div>
								</div>
								<div class="item password">
									<span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconmima1"></span>
									<input type="password" v-model="password" :placeholder="L['请输入密码']" class="input"
										autocomplete="new-password" />
									<div data-type="password" class="cancel" @click="clearInputVal('password')">
										<span style="color: #bbb" class="iconfont iconcuowu"></span>
									</div>
								</div>
								<div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
									<input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
									<img :src="showCodeImg" class="img_code" @click="getImgCode" />
								</div>
							</template>
							<!-- 手机登录 -->
							<template v-if="loginType == 2">
								<div class="item account">
									<!-- <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconshouji2"></span> -->
                                    <el-select class="voice_select" 
									    v-model="code"
                                        @change="change" :placeholder="L['请选择']" 
										size="large"
									>
                                        <el-option  v-for="(item, index) in codelist.data" :key="index" :value="item.countryTelCode">{{
                                            item.codeText
                                        }}</el-option>
                                    </el-select>
									<input type="text" v-model="phone" :placeholder="L['请输入手机号']" class="input" autocomplete="off"  style="width:200px;padding:0 40px 0 10px" />
									<div data-type="userName" class="cancel" @click="clearInputVal('name')">
									</div>
								</div>

								<div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconmima1"></span>
									<input type="password" v-model="phonePassword" :placeholder="L['请输入密码']" class="input" />
									<!-- <img :src="showCodeImg" class="img_code" @click="getImgCode" /> -->
								</div>

								<div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
									<input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
									<img :src="showCodeImg" class="img_code" @click="getImgCode" />
								</div>
								<!-- <div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
									<input type="text" v-model="password" :placeholder="L['请输入验证码']" class="input" autocomplete="off" />
									<a href="javascript:void(0);" class="send_code" @click="getSmsCode">{{
										countDownM ? countDownM + L['s后获取'] : L['获取验证码']
									}}</a>
								</div> -->
							</template>
							<!-- 邮箱登录 -->
                            <template v-if="loginType == 3">
                                <div class="item account">
                                <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconshouji2"></span>
                                <input type="text" v-model="email" :placeholder="L['请输入邮箱']" class="input" autocomplete="off" />
									<div data-type="userName" class="cancel" @click="clearInputVal('name')">
										<span style="color: #bbb;" class="iconfont icon-cuowu"></span>
									</div>
                                </div>
                                <div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconmima1"></span>
									<input type="password" v-model="emailPassword" :placeholder="L['请输入密码']" class="input" />
									<!-- <img :src="showCodeImg" class="img_code" @click="getImgCode" /> -->
								</div>
                                <div class="item password">
									<span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
									<input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
									<img :src="showCodeImg" class="img_code" @click="getImgCode" />
								</div>
                                <!-- <div class="item password">
                                <span style="color: #BBB;font-size: 18px;padding-top: 8px"
                                    class="icon iconfont iconyanzhengma2"></span>
                                <input type="text" v-model="password" :placeholder="L['请输入验证码']" class="input" autocomplete="off" />
                                <a href="javascript:void(0);" class="send_code" @click="getSmsCode">{{
                                    countDownM ? countDownM + L['s后获取'] : L['获取验证码']
                                }}</a>
                                </div> -->
                            </template>
							<div class="error">
								<span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
								{{ errorMsg }}
							</div>
							<a href="javascript:void(0)" @click="login" class="login_btn">{{
								L['登录']
							}}</a>
						</div>
					</template>
					<template v-else>
						<div class="qrMain">
							<div class="qrMain_code">
								<div class="qrMain_code_bg" :style="`filter:blur(${QRout ? '1px' : '0'
										});background-image:url(${QRlogShow});background-size:112% 112%;background-position:center;`
										"></div>
								<div v-if="QRout" class="qrMain_code_cover">
									<p>{{ L['二维码已失效'] }}</p>
									<div @click="reCreateQRcode">{{ L['点击刷新'] }}</div>
								</div>
								<div v-else-if="QRsuccess" class="qrMain_code_cover">
									<p class="qrMain_code_cover_p">{{ L['登录成功'] }}</p>
								</div>
							</div>
							<p class="qrMain_title">{{ L['打开手机商城App，扫描二维码'] }}</p>
							<div class="qrMain_tips">
								<div class="qrMain_tips_item">
									<span style="color:#999999;font-size:16px;" class="icon iconfont iconzhuce-mianshuru"></span>
									<span>{{ L['免输入'] }}</span>
								</div>
								<div class="qrMain_tips_item">
									<span style="color:#999999;font-size:16px;" class="icon iconfont icongenganquan"></span>
									<span>{{ L['反应快'] }}</span>
								</div>
								<div class="qrMain_tips_item">
									<span style="color:#999999;font-size:16px;" class="icon iconfont icona-kuaijin1"></span>
									<span>{{ L['更安全'] }}</span>
								</div>
							</div>
						</div>
					</template>
					<div :class="{
						bottom: true,
						flex_row_between_center: wxEnable == 1,
						flex_row_end_center: wxEnable != 1
					}">
						<!-- <img src="../../../assets/wechat_login.png" alt="" @click="wetChatLogin" v-if="wxEnable == 1" /> -->
						<span></span>
						<div style="display: flex;">
							<!-- <a href="javascript:void(0)" @click="goToPage('/register')">{{
								L['立即注册']
							}}</a> -->
							<!-- <router-link tag="a" :to="`/pwd/forget`">{{
								L['忘记密码']
							}}</router-link> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { useRouter, onBeforeRouteLeave, useRoute } from 'vue-router'
import { ref, getCurrentInstance, onMounted, watch,reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useImageCode } from '@/utils/hooks'
import TopChangeLanguage from '../../../components/TopChangeLanguage'
// Importing images
import qrCode from '../../../assets/qrcode_img.png'
import qrLogin from '../../../assets/qrLogin.png'
import idCode from '../../../assets/computer.png'
import idLogin from '../../../assets/idLogin.png'

export default {
	name: 'LoginIndex',
	components: {
		TopChangeLanguage
	},
	setup () {
		const store = useStore()
		const router = useRouter()
		const route = useRoute()
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const keyEnter = ref(true)
		const errorMsg = ref() //错误提示
		const name = ref('') //用户名
		const phone = ref('') //手机号
		const email = ref('') //邮箱
		const password = ref('') //密码
		const phonePassword = ref('') //密码
		const emailPassword = ref('') //密码
        const code = ref('+55') //区号
		const loginType = ref(2) //登陆类型：1-账号密码登陆，2-手机验证码登陆
		const clickSmscode = ref(false) //是否获取验证码中
		const countDownM = ref(0) //短信验证码倒计时
		const timeOutId = ref('') //定时器的返回值
		const configInfo = ref(store.state.configInfo)
		const fromurl = ref('')
		const wxEnable = ref('')
		const pcAppid = ref('')
		const appEnable = ref(0)
		/* 二维码登录 */
		const QRlogShow = ref('')
		const QRissend = ref(null) //二维码登录定时器
		const QRcheck = ref(null) //二维码循环定时器
		const QRsuccess = ref(false) //二维码登录成功
		const QRout = ref(false) //二维码是否过期
		const QRcodeLogin = ref(false) //二维码登录
		// const qrCode = require('../../../assets/qrcode_img.png');
		// const qrLogin = require('../../../assets/qrLogin.png');
		// const idCode = require('../../../assets/computer.png');
		// const idLogin = require('../../../assets/idLogin.png');
		/* 二维码登录 */

        const codelist = reactive({data: [
            {
                countryTelCode:"+55",
                codeText:"巴西(+55)",
                countryLanguageTag:"pt",
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
		const { showCodeImg, imgCode, imgCodeKey, getImgCode } = useImageCode()

		//由于这里的回车键触发事件和商品搜索框的回车键触发事件冲突，引入keyEnter变量判断
		document.onkeydown = function () {
			var key = window.event.keyCode
			if (key == 13 && keyEnter.value) {
				login()
			}
		}
		const login = () => {
			let param = {}
			param.username = name.value
			param.password = password.value
			if (loginType.value == 2) {
				param.username = `${code.value}${phone.value}`
				param.password = phonePassword.value

			} else if (loginType.value == 3) {
				param.username = email.value
				param.password = emailPassword.value
			}
			param.loginType = loginType.value
			param.phone = phone.value
			param.phonePassword = phonePassword.value
			param.email = email.value
			param.emailPassword = emailPassword.value
			param.source = 1

			
			// let param = {}
			// param.username = name.value
			// param.password = password.value
			// param.loginType = loginType.value
			// param.phone = phone.value
			// param.phonePassword = phonePassword.value
			// param.email = email.value
			// param.emailPassword = emailPassword.value
			// param.source = 1
			if (param.loginType == 1) {
				//账号、手机号的验证
				if (!param.username) {
					errorMsg.value = L['请输入账号/手机号/邮箱']
					return false
				}

				//密码校验
				if (!param.password) {
					errorMsg.value = L['请输入密码']
					return false
				} else {
					let checkPwd = proxy.$checkPwd(param.password)
					if (checkPwd !== true) {
						errorMsg.value = checkPwd
						return false
					}
				}
				param.password = proxy.$base64Encrypt(param.password)
				let checkImgCode = proxy.$checkImgCode(imgCode.value)
				if (checkImgCode !== true) {
					errorMsg.value = checkImgCode
					return
				}


			} else if(param.loginType == 2) {
                if (!code.value) {
                    errorMsg.value = L['请选择区号']
                    return
                }
				//手机号验证
				if (!param.phone) {
					errorMsg.value = L['请输入手机号']
					return false
				} 
				else {
					let checkMobile = proxy.$checkPhone(param.phone)
					if (checkMobile !== true) {
						errorMsg.value = checkMobile
						return false
					}
				}
				param.password = proxy.$base64Encrypt(param.password)
			}else {
                if (!param.email) {
					errorMsg.value = L['请输入邮箱']
					return false
                } 
				// else {
                //     let checkEmail = proxy.$checkEmail(param.username)
                //     if (checkEmail !== true) {
                //         errorMsg.value = checkEmail
                //         return false
                //     }
                //     }
                //     let checkImgCode = proxy.$checkImgCode(imgCode.value)
                //     if (checkImgCode !== true) {
                //         errorMsg.value = checkImgCode
                //         return
                //     }
                //     //验证码校验
                //     if (!param.password) {
                //     errorMsg.value = L['请输入邮箱验证码']
                //     return false
                //     } else {
                //     let checkSmsCode = proxy.$checkSmsCode(param.password)
                //     if (checkSmsCode !== true) {
                //         errorMsg.value = checkSmsCode
                //         return false
                //     }
                // }
				param.password = proxy.$base64Encrypt(param.password)
            }

			param.verifyCode = imgCode.value
			param.verifyKey = imgCodeKey.value

			proxy.$post('v3/channelLogin/oauth/token', param, {
				headers: {
					'Content-Type': 'application/json',
				}
			}).then(res => {
				if (res.state == 200) {
					//将用户信息存缓存，并跳转到首页
                    store.commit('loginUpdate', {
						access_token: res.data.access_token,
						refresh_token: res.data.refresh_token
					})
					//获取用户信息，并同步信息到vuex
					proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
						if (res.state == 200) {
							store.commit('updateMemberInfo', res.data)
							
							if (window.history.state.back) {
								router.back()
							} else {
								router.replace({ path: '/member/index' })
							}
						}
					})
				} else {
					//提示错误
					errorMsg.value = res.msg
					getImgCode()
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
		//登录方式切换
		const changeLoginType = type => {
			loginType.value = type
			name.value = ''
			password.value = ''
			errorMsg.value = ''
			imgCode.value = ''
			getImgCode()
		}
		//获取短信验证码
		const getSmsCode = () => {
			if (clickSmscode.value) {
				return
			} else if (countDownM.value) {
				return false
			}
			clickSmscode.value = true
            if (loginType.value == 2 && !code.value) {
                errorMsg.value = L['请选择区号']
                clickSmscode.value = false
                return
            }
			
            if (proxy.$checkImgCode(imgCode.value) !== true) {
				errorMsg.value = proxy.$checkImgCode(imgCode.value)
				clickSmscode.value = false
			} else {
				let param = {}
                if(loginType.value == 2){
                    param.preCode = code.value;
                    param.mobile = name.value;
					param.type = 'free';
                }else{
                    param.email = name.value;
                }
                param.verifyCode = imgCode.value
				param.verifyKey = imgCodeKey.value
				proxy.$get(loginType.value == 2?'v3/supplier/channel/commons/smsCode':'v3/channelLogin/oauth/getCaptcha').then(res => {
					if (res.state == 200) {
						countDownM.value = 60
						countDown()
						clickSmscode.value = false
					} else {
						//提示错误
						errorMsg.value = res.msg
						clickSmscode.value = false
					}
				})
			}
		}
		//倒计时
		const countDown = () => {
			countDownM.value--
			if (countDownM.value == 0) {
				clearTimeout(timeOutId.value)
			} else {
				timeOutId.value = setTimeout(countDown, 1000)
			}
		}
		//通过replace方式跳转页面
		const goToPage = type => {
			router.replace({
				path: type
			})
		}

		// 微信二维码登录
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
					names: 'login_wx_pc_is_enable,login_wx_pc_appid,use_model_app'
				})
				.then(res => {
					if (res.state == 200) {
						wxEnable.value = res.data[0]
						pcAppid.value = res.data[1]
						appEnable.value = res.data[2]
					}
				})
		}

		// 切换账号密码/二维码登录
		const changeQrlog = () => {
			QRcodeLogin.value = !QRcodeLogin.value
			if (QRcodeLogin.value && !QRissend.value) {
				createQRcode()
			}
		}

		// 刷新二维码
		const reCreateQRcode = () => {
			setTimeout(() => {
				QRout.value = false
				createQRcode()
			}, 200)
		}

		// 生成二维码 (过期定时器、获取扫码状态定时器)
		const createQRcode = () => {
			proxy.$get('v3/member/front/qr/login/createQr').then(res => {
				/* 二维码图片 */
				QRlogShow.value = 'data:image/png;base64,' + res.data.image
				/* 过期定时器 */
				QRissend.value = setTimeout(() => {
					console.log('-----二维码过期-----')
					clearTimeout(QRissend.value)
					clearInterval(QRcheck.value)
					QRissend.value = null
					QRcheck.value = null
					QRout.value = true
				}, 300000)
				/* ------ end ------ */

				let param = {
					u: res.data.u
				}
				/* 获取扫码状态定时器 */
				QRcheck.value = setInterval(() => {
					proxy
						.$post('v3/member/front/qr/login/progress', param)
						.then(result => {
							if (result.data.progress == 2) {
								console.log('-----授权登录成功-----')
								QRsuccess.value = true
								clearTimeout(QRissend.value)
								clearInterval(QRcheck.value)
								QRissend.value = null
								QRcheck.value = true

								localStorage.setItem('refresh_token', result.data.refreshToken)
								/* 更新 access_token */
								let params = new FormData()
								params.append('grant_type', 'refresh_token')
								params.append('refresh_token', result.data.refreshToken)
								params.append('source', 1)

								proxy.$post('v3/frontLogin/oauth/token', params, {
									headers: {
										'Content-Type': 'application/json',
									}
								}).then(
									response => {
										if (response.state == 200) {
											localStorage.setItem('access_token', response.data.access_token)
											localStorage.setItem('time', new Date().getTime().toString()) //存储refresh_token更新时间

											/* 获取用户信息，并同步信息到vuex */
											proxy.$get('v3/member/front/member/getInfo').then(res_info => {
												if (res_info.state == 200) {
													store.commit('updateMemberInfo', res_info.data)
													proxy.$getLoginCartListData() //更新购物车数据
													if (window.history.state.back) {
														router.back()
													} else {
														router.replace({ path: '/member/index' })
													}
												}
											})
											/* ------ end ------ */
										}
									},
									err => {
										console.log('更新access_token出错：', err)
									}
								)
								/* ------ end ------ */
							}
						})
				}, 3000)
				/* ------ end ------ */
			})
		}

		watch([name, password, imgCode], () => {
			if (loginType.value == 1) {
				password.value = password.value.substring(0, 20)
				name.value = name.value.substring(0, 20)
			} else if(loginType.value == 2){
				password.value = password.value.substring(0, 6)
				name.value = name.value.substring(0, 11)
			}else{
                password.value = password.value.substring(0, 6)
            }

			if (password.value || name.value || imgCode.value) {
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

			if (route.query.error) {
				ElMessage.error(decodeURIComponent(route.query.error))
			}
		})

		onBeforeRouteLeave(() => {
			keyEnter.value = false
		})

		return {
			L,
			loginType,
			login,
			name,
			phone,
			email,
			password,
			phonePassword,
			emailPassword,
			clearInputVal,
			errorMsg,
			changeLoginType,
			getSmsCode,
			clickSmscode,
			countDownM,
			goToPage,
			configInfo,
			wetChatLogin,
			wxEnable,
			QRcodeLogin,
			QRissend,
			QRout,
			qrCode,
			qrLogin,
			idCode,
			idLogin,
			changeQrlog,
			reCreateQRcode,
			createQRcode,
			QRlogShow,
			QRcheck,
			QRsuccess,
			appEnable,
			showCodeImg, imgCode, imgCodeKey, getImgCode,codelist,code
		}
	}
}
</script>
<style lang="scss" scoped>
@import '../../../style/login.scss';
.voice_select{
  ::v-deep(.el-input__inner){
      color: #415058 100%;
      border-color: #e8e8e8 !important;
      outline: none;
      &::placeholder{
      color: #BEBEBE;
    }
  }
}
.make_shadow {
	box-shadow: 2px 2px 10px #eee inset;
	width: 45px;
	height: 45px;
	position: relative;
	padding-top: 6px;
	padding-left: 6px;
	cursor: pointer;

	&:after {
		content: "";
		border: 22px solid #fff;
		border-top: 22px solid transparent;
		border-left: 22px solid transparent;
		position: absolute;
		right: 0;
		bottom: 0;
	}
}
</style>
