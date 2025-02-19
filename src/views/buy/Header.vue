<!--
 * @Author: your name
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2020-12-29 16:07:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/buy/Header.vue
-->
<template>
  <NavTopBar />
  <router-view v-if="isRouterAlive"></router-view>
  <FooterService />
  <FooterLink />
</template>

<script>
  import NavTopBar from "../../components/NavTopBar";
  import FooterService from "../../components/FooterService";
  import FooterLink from "../../components/FooterLink";
  export default {
    name: 'Home',
    components: {
      NavTopBar,
      FooterService,
      FooterLink,
    },
    setup() {
      const isRouterAlive = true
      return { isRouterAlive }
    }
  }
</script>