<!--
 * @Author: your name
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-09 10:34:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/home/Home.vue
-->
<template>
  <div class="home_adv_con" v-show="advTop.show_switch && (route.fullPath === '/' || route.fullPath === '/index')">
    <div class="home_adv" :style="{ backgroundImage: 'url(' + advTop.imgUrl + ')' }" @click="navTo">
      <div class="adv1200">
        <div class="close1" @click.stop="advTop.show_switch = false">×</div>
      </div>
    </div>
  </div>

  <NavTopBar />
  <SldHomeTopSearch />
  <NavCatHeader />
  <div class="bottom_line"></div>
  <router-view v-if="isRouterAlive"></router-view>
  <FooterService />
  <FooterLink />
</template>

<script>
import { useRoute } from 'vue-router'
import NavTopBar from '../../components/NavTopBar'
import SldHomeTopSearch from '../../components/SldHomeTopSearch'
import NavCatHeader from '../../components/NavCatHeader'
import FooterService from '../../components/FooterService'
import FooterLink from '../../components/FooterLink'
import { ref, getCurrentInstance, onMounted } from 'vue'
export default {
  name: 'Home',
  components: {
    NavTopBar,
    SldHomeTopSearch,
    NavCatHeader,
    FooterService,
    FooterLink
  },
  setup () {
    const close_layer_icon = require('@/assets/coupon/close_layer_icon.png')
    const route = useRoute()
    const isRouterAlive = true
    const { proxy } = getCurrentInstance()
    const advTop = ref({})
    const getAdv = () => {
      proxy
        .$get('v3/supplier/channel/pcDeco/firstAdv', {
          type: 2
        })
        .then(res => {
          if (res.state == 200) {
            advTop.value = JSON.parse(res.data.data.replace(/&quot;/g, '"'))
          }
        })
    }

    const navTo = () => {
      proxy.$diyNavTo(advTop.value)
    }

    onMounted(() => {
      getAdv()
    })

    return { isRouterAlive, advTop, close_layer_icon, navTo, route }
  }
}
</script>
<style>
.bottom_line {
  width: 100%;
}

.home_adv_con {
  overflow: hidden;
  height: 80px;
  position: relative;
  margin: 0 auto;
}

.home_adv {
  width: 1920px;
  height: 80px;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -960px;
}

.adv1200 {
  width: 1200px;
  height: 80px;
  margin: 0 auto;
  position: relative;
}

.close1 {
  top: 10px;
  right: 10px;
  z-index: 2;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  width: 22px;
  height: 22px;
  line-height: 22px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  font-size: 17px;
  font-family: cursive;
}
</style>
