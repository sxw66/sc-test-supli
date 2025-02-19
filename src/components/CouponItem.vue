<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-02-05 14:48:52
 * @LastEditors: Please set LastEditors
 * @Description: 领劵中心优惠卷item
 * @FilePath: /java-pc/src/views/member/Header.vue
-->
<template>
  <div class="sld_coupon_item" :class="{ sld_coupon_item_small: couponType == 'small' }">
    <div class="coupon_item_small flex_row_between_center" v-if="couponType == 'small'">
      <div class="flex_row_start_center">
        <div class="coupon_item_small_left flex_row_center_center">
          <dynaIcon src="cart_coupons_list.png" :width="68" :height="26" color="--color_main" class="img">
          </dynaIcon>
          <div class="border_dashed"></div>
          <div v-if="couponItem.data.couponType == 1" class="price flex_row_center_end">
            <span style="transform:scale(0.8);line-height:13px;font-weight: bold;">{{ L['R$'] }}</span>
            <span style="font-weight: bold;">{{ couponItem.data.publishValue * 1 }}</span>
          </div>
          <div v-else-if="couponItem.data.couponType == 2" class="count flex_row_start_end">
            <span>{{ $formatMoneyNum(couponItem.data.publishValue) }}</span>
            <span>{{ L['折'] }}</span>
          </div>
          <div v-else-if="couponItem.data.couponType == 3" class="random" :title="couponItem.data.couponContent">
            {{ L['随机券'] }}
          </div>
          <div v-else-if="couponItem.data.couponType == 4" class="random" :title="couponItem.data.couponContent">
            {{ L['运费券'] }}
          </div>
          <div v-else class="random_o flex_row_start_start">
            <span>{{ couponItem.data.couponTypeValue }}</span>
          </div>

          <div class="border_dashed"></div>
        </div>
        <div class="coupon_item_small_middle">
          <div class="coupon_item_small_content">{{ couponItem.data.couponContent }}</div>
          <div class="coupon_item_small_time">{{ couponItem.data.effectiveStart ?
    couponItem.data.effectiveStart :
    couponItem.data.publishStartTime }}~{{ couponItem.data.effectiveEnd ?
    couponItem.data.effectiveEnd :
    couponItem.data.publishEndTime }}</div>
        </div>
      </div>
      <div>
        <div class="coupon_item_small_btn"
          :class="{ have_receive: couponItem.data.receivedState != 1 && couponItem.data.isReceive != 1 }"
          v-if="(couponItem.data.receivePercent >= 0 && couponItem.data.receivePercent != 100)"
          @click="couponItem.data.receivedState == 1 || couponItem.data.isReceive == 1 ? receive(couponItem.data.couponId) : ''">
          {{ couponItem.data.receivedState == 1 || couponItem.data.isReceive == 1 ? L['领取'] : L['已领取'] }}
        </div>
        <div class="coupon_item_small_btn" :class="{ have_receive: true }" v-else>{{ L['已抢完'] }}
        </div>
      </div>
    </div>
    <div v-else class="coupon_item flex_row_start_center" :style="{ backgroundImage: 'url(' + item_bg + ')' }">
      <div class="coupon_item_left flex_row_start_center">
        <div class="type">{{ couponItem.data.couponTypeValue }}</div>
        <div class="coupon_info">
          <div v-if="couponItem.data.couponType == 1" class="price flex_row_start_start">
            <span>R$</span>
            <span>{{ $formatMoneyNum(couponItem.data.publishValue) }}</span>
          </div>
          <div v-if="couponItem.data.couponType == 2" class="count flex_row_start_end">
            <span>{{ $formatMoneyNum(couponItem.data.publishValue) }}</span>
            <span>{{ L['折'] }}</span>
          </div>
          <div v-if="couponItem.data.couponType == 3" class="random flex_row_start_start">
            <span>{{ couponItem.data.couponContent }}</span>
          </div>

          <div v-if="couponItem.data.couponType == 4" class="random flex_row_start_start">
            <template v-if="Number(couponItem.data.publishValue) > 0">
              <span>R$</span>
              <span>{{ $formatMoneyNum(couponItem.data.publishValue) }}</span>
            </template>
            <span v-else>免运费</span>
          </div>

          <div class="limit">{{ couponItem.data.couponContent }}</div>
          <div class="time">
            {{ couponItem.data.effectiveStart ? couponItem.data.effectiveStart : couponItem.data.publishStartTime }}~{{
    couponItem.data.effectiveEnd ? couponItem.data.effectiveEnd : couponItem.data.publishEndTime }}
          </div>
          <div class="rules flex_row_start_center">
            <span>{{ L['使用规则'] }}：</span>
            <span :title="couponItem.data.description" class='rules_text overflow_ellipsis'>{{
    couponItem.data.description
  }}</span>
          </div>
        </div>
      </div>
      <div class="coupon_item_right">
        <el-progress type="dashboard" width="70" :show-text="false"
          :percentage="couponItem.data.robbedRate ? couponItem.data.robbedRate : couponItem.data.receivePercent"
          :color="(couponItem.data.robbedRate == 100 || couponItem.data.receivePercent == 100) ? '#D0D0D0' : 'var(--color_coupon_main)'">
        </el-progress>
        <div class="progress_text flex_column_center_end">
          <div
            v-if="(couponItem.data.robbedRate >= 0 && couponItem.data.robbedRate < 100) || (couponItem.data.receivePercent >= 0 && couponItem.data.receivePercent < 100)">
            {{ L['已抢'] }}
          </div>
          <div
            v-if="(couponItem.data.robbedRate >= 0 && couponItem.data.robbedRate < 100) || (couponItem.data.receivePercent >= 0 && couponItem.data.receivePercent < 100)">
            {{ couponItem.data.robbedRate || couponItem.data.robbedRate == 0 ? couponItem.data.robbedRate :
    couponItem.data.receivePercent }}%
          </div>
          <div class="without" v-if="couponItem.data.robbedRate == 100 || couponItem.data.receivePercent == 100">
            {{ L['已抢光'] }}
          </div>
        </div>
        <div
          :class="{ btn: true, pointer: true, have_receive: couponItem.data.receivedState != 1 && couponItem.data.isReceive != 1 }"
          v-if="(couponItem.data.robbedRate >= 0 && couponItem.data.robbedRate != 100) || (couponItem.data.receivePercent >= 0 && couponItem.data.receivePercent != 100)"
          @click="couponItem.data.receivedState == 1 || couponItem.data.isReceive == 1 ? receive(couponItem.data.couponId) : ''">
          {{ couponItem.data.receivedState == 1 || couponItem.data.isReceive == 1 ? L['立即领取'] : L['已领取'] }}
        </div>

        <div class="no_have pointer"
          v-if="(couponItem.data.robbedRate == 100 || couponItem.data.receivePercent == 100)">
          {{ L['立即领取'] }}
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {
  ElProgress,
  ElMessage
} from "element-plus";
import { getCurrentInstance, reactive, watch, ref } from "vue";
import item_bg from '../assets/coupon/item_bg.png';

