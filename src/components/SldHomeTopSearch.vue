// 头部搜索导航栏
<template>
  <div class="sld_home_top_search container">
    <div class="ld sld_home_top_search_left">
      <router-link tag="a" class="sld_logo_wrap flex_row_start_center" :to="`/index`">
        <img :src="configInfo.supplier_main_site_logo" alt />
      </router-link>
    </div>
    <div class="sld_seach_wrap">
      <div class="sld_seach_box ld">
        <div class="form" @submit.prevent>
          <input v-model="keyword" type="text" class="text" autocomplete="off" :placeholder="L['请输入关键词']"
            @keyup.enter="search" ref="searchInput" @focus="inputFocus" @input="inputChange" @blur="inputBlur" />
          <button type="submit" class="button" @click="search">{{ L['搜索'] }}</button>
        </div>
        <div class="hot_search_wrap">
          <div>
            <template v-for="(item, index) in hotList.data" :key="index">
              <a href="javascript:void(0)" @click="quickSearch(index, 'quick')" :title="tmpHotList[index]">{{
        item
      }}</a>
            </template>
          </div>
        </div>
      </div>
      <div class="search_association" id="searchA" v-show="SAList.length && SAShow">
        <div class="s_a_item" v-for="(item, index) in SAList" @mousedown="quickSearch(item.wordsContent, 'associ')"
          :key="index">
          <!-- 因为click事件与blur事件冲突，blur事件优先，于是换成mousedown -->
          <div>{{ item.wordsContent }}</div>
          <div>{{ item.searchGoodsNum }}{{ L['个商品'] }}</div>
        </div>
      </div>
    </div>
    <div v-if="searchBarFixed" class="container_header">
      <div class="container_header_box flex_row_start_center">
        <div class="sld_cart_wrap fixed_sld_cart_wrap">
          <router-link tag="a" class="sld_logo_wrap flex_row_start_center" :to="`/index`">
            <img :src="configInfo.supplier_main_site_logo" alt />
          </router-link>
        </div>
        <div class="sld_seach_wrap" style="margin-right: 90px">
          <div class="sld_seach_box ld">
            <div class="form">
              <input v-model="keyword" type="text" class="text" autocomplete="off" style="color:rgb(153,153,153);"
                :placeholder="L['请输入关键词']" ref="searchInput" @focus="inputFocus" />
              <button type="submit" class="button" @click="search">{{ L['搜索'] }}</button>
            </div>
          </div>
        </div>
        <div class="sld_cart_wrap">
          <dl class>
            <dt class="ld cart_icon_text_wrap" style="border-bottom: 1px solid rgb(239, 239, 239);">
              <span class="iconfont icongouwuche"></span>
              <router-link target="_blank" :to="`/cart/index`">{{ L['我的进货单'] }}</router-link>
              <!-- 没有商品显示0 -->
              <div class="cart_goods_num">{{
        cartData.data && cartData.data.availableCartNum ?
          cartData.data.availableCartNum : 0
      }}</div>
            </dt>
            <dd class="cart_more_view">
              <cart-model></cart-model>
            </dd>
          </dl>
        </div>
      </div>

    </div>
    <div class="sld_cart_wrap">
      <dl class>
        <router-link target="_blank" :to="`/cart/index`">
          <dt class="ld cart_icon_text_wrap" style="border-bottom: 1px solid rgb(239, 239, 239);">
            <span class="iconfont icongouwuche"></span>
            <span>{{ L['我的进货单'] }}</span>
            <!-- 没有商品显示0 -->
            <div class="cart_goods_num">{{
        cartData.data && cartData.data.availableCartNum ?
          cartData.data.availableCartNum : 0
              }}
            </div>
          </dt>
        </router-link>
        <dd class="cart_more_view">
          <cart-model></cart-model>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref, watch, watchEffect, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import CartModel from '@/components/CartModel';

