<!--
 * @Author: your name
 * @Date: 2020-12-29 16:05:36
 * @LastEditTime: 2021-01-11 10:47:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/NavCatHeader.vue
-->
<template>
  <div class="nav_cat">
    <div class="header">
      <NavHoverList :isHoverVisible="cate_sort_visible"/>
      <nav>
        <li v-if="showIndex"><a href="/">{{ L['首页'] }}</a></li>
        <li v-for="(item, index) in navList.data" :key="index">
          <a href="javascript:void(0)" @click="navClick(item)">{{ item.navName }}</a>
        </li>
      </nav>
    </div>

  </div>
</template>

<script>
import { useRouter, useRoute } from "vue-router"; //引入路由
import { reactive, getCurrentInstance, onMounted, ref } from "vue";
// import CategorySort from './CategorySort'
import NavHoverList from './NavHoverList'
export default {
  name: "NavCatHeader",
  components: {
    // CategorySort,
    NavHoverList
  },
  setup () {
    const router = useRouter(); //使用路由
    const route = useRoute()
    const showIndex = ref(true)
    const navList = reactive({ data: [] });
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const cate_sort_visible = ref(false)
    const toGoodsList = () => {
      router.push("/goods/Category"); //push商品分类路由
    };
    const getNavData = () => {
      proxy.$get("v3/supplier/channel/navigation/list").then(res => {
        if (res.state == 200) {
          navList.data = res.data;
        }
      });
    };
    const navClick = val => {
      proxy.$diyNavTo(JSON.parse(val.data.replace(/&quot;/g, "\"")));
    };
    onMounted(() => {
      let path = route.path;
      if (path == '/') {
        // cate_sort_visible.value = false
        cate_sort_visible.value = true
        showIndex.value = false
      } else if (path == '/goods/Category') {
        cate_sort_visible.value = false
      } else {
        cate_sort_visible.value = true
      }
      getNavData();
    })

    return { navList, toGoodsList, navClick, showIndex, L, cate_sort_visible };
  }
};
</script>

<style lang="scss" scoped>
.header {
  width: 1210px;
  height: 45px;
  margin: 0 auto;
  display: flex;
  overflow: visible;

  .product_sort {
    position: relative;
    overflow: visible;
    width: 200px;
    height: 100%;
    background: var(--color_main_bg);
    color: #fff;
    font-size: 16px;
    letter-spacing: 1px;
    line-height: 30px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    cursor: pointer;
    box-sizing: border-box;
    border-radius: 3px 3px 0px 0px;

    &.show_category {
      &:hover {
        #category_sort {
          display: block;
        }
      }
    }



    img {
      width: 12px;
      height: 12px;
      margin-right: 18px;
      margin-top: 2px;
    }
  }

  nav {
    width: 1000px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    line-height: 30px;
    overflow: hidden;
    flex-wrap: wrap;

    a {
      height: 45px;
      display: inline-block;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #333333;
      font-size: 15px;
      margin: 0 0 0 20px;
      line-height: 45px;
      padding: 0 7px;
      width: max-content;
      font-weight: bold;

    }

    a:hover {
      color: var(--color_main);
    }
  }
}
</style>
