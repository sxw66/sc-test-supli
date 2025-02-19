<template>
  <div class="floor_nav" ref="containerRef" :class="{ fixedTop: isTop }">
    <template v-if="json_data && json_data.show">
      <div class="adv_image flex_row_center_center" @click="$diyNavTo(json_data.adv_img)">
        <img :src="json_data.adv_img.imgUrl" alt="" v-if="json_data.adv_img.imgUrl" />
      </div>
      <div class="nav_area">
        <div class="nav_item" v-for="(item, index) in json_data.nav_data" :key="index" v-show="item.imgUrl || item.text"
          @click="scrollIntoView(item.id)">
          <div class="nav_item_wrap flex_column_center_center ">
            <img :src="item.imgUrl" class="nav_item_img" :class="{ width_text: item.text }" v-if="item.imgUrl" />
            <div class="space" v-show="item.text && item.imgUrl"></div>
            <span class="nav_item_text" :class="{ single_text: !item.imgUrl }">{{ item.text }}</span>
          </div>
        </div>
        <div class="nav_area">
          <div class="nav_item" @click="toService">
            <div class="nav_item_wrap flex_column_center_center ">
              <img :src="nav_service" class="nav_item_img" />
              <div class="space"></div>
              <span class="nav_item_text">{{ L['平台客服'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>


    <div class="back_top flex_column_center_center" @click="backTop" v-show="isTop">
      <span class="el-icon-arrow-up up_icon"></span>

      <span class="mt-[8px] back_top_text">{{ L['顶部'] }}</span>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, getCurrentInstance } from 'vue';
import nav_service from '@/assets/nav_service.png'
import { useRouter } from 'vue-router';
export default {
  props: {
    nav_info: {
      type: Object,
      default: () => { }
    }
  },
  setup (props) {
    const isTop = ref(false);
    const containerRef = ref();
    const router = useRouter()
    const { proxy } = getCurrentInstance()

    const L = proxy.$getCurLanguage()

    window.addEventListener('scroll', () => {
      let pc_main_diy = document.querySelector('.pc_main_diy');
      let top = pc_main_diy?.getBoundingClientRect()?.top;
      if (top <= 68) {
        isTop.value = true;
      } else {
        isTop.value = false;
      }
    });

    const { json_data } = toRefs(props.nav_info)

    const backTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    const scrollIntoView = (id) => {
      let scrollTop =
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let target = document.getElementById(id)
      let rect = target.getBoundingClientRect()

      window.scrollTo({
        top: rect.top + scrollTop - 85,
        behavior: 'smooth'
      })
    };

    const toService = () => {
      let newWin = router.resolve({
        path: '/service',
        query: {
          vid: 0
        }
      })
      window.open(newWin.href)
    }

    return {
      L,
      scrollIntoView,
      backTop,
      containerRef,
      isTop,
      json_data,
      nav_service,
      toService
    }
  }
}





</script>

<style lang="scss" scoped>
@keyframes scroll_show {
  0% {
    top: 0;
  }

  100% {
    top: 50%;
    transform: translateY(-50%);
  }
}


.floor_nav {
  position: absolute;
  z-index: 990;
  top: 0;
  right: 10px;
  width: 64px;

  &.fixedTop {
    position: fixed;

    animation: scroll_show .5s ease both;

  }

  .adv_image {
    cursor: pointer;

    img {
      width: 64px;
    }

    .place_holder_image {
      color: #999;
      font-size: 12px;
      min-height: 150px;
      background: #eee;
    }
  }

  .nav_area {
    margin-top: 4px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 6px 0 rgb(86 86 86 / 10%);
    overflow: hidden;

    .nav_item {
      height: 60px;
      cursor: pointer;
      position: relative;

      .nav_item_wrap {
        height: 100%;
        transition: all 0.2s;
        z-index: 3;
        position: relative;

        &:hover {

          .nav_item_text {
            color: var(--color_main);
          }

          .nav_item_img {
            transform: scale(1.15);
          }

        }
      }

      &::after {
        position: absolute;
        display: inline-block;
        width: 54px;
        height: 1px;
        left: 50%;
        bottom: 0;
        margin-left: -27px;
        background: linear-gradient(270deg, white, #eeeeee, #eeeeee, white);
        z-index: 1;
        content: "";
      }







      .nav_item_img {
        width: 28px;
        height: 28px;
        transition: all .2s;

        &.width_text {
          width: 24px;
          height: 24px;
        }
      }

      .space {
        height: 7px;
      }

      .nav_item_text {
        color: #333;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        font-weight: 400;
        transition: all 0.2s;

        &.single_text {
          width: 25px;
          word-break: break-all;
          line-height: 18px;
        }
      }
    }
  }

  .back_top {
    height: 68px;
    margin-top: 8px;
    border-radius: 4px;
    background: #fff;
    background-color: #fff;
    box-shadow: 0 0 6px 0 rgb(86 86 86 / 10%);
    cursor: pointer;

    .up_icon {
      font-size: 20px;
      color: #333;
    }

    &:hover {

      .back_top_text {
        color: var(--color_main);
      }

      .up_icon {
        color: var(--color_main) !important;
      }
    }

    .back_top_text {
      color: #333;
      font-size: 13px;
      font-weight: 400;
      margin-top: 5px;
    }
  }
}
</style>
