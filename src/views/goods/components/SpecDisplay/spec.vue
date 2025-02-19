<template>
     <div class="spec_list_con">
          <div class="goods_spec">
               <div class="goods_spec_pre flex_row_start_start" v-for="(specItem, specIndex) in specsLocal"
                    :key="specIndex">
                    <div class="goods_spec_pre_title" :title="specItem.specName">
                         {{ specItem.specName }}
                    </div>
                    <div class="goods_spec_pre_list flex_row_start_center">
                         <template v-for="(specVal, sVIndex) in specItem.specValueList" :key="sVIndex">
                              <SpecValueItem :specValue="specVal" @click="selectSpecVal(specItem, specVal, sVIndex)" />
                         </template>
                    </div>
               </div>


               <div class="goods_spec_pre flex_row_start_start">
                    <div class="goods_spec_pre_title the_last" :title="lastSpecInfo.specName">
                         {{ lastSpecInfo.specName }}
                    </div>
                    <div class="last_spec_pre">
                         <table :class="{ fold_state: fold }">
                              <tr class="last_spec_item " v-for="(specVal, sVIndex) in lastSpecValueList" :key="sVIndex"
                                   v-show="specVal.checkState != 3">
                                   <td>
                                        <div class="flex_row_start_start" style="margin-right: 20px;">
                                             <SpecCheckIcon :checkState="specVal.checkState"
                                                  :disabled="specVal.productStock == 0"
                                                  @click="selectLastSpecVal(specVal, sVIndex)"
                                                  style="margin-top: 9px;" />

                                             <div>
                                                  <SpecValueItem :specValue="specVal" />
                                                  <div class="code_text" v-if="specVal.goodsCode">
                                                       <span>{{ L['商品编码'] }} &nbsp;</span>
                                                       <span>{{ specVal.goodsCode }}</span>
                                                  </div>

                                             </div>

                                        </div>
                                   </td>

                                   <td>
                                        <div class="product_price flex_row_center_center" style="font-size:14px;">
                                             <span>
                                                  {{ L['价格'] }}：
                                             </span>
                                             <span v-if="specVal.ladderPrice">
                                                  <priceComponent :ladderPrice="specVal.ladderPrice"
                                                       :price="specVal.productPrice"
                                                       :number="staticInfo.ladderType == 3 ? specVal.currentSpecNum : totalNum"
                                                       :ladderDisplay="staticInfo.ladderType == 3 ? 'ladder' : 'single'"
                                                       @getCurrentLadderPrice="(price) => getCurrentLadderPrice(price, specVal)" />
                                             </span>
                                             <span v-else>{{ $formatMoneyNum(specVal.productPrice) }}</span>
                                        </div>
                                   </td>

                                   <td>
                                        <div>
                                             <div class="quantity_inventory_multi">
                                                  <div class="flex_column_start_center">
                                                       <div class="quantity_edit flex_row_start_center">
                                                            <span @click="editNumSpec('reduce', specVal)">-</span>
                                                            <input type="number" v-model="specVal.currentSpecNum"
                                                                 @input="editNumSpec('edit', specVal)"
                                                                 @blur="editNumSpec('blur', specVal)" />
                                                            <span @click="editNumSpec('add', specVal)">+</span>
                                                            <div class="disable_mask"
                                                                 v-if="specVal.checkState != 1 || specVal.productStock == 0">
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </td>
                              </tr>
                         </table>
                         <div class="more_hide flex_row_center_center" v-if="lastSpecValueList.length > 3">
                              <div class="flex_row_center_center more_hide_icon" @click="doFold">
                                   <span :class="[fold ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>

          <div class="series flex_row_between_center" style="margin-top: 20px;">
               <div class="flex_row_start_center">
                    <div class="series_title">
                         <span>{{ L['合计'] }}</span>
                    </div>
                    <div :class="{ series_total: true, skeleton_series_total: firstLoading }">
                         <section>
                              <span style="font-size: 14px;margin-right: 1px">R$</span>
                              <span v-if="totalPrice">
                                   <span style="font-size: 22px;font-weight:bold">
                                        {{ $formatMoneyNum(totalPrice) }}
                                   </span>
                                   <!-- <span style="font-size: 16px;font-weight:bold">
                                        {{ $getPartNumber(totalPrice, 'decimal') }}
                                   </span> -->
                              </span>
                              <span v-else>&nbsp;0,00</span>
                         </section>
                    </div>


                    <div class="choose_num">
                         <span>{{ L['已选'] }} {{ totalNum }}&nbsp; </span>
                         <span v-if="staticInfo.saleUnit">{{ staticInfo.saleUnit }}</span>
                    </div>
               </div>
               <div class="select_vals" v-if="chosenSpecList.length">
                    <el-popover placement="top-end" :width="640" trigger="click" @show="handlePopover('show')"
                         @hide="handlePopover('hide')">
                         <template #reference>
                              <div>
                                   <span>{{ L['已选清单'] }}</span>
                                   <span :class="[iconRotate]"></span>
                              </div>
                         </template>
                         <div class="select_list">
                              <div class="flex_row_between_center" v-if="chosenSpecList.length">
                                   <div class="left_scroll">
                                        <template v-for="(item, index) in chosenSpecList" :key="index">
                                             <div class="chosen_specs flex_row_start_center">
                                                  <template v-for="(item1, index1) in item.getSpecValuesList"
                                                       :key="index1">
                                                       <div class="spec_item">{{ item1 }}</div>
                                                  </template>
                                             </div>
                                        </template>
                                   </div>
                                   <div class="right_operate">
                                        <template v-for="(item2, index2) in chosenSpecList" :key="index2">
                                             <div class="op_item flex_row_start_center">
                                                  <div class="quantity_edit flex_row_start_center">
                                                       <span @click="editNumSel('reduce', item2)">-</span>
                                                       <input type="number" v-model="item2.buyNum"
                                                            @input="editNumSel('edit', item2)"
                                                            @blur="editNumSel('blur', item2)" />
                                                       <span @click="editNumSel('add', item2)">+</span>
                                                  </div>
                                                  <div class="del_chosen" @click="delChosen(index2, item2)">{{ L['删除']
                                                       }}
                                                  </div>
                                             </div>
                                        </template>
                                   </div>
                              </div>

                              <div v-else>
                                   <div class="empty flex_column_center_center">
                                        <img src="@/assets/common_empty.png">
                                        <p>{{ L['暂无可选清单'] }}</p>
                                   </div>
                              </div>

                         </div>
                    </el-popover>
               </div>
          </div>
     </div>
