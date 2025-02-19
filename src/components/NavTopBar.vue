<!-- 头部登陆注册导航栏 -->
<template>
  <div class="header_wrap">
    <div class="header">
      <div class="header_left">
        <ul>
          <li :style="curLang == 'en' ? 'padding: 0 10px;':''">
            <div class="has_more li_item">
                  {{ curShowLang }}
               <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                    @click.stop="changeLanguage(item.type)" v-for="(item,index) in lanList" :key="index">{{ item.name }}</a>
                </div>
            </div>                                         
          </li>
        </ul>
        <span :class="['hello', curLang != 'zh' ? 'pt' : '' ]">{{ L['您好，欢迎来到'] }}</span>
        <span class="hello two">{{ configInfo.basic_site_name }}</span>
        <template v-if="loginFlag">
          <span class="register h1" @click="goToByPush('/member/index')">{{ memberInfo.userName }}</span>
          <span class="register h1 login_out" @click="loginOut()">[{{ L['退出'] }}]</span>
        </template>

        <template v-if="!loginFlag">
          <span class="register h1" @click="handeLoginModel">{{ L['登录'] }}</span>
        </template>
      </div>
      <div class="header_right">
        <ul>
          <li @click="goToByPush('/index', {})">
            <div class="li_item has_tit">{{ L['商城首页'] }}</div>
          </li>
          <li>
            <div class="has_more li_item">
                <div class="has_tit">{{ L['我的订单'] }}</div>
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/list', { 'orderState': 10 })">{{ L['待支付订单'] }}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/list', { 'orderState': 30 })">{{ L['待收货订单'] }}</a>
                <a href="javascript:void(0)" class="li_item_more_item"
                  @click="goToByPush('/member/order/evaluation')">{{
          L['待评价订单'] }}</a>
              </div>
            </div>
          </li>
          <li @click="goToByPush('/member/index')">
            <div class="li_item has_tit">{{ L['个人中心'] }}</div>
          </li>
          <li>
            <div class="has_more li_item">
                <div class="has_tit">{{ L['我的收藏'] }}</div>
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item" @click="goToByPush('/member/collect/goods')">{{
          L['商品收藏']
        }}</a>
                <!-- <a href="javascript:void(0)" class="li_item_more_item" @click="goToByPush('/member/collect/store')">{{
          L['供应商收藏'] }}</a> -->
                <a href="javascript:void(0)" class="li_item_more_item" @click="goToByPush('/member/footprint')">{{
          L['我的足迹']
        }}</a>
              </div>
            </div>
          </li>
          <li>
            <div class="has_more li_item">
                <div class="has_tit">{{ L['我的账户'] }}</div>
              <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item" @click="goToByPush('/member/coupon')">{{
          L['我的优惠券']
        }}</a>

              </div>
            </div>
          </li>
          <li @click="handeOfficialCustomerService('/service', { vid: 0 })">
            <div class="li_item has_tit">{{ L['官方客服'] }}</div>
          </li>
          <li @click="goToByPush('/article')">
            <div class="li_item has_tit">{{ L['服务中心'] }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getCurrentInstance ,ref,computed,onMounted } from "vue";
import { ElMessage } from 'element-plus'
export default {
  name: "NavTopBar",
  setup () {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const L = proxy.$getCurLanguage();
    const memberInfo = store.state.memberInfo;
    const loginFlag = store.state.loginFlag;
    const router = useRouter();
    const configInfo = store.state.configInfo
    const curShowLang = ref(
      localStorage.getItem('curLang') == 'en' ? L['英文'] : 
      localStorage.getItem('curLang') == 'zh' ? L['中文'] :
      localStorage.getItem('curLang') == 'spa' ? L['西班牙'] :  
      L['葡萄牙']
    )
    const curLang = localStorage.getItem('curLang') ? localStorage.getItem('curLang') : 'pt'; //默认中文
    const lanList = ref([
        {
            name:L['中文'],
            type:'zh'
        },
        {
            name:L['葡萄牙'],
            type:'pt'
        },
        {
            name:L['英文'],
            type:'en'
        },
        {
            name:L['西班牙'],
            type:'spa'
        }
    ])
    const loginState = computed(() => store.getters.getLoginState);
    const changeLanguage = (lang) => {
      if(lang == 'zh' || lang == 'en'||lang == 'pt'||lang == 'spa'){
        localStorage.setItem('curLang',lang);
        window.location.reload();
      } else {
        curShowLang.value = lanList.value.find(item => item.type == lang).name;
      }
    }
    //去注册
    const goRegister = () => {
      router.push({
        path: `/register`,
        query: {
          redirect: encodeURIComponent(window.location.href)
        }
      });
    };

    //前往具体的页面，type为具体的页面地址，param为参数对象
    const goToByPush = (type, param = {}) => {
      console.error('--------路由地址', type);
      // 直接跳转到 /index 页面
      if (type === '/index') {
        router.push({ path: type, query: param });
        return;
      }
      // 处理未登录状态
      if (loginState.value === 0 && !loginFlag) {
        ElMessage({
          message: L['请登录'],
          type: 'warning',
        })
        // 【PC商城】点收藏，要提示请登录，并跳出登录弹窗
        store.state.loginState = 1;
        // 存储当前路由路径到会话存储
        sessionStorage.setItem('lastVisitedRoute', type);
        return;
      }
      // 执行正常路由跳转
      router.push({ path: type, query: param });
    };
    // 官方客服
    const handeOfficialCustomerService = (path,param = {}) => {
      if (!loginFlag) {
        ElMessage({
          message: L['请登录'],
          type: 'warning',
        })
        store.state.loginState = 1;
        return;
      }
      // 跳转到 /service 页面的处理
      if (path === '/service') {
        const chatInfo = {
          storeId: 0,
          vendorAvatar: configInfo.platform_customer_service_logo,
          storeName: configInfo.platform_customer_service_name,
          showData: {},
          source: 'pc商城'
        };
        store.commit('saveChatBaseInfo', chatInfo);
        const newWin = router.resolve({
          path: path,
          query: param
        });
        window.open(newWin.href, '_blank');
        return;
      }
    };
    //退出登录
    const loginOut = () => {
      proxy.$post('v3/channelLogin/oauth/logout', {
        refreshToken: store.getters.refreshToken
      }).then(res => {
        if (res.state == 200) {
          store.commit("clearAllData"); //清除数据
          store.commit('clearCartStorage')
          proxy.$socket.disconnect()
          // 判断当前地址栏是否是根路径
          if (window.location.pathname === '/') {
            // 如果是根路径，刷新页面
            window.location.reload();
          } else {
            // 否则跳转到 index 路由
            router.push({ path: '/index', query: {} });
          }
        }
      })
    };
    // 登录
    const handeLoginModel = () => {
      if(!loginFlag){
        store.state.loginState=1
      }
    };
    onMounted(() => {
      const currentLang = localStorage.getItem('curLang');
      // 判断是否存在语言设置，如果没有，则设置为默认语言 'pt'
      if (!currentLang) {
        localStorage.setItem('curLang', 'pt');
      }
    });
    return { L,
       goRegister, memberInfo, loginOut, loginFlag, 
       goToByPush,handeOfficialCustomerService, configInfo ,lanList,curLang,curShowLang,
       changeLanguage,handeLoginModel
    };
  }
};
</script>

