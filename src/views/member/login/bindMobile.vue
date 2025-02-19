<template>
  <div class="sld_login">
    <div class="sld_login_header">
      <div class="content">
        <router-link tag="a" class="l_logo" :to="`/index`">
          <img class="img" :src="configInfo.supplier_main_site_logo" alt />
        </router-link>
      </div>
    </div>
    <div class="sld_login_content">
      <img class="bg" :src="configInfo.supplier_main_user_logon_bg" alt />
      <div class="login">
        <div class="login_box">
          <div class="top">
            <div class="item">{{ L['绑定手机号'] }}</div>
          </div>
          <div class="center">
            <div class="item account">
              <span style="color: #BBB;font-size: 21px;padding-top: 7px" class="icon iconfont iconshouji2"></span>
              <input type="number" v-model="name" :placeholder="L['请输入手机号']" class="input" />
              <div data-type="userName" class="cancel" @click="clearInputVal('name')">
                <span style="color: #bbb;" class="iconfont iconcuowu"></span>
              </div>
            </div>

            <div class="item password">
              <span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
              <input type="text" v-model="imgCode" :placeholder="L['请输入图形验证码']" class="input" />
              <img :src="showCodeImg" class="img_code" @click="getImgCode" />
            </div>


            <div class="item password">
              <span style="color: #BBB;font-size: 18px;padding-top: 8px" class="icon iconfont iconyanzhengma2"></span>
              <input type="number" v-model="password" :placeholder="L['请输入验证码']" class="input" />
              <a href="javascript:void(0);" class="send_code" @click="getSmsCode">{{
          countDownM ? countDownM + L['s后获取'] : L['获取验证码']
        }}</a>
            </div>

            <div class="error">
              <span v-if="errorMsg" style="color: #e1251b;font-size: 14px" class="iconfont iconjubao"></span>
              {{ errorMsg }}
            </div>
            <a href="javascript:void(0)" @click="login" class="login_btn">{{
          L['绑定']
        }}</a>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="bindedVisible" lock-scroll="false" width="480px" top="10%">
      <div class="bindMsg">
        <div class="msg_title">
          <img src="../../../assets/icon_mobile.png" alt="" />
          <p>{{ name }}</p>
        </div>
        <div class="msg_content">
          {{ L['该手机号已被绑定，请更换其他手机号'] }}
        </div>
        <div class="msg_tip">
          <p>
            {{ L['继续绑定：将解除与账号'] }}{{ binded }}{{ L['的绑定关系'] }}
          </p>
          <p v-if="!route.query.u">{{ L['更新信息：授权信息将绑定到账号'] }}{{ binded }}上</p>
        </div>
        <div class="flex_row_center_center">
          <div class="go_bind_on" @click="confirmBind(2)">
            {{ L['继续绑定'] }}
          </div>
          <div class="go_bind_update" @click="confirmBind(3)" v-if="!route.query.u">
            {{ L['更新信息'] }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, getCurrentInstance, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useImageCode } from '../../../utils/hooks'

