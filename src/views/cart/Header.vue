<template>
  <NavTopBar />
  <div class="sld_cart_top">
    <div class="ld sld_home_top_search_left">
      <router-link tag="a" class="sld_logo_wrap flex_row_start_center" :to="`/index`">
        <img :src="configInfo.supplier_main_site_logo" alt />
      </router-link>
    </div>
    <div class="sld_seach_wrap">
      <div class="sld_seach_box ld">
        <form class="form" @submit.prevent>
          <input v-model="keyword" type="text" class="text" autocomplete="off" style="color:rgb(153,153,153);"
            :placeholder="L['请输入关键词']" @keyup.enter="search" ref="searchInputCart" @focus="inputFocus" />
          <button type="submit" class="button" @click="search">{{ L['搜索'] }}</button>
        </form>
      </div>
    </div>
  </div>
  <router-view></router-view>
  <FooterService />
  <FooterLink />
</template>

<script>
import NavTopBar from '../../components/NavTopBar'
import FooterService from '../../components/FooterService'
import FooterLink from '../../components/FooterLink'
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'Cart',
  components: {
    NavTopBar,
    FooterService,
    FooterLink
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const isRouterAlive = true
    const store = useStore()
    const configInfo = ref(store.state.configInfo)
    const router = useRouter()
    const keyword = ref(
      router.query != undefined &&
        router.query.keyword != undefined &&
        router.query.keyword
        ? router.query.keyword
        : ''
    )

    const search = () => {
      proxy.$refs.searchInputCart.style.color = 'rgb(153,153,153)'
      if (keyword.value) {
        router.push({
          path: `/goods/list`,
          query: { keyword: keyword.value }
        })
      }
    }

    const inputFocus = () => {
      proxy.$refs.searchInputCart.style.color = '#333'
    }

    return {
      configInfo,
      keyword,
      search,
      isRouterAlive,
      L,
      inputFocus
    }
  }
}
</script>

<style lang="scss">
.sld_cart_top {
  width: 1200px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;

  .sld_home_top_search_left {
    position: relative;
    float: left;
    width: 331px;
    margin-top: 24px;

    .sld_logo_wrap {
      display: block;
      width: 160px;
      height: 80px;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .sld_seach_wrap {
    width: 590px;
    padding-top: 4px;
    margin-top: 30px;

    .sld_seach_box {
      width: 580px;
      z-index: 11;
      margin-bottom: 3px;
      border: 2px solid var(--color_main);

      .form {
        background-color: var(--color_main);
        height: 34px;
        overflow: hidden;

        .text {
          height: 36px;
          background-color: #fff;
          width: 471px;
          -webkit-appearance: none;
          -webkit-border-radius: 0;
          height: 34px;
          padding: 5px 5px 5px 10px;
          background-position: 0 -360px;
          background-color: #fff;
          background-repeat: repeat-x;
          line-height: 20px;
          font-family: arial, '\5b8b\4f53';
          font-size: 12px;
          outline: none;
          border: none;
        }

        input {
          margin: 0;
          padding: 0;
          height: 34px;
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

        .button {
          width: 103px;
          background: var(--color_main_bg);
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          float: right;
          cursor: pointer;
          outline: none;
          border: none;
          height: 100%
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
  }
}
</style>
