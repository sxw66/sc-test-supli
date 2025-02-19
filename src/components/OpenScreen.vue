<!--
 * @Author: wangwei
 * @Date: 2021-01-09 10:28:06
 * @LastEditTime: 2021-02-01 11:17:01
 * @LastEditors: Please set LastEditors
 * @Description: 首页开屏图
 * @FilePath: /java-pc/src/components/OpenScreen.vue
-->
<template>
  <div class="sld_open_screen" :style="{height:height+'px'}">
    <div class="image">
      <img class="pointer" :src="openScreenData.imgUrl" @click="diyNavTo(openScreenData)" alt="">
      <img @click="close" class="close" :src="close_layer_icon" alt="">
    </div>
  </div>
</template>

<script>
  import { getCurrentInstance, ref } from 'vue'
  export default {
    name: 'OpenScreen',
    props: {
      openScreenData: Object,//装修的数据
    },
    components: {

    },
    setup(props, { emit }) {
      const { proxy } = getCurrentInstance();
      const close_layer_icon = require('@/assets/coupon/close_layer_icon.png')
      const height = ref(document.documentElement.clientHeight)
      const close = () => {
        emit('closeScreen')
      }
      window.scroll(0, 0)
      const diyNavTo = (val) => {
        proxy.$diyNavTo(val)
      }
      return { close_layer_icon, close, diyNavTo, height }
    }
  }
</script>

<style lang="scss" scoped>
  .sld_open_screen {
    position: fixed;
    background: rgba(0, 0, 0, .4);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    z-index: 1000;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .image {
      width: 680px;
      height: 420px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .close {
      position: absolute;
      width: 28px;
      height: 28px;
      top: 10px;
      right: 40px;
      z-index: 2;
      cursor: pointer;
    }
  }
</style>