export default {
  name: 'LoginIndex',
  setup () {
    const store = useStore()
    const keyEnter = ref(true)
    const name = ref('') //用户名
    const errorMsg = ref() //错误提示
    const password = ref('') //密码
    const loginType = ref(1) //登陆类型：1-账号密码登陆，2-手机验证码登陆
    const router = useRouter()
    const route = useRoute()
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const countDownM = ref(0) //短信验证码倒计时
    const timeOutId = ref('') //定时器的返回值
    const configInfo = ref(store.state.configInfo)
    const bindedVisible = ref(false)
    const defaultImg = ref(
      'this.src="' + require('../../../assets/common_top_logo.png') + '"'
    )
    const defaultBgImg = ref(
      'this.src="' + require('../../../assets/login_bg.png') + '"'
    )

    const wxEnable = ref('')

    const { showCodeImg, imgCode, imgCodeKey, getImgCode } = useImageCode()


    //由于这里的回车键触发事件和商品搜索框的回车键触发事件冲突，引入keyEnter变量判断
    document.onkeydown = function () {
      var key = window.event.keyCode
      if (key == 13 && keyEnter.value) {
        login()
      }
    }
    const binded = ref('')
    const bindType = ref(1)
    const preventFre = ref(false)

    const login = () => {
      let param = {}
      param.mobile = name.value
      param.bindType = bindType.value
      param.smsCode = password.value
      param.resource = 1
      if (!route.query.u) {
        param.bindKey = route.query.code
      } else {
        param.u = route.query.u
      }
      param.verifyCode = imgCode.value
      param.verifyKey = imgCodeKey.value

      //手机号验证
      if (!param.mobile) {
        errorMsg.value = L['请输入手机号']
        return false
      } else {
        let checkMobile = proxy.$checkPhone(param.mobile)
        if (checkMobile !== true) {
          errorMsg.value = checkMobile
          return false
        }
      }

      let checkImgCode = proxy.$checkImgCode(imgCode.value);
      if (checkImgCode !== true) {
        errorMsg.value = checkImgCode;
        return false;
      }

      //验证码校验
      if (!param.smsCode) {
        errorMsg.value = L['请输入短信验证码']
        return false
      } else {
        let checkSmsCode = proxy.$checkSmsCode(param.smsCode)
        if (checkSmsCode !== true) {
          errorMsg.value = checkSmsCode
          return false
        }
      }
      //如果未登录vuex中有进货单数据，需同步到该用户
      let cartInfo = []
      let cartListData = store.state.cartListData
      if (JSON.stringify(cartListData) != '{}') {
        cartListData.storeCartGroupList.map(cartListItem => {
          cartListItem.promotionCartGroupList.map(promotItem => {
            promotItem.cartList.map(cartItem => {
              cartInfo.push({
                productId: cartItem.productId,
                buyNum: cartItem.buyNum
              })
            })
          })
        })
        param.cartInfo = JSON.stringify(cartInfo)
      }
      let url = ''
      if (!route.query.u) {
        url = 'v3/supplier/channel/login/wechat/bindMobile'
      } else {
        url = 'v3/supplier/channel/login/wechat/bindMobile2'
      }
      proxy
        .$post(url, param)
        .then(res => {
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
                proxy.$getLoginCartListData() //更新进货单数据
                proxy.$sldStatEvent({ behaviorType: 'reg' })
                ElMessage.success(res.msg)
                setTimeout(() => {
                  router.replace({ path: '/member/index' })
                }, 1000)
              }
            })
          } else if (res.state == 267) {
            binded.value = res.data
            bindedVisible.value = true
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

    watch([name, password, imgCode], () => {
    //   name.value = name.value.toString().substring(0, 11)
      password.value = password.value.toString().substring(0, 6)
      if (name.value || password.value || imgCode.value) {
        errorMsg.value = ''
      }
    })

    const confirmBind = type => {
      bindType.value = type
      login()
    }

    //获取短信验证码
    const getSmsCode = () => {
      if (preventFre.value) {
        return
      } else if (countDownM.value) {
        return
      }
      preventFre.value = true
      let checkMobile = proxy.$checkPhone(name.value)
      let checkImgCode = proxy.$checkImgCode(imgCode.value)
      if (checkMobile !== true) {
        errorMsg.value = checkMobile
        preventFre.value = false
      } else if (checkImgCode !== true) {
        errorMsg.value = checkImgCode
        preventFre.value = false
      } else {
        let param = {}
        param.mobile = name.value
        param.type = 'wxAuth'
        param.verifyCode = imgCode.value
        param.verifyKey = imgCodeKey.value
        proxy.$get('v3/msg/front/commons/smsCode', param).then(res => {
          if (res.state == 200) {
            countDownM.value = 60
            countDown()
            preventFre.value = false
          } else {
            //提示错误
            errorMsg.value = res.msg
            preventFre.value = false
          }
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
    //通过replace方式跳转页面
    const goToPage = type => {
      router.replace({
        path: type
      })
    }

    onMounted(() => { })

    return {
      L,
      loginType,
      login,
      name,
      password,
      clearInputVal,
      errorMsg,
      getSmsCode,
      countDownM,
      goToPage,
      configInfo,
      defaultImg,
      defaultBgImg,
      wxEnable,
      bindedVisible,
      binded,
      confirmBind,
      showCodeImg, imgCode, imgCodeKey, getImgCode
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/login.scss';

.top .item {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #333333;

  &:after {
    display: none !important;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.bindMsg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .msg_title {
    display: flex;
    align-items: center;

    p {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      margin-left: 26px;
    }

    img {
      width: 50px;
      height: 50px;
    }
  }

  .msg_content {
    margin-top: 30px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }

  .msg_tip {
    margin-top: 12px;
    line-height: 20px;
  }

  .go_bind_on {
    margin-top: 30px;
    width: 120px;
    height: 36px;
    background: var(--color_main_bg);
    border-radius: 3px;
    color: #fff;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }

  .go_bind_update {
    margin-left: 20px;
    margin-top: 30px;
    width: 120px;
    height: 36px;
    background: #999;
    border-radius: 3px;
    color: #fff;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }
}
</style>
