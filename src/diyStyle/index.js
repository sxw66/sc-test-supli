
import store from '../store'
import dynaIcon from './dynaIcon'
import { get } from '../utils/request'
import { CheckBox } from './JsxMiniComponent'

const diyStyle_init = {
     '--color_main': '#F30300',
     '--color_main_bg': 'linear-gradient(-90deg, #F30300 85%,#F30300 100%)',
     '--color_price': '#F30300',
     '--color_vice': '#FF821C',
     '--color_vice_bg': '#FF821C',
     '--color_halo': 'rgba(243,3,0,0.08)',
     '--color_halo_bg': 'rgba(243,3,0,0.8)',
     // 拼团
     '--color_spell_main': '#fb2d2d',
     '--color_spell_halo': 'rgba(251,45,45,0.1)',
     '--color_spell_vice': '#ff7918',
     // 预售
     '--color_presell_main': '#fe006d',
     // 阶梯团
     '--color_ladder_main': '#FE9A22',
     '--color_ladder_halo': 'rgba(254,154,34,0.1)',
     '--color_ladder_vice': '#fc1c1c',
     //秒杀
     '--color_seckill_main': '#E31719',
     '--color_seckill_halo': 'rgba(254,154,34,0.1)',
     '--color_seckill_vice': '#FF811F',
     // 优惠券
     '--color_coupon_main': '#FE9A22',
     '--color_coupon_main_bg': 'linear-gradient(45deg, #ff7a18 0%, #fea10e 100%)',
}

