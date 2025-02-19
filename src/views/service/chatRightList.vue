<!--
 * @Author: zoucb
 * @Date: 2021-03-23
 * @LastEditors: zoucb
 * @FilePath: /src/views/service/chatStoreList.vue
-->
<!--客服聊天右侧列表 @zoucb-2021-03-23-->
<template>
  <div class="sld_chatRightList" :style="'height:' + (clientHeight - 180) + 'px'">
    <!-- 导航栏start -->
    <div class="header">
      <div class="header_item" @click="select(1)">
        <p :class="{ on: selectFlag == 1 }">{{ L['我的订单'] }}</p>
        <div :class="{ bottom_line: selectFlag == 1 }"></div>
      </div>
      <div class="header_item" @click="select(2)">
        <p :class="{ on: selectFlag == 2 }">{{ L['我的足迹'] }}</p>
        <div :class="{ bottom_line: selectFlag == 2 }"></div>
      </div>
      <div class="header_item" @click="select(3)" v-if="curStoreId != 0">
        <p :class="{ on: selectFlag == 3 }">{{ L['供应商推荐'] }}</p>
        <div :class="{ bottom_line: selectFlag == 3 }"></div>
      </div>
    </div>
    <!-- 导航栏end -->

    <!-- 列表start -->
    <div class="list_wrap" v-if="selectFlag == 1" :style="'height:' + (clientHeight - 250) + 'px'">
      <!-- 订单列表 -->
      <el-scrollbar>
        <div class="orderOwn" v-infinite-scroll="load" infinite-scroll-immediate="false">
          <div class="orderOwn_item" v-for="(item, index) in orderlist.list" :key="index">
            <div class="order_header">
              <div class="order_info">
                <p class="orderSn">{{ L['订单号：'] }}{{ item.orderSn }}</p>
                <p class="orderDate">{{ item.createTime }}</p>
              </div>
              <div class="order_state">{{ item.orderStateValue }}</div>
            </div>
            <div>
              <div :class="{
    brief: true,
    order_con: true,
    sld_hide: item.isFold,
    sld_show: !item.isFold
  }" v-for="(goodsItem, sub_index) in item.orderProductList" :key="sub_index">
                <img :src="goodsItem.productImage" alt="" />
                <div class="text_con">
                  <p>{{ goodsItem.goodsName }}</p>
                  <div class="bottom_con">
                    <p>R${{ $formatMoneyNum(goodsItem.productShowPrice || 0) }}</p>
                    <span v-if="item.deliverMethod != 1 && item.shopType == 2" style="color: #999;">请到移动端查看订单详情</span>
                    <a @click="sendLink({ item, goodsItem }, 'order')" v-else>{{ L['发送链接'] }} ></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="openMore" @click="openMore(item)" v-if="item.orderProductList.length > 1">
              <span>{{ item.isFold ? L['展开全部'] : L['收起全部'] }}</span>
              <i :class="item.isFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
            </div>
          </div>
          <loadingState v-if="loadState.orderState == 'first_loading' ||
    orderlist.list.length > 0
    " :state="loadState.orderState" />
          <div class="empty_data" v-if="!orderlist.list.length && firstloading">
            <img src="@/assets/goods/empty_data.png" alt="" />
            <p>{{ L['暂无订单～'] }}</p>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="list_wrap" v-if="selectFlag == 2" :style="'height:' + (clientHeight - 250) + 'px'">
      <el-Scrollbar>
        <div class="footPrint" v-infinite-scroll="load" infinite-scroll-immediate="false">
          <div class="footPrint_item" v-for="(foot, footIdx) in footlist.list" :key="footIdx">
            <div class="brief footPrint_con">
              <img :src="foot.goodsImage" alt="" />
              <div class="text_con">
                <p>{{ foot.goodsName }}</p>
                <div class="bottom_con">
                  <p class="price">{{ L['R$'] }}{{ $formatMoneyNum(foot.productPrice || 0) }}</p>
                  <a @click="sendLink(foot, 'foot')">{{ L['发送链接 >'] }}</a>
                </div>
              </div>
            </div>
          </div>
          <loadingState v-if="loadState.orderState == 'first_loading' ||
    footlist.list.length > 0
    " :state="loadState.orderState" />
          <div class="empty_data" v-if="!footlist.list.length">
            <img src="@/assets/goods/empty_data.png" alt="" />
            <p>{{ L['暂无足迹～'] }}</p>
          </div>
          <div></div>
        </div>
      </el-Scrollbar>
    </div>

    <div class="list_wrap" v-if="selectFlag == 3" :style="'height:' + (clientHeight - 250) + 'px'">
      <el-scrollbar>
        <div class="storeRecom" v-infinite-scroll="load" infinite-scroll-immediate="false">
          <div class="store_info">
            <p class="store_name">
              {{ L['供应商名称：'] }}<span>{{ storeDetail.storeName }}</span>
            </p>
            <p class="store_level">
              {{ L['供应商星级：'] }}
              <el-rate disabled :colors="colors" score-template="{score}" v-model="score">
              </el-rate>
            </p>
            <p class="store_contact">
              {{ L['联系电话：'] }}<span>{{ storeDetail.servicePhone }}</span>
            </p>
          </div>

          <div class="div_line"></div>

          <div class="store_score">
            <p>{{ L['供应商评分'] }}</p>
            <p :class="{ highScore: storeDetail.descriptionScore > 4 }">
              {{ L['用户评价：']
              }}<span>{{ storeDetail.descriptionScore }}</span>&nbsp;&nbsp;&nbsp;<span
                v-if="storeDetail.descriptionScore > 4">{{ L['高'] }}</span>
              <span v-else-if="storeDetail.descriptionScore < 2">{{ L['低'] }}</span>
              <span v-else>中</span>
            </p>
            <p :class="{ highScore: storeDetail.deliverScore > 4 }">
              {{ L[' 物流服务：'] }}<span>{{ storeDetail.deliverScore }}</span>&nbsp;&nbsp;&nbsp;<span
                v-if="storeDetail.deliverScore > 4">{{ L['高'] }}</span>
              <span v-else-if="storeDetail.deliverScore < 2">{{ L['低'] }}</span>
              <span v-else>{{ L['中'] }}</span>
            </p>
            <p :class="{ highScore: storeDetail.serviceScore > 4 }">
              {{ L['售后服务：'] }}<span>{{ storeDetail.serviceScore }}</span>&nbsp;&nbsp;&nbsp;<span
                v-if="storeDetail.serviceScore > 4">{{  L['高'] }}</span>
              <span v-else-if="storeDetail.serviceScore < 2">{{  L['低'] }}</span>
              <span v-else>{{ L['中'] }}</span>
            </p>
          </div>
          <div class="recomList">
            <p class="title">{{ L['供应商推荐'] }}</p>
            <div class="div_line_full"></div>
            <div class="recom_item" v-for="(recom, index) in recomList.list" :key="index">
              <div class="brief recom_con">
                <img :src="recom.goodsImage" alt="" />
                <div class="text_con">
                  <p>{{ recom.goodsName }}</p>
                  <div class="bottom_con">
                    <p class="price">{{ L['R$'] }}{{ $formatMoneyNum(recom.goodsPrice || 0) }}</p>
                    <a @click="sendLink(recom, 'recom')">{{ L['发送链接 >'] }}</a>
                  </div>
                </div>
              </div>
            </div>
            <loadingState v-if="loadState.orderState == 'first_loading' || recomList.list.length > 0" :state="loadState.orderState" />
            <div class="empty_data" v-if="!recomList.list.length">
              <img src="@/assets/goods/empty_data.png" alt="" />
              <p>{{ L['暂无供应商商品～'] }}</p>
            </div>
          </div>
          <div></div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, reactive, computed } from 'vue'
