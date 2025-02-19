<template>
  <div class="sld_login">
    <div class="sld_login_header">
      <div class="content">
        <router-link tag="a" class="l_logo" :to="`/index`">
          <img class="img" :src="configInfo.supplier_main_site_logo" alt />
        </router-link>
        <div class="r_register_wrap">
          {{ L['想起密码？'] }}
          <a href="javascript:void(0)" class="go_register_btn" @click="goToPage('/login')">
            {{ L['去登录'] }}
          </a>
        </div>
      </div>
    </div>
    <div class="sld_login_content">
      <img class="bg" :src="configInfo.supplier_main_user_forget_password_bg" alt />
      <div class="login">
        <div class="login_box">
          <div class="top">
            <div class="item1">{{ L['找回密码'] }}</div>
          </div>
          <div class="center">
            <div class="item account">
              <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconshouji2"></span>
              <input type="number" v-model="name" :placeholder="L['请输入手机号']" class="input" />
              <div data-type="userName" class="cancel" @click="clearInputVal('name')">
                <span style="color: #bbb;" class=" iconfont iconcuowu"></span>
              </div>
            </div>

            <div class="item password">
              <span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
              <input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
              <img :src="showCodeImg" class="img_code" @click="getImgCode" />
            </div>

            <div class="item password">
              <span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
              <input type="number" v-model="smsCode" :placeholder="L['请输入验证码']" class="input" />
              <a href="javascript:void(0);" class="send_code" @click="getSmsCode">{{
          countDownM ? countDownM + L['s后获取'] : L['获取验证码']
        }}</a>
            </div>
            <div class="item password">
              <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconmima1"></span>
              <input :type="showPwdFlag ? 'text' : 'password'" v-model="password" :placeholder="L['请输入6～20位英文、数字、符号']"
                class="input" />
              <div class="cancel" @click="isShowPwd">
                <span :style="{
          color: '#bbb',
          fontSize: showPwdFlag ? '20px' : '16px'
        }" :class="{
          iconfont: true,
          'iconbukejian11': !showPwdFlag,
          'iconkejian': showPwdFlag,
          show_pwd: showPwdFlag
        }"></span>
              </div>
            </div>
            <div class="error">
              <span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
              {{ errorMsg }}
            </div>
            <a href="javascript:void(0)" @click="login" class="login_btn">{{
          L['找回密码']
              }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useImageCode } from '../../../utils/hooks'
export default {
  name: 'ForgetPassword',
  setup () {
    const name = ref('') //用户名
    const store = useStore()
    const errorMsg = ref() //错误提示
    const password = ref('') //密码
    const smsCode = ref('') //短信验证码
    const showPwdFlag = ref(false) //密码是否明文显示，默认密文
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const clickSmscode = ref(false) //是否获取验证码中
    const countDownM = ref(0) //短信验证码倒计时
    const timeOutId = ref('') //定时器的返回值
    const configInfo = ref(store.state.configInfo)
    const defaultImg = ref(
      'this.src="' + require('../../../assets/common_top_logo.png') + '"'
    )
    const defaultBgImg = ref(
      'this.src="' + require('../../../assets/forget_pwd_bg.png') + '"'
    )

    const { showCodeImg, imgCode, imgCodeKey, getImgCode } = useImageCode()


    const login = () => {
      let param = {}
      param.userMobile = name.value
      param.loginPwd = password.value
      param.verifyCode = smsCode.value

      //手机号验证
      if (!param.userMobile) {
        errorMsg.value = L['请输入手机号']
        return false
      } else {
        let checkMobile = proxy.$checkPhone(param.userMobile)
        if (checkMobile !== true) {
          errorMsg.value = checkMobile
          return false
        }
      }
      let checkImgCode = proxy.$checkImgCode(imgCode.value)
      if (checkImgCode !== true) {
        errorMsg.value = checkImgCode
        return false
      }

      //验证码校验
      if (!param.verifyCode) {
        errorMsg.value = L['请输入短信验证码']
        return false
      } else {
        let checkSmsCode = proxy.$checkSmsCode(param.verifyCode)
        if (checkSmsCode !== true) {
          errorMsg.value = checkSmsCode
          return false
        }
      }

      //密码校验
      if (!param.loginPwd) {
        errorMsg.value = L['请输入密码']
        return false
      } else {
        let checkPwd = proxy.$checkPwd(param.loginPwd)
        if (checkPwd !== true) {
          errorMsg.value = checkPwd
          return false
        }
      }
      param.loginPwd = proxy.$base64Encrypt(param.loginPwd)
      param.graphicVerifyCode = imgCode.value
      param.verifyKey = imgCodeKey.value

      proxy
        .$post('v3/supplier/channel/userPassword/resetLoginPwd', param)
        .then(res => {
          if (res.state == 200) {
            //成功提示，并返回到登录页面
            ElMessage.success(res.msg)
            setTimeout(() => {
              router.back()
            }, 500)
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
    //密码是否显示
    const isShowPwd = () => {
      showPwdFlag.value = !showPwdFlag.value
    }

    watch([name, smsCode, password, imgCode], (nv) => {
      password.value = password.value.substring(0, 20)
      smsCode.value = smsCode.value.substring(0, 6)
    //   name.value = name.value.substring(0, 11)

      if (nv.some(val => val !== '')) {
        errorMsg.value = ''
      }

    })

    //获取短信验证码
    const getSmsCode = () => {
      if (clickSmscode.value) {
        return
      } else if (countDownM.value) {
        return
      }
      clickSmscode.value = true
      let checkMobile = proxy.$checkMobile(name.value)
      let checkImgCode = proxy.$checkImgCode(imgCode.value)
      if (checkMobile !== true) {
        errorMsg.value = checkMobile
        clickSmscode.value = false
      } else if (checkImgCode !== true) {
        errorMsg.value = checkImgCode
        clickSmscode.value = false
      } else {
        let param = {}
        param.mobile = name.value
        param.type = 'free'
        param.verifyCode = imgCode.value
        param.verifyKey = imgCodeKey.value
        proxy.$get('v3/msg/front/commons/smsCode', param).then(res => {
          if (res.state == 200) {
            errorMsg.value = ''
            countDownM.value = 60
            countDown()
            clickSmscode.value = false
          } else {
            //提示错误
            errorMsg.value = res.msg
            clickSmscode.value = false
            getImgCode()
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
    onMounted(() => {
      document.body.classList.remove('el-popup-parent--hidden')
    })
    return {
      L,
      showPwdFlag,
      login,
      name,
      password,
      clearInputVal,
      errorMsg,
      isShowPwd,
      getSmsCode,
      clickSmscode,
      countDownM,
      smsCode,
      goToPage,
      configInfo,
      defaultImg,
      defaultBgImg,
      showCodeImg, imgCode, imgCodeKey, getImgCode
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/forgetPassword.scss';

input[type='number'] {
  -moz-appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