</template>


<script>
import { reactive, getCurrentInstance, ref, onMounted, watch, computed } from "vue";
import { ElMessage } from 'element-plus'
import { SpecValueItem, SpecCheckIcon } from "./SpecValueItem";
import priceComponent from '@/components/priceComponent'
import { useStore } from "vuex";

export default {
     components: {
          SpecValueItem,
          SpecCheckIcon,
          priceComponent
     },
     props: {
          specs: Array,
          specProductList: Array,
          defaultProduct: Object,
          staticInfo: Object
     },


     setup (props, { emit }) {
          const iconRotate = ref('el-icon-arrow-down')
          const specListNum = ref(0)
          const chosenSpecList = ref([])
          const { proxy } = getCurrentInstance();
          const L = proxy.$getCurLanguage()
          const lastSpecObject = reactive({
               specId: 0,
               specValueId: '',
               targetProId: 0
          })
          const isLastChosen = ref(true)
          const lastSpecInfo = ref({})
          const lastSpecValueList = ref([])

          const dfSpecValArr = ref([]),
               dfSpecValArrPop = ref(0)

          const specsLocal = ref([])

          const specIdMap = new Map()

          //选中规格值
          const selectSpecVal = (specItem, specVal) => {

               if (specItem.checkState == 3) {
                    return
               }


               isLastChosen.value = false
               let choiceSpecIds = [];
               specsLocal.value.forEach((item) => {
                    if (item.specId != specItem.specId) {
                         item.specValueList.forEach((item1) => {
                              if (item1.checkState == "1") {
                                   // checkState: 1-选中，2-可选，3-禁用
                                   choiceSpecIds.push(item1.specValueId);
                              }
                         });
                    } else {
                         choiceSpecIds.push(specVal.specValueId);
                    }
               });
               choiceSpecIds.push(dfSpecValArrPop.value)
               lastSpecObject.targetProId = props.specProductList.find(i => i.specValueIds == choiceSpecIds.join(',')).productId
               emit('selectSpecVal', lastSpecObject.targetProId)
          }

          //选中规格值(最后的规格)
          const selectLastSpecVal = (specVal) => {
               if (specVal.checkState == 2) {
                    let choiceSpecIds = [...dfSpecValArr.value, specVal.specValueId]
                    lastSpecObject.targetProId = props.specProductList.find(i => i.specValueIds == choiceSpecIds.join(',')).productId
                    isLastChosen.value = true
                    emit('selectSpecVal', lastSpecObject.targetProId)
               } else {
                    let targetIdx = chosenSpecList.value.findIndex(i => i.productId == specVal.productId)
                    let alternaPro
                    if (targetIdx - 1 > -1) {
                         alternaPro = chosenSpecList.value[targetIdx - 1].productId
                         chosenSpecList.value.splice(targetIdx, 1)
                         emit('selectSpecVal', alternaPro)
                    } else if (targetIdx + 1 < chosenSpecList.value.length) {
                         alternaPro = chosenSpecList.value[targetIdx + 1].productId
                         chosenSpecList.value.splice(targetIdx, 1)
                         emit('selectSpecVal', alternaPro)
                    } else {
                         lastSpecValueList.value.map((item) => {
                              if (item.productId == chosenSpecList.value[targetIdx].productId) {
                                   item.checkState = 2
                                   item.currentSpecNum = ''
                              }
                         })
                         chosenSpecList.value.splice(targetIdx, 1)
                    }

               }

          }

          //用chosenSpecList来计算合计，考虑阶梯价
          const totalPrice = computed(() => {
               if (chosenSpecList.value.length) {
                    let totalNum = chosenSpecList.value.reduce((total, obj) => total + Number(obj.buyNum * obj.productPrice), 0)
                    return Number(totalNum).toFixed(2)
               } else {
                    return 0
               }

          })



          const getCurrentLadderPrice = (price, specVal) => {

               if (props.staticInfo.ladderType == 2) {
                    chosenSpecList.value.map(item => { item.productPrice = price })
               } else {
                    let targetIdx = chosenSpecList.value.findIndex(k => k.productId == specVal.productId)
                    if (targetIdx > -1) {
                         chosenSpecList.value[targetIdx].productPrice = price
                    }
               }

          }


          const totalNum = computed(() => {
               let totalNums = chosenSpecList.value.reduce((total, obj) => total + Number(obj.buyNum), 0)
               return totalNums
          })

          const getNowLadderPrice = (number, ladderRawString) => {

               const ladderPriceArr = ladderRawString.split(",").map(a => a.split('-'))

               for (let ladder of ladderPriceArr) {
                    if (number >= Number(ladder[0])) {
                         return ladder[1]
                    }
               }
          }

          

          onMounted(() => {
               handleChosenSpecs()
          })


          watch(() => [props.specProductList, props.specs], () => {
               handleChosenSpecs()
          })

          watch(totalNum, (nv, ov) => {
               if (nv != ov) {
                    emit('changeNum', nv)
               }
          })

          const setSpecId = (specId, specValueList) => {
               if (specIdMap.has(specId)) {
                    return
               }
               let checked = specValueList.find(i => i.checkState == 1)
               specIdMap.set(specId, checked.specValueId)
          }


          //对 选中的规格值 和 规格值枚举列表比对（选中规格值组合中除开最后一个规格的规格值固定匹配）
          const handleChosenSpecs = () => {
               let { defaultProduct, specProductList } = props
               
               if (isLastChosen.value) {//判断已选清单里有没有该规格，没有就加进去,前提是最后一个规格选择
                    addIntoList(defaultProduct)
               }

               props.specs.forEach(item => { setSpecId(item.specId, item.specValueList) })

               specsLocal.value = JSON.parse(JSON.stringify(props.specs))

               let lastSpec = specsLocal.value.pop() //取出规格列表的最后一个规格，同时规格列表也将最后一个规格去掉
               
               lastSpecObject.specId = lastSpec.specId
               dfSpecValArr.value = defaultProduct.specValueIds.split(',')//将选中规格值字符串组合分割成数组
               dfSpecValArrPop.value = dfSpecValArr.value.pop() //取出选中规格组合的最后一个规格值，同时选中规格组合列表也将最后一个规格值去掉



               //由于要给 specValueList 每个项进行重构，得拆解这最后一个规格lastSpec进行逐一赋值
               for (let key in lastSpec) {
                    if (key == 'specValueList') {
                         lastSpecValueList.value = lastSpec.specValueList.map((i) => {
                              let specValCombine = dfSpecValArr.value.concat([i.specValueId]).join(',')
                              
                              let specProInfo = specProductList.find(pro => pro.specValueIds == specValCombine) //从specProductList找出该规格值对应的sku商品信息
                              
                              //同时从已选清单里找出有没有这个sku规格,有的话将checkState置为1(选择)，并将数量同步过去，否则不是为checkState为3(失效)的话，置为2(不选择)
                              let isSpecExist = chosenSpecList.value.findIndex(i => i.specValueIds == specValCombine)
                              if (isSpecExist > -1) {
                                   i.checkState = 1
                                   i.currentSpecNum = chosenSpecList.value[isSpecExist].buyNum
                              } else if (i.checkState != 3) {
                                   i.checkState = 2
                              }

                              if (props.staticInfo.produceState != 1) {
                                   // eslint-disable-next-line
                                   // specProInfo.productStock = MAX_PRODUCT_STOCK
                              }

                              let obj = {
                                   ...i,
                                   ...specProInfo
                              }
                              return obj
                         }) //同时将此规格下的规格值列表进行重构，每个规格值保留规格值Id和规格值名，同时 加入该规格值Id和其他规格中选中的规格值Id的组合
                    } else {
                         lastSpecInfo.value[key] = lastSpec[key]
                    }
               }

          }

          //加入已选清单
          const addIntoList = (specValueInfo) => {
               let index = chosenSpecList.value.findIndex(i => i.specValueIds == specValueInfo.specValueIds)
               if (index < 0) {
                    let localspecValueInfo = {
                         buyNum: props.staticInfo.minBuyNum,
                         specValueIds: specValueInfo.specValueIds,
                         specValues: specValueInfo.specValues,
                         getSpecValuesList: specValueInfo.specValues.split(','),
                         productId: specValueInfo.productId,
                         productStock: specValueInfo.productStock,
                         productPrice: specValueInfo.productPrice,
                         takeOffNum: specValueInfo.takeOffNum
                    }


                    if (props.staticInfo.produceState != 1) {
                         // eslint-disable-next-line
                         localspecValueInfo.productStock = MAX_PRODUCT_STOCK
                    }

                    if (specValueInfo.ladderPrice) {
                         localspecValueInfo.productPrice = getNowLadderPrice(localspecValueInfo.buyNum, specValueInfo.ladderPrice)
                    }


                    if (localspecValueInfo.productStock > 0) {
                         chosenSpecList.value.push(localspecValueInfo)
                    }
               }
          }


          //改变数量按钮样式（规格）
          const editNumSpec = (type, specVal) => {
               let { currentSpecNum, productStock, takeOffNum } = specVal
               takeOffNum = takeOffNum ?? 1
               let maxBuyNum = Math.min(productStock, 99999)
               let { minBuyNum } = props.staticInfo
               switch (type) {
                    case 'reduce': {
                         if (specVal.currentSpecNum <= minBuyNum) {
                              ElMessage(L['最低限购'] + minBuyNum + (props.staticInfo.saleUnit ? props.staticInfo.saleUnit : ""));
                              return
                         } else {
                              specVal.currentSpecNum -= takeOffNum
                         }
                         break
                    }
                    case 'edit': {
                         if ((!/^[1-9]\d*$/.test(currentSpecNum) && currentSpecNum)) {
                              specVal.currentSpecNum = minBuyNum
                         } else if (specVal.currentSpecNum > maxBuyNum) {
                              specVal.currentSpecNum = maxBuyNum;
                              ElMessage(L['超过购买限制']);
                         }
                         break
                    }
                    case 'add': {

                         specVal.currentSpecNum += takeOffNum
                         if (specVal.currentSpecNum > maxBuyNum) {
                              specVal.currentSpecNum = maxBuyNum;
                              ElMessage(L['超过购买限制']);
                         }
                         break;
                    }
                    case 'blur': {
                         if (specVal.currentSpecNum <= minBuyNum) {
                              specVal.currentSpecNum = minBuyNum
                              return;
                         }
                         break;
                    }
               }
               //对已选清单的对应的规格进行数量同步
               if (currentSpecNum) {
                    synchronizeBuyNum(specVal, 'specVal')
               }
          };


          //数量同步
          const synchronizeBuyNum = (spec, type) => {
               switch (type) {
                    case 'specVal': {
                         let targetIdx = chosenSpecList.value.findIndex(k => k.productId == spec.productId)
                         chosenSpecList.value[targetIdx].buyNum = spec.currentSpecNum
                         break
                    }

                    case 'specChosen': {
                         let targetIdx = lastSpecValueList.value.findIndex(k => k.productId == spec.productId)
                         lastSpecValueList.value[targetIdx].currentSpecNum = spec.buyNum
                         break
                    }
               }

          }

          const returnChosenSpec = () => {
               let isLastChosen = lastSpecValueList.value.some(i => i.checkState == 1)
               return { isLastChosen, chosenSpecList: chosenSpecList.value }
          }


          //改变数量按钮样式(已选清单规格)
          const editNumSel = (type, item2) => {

               let { productStock, takeOffNum } = item2
               let maxBuyNum = Math.min(productStock, 99999)
               let { minBuyNum } = props.staticInfo

               switch (type) {
                    case 'reduce': {
                         if (item2.buyNum <= minBuyNum) {
                              return
                         } else {
                              item2.buyNum -= takeOffNum
                         }
                         break
                    }
                    case 'edit': {
                         if ((!/^[1-9]\d*$/.test(item2.buyNum) && item2.buyNum)) {
                              item2.buyNum = minBuyNum
                         } else if (item2.buyNum > maxBuyNum) {
                              item2.buyNum = maxBuyNum;
                              ElMessage(L['超过购买限制']);
                         }
                         break
                    }
                    case 'add': {
                         item2.buyNum += takeOffNum
                         if (item2.buyNum > maxBuyNum) {
                              item2.buyNum = maxBuyNum;
                              ElMessage(L['超过购买限制']);
                         }
                         break;
                    }
                    case 'blur': {
                         if (item2.buyNum <= minBuyNum) {
                              item2.buyNum = minBuyNum
                              return;
                         }
                         break;
                    }
               }

               //规格选择的对应的规格进行数量同步
               if (item2.buyNum) {
                    synchronizeBuyNum(item2, 'specChosen')
               }
          };

          const delChosen = (index, obj) => {
               lastSpecValueList.value.map((item) => {
                    if (item.productId == obj.productId) {
                         item.checkState = 2
                         item.currentSpecNum = ''
                    }
               })
               chosenSpecList.value.splice(index, 1)
          }

          const fold = ref(true)
          const doFold = () => {
               fold.value = !fold.value
          }

          const handlePopover = (type) => {
               iconRotate.value = type == 'show' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          }

          onMounted(() => {
          })
          return {
               handlePopover,
               doFold,
               fold,
               specListNum,
               chosenSpecList,
               selectSpecVal,
               selectLastSpecVal,
               lastSpecObject,
               isLastChosen,
               editNumSpec,
               totalPrice,
               editNumSel,
               delChosen,
               returnChosenSpec,
               lastSpecValueList,
               lastSpecInfo,
               specsLocal,
               totalNum,
               L,
               getCurrentLadderPrice,
               iconRotate,
          }
     }
}
</script>