import loadingState from '@/components/loadingState'
import { useStore } from 'vuex'
// import { ElRate } from 'element-plus'
export default {
  name: 'chatRightList',
  components: {
    // ElRate,
    loadingState
  },
  setup (props, { emit }) {
    const selectFlag = ref(1)
    const isMore = ref(true)
    const select = index => {
      selectFlag.value = index
    }
    const curStoreId = ref('')
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    
    const colors = ref(['var(--color_main)', 'var(--color_main)', 'var(--color_main)'])
    const score = ref(2)
    const firstloading = ref(false)
    const current = reactive({
      order: 1,
      foot: 1,
      recom: 1
    })
    const hasMore = reactive({
      orderMore: true,
      footMore: true,
      recomMore: true
    })
    const loadState = reactive({
      orderState: '',
      footState: '',
      recomState: ''
    })

    const openMore = item => {
      item.isFold = !item.isFold
    }
    const orderlist = reactive({
      list: []
    })
    const footlist = reactive({
      list: []
    })
    const recomList = reactive({
      list: []
    })

    const storeDetail = ref('')

    const getOrderList = () => {
      let params = {
        current: current.order
      }

      if (curStoreId.value) {
        params.storeId = curStoreId.value
      }

      loadState.orderState = 'first_loading'
      proxy.$get('v3/supplier/channel/orderInfo/myOrders', params).then(res => {
        if (res.state == 200) {
          if (current.order == 1) {
            orderlist.list = res.data.list
          } else {
            orderlist.list = orderlist.list.concat(res.data.list)
          }
          hasMore.orderMore = checkPaginationHasMore(res.data.pagination)
          if (hasMore.orderMore) {
            current.order++
            loadState.orderState = 'allow_loading_more'
          } else {
            loadState.orderState = 'no_more_data'
          }
          firstloading.value = true
          orderlist.list.map(item => {
            item.isFold = true
          })
        }
      })
    }

    const getFootPrint = () => {
      let params = {
        current: current.foot,
        storeId: curStoreId.value
      }
      proxy
        .$get('v3/supplier/channel/productLookLog/myFootprint', params)
        .then(res => {
          if (res.state == 200) {
            if (current.foot == 1) {
              footlist.list = res.data.list
            } else {
              footlist.list = footlist.list.concat(res.data.list)
            }
            hasMore.footMore = checkPaginationHasMore(res.data.pagination)
            if (hasMore.footMore) {
              current.foot++
              loadState.footState = 'allow_loading_more'
            } else {
              loadState.footState = 'no_more_data'
            }
          }
        })
    }

    const getRecomList = () => {
      let params = {
        current: current.recom,
        storeId: curStoreId.value,
        sort: 7
      }
      proxy.$get('v3/supplier/channel/goods/goodsList', params).then(res => {
        if (res.state == 200) {
          if (current.recom == 1) {
            recomList.list = res.data.list
          } else {
            recomList.list = recomList.list.concat(res.data.list)
          }
          hasMore.recomMore = checkPaginationHasMore(res.data.pagination)
          if (hasMore.recomMore) {
            current.recom++
            loadState.recomState = 'allow_loading_more'
          } else {
            loadState.recomState = 'no_more_data'
          }
        }
      })
    }

    const getStoreDetail = () => {
      let params = {
        storeId: curStoreId.value
      }
      proxy.$get('v3/supplier/channel/store/detail', params).then(res => {
        if (res.state == 200) {
          storeDetail.value = res.data
          score.value = Number(res.data.comprehensiveScore)
        }
      })
    }

    const load = () => {
      if (selectFlag.value == 1 && hasMore.orderMore) {
        getOrderList()
      } else if (selectFlag.value == 2 && hasMore.footMore) {
        getFootPrint()
      } else if (selectFlag.value == 3 && hasMore.recomMore) {
        getRecomList()
      }
    }

    const checkPaginationHasMore = ({ current, pageSize, total }) => {
      return current * pageSize < total * 1
    }

    const sendLink = (obj, type) => {
      if (type == 'order') {
        let obj1 = {
          orderSn: obj.item.orderSn,
          createTime: obj.item.createTime,
          orderStateValue: obj.item.orderStateValue,
          goodsItem: obj.goodsItem
        }
        emit('getObj', obj1, type)
      } else {
        emit('getObj', obj, type)
      }
    }

    const getSwitch = storeId => {
      curStoreId.value = storeId
      current.recom = 1
      current.foot = 1
      current.order = 1
      getFootPrint()
      getRecomList()
      getStoreDetail()
      getOrderList()
    }

    const clientHeight = ref(0)
    onMounted(() => {
      let clientHeight1 =
        document.body.clientHeight || document.documentElement.clientHeight
      clientHeight.value = clientHeight1
      getOrderList()
    })

    return {
      L,
      selectFlag,
      select,
      isMore,
      openMore,
      colors,
      score,
      orderlist,
      load,
      footlist,
      recomList,
      storeDetail,
      loadState,
      firstloading,
      sendLink,
      getSwitch,
      clientHeight,
      curStoreId,
    }
  }
}
</script>

