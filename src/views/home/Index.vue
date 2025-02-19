<template>
  <div class="index">
    <template v-if="firstLoading">
      <div class="skeleton_banner"></div>
      <div class="w_sld_react_1210 adv_04_wrap skeleton">
        <div class="floor_title">
          <h2>
            <!-- <font></font> -->
            <p style="font-family: Arial; font-size: 16px;">&nbsp;</p>
            <span></span>
            <p style="font-family: Arial; font-size: 16px;">&nbsp;</p>
            <!-- <font>&nbsp;</font> -->
          </h2>
        </div>
        <div class="floor_goods">
          <div class="item" v-for="(item_main, index_main) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" v-bind:key="index_main">
            <div class="wrap">
              <a href="javascript:void(0)" class="example_text"></a>
              <p class="title">
                <a href="javascript:void(0)">{{ item_main }}</a>
              </p>
              <p class="price">
                <span></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <SldDiy v-if="decorateData.data.length" :decorateData="decorateData" @adv19="handleAdv19" />
    <OpenScreen @closeScreen="closeScreen" v-if="show_open_screen" :openScreenData="openScreenData.data"></OpenScreen>

    <!-- 空页面 start-->
    <SldCommonEmpty v-if="!firstLoading && !decorateData.data.length" totalHeight="900" paddingTop="250"
      :tip="L['我们正在努力装修中，敬请期待～']" />
    <!-- 空页面 end-->
  </div>