<style lang="scss" scoped>
.header_wrap {
  width: 100%;
  height: 33px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;

  .header {
    width: 1210px;
    height: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header_left {
      height: 100%;
      font-size: 12px;
      color: #999;
      line-height: 36px;
      display: flex;

      .hello {
        color: #999;
        &.pt {
          margin-right: 4px;
          flex-shrink: 0;
        }
        &.two {
          margin-right: 0;
        }
      }

      .h1 {
        margin: 0 5px;
        cursor: pointer;

        &:hover {
          color: var(--color_main);
        }
      }
    }
    ul {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 10px;

        .personal_center {
          width: 121px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        li {
          float: left;
          text-align: center;
          border-right: 1px solid #ddd;
          padding: 0 10px;
          height: 12px;

          .lan_flag{
            width: 24px;
            height: 16px;
            margin-right: 6px;
            vertical-align: middle;
            position: relative;
            bottom: 2px;
          }

          .li_item {
            position: relative;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            color: #999;
            height: 33px;

            &:hover {
              color: $colorMain;

              &.has_more {
                &:before {
                  border-top-color: $colorMain;
                }
              }

              .li_item_more {
                display: block;
              }
            }

            &.has_more {
              padding-right: 12px;

              &:before,
              &:after {
                position: absolute;
                right: -2px;
                display: block;
                width: 0;
                height: 0;
                content: " ";
                border: 4px solid transparent;
                border-radius: 2px;
              }

              &:before {
                top: 3px;
                border-top: 5px solid #888;
              }

              &:after {
                top: 1px;
                border-top: 5px solid #f7f7f7;
              }
            }

            .li_item_more {
              position: absolute;
              width: 80px;
              padding: 5px 3px;
              left: 50%;
              transform: translateX(-50%);
              top: 21px;
              background: #fff;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
              z-index: 999;
              display: none;

              &:before,
              &:after {
                position: absolute;
                top: -11px;
                left: 50%;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
                display: block;
                content: " ";
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-bottom: 6px solid #dedede;
              }

              &:after {
                top: -10px;
                border-bottom: 6px solid #fff;
              }

              .li_item_more_item {
                display: block;
                text-align: center;
                color: #999;
                line-height: 12px;
                padding: 8px 0;

                &:hover {
                  color: $colorMain;
                }
              }
            }
          }

          &:last-child {
            border-right-width: 0;
            padding-right: 0;
          }
        }
      }
    .header_right {
      height: 100%;

      ul {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        .personal_center {
          width: 121px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        li {
          float: left;
          text-align: center;
          border-right: 1px solid #ddd;
          padding: 0 10px;
          height: 12px;

          .li_item {
            position: relative;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            color: #999;
            height: 33px;

            &:hover {
              color: var(--color_main);

              &.has_more {
                &:before {
                  border-top-color: var(--color_main);
                }
              }

              .li_item_more {
                display: block;
              }
            }

            &.has_more {
              padding-right: 12px;

              &:before,
              &:after {
                position: absolute;
                right: -2px;
                display: block;
                width: 0;
                height: 0;
                content: " ";
                border: 4px solid transparent;
                border-radius: 2px;
              }

              &:before {
                top: 3px;
                border-top: 5px solid #888;
              }

              &:after {
                top: 1px;
                border-top: 5px solid #f7f7f7;
              }
            }

            .li_item_more {
              position: absolute;
              width: 80px;
              padding: 5px 3px;
              left: 50%;
              transform: translateX(-50%);
              top: 21px;
              background: #fff;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
              z-index: 999;
              display: none;

              &:before,
              &:after {
                position: absolute;
                top: -11px;
                left: 50%;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
                display: block;
                content: " ";
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-bottom: 6px solid #dedede;
              }

              &:after {
                top: -10px;
                border-bottom: 6px solid #fff;
              }

              .li_item_more_item {
                display: block;
                text-align: center;
                color: #999;
                line-height: 12px;
                padding: 8px 0;

                &:hover {
                  color: var(--color_main);
                }
              }
            }
          }

          &:last-child {
            border-right-width: 0;
            padding-right: 0;
          }
        }
      }
    }
  }
}
.has_tit {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
}
</style>