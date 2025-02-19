<template>
  <el-dialog
    v-if="computedPasswordVisible"
    v-model="computedPasswordVisible"
    :before-close="handleCancel"
    width="500"
    draggable
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="my-header-top">
        <div class="form-title">{{ L["重置密码"] }}</div>
        <el-icon size="28" @click="close"><CloseBold /></el-icon>
      </div>
      <div class="my-header-right" @click="handleEmailRetrieval">
        <template v-if="isStateType === 1">
          <el-icon color="var(--color_main)" size="20"><Message /></el-icon>
          <span class="dialog-title">{{ L["通过邮箱找回"] }}</span>
        </template>
        <template v-else>
          <el-icon color="var(--color_main)" size="20"><Message /></el-icon>
          <span class="dialog-title">{{ L["通过手机找回"] }}</span>
        </template>
      </div>
    </template>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      size="large"
      @keyup.enter="handeSubmitForget"
    >
      <template v-if="isStateType === 1">
        <el-form-item prop="phone" :label="L['手机号码']" label-position="top">
          <el-input
            v-model="ruleForm.phone"
            :placeholder="L['请输入手机号']"
            maxlength="11"
            clearable
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
        <el-form-item prop="phoneCode" label="验证码" label-position="top">
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
                :disabled="isButtonDisabled.phone"
                @click="handeSendCodePassword(1)"
                :class="getButtonClass"
                >{{ buttonText.phone }}</el-button
              >
            </template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <!-- 邮箱 -->
        <el-form-item prop="email" :label="L['电子邮箱']" label-position="top">
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
        <el-form-item
          prop="emailCode"
          :label="L['邮箱验证码']"
          label-position="top"
        >
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
                :disabled="isButtonDisabled.email"
                @click="handeSendCodePassword(2)"
                :class="getButtonClass"
                >{{ buttonText.email }}</el-button
              >
            </template>
          </el-input>
        </el-form-item>
      </template>
      <el-form-item prop="password" :label="L['新密码']" label-position="top">
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
      <el-form-item
        prop="confirmPassword"
        :label="L['确认密码']"
        label-position="top"
      >
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
      <div class="btn-box">
        <el-button
          @click="handeSubmitForget"
          color="#ff7e28"
          :loading="loading"
          >{{ L["提交"] }}</el-button
        >
      </div>
    </el-form>
  </el-dialog>
