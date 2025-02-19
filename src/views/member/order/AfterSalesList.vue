// 售后列表
<template>
  <div class="sld_after_sales_list">
    <MemberTitle :memberTitle="curTitleId == 2 ? L['我的退货'] : L['我的退款']" style="padding-left:20px"></MemberTitle>
    <div class="after_sales_list_main">
      <div class="after_sales_title flex_row_start_center">
        <router-link :to="`/member/order/aftersales?${curTitleId == 2 ? 'type=return' : ''}`
      " class="after_sales_title_pre cursor_pointer" :class="{ active_title: titleItem.titleId == curTitleId }"
          v-for="(titleItem, titleIndex) in afterSalesTitle.data" :key="titleIndex"
          @click="titleNav(titleItem.titleId)">
          {{ titleItem.content }}
        </router-link>
      </div>
      <div class="after_sales_list">
        <div class="after_sales_list_title flex_row_start_center">
          <div class="title_goods_des">{{ L['商品明细'] }}</div>
          <div class="title_apply_time">{{ L['申请时间'] }}</div>
          <div class="title_apply_type">{{ L['申请类型'] }}</div>
          <div class="title_status">{{ L['状态'] }}</div>
          <div class="title_options">{{ L['操作'] }}</div>
        </div>
        <div class="after_sales_list_con">
          <div class="list_con_pre" v-for="(afterSalesItem, afterSalesIndex) in afterSalesList.data"
            :key="afterSalesIndex">
            <div class="list_con_pre_title flex_row_start_center">
              <p>{{ L['下单时间'] }}：{{ afterSalesItem.applyTime }}</p>
              <p>{{ L['订单号'] }}：{{ afterSalesItem.orderSn }}</p>
              <p class="storeName cursor_pointer" @click="toStore(afterSalesItem.storeId)">{{ afterSalesItem.storeName
                }}</p>
            </div>
            <div class="list_con">
              <div class="list_pre flex_row_start_center">
                <div class="list_goods_des borderRight flex_row_start_center cursor_pointer"
                  @click="goGoodsDetail(afterSalesItem.productId)">
                  <div class="list_goods_img" :style="{ backgroundImage: 'url(' + afterSalesItem.productImage + ')' }">
                  </div>
                  <div class="goods_des">
                    <p>{{ afterSalesItem.goodsName }}</p>
                    <p>{{ afterSalesItem.specValues }}</p>
                  </div>
                </div>
                <div class="list_apply_time borderRight flex_row_center_center">
                  {{ afterSalesItem.applyTime }}
                </div>
                <div class="list_apply_type borderRight flex_row_center_center">
                  {{ afterSalesItem.returnTypeValue }}
                </div>
                <div class="list_status borderRight flex_row_center_center">
                  {{ afterSalesItem.stateValue }}
                </div>
                <div class="list_options flex_column_center_center">
                  <span class="cursor_pointer" @click="goRefundDetail(afterSalesItem)">{{ L['查看详情'] }}</span>
                  <template v-if="afterSalesItem.returnType == 2 && afterSalesItem.state == 201">
                    <span class="cursor_pointer" @click="logisticsBill(afterSalesItem)">{{ L['发货'] }}</span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <SldCommonEmpty v-show="!afterSalesList.data.length" totalWidth="900"></SldCommonEmpty>
          <div class="flex_row_end_center sld_pagination sld_page_bottom" v-if="aftersalesDetail.data &&
      aftersalesDetail.data.pagination &&
      aftersalesDetail.data.pagination.total
      ">
            <el-pagination @current-change="handleCurrentChange" v-model:currentPage="current" :page-size="pageSize"
              layout="prev, pager, next, jumper" :total="aftersalesDetail.data.pagination.total"
              :hide-on-single-page="true">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, ref, getCurrentInstance, watchEffect } from 'vue'
import { ElMessage, ElPagination } from 'element-plus'
import SldCommonEmpty from '../../../components/SldCommonEmpty'
import { useRouter } from 'vue-router'
import MemberTitle from '../../../components/MemberTitle'

export default {
  components: {
    ElPagination,
    MemberTitle,
    SldCommonEmpty
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const router = useRouter()
    const afterSalesTitle = reactive({
      data: [
        {
          titleId: 1,
          content: L['仅退款']
        },
        {
          titleId: 2,
          content: L['退货退款']
        }
      ]
    })
    const curTitleId = ref(1) //当前选中的标题id
    const afterSalesList = reactive({ data: [] }) //售后列表
    const pageSize = ref(10)
    const current = ref(1)
    const aftersalesDetail = reactive({ data: {} }) //售后列表详情数据

    const toStore = storeId => {
      if (storeId == 0) {
        return
      }
      proxy.$goStoreDetail(storeId)
    }

    onMounted(() => {
      getAfterSalesDet()
    })
    router.beforeEach((to, from, next) => {
      if (to.query.type == 'return') {
        curTitleId.value = 2 //退款退货
      } else {
        curTitleId.value = 1 //仅退款
      }
      getAfterSalesDet()
      next()
    })
    watchEffect(() => {
      let tmpPath = router.currentRoute.value.fullPath
      if (tmpPath == '/member/order/aftersales?type=return') {
        curTitleId.value = 2 //退款退货
      } else if (tmpPath == '/member/order/aftersales') {
        curTitleId.value = 1 //我的退款
      }
    })
    //获取售后订单列表
    const getAfterSalesDet = () => {
      let params = {
        returnType: curTitleId.value,
        current: current.value,
        pageSize: pageSize.value
      }
      proxy.$get('v3/supplier/channel/after/sale/list', params).then(res => {
        if (res.state == 200) {
          let result = res.data
          aftersalesDetail.data = result
          afterSalesList.data = result.list
        } else {
          ElMessage.error(res.data)
        }
      })
    }
    //选择类型
    const titleNav = titleId => {
      curTitleId.value = titleId
      getAfterSalesDet()
    }
    //上一页
    const handlePrevCilickChange = () => {
      current.value--
      getAfterSalesDet()
    }
    //下一页
    const handleNextCilickChange = () => {
      current.value++
      getAfterSalesDet()
    }
    //选择页面
    const handleCurrentChange = () => {
      getAfterSalesDet()
    }
    //查看售后详情
    const goRefundDetail = afterSalesItem => {
      router.push({
        path: '/member/order/refund/detail',
        query: {
          curTitleId: curTitleId.value,
          orderState: afterSalesItem.orderState,
          afsSn: afterSalesItem.afsSn
        }
      })
    }
    //填写物流单号
    const logisticsBill = afterSalesItem => {
      router.push({
        path: '/member/order/logistics',
        query: {
          afsSn: afterSalesItem.afsSn
        }
      })
    }
    //去商品详情页
    const goGoodsDetail = productId => {
      proxy.$goGoodsDetail(productId)
    }

    return {
      L,
      afterSalesTitle,
      curTitleId,
      afterSalesList,
      titleNav,
      pageSize,
      current,
      aftersalesDetail,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      goRefundDetail,
      logisticsBill,
      goGoodsDetail,
      toStore
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../style/base.scss';
@import '../../../style/afterSalesList.scss';

.storeName {
  color: #333;

  &:hover {
    color: var(--color_main);
  }
}
</style>
