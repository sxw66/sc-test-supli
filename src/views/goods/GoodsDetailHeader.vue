<!-- 商品详情页头部 @zjf-2020-12-29 -->
<template>
  <NavTopBar/>
  <router-view></router-view>
  <FooterService/>
  <FooterLink/>
</template>

<script>
  import NavTopBar from "../../components/NavTopBar";
  import FooterService from "../../components/FooterService";
  import FooterLink from "../../components/FooterLink";

  export default {
    name: 'GoodsDetailHeader',
    components: {
      NavTopBar,
      FooterService,
      FooterLink,
    },
    setup() {}
  }
</script>