// 16进制颜色转换成rgb,用于 动态颜色转换
export function set16ToRgb (str, op) {
     var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
     if (!reg.test(str)) { return; }
     let newStr = (str.toLowerCase()).replace(/#/g, '')
     let len = newStr.length;
     if (len == 3) {
          let t = ''
          for (var i = 0; i < len; i++) {
               t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
          }
          newStr = t
     }
     let arr = []; //将字符串分隔，两个两个的分隔
     for (let i = 0; i < 6; i = i + 2) {
          let s = newStr.slice(i, i + 2)
          arr.push(parseInt("0x" + s))
     }

     if (op !== undefined) {
          return `rgba(${arr.join(",")},${op})`;
     } else {
          return 'rgb(' + arr.join(",") + ')';
     }

}


//获取接口传来的颜色变量
function getDiyStyle () {
     // 主商城颜色
     const map_text = new Map([
          ['--color_main', 'mainColor'],
          ['--color_main_bg', 'mainLinearColor'],
          ['--color_vice', 'subColor'],
          ['--color_vice_bg', 'subLinearColor'],
          ['--color_price', 'priceColor']
     ])

     // 拼团颜色
     const map_spell_text = new Map([
          ['--color_spell_main', 'mainColor'],
          ['--color_spell_vice', 'subColor'],
     ])
     // 预售颜色
     const map_presel_text = new Map([
          ['--color_presell_main', 'mainColor'],
     ])
     // 阶梯团颜色
     const supplier_pc_ladder_mall_style = new Map([
          ['--color_ladder_main', 'mainColor'],
          ['--color_ladder_vice', 'subColor'],
     ])
     // 秒杀颜色
     const supplier_pc_seckill_style = new Map([
          ['--color_seckill_main', 'mainColor'],
          ['--color_seckill_vice', 'subColor'],
     ])
     // 优惠券颜色
     const supplier_pc_coupon_style = new Map([
          ['--color_coupon_main', 'mainColor'],
          ['--color_coupon_main_bg', 'mainLinearColor'],
     ])
     /*
     supplier_pc_mall_style 主商城颜色
      supplier_pc_integral_mall_style积分  
     supplier_pc_spell_mall_style拼团  
     supplier_pc_presell_mall_style预售  
     supplier_pc_ladder_mall_style阶梯团  
     supplier_pc_seckill_mall_style秒杀 
     supplier_pc_coupon_mall_style 优惠券 */
     return new Promise((resolve, reject) => {
          get('v3/system/common/getSettings', {
               names: 'supplier_pc_mall_style,supplier_pc_spell_mall_style,supplier_pc_presell_mall_style,supplier_pc_ladder_mall_style,supplier_pc_seckill_mall_style,supplier_pc_coupon_mall_style'
          }).then(res => {
               if (res.state == 200) {
                    if (res.data && res.data[0]) {
                         let result = JSON.parse(res.data[0])
                         let color_set = {}
                         for (let i of map_text) {
                              color_set[i[0]] = result[i[1]]
                              if (i[1] == 'mainColor') {
                                   if (!/rgb.*?/.test(result[i[1]])) {
                                        color_set['--color_halo'] = set16ToRgb(result[i[1]], 0.1)
                                        color_set['--color_halo_bg'] = set16ToRgb(result[i[1]], 0.8)
                                   } else {
                                        let rgbArr = result[i[1]].match(/((\d{1,3}))/g)
                                        rgbArr[3] = '0.1'
                                        color_set['--color_halo'] = `rgba(${rgbArr.join(',')})`
                                        let rgbArrs = result[i[1]].match(/((\d{1,3}))/g)
                                        rgbArrs[3] = '0.8'
                                        color_set['--color_halo_bg'] = `rgba(${rgbArrs.join(',')})`
                                   }
                              }
                         }

                         if (res.data && res.data[1]) {
                              let results = JSON.parse(res.data[1])
                              for (let i of map_spell_text) {
                                   color_set[i[0]] = results[i[1]]
                                   if (i[1] == 'subColor') {
                                        if (!/rgb.*?/.test(results[i[1]])) {
                                             color_set['--color_spell_halo'] = set16ToRgb(results[i[1]], 0.1)
                                        } else {
                                             let rgbArr = results[i[1]].match(/((\d{1,3}))/g)
                                             rgbArr[3] = '0.1'
                                             color_set['--color_spell_halo'] = `rgba(${rgbArr.join(',')})`
                                        }
                                   }
                              }
                         }
                         if (res.data && res.data[2]) {
                              let results = JSON.parse(res.data[2])
                              for (let i of map_presel_text) {
                                   color_set[i[0]] = results[i[1]]
                              }
                         }
                         if (res.data && res.data[3]) {
                              let results = JSON.parse(res.data[3])
                              for (let i of supplier_pc_ladder_mall_style) {
                                   color_set[i[0]] = results[i[1]]
                                   if (i[1] == 'subColor') {
                                        if (!/rgb.*?/.test(results[i[1]])) {
                                             color_set['--color_ladder_halo'] = set16ToRgb(results[i[1]], 0.1)
                                        } else {
                                             let rgbArr = results[i[1]].match(/((\d{1,3}))/g)
                                             rgbArr[3] = '0.1'
                                             color_set['--color_ladder_halo'] = `rgba(${rgbArr.join(',')})`
                                        }
                                   }
                              }
                         }
                         if (res.data && res.data[4]) {
                              let results = JSON.parse(res.data[4])
                              for (let i of supplier_pc_seckill_style) {
                                   color_set[i[0]] = results[i[1]]
                                   if (i[1] == 'subColor') {
                                        if (!/rgb.*?/.test(results[i[1]])) {
                                             color_set['--color_seckill_halo'] = set16ToRgb(results[i[1]], 0.1)
                                        } else {
                                             let rgbArr = results[i[1]].match(/((\d{1,3}))/g)
                                             rgbArr[3] = '0.1'
                                             color_set['--color_seckill_halo'] = `rgba(${rgbArr.join(',')})`
                                        }
                                   }
                              }
                         }
                         if (res.data && res.data[5]) {
                              let results = JSON.parse(res.data[5])
                              for (let i of supplier_pc_coupon_style) {
                                   color_set[i[0]] = results[i[1]]
                              }
                         }

                         const diyStyle_obj = Object.assign({}, diyStyle_init, color_set)
                         const root = document.querySelector(':root');
                         for (let i in diyStyle_obj) {
                              root.style.setProperty(i, diyStyle_obj[i]);
                         }
                         store.commit('saveDiyStyle', color_set)
                    } else {
                         const root = document.querySelector(':root');
                         for (let i in diyStyle_init) {
                              root.style.setProperty(i, diyStyle_init[i]);
                         }
                         store.commit('saveDiyStyle', diyStyle_init)
                    }
               }
               resolve()
          }).catch(err => {
               reject(err.message)
          })
     })

}



export default {
     install (app) {
          app.component('dynaIcon', dynaIcon)
          app.component('myCheckBox', CheckBox)
     },
     getDiyStyleOnce () {
          let once = true
          return function () {
               if (once) {
                    getDiyStyle()
                    once = false
               }
          }
     }
}