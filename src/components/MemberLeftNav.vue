<!--个人中心左侧公共导航 @zjf-2020-12-26-->
<template>
  <div class="sld_member_left_nav">
    <template v-for="(item, index) in leftNavMenu" :key="index">
      <template v-if="curLang !== 'zh' && item.name.length >= 32">
        <el-tooltip
          class="box-item"
          effect="dark"
          :content="item.name"
          placement="right-start"
        >
          <router-link :to="{ path: item.path }" class="menu">
            <i :class="{ iconfont: true, [item.icon]: true }"></i>
            <span class="link-name"> {{ item.name }}</span>
          </router-link>
        </el-tooltip>
      </template>
      <template v-else>
        <router-link :to="{ path: item.path }" class="menu">
          <i :class="{ iconfont: true, [item.icon]: true }"></i>
          <span class="link-name"> {{ item.name }}</span>
        </router-link>
      </template>
      <template v-if="item.child.length">
        <template v-for="(item_child, index_child) in item.child" :key="index_child">
          <template v-if="curLang !== 'zh' && item_child.name.length >= 32">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="item_child.name"
              placement="right-start"
            >
              <router-link :to="{ path: item_child.path, query: item_child.query }"
                :class="{ submenu: true, cur_code_active: curCode == item_child.code }"
              >
                <span class="link-name">{{ item_child.name }}</span>
              </router-link>
            </el-tooltip>
          </template>
          <template v-else>
            <router-link :to="{ path: item_child.path, query: item_child.query }"
              :class="{ submenu: true, cur_code_active: curCode == item_child.code }"
            >
              <span class="link-name"> {{ item_child.name }}</span>
            </router-link>
          </template>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import { getCurrentInstance, watchEffect, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  name: "MemberLeftNav",
  components: {},
  setup () {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const curCode = ref("");
    const memberInfo = ref(store.state.memberInfo);

    const curLang = computed(() => store.state.curLang);

    watchEffect(() => {
      let tmpPath = router.currentRoute.value.fullPath;

      if (
        router.currentRoute.value.name != undefined &&
        router.currentRoute.value.name
      ) {
        curCode.value = router.currentRoute.value.name;
        if (tmpPath == "/member/collect/store") {
          curCode.value = "memberCollectStore"; //关注供应商
        } else if (
          tmpPath == "/member/order/aftersales?type=return" ||
          tmpPath.indexOf("/member/order/refund/detail?curTitleId=2") > -1
        ) {
          curCode.value = "AfterSalesListReturn"; //我的退货
        } else if (
          tmpPath == "/member/order/aftersales" ||
          tmpPath.indexOf("/member/order/refund/detail?curTitleId=1") > -1
        ) {
          curCode.value = "AfterSalesList"; //我的退款
        }
      }
    });
    const leftNavMenu = [
      {
        code: "tarde",
        icon: "icongerenzhongxinjiaoyizhongxin",
        name: L["交易中心"],
        path: "/member/index",
        child: [
          {
            code: "memberOrderList",
            name: L["我的订单"],
            path: "/member/order/list"
          },
          {
            code: "MemberOrderEvaluation",
            name: L["交易评价/晒单"],
            path: "/member/order/evaluation"
          }
        ]
      },
      {
        code: "collect",
        icon: "icongerenzhongxinguanzhu",
        name: L["关注中心"],
        path: "/member/index",
        child: [
          {
            code: "MemberCollect",
            name: L["我的收藏"],
            path: "/member/collect/goods"
          },
          // {
          //   code: "memberCollectStore",
          //   name: L["关注供应商"],
          //   path: "/member/collect/store"
          // },
          {
            code: "MemberFootprint",
            name: L["我的足迹"],
            path: "/member/footprint"
          }
        ]
      },
      {
        code: "service",
        icon: "icongerenzhongxinkehufuwu",
        name: L["客户服务"],
        path: "/member/index",
        child: [
          {
            code: "AfterSalesList",
            name: L["我的退款"],
            path: "/member/order/aftersales"
          },
          {
            code: "AfterSalesListReturn",
            query: { type: "return" },
            name: L["我的退货"],
            path: "/member/order/aftersales"
          }
        ]
      },
      {
        code: "member",
        icon: "icongerenzhongxinhuiyuanzhongxin",
        name: L["会员中心"],
        path: "/member/index",
        child: [
          {
            code: "MemberInfo",
            name: L["会员信息"],
            path: "/member/info"
          },
          {
            code: "MemberAccount",
            name: L["账号安全"],
            path: "/member/account"
          },
          {
            code: "MemberPhoneMange",
            name: L["手机号管理"],
            path: "/member/phone"
          },
          {
            code: "memberEmailMange",
            name: L["邮箱管理"],
            path: "/member/email"
          },
          {
            code: "MemberLoginPassword",
            name: L["登录密码"],
            path: "/member/pwd/login"
          },
          // {
          //   code: "memberAddressList",
          //   name: L["收货地址"],
          //   path: "/member/address/list"
          // }
        ]
      },
      {
        code: "money",
        icon: "icongerenzhongxincaichanzhongxin",
        name: L["我的钱包"],
        path: "/member/index",
        child: [

          {
            code: "MemberCoupon",
            name: L["我的优惠券"],
            path: "/member/coupon"
          }
        ]
      }
    ];

    return { leftNavMenu, curCode, memberInfo, curLang, };
  }
};
</script>

<style lang="scss" scoped>
.sld_member_left_nav {
  float: left;
  width: 180px;
  color: #666;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-top: 1px solid #fff;
  margin-top: -1px;
  padding-bottom: 18px;

  .menu {
    display: flex;
    align-items: center;
    color: #333333;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 10px;
    padding-left: 15px;
    padding-top: 22px;
    border-top: 1px solid #EBEBEB;

    &:nth-child(1) {
      margin-top: 0;
      border-top: none;
    }
    i {
      color: #888;
      font-size: 16px;
      font-weight: 400;
      margin-right: 8px;
    }
    .link-name {
      display: -webkit-box;
      overflow: hidden;
      width: 130px;
      line-height: 28px;
      color: inherit;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }
  }

  .submenu {
    display: block;
    line-height: 30px;
    color: #777777;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    padding-left: 41px;

    &:hover {
      font-weight: bold;
      color: var(--color_main);
    }

    &.cur_code_active {
      font-weight: bold;
      color: var(--color_main);
    }
    .link-name {
      display: -webkit-box;
      overflow: hidden;
      width: 130px;
      line-height: 28px;
      color: inherit;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }
  }
}
</style>