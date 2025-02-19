<template>
  <div style="background: #fff;width: 100%;">
    <NavTopBar />
    <MemberTop></MemberTop>
    <div class="sld_member_main_content">
      <div class="container">
        <MsgLeftNav />
        <router-view></router-view>
      </div>
    </div>
    <FooterService />
    <FooterLink />
  </div>
</template>

<script>
import NavTopBar from '../../components/NavTopBar'
import FooterService from '../../components/FooterService'
import FooterLink from '../../components/FooterLink'
import MemberTop from '../../components/MemberTop'
import MsgLeftNav from '../../components/MsgLeftNav'

export default {
  name: 'MsgHeader',
  components: {
    MemberTop,
    MsgLeftNav,
    NavTopBar,
    FooterService,
    FooterLink
  },
  setup() {
    const isRouterAlive = true
    return { isRouterAlive }
  }
}
</script>

<style lang="scss" scoped>
.sld_member_main_content {
  width: 100%;
  background-color: #f7f7f7;
  border-top: 1px solid #ebebeb;
  padding-bottom: 10px;

  .container {
    width: 1210px;
    margin: 0 auto;
    padding-left: 0px;
    padding-right: 0px;
    &:before,
    &:after {
      display: table;
      content: ' ';
    }
    &:after {
      clear: both;
    }
  }
}
</style>
