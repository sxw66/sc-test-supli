<template>
  <div class="hover_category" :class="{ hover_visible: visible }" :style="{ left: left + 'px' }" @mouseleave="onLeave"
    @mouseover="onOver">
    <div class="children" @click.stop="void (0)">
      <!-- 二级分类 start-->
      <div v-if="cateDataFirst.data.length > 0">
        <dl class="fore_dl" v-for="(item2, index) in cateDataFirst.data" v-bind:key="index">
          <dt>
            <a class="second" @click.stop="toGoodsList(item2)">
              {{ item2.categoryName }}
            </a>
            <i class="iconfont iconziyuan11"></i>
          </dt>
          <dd>
            <!-- 三级分类 start-->
            <a class="third" @click.stop="toGoodsList(item3)" v-for="(item3, thirdIndex) in item2.children"
              :key="thirdIndex">{{
    item3.categoryName }}</a>
          </dd>
        </dl>
      </div>
      <SldCommonEmpty v-else totalWidth="900" totalHeight="300" style="color:#666" />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import SldCommonEmpty from './SldCommonEmpty'
export default {
  components: {
    SldCommonEmpty
  },
  props: {
    visible: Boolean,
    categoryId: Number,
    left: {
      type: Number,
      default: 207
    }
  },
  setup (props, { emit }) {


    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const cateDataFirst = reactive({ data: [] })
    const cateCache = reactive({ data: [] })


    const toGoodsList = (item) => {
      let newWin = router.resolve({
        path: '/goods/list',
        query: {
          categoryId: item.categoryId,
          g: item.grade,
          pid: item.pid
        }
      })
      window.open(newWin.href, '_blank');
    }

    const getSortChild = (params) => {
      proxy.$get('v3/supplier/channel/goods/category/bottomCategory', params).then(res => {
        if (res.state == 200) {
          cateDataFirst.data = res.data
          cateCache.data.push({ categoryId: params.categoryId1, list: res.data })
        }
      })
    }

    const selectTab = (categoryId) => {
      cateDataFirst.data = []
      let params = {
        categoryId1: categoryId
      }
      let index1 = cateCache.data.findIndex(item => item.categoryId == categoryId)
      if (index1 > -1) {
        cateDataFirst.data = cateCache.data[index1].list
      } else {
        getSortChild(params)
      }
    }

    watch(() => props.categoryId, () => {
      console.log('change', props.categoryId)
      if (!props.categoryId) return
      selectTab(props.categoryId)
    })

    const onLeave = () => {
      emit('update:visible', false)
      emit('update:categoryId', 0)
    }

    const onOver = () => {

    }

    return {
      toGoodsList,
      onLeave,
      onOver,
      cateDataFirst,
    }
  }
}
</script>

<style lang="scss" scoped>
.hover_category {
  display: none;
  width: 995px;
  height: 458px;
  background-color: #fff;
  box-shadow: 0px 5px 10px 0px rgba(153, 153, 153, 0.15);
  position: absolute;
  top: 0;
  left: 207px;
  padding: 15px 0;
  overflow: hidden;
  z-index: 11;

  &.hover_visible {
    display: block;
    animation: showMore .2s ease-in-out;

    @-webkit-keyframes showMore {
      0% {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes showMore {
      0% {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  }
}


.children {

  .fore_dl {
    width: 100%;
    clear: both;
    overflow: hidden;
    margin-bottom: 10px;
  }

  dt {
    position: relative;
    float: left;
    width: 84px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 38px;
    padding-top: 7px;

    i {
      position: absolute;
      top: 8px;
      right: 0px;
      width: 14px;
      height: 14px;
      font: 400 9px/14px consolas;
      color: #333;
    }

    .second {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
      overflow: hidden;
      display: inline-block;
      text-align: right;
      width: 64px;
      text-overflow: ellipsis;
      letter-spacing: normal;
      cursor: pointer;

      &:hover {
        color: var(--color_main);
      }
    }
  }

  dd {
    border-top: none;
    width: 790px;
    padding: 4px 0;
    float: left;
    line-height: 16px;
    margin-left: 15px;
    min-height: 32px;
  }

  .third {
    float: left;
    padding: 0 12px;
    margin: 3px 0;
    line-height: 16px;
    white-space: nowrap;
    letter-spacing: normal;
    cursor: pointer;
    font-size: 13px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #636363;

    &:hover {
      color: var(--color_main);
    }


  }


}
</style>