<template>
  <div class="silde_outer">
    <div class="swiper-button-next" id="next" v-if="swiperList.length > 6">
      <img src="@/assets/next_zuo.png" alt="" style="cursor: pointer;">
    </div>
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
        <div :class="['swiper-slide']" v-for="(item, index) in swiperList" :key="index"
          @click="changeConsultTab(index)">
          <div class="floor_tab_li">
            <div class="floor_tab_li_title">
              <span class="floor_tab_li_title_text" :class="{ floor_tab_li_title_text_active: index == current_id }">{{
      item.title }}</span>
            </div>
            <div class="floor_tab_li_desc " :class="{ floor_tab_li_desc_active: index == current_id }">{{ item.subtitle }}
            </div>
            <div class="floor_tab_li_shu" v-if="index != swiper_list.length - 1"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-button-prev" id="prev" v-if="swiperList.length>6">
      <img src="@/assets/next_you.png" alt="" style="cursor: pointer;">
    </div>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import Swiper from "swiper";
export default {
  name: "MultipleTabs",
  props: {
    swiper_list: Object,//装修的数据
    source: String,//来源，home:平台首页  store:供应商装修
    currentId: String || Number,//index
  },
  setup (props, { emit }) {
    const slide = ref(0)
    onMounted(() => {
      setTimeout(() => {
        new Swiper(".mySwiper", {
          slidesPerView: 6,
          watchOverflow: true,
          // spaceBetween: 30,
          freeMode: true,
          navigation: {
            nextEl: ".swiper-button-prev",
            prevEl: ".swiper-button-next",
          },
          on: {
            slideChangeTransitionEnd: function () {
              if (document.getElementById('prev')) {
                // console.log(document.getElementById('prev').tabIndex)

              }
            }
          }
        });
      })

    })


    const swiperList = computed(() => {
      return props.swiper_list
    })
    const current_id = computed(() => {
      return props.currentId
    })

    const changeConsultTab = (index) => {
      emit('changeTab', index)
    }


    return { changeConsultTab, swiperList, current_id, slide };
  },
};
</script>
<style lang='scss' scoped>
.floor_tab_li {
  width: 192px;
  min-width: 192px;
  position: relative;
  height: 62px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    .floor_tab_li_title_text {
      color: var(--color_main);
    }

    .floor_tab_li_desc {
      color: var(--color_main);
    }
  }

  .floor_tab_li_title {
    color: #333;
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    height: 26px;

    .floor_tab_li_title_text {
      height: 26px;
      display: inline-block;
      border-radius: 50px;
      padding: 0 7px;
      min-width: 81px;
    }

    .floor_tab_li_title_text_active {
      background: var(--color_halo_bg);
      color: #fff;
    }
  }

  .floor_tab_li_desc {
    font-size: 14px;
    margin-top: 3px;
    color: #999;

  }

  .floor_tab_li_desc_active {
    color: var(--color_main);
  }

  .floor_tab_li_shu {
    position: absolute;
    right: 0;
    top: 0;
    height: 40px;
    margin: 10px 0;
    width: 1px;
    background: linear-gradient(180deg, white, #dfdfdf 51%, white);
  }
}

.silde_outer {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  position: relative;
  height: 100%;

  .swiper-button-next {
    right: 0;
    flex: 1;
    user-select: none;
    width: 23px;

    img {
      width: 23px;
      height: 30px;
    }
  }

  .swiper-button-prev {
    left: 0;
    flex: 1;
    width: 23px;
    user-select: none;
    text-align: right;

    img {
      width: 23px;
      height: 30px;
    }
  }

  .swiper-button-next:after {
    display: none;
  }

  .swiper-button-prev:after {
    display: none;
  }

  .swiper {
    width: 1150px;
    overflow: hidden;
    height: 100% !important;

    .swiper-wrapper {
      display: flex;
      align-items: center;

      .swiper-slide {
        text-align: center;
        font-size: 16px;
        height: 62px;
        width: 192px;
        min-width: 192px;
        /* Center slide text vertically */
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        border-radius: 5px;
        cursor: pointer;
        user-select: none;
        color: #333333;
      }
    }
  }
}
</style>