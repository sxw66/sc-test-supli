<template>
     <div>
          <div class="receive_info pre_message" v-if="virtualPreList.length">
               <div class="receive_info_title pre_message_title">
                    <span>{{ L['预留信息'] }}</span>
               </div>
               <div class="pre_message_info">
                    <table style="border-spacing: 0 10px;">
                         <tr v-for="(item, index) in virtualPreList" :key="index">
                              <td>
                                   <div class="tag_pre">
                                        <strong v-if="item.isRequired == 1">*</strong>
                                        <span>
                                             {{ item.reserveName
                                             }}：
                                        </span>
                                   </div>
                              </td>
                              <td v-if="item.reserveType == 1 || item.reserveType == 3">
                                   <el-input class="pre_tag_input" v-model="item.reserveValue"
                                        :placeholder="`${L['请输入']}${item.reserveName}`" type="text"
                                        :maxlength="item.reserveType == 1 ? 11 : 50" clearable :key="index"
                                        @input="preMsgErr.index = -1"></el-input>
                              </td>
                              <td v-else-if="item.reserveType == 5">
                                   <el-input class="pre_tag_input" v-model="item.reserveValue"
                                        :placeholder="`${L['请输入']}${item.reserveName}`" type="text" :maxlength="30"
                                        clearable :key="index" @input="preMsgErr.index = -1"></el-input>
                              </td>
                              <td v-else>
                                   <el-input class="pre_tag_input" v-model="item.reserveValue"
                                        :placeholder="`${L['请输入']}${item.reserveName}`" type="text"
                                        :maxlength="item.reserveType == 2 ? 18 : 50" clearable :key="index"
                                        @input="preMsgErr.index = -1"></el-input>
                              </td>
                              <td v-if="index == preMsgErr.index">
                                   <span class="preMsgErr">{{ preMsgErr.errMsg }}</span>
                              </td>
                         </tr>
                    </table>
               </div>
          </div>
     </div>
     <!-- 预留信息 -->
</template>
<script>
import { reactive, getCurrentInstance, unref, ref, watch } from 'vue'
import { ElMessage, } from 'element-plus';



export default {
     props: {
          virtualPre: {
               type: Array,
               default: () => []
          }
     },
     setup (props) {
          const { proxy } = getCurrentInstance()
          const L = proxy.$getCurLanguage()
          const preMsgErr = reactive({
               index: null,
               errMsg: ''
          })
          const virtualPreList = ref(props.virtualPre.map(item => ({ reserveValue: '', ...item })))

          let reserveInfoList = []

          watch(() => props.virtualPre, () => {
               virtualPreList.value = props.virtualPre.map(item => item.reserveValue = '')
          })


          //校验预留信息
          const checkPreMsg = (type, value, name, isRequired) => {
               switch (type) {
                    case 1: {
                         if (isRequired == 1) {
                              return proxy.$checkPhone(value)
                         } else {
                              let regMobile = /(1[3-9]\d{9}$)/
                              if (value && !regMobile.test(value)) {
                                   return `${L['请输入正确的']}${name}!`
                              } else {
                                   return true
                              }
                         }
                    }
                    case 2: {
                         if (isRequired == 1) {
                              return proxy.$checkIdentity(value)
                         } else {
                              if (value) {
                                   let reg18 = /^[1-9][0-9]{5}(18|19|20)[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{3}([0-9]|(X|x))/
                                   let reg15 = /^[1-9][0-9]{5}[0-9]{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)[0-9]{2}[0-9]/
                                   if (reg18.test(value) || reg15.test(value)) {
                                        return true
                                   } else {
                                        return `${L['请输入正确的']}${name}`
                                   }
                              } else {
                                   return true
                              }
                         }

                    }
                    case 3: {
                         let regNum = /[0-9]+(.[0-9]+)?/
                         if (isRequired == 1) {
                              if (!value) {
                                   return `${L['请输入']}${name}`
                              } else if (!regNum.test(value)) {
                                   return `${L['请输入正确的']}${name}`
                              } else {
                                   return true
                              }
                         } else {
                              if (value && !regNum.test(value)) {
                                   return `${L['请输入正确的']}${name}`
                              }
                              return true
                         }
                    }
                    case 4: {
                         if (isRequired == 1) {
                              if (!value) {
                                   return `${L['请输入']}${name}`
                              } else if (type == 4) {
                                   return true
                              }
                         } else {
                              return true
                         }
                         break
                    }
                    case 5: {
                         if (isRequired == 1) {
                              return proxy.$checkEmail(value)
                         } else {
                              let reg = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/
                              if (value && !reg.test(value)) {
                                   return `${L['请输入正确的']}${name}!`
                              } else {
                                   return true
                              }
                         }
                    }
               }
          }

          const handlePreInput = () => {
               reserveInfoList = []
               //预留信息校验start
               if (unref(virtualPreList).length > 0) {
                    for (let i = 0; i < unref(virtualPreList).length; i++) {
                         let {
                              reserveName,
                              reserveType,
                              reserveValue,
                              reserveNameId,
                              isRequired
                         } = virtualPreList.value[i]
                         if (
                              checkPreMsg(reserveType, reserveValue, reserveName, isRequired) ==
                              true
                         ) {
                              reserveInfoList.push({
                                   reserveName,
                                   reserveValue,
                                   reserveNameId
                              })
                         } else {
                              preMsgErr.errMsg = checkPreMsg(
                                   reserveType,
                                   reserveValue,
                                   reserveName,
                                   isRequired
                              )
                              preMsgErr.index = i
                              ElMessage(
                                   checkPreMsg(reserveType, reserveValue, reserveName, isRequired)
                              )
                              return
                         }
                    }
               }
               //预留信息校验end

               return reserveInfoList
          }



          return {
               preMsgErr,
               L,
               handlePreInput,
               virtualPreList
          }
     }
}
</script>
<style lang="scss">
.pre_message_info {
     padding-top: 15px;
     padding-bottom: 13px;
     font-size: 16px;
     font-family: Microsoft YaHei;
     font-weight: bold;
     color: #333333;
     padding-left: 20px;
     position: relative;
     display: flex;
     justify-content: space-between;

     .tag_pre {
          display: inline-block;
          text-align: right;
          font-weight: 400;
          margin-right: 10px;
          font-size: 14px;
          color: #333333;
          display: flex;
          min-width: 100px;
          max-width: 200px;
          justify-content: flex-end;
     }

     strong {
          font-size: 14px;
          color: #e2231a;
          margin-right: 3px;
     }

     .pre_tag_input {
          width: 320px;

          .el-input__inner {
               font-size: 13px;
          }
     }
}

.preMsgErr {
     color: var(--color_main);
     margin-left: 13px;
     font-weight: 400;
     font-size: 13px;
}
</style>