<style lang="scss">
.sld_chatRightList {
  height: 889px;
  width: 335px;
  border-left: 2px solid #f7f7f7;

  .header {
    width: 334px;
    height: 54px;
    background: #ffffff;
    display: flex;
    justify-content: space-around;

    .header_item {
      margin-top: 25px;
      width: 64px;
      height: 30px;

      p {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        cursor: pointer;
      }

      .bottom_line {
        margin-top: 6px;
        background: var(--color_main);
        border-radius: 2px;
      }

      .on {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: var(--color_main);
      }
    }
  }

  .list_wrap {
    .orderOwn {
      .orderOwn_item {
        padding: 20px;
        border-bottom: 1px solid #f5f5f5;

        .sld_hide:not(:nth-child(1)) {
          display: none;
        }

        .sld_show:not(:nth-child(1)) {
          display: flex;
        }

        .order_header {
          height: 37px;
          border-bottom: 1px solid #f5f5f5;
          display: flex;
          justify-content: space-between;

          .order_info {
            .orderSn {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #666666;
            }

            .orderDate {
              margin-top: 3px;
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #999999;
            }
          }
        }

        .order_con {
          margin-top: 20px;
        }

        .openMore {
          margin-top: 20px;
          text-align: center;
          cursor: pointer;

          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }

          i {
            margin-left: 10px;
            font-size: 9px;
          }

          &:hover {

            span,
            i {
              color: var(--color_main);
            }
          }
        }
      }
    }

    .footPrint {
      padding-left: 20px;

      .footPrint_item {
        padding: 20px 20px 20px 0;
        border-bottom: 1px solid #f5f5f5;

        .footPrint_con .price {
          color: var(--color_main);
        }
      }
    }

    .storeRecom {
      .store_info {
        padding: 20px 20px 10px 20px;

        .store_name,
        .store_level,
        .store_contact {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          margin-bottom: 9px;
        }

        .store_level {
          display: flex;
        }

        span {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
      }

      .div_line {
        width: 295px;
        height: 1px;
        background: #f3f3f3;
        margin: 0 auto;
      }

      .store_score {
        padding: 20px;

        p:first-child {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
          margin-bottom: 15px;
        }

        p {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          margin-bottom: 10px;

          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            color: #333333;
          }
        }

        .highScore {
          span {
            color: var(--color_main);
          }
        }
      }

      .recomList {
        .title {
          text-align: center;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }

        .div_line_full {
          margin-top: 9px;
          height: 1px;
          background: #000000;
          opacity: 0.05;
        }

        .recom_con {
          padding: 20px;
        }
      }
    }
  }

  .brief {
    display: flex;

    img {
      width: 69px;
      height: 66px;
      border-radius: 6px;
    }

    .text_con {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;

      p {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }

      .bottom_con {
        display: flex;
        justify-content: space-between;

        p {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #333333;
        }

        a {
          cursor: pointer;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: var(--color_main);
        }
      }
    }
  }
}

.empty_data {
  height: 300px;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 80px;
  }

  p {
    margin-left: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #d5d5d5;
  }
}
</style>
