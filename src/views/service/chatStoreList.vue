<!--
 * @Author: zoucb
 * @Date: 2021-03-23
 * @LastEditTime: 2021-05-25 20:17:53
 * @LastEditors: Please set LastEditors
 * @FilePath: /src/views/service/chatStoreList.vue
-->
<!--客服聊天左侧聊天列表 @zoucb-2021-03-23-->
<template>
  <div class="sld_chatStoreList">
    <div class="search">
      <div class="search_wrap">
        <i class="el-icon-search"></i>
        <input type="text" id="store_search" :placeholder="L['搜索最近联系人']" v-model="searchStore" />
        <i class="el-icon-close" @click="clearInput"></i>
        <button @click="searchStoreList">{{ L['搜索'] }}</button>
      </div>
    </div>

    <div class="chat_list">
      <el-scrollbar>
        <div v-infinite-scroll="load" infinite-scroll-immediate="false">
          <div :class="{ chat_item: true, chosen: index == chosenFlag }" v-for="(item, index) in storeList.list"
            :key="index" @click="chat_chose(index, item)">
            <img :src="item.vendorAvatar" alt="" />
            <p class="chat_item_name">{{ item.storeName }}</p>

            <div class="delete_icon">
              <div class="nonBrowseMessgeCount" v-if="item.receiveMsgNumber && item.receiveMsgNumber >= 0">
                <span class="">{{ item.receiveMsgNumber }}</span>
              </div>
              <div class="close">
                <el-popconfirm :title="L['确定关闭该对话吗？']" @confirm="closeChatMember(item.storeId)"
                  :confirmButtonText="L['确定']" :cancelButtonText="L['取消']">
                  <template #reference>
                    <i class="el-icon-close"></i>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
          <loadingState v-if="loadState == 'first_loading' || storeList.list.length > 0" :state="loadState" />
          <div class="empty_data_left" v-if="!storeList.list.length > 0">
            <img src="@/assets/goods/empty_data.png" alt="" />
            <p>{{ L['暂无数据～'] }}</p>
          </div>
        </div>
        <div></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { ref, reactive, getCurrentInstance, onMounted, watch } from 'vue'
