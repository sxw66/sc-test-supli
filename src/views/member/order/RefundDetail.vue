// 售后详情页面
<template>
  <div class="sld_refund_detail" v-if="refundDetail.data">
    <!-- 退款进度 start -->
    <div class="refund_detail_top flex_row_center_center"
      v-if="refundDetail.data.returnLogList && refundDetail.data.returnLogList.length > 0">
      <div class="refund_detail_status">
        <p class="detail_ordersn">{{ sourceType == 1 ? L['退款单号'] : L['退款退货单号'] }}:{{ refundDetail.data.afsSn }}</p>
        <p class="detail_top_status">{{ refundDetail.data.stateValue }}</p>
        <p class="status_option"
          v-if="(refundDetail.data.afsType == 1 || refundDetail.data.afsType == 2) && refundDetail.data.state == 202">
          <span @click="reApplyReFund">{{ L['重新申请'] }}</span>
        </p>
      </div>
      <div class="refund_speed">
        <div class="refund_speed_des">{{ refundDetail.data.returnLogList[0].createTime }}
          {{ refundDetail.data.returnLogList[0].content }}
        </div>
        <!--
                    退货退款状态：100-买家申请仅退款；101-买家申请退货退款；102-买家退货给商家；200-商家同意退款申请；201-商家同意退货退款申请；202-商家拒绝退款申请(退款关闭/拒收关闭)；203-商家确认收货；300-平台确认退款(已完成)
                    afsType 售后服务端类型，1-退货退款单（需关联处理退款金额），2-换货单，3-仅退款单
                -->
        <div class="refund_speed_con flex_row_center_start">
          <div class="refund_speed_pre flex_column_center_center">
            <img src="@/assets/order/t_step1.png" alt="">
            <span>{{ L['提交申请'] }}</span>
          </div>
          <div class="refund_speed_line">
            <img src="@/assets/order/t_line.png" alt="">
          </div>
          <div class="refund_speed_pre flex_column_center_center">
            <img src="@/assets/order/t_step_b.png" alt=""
              v-if="refundDetail.data.state == 100 || refundDetail.data.state == 101">
            <img src="@/assets/order/t_step2.png" alt="" v-else>
            <span :class="{ refund_noactive: refundDetail.data.state == 100 || refundDetail.data.state == 101 }">{{
    L['审核中'] }}</span>
          </div>
          <div class="refund_speed_line">
            <img src="@/assets/order/t_line_b.png" alt=""
              v-if="refundDetail.data.state == 100 || refundDetail.data.state == 101">
            <img src="@/assets/order/t_line.png" alt="" v-else>
          </div>
          <div class="refund_speed_pre flex_column_center_center">
            <img src="@/assets/order/t_step3.png" alt=""
              v-if="refundDetail.data.state == 300 || refundDetail.data.state == 202">
            <img src="@/assets/order/t_step3_b.png" alt="" v-else>
            <span :class="{ refund_noactive: refundDetail.data.state != 300 && refundDetail.data.state != 202 }">{{
    L['完成'] }}</span>
          </div>
          <div class="refund_success_fail" v-if="refundDetail.data.state == 300 || refundDetail.data.state == 202">
            <img src="@/assets/order/t_fail.png" alt="" v-if="refundDetail.data.state == 202">
            <img src="@/assets/order/t_success.png" alt="" v-if="refundDetail.data.state == 300">
          </div>
        </div>
      </div>
    </div>
    <!-- 退款进度 end -->
    <!-- 退款日志 start -->
    <div class="refund_journal flex_row_start_start">
      <div class="refund_goods flex_column_start_center">
        <div class="refund_goods_img" :style="{ backgroundImage: 'url(' + refundDetail.data.productImage + ')' }">
        </div>
        <p class="refund_goods_name">{{ refundDetail.data.goodsName }}</p>
        <p class="refund_goods_specvalue">{{ refundDetail.data.specValues }}</p>
        <p class="refund_goods_price">R${{ $formatMoneyNum(refundDetail.data.productPrice || 0) }}</p>
      </div>
      <div class="refund_journal_con">
        <div class="refund_journal_pre flex_row_start_start"
          v-for="(logItem, logIndex) in refundDetail.data.returnLogList" :key="logIndex">
          <div class="journal_left flex_column_start_center">
            <span></span>
            <span :class="{ active: logIndex == refundDetail.data.returnLogList.length - 1 }"></span>
          </div>
          <div class="journal_right">
            <div class="journal_des">{{ logItem.content }}</div>
            <div class="journal_time refund_address" v-show="logItem.state == 201">
              <div class="title">{{ L['退货地址：'] }}</div>
              <div class="address">
                {{ refundDetail.data.storeContactName }}&nbsp;{{ refundDetail.data.storeTelphone
                }}&nbsp;{{ refundDetail.data.storeAreaInfo }}&nbsp;{{ refundDetail.data.storeAddress }}
              </div>
            </div>
            <div class="journal_time" v-show="logItem.returnMoneyAmount">
              {{ L['退款金额'] }}：{{ logItem.returnMoneyAmount }}
            </div>
            <div class="journal_time" v-show="logItem.applyNum">{{ L['申请件数'] }}：{{ logItem.applyNum }}</div>
            <div class="journal_time" v-show="logItem.applyReasonContent" :title="logItem.applyReasonContent">
              {{ L['退款原因'] }}：{{ logItem.applyReasonContent }}</div>
            <div class="journal_time" v-show="logItem.afsDescription" :title="logItem.afsDescription">
              {{ L['问题描述'] }}：{{ logItem.afsDescription }}
            </div>
            <div class="journal_time refund_voucher flex_row_start_start"
              v-show="logItem.applyImageList && logItem.applyImageList.length > 0">
              {{ L['退款凭证'] }}:
              <div class="refund_voucher_list flex_row_start_start">
                <div class="refund_voucher_pre" v-for="(applyImgItem, applyImgIndex) in logItem.applyImageList"
                  :key="applyImgIndex">
                  <el-image :src="applyImgItem" :preview-src-list="logItem.applyImageList" fit="cover"></el-image>
                </div>
              </div>
            </div>
            <div class="journal_time refund_remark" v-show="logItem.platformRemark" :title="logItem.platformRemark">
              <span>{{ L['平台审核备注'] }}：</span>
              <span>{{ logItem.platformRemark }}</span>
            </div>
            <div class="journal_time">{{ L['时间'] }}：{{ logItem.createTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 退款日志 end -->
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useStore } from 'vuex';

export default {
  setup () {
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const route = useRoute();
    const orderState = ref(''); //订单状态
    const afsSn = ref(''); //售后单号
    const refundDetail = reactive({ data: {} }); //售后相信
    const sourceType = ref(1); //仅退款 ；退款退货的来源类型 1：仅退款 2：退款退货
    const router = useRouter()
    
    onMounted(() => {
      orderState.value = route.query.orderState;
      afsSn.value = route.query.afsSn;
      sourceType.value = route.query.curTitleId;
      getRefundOrderDetail();
    });
    //获取售后订单详情
    const getRefundOrderDetail = () => {
      let params = {
        afsSn: afsSn.value
      }
      proxy.$get('v3/supplier/channel/after/sale/detail', params).then((res) => {
        if (res.state == 200) {
          refundDetail.data = res.data;
          refundDetail.data.returnLogList = refundDetail.data.returnLogList.reverse();
          refundDetail.data.returnLogList.map((logItem, logIndex) => {
            if (logIndex == refundDetail.data.returnLogList.length - 1) {
              logItem.applyNum = refundDetail.data.returnNum;
              logItem.returnMoneyAmount = refundDetail.data.returnMoneyAmount;
              logItem.afsDescription = refundDetail.data.afsDescription;
              logItem.applyReasonContent = refundDetail.data.applyReasonContent;
              logItem.applyImageList = refundDetail.data.applyImageList; //退款凭证
            }
            if (logIndex == 0) {
              logItem.platformRemark = refundDetail.data.platformRemark;
            }
          })
        } else {
          ElMessage.error(res.data)
        }
      })
    }

    const reApplyReFund = () => {
      let { orderSn, orderProductId } = refundDetail.data
      proxy.$get('v3/supplier/channel/return/apply/applyInfo', {
        orderSn,
        orderProductId
      }).then(res => {
        if (res.state == 200) {
          router.push({
            path: "/member/order/refund/apply",
            query: {
              orderState: orderState.value,
              orderProductId
            }
          });
        } else {
          ElMessage(res.msg)
        }
      })
    }

    return {
      L,
      orderState,
      afsSn,
      refundDetail,
      sourceType,
      reApplyReFund,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/base.scss";
@import "../../../style/refundDetail.scss";

.el-image {
  width: 50px;
  height: 50px;
}

.refund_remark {
  word-break: break-all;
}
</style>