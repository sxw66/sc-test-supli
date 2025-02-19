<template>
  <NavTopBar/>
  <SldHomeTopSearch/>
  <NavCatHeader/>
  <div class="bottom_line"></div>
  <router-view></router-view>
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
  name: 'Goods',
  components: {
    NavTopBar,
    NavCatHeader,
    FooterService,
    FooterLink,
    SldHomeTopSearch,
  },
  setup() {
    const isRouterAlive = true;
    return { isRouterAlive }
  }
}
</script>
