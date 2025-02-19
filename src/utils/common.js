import { ElMessage } from "element-plus";
import { get, post } from "./request";
import store from "../store";
import { sldStatEvent } from "@/utils/stat";
import axios from "axios";
import { apiUrl, fileUrl } from '@/utils/config'
import translate_list from '@/assets/language/translateList'
const _lang = localStorage.getItem('curLang');
const curLang = _lang == 'zh_CN' ? 'zh' : (_lang || process.env.VUE_APP_DEFAULT_LANGUAGE); //默认语言

/**
 * 装修模块的跳转
 * @params  Object val
 */
export function diyNavTo (val) {
  if (val.link_type == "url") {
    //跳转链接地址
    if (val.link_value) {
      val.link_value = quillEscapeToHtml(val.link_value);
    }
    window.open(val.link_value, "_blank");
  } else if (val.link_type == "goods") {
    //跳转商品详情页
    let routeUrl = this.$router.resolve({
      path: "/goods/detail",
      query: {
        productId: val.info.defaultProductId ?? val.info.productId,
      },
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "category") {
    // 分类列表
    let routeUrl = this.$router.resolve({
      path: "/goods/list",
      query: {
        categoryId: val.info.categoryId,
        g: val.info.grade,
        pid: val.info.pid
      },
    });

    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "keyword") {
    // 关键词
    let query = {
      keyword: val.link_value,
    };
    if (val.storeId) {
      query.storeId = val.storeId;
    }
    let routeUrl = this.$router.resolve({
      path: "/goods/list",
      query,
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "topic") {
    //跳转专题页
    let routeUrl = this.$router.resolve({
      path: "/topic",
      query: {
        topicId: val.info.decoId,
      },
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "brand_home") {
    //品牌列表
    let routeUrl = this.$router.resolve({
      path: "/brand",
      query: {},
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "store_list") {
    //供应商列表
    let routeUrl = this.$router.resolve({
      path: "/store/list",
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "voucher_center") {
    //领券中心
    let routeUrl = this.$router.resolve({
      path: "/coupon",
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == "point_center") {
    let routeUrl = this.$router.resolve({
      path: "/point/index",
    });
    window.open(routeUrl.href, "_blank");
  } else if (val.link_type == 'store') {
    let routeUrl = this.$router.resolve({
      path: '/store/index',
      query: {
        vid: val.info.storeId
      }
    })
    window.open(routeUrl.href, '_blank');
  }
}

/**
 * 进入商品详情页
 * @params  number availableProductId 货品id
 */
export function goGoodsDetail (availableProductId) {
  let query = {};
  if (location.pathname && location.pathname !== '/') {
    query.sourcePath = location.pathname;
  }
  query.productId = availableProductId;
  let routeUrl = this.$router.resolve({
    path: "/goods/detail",
    query,
  });
  window.open(routeUrl.href, "_blank");
}

/**
 * 进入供应商详情页
 * @params  number storeId 供应商id
 */
export function goStoreDetail (storeId) {
  let routeUrl = this.$router.resolve({
    path: "/store/index",
    query: { vid: storeId },
  });
  window.open(routeUrl.href, "_blank");
}

/*
 * 判断是否显示聊天页面的时间,2条消息之间间隔超过3分钟显示
 * 返回Boolean类型
 * preMsgTime 上一条消息的发送时间，curMsgTime该条消息的发送时间
 * @zjf-2021-03-05
 * */
export function isShowTime (preMsgTime, curMsgTime) {
  let res = false;
  if (Date.parse(new Date(curMsgTime)) * 1 - Date.parse(new Date(preMsgTime)) * 1 > 3 * 60 * 1000) {
    res = true;
  }
  return res;
}

/*
 * 格式化聊天时间
 * 返回格式化后的数据，字符串类型
 * time 时间戳 13位
 * @zjf-2021-03-05
 * */
export function formatChatTime (time) {
  let tarLang = getCurLanguage()
  return format(
    new Date(time),
    `yyyy${tarLang["年"]}MM${tarLang["月"]}dd${tarLang["日"]} hh:mm`
  );
}

export function format (date, fmt) {
  let o = {
    "y+": date.getFullYear(), //年
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}

/**
 * 进入公告详情页
 * @params  number noticeId 公告id
 */
export function goBiddingDetail (noticeId) {
  let routeUrl = this.$router.resolve({
    path: "recruit_info/bulletin_detail",
    query: { noticeId: noticeId },
  });
  window.open(routeUrl.href, "_blank");
}

/**
 * 进入资讯详情页
 * @params  number informationId 资讯id
 */
export function goInformationDetail (informationId) {
  let routeUrl = this.$router.resolve({
    path: "hotNews/info_detail",
    query: { informationId: informationId },
  });
  window.open(routeUrl.href, "_blank");
}

/**
 * 通过分类id跳转商品列表页
 * @params  Object val
 */
export function goGoodsListByCatId (categoryId) {
  let routeUrl = this.$router.resolve({
    path: "/goods/list",
    query: { categoryId: categoryId },
  });
  window.open(routeUrl.href, "_blank");
}

/*
 * 获取缓存的值——String类型
 * 返回值字符串  有值返回具体的值，否则返回空字符串
 * @zjf-2020-11-26
 * */
export function getLocalStorageStr (key) {
  let val = localStorage.getItem(key);
  return val != undefined && val != null && val ? val : "";
}

/*
 * 获取缓存的值——Object类型
 * 返回值对象  有值返回具体的值，否则返回空对象
 * @zjf-2020-11-26
 * */
export function getLocalStorageObject (key) {
  let val = localStorage.getItem(key);
  return val != undefined && val != null && val ? JSON.parse(val) : {};
}

/*
 * 获取当前语言下的数据 —— Object类型
 * 返回对象  语言数据对象
 * @zjf-2020-12-28
 * */
// let lang_zn = {};
const lang = {
  zh: {},
  en: {},
  pt: {},
  spa: {},
}

// 多语言列表同步
async function syncTranslations() {
  const translateList = translate_list.map(item => {
    return { chinese: item }
  })
  const params = {
    projectName: 'supplier',
    translateList,
    onlyAdding: true // 只增不删，仅在计划清理时设为false
  }
  axios.post(`${apiUrl}v3/system/admin/internationalization/init`, params)
    .then(res => {
      console.log('翻译同步成功');
    })
    .catch(err => {
      console.error('翻译同步异常');
    });
}
console.log(process.env.VUE_APP_LOCAL_VARIABLE, 'VUE_APP_LOCAL_VARIABLE');

// 进入项目或刷新页面时同步语言列表
process.env.VUE_APP_LOCAL_VARIABLE && syncTranslations()

// 加载翻译语言包 
async function loadLanguageModule() {
  try {
    const response = await axios.get(`${fileUrl}b2b2cdevfiles/static/language/supplier/${curLang}.js`);
    const scriptText = await response.data;
    
    // 手动解析 lang_zh 对象
    const match = scriptText.match(/export\s+const\s+lang_(zh|en|pt|spa)\s*=\s*({[\s\S]*?})\s*;?/);
    
    if (match && match[2]) {
      lang[`${curLang}`] = eval('(' + match[2] + ')');
    } else {
      console.error('lang_zh is not defined in the loaded script.');
    }
  } catch (error) {
    console.error('Error loading language module:', error);
  }
}

// 语言包异步初始化
export async function initializeLanguage() {
  if (JSON.stringify(lang[`${curLang}`]) == '{}') {
    await loadLanguageModule();
  }
}

// 当前语言处理
export function getCurLanguage () {
  const language = lang
  
  const cur_now = new Proxy(language[curLang], {
    get (target, property) {
      if (!target[property]) {
        return property
      }
      return target[property]
    }
  })

  return cur_now;
}


/*
 * 手机号的验证
 * 返回boolean值
 * @zjf-2021-01-06
 * */
export function checkMobile (mobile) {
  let tarLang = getCurLanguage();
  let regMobile = /(1[3-9]\d{9}$)/;
  let regTel = /(\d{4}-)?\d{6,8}/;
  if (!mobile) {
    return tarLang["请输入手机号"];
  } else if (!regMobile.test(mobile) && !regTel.test(mobile)) {
    return tarLang["请输入正确的手机号"];
  } else {
    return true;
  }
}

export function checkPhone (mobile, txt) {
  let tarLang = getCurLanguage();
  let regMobile = /^(1[3-9]\d{9})|(\d{10,11})$/;
  // let regMobile = /(1[3-9]\d{9}$)/;
  if (!mobile) {
    return txt ? txt : tarLang["请输入手机号"];
  } else if (!regMobile.test(mobile)) {
    return txt ? txt : tarLang["请输入正确的手机号"];
  } else {
    return true;
  }
}

/*
 * 密码的验证：6～20位，由英文、数字或符号组成的验证
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-06
 * */
export function checkPwd (pwd) {
  let tarLang = getCurLanguage();
  if (pwd.length < 6) {
    return tarLang["密码最少6位哦～"];
  } else if (pwd.length > 20) {
    return tarLang["密码最多20位哦～"];
  } else if (!/[^\u4e00-\u9fa5]/.test(pwd)) {
    return tarLang["密码不可以有中文哦～"];
  } else if (!/^\S*$/.test(pwd)) {
    return tarLang["密码中不可以有空格哦～"];
  } else {
    return true;
  }
}

/*
 * 短信验证码的验证：6位0～9的数字
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-06
 * */
export function checkSmsCode (val) {
  let tarLang = getCurLanguage();
  let reg = /^\d{6}$/;
  if (!val) {
    return tarLang["请输入短信验证码"];
  } else if (!reg.test(val)) {
    return tarLang["请输入正确的短信验证码"];
  } else {
    return true;
  }
}

/*
 * 邮箱验证码的验证：6位0～9的数字
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-06
 * */
export function checkEmailCode (val) {
  let tarLang = getCurLanguage();
  let reg = /^\d{4,6}$/;
  if (!val) {
    return tarLang["请输入邮箱验证码"];
  } else if (!reg.test(val)) {
    return tarLang["请输入正确的邮箱验证码"];
  } else {
    return true;
  }
}

/*
 * 会员账号的验证：由中、英文、数字、"-"及"_"，且不能全为数字
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-06
 * */
export function checkMemberName (value) {
  let tarLang = getCurLanguage();
  let reg = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$");
  let reg_num = new RegExp("^[0-9]*$");
  if (value.length < 6 || value.length > 20) {
    return tarLang["请输入6～20位的会员名"];
  } else {
    if (reg.test(value)) {
      if (reg_num.test(value)) {
        return tarLang["会员名不能全为数字"];
      } else {
        return true;
      }
    } else {
      return tarLang['会员名须由中、英文、数字、"-"及"_"组成'];
    }
  }
}

export function checkIdentity (value) {
  let reg18 = /^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/;
  let reg15 = /^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/;
  if (!value) {
    return "请输入身份证号";
  } else if (reg18.test(value) || reg15.test(value)) {
    return true;
  } else {
    return "请输入正确的身份证号";
  }
}

/*
 * 短信图形验证码的验证：4位英文字母和数字
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-07
 * */
export function checkImgCode (val) {
  let tarLang = getCurLanguage();
  let reg = /^[a-zA-Z0-9]{4}$/;
  if (!val) {
    return tarLang["请输入图形验证码"];
  } else if (!reg.test(val)) {
    return tarLang["请输入正确的图形验证码"];
  } else {
    return true;
  }
}

/*
 * 邮箱的验证
 * 验证通过，返回boolean值true，否则返回具体的错误信息
 * @zjf-2021-01-11
 * */
export function checkEmail (email) {
  let tarLang = getCurLanguage();
  let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  if (!email) {
    return tarLang["请输入邮箱"];
  } else if (!reg.test(email)) {
    return tarLang["请输入正确的邮箱"];
  } else {
    return true;
  }
}

/**
 * 加入进货单：登录及未登录 并将进货单数据存储到vuex的store中
 * @params
 * 已登录所需参数： productId:货品id currentNumber:当前商品加入的数量
 * 未登录所需参数：goodsDetailData：该商品详细信息 currentNumber:当前商品加入的数量 cartListData:vuex中的store里面存储的进货单数据
 * @ljp-2021-01-08
 */
export function addCart (paramsData) {
  // 已登录
  let params = {
    productId: paramsData.productId,
    number: paramsData.number,
  };
  post("v3/supplier/channel/cart/add", params)
    .then(res => {
      if (res.state == 200) {
        sldStatEvent({
          behaviorType: "cart",
          goodsId: paramsData.goodsId,
          storeId: paramsData.storeId,
        });
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .then(() => {
      getLoginCartListData();
    });
}

/**
 * 进货单中商品总数及进货单中商品选中的数
 * @param {*} cartData :进货单数据
 * @ljp-2021-2-12
 */
export function cartDataNum (cartData) {
  cartData.availableCartNum = 0; //进货单中商品数量
  let checkedGoods = []; //选中的商品
  if (cartData.storeCartGroupList && cartData.storeCartGroupList.length > 0) {
    cartData.storeCartGroupList.map(storeItem => {
      storeItem.storeGoodsList.map(storeGoodsItem => {
        cartData.availableCartNum += storeGoodsItem.goodsCartList.length;
        checkedGoods = storeGoodsItem.goodsCartList.filter(cartItem => cartItem.isChecked == 1);
      });
    });
    cartData.totalCheck = checkedGoods.length; //选中商品的总数
  } else {
    cartData.availableCartNum = 0; //进货单商品总数
  }
  return cartData;
}

/**
 * 计算进货单商品小计 cartData:进货单数据
 * @ljp-2021-1-15
 */
export function calculateSubtotal (cartData) {
  if (JSON.stringify(cartData) != "{}") {
    cartData.storeCartGroupList?.map((storeItem) => {
      let totalNum = 0
      storeItem.storeGoodsList.map((cartItem) => {
        cartItem.goodsCartList?.map(item => {
          totalNum += Number(item.buyNum)
        })
        cartItem.totalNum = totalNum
      });
    });

    cartData.invalidList?.map((invalidItem) => {
      invalidItem.subtotal =
        (invalidItem.productPrice * Number(invalidItem.buyNum)).toFixed(2);
    });
    return cartData;
  }
}

/**
 * 获取已登录进货单数据并更新vuex中的进货单数据
 * @ljp-2021-1-12
 */
export function getLoginCartListData () {
  let params = {};
  get("v3/supplier/channel/cart/cartList", params).then(res => {
    if (res.state == 200) {
      let result = res.data;
      result = calculateSubtotal(result);
      store.commit("updateCartListData", result); //将进货单数据存储到vuex的store中
    } else {
      ElMessage.error(res.msg);
    }
  });
}

/**
 * 获取会员信息并更新vuex的用户信息
 * @ljp-2021-1-11
 */
export async function getUserInfo () {
  const res = await get("v3/supplier/channel/user/getInfo")
  if (res.data.superExpirationTime) {
    let time = res.data.superExpirationTime.split(' ')[0].split('-')
    res.data.superExpirationDay = time[0] + '年' + time[1] + '月' + time[2] + '日';
  }
  store.commit("updateMemberInfo", res.data);
  return res.data
}

/**
 * 通用提示
 * con  String  提示的内容,无特殊要求的话可不传
 *
 * @zjf-2020-11-18
 */
export function sldCommonTip (con = "该功能在升级中～") {
  let tarLang = getCurLanguage();
  let defaultCon = tarLang["该功能在升级中～"];
  ElMessage.info(con ? con : defaultCon);
}

/**
 * base64加密
 * @params data String 要加密的字符串
 * @zjf-2021-06-28
 */
export function base64Encode (data) {
  let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = (o1 << 16) | (o2 << 8) | o3;

    h1 = (bits >> 18) & 0x3f;
    h2 = (bits >> 12) & 0x3f;
    h3 = (bits >> 6) & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join("");

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + "==";
      break;
    case 2:
      enc = enc.slice(0, -1) + "=";
      break;
  }

  return enc;
}

export function utf8Encode (string) {
  string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  let utftext = "",
    start,
    end;
  let stringl = 0,
    n;

  start = end = 0;
  stringl = string.length;

  for (n = 0; n < stringl; n++) {
    let c1 = string.charCodeAt(n);
    let enc = null;

    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length);
  }

  return utftext;
}

export function getQueryVariable (variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/*
 * 富文本内容反转义（接口返回的富文本内容经过了转义，导致内容无法展示，所以需要反转义）
 * @param {String} str 富文本内容
 * @zjf-2022-01-07
 * */
export function quillEscapeToHtml (str) {
  if (str != undefined) {
    const arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
      return arrEntities[t];
    });
  } else {
    return "";
  }
}

/*
 * 返回一个数字的整数和小数
 * number 需要处理的数据
 * type: 要获取的数据 int 整数  decimal 小数
 */
export function getPartNumber (number, type) {
  const curLang = 'pt';
  const point = ['zh_CN','en'].includes(curLang) ? '.' : ',';
  let target = '';
  if (number == undefined) {
    return 0;
  }

  number = number.toString();
  let int = number.split('.')[0];
  let decimal = number.split('.')[1] != undefined ? `${point}${number.split('.')[1]}` : `${point}00`;
  if (decimal.length < 3) {
    decimal += '0';
  }

  if (type == 'int') {
    target = int
  } else if (type == 'decimal') {
    target = decimal
  } else if (type == 'all') {
    target = `${int}${decimal}`
  }
  return target;
}



/** 
 * base64加密
 * @params data String 要加密的字符串
 * @zoucb-2023-05-25
 */
export function base64Encrypt (data) {
  let b64_obj = {
    a: 'CABDE',
    b: 'FoHIJ',
    c: 'KLpNO',
    d: 'PQRyr',
    e: 'UVWXi',
    f: 'Zght6',
    g: 'efabYzS',
    h: 'jkmu012l',
    m: 'GMqTs345d',
    n: 'cnvwx789()=',
  };
  let position = [
    'a:0',
    'b:1',
    'c:2',
    'd:3',
    'd:4',
    'e:4',
    'f:1',
    'f:2',
    'f:3',
    'n:8',
    'a:1',
    'n:9',
    'g:6',
    'h:7',
    'b:1',
    'm:8',
    'b:1',
    'n:1',
  ]
  for (let i in position) {
    let [k, v] = position[i].split(':')
    data = data + `${b64_obj[k][v]}`
  }

  let b64 = Object.values(b64_obj).join('')

  let o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];
  if (!data) {
    return data;
  }
  data = utf8Encode(data);
  do {
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + '==';
      break;
    case 2:
      enc = enc.slice(0, -1) + '=';
      break;
  }

  return enc;
}


export const createDirective = (app) => {

  const handlerPromotionText = ({ value }) => {

    if (!value) return ''

    let formatValue = value.replace(/<(.+?)>/g, (numText) => {
      let num = numText.replace(/<|>/g, '')
      return "<span style='color:var(--color_main)'>" + (isNaN(Number(num)) ? 0 : num) + "</span>"
    })
    return formatValue
  }

  app.directive('promotionText', {
    created (el, binding) {
      el.innerHTML = handlerPromotionText(binding)
    },
    updated (el, binding) {
      if (binding.oldValue !== binding.value) {
        el.innerHTML = handlerPromotionText(binding)
      }
    },
  })
}

export const preventMutiClick = (targetFn) => {
  let isPreventClick = false
  const continueExec = () => isPreventClick = false
  return function () {
    if (!isPreventClick) {
      
      isPreventClick = true
      targetFn(continueExec)
    }
  }
}

// 数字格式化为以w为单位，保留2为小数
export function formatW (num) {
  return num > 10000 ? (num / 10000).toFixed(1) * 1 + 'w' : num;
}


//防抖函数
export function debounceFn (fn, delay) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply({}, arguments)
    }, delay)
  }
}

//从对象中提取指定属性
export function extraProperty (target, props) {
  let result = {};
  for (let p of props) {
    result[p] = target[p];
  }
  return result;
}

// interface NumOptions {
//   language?: string; // 指定语言
//   hasPrefix?: boolean; // 是否携带前缀货币符号
//   precision?: number; // 小数位长度
// }
/**
 * 货币数字格式化
 * @param target num | string 要转换的货币数字
 * @param options: NumOptions 参数
 * @returns num | string
 */
export function formatMoneyNum(target, options) {
  let _target;
  let isPositiveNumber = true;
  let _num;
  if(target === '' || target === undefined || target === null || Number.isNaN(target)) return '';
  // 检测是否为负数
  if(typeof target === "string" && target.startsWith('-')) {
    _num = target.split('-')[1];
    isPositiveNumber = false;
  } else {
    _num = target;
  }
  // 转换为国际通用数字
  if(typeof _num === "string" && _num.indexOf(',') >= 0) {
    const dotIndex = _num.indexOf('.');
    const commaIndex = _num.indexOf(',');
    if(dotIndex < commaIndex) { // 点在逗号后面 正常国际方式
      _target = Number(_num.replace(/,/g, ''));
    } else { // 葡萄牙-巴西
      _target = Number(_num.replace(/./g, '').replace(/,/, '.'));
    }
  } else {
    _target = parseFloat(_num);
  }
  
  const locales = {
    'zh_CN': 'zh-CN',
    'en': 'en-US',
    'pt': 'pt-BR',
    'spa': 'es-ES'
  }
  const currency = {
    'zh_CN': 'CNY',
    'en': 'USD',
    'pt': 'BRL',
    'spa': 'EUR',
  }
  // 优先取传递的 > 默认值
  const lang = options?.language || 'pt';
  // 转换对应格式
  const formatter = new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: currency[lang],
    minimumFractionDigits: options?.precision || 2, // 最小小数位
    maximumFractionDigits: options?.precision || 2, // 最大小数位
    currencyDisplay: 'code'
  });
  _target = formatter.format(_target);
  const targetArr = _target.trim().replace(/\s/, '-').split('-'); // 此处若直接使用 split(' ')得到的结果为 ['CNY  0.00'] 非期望值
  const isSpa = lang == 'spa' ? 0 : 1; // 西班牙 ['0.00', 'EUR']  西班牙的货币在后面
  const positiveNum = isPositiveNumber ? targetArr[isSpa] : `-${targetArr[isSpa]}`; // 正负数
  // 是否去掉前缀货币符号
  _target = options?.hasPrefix ? `R$${positiveNum}` : positiveNum;
  return _target;
}