export default {
  name: "SldHomeTopSearch",
  components: {
    CartModel
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const route = useRoute()
    const L = proxy.$getCurLanguage();
    const store = useStore();
    const cartData = reactive({ data: {} }); //获取vux的store中的进货单数据
    const logoUrl = "";
    const configInfo = ref(store.state.configInfo)
    // const defaultImg = ref('this.src="' + require('../assets/common_top_logo.png') + '"')
    const keyword = ref(route.query.keyword);
    // const searchUrl = require("../assets/header/magnify.png");
    // const cartUrl = require("../assets/header/cart.png");
    // const picture = require("../assets/picture.png");
    const goods_name = "";
    const searchBarFixed = ref(false);
    const hotList = reactive({ data: [] }); //热门搜索词列表
    const tmpHotList = ref([])
    const delGoodsCartIds = ref(''); //删除商品的id
    const SAList = ref([])
    const SAShow = ref(false)
    onMounted(() => {
      cartData.data = store.state.cartListData;
      getInitData();
    })
    const getInitData = () => {
      proxy
        .$get("v3/system/common/getSettings?names=supplier_hot_search_words")
        .then(res => {
          if (res.state == 200) {
            let tmp_data = res.data[0] ? res.data[0].split(",").filter(i => i != '') : [];
            hotList.data = tmp_data;
            tmpHotList.value = tmp_data
            hotList.data = hotList.data.map(key => {
              if (key.length > 10) {
                return key.substring(0, 10) + '...'
              } else {
                return key
              }
            })
          }
        });
    };

    watch(() => store.state.configInfo, () => {
      if (!configInfo.value.supplier_main_site_logo) {
        configInfo.value = store.state.configInfo;
      }
    })

    watchEffect(() => {
      if (route.query.keyword) {
        keyword.value = route.query.keyword;
      } else {
        keyword.value = "";
      }
      cartData.data = store.state.cartListData;
      //获取进货单数量
      if (store.state.loginFlag) {
        proxy.$get("v3/supplier/channel/cart/cartNum").then((res) => {
          if (res.state == 200) {
            cartData.data.availableCartNum = res.data ? res.data : 0;
          }
        });
      }

    });

    //搜索事件
    const search = () => {
      proxy.$refs.searchInput.style.color = 'rgb(153,153,153)'

      if (keyword.value) {
        router.push({
          path: `/goods/list`,
          query: { keyword: keyword.value }
        });
      }
    };


    const searchAssociation = (input) => {
      proxy.$get('v3/supplier/channel/goods/searchWords/list', {
        keyWord: input
      }).then(res => {
        if (res.state == 200) {
          SAList.value = res.data
        }
      })
    }

    const inputChange = (e) => {
      let input = e.target.value.trim()
      SAShow.value = true

      if (input) {
        searchAssociation(input)
      } else {
        SAList.value = []
      }
    }


    //热门搜索事件
    const quickSearch = (val, type) => {
      if (type == "quick") {
        router.push({ path: `/goods/list`, query: { keyword: tmpHotList.value[val] } });
      } else {
        if (val == route.query.keyword) {
          keyword.value = val
        } else {
          router.push({ path: `/goods/list`, query: { keyword: val } });

        }
      }
    };

    const inputFocus = () => {
      proxy.$refs.searchInput.style.color = '#333'
      SAShow.value = true
      if (keyword.value && SAList.value.length == 0) {
        searchAssociation(keyword.value)
      }
    }

    const inputBlur = () => {
      SAShow.value = false
    }

    //滚动事件
    const handleScroll = () => {
      var height = 600;
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > height) {
        searchBarFixed.value = true;
      } else {
        searchBarFixed.value = false;
      }
    };
    window.addEventListener("scroll", handleScroll);

    //删除商品 curCartItem: 当前商品信息
    const delCartGoods = (curCartItem) => {
      if (store.state.loginFlag) {
        //已登录
        delGoodsCartIds.value = curCartItem.cartId;
      } else {
        //未登录
        delGoodsCartIds.value = curCartItem.goodsId;
      }
      confirmDelGoodsModel();
    };
    //确定删除商品
    const confirmDelGoodsModel = () => {
      if (store.state.loginFlag) {
        // 已登录
        let params = {
          cartIds: delGoodsCartIds.value,
        };
        proxy
          .$post("v3/supplier/channel/cart/deleteCarts", params)
          .then((res) => {
            if (res.state == 200) {
              cartData.data = res.data;
              ElMessage.success(L["删除成功！"]);
            } else {
              ElMessage.error(res.msg);
            }
          });
      }
      store.commit("updateCartListData", cartData.data);
    };

    return {
      L,
      logoUrl,
      // searchUrl,
      // cartUrl,
      // picture,
      goods_name,
      hotList,
      searchBarFixed,
      keyword,
      search,
      quickSearch,
      delGoodsCartIds,
      delCartGoods,
      cartData,
      configInfo,
      // defaultImg,
      inputFocus,
      tmpHotList,
      searchAssociation,
      SAList,
      inputChange,
      inputBlur,
      SAShow
    }
  }
};
</script>

