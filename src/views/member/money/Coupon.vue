<!--
 * @Author: wangwei
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2024-09-23 14:38:27
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: 我的优惠卷
 * @FilePath: /java-pc/src/views/member/Header.vue
-->
<template>
  <div class="sld_my_coupon">
    <MemberTitle :memberTitle="L['我的优惠卷']"></MemberTitle>
    <div class="my_coupon_con">
      <div class="nav_list">
        <div class="con flex">
          <div class="nav_item" :class="{ active: use_state == 1, pointer: true }" @click="changeState(1)">
            {{ L['未使用'] }}
          </div>
          <div class="nav_item" :class="{ active: use_state == 2, pointer: true }" @click="changeState(2)">
            {{ L['已使用'] }}
          </div>
          <div class="nav_item" :class="{ active: use_state == 3, pointer: true }" @click="changeState(3)">
            {{ L['已过期'] }}
          </div>
        </div>
      </div>
      <div class="coupon_container flex_row_start_center">
        <div class="coupon_item" v-for="(couponItem, index) in coupon_list.data" :key="index">
          <img v-if="couponItem.useState == 2" class="out_logo" src="@/assets/coupon/have_used_logo.png" alt="" />
          <img v-if="couponItem.useState == 3" class="out_logo" src="@/assets/coupon/have_out_time.png" alt="" />
          <div class="coupon_item_header" :class="{ coupon_item_header_one: couponItem.useState != 1 }">
            <div v-if="couponItem.couponType == 1" class="price">
              <span>{{ L['R$'] }} </span>
              <span>{{ $formatMoneyNum(couponItem.publishValue) }}</span>
            </div>
            <div v-if="couponItem.couponType == 2" class="count price">
              <span></span>
              <span>{{ $formatMoneyNum(couponItem.publishValue) }}</span>
              <span>{{ L['折'] }}</span>
            </div>
            <div v-if="couponItem.couponType == 3" class="price random">
              <span>{{ L['R$'] }} </span>
              <span>{{ $formatMoneyNum(couponItem.publishValue) }}</span>
            </div>
            <div v-if="couponItem.couponType == 4" class="price">
              <template v-if="Number(couponItem.publishValue) > 0">
                <span>{{ L['R$'] }} </span>
                <span>{{ $formatMoneyNum(couponItem.publishValue) }}</span>
              </template>
              <template v-else>
                <span></span>
                <span style="font-size: 22px;">{{ L['免运费'] }}</span>
              </template>
            </div>
            <div class="content">{{ couponItem.couponContent }}</div>
            <div class="time">
              {{ couponItem.effectiveStart }}-{{ couponItem.effectiveEnd }}
            </div>
          </div>
          <div :style="`background-image:url(@/assets/coupon/coupon_footer_bg.png)`" class="coupon_item_img">
            <div :class="{ type: true, used: couponItem.useState != 1 }">
              {{ couponItem.couponTypeValue }}
            </div>
            <div class="rules overflow_ellipsis_two">
              <span class="title">{{ L['使用规则'] }}：</span>
              <span>{{ couponItem.description }}</span>
            </div>
            <div class="btn">
              <span class="normal pointer" @click="goGoodsList(couponItem)" v-if="couponItem.useState == 1">{{ L['立即使用']
              }} ></span>
              <span v-if="couponItem.useState == 2">{{ L['已使用'] }}</span>
              <span v-if="couponItem.useState == 3">{{ L['已过期'] }}</span>
            </div>
          </div>
        </div>
        <SldCommonEmpty v-show="!coupon_list.data.length" totalWidth="900"></SldCommonEmpty>
      </div>
      <el-pagination @current-change="handleCurrentChange" :currentPage="pageData.current" :page-size="pageData.pageSize"
        layout="prev, pager, next, jumper" :total="pageData.total" :hide-on-single-page="true"
        class="flex_row_end_center"></el-pagination>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getCurrentInstance, ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import MemberTitle from '../../../components/MemberTitle'
import SldCommonEmpty from '../../../components/SldCommonEmpty'
export default {
  name: 'Coupon',
  components: {
    MemberTitle,
    SldCommonEmpty
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const use_state = ref(1)
    const router = useRouter()
    const coupon_list = reactive({ data: [] })
    const pageData = reactive({
      current: 1,
      pageSize: 8,
      total: 0
    })

    const getCouponList = () => {
      var param = {}
      param.useState = use_state.value
      param.current = pageData.current
      param.pageSize = pageData.pageSize
      proxy
        .$get('v3/supplier/channel/coupon/list', param)
        .then(res => {
          if (res.state == 200) {
            coupon_list.data = res.data.list
            pageData.total = res.data.pagination.total
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }
    //去优惠券对应的商品列表
    const goGoodsList = item => {
      if (item.useState == '1') {
        let params = {}
        if (item.storeId > 0) {
          params.storeId = item.storeId
        }

        if (item.useType == 2 && item.goodsIds) {
          params.goodsIds = item.goodsIds
        } else if (item.useType == 3 && item.cateIds) {
          params.categoryId = item.cateIds
        }


        let newWin = router.resolve({
          path: '/goods/list',
          query: params
        })

        window.open(newWin.href, '_blank')
      }
    }
    //切换
    const changeState = state => {
      pageData.current = 1
      use_state.value = state
      getCouponList()
    }
    //向前翻页
    const handlePrevCilickChange = () => {
      pageData.current--
      getCouponList()
    }
    //向后翻页
    const handleNextCilickChange = () => {
      pageData.current++
      getCouponList()
    }
    //页数改变
    const handleCurrentChange = current => {
      pageData.current = current
      getCouponList()
    }
    onMounted(() => {
      getCouponList()
    })
    return {
      L,
      pageData,
      coupon_list,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      changeState,
      use_state,
      goGoodsList,
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../style/coupon.scss';
</style>
<style lang="scss">
.sld_my_coupon {
  .el-pager li.active {
    color: var(--color_coupon_main);
  }

  .el-pager li:hover {
    color: var(--color_coupon_main);
  }

  .el-pagination button:not([disabled]):hover {
    color: var(--color_coupon_main);
  }

  .el-input__inner:focus {
    border-color: var(--color_coupon_main);
  }
}
</style>