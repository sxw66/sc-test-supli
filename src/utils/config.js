/**
 *  项目的配置文件
 */

const apiUrl = process.env.VUE_APP_API_URL; //接口请求地址
// export const apiUrl = process.env.VUE_APP_API_URL; //接口请求地址
// export const apiUrl = "https://www.tfshop.com.br/"; //接口请求地址
const fileUrl = process.env.VUE_APP_FILE_URL; //文件服务地址
// export const chatUrl = "wss://im.tfshop.com.br"; //客服地址
const chatUrl = process.env.VUE_APP_CHAT_URL; //客服地址

const mUrl = "m.tfshop.com.br"; //移动端网页地址
const curLang = "pt"; //当前语言,pt:葡语，若为其他语言，需要对应/src/assets/language下面的文件名
const title = "TFshop!"; //浏览器顶部title
const gdKey = "9d5e1fb47c9a1375677c0cac6084875e"; //高德web-js key
const gdSecurityCode = "7039dd3dc5377d37134faf3791f6ce74"; //高德web-js 安全密钥
const statShowDebug = false; //是否开启统计的调试

module.exports = { 
    apiUrl,
    fileUrl,
    chatUrl,
    mUrl,
    curLang,
    title,
    gdKey,
    gdSecurityCode,
    statShowDebug,
}

/** copyright *** slodon *** version-v5.4.3 *** date-2024-06-17 ***主版本v5.4.5**/