<style lang="scss">
.spec_list_con {
     flex: 1;
     width: 100%;

     // 商品规格 start
     .goods_spec {
          margin-top: 20px;
          flex-wrap: wrap;

          .goods_spec_pre {
               .goods_spec_pre_title {
                    justify-content: space-between;
                    font-size: 14px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #666666;
                    line-height: 30px;
                    min-width: 62px;
                    word-break: break-all;
                    // letter-spacing: 12px;
               }

               .goods_spec_pre_list {
                    margin-left: 13px;
                    flex-wrap: wrap;

                    .specval_pre {
                         margin-right: 7px;
                         margin-bottom: 20px;

                         .specval_pre_image {
                              width: 48px;
                              height: 48px;
                              border-radius: 3px;
                              background-size: contain;
                              background-repeat: no-repeat;
                              background-position: center;
                         }

                         span {
                              display: inline-block;
                              max-width: 190px;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              background: #ffffff;
                              border: 1px solid #dfdfdf;
                              border-radius: 3px;
                              font-size: 14px;
                              font-family: Microsoft YaHei;
                              font-weight: 400;
                              color: #333333;
                              display: block;
                              padding: 10px 20px;
                              box-sizing: border-box;
                         }
                    }

                    .specval_pre_active {
                         position: relative;

                         span {
                              // display: inline-block;
                              // max-width: 184px;
                              border: 1px solid var(--color_main);
                         }

                         .iconyixuan {
                              position: absolute;
                              bottom: 0px;
                              right: 0px;
                              color: var(--color_main);
                         }

                         .specval_pre_image {
                              border: 1px solid var(--color_main);
                         }
                    }

                    .specval_pre_disabled {
                         position: relative;
                         opacity: 0.2;
                    }
               }

               .last_spec_pre {
                    width: 100%;
                    padding-left: 10px;

                    table {
                         width: 100%;

                         &.fold_state {
                              tr:nth-child(n + 4) {
                                   display: none;
                              }
                         }

                         td {
                              width: 30%;
                              vertical-align: top;
                              padding: 14px 0;
                         }
                    }

                    .last_spec_item {
                         &:not(:last-child) td {
                              border-bottom: 1px dashed #e5e5e5 !important;
                         }

                         &:first-child td {
                              padding-top: 0;
                         }

                         &.single_spec_item td {
                              padding-bottom: 0;
                         }

                         .iconduihao1,
                         .iconyuanquan1 {
                              font-size: 15px;
                              margin-right: 15px;
                              cursor: pointer;
                         }

                         .iconduihao1 {
                              color: var(--color_main);
                         }

                         .specval_pre {
                              margin-right: 7px;
                              width: fit-content;

                              .specval_pre_image {
                                   width: 48px;
                                   height: 48px;
                                   border-radius: 3px;
                                   background-size: contain;
                                   background-repeat: no-repeat;
                                   background-position: center;
                              }

                              span {
                                   max-width: 190px;
                                   color: #333333;
                                   font-size: 14px;
                                   font-family: Microsoft YaHei;
                                   font-weight: 400;
                                   background: #ffffff;
                                   border: 1px solid #dfdfdf;
                                   border-radius: 3px;
                                   box-sizing: border-box;
                                   line-height: 1.6;
                                   white-space: normal;
                                   padding: 4px 10px;
                                   display: -webkit-box;
                                   -webkit-box-orient: vertical;
                                   -webkit-line-clamp: 2;
                                   overflow: hidden;
                                   word-break: break-all;
                                   text-overflow: ellipsis;
                                   cursor: default;
                              }
                         }

                         .specval_pre_active {
                              position: relative;

                              span {
                                   // display: inline-block;
                                   // max-width: 184px;
                                   border: 1px solid var(--color_main);
                              }

                              .iconyixuan {
                                   position: absolute;
                                   bottom: -0.5px;
                                   right: 0.5px;
                                   color: var(--color_main);
                              }
                         }

                         .specval_pre_disabled {
                              position: relative;
                              opacity: 0.2;
                         }

                         .goodsSpec {
                              font-size: 14px;
                              font-family: SourceHanSansCN-Regular;
                              color: #333333;
                              margin-left: 30px;
                         }

                         .product_stock {
                              font-weight: 400;
                              font-size: 12px;
                              color: #999999;
                              line-height: 18px;
                              margin-top: 3px;
                         }

                         .product_price {
                              font-size: 16px;
                              font-family: Source Han Sans CN;
                              font-weight: bold;
                              line-height: 17px;
                              color: var(--color_price);
                              margin-right: 20px;
                              text-align: center;
                              margin-top: 6px
                         }

                         .quantity_inventory {
                              margin-top: 0;
                         }
                    }
               }

               // 数量加减及库存 start
               .quantity_inventory_multi {
                    .quantity_title {
                         font-size: 14px;
                         font-family: Microsoft YaHei;
                         font-weight: 400;
                         color: #666666;
                         line-height: 30px;
                         letter-spacing: 12px;
                    }

                    .quantity_edit {
                         border: 1px solid #dfdfdf;
                         position: relative;
                         border-radius: 3px;
                         overflow: hidden;
                         font-weight: bold;

                         span {
                              -moz-user-select: none;
                              /*火狐*/
                              -webkit-user-select: none;
                              /*webkit浏览器*/
                              -ms-user-select: none;
                              /*IE10*/
                              user-select: none;
                              display: block;
                              width: 30px;
                              height: 30px;
                              border: none;
                              border-radius: 3px;
                              text-align: center;
                              line-height: 29px;
                              cursor: pointer;
                              font-size: 16px;
                              color: #333333;
                         }

                         input {
                              width: 48px;
                              height: 30px;
                              border: none;
                              border-left: 1px solid #ddd;
                              border-right: 1px solid #ddd;
                              text-align: center;
                              cursor: pointer;
                         }

                         /*** 消除input元素 type="number" 时默认的 加减按钮*/
                         input[type="number"]::-webkit-inner-spin-button,
                         input[type="number"]::-webkit-outer-spin-button {
                              -webkit-appearance: none;
                              margin: 0;
                         }

                         /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
                         input[type="number"] {
                              -moz-appearance: textfield;
                         }
                    }

                    .inventory {
                         font-size: 12px;
                         font-family: Microsoft YaHei;
                         font-weight: 400;
                         color: $colorH;
                         line-height: 30px;
                         margin-left: 17px;
                    }
               }


               .disable_mask {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.5);
               }


               .code_text {
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    font-size: 11px;
                    color: #999999;
                    line-height: 14px;
                    margin-top: 5px;
               }

               .more_hide {
                    border-top: 1px dashed #E5E5E5;
                    margin-top: -2px;

                    .more_hide_icon {
                         cursor: pointer;
                         width: 36px;
                         height: 20px;
                         background: #ffffff;
                         border: 1px solid #dfdfdf;
                         border-top: 0;
                         opacity: 1;
                         border-radius: 0px 0px 4px 4px;
                         color: #999999;
                         font-weight: bold;
                         margin-top: -1px;
                    }
               }
          }
     }

     .series {
          .series_title {
               min-width: 62px;
               font-size: 14px;
               font-family: Microsoft YaHei;
               font-weight: 400;
               color: #666666;
          }

          .series_go {
               display: inline-block;
               border-bottom: 1px solid var(--color_main);
               color: var(--color_main);
               cursor: pointer;

               &.skeleton_series_go {
                    width: 64px;
                    height: 18px;
                    background: $colorSkeleton;
                    border-bottom: none;
               }
          }

          .series_total {
               font-size: 20px;
               font-family: SourceHanSansCN-Regular, SourceHanSansCN;
               font-weight: 400;
               color: var(--color_price);

               &.skeleton_series_total {
                    width: 74px;
                    height: 23px;
                    background: $colorSkeleton;
                    color: $colorSkeleton;
               }
          }

          .choose_num {
               margin-left: 10px;
               margin-top: 2px;

               span {
                    color: #666
               }
          }

          .select_vals {
               font-size: 14px;
               font-family: SourceHanSansCN-Regular;
               line-height: 21px;
               color: var(--color_main);
               cursor: pointer;
               margin-right: 20px;
               transition: all 0.3s;

               .el-icon-arrow-down,
               .el-icon-arrow-up {
                    margin-left: 5px;
                    font-weight: bold;
               }
          }
     }




}

