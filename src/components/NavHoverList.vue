<template>
  <div class="header-nav-box" @mouseleave="handleOneListMouseLeave">
    <div class="goods-title" @mouseenter="handleGoodsTitleMouseEnter">
      <img src="@/assets/header/sort.png" alt class="header-icon" />
      <div>{{ L["全部商品分类"] }}</div>
    </div>
    <!-- 一级菜单 -->
    <div
      v-if="isHoverVisible"
      class="one-list"
      v-show="showOneList"
      @mouseenter="handleOneListMouseEnter"
      @mouseleave="handleOneListMouseLeave"
    >
      <div class="category-box">
        <div
          class="list-item"
          v-for="(item, index) in oneMenuList"
          :key="index"
          :class="{ active: activeOneItem === index }"
          @mouseenter="handleOneItemMouseEnter(index, item)"
          @click="handleOneListClick(item)"
        >
          {{ item.categoryName }}
        </div>
      </div>
      <!-- 二级菜单 -->
      <div class="content-box">
        <div class="item-box">
          <div
            class="two-item"
            v-for="(item, index) in twoMenuList"
            :key="index"
            :class="{ active: activeTowItem === index }"
            @mouseenter="handleTowItemMouseEnter(index,item)"
            @click="handleOneListClick(item)"
          >
            {{ item.categoryName }}
          </div>
        </div>
        <!-- 三级菜单 -->
        <div class="item-box">
          <div class="three-item"  
            v-for="(item, index) in threeMenuList" 
            :class="{ active: activeThreeItem === index }"
            @mouseenter="handleThreeItemMouseEnter(index,item)"
            @click="handleOneListClick(item)" :key="index">{{ item.categoryName }}
          </div>
        </div>
        <!-- 四级菜单 -->
        <div class="item-box">
          <div class="four-item"  
            v-for="(last, index) in fourMenuList" 
            @click="handleOneListClick(last)" 
            :key="index">{{ last.categoryName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router"; //引入路由
import { getCurrentInstance, onMounted, ref } from "vue";
export default {
  name: "NavHoverList",
  props: {
    isHoverVisible: { type: Boolean, default: true }, //是否支持鼠标移入
  },
  setup() {
    const router = useRouter(); //使用路由
    const route = useRoute();
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    // 状态变量
    const showOneList = ref(false);
    // 高亮索引
    const activeOneItem = ref(null);
    const activeTowItem = ref(null);
    const activeThreeItem = ref(null);
    // 列表数据
    const oneMenuList = ref([]);
    const twoMenuList = ref([]);
    const threeMenuList = ref([]);
    const fourMenuList = ref([]);

    // 【全部分类】鼠标移入事件
    const handleGoodsTitleMouseEnter = () => {
      showOneList.value = true;
      activeOneItem.value = 0;
      activeTowItem.value = 0;
      activeThreeItem.value = 0;
      // 给二级菜单装数据
      twoMenuList.value = oneMenuList.value[0]?.children || [];
      // 给三级菜单装数据
      threeMenuList.value = twoMenuList.value[0]?.children || [];
      // 给四级菜单装数据
      fourMenuList.value = threeMenuList.value[0]?.children || [];
    };
    //  【一级菜单】一级鼠标移入
    const handleOneItemMouseEnter = (index, item) => {
      // console.log('一级鼠标移入-',item);
      // 清空三级四级数据
      twoMenuList.value = [];
      threeMenuList.value = [];
      fourMenuList.value = [];
      // 设置当前项的活动状态
      activeOneItem.value = index;
      activeTowItem.value = 0;
      activeThreeItem.value = 0;
      // 过滤二级类目
      twoMenuList.value = item.children;
      // 给三级菜单装数据
      threeMenuList.value = twoMenuList.value[0]?.children || []
      // 给四级菜单装数据
      fourMenuList.value = threeMenuList.value[0]?.children || []
    };
    // 【一级菜单】鼠标移入事件
    const handleOneListMouseEnter = () => {
      showOneList.value = true;
    };
    // 【一级菜单】鼠标移出事件
    const handleOneListMouseLeave = () => {
      showOneList.value = false;
    };
    // 【二级菜单】二级鼠标移入
    const handleTowItemMouseEnter = async (index, item) => {
      // console.log('itemitemitem',item);
      // 清空三级四级数据
      threeMenuList.value = [];
      fourMenuList.value = [];
      // 重置状态
      activeTowItem.value = index;
      // 给三级菜单装数据
      threeMenuList.value = item?.children || [];
      // 给四级菜单装数据
      fourMenuList.value = threeMenuList.value[0]?.children || [];
    };
    // 【三级菜单】三级鼠标移入
    const handleThreeItemMouseEnter = async (index, item) => {
      console.log("【三级菜单】三级鼠标移入", item.children);
      activeThreeItem.value = index; // 重置状态
      fourMenuList.value = item.children || [];
    };
    // 【菜单点击】点击类目
    const handleOneListClick = (item) => {
      console.log("点击类目", item);
      let newWin = router.resolve({
        path: "/goods/list",
        query: {
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          g: item.grade,
          pid: item.pid,
        },
      });
      window.open(newWin.href, "_blank");
    };
    // 获取全部类目
    const getInitData = () => {
      try {
        // 清空之前的数据，防止重复添加
        oneMenuList.value = [];
        proxy
          .$get("v3/supplier/channel/goods/category/bottomCategory", {
            categoryId1: 0,
          })
          .then((res) => {
            if (res.state == 200) {
              oneMenuList.value = res.data;
              console.log("----初始化类目数据", oneMenuList.value);
            }
          });
      } catch (error) {
        console.error("-出错了", error);
      }
    };

    onMounted(() => {
      getInitData();
    });
    return {
      L,
      showOneList,
      activeOneItem,
      activeTowItem,
      activeThreeItem,
      oneMenuList,
      twoMenuList,
      threeMenuList,
      fourMenuList,
      handleGoodsTitleMouseEnter,
      handleOneItemMouseEnter,
      handleOneListMouseEnter,
      handleOneListMouseLeave,
      handleTowItemMouseEnter,
      handleThreeItemMouseEnter,
      handleOneListClick,
    };
  },
};
</script>
<style lang="scss" scoped>
/* 滚动条轨道与滑块的圆角 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
.header-nav-box {
  position: relative;
  box-sizing: border-box;
  z-index: 99;
  .goods-title {
    width: 200px;
    padding: 0 8px;
    max-width: 200px;
    height: 44px;
    background: var(--color_main_bg);
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 3px 3px 0px 0px;
    .header-icon {
      width: 12px;
      height: 12px;
      margin-right: 10px;
    }
  }
  .one-list {
    position: relative;
    box-sizing: border-box;
    background: #f7f8fc;
    font-family: PingFang SC;
    font-size: 14px;
    color: #1a1a1a;
    display: flex;
    .category-box {
      width: 200px;
      height: 600px;
      overflow: auto;
      .list-item {
        min-height: 38px;
        line-height: 38px;
        font-size: 14px;
        font-family: "Microsoft Yahei";
        padding: 0 10px 0 15px;
        position: relative;
        cursor: pointer;
        border-left: 3px solid transparent;
        /* 添加限制最大行数为2并处理溢出 */
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          border-left-color: #f69913;
          color: var(--color_main);
        }
        &.active {
          border-left-color: #f69913;
          color: var(--color_main);
        }
      }
    }
  }
  .content-box {
    width: 1000px;
    height: 600px;
    border: 1px solid #ff7e28;
    border-radius: 8px;
    overflow: auto;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .item-box {
      min-width: 325px;
      max-width: 325px;
    }
    .two-item {
      min-width: 160px;
      min-height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
      margin: 5px;
      /* 添加限制最大行数为2并处理溢出 */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        color: var(--color_main);
      }
      &.active {
        color: var(--color_main);
      }
    }
    .three-item {
      min-width: 160px;
      min-height: 30px;
      line-height: 30px;
      font-size: 14px;
      margin: 5px;
      /* 添加限制最大行数为2并处理溢出 */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        color: var(--color_main);
      }
      &.active {
        color: var(--color_main);
      }
    }
    .four-item {
      min-width: 160px;
      min-height: 30px;
      line-height: 30px;
      margin: 5px;
      font-size: 13px;
      font-weight: 400;
      color: #636363;
      /* 添加限制最大行数为2并处理溢出 */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        color: var(--color_main);
      }
    }
  }
}
</style>