import loadingState from '@/components/loadingState'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  name: 'chatStoreList',
  beforeCreate () {
    this.sockets.subscribe('contact_change', e => {
      if (this.storeList.list.length == 0) {
        this.storeList.list.push(e)
        this.$socket.emit(
          'member_change_room',
          { storeId: e.storeId, userId: e.userId, role: 1 },
          () => {
            this.emitParentData({
              storeId: e.storeId,
              storeName: e.storeName,
              vendorId: e.vendorId
            })
          }
        )
      } else {
        let cur_index = this.storeList.list.findIndex(
          item => item.storeId == e.storeId
        )
        if (cur_index == -1) {
          this.storeListList.list.unshift(e)
        } else {
          this.storeList.list[cur_index] = e
        }
      }

      if (
        localStorage.msgVoiceSetting === true ||
        localStorage.msgVoiceSetting === 'true'
      ) {
        this.play()
      }

      this.formatMsgContent()
    })
    this.sockets.subscribe('unread_num_change', e => {
      let tmp_data = this.storeList.list.filter(
        item => item.storeId == e.storeId
      )
      if (tmp_data.length == 1) {
        tmp_data[0].receiveMsgNumber = e.unreadNum
      }
    })
  },
  components: {
    loadingState
  },
  setup (props, { emit }) {
    const route = useRoute()
    const store = useStore()
    const chosenFlag = ref(0)
    const chatBaseInfo = ref(store.state.chatBaseInfo)
    const storeList = reactive({
      list: []
    })
    const curInfo = reactive({
      storeId: 0,
      storeName: '',
      vendorAvatar: '',
      vendorId: 0
    })
    const minMsgId = ref('')
    const loadState = ref('')
    const isScroll = ref(false)
    const hasMore = ref(true)
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const searchStore = ref('')
    const memberInfo = ref(store.state.memberInfo)

    //格式化消息内容
    const formatMsgContent = () => {
      if (storeList.list.length > 0) {
        storeList.list.map(item => {
          if (typeof item.msgContent == 'string') {
            item.msgContent = JSON.parse(
              item.msgContent.replace(/&quot;/g, '"')
            )
          }
          //1.text(文本) 2.img(图片) 3.goods(商品) 4.order(订单)用户
          if (item.msgType == 1) {
            item.showContent = item.msgContent.content
          } else if (item.msgType == 2) {
            item.showContent = L['[图片]']
          } else if (item.msgType == 3) {
            item.showContent = L['[商品]']
          } else if (item.msgType == 4) {
            item.showContent = L['[订单]']
          }
        })
      }
    }

    const clearInput = () => {
      if (!searchStore.value) {
        return
      }

      searchStore.value = ''
      searchStoreList()
    }

    //关闭与会员的聊天事件
    const closeChatMember = storeId => {
      proxy.$socket.emit('member_remove_contact', {
        storeId: storeId,
        userId: memberInfo.value.userId,
        role: 1
      })
      storeList.list = storeList.list.filter(item => item.storeId != storeId)
      if (curInfo.storeId == storeId) {
        if (storeList.list.length > 0) {
          //该会员与当前聊天的会员是同一个，需要先移除会员再切换
          chosenFlag.value = -1
          chat_chose(0, storeList.list[0])
        } else {
          emit('getCurStoreInfo', {})
        }
      }
    }

    watch(() => { })

    // 发送当前列表的所有供应商id
    const sendStoreIds = () => {
      let tmpStoreIdArray = []
      storeList.list.map(item => {
        tmpStoreIdArray.push(item.storeId)
      })
      proxy.$socket.emit('send_store_ids', {
        storeId: tmpStoreIdArray.join(','),
        userId: memberInfo.value.userId,
        role: 1
      })
    }

    //获取聊天供应商列表
    const getStoreList = () => {
      let params = {}
      if (minMsgId.value) {
        params.msgId = minMsgId.value
      }

      proxy.$get('v3/supplier/channel/helpdesk/chat/storeList', params).then(res => {
        if (res.state == 200) {
          if (minMsgId.value) {
            storeList.list = storeList.list.concat(res.data)
          } else {
            storeList.list = res.data
          }

          if (
            route.query.vid &&
            route.query.vid == chatBaseInfo.value.storeId
          ) {
            if (
              storeList.list.findIndex(
                item => item.storeId == chatBaseInfo.value.storeId
              ) < 0
            ) {
              storeList.list.unshift(chatBaseInfo.value)
            } else {
              let index = storeList.list.findIndex(
                item => item.storeId == chatBaseInfo.value.storeId
              )
              storeList.list[0] = storeList.list.splice(
                index,
                1,
                storeList.list[0]
              )[0]
            }
          } else {
            let index = storeList.list.findIndex(
              item => item.storeId == route.query.vid
            )
            storeList.list[0] = storeList.list.splice(
              index,
              1,
              storeList.list[0]
            )[0]
          }
          if (storeList.list.length > 0) {
            curInfo.storeId = storeList.list[0].storeId
            curInfo.storeName = storeList.list[0].storeName
            curInfo.vendorAvatar = storeList.list[0].vendorAvatar
            curInfo.vendorId = storeList.list[0].vendorId
            minMsgId.value = storeList.list[storeList.list.length - 1]
            sendStoreIds()
            emit('switchStore', {
              storeId: curInfo.storeId,
              storeName: curInfo.storeName,
              vendorId: curInfo.vendorId
            })
            emit('getCurStoreInfo', {
              storeId: curInfo.storeId,
              storeName: curInfo.storeName,
              vendorAvatar: curInfo.vendorAvatar
            })
          } else {
            curInfo.storeId = 0
            emit('getCurStoreInfo', {})
          }

          hasMore.value = res.data.length < 10 ? false : true
          if (hasMore.value) {
            loadState.value = 'allow_loading_more'
          } else {
            loadState.value = 'no_more_data'
          }
        }
      })
    }

    const searchStoreList = () => {
      let param = {
        storeName: searchStore.value
      }
      proxy.$get('v3/supplier/channel/helpdesk/chat/storeList', param).then(res => {
        if (res.state == 200) {
          chosenFlag.value = -1
          storeList.list = Array.from(res.data)
        }
      })
    }

    //切换供应商
    const chat_chose = (
      index,
      { storeId, storeName, vendorAvatar, vendorId }
    ) => {
      if (chosenFlag.value != index) {
        chosenFlag.value = index
        let oldStoreId = curInfo.storeId
        curInfo.storeId = storeId
        proxy.$socket.emit('member_change_room', {
          storeId: curInfo.storeId,
          oldStoreId,
          userId: memberInfo.value.userId,
          role: 1
        })
        emit('switchStore', { storeId, storeName, vendorId })
        emit('getCurStoreInfo', { storeId, storeName, vendorAvatar })
      } else {
        return
      }
    }

    // 发送事件
    const emitParentData = data => {
      emit('switchStore', {
        userId: data.storeId,
        storeName: data.storeName,
        vendorId: data.vendorId
      })
    }

    // 向下滚动至底部加载数据
    const load = () => {
      if (hasMore.value) {
        isScroll.value = true
        getStoreList()
      }
    }

    // 消息提示音
    const play = () => {
      let audioElement = document.createElement('audio')
      audioElement.setAttribute(
        'src',
        'https://www.slodon.cn/vendor/views/default/media/msg.mp3'
      )
      audioElement.setAttribute('autoplay', 'autoplay')
    }

    onMounted(() => {

      getStoreList()
    })

    return {
      L,
      chosenFlag,
      chat_chose,
      storeList,
      searchStore,
      loadState,
      formatMsgContent,
      emitParentData,
      load,
      closeChatMember,
      searchStoreList,
      clearInput,
      play
    }
  }
}
</script>

