<!--
 * @Author: your name
 * @Date: 2021-01-09 20:19:11
 * @LastEditTime: 2021-01-13 17:21:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/FooterBottom.vue
-->
<template>
  <div class="footer_bottom">
    <ul class="footer_list">
      <li v-for="({ linkName, linkUrl }, index) in navlist.data" :key="index">
        <a :href="linkUrl" target="_blank">
          {{ linkName }}
        </a>
      </li>
    </ul>
    <p class="copy_right">{{ configInfo.basic_site_copyright }} {{ L['版权所有'] }} <a style="color:#999"
        href="https://beian.miit.gov.cn/" target="_blank">{{ configInfo.basic_site_icp }}</a></p>
    <p class="author">{{ configInfo.basic_site_technical_support }} {{ L['提供技术支持'] }}</p>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref, watch } from 'vue'
import { useStore } from 'vuex';
export default {
  name: "FooterBottom",
  setup () {
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const navlist = reactive({ data: [] });
    const store = useStore();
    const configInfo = ref(store.state.configInfo)

    watch(() => store.state.configInfo, () => {
      if ((!configInfo.value.basic_site_copyright && store.state.configInfo.basic_site_copyright) ||
        (!configInfo.value.basic_site_icp && store.state.configInfo.basic_site_icp) ||
        (!configInfo.value.basic_site_technical_support && store.state.configInfo.basic_site_technical_support)) {
        configInfo.value = store.state.configInfo;
      }
    })

    const getInitData = () => {
      const { proxy } = getCurrentInstance();
      proxy.$get('v3/supplier/channel/friendLink/list').then(res => {
        if (res.state == 200) {
          navlist.data = res.data;
        }
      })
    }
    getInitData();
    return { navlist, configInfo, L };
  },
};
</script>

<style lang="scss" scoped>
.footer_bottom {
  background-color: #333333;
  position: absolute;
  width: 1900px;
  overflow: hidden;
  bottom: 0;
  left: 50%;
  margin-left: -952px;
  color: #999;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 12px;
  padding-top: 12px;

  .footer_list {
    width: 1200px;
    margin: 15px auto;
    display: flex;
    margin-bottom: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      box-sizing: border-box;
      padding: 0 7px;
      border-right: 1px solid rgba(255, 255, 255, 0.4);
      color: #fff;
      line-height: 19px;
      cursor: pointer;

      a {
        color: #fff;
      }
    }
  }

  li:last-child {
    border-right: none;
  }

  .copy_right {
    letter-spacing: 1px;
    margin-bottom: 10px;
  }
}
</style>
