<template>
  <div class="hot_are_wrap mt-5 h-full">
    <div class="relative h-full">
      <div class="img_placeholder flex_row_center_center" :style="dynaStyle('outer')">
        <div :style="dynaStyle('inner')" class="relative overflow-hidden">
          <img :src="img_info.imgUrl" class="display_img" v-show="img_info.imgUrl" :style="getImgStyle.domStyle" />
          <div class="area_item" v-for="(item, index) in area_list" :key="index" :style="getAreaStyle(item)"
            @click="$diyNavTo(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRef, unref } from 'vue';
export default {
  props: {
    tpl_info: Object
  },
  setup(props) {

    const img_info = toRef(props.tpl_info, 'img_info');
    const area_list = toRef(props.tpl_info, 'area_list');
    const style = toRef(props.tpl_info, 'style');


    const getImgStyle = computed(() => {
      let { width, height } = unref(img_info);
      let { padding } = unref(style);

      let calcWidth = (width > 1210 ? 1210 : width) - (padding.left + padding.right);
      let calcHeight = calcWidth * (height / width);

      let domStyle = { width: calcWidth + 'px', height: calcHeight + 'px' };

      return {
        domStyle,
        calcWidth,
        calcHeight,
      };
    });


    const getAreaStyle = (item) => {
      let { areaWidth_ratio, areaHeight_ratio, startX_ratio, startY_ratio } = item;
      let { calcWidth, calcHeight } = unref(getImgStyle);

      let width = calcWidth * areaWidth_ratio + 'px';
      let height = calcHeight * areaHeight_ratio + 'px';
      let left = calcWidth * startX_ratio + 'px';
      let top = calcHeight * startY_ratio + 'px';

      return {
        width,
        height,
        top,
        left,
      };
    };



    const dynaStyle = (pos) => {
      switch (pos) {
        case 'outer': {
          let { padding, bgColor } = unref(style);
          return {
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            backgroundColor: bgColor,
          };
        }
        case 'inner': {
          let { borderRadius } = unref(style);
          return {
            borderRadius: `${borderRadius.top}px ${borderRadius.top}px ${borderRadius.bottom}px  ${borderRadius.bottom}px`,
          };
        }
      }
    };

    return {
      area_list,
      img_info,
      getImgStyle,
      getAreaStyle,
      dynaStyle
    }
  }
}


</script>

<style lang="scss" scoped>
.hot_are_wrap {
  width: 1210px;
  margin: auto;
}

.img_placeholder {
  width: 100%;
}

.area_item {
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.edit_tag_diy {
  position: absolute;
  top: 10px;
  left: 10px;
}

.relative {
  position: relative;
}
</style>
