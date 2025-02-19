<!--
 * @Author: wangwei
 * @Date: 2020-12-28 16:06:28
 * @LastEditTime: 2024-09-20 11:13:53
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/member/order/List.vue
-->
<template>
  <div class="sld_order_list">
    <MemberTitle :memberTitle="L['我的订单']"></MemberTitle>
    <div class="container">
      <h3>{{ L['我的订单'] }}</h3>
      <div class="sld_order_nav">
        <div class="sld_order_nav_con1 flex_row_start_center pointer sld_order_tag" :class="curLang == 'zh' ? 'zh' : ''">
          <div :class="{ item: true, active: current_state == '' }" @click="changeState('')">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['全部订单']"
                placement="top-start"
              >
                <span>{{ L['全部订单'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['全部订单'] }}</template>
          </div>
          <div :class="{ item: true, active: current_state == 10 }" @click="changeState(10)">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['待支付']"
                placement="top-start"
              >
                <span>{{ L['待支付'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['待支付'] }}</template>
            <div class="item_tag"
              v-if="memberInfo.toPaidOrder > 0">{{ memberNumber('toPaidOrder') }}</div>
          </div>
          <div :class="{ item: true, active: current_state == '20,23' }" @click="changeState('20,23')">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['待发货']"
                placement="top-start"
              >
                <span>{{ L['待发货'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['待发货'] }}</template>
            <div class="item_tag" :class="{
    }" v-if="memberInfo.toDeliverOrder > 0">{{ memberNumber('toDeliverOrder') }}</div>
          </div>
          <div :class="{ item: true, active: current_state == 25 }" @click="changeState(25)">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['声明发货']"
                placement="top-start"
              >
                <span>{{ L['声明发货'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['声明发货'] }}</template>
            <div class="item_tag" :class="{
    }" v-if="memberInfo.toEvaluateOrder > 0">{{ memberNumber('toEvaluateOrder') }}</div>
          </div>
          <div :class="{ item: true, active: current_state == 30 }" @click="changeState(30)">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['待收货']"
                placement="top-start"
              >
                <span>{{ L['待收货'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['待收货'] }}</template>
            <div class="item_tag" :class="{
    }" v-if="memberInfo.toReceivedOrder > 0">{{ memberNumber('toReceivedOrder') }}</div>
          </div>
          <div :class="{ item: true, active: current_state == 31 }" @click="changeState(31)">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['部分发货']"
                placement="top-start"
              >
                <span>{{ L['部分发货'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['部分发货'] }}</template>
            <div class="item_tag"
              v-if="memberInfo.toPartReceivedOrder > 0">{{ memberNumber('toPartReceivedOrder') }}</div>
          </div>
          <div :class="{ item: true, active: current_state == '35,40' && evaluate_state != 1 }" @click="changeState('35,40')">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['已完成']"
                placement="top-start"
              >
                <span>{{ L['已完成'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['已完成'] }}</template>
          </div>
          <div :class="{ item: true, active: current_state == 40 && evaluate_state == 1 }" @click="changeState(40, 1)">
            <template v-if="curLang != 'zh'">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="L['待评价']"
                placement="top-start"
              >
                <span>{{ L['待评价'] }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ L['待评价'] }}</template>
            <div class="item_tag"
              v-if="memberInfo.toEvaluateOrder > 0">{{ memberNumber('toEvaluateOrder') }}</div>
          </div>
        </div>
        <div class="search_con flex_row_between_center search_info">
          <div class="search_incon1 flex_row_start_center">
            <el-input class="search_input" 
              v-model="keyword" 
              :placeholder="L['订单号/商品名称']" 
              clearable
              @clear="clear"
              ></el-input>
            <div class="search pointer" @click="getOrderList">{{ L['搜索'] }}</div>
          </div>
        </div>
      </div>
      <div class="order_title_info flex_row_start_center all_order_info">
        <el-select 
          v-model="selectTime" 
          placeholder="请选择" 
          @change="changeTime" 
          v-if="selectList.data.length > 0"
          class="select_el" 
          :popper-append-to-body="false"
          >
          <el-option v-for="item in selectList.data" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <div class="time_select select_time">{{ L['订单详情'] }}</div>
        <div class="good_price">{{ L['单价'] }}</div>
        <div class="num">{{ L['数量'] }}</div>
        <div class="order_price">{{ L['订单金额'] }}</div>
        <div class="state">{{ L['状态'] }}</div>
        <div class="oprate">{{ L['操作'] }}</div>
      </div>
      <div class="order_item" v-for="(orderItem, index) in order_list.data" :key="index">
        <div class="title flex_row_start_center">
          <div>{{ L['下单时间'] }}：{{ orderItem.createTime }}</div>
          <div class="order_num" @click="goDetail(orderItem)">{{ L['订单号'] }}: {{ orderItem.orderSn }}</div>
          <!-- <div class="store_name" @click="toStore(orderItem.supplierStoreId)">{{ orderItem.supplierStoreName }}</div> -->
           <div @click="toKefu(orderItem)" class="order-box">
            <div class="store_name">{{ L['联系客服'] }}</div>
            <div class="store_service">
              <dynaIcon src="goods/server.png" class="store_service_img" color="--color_main" width="18" height="18">
              </dynaIcon>
            </div>
           </div>
        </div>
        <div class="good_info_con flex_row_start_center">
          <div class="good_info flex_column_center_start">
            <div class="item flex_row_start_center" v-for="(goodItem, index) in orderItem.orderProductList"
              :key="index">
              <div class="good flex_row_start_center">
                <div class="left">
                  <div class="virtual_tag" v-if="orderItem.isVirtualGoods == 2">虚拟</div>
                  <coverImage width="100" height="100" :src="goodItem.productImage"
                    @click="goGoodsDetail(orderItem, index)"></coverImage>
                </div>

                <div class="right">
                  <div class="good_name overflow_ellipsis_two" @click="goGoodsDetail(orderItem, index)">{{
      goodItem.goodsName }}</div>

                  <div class="spec overflow_ellipsis">{{ goodItem.specValues }}</div>
                </div>
              </div>
              <div class="good_price">R${{ $formatMoneyNum(goodItem.productShowPrice) }}</div>
              <div class="num">*{{ goodItem.productNum }}</div>
            </div>
          </div>
          <div class="order_price flex_row_center_center">R${{ $formatMoneyNum(orderItem.totalMoney) }}</div>
          <div class="state flex_column_center_center">
            <span class="state_value">{{ orderItem.orderStateValue }}</span>
          </div>
          <div class="oprate flex_column_center_center">
            <span class="detail" @click="goDetail(orderItem)">{{ L['订单详情'] }}</span>
            <!-- 待付款、待发货订单可以修改地址 -->
            <div v-if="orderItem.orderState == 10 && orderItem.isVirtualGoods == 1"
              class="action-btn flex_row_center_center" @click="editAddress(orderItem)">{{ L['修改地址'] }}</div>
            <!-- 待收货、已完成订单可以查看物流 -->
            <div
              v-if="(orderItem.orderState == 30 || orderItem.orderState == 40 || orderItem.orderState == 31) && orderItem.isVirtualGoods == 1"
              class="action-btn flex_row_center_center" @click="lookLogistics(orderItem.orderSn)">{{ L['查看物流'] }}</div>
            <!-- 待收货订单可以确认收货 -->
            <template v-if="orderItem.orderState == 30">
              <div class="action-btn recom flex_row_center_center" @click="confirmReceipt(orderItem)">{{ L['确认收货'] }}
              </div>
            </template>

            <!-- 待评价订单可以评价 -->
            <template v-if="orderItem.orderState == 40 && orderItem.evaluateState != 3">
              <div class="action-btn recom flex_row_center_center" @click="remainEvaluated(orderItem)">{{ L['评价'] }}
              </div>
            </template>

            <!-- 待付款订单可以取消订单 -->
            <template v-if="orderItem.orderState == 10">
              <div class="action-btn flex_row_center_center" @click="showSelectReasonDialog(orderItem)">{{ L['取消订单'] }}
              </div>
            </template>

            <!-- 待付款订单可以立即支付 -->
            <template
              v-if="orderItem.orderState == 10 && !((orderItem.orderType == 105 || orderItem.orderType == 103) && orderItem.orderSubState == 102 && orderItem.depositRemainTime > 0)">
              <div class="action-btn recom flex_row_center_center" @click="goPay(orderItem)">{{ L['立即支付'] }}
              </div>
            </template>

            <!-- 已取消、全部评价完成订单可以删除订单 -->
            <template v-if="orderItem.orderState == 0 || (orderItem.orderState == 40 && orderItem.evaluateState == 3)">
              <div class="action-btn flex_row_center_center" @click="delOrder(orderItem.orderSn)">{{ L['删除订单'] }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <el-pagination @current-change="handleCurrentChange" :currentPage="pageData.current"
        :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
        :hide-on-single-page="true" class="flex_row_end_center"></el-pagination>
      <SldCommonEmpty v-if="order_list.data.length == 0" :tip="L['暂无订单～']" totalWidth="934px" paddingTop="200"
        totalHeight="713" />
      <!-- 取消理由弹窗 start -->
      <el-dialog :title="L['取消订单理由']" v-model="cancel_order" customClass="select_reason_width"
        :before-close="(current_reason_id = '')" lock-sroll="false">
        <div class="cancel_list_con">
          <div v-for="(reasonItem, index) in cancel_list.data" :key="index" :class="{
      reason_item: true,
      flex_row_between_center: true,
      active: current_reason_id == reasonItem.reasonId
    }" @click="selectReason(reasonItem.reasonId)">
            <span class="reason_text">{{ reasonItem.content }}</span>
            <div style="cursor:pointer">
              <dynaIcon mode="iconfont"
                :icon="current_reason_id == reasonItem.reasonId ? 'iconduihao1' : 'iconyuanquan1'"
                :color="current_reason_id == reasonItem.reasonId ? '--color_vice' : '#999'" class="img"></dynaIcon>
            </div>
          </div>
        </div>
        <div class="confirm_cancel_btn" @click="confirmCancel()">{{ L['确定'] }}</div>
      </el-dialog>
      <!--  取消地址理由弹窗 end  -->

      <!-- 地址选择弹窗 start -->
      <el-dialog :title="L['更换地址']" v-model="show_select_address" customClass="select_address_width"
        :before-close="handleClose" lock-sroll="false">
        <div>
          <div class="out_stock_dialog address_con">
            <div v-for="(item, index) in address_list.data" :key="index" @click="selectAddress(index)" :class="{
      address_item: true,
      flex_column_start_start: true,
      select: current_address_index == index
    }">
              <span>{{ L['收货人'] }}：{{ item.receiverName }}</span>
              <span>{{ L['联系方式'] }}：{{ item.receiverMobile }}</span>
              <span class="address_text">
                <div>{{ L['收货地址'] }}：</div>
                <div>{{ item.addressAll }} {{ item.detailAddress }}</div>
              </span>

              <dynaIcon src="buy/corner_icon.png" width="23" height="22" color="--color_vice" class="selected"
                v-if="current_address_index == index"></dynaIcon>
            </div>
          </div>
          <div class="btn_con flex_row_center_center">
            <div class="confirm_cancel_btn" @click="confirmChangeAddress()">{{ L['提交修改'] }}</div>
          </div>
        </div>
      </el-dialog>
      <!-- 地址选择弹窗 end -->
    </div>
  </div>
</template>
<script>
import { reactive, getCurrentInstance, ref, onMounted, computed } from 'vue'
import {
  ElInput,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import SldCommonEmpty from '../../../components/SldCommonEmpty'
import MemberTitle from '../../../components/MemberTitle'
export default {
  name: 'order-list',
  components: {
    ElInput,
    SldCommonEmpty,
    MemberTitle,
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const current_state = ref('') //当前列表订单状态
    const evaluate_state = ref(0) //是否是待评价
    const order_list = reactive({ data: [] })
    const orderSn = ref('')
    const cancel_order = ref(false) //是否显示取消订单弹窗
    const not_select = require('../../../assets/order/not_select.png')
    const selected = require('../../../assets/order/selected.png')
    const invoice_selected = require('../../../assets/buy/invoice_selected.png')
    const cancel_list = reactive({ data: [] })
    const current_reason_id = ref() //记录当前已选择理由id
    const order_sn = ref() //记录当前操作的订单号
    const parentOrderSn = ref()
    const show_select_address = ref(false) //是否显示选择地址弹窗
    const address_list = reactive({ data: [] }) //地址列表
    const current_address_index = ref(0) //记录当前选择的地址
    const selectTime = ref('')
    const selectList = reactive({ data: [] })
    const pageData = reactive({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const keyword = ref('')
    const memberInfo = computed(() => store.state.memberInfo)
    const curLang = computed(() => store.state.curLang);

    //去商品详情页
    const goGoodsDetail = (item, index) => {
      proxy.$goGoodsDetail(item.orderProductList[index].productId)
    }
    //去供应商详情
    const toStore = storeId => {
      if (storeId == 0) {
        return
      }
      proxy.$goStoreDetail(storeId)
    }
    //获取下拉时间
    const getTime = () => {
      proxy.$get('v3/supplier/channel/orderInfo/timeList').then(res => {
        if (res.data.length > 0) {
          selectList.data = res.data
          selectTime.value = selectList.data[0].id
        }
      })
    }
    //切换搜索时间
    const changeTime = () => {
      resetPageData()
      getOrderList()
    }
    //重置搜索页面数据
    const resetPageData = () => {
      pageData.current = 1
      pageData.total = 0
    }
    //改变订单状态
    const changeState = (orderState, evaluateState) => {
      if (evaluateState) {
        evaluate_state.value = evaluateState
      } else {
        evaluate_state.value = ''
      }
      current_state.value = orderState
      pageData.current = 1
      router.push({
        path: '/member/order/list',
        query: {
          orderState,
          evaluateState
        }
      })
      getOrderList()
    }
    //获取订单列表
    const getOrderList = () => {
      var param = {}
      if (evaluate_state.value == 1) {
        param.evaluateState = 1
      }
      if (current_state.value) {
        param.orderState = current_state.value
      }
      param.current = pageData.current
      param.pageSize = pageData.pageSize
      if (orderSn.value) {
        param.orderSn = orderSn.value
      }
      param.time = selectTime.value
      if (keyword.value) {
        param.keyword = keyword.value
      }
      proxy
        .$get('v3/supplier/channel/orderInfo/list', param)
        .then(res => {
          if (res.state == 200) {
            order_list.data = res.data.list
            pageData.total = res.data.pagination.total
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    // 获取订单取消理由列表
    const getCancelList = () => {
      proxy
        .$get('v3/system/common/list', {
          type: 104
        })
        .then(res => {
          if (res.state == 200) {
            cancel_list.data = res.data
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    //选择理由
    const selectReason = id => {
      current_reason_id.value = id
    }
    //显示选择理由弹窗
    const showSelectReasonDialog = (orderItem) => {
      if (
        !orderItem.isRefundDeposit &&
        (orderItem.orderType == 105 || orderItem.orderType == 103) &&
        orderItem.orderSubState == 102
      ) {
        ElMessageBox.confirm(L['取消该订单定金不予退还,确定取消?'], L['提示'], {
          confirmButtonText: L['确定'],
          cancelButtonText: L['取消'],
          type: 'warning'
        }).then(() => {
          cancel_order.value = true
          parentOrderSn.value = orderItem.parentSn
        })
      } else {
        cancel_order.value = true
        parentOrderSn.value = orderItem.parentSn
      }
    }
    //显示查看物流信息
    const lookLogistics = orderSn => {
      router.push(`/member/order/detail?orderSn=${orderSn}#logistics`)
    }

    //删除订单
    const delOrder = orderSn => {
      ElMessageBox.confirm(L['确认删除该订单?'], L['提示'], {
        confirmButtonText: L['确定'],
        cancelButtonText: L['取消'],
        type: 'warning'
      })
        .then(() => {
          proxy
            .$post('v3/supplier/channel/orderOperate/delete', {
              orderSn
            })
            .then(res => {
              if (res.state == 200) {
                ElMessage.success(L['删除订单成功'])
                getOrderList()
                getInitInfo()
              } else {
                ElMessage(res.msg)
              }
            })
            .catch(() => {
              //异常处理
            })
        })
        .catch(() => { })
    }
    //确认取消订单
    const confirmCancel = () => {
      if (!current_reason_id.value) {
        ElMessage.warning(L['请选择取消理由'])
        return
      }
      let current_reason_target = cancel_list.data.find(i => i.reasonId == current_reason_id.value)

      proxy
        .$post('v3/supplier/channel/orderOperate/cancel', {
          parentSn: parentOrderSn.value,
          refuseReason: current_reason_target.content
        })
        .then(res => {
          if (res.state == 200) {
            ElMessage.success(L['取消订单成功'])
            cancel_order.value = false
            getOrderList()
            getInitInfo()
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    //确认收货
    const confirmReceipt = (item) => {
      ElMessageBox.confirm(L['确认收货?'], L['提示'], {
        confirmButtonText: L['确定'],
        cancelButtonText: L['取消'],
        type: 'warning'
      }).then(() => {
        proxy
          .$post('v3/supplier/channel/orderOperate/receive', {
            orderSn: item.orderSn,
          })
          .then(res => {
            if (res.state == 200) {
              ElMessage.success(L['确认收货成功'])
              getOrderList()
              getInitInfo()
            } else {
              ElMessage(res.msg)
            }
          })
      })
    }
    //立即支付
    const goPay = (item) => {
      router.push({
        path: '/buy/pay',
        query: {
          paySn: item.paySn,
          payFrom: 2
        }
      })
    }
    //选择地址
    const editAddress = order => {
      show_select_address.value = true
      order_sn.value = order.orderSn
      let index = address_list.data.findIndex(i => {
        let { addressAll, receiverName, receiverMobile, detailAddress } = i
        if (
          receiverName == order.receiverName &&
          receiverMobile == order.receiverMobile &&
          detailAddress == order.receiverAddress &&
          addressAll == order.receiverAreaInfo
        ) {
          return true
        } else {
          return false
        }
      })

      if (index > -1) {
        current_address_index.value = index
      } else {
        current_address_index.value = -1
      }
    }
    //获取地址列表
    const getAddressList = () => {
      proxy.$get('v3/supplier/channel/userAddress/list').then(res => {
        if (res.state == 200) {
          address_list.data = res.data.list
        } else {
          ElMessage(res.msg)
        }
      })
    }
    //切换地址
    const selectAddress = index => {
      current_address_index.value = index
    }
    //确认修改地址
    const confirmChangeAddress = () => {
      proxy
        .$post('v3/supplier/channel/orderOperate/updateAddress', {
          orderSn: order_sn.value,
          addressId: address_list.data[current_address_index.value].addressId
        })
        .then(res => {
          if (res.state == 200) {
            ElMessage.success(L['切换地址成功'])
            show_select_address.value = false
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    //评价订单
    const remainEvaluated = (item) => {
      router.push({
        path: '/member/order/evaluate',
        query: {
          orderSn: item.orderSn
        }
      })
    }
    //详情
    const goDetail = (item) => {
      router.push({
        path: '/member/order/detail',
        query: {
          orderSn: item.orderSn
        }
      })
    }
    //向前翻页
    const handlePrevCilickChange = e => {
      pageData.current = e
      getOrderList()
    }
    //向后翻页
    const handleNextCilickChange = () => {
      pageData.current++
      getOrderList()
    }
    //页数改变
    const handleCurrentChange = current => {
      pageData.current = current
      getOrderList()
    }
    const getInitInfo = () => {
      //获取会员信息数据
      proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
        if (res.state == 200) {
          memberInfo.value = Object.assign(memberInfo.value, res.data)
          store.commit('updateMemberInfo', memberInfo.value) //将进货单数据存储到vuex的store中
        }
      })
    }
    onMounted(() => {
      if (route.query.orderState) {
        current_state.value = route.query.orderState
      } else {
        current_state.value = ''
      }
      if (route.query.evaluateState) {
        evaluate_state.value = route.query.evaluateState
      } else {
        evaluate_state.value = ''
      }
      getTime()
      getOrderList()
      getCancelList()
      getAddressList()
    })
    //清空搜索订单
    const clear = () => {
      orderSn.value = ''
      getOrderList()
    }

    const toKefu = item => {
      let chatInfo = {
        storeId: item.storeId,
        vendorAvatar: item.storeLogo,
        storeName: item.storeName,
        source: L['从订单列表进入']
      }
      store.commit('saveChatBaseInfo', chatInfo)

      let newWin = router.resolve({
        path: '/service',
        query: {
          vid: item.storeId
        }
      })

      window.open(newWin.href, '_blank')
    }

    const memberNumber = type => {
      return memberInfo.value[type] < 99 ? memberInfo.value[type] : '99+'
    }

    router.beforeEach((to, from, next) => {
      if (to.query.orderState) {
        current_state.value = to.query.orderState
      } else {
        current_state.value = ''
      }
      if (to.query.evaluateState) {
        evaluate_state.value = to.query.evaluateState
      } else {
        evaluate_state.value = ''
      }
      if (to.path == '/member/order/list') {
        getOrderList()
        getInitInfo()
      }
      next()
    })

    return {
      current_state,
      changeState,
      evaluate_state,
      getOrderList,
      order_list,
      orderSn,
      cancel_order,
      not_select,
      selected,
      cancel_list,
      current_reason_id,
      selectReason,
      confirmCancel,
      showSelectReasonDialog,
      delOrder,
      lookLogistics,
      confirmReceipt,
      goPay,
      show_select_address,
      address_list,
      invoice_selected,
      current_address_index,
      selectAddress,
      editAddress,
      confirmChangeAddress,
      remainEvaluated,
      goDetail,
      L,
      goGoodsDetail,
      toStore,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      pageData,
      clear,
      toKefu,
      selectTime,
      selectList,
      getTime,
      changeTime,
      resetPageData,
      keyword,
      memberInfo,
      memberNumber,
      curLang,
    }
  }
}
</script>
<style lang="scss">
@import '../../../style/orderList.scss';

.el-select-dropdown__item.is-selected{
  color: var(--color_main);
}
.el-select-dropdown__item{
  font-size: 13px;
}

.el-pager li.active {
  color: var(--color_main);
  cursor: default;
}

.el-pager li:hover {
  color: var(--color_main);
}

.view_more {
  text-align: center;
  margin-top: 10px;

  span {
    cursor: pointer;

    &:hover {
      color: var(--color_main);
    }
  }
}

.sld_order_list {

  .container {
    .sld_order_nav {
      display: flex;
      justify-content: space-between;

      .search_info {
        width: auto;
        border-top: 0;

        .search_input {
          // height: 38px;
          .el-input__wrapper {
            box-shadow: none;
            .el-input__inner {
              box-shadow: none;
            }
          }
        }
      }

      .sld_order_nav_con1 {
        &.zh .item {
          line-height: 42px;
        }
        .item {
          display: -webkit-box;
          padding-left: 8px;
          padding-right: 8px;
          line-height: 28px;
          font-size: 14px;
          text-align: center;
          border-bottom: 0;
          max-width: 96px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;

          &:not(:first-child) {
            border-left: none;
            margin-right: 4px;
          }

          &:hover {
            color: var(--color_main);
          }
        }

        .active {
          color: var(--color_main);
          font-weight: 600;
          position: relative;

          &::after {
            position: absolute;
            content: '';
            left: 0;
            bottom: -1px;
            width: 100%;
            height: 2px;
            background-color: var(--color_main);
          }
        }
      }

      .search_incon1 {
        width: 221px;
        height: 34px;
        background: #ffffff;
        border: 1px solid #e8e8f1;
      }
    }
    .order-box {
      display: flex;
      align-items: center;
    }

    .all_order_info {
      position: relative;

      .select_el {
        position: absolute;
        border: 0;
        left: 20px;
        max-width: 123px;
      }

      .el-select__wrapper {
        border: 0;
        background-color: #f7f7f7;
        max-width: 123px;
        font-size: 13px;
        padding: 0;
        box-shadow: none;
      }

      .el-select-dropdown__item {
        padding: 0;
        font-size: 13px;
        text-align: left;
        padding-left: 10px;

        &::after {
          content: ' ';
          width: 104px;
          height: 1px;
          border-bottom: 1px dotted #c0c4cc;
          opacity: 0.3;
          display: block;
        }

        &:last-child {
          &::after {
            content: '';
            width: 0;
            height: 0;
            border-bottom: 0;
            opacity: 0.3;
            display: block;
          }
        }

        &:hover {
          background-color: transparent;
        }
      }

      .el-select-dropdown__item.hover {
        background-color: transparent;
      }
    }

    .select_time {
      padding-left: 150px;
    }

    .sld_order_tag {
      .item {
        position: relative;
      }

      .item_tag {
        position: absolute;
        background-color: var(--color_price);
        color: #fff;
        top: 4px;
        right: 3px;
        height: 18px;
        display: flex;
        line-height: 19px;
        justify-content: center;
        border-radius: 18px;
        font-size: 12px;
        text-align: center;
        padding: 0 5px;
        font-weight: 500;
      }

      .item_tag_one {
        right: -21px;
      }

      .item_tag_two {
        right: -30px;
      }
    }
  }
}
</style>