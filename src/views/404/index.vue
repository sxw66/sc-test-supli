<template>
  <NavTopBar />
  <SldHomeTopSearch />
  <NavCatHeader />
  <div class="error_page flex_column_center_center">
    <div class="error_page_logo"></div>
    <div class="error_page_tips">{{ L['亲，抱歉! 您查看的页面失联啦...'] }}</div>
    <div class="error_page_main flex_row_between_center">
      <span class="error_page_left">{{ L['您可以：去其他地方逛逛'] }}</span>
      <span class="error_page_right" @click="navTo('/')">{{ L['商城首页'] }}</span>
      <span class="error_page_line"></span>
      <span class="error_page_right" @click="navTo('/member/collect/goods')">{{ L['已收藏的商品'] }}</span>
    </div>
  </div>
  <FooterService />
  <FooterLink />
</template>
<script>
import { getCurrentInstance } from 'vue';
import NavTopBar from "../../components/NavTopBar";
import SldHomeTopSearch from "../../components/SldHomeTopSearch";
import NavCatHeader from "../../components/NavCatHeader";
import FooterService from "../../components/FooterService";
import FooterLink from "../../components/FooterLink";
import { useRouter } from 'vue-router';
export default {
  name: "errorPath",
  components: {
    NavTopBar,
    SldHomeTopSearch,
    NavCatHeader,
    FooterService,
    FooterLink,
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const router = useRouter();
    const navTo = (path) => {
      router.replace(path);
    }

    return { navTo, L }
  }
};
</script>
<style lang="scss" scoped>
.error_page {
  padding-top: 80px;
  padding-bottom: 200px;
  border-top: 3px solid var(--color_main);

  .error_page_logo {
    width: 380px;
    height: 280px;
    background-image: url("../../assets/error_logo.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .error_page_tips {
    line-height: 70px;
    color: #333333;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    margin-top: 85px;
    margin-bottom: 40px;
    cursor: default;
  }

  .error_page_main {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;

    .error_page_left {
      color: #999999;
      margin-right: 20px;
      cursor: default;
    }

    .error_page_right {
      color: rgba(12, 97, 232, 1);
      margin-left: 16px;
      cursor: pointer;
    }

    .error_page_line {
      width: 1.6px;
      height: 14px;
      background: #999999;
      margin-left: 16px;
    }
  }
}
</style>