<template>
  <section>
    <div class="recommend_layout recommend_goods_wrap_adv">
      <el-carousel indicator-position="none" loop :autoplay="false" height="260px" arrow="always"
        v-if="goodsInfo.length > 0">
        <el-carousel-item v-for="(outs, outDx) in goodsInfo" :key="outDx" style="display: flex;">
          <div class="goods_unit" v-for="(inner, index) in outs" :key="index">
            <router-link class="flex_column_center_center"
              :to="`/goods/detail?productId=${inner.productId}&sourcePath=${route.path}`" target="_blank">
              <img :src="inner.mainImage" alt="" class="normal MemberIndex">
              <div style="margin-top: 15px;">
                <div class="goods_n normal">{{ inner.goodsName }}</div>
                <div class="flex_row_center_center" style="margin-top: 10px;">
                  <span class="price_n"><span>R$</span>{{ $formatMoneyNum(inner.goodsPrice) }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div style="display: flex;" v-else>
        <div class="goods_unit_img" v-for="(item, index) in 5" :key="index">
          <img src="@/assets/web_goods.png" alt="" class="web_goods_img">
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { useStore } from 'vuex';
export default {
  props: {
    goodsInfo: Array,
  },
  setup () {
    const route = useRoute()
    const layoutType = ref('normal')
    const recommendTitle = ref('')
    const recommendList = ref([])
    const translateNum = ref(0)
    const translateCompute = computed(() => (`translateX(${translateNum.value}px)`))
    let moveIndex = ref(0)
    const uniWidth = ref(1020)
    const lengthLeft5 = computed(() => {
      return (10 - recommendList.value.length) % 5
    })
    

    const getLeftOuts = (length) => {
      return (5 - length)
    }


    return {
      uniWidth,
      route,
      moveIndex,
      layoutType,
      recommendList,
      translateCompute,
      recommendTitle,
      lengthLeft5,
      getLeftOuts,
    }
  }
}
</script>

<style lang="scss">
.recommend_goods_wrap_adv {
  width: 100%;
  background: #fff;

  .el-carousel__button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
  }

  .el-carousel__arrow {
    width: 26px;
    height: 35px;
    line-height: 35px;
    border-radius: 0;
    background-color: rgba(0, 0, 0, .15);
    font-size: 13px !important;

    &:hover {
      background-color: rgba(0, 0, 0, .4);
    }
  }

  .el-carousel__arrow--right {
    right: 0;

    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding-left: 5px;

    .el-icon-arrow-right {
      font-weight: bold;
    }
  }

  .el-carousel__arrow--left {
    left: 0;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    padding-right: 5px;

    .el-icon-arrow-left {
      font-weight: bold;
    }
  }

  .carousel__item {
    display: flex;
    align-items: center;
  }

  .recommend_header {
    height: 51px;
    padding: 0 21px;
    border-bottom: 1px solid #E8E8F1;
    line-height: 51px;

    &.GoodsDetail,
    &.memberOrderDetail,
    &.CartIndex {
      background: #F8F8F8;
      border-bottom: none !important;

      span {
        font-weight: normal;
      }
    }

    &.MemberFootprint {
      margin-top: 15px;
    }

    span {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
  }

  .recommend_line {
    position: relative;

    .arrow_right {
      position: absolute;
      right: 0;
    }

    .arrow_left {
      position: absolute;
      left: 0;
    }

    .arrow {
      z-index: 99;

      img {
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all .3s;
        transform-origin: center;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .recommend_container {
      flex: 1;
      overflow-x: hidden;
      margin: 0 0px;
    }
  }

  .goods_unit_img {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 204px;
    height: 260px;
    background: #F6F6F6;

    .web_goods_img {
      width: 46px;
      height: 46px;
    }

    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 200px;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      background: -webkit-gradient(linear, left top, left bottom, from(white), color-stop(#eeeeee), to(white));
      background: linear-gradient(180deg, white, #eeeeee, white);
    }
  }

  .goods_unit {
    width: 204px;
    height: 260px;
    background: #FFFFFF;
    padding-top: 20px;


    cursor: pointer;
    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 200px;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      background: -webkit-gradient(linear, left top, left bottom, from(white), color-stop(#eeeeee), to(white));
      background: linear-gradient(180deg, white, #eeeeee, white);
    }

    &:nth-child(5n) {
      &::after {
        display: none;
      }
    }

    img.normal {
      width: 160px;
      height: 160px;
      object-fit: cover;
      background: #eee !important;
      font-weight: 300;
      transition: opacity ease 0.5s;
    }

    .goods_n {
      font-weight: 400;
      color: #2D2D2D;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      transition: color ease 0.5s;
    }

    .goods_n.normal {
      width: 160px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      text-align: center;
    }


    .price_n {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: var(--color_price);
      font-weight: bold;

      span {
        &:first-child {
          font-size: 12px;
        }
      }
    }

    .sale_n {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #777777;
    }

    &:hover {
      img.normal {
        opacity: 0.65;
      }

      .goods_n {
        color: var(--color_price);
      }
    }

  }
}
</style>