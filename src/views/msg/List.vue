// 消息列表
<template>
  <div class="sld_msg_list">
    <div class="msg_title">{{ listTitle }}</div>
    <div class="msg_con" v-if="noticeList.data && noticeList.data.length > 0">
      <div class="msg_con_top flex_row_start_center">
        <el-checkbox v-model="checkedAll" @change="checkMsgAll">{{
      L['全选']
    }}</el-checkbox>
        <div class="msg_con_right flex_row_start_center">
          <div class="msg_del flex_row_center_center cursor_pointer" @click="delMsg()">
            <img src="@/assets/msg/msg_del.png" alt="" />
            <span>{{ L['删除'] }}</span>
          </div>
          <div class="msg_read flex_row_center_center cursor_pointer" @click="readMsg">
            <img src="@/assets/msg/msg_read.png" alt="" />
            <span>{{ L['批量标为已读'] }}</span>
          </div>
          <div class="msg_read msg_allClose flex_row_center_center cursor_pointer" @click="allMsg">
            <img src="@/assets/msg/msg_allClose.png" alt="" />
            <span>{{ L['全部标为已读'] }}</span>
          </div>
        </div>
      </div>
      <div class="msg_list">
        <div class="msg_list_pre" v-for="(noticeItem, noticeIndex) in noticeList.data" :key="noticeIndex">
          <p class="msg_pre_time">{{ noticeItem.msgSendTime }}</p>
          <div class="msg_pre">
            <div class="msg_pre_title flex_row_between_center">
              <el-checkbox v-model="noticeItem.checked" class="pre_title_left" @change="noticeChecked()">{{
      noticeItem.tplName }}</el-checkbox>
              <el-popconfirm :confirmButtonText="L['确定']" :cancelButtonText="L['取消']" icon="el-icon-info"
                iconColor="red" :title="L['确定删除这条消息吗？']" @confirm="delMsg(noticeItem.receiveId)">
                <template #reference><i class="iconfont iconziyuan51 pre_title_right cursor_pointer"></i></template>
              </el-popconfirm>
            </div>
            <!-- 	消息状态：0--未读，1--已读，2--删除 -->
            <div class="msg_content flex_row_between_center">
              <div class="msg_content_left flex_row_start_start">
                <span class="msg_tips" v-if="noticeItem.msgState == 0"></span>
                <p :class="{ active: noticeItem.msgState == 1 }">
                  {{ noticeItem.msgContent }}
                </p>
              </div>
              <div class="msg_content_right cursor_pointer" @click="goMsgDetail(noticeItem)">
                {{ L['查看详情 >'] }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex_row_end_center sld_pagination sld_page_bottom" v-if="noticeData.data &&
      noticeData.data.pagination &&
      noticeData.data.pagination.total
      ">
          <el-pagination @current-change="handleCurrentChange" v-model:currentPage="current" :page-size="pageSize"
            layout="prev, pager, next, jumper" :total="noticeData.data.pagination.total" :hide-on-single-page="true">
          </el-pagination>
        </div>
      </div>
    </div>
    <SldCommonEmpty v-if="!noticeList.data || (noticeList.data && noticeList.data.length == 0)
      " totalWidth="900" totalHeight="300" style="color:#666" :tip="L['暂时没有消息！']" />
  </div>
</template>

<script>
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watchEffect,
  watch
} from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import SldCommonEmpty from '../../components/SldCommonEmpty'
export default {
  components: {
    SldCommonEmpty
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()
    const L = proxy.$getCurLanguage()
    const current = ref(1)
    const pageSize = ref(10)
    const noticeList = reactive({ data: [] }) //消息列表
    const checkedAll = ref(false) //全选是否选中
    const noticeData = reactive({ data: {} }) //消息数据
    const receiveIds = ref('') //被选中的id集
    const curTplTypeCode = ref('msg_all') //消息nav当前的项的tplTypeCode,默认为msg_all，消息列表全部
    const listTitle = ref(L['消息列表'])
    const listTitleMap = ref(new Map())
    listTitleMap.value.set('msg_all', L['消息列表'])
    listTitleMap.value.set('system_news', L['系统消息'])
    listTitleMap.value.set('order_news', L['订单消息'])
    listTitleMap.value.set('assets_news', L['资产消息'])
    listTitleMap.value.set('after_sale_news', L['售后消息'])
    listTitleMap.value.set('appointment_news', L['预约提醒'])
    onMounted(() => {
      curTplTypeCode.value = route.query.curTplTypeCode
      listTitle.value = listTitleMap.value.get(curTplTypeCode.value)
      getMsglist()
    })
    //获取消息列表
    const getMsglist = () => {
      let params = {}
      if (curTplTypeCode.value == 'msg_all') {
        params = {
          pageSize: pageSize.value,
          current: current.value
        }
      } else {
        params = {
          pageSize: pageSize.value,
          current: current.value,
          tplType: curTplTypeCode.value
        }
      }
      proxy.$get('v3/supplier/channel/userMsg/msgList', params).then(res => {
        if (res.state == 200) {
          let result = res.data
          noticeData.data = result
          noticeList.data = result.list
          noticeList.data.map(noticeItem => {
            noticeItem.checked = false
          })
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    //监听
    watchEffect(() => {
      if (route.query.curTplTypeCode) {
        curTplTypeCode.value = route.query.curTplTypeCode
        // checkedAll.value = false; //是否全选置为默认值
        // getMsglist();
      }
    })

    watch(
      () => curTplTypeCode.value,
      (nv, ov) => {
        if (nv != ov) {
          listTitle.value = listTitleMap.value.get(nv)
          checkedAll.value = false
          getMsglist()
        }
      }
    )

    const checkMsgAll = () => {
      //全选状态是否选中
      if (checkedAll.value == true) {
        noticeList.data.map(noticeItem => {
          noticeItem.checked = true
        })
      } else {
        noticeList.data.map(noticeItem => {
          noticeItem.checked = false
        })
      }
    }

    //消息状态处理
    const noticeChecked = () => {
      let noCheckList = []
      noCheckList = noticeList.data.filter(
        noticeItem => noticeItem.checked == false
      )

      if (noCheckList.length > 0) {
        checkedAll.value = false
      } else {
        checkedAll.value = true
      }
    }
    //上一页
    const handlePrevCilickChange = () => {
      checkedAll.value = false
      current.value--
      getMsglist()
    }
    //下一页
    const handleNextCilickChange = () => {
      checkedAll.value = false
      current.value++
      getMsglist()
    }
    //当前页
    const handleCurrentChange = () => {
      checkedAll.value = false
      getMsglist()
    }
    //选中的id集
    const checkReceiveID = () => {
      let checkList = []
      checkList = noticeList.data.filter(
        noticeItem => noticeItem.checked == true
      )
      let receiveIdsData = []
      checkList.map(checkItem => {
        receiveIdsData.push(checkItem.receiveId)
      })
      receiveIds.value = receiveIdsData.join(',')
    }
    //删除消息
    const delMsg = receiveId => {
      let params = {}
      if (receiveId) {
        params = {
          receiveIds: receiveId
        }
        delMsgMe(params)
        return
      }
      checkReceiveID()
      if (receiveIds.value) {
        params = {
          receiveIds: receiveIds.value
        }
        proxy
          .$confirm(L['确定删除这些消息吗'], L['提示'], {
            confirmButtonText: L['确定'],
            cancelButtonText: L['取消'],
            type: 'warning'
          })
          .then(() => {
            delMsgMe(params)
          })
      } else {
        ElMessage.error(L['请先选择要操作的消息！'])
      }
    }

    const delMsgMe = params => {
      proxy.$post('v3/supplier/channel/userMsg/delete', params).then(res => {
        if (res.state == 200) {
          ElMessage.success(res.msg)
          getMsglist()
          proxy.$getUserInfo()
          checkedAll.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    //标为已读
    const readMsg = () => {
      checkReceiveID()
      let params = {
        receiveIds: receiveIds.value
      }
      if (receiveIds.value) {
        proxy.$post('v3/supplier/channel/userMsg/read', params).then(res => {
          if (res.state == 200) {
            ElMessage.success(res.msg)
            checkedAll.value = false
            getMsglist()
            proxy.$getUserInfo()
          } else {
            ElMessage.error(res.msg)
          }
        })
      } else {
        ElMessage.error(L['请先选择要操作的消息！'])
      }
    }
    //全部标为已读
    const allMsg = () => {
      let params = {
        isAllRead: true,
        isPc: true,
      }
      proxy.$post('v3/supplier/channel/userMsg/read', params).then(res => {
        if (res.state == 200) {
          ElMessage.success(res.msg)
          checkedAll.value = false
          getMsglist()
          proxy.$getUserInfo()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const readMsgNOTip = () => {
      checkReceiveID()
      let params = {
        receiveIds: receiveIds.value
      }
      if (receiveIds.value) {
        proxy.$post('v3/supplier/channel/userMsg/read', params).then(res => {
          if (res.state == 200) {
            getMsglist()
            proxy.$getUserInfo()
          }
        })
      }
    }

    //消息跳转
    const goMsgDetail = noticeItem => {
      let msgLinkInfo = JSON.parse(noticeItem.msgLinkInfo)
      let curNotice = [] //当前消息
      curNotice = noticeList.data.filter(
        item => item.receiveId == noticeItem.receiveId
      )
      if (curNotice && curNotice.length > 0) {
        curNotice[0].checked = true
        readMsgNOTip()
      }
      let newWin = null
      switch (msgLinkInfo.type) {
        //仅退款
        case 'order_news':
          if (
            msgLinkInfo.orderType &&
            msgLinkInfo.orderType == 'integral_order'
          ) {
            newWin = router.resolve({
              path: '/member/pointOrder/detail',
              query: {
                orderSn: msgLinkInfo.orderSn
              }
            })
          } else {
            newWin = router.resolve({
              path: '/member/order/detail',
              query: {
                orderSn: msgLinkInfo.orderSn
              }
            })
          }
          break

        case 'balance_change':
          newWin = router.resolve({
            path: '/member/balance'
          })
          break

        case 'coupon_news':
          newWin = router.resolve({
            path: '/member/coupon'
          })
          break

        case 'coupon_center':
          newWin = router.resolve({
            path: '/coupon'
          })
          break

        //退款退货
        case 'return_news':
          newWin = router.resolve({
            path: '/member/order/refund/detail',
            query: {
              afsSn: msgLinkInfo.afsSn,
              curTitleId: 2
            }
          })
          break

        case 'integral_change':
          newWin = router.resolve({
            path: '/member/myPoint'
          })
          break

        case 'appointment_news':
          newWin = router.resolve({
            path: '/goods/detail',
            query: {
              productId: msgLinkInfo.productId
            }
          })
          break

        case 'refund_news':
          newWin = router.resolve({
            path: '/member/order/refund/detail',
            query: {
              afsSn: msgLinkInfo.afsSn,
              curTitleId: 1
            }
          })
          break
      }
      window.open(newWin.href, '_blank')
    }
    return {
      current,
      pageSize,
      noticeList,
      checkedAll,
      noticeChecked,
      noticeData,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      delMsg,
      receiveIds,
      readMsg,
      curTplTypeCode,
      L,
      goMsgDetail,
      listTitle,
      checkMsgAll,
      allMsg
    }
  }
}
</script>

<style lang="scss">
@import '../../style/base.scss';
@import '../../style/msgList.scss';

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: var(--color_main);
  border-color: var(--color_main);
}

.el-checkbox__inner:hover {
  border-color: var(--color_main);
}

.el-checkbox__input.is-checked+.el-checkbox__label {
  color: var(--color_main);
}
</style>
