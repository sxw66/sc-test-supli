<template>
  <!-- SpecValueItem 组件 -->
  <div v-if="isSpecValueItem" class="spec-value-item">
    <div
      :class="`${specValclass} cursor_pointer`"
      @mouseenter="handleMouseEnter"
    >
      <div
        v-if="image"
        class="specval_pre_image"
        :style="specValueImage"
        :title="specValue"
      ></div>
      <span v-else class="specval_pre_text" :title="specValue">{{ specValue }}</span>
    </div>
  </div>
  <!-- SpecCheckIcon 组件 -->
  <div v-else-if="isSpecCheckIcon" class="spec-check-icon">
    <i :class="`${className} check_icon`" :style="{ opacity: disabled ? '0.5' : '1' }"></i>
  </div>
  <!-- SpecItemEdit 组件 -->
  <div v-else class="spec-item-edit">
    <div className="quantity_inventory_multi">
      <div class="flex_column_start_center">
        <div class="quantity_edit flex_row_start_center">
          <span @click="editNumSpec('reduce')" :style="disReduceStyle">-</span>
          <input
            type="number"
            :value="currentSpecNum"
            @input="(e) => editNumSpec('edit', e)"
            @blur="editNumSpec('blur')"
          />
          <span @click="editNumSpec('add')" :style="disAddStyle">+</span>
          <div v-if="isDis" class="disable_mask"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { ElMessage } from 'element-plus';
import { getCurLanguage } from "@/utils/common";
import { useStore } from 'vuex';

export default {
  name: "SpecComponents",
  props: {
    // SpecValueItem 组件的 props
    specValue: {
      type: Object,
      default: () => ({})
    },
    // SpecCheckIcon 组件的 props
    checkState: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // SpecItemEdit 组件的 props
    minBuyNum: {
      type: Number,
      default: 1
    },
    editNum: {
      type: Number,
      default: 1
    },
    from: {
      type: String,
      default: ''
    },
    // 用于判断当前渲染哪个组件
    componentType: {
      type: String,
      default: 'SpecValueItem'
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const isSpecValueItem = props.componentType === 'SpecValueItem';
    const isSpecCheckIcon = props.componentType === 'SpecCheckIcon';

    // SpecValueItem 组件相关逻辑
    const { image = '', specValue = {} } = props.specValue;

    // checkState : 1-选中，2-可选，3-禁用
    const specValclass = computed(() => {
      let className = 'specval_pre';
      let checkStateClass = {
        1: 'specval_pre_active',
        3: 'specval_pre_disabled'
      };
      return `${className} ${checkStateClass[props.specValue.checkState] ?? ''}`;
    });

    const specValueImage = computed(() => ({
      backgroundImage: `url(${image})`
    }));

    // 监听鼠标进入事件
    const handleMouseEnter = (event) => {
      // 删除当前元素同级的所有 specval_pre_active 类
      const siblings = event.target.parentElement.children;
      for (let sibling of siblings) {
        sibling.classList.remove('specval_pre_active');
      }
      // 添加当前元素的 specval_pre_active 类
      event.target.classList.add('specval_pre_active');
      // 更新 store 中的图片
      store.commit('setMainImageUrl', image);
      // 存入时间戳让watchEffect触发
      store.commit('setTimestamp', Date.now());
    };

    // SpecCheckIcon 组件相关逻辑
    const className = computed(() => {
      let checkStateClass = {
        1: 'iconduihao1',
        2: 'iconyuanquan1',
        3: 'iconyuanquan1'
      };
      return `iconfont ${checkStateClass[props.checkState]}`;
    });

    // SpecItemEdit 组件相关逻辑
    const L = getCurLanguage();
    const currentSpecNum = ref(props.editNum);
    const isDis = computed(() => {
      let { checkState, productStock } = props.specValue;
      let extraBool = props.from === 'spec' ? checkState !== 1 : false;
      return extraBool || productStock === 0;
    });

    const disReduceStyle = computed(() => {
      let min = currentSpecNum.value <= props.minBuyNum;
      return {
        opacity: min ? '0.5' : '1'
      };
    });

    const disAddStyle = computed(() => {
      // eslint-disable-next-line
      let maxBuyNum = MAX_PRODUCT_STOCK;
      let max = currentSpecNum.value >= maxBuyNum;
      return {
        opacity: max ? '0.5' : '1'
      };
    });

    // 改变数量按钮样式（规格）
    const editNumSpec = (type, e) => {
      let { takeOffNum } = props.specValue;
      takeOffNum = takeOffNum ?? 1;
      // eslint-disable-next-line
      let maxBuyNum = MAX_PRODUCT_STOCK;
      let { minBuyNum } = props;
      switch (type) {
        case 'reduce': {
          if (currentSpecNum.value <= minBuyNum) {
            return;
          } else {
            currentSpecNum.value -= takeOffNum;
          }
          break;
        }
        case 'edit': {
          let { value } = e.target;
          if ((!/^[1-9]\d*$/.test(value) && value)) {
            currentSpecNum.value = minBuyNum;
          } else if (value > maxBuyNum) {
            currentSpecNum.value = maxBuyNum;
            ElMessage(L['超过购买限制']);
          } else {
            currentSpecNum.value = value;
          }
          break;
        }
        case 'add': {
          currentSpecNum.value += takeOffNum;
          if (currentSpecNum.value > maxBuyNum) {
            currentSpecNum.value = maxBuyNum;
            ElMessage(L['超过购买限制']);
          }
          break;
        }
        case 'blur': {
          if (currentSpecNum.value <= minBuyNum) {
            currentSpecNum.value = minBuyNum;
            return;
          }
          break;
        }
      }
      // 对已选清单的对应的规格进行数量同步
      emit('update:editNum', currentSpecNum.value);
    };

    return {
      isSpecValueItem,
      isSpecCheckIcon,
      image,
      specValue,
      specValclass,
      specValueImage,
      handleMouseEnter,
      className,
      L,
      currentSpecNum,
      isDis,
      disReduceStyle,
      disAddStyle,
      editNumSpec
    };
  }
};
</script>

<style scoped>

</style>