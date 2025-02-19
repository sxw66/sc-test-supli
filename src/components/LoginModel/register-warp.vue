<template>
  <!-- 注册-创建账号 -->
  <el-dialog
    v-if="computedLoginVisible"
    v-model="computedLoginVisible"
    :before-close="handleCancel"
    width="500"
    draggable
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="my-header">
        <el-icon size="28" @click="close"><CloseBold /></el-icon>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      size="large"
      @keyup.enter="handeSubmitRegister"
    >
      <div class="tab-title">{{ L["创建账号"] }}</div>
      <!-- 称呼 -->
      <el-form-item prop="memberNickName">
        <el-input
          v-model="ruleForm.memberNickName"
          :placeholder="L['请输入您的称呼（最多可输入60位）']"
          maxlength="60"
          show-word-limit
          clearable
        >
          <template #prepend>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item prop="phone">
        <el-input
          v-model.lazy.trim="ruleForm.phone"
          :placeholder="L['请输入手机号']"
          clearable
          maxlength="11"
        >
          <template #prepend>
            <el-select v-model="ruleForm.preCode" style="width: 80px">
              <el-option
                v-for="(item, index) in codelist"
                :key="index"
                :value="item.countryTelCode"
                >{{ item.codeText }}</el-option
              >
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <!-- 手机验证码 -->
      <el-form-item prop="phoneCode">
        <el-input
          v-model.number="ruleForm.phoneCode"
          :placeholder="L['请输入手机验证码']"
          maxlength="6"
          clearable
        >
          <template #prepend>
            <span
              style="color: #bbb; font-size: 14px"
              class="icon iconfont iconyanzhengma2"
            ></span>
          </template>
          <template #append>
            <el-button
              :disabled="isButtonDisabled.phone || !isPhoneValid"
              @click="handeSendGetCode(1)"
              :class="getButtonClass"
              >{{ buttonText.phone }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item prop="email">
        <el-input
          v-model="ruleForm.email"
          :placeholder="L['请输入邮箱']"
          maxlength="30"
          clearable
        >
          <template #prepend>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <!-- 邮箱验证码 -->
      <el-form-item prop="emailCode">
        <el-input
          v-model="ruleForm.emailCode"
          :placeholder="L['请输入邮箱验证码']"
          maxlength="6"
          clearable
        >
          <template #prepend>
            <span
              style="color: #bbb; font-size: 14px"
              class="icon iconfont iconyanzhengma2"
            ></span>
          </template>
          <template #append>
            <el-button
              :disabled="isButtonDisabled.email || !isEmailValid"
              @click="handeSendGetCode(2)"
              :class="getButtonClass"
              >{{ buttonText.email }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          show-password
          :placeholder="L['请输入密码']"
          maxlength="20"
          clearable
        >
          <template #prepend>
            <el-icon><Unlock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-alert
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 17px;"
      >
        {{
          L[
            "8至20位字符，可包括数字、大小写字母和特殊字符四种组合，特殊字符需在”~ @#$%*_-+=：,.?“范围内选择。"
          ]
        }}
      </el-alert>
      <!-- 再次输入密码 -->
      <el-form-item prop="confirmPassword">
        <el-input
          v-model="ruleForm.confirmPassword"
          type="password"
          show-password
          :placeholder="L['请再次输入密码']"
          maxlength="20"
          clearable
        >
          <template #prepend>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="verifyCode">
        <div class="mg_code_custom">
          <el-input
            v-model.lazy.trim="ruleForm.verifyCode"
            :placeholder="L['请输入图形验证码']"
            clearable
            show-word-limit
          >
            <template #append>
              <img :src="showCodeImg" class="img_code" @click="getImgCode" />
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="agreementPrivacyPolicy">
        <el-checkbox v-model="ruleForm.agreementPrivacyPolicy" size="large">
          <span>{{ L["我已阅读并同意"] }}</span>
          <el-link type="primary" @click="handeToPrivacyPolicy(1)">{{
            L["《用户协议》"]
          }}</el-link>
          <span>{{ L["和"] }}</span>
          <el-link type="primary" @click="handeToPrivacyPolicy(2)">{{
            L["《隐私政策》"]
          }}</el-link>
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button
          style="color: white;"
          class="footer-btn"
          :loading="loading"
          @click="handeSubmitRegister"
          color="#ff7e28"
          >{{ L["立即注册"] }}</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer-btn">
        <el-link type="primary" @click="handleBackClick">{{
          L["已有账号，请登录"]
        }}</el-link>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import {
  User,
  Message,
  CloseBold,
  Lock,
  Unlock,
} from "@element-plus/icons-vue";
import { useImageCode } from "@/utils/hooks";
import { useStore } from "vuex";

export default {
  name: "RegisterWarp",
  components: {
    User,
    Message,
    CloseBold,
    Lock,
    Unlock,
  },
  props: {
    visible: Boolean,
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const { showCodeImg, imgCodeKey, getImgCode } = useImageCode();

    // 记录当前弹框状态
    const computedLoginVisible = computed({
      get: () => {
        return props.visible;
      },
      set: (value) => {
        emit("update:visible", value);
      },
    });

    const loading = ref(false);
    const countdownPhone = ref(60); // 手机号验证码倒计时初始为60秒
    const countdownEmail = ref(60); // 邮箱验证码倒计时初始为60秒
    let timerPhone = null; // 手机号定时器
    let timerEmail = null; // 邮箱定时器
    const isButtonDisabled = ref({
      phone: false, // 手机号验证码按钮的禁用状态
      email: false, // 邮箱验证码按钮的禁用状态
    });
    const buttonText = ref({
      phone: L["获取验证码"], // 手机号按钮文本
      email: L["获取验证码"], // 邮箱按钮文本
    });
    const ruleFormRef = ref(null);
    const ruleForm = reactive({
      source: 1,
      preCode: "+55", // 区号
      memberNickName: "", // 称呼
      phone: "",
      phoneCode: "",
      email: "",
      emailCode: "",
      password: "",
      confirmPassword: "",
      loginType: 2,
      verifyCode: "",
      agreementPrivacyPolicy: [],
    });
    const rules = reactive({
      preCode: [{ required: true, message: L["请选择区号"], trigger: "blur" }],
      phone: [{ required: true, message: L["请输入手机号"], trigger: "blur" }],
      email: [
        { required: true, message: L["请输入邮箱"], trigger: "blur" },
        {
          pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
          message: L["请输入正确的邮箱地址"],
          trigger: "blur",
        },
      ],
      phoneCode: [
        { required: true, message: L["请输入手机验证码"], trigger: "blur" },
      ],
      emailCode: [
        { required: true, message: L["请输入邮箱验证码"], trigger: "blur" },
      ],
      memberNickName: [
        { required: true, message: L["请输入称呼"], trigger: "blur" },
      ],
      verifyCode: [
        {
          required: true,
          message: L["请输入图形验证码"],
          trigger: "blur",
        },
        {
          min: 4,
          message: L["请输入4位的图形验证码"],
          trigger: "blur",
        },
        {
          pattern: /^[A-Za-z0-9]{4,}$/,
          message: L["图形验证码格式错误"],
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: L["请输入密码"],
          trigger: "blur",
        },
        {
          pattern: /^(?=.*[A-Za-z\d~@#$%*_\-+=:,.?])[A-Za-z\d~@#$%*_\-+=:,.?]{8,20}$/,
          message: L["密码格式不正确"],
          trigger: "blur",
        },
      ],
      confirmPassword: [
        { required: true, message: L["请输入确认密码"], trigger: "blur" },
        {
          validator: (rule, value, callback) => {
            if (value !== ruleForm.password) {
              callback(new Error(L["两次输入的密码不一致"]));
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
      agreementPrivacyPolicy: [
        {
          type: "array",
          required: true,
          message: L["请勾选同意用户协议和隐私政策"],
          trigger: "change",
        },
      ],
    });
    const codelist = ref([
      {
        countryTelCode: "+55",
        codeText: "+55",
        countryLanguageTag: "pt",
      },
    ]);
    // 计算邮箱格式是否有效
    const isEmailValid = computed(() => {
      const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      return emailPattern.test(ruleForm.email);
    });
    // 计算手机号码格式是否有效
    const isPhoneValid = computed(() => {
      const phonePattern = /^[0-9]{11}$/; // 正则表达式，检查是否为11位数字
      return phonePattern.test(ruleForm.phone);
    });
    // 动态处理按钮文本（根据 curLang 判断是否是葡萄牙语）
    const getButtonClass = computed(() => {
      // 获取当前语言
      const currentLang = localStorage.getItem("curLang");
      // 如果语言是葡萄牙语，则返回 'btn-code' 类，否则返回空字符串
      return currentLang === "pt" || currentLang === "spa" ? "btn-code" : "";
    });

    // 已有账号，请登录
    const handleBackClick = () => {
      ruleFormRef.value.resetFields();
      store.state.loginState = 1;
    };
    // 关闭-取消
    const handleCancel = () => {
      ruleFormRef.value.resetFields();
      computedLoginVisible.value = false;
      store.state.loginState = 0;
    };
    // 启动倒计时
    const startCountdown = (state) => {
      // 设置倒计时初始值
      if (state === 1 && !timerPhone) {
        // 手机号倒计时
        isButtonDisabled.value.phone = true; // 禁用手机号验证码按钮
        buttonText.value.phone = `${countdownPhone.value}${L["秒后重试"]}`; // 更新按钮文本
        // 创建定时器，独立处理手机号倒计时
        timerPhone = setInterval(() => {
          countdownPhone.value -= 1; // 每秒倒计时减少
          buttonText.value.phone = `${countdownPhone.value}${L["秒后重试"]}`; // 更新手机号按钮文本
          if (countdownPhone.value <= 0) {
            clearInterval(timerPhone); // 停止手机号定时器
            buttonText.value.phone = L["获取验证码"]; // 恢复手机号按钮文本
            isButtonDisabled.value.phone = false; // 启用手机号验证码按钮
            countdownPhone.value = 60; // 重置手机号倒计时
            timerPhone = null; // 清除定时器
          }
        }, 1000);
      } else if (state === 2 && !timerEmail) {
        // 邮箱倒计时
        isButtonDisabled.value.email = true; // 禁用邮箱验证码按钮
        buttonText.value.email = `${countdownEmail.value}${L["秒后重试"]}`; // 更新按钮文本
        // 创建定时器，独立处理邮箱倒计时
        timerEmail = setInterval(() => {
          countdownEmail.value -= 1; // 每秒倒计时减少
          buttonText.value.email = `${countdownEmail.value}${L["秒后重试"]}`; // 更新邮箱按钮文本
          if (countdownEmail.value <= 0) {
            clearInterval(timerEmail); // 停止邮箱定时器
            buttonText.value.email = L["获取验证码"]; // 恢复邮箱按钮文本
            isButtonDisabled.value.email = false; // 启用邮箱验证码按钮
            countdownEmail.value = 60; // 重置邮箱倒计时
            timerEmail = null; // 清除定时器
          }
        }, 1000);
      }
    };
    // 获取短信验证码
    const handeSendGetCode = async (state) => {
      try {
        // 校验手机号或邮箱
        if (!isValidInput(state)) return;
        const formValue = ruleForm;
        const isPhone = state === 1;
        const mobileOrEmail = isPhone ? formValue.phone : formValue.email;
        // 构建请求参数
        const params = isPhone
          ? {
              mobile: mobileOrEmail,
              preCode: formValue.preCode,
              verifyCodeType: "register",
            }
          : {
              email: mobileOrEmail,
              verifyKey: imgCodeKey.value,
              verifyCodeType: "register",
            };
        // 发送请求的URL
        const url = isPhone
          ? "v3/supplier/channel/commons/getCaptcha"
          : "/v3/supplier/channel/commons/getEmailCaptcha";
        // 发送请求
        const res = await proxy.$get(url, params);
        // 处理响应
        if (res.state === 200) {
          startCountdown(state); // 启动倒计时
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      } catch (error) {
        // 统一的错误处理
        console.error("获取验证码失败", error);
        ElMessage.error(L["请求失败，请稍后再试"]);
      }
    };

    // 用户协议和隐私政策
    const handeToPrivacyPolicy = (type) => {
      // 阻止 checkbox 的选中状态改变
      event.preventDefault();
      const url = `/agreement?type=${type}`;
      window.open(url, "_blank"); // 打开新页面或标签页
    };

    // 校验手机号或邮箱
    const isValidInput = (state) => {
      if (state === 1 && !ruleForm.phone) {
        ElMessage({
          message: L["请输入手机号"],
          type: "warning",
        });
        return false;
      }
      if (state === 2 && !ruleForm.email) {
        ElMessage({
          message: L["请输入邮箱"],
          type: "warning",
        });
        return false;
      }
      return true;
    };

    // 注册
    const handeSubmitRegister = async () => {
      try {
        const valid = await ruleFormRef.value?.validate();
        if (!valid) {
          return;
        }
        const formValue = ruleForm;
        // formValue.phone = `${formValue.preCode}${formValue.phone}`;
        formValue.loginPwd = proxy.$base64Encrypt(formValue.password);
        formValue.verifyKey = imgCodeKey.value;
        let params = {
          ...formValue,
          phone: `${formValue.preCode}${formValue.phone}`,
        };
        console.log("提交校验通过", formValue);
        loading.value = true;
        // 使用 async/await 来简化异步操作
        const res = await proxy.$post(
          "v3/channelLogin/oauth/register",
          params,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.state == 200) {
          //将用户信息存缓存，并跳转到首页
          store.commit("loginUpdate", {
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token,
          });
          await fetchUserInfoAndRedirect();
        } else {
          getImgCode();
          loading.value = false;
          ElMessage.error(res.msg);
        }
        console.error("res注册成功", res);
      } catch (error) {
        console.log("error submit!");
      }
    };
    // 获取用户信息，并同步信息到vuex
    const fetchUserInfoAndRedirect = async () => {
      try {
        await proxy.$get("v3/supplier/channel/user/getInfo").then((res) => {
          if (res.state == 200) {
            store.commit("updateMemberInfo", res.data);
            ElMessage.success({
              message: L["注册成功，系统已为您自动登录"],
            });
            ruleFormRef.value.resetFields();
            store.state.loginState = 0;
            computedLoginVisible.value = false;
            loading.value = false;
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        });
      } catch (error) {
        console.error("error", error);
      }
    };

    return {
      L,
      showCodeImg,
      imgCodeKey,
      getImgCode,
      computedLoginVisible,
      loading,
      countdownPhone,
      countdownEmail,
      isButtonDisabled,
      buttonText,
      ruleFormRef,
      ruleForm,
      rules,
      codelist,
      isEmailValid,
      isPhoneValid,
      getButtonClass,
      handleBackClick,
      handleCancel,
      startCountdown,
      handeSendGetCode,
      handeToPrivacyPolicy,
      handeSubmitRegister,
    };
  },
};
</script>
<style lang="scss" scoped>
.my-header {
  display: flex;
  justify-content: flex-end;
}
.el-tabs {
  :deep(.el-tabs__nav-scroll) {
    display: flex;
    justify-content: center;
  }
}
.tab-title {
  color: #333333;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  padding-bottom: 10px;
}
.mg_code_custom {
  width: 100%;
  cursor: pointer;
  :deep(.el-input-group__append) {
    padding: 0;
  }
}
.footer-btn {
  width: 100%;
  color: white;
  font-size: 18px;
}
.dialog-footer-btn {
  margin-top: -16px;
}
.btn-code {
  max-width: 150px;          /* 最大宽度 155px */
  width: 100%;               /* 使按钮占满其父容器宽度 */
  white-space: normal;       /* 允许换行 */
  word-wrap: break-word;     /* 超出时自动换行 */
  text-align: center;        /* 确保文本居中 */
  display: inline-block;     /* 使按钮表现为内联块元素 */
  word-break: break-all;     /* 单词内换行，防止长单词溢出 */
  padding: 0;
}
</style>
