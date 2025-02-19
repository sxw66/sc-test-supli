<template>
  <div class="index">
    <template v-if="firstLoading">
      <div class="skeleton_banner"></div>
      <div class="w_sld_react_1210 adv_04_wrap skeleton">
        <div class="floor_title">
          <h2>
            <!-- <font>&nbsp;</font> -->
            <p style="font-family: Arial;">&nbsp;</p>
            <span></span>
            <p style="font-family: Arial; font-size: 16px;">&nbsp;</p>
          </h2>
        </div>
        <div class="floor_goods">
          <div class="item" v-for="(item_main, index_main) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" v-bind:key="index_main">
            <div class="wrap">
              <a href="javascript:void(0)" class="example_text"> </a>
              <p class="title">
                <a href="javascript:void(0)">{{ item_main }}</a>
              </p>
              <p class="price"><span></span></p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <SldDiy v-if="decorateData.data.length" :decorateData="decorateData" @adv19="handleAdv19" />
    <!-- 空页面 start-->
    <SldCommonEmpty v-if="!firstLoading && !decorateData.data.length" totalHeight="900" paddingTop="250"
      :tip="L['我们正在努力装修中，敬请期待～']" />
    <!-- 空页面 end-->
  </div>
</template>
<script>
import { reactive, getCurrentInstance, ref } from 'vue'
import SldDiy from '../../components/SldDiy'
import { useRoute } from 'vue-router'
import SldCommonEmpty from '../../components/SldCommonEmpty'

export default {
  name: 'Topic',
  components: {
    SldDiy,
    SldCommonEmpty
  },
  setup () {
    const route = useRoute()
    const decorateData = reactive({ data: [] }) //装修数据
    const firstLoading = ref(true) //是否第一次加载
    const { proxy } = getCurrentInstance()

    const L = proxy.$getCurLanguage()

    const getInitData = () => {
      let params = {}
      params.decoType = 'topic'
      params.decoId = route.query.topicId
      proxy.$get('v3/supplier/channel/pcDeco/index', params).then(res => {
        firstLoading.value = false
        if (res.state == 200) {
          decorateData.data = JSON.parse(res.data.data.replace(/&quot;/g, '"'))
          decorateData.data.map(item => {
            item.json_data = item.json
            if (item.json_data.type == 'adv_19') {
              item.json_data.data.map(child => {
                child.cur_tab = 0
              })
            }
            if (item.json_data && item.json_data.type == 'main_banner') {
              item.json_data.data = item.json_data.data.filter(i => i.imgUrl)
            }
          })
        }
      })
    }
    getInitData()
    return {
      decorateData,
      firstLoading,
      L
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/decorate.scss';

.index {
  background: #f8f8f8;
  padding-bottom: 10px;
}

.skeleton_banner {
  width: 100%;
  height: 470px;
  background: $colorSkeleton;
  margin-bottom: 10px;
}

.skeleton {
  &.adv_04_wrap .floor_title h2 span {
    background: $colorSkeleton;
    display: inline-block;
    width: 200px;
  }

  &.adv_04_wrap .floor_goods .item .wrap .title {
    background: $colorSkeleton;
    width: 100%;

    a {
      color: transparent;
    }
  }

  &.adv_04_wrap .floor_goods .item .wrap .price {
    width: 100%;
    height: 25px;
  }

  &.adv_04_wrap .floor_goods .item .wrap .price span {
    display: inline-block;
    width: 70px;
    height: 100%;
    background: $colorSkeleton;
  }
}
</style>
