/*
 * @Author: your name
 * @Date: 2021-01-08 21:09:07
 * @LastEditTime: 2021-02-04 14:15:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/main.js
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './style/index.scss'
import "./assets/iconfont/iconfont.css";
import { get, post } from './utils/request'
// eslint-disable-next-line
import { chatUrl, statShowDebug } from './utils/config'
import {
  getLocalStorageStr, getCurLanguage, goGoodsDetail, goStoreDetail, checkMobile, initializeLanguage, checkPhone, checkEmailCode, checkPwd, checkSmsCode, checkIdentity,
  checkMemberName, checkImgCode, addCart, diyNavTo, sldCommonTip, checkEmail, getUserInfo, cartDataNum, getLoginCartListData, calculateSubtotal,
  goGoodsListByCatId, formatChatTime, isShowTime, quillEscapeToHtml, getPartNumber, base64Encrypt,
  createDirective, formatW, formatMoneyNum,
} from './utils/common';
import { sldStatEvent, initStat } from './utils/stat'
import ElementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import VueSocketIO from "vue-socket.io";
import coverImage from '@/components/coverImage'
import SldCommonEmpty from '@/components/SldCommonEmpty'
import diyStyle from './diyStyle'

async function bootstrap() {
  await initializeLanguage(); // 确保语言模块已加载

  const app = createApp(App);


  //VueSocketIO的install方法的参数vue的protoType是vue2的，重写一下把vue3的config.globalProperties赋给prototype
  //就不会报'cannot set properties of undefined setting $socket'的错误
  const olderInstall = VueSocketIO.prototype.install
  VueSocketIO.prototype.install = function (Vue) {
    Vue.prototype = Vue.config.globalProperties
    olderInstall.apply(this, [Vue])
  }


  createDirective(app)
  app.component('coverImage', coverImage)
  app.component('SldCommonEmpty', SldCommonEmpty)
  //组件引用 end
  // 配置全局属性
  app.config.globalProperties.$get = get;
  app.config.globalProperties.$post = post;
  app.config.globalProperties.$getLocalStorageStr = getLocalStorageStr;
  app.config.globalProperties.$getCurLanguage = getCurLanguage;
  app.config.globalProperties.$goGoodsDetail = goGoodsDetail;
  app.config.globalProperties.$goStoreDetail = goStoreDetail;
  app.config.globalProperties.$checkMobile = checkMobile;
  app.config.globalProperties.$checkPwd = checkPwd;
  app.config.globalProperties.$checkSmsCode = checkSmsCode;
  app.config.globalProperties.$checkMemberName = checkMemberName;
  app.config.globalProperties.$checkImgCode = checkImgCode;
  app.config.globalProperties.$addCart = addCart;
  app.config.globalProperties.$diyNavTo = diyNavTo;
  app.config.globalProperties.$sldCommonTip = sldCommonTip;
  app.config.globalProperties.$checkEmail = checkEmail;
  app.config.globalProperties.$getUserInfo = getUserInfo;
  app.config.globalProperties.$cartDataNum = cartDataNum;
  app.config.globalProperties.$getLoginCartListData = getLoginCartListData;
  app.config.globalProperties.$calculateSubtotal = calculateSubtotal;
  app.config.globalProperties.$checkEmailCode = checkEmailCode;
  app.config.globalProperties.$goGoodsListByCatId = goGoodsListByCatId;
  app.config.globalProperties.$formatChatTime = formatChatTime
  app.config.globalProperties.$isShowTime = isShowTime
  app.config.globalProperties.$sldStatEvent = sldStatEvent
  app.config.globalProperties.$checkPhone = checkPhone
  app.config.globalProperties.$checkIdentity = checkIdentity
  app.config.globalProperties.$quillEscapeToHtml = quillEscapeToHtml
  app.config.globalProperties.$getPartNumber = getPartNumber
  app.config.globalProperties.$base64Encrypt = base64Encrypt
  app.config.globalProperties.$formatW = formatW
  app.config.globalProperties.$formatMoneyNum = formatMoneyNum
  window.MAX_PRODUCT_STOCK = 99999
  app.use(ElementPlus, {
    locale: zhCn,
  })
  app.use(new VueSocketIO({
    debug: false,
    connection: chatUrl,
  }))

  app.use(router).use(store).use(diyStyle).mount('#app')

  //统计初始化
  initStat(statShowDebug, {
    equipmentType: 1,//设备类型，1-pc，2-移动设备，3-其他
    source: 'pc',//终端名称，pc-pc；h5-H5；android-Android；ios-IOS；xcx-微信小程序
    userId: 0,//会员id默认为0
    ip: '',//移动端ip默认都为空
  });
}

bootstrap(); // 启动应用


