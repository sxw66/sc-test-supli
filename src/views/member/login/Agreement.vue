<template>
  <div class="sld_login">
    <div class="sld_login_header">
      <div class="content">
        <router-link class="l_logo" :to="`/index`">
          <img class="img" :src="configInfo.supplier_main_site_logo" alt />
        </router-link>
      </div>
    </div>
    <div class="agreement_container">
      <h2 class="agreement_title">{{ agreeContent.title }}</h2>
      <div class="last-updated">{{L['最近更新日期']}}：{{ agreeContent.updateTime }}</div>
      <pre class="agreement_content" v-html="agreeContent.content"></pre>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, getCurrentInstance, reactive, onMounted } from "vue";
import { ElMessage } from 'element-plus'
import { useStore } from "vuex";
export default {
  name: "Agreement",
  setup() {
    const store = useStore();
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const configInfo = ref(store.state.configInfo);
    const agreeContent = reactive({
      content: "",
      title: "",
      updateTime: "",
    });
    const getInitData = () => {
      try {
        const apiUrl =
          route.query.type == 1
            ? "/v3/system/channel/agreement/registerAgreement" // 用户协议接口
            : "/v3/system/channel/agreement/privacyPolicy"; // 隐私政策接口
        proxy
          .$get(apiUrl)
          .then((res) => {
            if (res.state == 200) {
              agreeContent.content = proxy.$quillEscapeToHtml(res.data?.content);
              agreeContent.title = res.data?.title;
              // 获取并格式化时间
              const updateTime = res.data?.updateTime;
              if (updateTime) {
                const [day, month, year] = updateTime.split(' ')[0].split('-');
                agreeContent.updateTime = `${year}${L['年']}【${parseInt(month)}】${L['月']}【${parseInt(day)}】${L['日']}`;
              }
            } else {
              ElMessage({
                message: res.msg,
                type: 'warning',
              })
            }
          })
          .catch((err) => {
            // 错误处理
            console.error("请求失败:", err);
          });
      } catch (error) {
        ElMessage({
          message: '请求失败',
          type: 'warning',
        })
      }
    };
    onMounted(() => {
      getInitData();
    });
    return { L, agreeContent, configInfo };
  },
};
</script>
<style lang="scss" scoped>
@import "../../../style/agreement.scss";
.agreement_container {
  width: 800px;
}
.last-updated {
  text-align: right;
  font-size: 16px;
}
.agreement_content {
  font-size: 15px;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
}
</style>
<style lang="scss">
.agreement_content {
  img {
    max-width: 100%;
  }

  a {
    display: inline-block;
    margin: 5px auto;
    color: #0000ff;
    text-decoration: underline;
  }

  table {
    border-collapse: collapse;
    padding: 0;
  }

  td,
  th {
    border: 1px solid #ddd;
    padding: 5px 10px;
  }

  ol,
  ul {
    padding-left: 10px;
  }

  ol li,
  ul li {
    list-style: unset;
  }
}
</style>
