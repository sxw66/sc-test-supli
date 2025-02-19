<template>
  <NavTopBar/>
  <SldHomeTopSearch/>
  <NavCatHeader/>
  <div class="bottom_line"></div>
  <router-view v-if="isRouterAlive"></router-view>
  <FooterService/>
  <FooterLink/>
</template>

<script>
  import NavTopBar from "../../components/NavTopBar";
  import SldHomeTopSearch from "../../components/SldHomeTopSearch";
  import NavCatHeader from "../../components/NavCatHeader";
  import FooterService from "../../components/FooterService";
  import FooterLink from "../../components/FooterLink";
export default {
  name: 'Home',
  components: {
    NavTopBar,
    SldHomeTopSearch,
    NavCatHeader,
    FooterService,
    FooterLink,
  },
  setup() {
    const isRouterAlive = true
    return { isRouterAlive }
  }
}
</script>