</template>
<!-- 忘记密码弹框 -->
<script>
import { ref, reactive, computed, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { CloseBold, Lock, Unlock, Message } from "@element-plus/icons-vue";
import { useImageCode } from "@/utils/hooks";
import { useStore } from "vuex";

export default {
  name: "ForgetPasswordWarp",
  components: {
    CloseBold,
    Lock,
    Unlock,
    Message,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const { imgCodeKey } = useImageCode();

    // 记录当前弹框状态
    const computedPasswordVisible = computed({
      get: () => {
        return props.visible;
      },
      set: (value) => {
        emit("update:visible", value);
      },
    });

    const isStateType = ref(1); // 手机号1 邮箱2
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
    const loading = ref(false);
    const ruleFormRef = ref(null);
    const codelist = ref([
      {
        countryTelCode: "+55",
        codeText: "+55",
        countryLanguageTag: "pt",
      },
    ]);
    const ruleForm = reactive({
      preCode: "+55", // 区号
      phone: "",
      phoneCode: "",
      email: "",
      emailCode: "",
      password: "",
      confirmPassword: "",
    });
    const rules = reactive({
      phone: [
        {
          required: true,
          message: L["请输入手机号"],
          trigger: "blur",
        },
        {
          pattern: /^[1-9]{2}\d{9}$/, // 校验巴西手机号：11 位数字且前两位为 1-9 之间的数字
          message: L["请输入有效的手机号"],
          trigger: "blur",
        },
      ],
      phoneCode: [
        { required: true, message: L["请输入手机验证码"], trigger: "blur" },
      ],
      email: [
        { required: true, message: L["请输入邮箱"], trigger: "blur" },
        {
          pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
          message: L["请输入正确的邮箱地址"],
          trigger: "blur",
        },
      ],
      emailCode: [
        { required: true, message: L["请输入邮箱验证码"], trigger: "blur" },
      ],
      password: [
        {
          required: true,
          message: L["请输入密码"],
          trigger: "blur",
        },
        {
          pattern:
            /^(?=.*[A-Za-z\d~@#$%*_\-+=:,.?])[A-Za-z\d~@#$%*_\-+=:,.?]{8,20}$/,
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
    });
    // 动态处理按钮文本（根据 curLang 判断是否是葡萄牙语）
    const getButtonClass = computed(() => {
      // 获取当前语言
      const currentLang = localStorage.getItem("curLang");
      // 如果语言是葡萄牙语，则返回 'btn-code' 类，否则返回空字符串
      return currentLang === "pt" || currentLang === "spa" ? "btn-code" : "";
    });
    // 切换邮箱找回密码
    const handleEmailRetrieval = () => {
      // 切换 isStateType 值（1 或 2）
      isStateType.value = isStateType.value === 1 ? 2 : 1;
      // 清空已有定时器
      // if (timerPhone) {
      //   clearInterval(timerPhone); // 清除手机验证码的定时器
      //   timerPhone = null;
      //   buttonText.value.phone = L["获取验证码"]; // 恢复按钮文本
      //   isButtonDisabled.value.phone = false; // 启用手机验证码按钮
      //   countdownPhone.value = 60; // 重置手机号倒计时
      // }
      // 重置表单字段
      // ruleFormRef.value.resetFields();
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
    const handeSendCodePassword = async (state) => {
      try {
        const formValue = ruleForm;
        const isPhone = state === 1;
        if (formValue.phone || formValue.email) {
          const mobileOrEmail = isPhone ? formValue.phone : formValue.email;
          // 构建请求参数
          const params = isPhone
            ? {
                mobile: mobileOrEmail,
                preCode: formValue.preCode,
                verifyCodeType: "forgot_password",
              }
            : {
                email: mobileOrEmail,
                verifyKey: imgCodeKey.value,
                verifyCodeType: "forgot_password",
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
        }
      } catch (error) {
        // 统一的错误处理
        console.error("获取验证码失败", error);
        ElMessage.error(L["请求失败，请稍后再试"]);
      }
    };

    // 关闭-取消
    const handleCancel = () => {
      ruleFormRef.value.resetFields();
      computedPasswordVisible.value = false;
      store.state.loginState = 0;
    };

    // 提交
    const handeSubmitForget = async () => {
      try {
        const valid = await ruleFormRef.value?.validate();
        if (!valid) {
          return;
        }
        loading.value = true;
        const formValue = ruleForm;
        let parms = {
          preCode: isStateType.value === 1 ? formValue.preCode : "",
          phoneOrEmail:
            isStateType.value === 1 ? formValue.phone : formValue.email,
          verifyCode:
            isStateType.value === 1 ? formValue.phoneCode : formValue.emailCode,
          loginPwd: proxy.$base64Encrypt(formValue.password),
        };
        // 使用 async/await 来简化异步操作
        const res = await proxy.$post(
          "/v3/supplier/channel/userPassword/resetLoginPwd",
          parms,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.state == 200) {
          ruleFormRef.value.resetFields();
          ElMessage.success({
            message: L["密码重置成功"],
          });
          store.state.loginState = 1;
        } else {
          ElMessage.error(res.msg);
        }
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("error submit!");
      }
    };
    return {
      L,
      computedPasswordVisible,
      isStateType,
      countdownPhone,
      countdownEmail,
      isButtonDisabled,
      buttonText,
      loading,
      ruleFormRef,
      codelist,
      ruleForm,
      rules,
      getButtonClass,
      handleEmailRetrieval,
      startCountdown,
      handeSendCodePassword,
      handleCancel,
      handeSubmitForget,
    };
  },
};
</script>
<style lang="scss" scoped>
.my-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .form-title {
    color: #333333;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
}
.my-header-right {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .dialog-title {
    color: var(--color_main);
    font-size: 16px;
  }
}
.btn-box {
  width: 100%;
  :deep(.el-button) {
    width: 100%;
    color: white;
  }
}
.btn-code {
  max-width: 150px; /* 最大宽度 155px */
  width: 100%; /* 使按钮占满其父容器宽度 */
  white-space: normal; /* 允许换行 */
  word-wrap: break-word; /* 超出时自动换行 */
  text-align: center; /* 确保文本居中 */
  display: inline-block; /* 使按钮表现为内联块元素 */
  word-break: break-all; /* 单词内换行，防止长单词溢出 */
  padding: 0;
}
</style>