export default {
  name: "CouponItem",
  props: ['coupon_item', 'coupon_type'],
  components: {
    ElProgress,
  },
  setup (props, { emit }) {
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const couponItem = reactive({ data: props.coupon_item });
    const couponType = ref(props.coupon_type);
    //领取优惠卷
    const receive = couponId => {

      proxy
        .$get("v3/supplier/channel/coupon/receiveCoupon", { couponId })
        .then(res => {
          if (res.state == 200) {
            ElMessage.success(L["领取成功"]);
            emit('refreshCouponList')
          } else {
            ElMessage(res.msg);
            emit('refreshCouponList')
          }
        })
        .catch(() => {
          //异常处理
        });
    };
    watch(props, (oldVal, newVal) => {
      couponItem.data = newVal.coupon_item
    })


    const refreshInfo = () => {
      history.go(0)
    }
    return {
      L,
      item_bg,
      receive,
      couponItem,
      couponType,
      refreshInfo,
    };
  }
};
</script>

<style lang="scss" scoped>
.sld_coupon_item {
  &.sld_coupon_item_small {
    width: 300px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .coupon_item_small {
    .coupon_item_small_left {
      min-width: 68px;
      width: 68px;
      height: 26px;
      color: #ffffff;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 10px;
      padding: 0 10px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      position: relative;

      .img {
        width: 68px;
        height: 26px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.7;
      }

      .random {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
        width: 100%;
        border-left: 1px dashed rgba(255, 255, 255, 0.5);
        border-right: 1px dashed rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .price {
        position: relative;
        width: 100%;
        border-left: 1px dashed rgba(255, 255, 255, 0.5);
        border-right: 1px dashed rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .count {
        position: relative;
        width: 100%;
        border-left: 1px dashed rgba(255, 255, 255, 0.5);
        border-right: 1px dashed rgba(255, 255, 255, 0.5);
        text-align: center;
      }

      .random {
        position: relative;
      }

      .random_o {
        position: relative;
      }
    }

    .coupon_item_small_middle {
      flex: 1;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;

      .coupon_item_small_content {
        color: #777777;
        margin-bottom: 3px;
      }

      .coupon_item_small_time {
        color: #999999;
      }
    }

    .coupon_item_small_btn {
      width: 47px;
      height: 27px;
      line-height: 27px;
      color: #333333;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      text-align: center;
      border: 1px solid #d2d2d2;
      margin-left: 11px;
      cursor: pointer;

      &.have_receive {
        opacity: 0.8;
        cursor: default;
        color: #999;
      }
    }
  }

  .coupon_item {
    width: 386px;
    height: 158px;
    box-shadow: 0 0 12px 0 rgba(187, 187, 187, 0.2);
    background-size: cover;
    margin-top: 20px;
    margin-left: 0px;

    .coupon_item_left {
      height: 100%;
      width: 303px;

      .type {
        font-size: 22px;
        color: var(--color_coupon_main);
        font-weight: bold;
        margin: 0 22px 0px 25px;
        width: 22px;
      }

      .coupon_info {
        .price {
          color: var(--color_coupon_main);

          span:nth-child(1) {
            font-size: 18px;
            height: 18px;
            line-height: 23px;
          }

          span:nth-child(2) {
            font-size: 32px;
            height: 32px;
            line-height: 32px;
          }
        }

        .count {
          color: var(--color_coupon_main);

          span:nth-child(1) {
            font-size: 32px;
            height: 32px;
            line-height: 32px;
          }

          span:nth-child(2) {
            font-size: 24px;
            height: 24px;
            line-height: 21px;
          }
        }

        .random {
          color: var(--color_coupon_main);

          span {
            font-size: 24px;
          }
        }

        .limit {
          height: 26px;
          background: #f1f1f1;
          border-radius: 2px;
          text-align: center;
          line-height: 26px;
          color: #666666;
          margin-top: 10px;
          padding: 0 10px;
          width: fit-content;
        }

        .time {
          color: #666666;
          margin-top: 10px;
        }

        .rules {
          color: #666666;
          margin-top: 10px;
          width: 200px;

          span:nth-child(1) {
            color: #999999;
            white-space: nowrap;
          }

          .rules_text {
            width: 135px;
            display: inline-block;
          }
        }
      }
    }

    .coupon_item_right {
      width: 83px;
      height: 100%;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 25px;

      .btn,
      .no_have {
        width: 78px;
        height: 25px;
        background: var(--color_coupon_main);
        border-radius: 13px;
        line-height: 25px;
        text-align: center;
        color: white;
        font-size: 13px;
        margin-top: 10px;
      }

      .have_receive {
        background: #999;
      }

      .no_have {
        background: #b9b7b7;
        color: #fefefe;
      }

      .progress_text {
        color: var(--color_coupon_main);
        font-size: 14px;
        position: absolute;
        top: 25%;
        font-weight: 400;
        height: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .without {
          color: #888888;
          font-size: 12px;
        }
      }
    }
  }
}
</style>