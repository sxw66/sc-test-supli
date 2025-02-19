<!--
 * @Author: your name
 * @Date: 2021-01-13 12:13:02
 * @LastEditTime: 2021-01-13 17:05:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/FooterService.vue
-->
<template>
  <div class="footer_service_wrap">
    <div class="footer_service" v-if="configInfo.supplier_pc_home_bottom_adv">
      <a>
        <img :src="configInfo.supplier_pc_home_bottom_adv" @error="defaultImg" alt />
      </a>
    </div>
    <div class="footer_service1" v-else>
      <div class="footer_wrap_box">
        <!-- <img :src="defaultImg"  alt /> -->
        <div class="footer_service_box">
          <dynaIcon src="footer/footer_warranty.png" width="57" height="57" :color="color" class="img_xuan">
          </dynaIcon>
          <p>{{ L['无忧质保'] }}</p>
        </div>
        <div class="footer_service_box">
          <dynaIcon src="footer/footer_goods_rejected.png" width="57" height="57" :color="color" class="img_xuan">
          </dynaIcon>
          <p>{{ L['七天无理由退货'] }}</p>
        </div>
        <div class="footer_service_box">
          <dynaIcon src="footer/footer_exchange_goods.png" width="57" height="57" :color="color" class="img_xuan">
          </dynaIcon>
          <p>{{ L['15天免费换货'] }}</p>
        </div>
        <div class="footer_service_box">
          <dynaIcon src="footer/footer_free _shipping.png" width="57" height="57" :color="color" class="img_xuan">
          </dynaIcon>
          <p>{{ L['满99包邮'] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, getCurrentInstance } from "vue";
export default {
  name: "FooterService",
  props: {
    color: {
      type: String,
      default: '--color_main'
    }
  },
  setup () {
    const store = useStore();
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage();
    const configInfo = ref(store.state.configInfo);
    return {
      configInfo,
      L
    };
  }
};
</script>

<style lang="scss" scoped>
.footer_service_wrap {
  width: 100%;
  height: 100%;
  margin-bottom: -2px;
  border-top: 1px solid #f2f2f2;
  text-align: center;

  .footer_service {
    width: 100%;
    height: 100px;
    overflow: hidden;

    a {
      display: inline-block;
      width: 100%;
      height: 100%;

      // overflow: hidden;
      img {
        width: 1920px;
        height: 100%;
        margin-left: -960px;
        left: 50%;
        position: relative;
        overflow: hidden;
        display: block;
      }
    }
  }

  .footer_service1 {
    width: 1175px;
    height: 95px;
    overflow: hidden;
    margin: auto;

    .footer_wrap_box {
      display: flex;
      width: 1175px;
      height: 100%;
      justify-content: space-between;
    }

    .footer_service_box {
      display: flex;
      align-items: center;
      height: 100%;
      .img_xuan {
        flex-shrink: 0;
      }
      p {
        font-size: 16px;
        margin-left: 5px;
        color: #333333;
      }
    }
  }
}
</style>