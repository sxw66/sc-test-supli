<template>
  <!-- 登录弹框 -->
  <loginWarp
    v-model:visible="loginVisible"
    @onLoginSuccessfully="handleLoginSuccessfully"
  />
  <!-- 注册弹框 -->
  <registerWarp v-model:visible="registerVisible" />
  <!-- 忘记密码弹框 -->
  <forgetPasswordWarp v-model:visible="passwordVisible" />
</template>
<script>
// 语法糖在生产环境不支持编译
import { ref, computed, watchEffect } from "vue";
import loginWarp from "./login-warp.vue";
import registerWarp from "./register-warp.vue";
import forgetPasswordWarp from "./forget-password-warp.vue";
import { useRoute,useRouter } from "vue-router";
import { useStore } from "vuex"; // 导入 useStore
export default {
  name: "LoginModel",
  components: {
    loginWarp,
    registerWarp,
    forgetPasswordWarp,
  },
  setup() {
    const route = useRoute(); // 获取当前路由信息
    const router = useRouter(); // 使用路由
    const store = useStore(); // 获取 Vuex store 实例
    const loginVisible = ref(false);
    const registerVisible = ref(false);
    const passwordVisible = ref(false);
    // 使用 computed 来访问 Vuex 中的 getter
    const loginState = computed(() => store.getters.getLoginState);
    const loginFlag = store.state.loginFlag;
    // 记录弹框状态当弹框发生变化时，检查并保存弹框的状态
    watchEffect(() => {
      // 当前是弹框状态，没有登录，没在隐私协议中
      if (loginState.value && !loginFlag && !route.path.includes('/agreement')) {
        // 映射不同的 loginState 值到弹框状态
        const stateToVisibility = {
          1: { loginVisible: true, registerVisible: false, passwordVisible: false },
          2: { loginVisible: false, registerVisible: true, passwordVisible: false },
          3: { loginVisible: false, registerVisible: false, passwordVisible: true },
        };
        // 根据 loginState 设置弹框的显示状态
        const visibility = stateToVisibility[loginState.value];
        loginVisible.value = visibility.loginVisible;
        registerVisible.value = visibility.registerVisible;
        passwordVisible.value = visibility.passwordVisible;
      }
    });
    // 登录成功
    const handleLoginSuccessfully = (loginFlag) => {
      if (loginFlag) {
        // 获取存储在 sessionStorage 中的上一个路由路径
        const lastVisitedRoute = sessionStorage.getItem("lastVisitedRoute");
        // 如果上一个路由路径存在，则跳转到该路径，否则跳转到默认路径
        if (lastVisitedRoute) {
          router.push({ path: lastVisitedRoute });
        } else {
          window.location.reload();
        }
      }
    };
    return {
      store,
      loginVisible,
      registerVisible,
      passwordVisible,
      loginState,
      handleLoginSuccessfully,
    };
  },
};
</script>

<style lang="scss" scoped></style>