<style lang="scss" scoped>
a:active,
a:visited {
  color: #333;
}

.sld_home_top_search {
  height: 99px;
  position: relative;
  z-index: 12;
  width: 1210px;
  margin: 0 auto 15px;
  padding-left: 0px;
  padding-right: 0px;

  .container_header {
    width: 100%;
    position: fixed;
    background-color: #fff;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999;
    border-bottom: 2px solid var(--color_main);

    .sld_seach_wrap,
    .sld_cart_wrap {
      margin: 5px;
      margin-right: 40px;
      position: relative;
    }

    .container_header_box {
      width: 1200px;
      margin: 0 auto;

      .fixed_sld_cart_wrap {
        margin-right: 170px;

        a {
          width: 100%;
          height: 100%;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }
      }
    }
  }

  .container_header {
    -webkit-animation: searchTop 0.5s ease-in-out;
    animation: searchTop 0.5s ease-in-out;
  }

  @-webkit-keyframes searchTop {
    0% {
      top: -50px;
    }

    to {
      top: 0;
    }
  }

  @keyframes searchTop {
    0% {
      top: -50px;
    }

    to {
      top: 0;
    }
  }

  &:before {
    display: table;
    content: " ";
  }

  .sld_home_top_search_left {
    position: relative;
    float: left;
    width: 331px;
    margin-top: 24px;

    .sld_logo_wrap {
      display: block;
      width: 160px;
      height: 60px;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .sld_seach_wrap {
    float: left;
    width: 660px;
    padding-top: 4px;
    margin-top: 30px;
    position: relative;

    .sld_seach_box {
      width: 580px;
      z-index: 11;
      height: 38px;
      margin-bottom: 3px;
      border: 2px solid var(--color_main);

      .form {
        height: 100%;
        overflow: hidden;

        .text {
          height: 36px;
          background-color: #fff;
          width: 471px;
          -webkit-appearance: none;
          -webkit-border-radius: 0;
          height: 34px;
          color: rgb(153, 153, 153);
          padding: 5px 5px 5px 10px;
          background-position: 0 -360px;
          background-color: #fff;
          background-repeat: repeat-x;
          line-height: 20px;
          font-family: arial, "\5b8b\4f53";
          font-size: 12px;
          outline: none;
          border: none;
        }

        input {
          margin: 0;
          padding: 0;
          height: 33px;
          border: 0;
        }

        button {
          height: 35px;
          border: 0;
        }

        input::placeholder {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgb(153, 153, 153);
        }

        ::-webkit-input-placeholder {
          margin-left: 20px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgb(153, 153, 153);
        }

        /* 使用webkit内核的浏览器 */
        :-moz-placeholder {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgb(153, 153, 153);
        }

        /* Firefox版本19+ */
        :-ms-input-placeholder {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgb(153, 153, 153);
        }

        /* IE浏览器 */

        .button {
          width: 103px;
          background: var(--color_main_bg);
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          float: right;
          cursor: pointer;
          text-align: center;
        }
      }

      .hot_search_wrap {
        height: 30px;
        line-height: 30px;
        color: #999;
        overflow: hidden;

        strong {
          float: left;
          font-weight: 400;
        }

        a {
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;

          &:link,
          &:visited {
            float: left;
            margin-right: 10px;
          }

          &:hover {
            color: var(--color_main);
          }
        }
      }
    }

    .search_association {
      background: #fff;
      position: absolute;
      top: 43px;
      overflow: hidden;
      position: absolute;
      left: 0;
      width: 580px;
      border: 1px solid #ccc;
      background: #fff;
      z-index: 99;

      .s_a_item {
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        padding: 1px 5px;
        line-height: 24px;
        cursor: pointer;
        font-size: 12px;
        -webkit-font-smoothing: antialiased;
        color: #666;

        div:first-child {
          width: 250px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        div:last-child {
          overflow: hidden;
          color: #aaa;
        }

        &:hover {
          background-color: rgb(255, 233, 188);
        }
      }
    }
  }
}

.sld_cart_wrap {
  float: right;
  position: relative;
  z-index: 99;
  height: 40px;
  width: 165px;
  margin-top: 34px;
  margin-right: 13px;

  a,
  a:visited,
  a:hover {
    text-decoration: none;
    color: unset;
  }

  dl {
    margin-bottom: 0px;

    .cart_goods_num {

      margin-left: 10px;
      padding: 1px 3px;
      font-size: 12px;
      line-height: 12px;
      color: #fff;
      background-color: var(--color_price);
      border-radius: 7px;
      min-width: 16px;
      text-align: center;

    }

    .cart_icon_text_wrap {
      display: flex;
      align-items: center;
    }

    dt {
      position: absolute;
      z-index: 3;
      width: 165px;
      height: 38px;
      border: 1px solid #e3e3e3;
      background-color: #fff;
      cursor: pointer;
      font-weight: 400;

      .iconfont {
        margin: 0 13px 0 12px;
        color: var(--color_main);
        font-size: 26px;
        font-weight: 600;
        vertical-align: bottom;
        font-family: "iconfont" !important;
        font-size: 17px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 36px;
      }


      &.cart_icon_text_wrap {
        a {
          color: #666666;
          font-size: 14px;
          line-height: 36px;
          max-width: 110px;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
        text-align: center;
        }
      }
    }

    dd {
      .cart_goods {
        dl {
          padding-top: 8px;
        }

        dd {
          &.cart_goods_price {
            position: static;

            em {
              margin-right: 6px;
              width: auto;
              color: #666;

              &:nth-child(1) {
                display: block;
                font-weight: 600;
              }

              &:nth-child(2) {
                display: block;
                text-align: right;
                margin-top: 6px;
              }
            }
          }
        }
      }
    }
  }

  dd {
    position: absolute;
    top: 37px;
    right: 0;
    width: 355px;
    border: 1px solid #e3e3e3;
    background: #fff;
    z-index: 1;
  }

  &:hover .cart_more_view {
    display: inline-block;
  }
}

.cart_more_view {
  display: none;

  .empty_cart {
    width: 100%;
    position: relative;

    .empty_cart_line {
      position: absolute;
      width: 163px;
      right: 0;
      height: 2px;
      top: -2px;
      z-index: 999;
      background: #fff;
    }

    .empty_cart_txt {
      padding: 10px;
      color: #999;
    }
  }
}

.ld {
  position: relative;
  zoom: 1;
}

.cart_data {
  height: 300px;
  display: flex;
  flex-direction: column;
  position: relative;

  .cart_data_title {
    font-weight: 600;
    float: left;
    padding: 7px;
    line-height: 32px;
    height: 32px;
  }

  .cart_list {
    padding: 20px;
    overflow-y: scroll;

    .cart_list_pre {
      margin-bottom: 20px;

      .cart_pre_left {
        .cart_pre_img {
          width: 48px;
          height: 48px;
          border: 1px solid #e3e3e3;
          cursor: pointer;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .cart_pre_cen {
          width: 150px;
          margin-left: 20px;
          cursor: pointer;

          .cart_pre_name {
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .cart_pre_spec {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-top: 5px;
          }
        }
      }

      .cart_pre_right {
        .cart_pre_price {
          color: #666;
        }

        .cart_pre_del {
          color: #666;
          cursor: pointer;
          margin-top: 10px;

          &:hover {
            color: var(--color_main);
          }
        }
      }
    }
  }

  .cart_bottom {
    width: 100%;
    height: 44px;
    border: 1px solid #e3e3e3;

    .cart_bottom_left {
      padding-left: 11px;
      height: 44px;

      span {
        color: #666;

        &:nth-child(2) {
          margin-left: 5px;
        }
      }
    }

    .cart_bottom_right {
      width: 110px;
      height: 44px;
      text-align: center;
      color: #fff;
      background-color: var(--color_main);
      line-height: 44px;
      cursor: pointer;
    }
  }
}
</style>