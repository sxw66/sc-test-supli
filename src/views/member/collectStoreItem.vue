<template>
  <div class="sld_vendor_item clearfix">
    <div class="sld_vendor fl">
      <div class="sld_vendor_logo sld_img_center">
        <!-- <img class="lazy" :src="item.storeLogo" alt=""> -->
        <coverImage :src="item.storeLogo" width="114" height="114"></coverImage>
      </div>
      <div class="sld_vendor_name">{{ item.storeName }}</div>
      <div class="sld_rate clearfix">
        <el-rate disabled :colors="colors" score-template="{score}" v-model="score">
        </el-rate>
      </div>
      <div class="sld_vendor_top clearfix">
        <button class="fl" @click="topfollow(item.followId, 1)" v-if="collectStoreIndex == 2">
          {{ L['设为特殊关注'] }}
        </button>
        <button class="fl" @click="topfollow(item.followId, 0)" v-else>
          {{ L['取消特殊关注'] }}
        </button>

        <button class="fr" @click="unfollow(item.storeId)">
          {{ L['取消关注'] }}
        </button>
      </div>
      <div class="sld_vendor_bottom">
        <router-link :to="`/store/index?vid=${item.storeId}`"><i class="iconfont">&#xe654;</i>{{ L['进入供应商'] }}
        </router-link>
      </div>
    </div>
    <div class="main_lbbox fl">
      <div class="sld_vendor_collect">
        <a id="newGoods" :class="1 === storeGoodsType ? 'sld_follow_on' : ''" @click="storeGoodsSwitch(1)"
          style="cursor: pointer;">{{ L['热销推荐'] }}({{ item.goodsList.length }})</a>
        <a id="recommendGoods" :class="{ sld_follow_on: 2 === storeGoodsType }" @click="storeGoodsSwitch(2)"
          style="cursor: pointer;">{{ L['本月上新'] }}({{ item.newGoodsList.length }})</a>
      </div>
      <div class="sld_vendor_goods clearfix">
        <div class="hd">
          <a href="javascript:;" class="next" @click="slideWin(1)" ref="next">
            <i class="iconfont iconziyuan11"></i>
          </a>
          <a href="javascript:;" class="prev" @click="slideWin(0)" ref="prev">
            <i class="iconfont iconziyuan11"></i>
          </a>
        </div>
        <div class="slide_wrap">
          <ul class="bd clearfix" v-if="2 == storeGoodsType">
            <li class="new_goods" v-for="(sub, subindex) in item.newGoodsList" :key="subindex">
              <router-link :to="`/goods/detail?sourcePath=/member/collectStore&productId=${sub.defaultProductId}`">
                <div class="sld_img sld_img_center">
                  <!-- <img class="lazy" :src="sub.mainImage" alt=""> -->
                  <coverImage :src="sub.mainImage" width="150" height="150"></coverImage>
                </div>
                <p class="goods_name">{{ sub.goodsName }}</p>
                <p class="goods_price">R${{ $formatMoneyNum(sub.goodsPrice) }}</p>
              </router-link>
            </li>
            <SldCommonEmpty v-show="!item.newGoodsList.length" totalHeight="228" paddingTop="50" />
          </ul>
          <ul class="bd clearfix" v-else>
            <li class="hot_goods" v-for="(sub, subindex) in item.goodsList" :key="subindex">
              <router-link :to="`/goods/detail?sourcePath=/member/collectStore&productId=${sub.defaultProductId}`">
                <div class="sld_img sld_img_center">
                  <!-- <img class="lazy" :src="sub.mainImage" alt=""> -->
                  <coverImage :src="sub.mainImage" width="150" height="150"></coverImage>
                </div>
                <p class="goods_name">{{ sub.goodsName }}</p>
                <p class="goods_price">{{ L['R$'] }}{{ $formatMoneyNum(sub.goodsPrice) }}</p>
              </router-link>
            </li>
            <SldCommonEmpty v-show="!item.goodsList.length" totalHeight="228" paddingTop="50" />
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SldCommonEmpty from '../../components/SldCommonEmpty'
import { getCurrentInstance, ref, onMounted, watch, computed } from 'vue'
import { ElMessage, ElRate } from 'element-plus'
import { useStore } from 'vuex'

export default {
  name: 'collectStoreItem',
  props: ['item', 'ItemIndex', 'collectStoreIndex'],
  components: {
    SldCommonEmpty,
    ElRate
  },
  setup (props, { emit }) {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    

    const storeGoodsType = ref(1)
    const colors = ref(['var(--color_main)', 'var(--color_main)', 'var(--color_main)'])
    //商品滑动
    const notClickQuick = ref(true) //防止快速点击造成dom混乱
    const slideWin = ltr => {
      let ul = document.getElementsByClassName('bd')[props.ItemIndex]
      let liLength =
        storeGoodsType.value === 2
          ? ul.getElementsByClassName('new_goods').length
          : ul.getElementsByClassName('hot_goods').length
      let isanimate = false
      let nowMg = parseInt(getComputedStyle(ul, null).marginLeft)
      let max =
        liLength % 4 == 0
          ? liLength * 170
          : (Math.floor(liLength / 4) + 1) * 4 * 170
      ul.style.width = max + 'px'
      let slide_wrap_width =
        max -
        document.getElementsByClassName('slide_wrap')[props.ItemIndex]
          .offsetWidth
      if (notClickQuick.value) {
        notClickQuick.value = false
        if (slide_wrap_width < 0 || isanimate) return
        isanimate = true
        let n = 170
        if (ltr) {
          nowMg = nowMg - n * 4
          ul.style.marginLeft =
            (slide_wrap_width >= Math.abs(nowMg) ? nowMg : nowMg + n * 4) + 'px'
        } else {
          nowMg = nowMg + n * 4
          ul.style.marginLeft = (nowMg <= 0 ? nowMg : 0) + 'px'
        }
        proxy.$refs.next.style.backgroundColor =
          slide_wrap_width > Math.abs(nowMg) + 4 * 170 ? '#8d8b8b' : '#ccc'
        proxy.$refs.prev.style.backgroundColor = nowMg >= 0 ? '#ccc' : '#8d8b8b'
        isanimate = false
        setTimeout(function () {
          notClickQuick.value = true
        }, 500)
      } else {
        return
      }
    }

    const score = ref(Number(props.item.serviceScore))
    //取消供应商关注
    const unfollow = storeId => {
      let params = {
        isCollect: false,
        storeId: storeId
      }
      proxy.$post('v3/supplier/channel/followStore/update', params).then(res => {
        if (res.state == 200) {
          emit('collectStoreUpdate')
          ElMessage(res.msg)
        }
      })
    }

    //设置或取消特殊关注供应商
    const topfollow = (followId, isTop) => {
      let params = {
        followId: followId,
        isTop: isTop
      }
      proxy
        .$post('v3/supplier/channel/followStore/editSpecial', params)
        .then(res => {
          if (res.state == 200) {
            emit('collectStoreUpdate')
            ElMessage(res.msg)
          }
        })
    }

    watch(
      () => props.item,
      (ov) => {
        score.value = Number(ov.serviceScore)
      }
    )

    const storeGoodsSwitch = index => {
      storeGoodsType.value = index
    }

    onMounted(() => { })

    return {
      storeGoodsSwitch,
      topfollow,
      unfollow,
      storeGoodsType,
      slideWin,
      L,
      colors,
      score,
    }
  }
}
</script>
<style lang="scss">
@import '@/style/member/collect.scss';
</style>
