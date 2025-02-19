<template>
  <div :class="{
    sld_store_item: true,
    clearfix: true,
    skeleton_sld_store_item: skeleton ? skeleton : false
  }">
    <div class="sld_vendor fl">
      <div class="sld_vendor_logo sld-img-center">
        <img :src="item.storeLogoUrl" alt="" />
      </div>
      <div class="sld_vendor_name">{{ item.storeName }}</div>
      <div class="sld_rate clearfix">
        <el-rate disabled :colors="colors" score-template="{score}" v-model="score">
        </el-rate>
      </div>
      <div class="sld_vendor_bottom">
        <router-link :to="`/store/index?vid=${item.storeId}`" target="_blank"><i class="iconfont">&#xe654;</i>{{
    L['进入供应商'] }}</router-link>
      </div>
    </div>
    <div class="main_lbbox fl">
      <div class="sld_vendor_collect">
        <a id="recommendGoods" :class="2 === indexNum ? 'sld_follow_on' : ''" @click="isOnLogic(2)"
          href="javascript:;">{{
    L['热销推荐'] }}<span>({{ item.hotGoodsNumber }})</span></a>
        <a id="newGoods" :class="1 === indexNum ? 'sld_follow_on' : ''" @click="isOnLogic(1)" href="javascript:;">{{
    L['本月上新'] }}<span>({{ item.newGoodsNumber }})</span></a>
        <p class="fr">
          <span><em>{{ item.followNumber }}</em>{{ L['人已收藏'] }}</span>
          <span>{{ L['供应商已售'] }}{{ item.orderFinishedCount }}{{ L['件'] }}</span>
        </p>
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
          <ul class="bd clearfix" v-if="1 === indexNum">
            <li class="new_goods" v-for="(newGoods, index) in item.newGoodsList" :key="index">
              <router-link :to="`/goods/detail?productId=${newGoods.defaultProductId}`" target="_blank">
                <div class="sld_img sld-img-center">
                  <div class="img" :style="{
    backgroundImage: 'url(' + newGoods.goodsImage + ')'
  }"></div>
                </div>
                <p class="goods_name">{{ newGoods.goodsName }}</p>
                <p class="goods_price">
                  {{ L['R$'] }}{{ $formatMoneyNum(newGoods.goodsPrice || 0) }}
                </p>
                <p class="sale">{{ L['已售'] }}{{ newGoods.actualSales }}件</p>
              </router-link>
            </li>
            <div class="empty" v-show="!item.newGoodsNumber">
              <img src="../../assets/goods/empty_data.png" alt="" />
              <p>{{ L['本店暂无商品~'] }}</p>
            </div>
          </ul>
          <ul class="bd clearfix" v-else>
            <li class="hot_goods" v-for="(hotGoods, index) in item.goodsList" :key="index">
              <router-link :to="`/goods/detail?productId=${hotGoods.defaultProductId}`" target="_blank">
                <div class="sld_img sld-img-center">
                  <div class="img" :style="{
    backgroundImage: 'url(' + hotGoods.goodsImage + ')'
  }"></div>
                </div>
                <p class="goods_name">{{ hotGoods.goodsName }}</p>
                <p class="goods_price">
                  {{ L['R$'] }}{{ $formatMoneyNum(hotGoods.goodsPrice || 0) }}
                </p>
                <p class="sale">{{ L['已售'] }}{{ hotGoods.actualSales }}件</p>
              </router-link>
            </li>
            <div class="empty" v-show="!item.hotGoodsNumber">
              <img src="../../assets/goods/empty_data.png" alt="" />
              <p>{{ L['本店暂无商品~'] }}</p>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { ElRate } from 'element-plus'
import { useStore } from 'vuex'

export default {
  name: 'storeListItem',
  props: ['item', 'ItemIndex', 'skeleton'],
  components: {
    ElRate
  },
  data () {
    return {
      value: 3
    }
  },
  setup (props) {
    
    const indexNum = ref(2)

    //新物品和热销物品按钮切换
    const isOnLogic = index => {
      indexNum.value = index
    }
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const score = ref(Number(props.item.serviceScore))
    const colors = ref(['var(--color_main)', 'var(--color_main)', 'var(--color_main)'])

    //商品滑动
    const notClickQuick = ref(true) //防止快速点击造成dom混乱
    const slideWin = ltr => {
      let ul = document.getElementsByClassName('bd')[props.ItemIndex]
      let liLength =
        indexNum.value === 1
          ? ul.getElementsByClassName('new_goods').length
          : ul.getElementsByClassName('hot_goods').length
      let isanimate = false
      let max =
        liLength % 5 == 0
          ? liLength * 170
          : (Math.floor(liLength / 5) + 1) * 5 * 170
      let nowMg = parseInt(getComputedStyle(ul, null).marginLeft)
      let slide_wrap_width =
        max -
        document.getElementsByClassName('slide_wrap')[props.ItemIndex]
          .offsetWidth
      ul.style.width = max + 'px'
      if (notClickQuick.value) {
        notClickQuick.value = false
        if (slide_wrap_width < 0 || isanimate) return
        isanimate = true
        let n = 170
        if (ltr) {
          nowMg = nowMg - n * 5
          ul.style.marginLeft =
            (slide_wrap_width >= Math.abs(nowMg) ? nowMg : nowMg + n * 5) + 'px'
        } else {
          nowMg = nowMg + n * 5
          ul.style.marginLeft = (nowMg <= 0 ? nowMg : 0) + 'px'
        }
        proxy.$refs.next.style.backgroundColor =
          slide_wrap_width > Math.abs(nowMg) + 5 * 170 ? '#8d8b8b' : '#ccc'
        proxy.$refs.prev.style.backgroundColor = nowMg >= 0 ? '#ccc' : '#8d8b8b'
        isanimate = false
        setTimeout(function () {
          notClickQuick.value = true
        }, 500)
      }
    }
    onMounted(() => {
      if (props.item.newGoodsList.length < 5) {
        proxy.$refs.next.style.backgroundColor = '#ccc'
        proxy.$refs.prev.style.backgroundColor = '#ccc'
      }
    })

    return { slideWin, indexNum, isOnLogic, score, colors, L, }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/storeList.scss';
@import '@/style/base.scss';

.empty {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: #666;
    margin-left: 11px;
  }
}
</style>
