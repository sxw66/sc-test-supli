<template>
  <el-dialog
    v-if="computedLoginVisible"
    v-model="computedLoginVisible"
    :before-close="handleCancel"
    width="470"
    draggable
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header="{ close }">
      <div class="my-header">
        <el-icon size="28" @click="close"><CloseBold /></el-icon>
      </div>
    </template>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" size="large" @keyup.enter="handeSubmitLogin">
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        @tab-click="handleClick"
        type="border-card"
      >
        <el-tab-pane name="tb-Mobile">
          <template #label>
            <div class="tab-title">{{ L['手机登录'] }}</div>
          </template>
          <template v-if="activeName === 'tb-Mobile'">
            <el-form-item prop="phone">
              <el-input
                v-model="ruleForm.phone"
                :placeholder="L['请输入手机号']"
                maxlength="11"
                clearable
              >
                <template #prepend>
                  <el-select v-model="ruleForm.codeModel" style="width: 80px">
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
            <!-- prop="phonePassword" -->
            <el-form-item prop="phonePassword">
              <el-input
                v-model="ruleForm.phonePassword"
                type="password"
                show-password
                maxlength="20"
                clearable
                :placeholder="L['请输入密码']"
              >
                <template #prepend>
                  <span
                    style="color: #bbb; font-size: 18px;width: 39px;"
                    class="icon iconfont iconmima1"
                  ></span>
                </template>
                <template #append>
                  <el-link type="primary" @click="handeForgetPassword">{{ L['忘记密码'] }}?</el-link>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
        <el-tab-pane name="tb-Email">
          <template #label>
            <div class="tab-title">{{ L['邮箱登录'] }}</div>
          </template>
          <template v-if="activeName === 'tb-Email'">
            <el-form-item prop="email">
                <el-input v-model="ruleForm.email" :placeholder="L['请输入邮箱']" maxlength="30" clearable>
                <template #prepend
                  ><el-icon><Message /></el-icon
                ></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="emailPassword">
              <el-input
                v-model="ruleForm.emailPassword"
                type="password"
                show-password
                maxlength="20"
                clearable
                :placeholder="L['请输入密码']"
              >
                <template #prepend>
                  <span
                    style="color: #bbb; font-size: 18px"
                    class="icon iconfont iconmima1"
                  ></span>
                </template>
                <template #append>
                  <el-link type="primary" @click="handeForgetPassword">{{L['忘记密码']}}?</el-link>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
        <el-form-item prop="verifyCode">
          <div class="mg_code_custom">
            <el-input
              v-model.lazy.trim="ruleForm.verifyCode"
              :placeholder="L['请输入图形验证码']"
              maxlength="4"
              clearable
              show-word-limit
            >
              <template #append>
                <img :src="showCodeImg" class="img_code" @click="getImgCode" />
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            style="color: white;"
            class="footer-btn"
            :loading="loading"
            color="#ff7e28" 
            @click="handeSubmitLogin"
            >{{ L['登录'] }}</el-button
          >
        </el-form-item>
        <div class="form-item-box">
          <div>{{L['没有TFshop账户？']}}</div>
          <el-link type="primary" @click="handeNewUserRegistration">{{ L['新用户注册'] }}</el-link>
        </div>
      </el-tabs>
    </el-form>
  </el-dialog>
</template>
<!-- 登录弹框 -->
<script>
import { ref, reactive, computed, getCurrentInstance } from 'vue';
import { CloseBold } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { Message } from '@element-plus/icons-vue';
import { useImageCode } from '@/utils/hooks';
import { useStore } from 'vuex';