<style lang="scss">
.sld_chatStoreList {
  width: 234px;
  background-color: #fff;
  border-right: 2px solid #f7f7f7;
  height: 100%;

  .search {
    height: 50px;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid #f3f3f3;

    .search_wrap {
      width: 213px;
      height: 28px;
      border-top-left-radius: 13px;
      border-bottom-left-radius: 13px;
      border: 1px solid #f3f3f3;
      border-right: none;
      border-top-right-radius: 13px;
      border-bottom-right-radius: 13px;
    }

    &:hover {
      .el-icon-close {
        display: block;
      }
    }

    i {
      margin-left: 5px;
      font-size: 15px;
      color: #999999;

      &.el-icon-close {
        font-size: 17px;
        position: absolute;
        right: 55px;
        top: 50%;
        margin-top: -9px;
        display: none;
      }
    }

    input {
      width: 146px;
      height: 26px;
      outline: none;
      border: none;
      margin-left: 5px;
    }

    input::placeholder {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }

    ::-webkit-input-placeholder {
      margin-left: 20px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }

    /* 使用webkit内核的浏览器 */
    :-moz-placeholder {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }

    /* Firefox版本19+ */
    :-ms-input-placeholder {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #999999;
    }

    /* IE浏览器 */

    button {
      width: 40px;
      height: 26px;
      background: var(--color_main_bg);
      border-top-right-radius: 13px;
      border-bottom-right-radius: 13px;
      border: none;
      color: #fff;
      font-size: 12px;
      font-family: Microsoft YaHei;
    }
  }

  .chat_list {
    height: 100%;

    .chat_item {
      display: flex;
      align-items: center;
      /* width: 97%; */
      height: 50px;
      border-bottom: 1px solid #f3f3f3;
      position: relative;
      cursor: pointer;

      img {
        margin-left: 12px;
        width: 30px;
        height: 30px;
      }

      .chat_item_name {
        margin-left: 10px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }

      .delete_icon {
        position: absolute;
        right: 15px;
        display: flex;
        align-items: center;
      }

      .close {
        display: none;
        width: 20px;
        height: 20px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        margin-left: 5px;

        i {
          font-size: 16px;
          /* position: absolute;
                        left: 2px;
                        top: 2px; */
        }
      }

      .nonBrowseMessgeCount {
        background-color: var(--color_main);
        padding: 0 4px;
        border-radius: 12px;
        height: 16px;
        display: flex;
        align-items: center;

        span {
          display: block;
          color: #fff;
          transform: scale(0.9);
        }
      }

      &:hover {
        background: #f7f7f7;

        .close {
          display: flex;
          margin-left: 5px;
        }
      }
    }

    .chosen {
      background-color: #f7f7f7;

      .chat_item_name {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
      }

      border-left: 2px solid var(--color_main);
    }
  }
}

.empty_data_left {
  height: 300px;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 80px;
  }

  p {
    margin-top: 15px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #d5d5d5;
  }
}

.el-button--text,
.el-button--text:hover {
  color: var(--color_main);
}

.el-button--primary,
.el-button--primary:hover {
  color: #fff;
  background-color: var(--color_main);
  border-color: var(--color_main);
}
</style>
