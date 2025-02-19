<!-- 供应商公共头部 @zjf-2020-12-29 -->
<template>
  <NavTopBar />
  <StoreHeaderCat />
  <router-view></router-view>
  <FooterService />
  <FooterLink />
</template>

<script>
import NavTopBar from "../../components/NavTopBar";
import FooterService from "../../components/FooterService";
import FooterLink from "../../components/FooterLink";
import StoreHeaderCat from "./StoreHeaderCat";
import { useRoute } from "vue-router";
import { ref, provide } from 'vue'

export default {
  name: 'StoreHeader',
  components: {
    NavTopBar,
    FooterService,
    FooterLink,
    StoreHeaderCat,
  },
  setup () {
    const route = useRoute();
    const vid = ref(route.query.vid);
    provide('vid', vid);

    return { vid }
  }
}
</script>