.line_label {
     margin-top: 26px;
     padding-left: 20px;

     .label_title {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #666666;
          min-width: 52px
     }

     .series_go {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          text-decoration: underline;
          color: #333333;
          cursor: pointer
     }
}

.select_list {
     .left_scroll {
          flex: 1;
          overflow: auto;

          .chosen_specs {
               height: 50px;

               .spec_item {
                    width: 100px;
                    text-align: center;
               }
          }
     }

     .right_operate {
          .op_item {
               height: 50px;
          }

          .quantity_edit {
               border: 1px solid #dddddd;
               margin-left: 10px;

               span {
                    -moz-user-select: none;
                    /*火狐*/
                    -webkit-user-select: none;
                    /*webkit浏览器*/
                    -ms-user-select: none;
                    /*IE10*/
                    user-select: none;
                    display: block;
                    width: 26px;
                    height: 30px;
                    border: none;
                    border-radius: 3px;
                    text-align: center;
                    line-height: 30px;
                    cursor: pointer;
               }

               input {
                    width: 48px;
                    height: 30px;
                    border: none;
                    border-left: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    text-align: center;
                    cursor: pointer;
               }

               /*** 消除input元素 type="number" 时默认的 加减按钮*/
               input[type="number"]::-webkit-inner-spin-button,
               input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
               }

               /*** 消除input元素 type="number" 时默认的 加减按钮---moz版*/
               input[type="number"] {
                    -moz-appearance: textfield;
               }
          }

          .del_chosen {
               font-size: 14px;
               font-family: SourceHanSansCN-Regular;
               line-height: 21px;
               color: var(--color_main);
               margin-left: 30px;
               cursor: pointer;
          }
     }
}
</style>