</template>
<script>
import { reactive, getCurrentInstance, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SldDiy from '../../components/SldDiy'
import { ElMessage } from 'element-plus'
import OpenScreen from '../../components/OpenScreen'
import { useStore } from 'vuex'
import { apiUrl } from '@/utils/config'
import SldCommonEmpty from '../../components/SldCommonEmpty'
export default {
  name: 'index',
  components: {
    SldDiy,
    OpenScreen,
    SldCommonEmpty,
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    // const adv_21_right_icon = require('../../assets/decorate/right_more_icon.png')
    // const adv_24_let_default_pic = require('../../assets/decorate/adv_24_let_default_pic.png')
    const decorateData = reactive({ data: [] }) //装修数据
    const openScreenData = reactive({ data: {} }) //开屏数据
    const firstLoading = ref(true) //是否第一次加载
    const { proxy } = getCurrentInstance()
    const show_open_screen = ref(false)
    const store = useStore()
    const L = proxy.$getCurLanguage()
    const getInitData = () => {
      let param = {}
      if (route.query.type == 'view' && route.query.id)
        param.decoId = route.query.id
      proxy.$get('v3/supplier/channel/pcDeco/index', param).then(res => {
        firstLoading.value = false
        if (res.state == 200 && res.data && res.data.data) {
          decorateData.data = JSON.parse(res.data.data.replace(/&quot;/g, '"'))
          decorateData.data.map(item => {
            item.json_data = item.json
            if (item.json_data && item.json_data.type == 'adv_19') {
              item.json_data.data.map(child => {
                child.cur_tab = 0
              })
            }
            if (item.json_data && item.json_data.type == 'main_banner') {
              item.json_data.data = item.json_data.data.filter(i => i.imgUrl)
            }
            if(item.json_data && item.json_data.type == 'adv_27') {
              // console.log(item.json_data, 'item.json_data---');
              const keys = ['left', 'left_center', 'right','right_center'];
              for (let k of keys) {
                item.json_data[k].data.goods_data = item.json_data[k].data.goods_data.map(goodsItem => {
                  // console.log(k, goodsItem, 'goodsItem---productList');
                  // 数据解构不一样-
                  if(Array.isArray(goodsItem)) {
                    const _arr = goodsItem.map(_item => {
                      const curItem = _item.productList.find(_ => _.wholesalePrice == _item.goodsPrice) || _item.productList[0] || {};
                      const productId = curItem.productId || _item.defaultProductId;
                      return {
                        ..._item,
                        productId,
                      }
                    })
                    return _arr;
                  } else { // 对象型
                    const curItem = goodsItem.productList.find(_ => _.wholesalePrice == goodsItem.goodsPrice) || goodsItem.productList[0] || {};
                    const productId = curItem.productId || goodsItem.defaultProductId;
                    return {
                      ...goodsItem,
                      productId,
                    }
                  }
                });
              }
              // console.log(item.json_data, 'item.json_data--changed');
            }
          })
          console.log(decorateData.data, 'decorateData-----');
        }
      })
    }
    const getOpenScreen = () => {
      proxy.$get('v3/supplier/channel/pcDeco/firstAdv').then(res => {
        if (res.state == 200) {
          openScreenData.data = JSON.parse(
            res.data.data.replace(/&quot;/g, '"')
          )
          if (
            openScreenData.data.imgUrl &&
            openScreenData.data.show_switch &&
            !route.query.type
          ) {
            if (JSON.stringify(store.state.openScreenInfo) == '{}') {
              openScreenData.data.time = new Date().getTime()
              store.commit('updateOpenScreenInfo', openScreenData.data)
              show_open_screen.value = true
              document.body.style.overflow = 'hidden'
            } else if (
              store.state.openScreenInfo.show_radio_sele ==
              openScreenData.data.show_radio_sele
            ) {
              if (store.state.openScreenInfo.show_radio_sele == 'one') {
                if (openScreenData.data.time - new Date().getTime() > 86400) {
                  openScreenData.data.time = new Date().getTime()
                  store.commit('updateOpenScreenInfo', openScreenData.data)
                  show_open_screen.value = true
                  document.body.style.overflow = 'hidden'
                }
              } else if (store.state.openScreenInfo.show_radio_sele == 'more') {
                store.commit('updateOpenScreenInfo', openScreenData.data)
                show_open_screen.value = true
                document.body.style.overflow = 'hidden'
              }
            } else {
              openScreenData.data.time = new Date().getTime()
              store.commit('updateOpenScreenInfo', openScreenData.data)
              show_open_screen.value = true
              document.body.style.overflow = 'hidden'
            }
          }
        }
      })
    }
    const closeScreen = () => {
      show_open_screen.value = false
      document.body.style.overflow = ''
    }
    router.beforeEach((to, from, next) => {
      document.body.style.overflow = ''
      next()
    })
    const handleAdv19 = data => {
      let tmp_data = decorateData.data.filter(
        item => item.dataId == data.dataId
      )[0]
      tmp_data.json_data.data[data.left_or_right_index]['cur_tab'] =
        data.tab_index
    }

    onMounted(() => { 
        if(route.query.memberId){
            let param ={}
            param.memberId = route.query.memberId
            proxy.$post('v3/channelLogin/oauth/jumpLoginFree', param).then(res => {
            if (res.state == 200) {
              //将用户信息存缓存，并跳转到首页
                        store.commit('loginUpdate', {
                access_token: res.data.access_token,
                refresh_token: res.data.refresh_token
              })
              //获取用户信息，并同步信息到vuex
              proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
                if (res.state == 200) {
                  store.commit('updateMemberInfo', res.data)
                                window.location.href = apiUrl
                }
              })
            } else {
              //提示错误
              ElMessage(res.msg)
            }
          })
        }
        getOpenScreen()
        getInitData()
    })

    return {
      // adv_21_right_icon,
      // adv_24_let_default_pic,
      decorateData,
      firstLoading,
      show_open_screen,
      openScreenData,
      handleAdv19,
      closeScreen,
      L
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/decorate.scss';

.index {
  min-height: 456px;
  background: #f8f8f8;
  padding-bottom: 10px;
}

.recommend_wrap_index {
  width: 1210px;
  margin: 0 auto;
}

.skeleton_banner {
  width: 100%;
  height: 470px;
  background: $colorSkeleton;
  margin-bottom: 10px;
}

.skeleton {
  &.adv_04_wrap .floor_title h2 span {
    background: $colorSkeleton;
    display: inline-block;
    width: 200px;
  }

  &.adv_04_wrap .floor_goods .item .wrap .title {
    background: $colorSkeleton;
    width: 100%;

    a {
      color: transparent;
    }
  }

  &.adv_04_wrap .floor_goods .item .wrap .price {
    width: 100%;
    height: 25px;
  }

  &.adv_04_wrap .floor_goods .item .wrap .price span {
    display: inline-block;
    width: 70px;
    height: 100%;
    background: $colorSkeleton;
  }
}
</style>