export default {
  name: 'LoginWarp',
  components: {
    CloseBold,
    Message
  },
  props: {
    visible: Boolean
  },
  emits: ['update:visible', 'onLoginSuccessfully'],
  setup(props, { emit }) {
    const store = useStore();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const { showCodeImg, imgCodeKey, getImgCode } = useImageCode();

    const activeName = ref('tb-Mobile');
    const loading = ref(false);
    const ruleFormRef = ref(null);
    const ruleForm = reactive({
      source: 1,
      codeModel: '+55',
      phone: '',
      email: '',
      username: '',
      password: '',
      phonePassword: '',
      emailPassword: '',
      loginType: '',
      verifyCode: '' // 图形验证码
    });
    const rules = reactive({
      phone: [
        { required: true, message: L['请输入手机号'], trigger: 'blur' }
      ],
      email: [
        { required: true, message: L['请输入邮箱'], trigger: 'blur' },
        {
          pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
          message: L['请输入正确的邮箱地址'],
          trigger: 'blur'
        }
      ],
      verifyCode: [
        { required: true, message: L['请输入图形验证码'], trigger: 'blur' },
        { min: 4, message: L['请输入4位的图形验证码'], trigger: 'blur' },
        {
          pattern: /^[A-Za-z0-9]{4,}$/,
          message: L['图形验证码格式错误'],
          trigger: 'blur'
        }
      ],
      phonePassword: [
        { required: true, message: L['请输入密码'], trigger: 'blur' },
        {
          pattern: /^(?=.*[A-Za-z\d~@#$%*_\-+=:,.?])[A-Za-z\d~@#$%*_\-+=:,.?]{8,20}$/,
          message: L['密码格式不正确'],
          trigger: 'blur'
        }
      ],
      emailPassword: [
        { required: true, message: L['请输入密码'], trigger: 'blur' }
      ]
    });
    const codelist = ref([
      {
        countryTelCode: '+55',
        codeText: '+55',
        countryLanguageTag: 'pt'
      }
    ]);

    const computedLoginVisible = computed({
      get: () => props.visible,
      set: (value) => {
        emit('update:visible', value);
      }
    });

    // 切换了 tab 重置表单
    const handleClick = () => {
      ruleFormRef.value?.resetFields();
    };

    // 新用户注册
    const handeNewUserRegistration = () => {
      store.state.loginState = 2;
    };

    // 忘记密码
    const handeForgetPassword = () => {
      store.state.loginState = 3;
      console.error('忘记密码', store.state.loginState);
    };

    // 获取用户信息，并同步信息到 vuex
    const fetchUserInfoAndRedirect = async () => {
      try {
        await proxy.$get('v3/supplier/channel/user/getInfo').then((res) => {
          if (res.state === 200) {
            store.commit('updateMemberInfo', res.data);
            ElMessage.success({
              message: L['登录成功']
            });
            ruleFormRef.value?.resetFields();
            store.state.loginState = 1;
            computedLoginVisible.value = false;
            loading.value = false;
            emit('onLoginSuccessfully', true);
          }
        });
      } catch (error) {
        console.error('error', error);
      }
    };

    // 关闭 - 取消
    const handleCancel = () => {
      ruleFormRef.value?.resetFields();
      computedLoginVisible.value = false;
      store.state.loginState = 0;
      emit('onLoginSuccessfully', false);
    };

    // 登录
    const handeSubmitLogin = async () => {
      try {
        const valid = await ruleFormRef.value?.validate();
        if (!valid) {
          return;
        }
        const formValue = ruleForm;
        // 手机号登录
        if (activeName.value === 'tb-Mobile') {
          formValue.loginType = 2;
          formValue.username = `${formValue.codeModel}${formValue.phone}`;
        }
        if (activeName.value === 'tb-Email') {
          formValue.loginType = 3;
          formValue.username = `${formValue.email}`;
        }
        formValue.password = proxy.$base64Encrypt(
          formValue.loginType === 2 ? formValue.phonePassword : formValue.emailPassword
        );
        formValue.verifyKey = imgCodeKey.value;
        console.log('提交校验通过', formValue);
        loading.value = true;
        // 使用 async/await 来简化异步操作
        const res = await proxy.$post('v3/channelLogin/oauth/token', formValue, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.state === 200) {
          // 将用户信息存缓存，并跳转到首页
          store.commit('loginUpdate', {
            access_token: res.data.access_token,
            refresh_token: res.data.refresh_token
          });
          await fetchUserInfoAndRedirect();
        } else {
          getImgCode();
          loading.value = false;
          ElMessage.error(res.msg);
        }
        console.error('res', res);
      } catch (error) {
        console.log('error submit!');
      }
    };

    return {
      L,
      activeName,
      loading,
      ruleFormRef,
      ruleForm,
      rules,
      codelist,
      computedLoginVisible,
      handleClick,
      handeNewUserRegistration,
      handeForgetPassword,
      handleCancel,
      handeSubmitLogin,
      showCodeImg,
      imgCodeKey,
      getImgCode
    };
  }
};
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  justify-content: flex-end;
}
.el-tabs {
  :deep(.el-tabs__nav) {
    width:100%;
    .el-tabs__item {
      // width: 50%;
      min-width: 219.5px;
      max-width: 220px;
    }
  }
  :deep(.is-active) {
    .tab-title {
      color: #333333;
      font-weight: 700;
    }
  }
}
.tab-title {
  color: #999999;
  font-size: 18px;
}
.form-item-box {
  width: 100%;
  display: flex;
  justify-content: center;
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
</style>
