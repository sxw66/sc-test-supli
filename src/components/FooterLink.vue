<template>
  <div class="footer_link">
    <div class="link_box" v-if="navList.data.length > 0">
      <div
        class="link_wrap"
        v-for="({ categoryName, categoryId, articleList },
        index) in navList.data"
        :key="index"
      >
        <p @click="toarticle(categoryId)">{{ categoryName }}</p>
        <li
          v-for="({ title, cateId, articleId, outUrl }, index) in articleList"
          :key="index"
          @click="navArt(cateId, articleId, outUrl)"
        >
          <a style="cursor: pointer;">{{ title }}</a>
        </li>
      </div>
    </div>
    <div class="footer_affix" v-if="isShowTabBar&&!store.state.loginFlag">
      <el-affix position="bottom" :offset="5">
        <div class="login-bottom-bar-wrapper">
          <div class="login-bottom-bar-left">
            <div class="wrapper-title">{{L["登录查看更多福利，有机会获得"]}}</div>
            <span class="exclusive-offe">{{ L["专属优惠"] }}</span>
            <div class="wrapper-title">{{ L["噢~"] }}</div>
          </div>
          <div class="login-bottom-bar-right">
            <el-button  size="large" color="#ff7e28" @click="handeSigninNow">{{L["立即登录"]}}</el-button>
            <el-icon size="28" color="#ffff" @click="handeSignClose"><Close /></el-icon>
          </div>
        </div>
      </el-affix>
    </div>
    <div :class="navList.data.length > 0 ? 'bottom_box' : 'bottom_box_none'">
      <FooterBottom></FooterBottom>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import FooterBottom from "./FooterBottom";
import { reactive, getCurrentInstance,ref,computed } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useStore } from "vuex";
export default {
  name: "FooterLink",
  components: {
    FooterBottom,
    Close,
  },
  props: ["caseNumber"],
  setup() {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const store = useStore();
    const router = useRouter();
    const navList = reactive({ data: [] });
    const isShowTabBar = ref(true);
    const getInitData = () => {
      let param = {};
      param.cateSize = 6;
      param.articleSize = 5;
      proxy.$get("v3/supplier/channel/article/helpList", param).then((res) => {
        if (res.state == 200) {
          navList.data = res.data;
        }
      });
    };

    const navArt = (cateId, articleId, outUrl) => {
      if (outUrl) {
        window.open(outUrl);
      } else {
        router.push({
          path: "/article",
          query: { cateId: cateId, articleId: articleId },
        });
      }
    };
    // 立即登录
    const handeSigninNow = () => {
        store.state.loginState = 1;
    };
    // 关闭
    const handeSignClose = () => {
        isShowTabBar.value = false;
    };
    getInitData();
    return { L,store,navList,isShowTabBar, navArt,handeSigninNow,handeSignClose };
  },
};
</script>

<style lang="scss" scoped>
.footer_link {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  .link_box {
    border-top: 1px dashed #f2f2f2;
    padding-top: 50px;
    width: 1210px;
    margin: 0 auto 50px;
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;

    .link_wrap {
      text-align: center;

      p {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #333333;
      }

      li {
        line-height: 25px;

        a {
          color: #333333;

          &:hover {
            color: var(--color_main);
          }
        }
      }
    }
  }

  .bottom_box,
  .bottom_box_none {
    position: relative;
    width: 1903px;
    overflow: hidden;
    height: 130px;
  }

  .bottom_box_none {
    width: 100%;
    height: 87px;
    background-color: #333333;
  }
  .footer_affix {
    position: absolute;
    bottom: 0px;
    width: 100%;
    z-index: 10;
    :deep(.el-affix--fixed) {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .login-bottom-bar-wrapper {
      height: 58px;
      display: flex;
      justify-content: center; /* 确保图片内容水平居中 */
      align-items: center; /* 确保图片内容垂直居中 */
      .login-bottom-bar-left {
        display: flex;
        align-items: center;
        margin: 0 20px;
        font-size: 18px;
        font-weight: 700;
        .wrapper-title {
          color: white;
        }
        .exclusive-offe {
          color: #ff7e28;
        }
      }
      .login-bottom-bar-right {
        display: flex;
        align-items: center;
         :deep(.el-button){
            margin: 0 35px 0 0;
            color: white;
        }
      }
    }
  }
}
</style>