<!--
 * @Author: wangwei
 * @Date: 2021-01-04 14:37:27
 * @LastEditTime: 2021-01-13 14:43:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/member/order/Evaluate.vue
-->
<template>
  <div class="sld_order_evaluatist">
    <MemberTitle :memberTitle="L['交易评价/晒单']"></MemberTitle>
    <div class="top_info flex_row_start_center">
      <div class="left flex_column_center_center">
        <div class="evaluating">
          <div>{{ L['待评订单'] }}</div>
          <span class="num">{{ member_info.data.toEvaluateOrder }}</span>
        </div>
        <span class="text">{{ L['发评价，得积分，积少成多换商品'] }}</span>
      </div>
      <div class="right flex_row_between_start">
        <div class="info">
          <div class="flex_row_start_center">
            <img class="tips" :src="tips" alt="" />
            <p>{{ L['评价小贴士'] }}</p>
          </div>
          <div class="flex_row_center_center">
            <span class="tips_info">{{ L['发表评价可获得会员积分'] }}</span>
          </div>
        </div>
        <div class="qrcode">
          <div class="image">
            <img :src="logo" alt />
          </div>
        </div>
      </div>
    </div>
    <div class="evaluatilist_con">
      <div class="title">
        <div class="evaluating active">{{ L['待评订单'] }}</div>
      </div>
      <div class="order_item" v-for="(orderItem, index) in order_list.data" :key="index">
        <div class="order_item_title flex">
          <span class="order_sn">{{ orderItem.createTime }}<span @click="goOrderDetail(orderItem.orderSn)">{{ L['订单号']
              }}：{{ orderItem.orderSn }}</span></span>
          <span class="price">{{ L['金额'] }}</span>
          <span class="oprate">{{ L['操作'] }}</span>
        </div>
        <div class="good_info flex_row_start_center">
          <div class="good_con flex_column_center_center">
            <div class="good_item flex_row_center_center" v-for="(goodItem, index) in orderItem.orderProductList"
              :key="index">
              <div class="image flex_row_center_center" @click="goGoodsDetail(goodItem.productId)">
                <coverImage :src="goodItem.productImage" width="80" height="80"></coverImage>
              </div>
              <div class="name overflow_ellipsis_two" @click="goGoodsDetail(goodItem.productId)">
                {{ goodItem.goodsName }}
              </div>
              <span class="num">x{{ goodItem.productNum }}</span>
            </div>
          </div>
          <div class="price flex_row_center_center">
            {{ L['支付金额'] }}：R${{ $formatMoneyNum(orderItem.orderAmount || 0) }}
          </div>
          <div class="oprate flex_column_center_center">
            <span class="detail pointer" @click="goOrderDetail(orderItem.orderSn)">{{ L['订单详情'] }}</span>
            <div class="evaluate_btn pointer" @click="goOrderEvaluate(orderItem.orderSn)">{{ L['评价订单'] }}</div>
          </div>
        </div>
      </div>
      <SldCommonEmpty v-if="order_list.data.length == 0" :tip="L['暂无订单～']" totalWidth="934px" />
      <!-- 分页 start -->
      <div class="flex_row_center_center sld_pagination">
        <el-pagination @current-change="handleCurrentChange" :currentPage="pageData.current"
          :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
          :hide-on-single-page="true">
        </el-pagination>
      </div>
      <!-- 分页 end -->
    </div>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import SldCommonEmpty from '../../../components/SldCommonEmpty'
import MemberTitle from '../../../components/MemberTitle'
import { useStore } from 'vuex'

export default {
  name: 'OrderEvaluationList',
  components: {
    SldCommonEmpty,
    MemberTitle,
  },
  setup () {
    const member_info = reactive({ data: {} })
    const order_list = reactive({ data: [] })
    const logo = require('@/assets/order/evaluate_logo.png')
    const tips = require('@/assets/order/tips.png')
    const router = useRouter()
    const pageData = reactive({
      current: 1,
      pageSize: 10,
      total: 0
    })
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    
    const getInfo = () => {
      proxy
        .$get('v3/supplier/channel/user/getInfo')
        .then(res => {
          if (res.state == 200) {
            member_info.data = res.data
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    //去商品详情页
    const goGoodsDetail = productId => {
      proxy.$goGoodsDetail(productId)
    }
    const getOrderList = () => {
      var param = {}
      param.evaluateState = 1
      param.orderState = 40
      param.current = pageData.current
      param.pageSize = pageData.pageSize
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
    const goOrderEvaluate = orderSn => {
      router.push({
        path: '/member/order/evaluate',
        query: {
          orderSn: orderSn
        }
      })
    }
    const goOrderDetail = orderSn => {
      router.push({
        path: '/member/order/detail',
        query: {
          orderSn: orderSn
        }
      })
    }
    //向前翻页
    const handlePrevCilickChange = () => {
      pageData.current--
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
    onMounted(() => {
      getInfo()
      getOrderList()
    })
    return {
      getInfo,
      member_info,
      getOrderList,
      order_list,
      goOrderEvaluate,
      goOrderDetail,
      pageData,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      logo,
      tips,
      goGoodsDetail,
      L,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/member/orderEvaluation.scss';
</style>
