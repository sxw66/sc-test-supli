<template>
  <div class="banner_container">
    <div class="main_banner_3" @mouseleave="side_leave">
      <div class="side_wrapper left_side" :style="computedStyle">
        <div class="category_unit flex_row_start_start" :class="{ hover_selected: hover_index == leftIdx }"
          v-for="(leftItem, leftIdx) in left_side" :key="leftIdx" @mouseover="handle_category_children(true, leftIdx)">
          <div class="unit_image">
            <img :src="leftItem.img.imgUrl" alt="" v-show="leftItem.img.imgUrl" />
          </div>
          <div class="unit_text">
            <p @click="toGoodsList(leftItem.main_category.link_value)">{{ leftItem.main_category.title }}</p>
            <div class="truncate" v-if="leftItem.sub_category.length">
              <span v-for="(sub, subIdx) in leftItem.sub_category" :key="subIdx" class="sub_category">
                <a :class="{ text_active: sub.title }" @click="$diyNavTo(sub)">{{ sub.title }}</a>
                <span class=" text_seperator">/</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel_area" :style="computedStyle">
        <el-carousel height="457px" arrow="always">
          <el-carousel-item v-for="(citem, cindex) in center_banner" :key="cindex">
            <div class=" main_banner_item_wrap" @click="$diyNavTo(citem)">
              <div class="banner_img_show" :style="{ backgroundImage: `url('${citem.imgUrl}')` }"></div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="img_area">
        <div class="flex_column_between_center img_adv_wrapper">
          <div v-for="(critem, crIdx) in center_right" :key="crIdx" class="img_adv_com" @click="$diyNavTo(critem)"
            :style="computedStyle">
            <div class="img_adv_item" :style="{ backgroundImage: `url('${critem.imgUrl}')` }"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="side_wrapper" :style="computedStyle">
          <div class="login_area flex_column_center_center">
            <div class="avatar" :style="{ backgroundImage: `url(${avatarValue})` }"></div>
            <div class="welcome_intro">
              <span>Hi~</span>
              <span v-if="loginFlag">
                {{ memberInfo.userName }}，
              </span>
              <span>欢迎来到{{ configInfo.basic_site_name }}！</span>
            </div>
            <div class="login_wrap" v-if="!loginFlag">
              <div class="btn_lgn but" @click="goOnline('login')">登录</div>

            </div>
            <div class="login_wrap" v-else>
              <div class="btn_lgnout but" @click="goOnline('out')">退出</div>
            </div>
          </div>
          <div class="line"></div>
          <div class=" link_article">
            <div class="flex_row_between_center">
              <p class="title">资讯快报</p>
              <div class="more" @click="goArticle('more')">
                <span>更多</span>
                <span>></span>
              </div>
            </div>
            <div style="margin-top: 15px;height: 88px;overflow-y: hidden;">
              <vueSeamlessScroll :data="article_list" :class-option="seamlessOption">
                <p v-for="(art, artIdx) in article_list" class="article_item" :key="artIdx"
                  @click="goArticle('item', art.articleId)" :title="art.title">
                  <span class="hot_tag">Hot</span>
                  <span class="article_title">{{ art.title }}</span>
                </p>
                <div></div>
              </vueSeamlessScroll>
            </div>
          </div>
          <div class="line"></div>
          <div style="margin-top: 15px;">
            <div class="info_wrap" :class="{ two_width: right_side.length == 2 }">
              <div v-for="(item, index) in right_side" class="link_item flex_column_center_center" :key="index"
                @click="$diyNavTo(item)">
                <div class="info_image">
                  <img :src="item.imgUrl" alt="" v-show="item.imgUrl" />
                </div>
                <p :class="{ small: item.main_title.length > 4 }">{{ item.main_title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HoverdCategory v-model:visible="hover_visible" v-model:categoryId="hover_categoryId" :left="203">
      </HoverdCategory>

    </div>
  </div>
</template>

<script>
import { unref, ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import defaultAvatar from '@/assets/avatar.png'
import { useRoute, useRouter } from 'vue-router'
import HoverdCategory from './HoveredCategory.vue'
import vueSeamlessScroll from "vue-seamless-scroll/src";

export default {
  components: {
    HoverdCategory,
    vueSeamlessScroll
  },
  props: {
    tpl_info: {
      type: Object,
      default: () => { }
    }
  },
  setup (props) {
    const router = useRouter()
    const route = useRoute()
    const left_side = ref([])
    const center_banner = ref([])
    const right_side = ref([])
    const article_list = ref([])
    const center_right = ref(props.tpl_info.center_right)
    const hover_visible = ref(false)
    const hover_categoryId = ref(0)
    const hover_index = ref(-1)
    const store = useStore()
    const configInfo = store.state.configInfo
    const loginFlag = ref(store.state.loginFlag)
    const memberInfo = store.state.memberInfo
    const { proxy } = getCurrentInstance()
    const avatarValue = computed(() => {
      return loginFlag.value ? memberInfo.userAvatar : defaultAvatar
    })


    const seamlessOption = {
      step: 0.15, // 数值越大速度滚动越快
      limitMoveNum: 4, // 开始无缝滚动的数据量 this.dataList.length
      hoverStop: true, // 是否开启鼠标悬停stop
      direction: 1, // 0向下 1向上 2向左 3向右
      openWatch: true, // 开启数据实时监控刷新dom
      singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
      singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
      waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
    }


    for (let item of props.tpl_info.left) {
      if (item.main_category.title) {
        let sub_category = item.sub_category.filter(i => i.title !== '')
        left_side.value.push({
          ...item,
          sub_category
        })
      }
    }

    for (let item of props.tpl_info.center.data) {
      if (item.imgUrl) {
        center_banner.value.push(item)
      }
    }

    for (let item of props.tpl_info.right) {
      if (item.main_title) {
        right_side.value.push(item)
      }
    }

    const computedStyle = computed(() => {
      let style_s = {};
      let { style } = props.tpl_info
      Object.keys(style).forEach((key) => {
        style_s[key] = style[key] + 'px';
      });
      return style_s;
    });

    //获取文章列表
    const getList = () => {
      const params = {}
      params.size = 10
      proxy.$get('v3/supplier/channel/article/articleList', params).then(res => {
        if (res.state == 200) {
          article_list.value = res.data
        }
      })
    }

    const goOnline = (type) => {
      if (type == 'out') {
        proxy.$post('v3/channelLogin/oauth/logout', {
          refreshToken: store.getters.refreshToken
        }).then(res => {
          if (res.state == 200) {
            store.commit("clearAllData"); //清除数据
            proxy.$socket.disconnect()
            router.push("/login");
          }
        })
      } else {
        router.push(`/${type}`)
      }
    }

    const goArticle = (type, articleId) => {
      let query = {}
      if (articleId) {
        query.articleId = articleId
      }
      router.push({
        path: '/article',
        query
      })
    }

    const hideCategorySort = () => {
      let path = route.path;
      let dom = document.getElementById('category_sort')
      if (path == '/') {
        dom.style.display = 'none'
      }
    }


    const handle_category_children = (bool, index) => {
      if (index != undefined) {
        hover_index.value = index
        hover_categoryId.value = unref(left_side)[index].main_category.link_value
      }
      hover_visible.value = bool
    }

    const side_leave = () => {
      hover_visible.value = false
      hover_categoryId.value = 0
      hover_index.value = -1
    }

    const toGoodsList = (categoryId) => {
      let newWin = router.resolve({
        path: '/goods/list',
        query: {
          categoryId: categoryId,
          g: 1,
          pid: 0
        }
      })
      window.open(newWin.href, '_blank');
    }

    onMounted(() => {
      getList()
      hideCategorySort()
    })

    return {
      seamlessOption,
      hover_index,
      toGoodsList,
      handle_category_children,
      hover_visible,
      hover_categoryId,
      side_leave,
      memberInfo,
      right_side, center_banner, left_side, article_list, configInfo, loginFlag, avatarValue, goOnline, goArticle, center_right, computedStyle
    }
  }
}
</script>
<style lang="scss">
.carousel_area {
  .el-carousel__button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: relative;
  }

  .el-carousel__arrow {
    width: 26px;
    height: 35px;
    line-height: 35px;
    border-radius: 0;
    background-color: rgba(0, 0, 0, .15);
    font-size: 13px !important;

    &:hover {
      background-color: rgba(0, 0, 0, .4);
    }
  }

  .el-carousel__arrow--right {
    right: 0;

    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding-left: 5px;

    .el-icon-arrow-right {
      font-weight: bold;
    }
  }

  .el-carousel__arrow--left {
    left: 0;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    padding-right: 5px;

    .el-icon-arrow-left {
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss" scoped>
.banner_container {
  padding: 10px 0;
}

.main_banner_3 {
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 1210px;
  margin: 0px auto;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 145px;
  margin-top: 7px;

  a {
    cursor: pointer;

    &:hover {
      color: var(--color_main) !important;
    }
  }

}

.carousel_area {
  width: 600px;
  margin: 0 10px;
  background: #fff;
  overflow: hidden;
}

.side_wrapper {
  padding: 0 10px;
  width: 200px;
  height: 457px;
  background: #fff;

  &.left_side {
    padding: 10px 0 !important;
  }
}

.category_unit {
  margin: 2px 0;
  padding: 10px;


  &.hover_selected {
    background-color: #ececec;
  }

  .unit_image {
    width: 19px;
    min-width: 19px;
    height: 19px;


    img {
      width: 100%;
      height: 100%;
    }
  }

  .unit_text {
    flex: 1;
    margin-left: 8px;
    padding-top: 1px;

    p {
      display: inline-block;
      color: #333;
      font-family: 'PingFang SC';
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
    }

    span {
      height: 13px;
      overflow: hidden;
      color: #888;
      font-family: 'PingFang SC';
      font-size: 13px;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:last-child {
        .text_seperator {
          display: none;
        }
      }

      .text_seperator {
        margin: 0 2px;
      }

      a {
        color: #999;
        font-style: normal;

        &.text_active {
          color: #777;
        }
      }
    }
  }
}

.img_area {
  height: 457px;
  margin-right: 10px;

  .img_adv_wrapper {
    height: 100%;

    .img_adv_com {
      background-color: #fff;
      width: 180px;
      height: 146px;
      transition: opacity ease 0.5s;
      overflow: hidden;

      &:hover {
        opacity: 0.75;
      }
    }

    .img_adv_item {
      width: 100%;
      height: 100%;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}


.login_area {
  margin-bottom: 20px;
  padding-top: 10px;

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #efefef;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;

  }

  .welcome_intro {
    height: 40px;
    margin-top: 11px;
    padding: 0 10px;
    color: #666;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .login_wrap {
    display: flex;
    margin-top: 5px;

  }

  .but {
    width: 67px;
    height: 24px;
    border-radius: 12px;
    color: #fff;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-weight: 400;
    line-height: 24px;
    text-align: center;
    cursor: pointer;

    &.btn_lgn {
      background: var(--color_main);
    }

    &.btn_reg {
      background: var(--color_vice);
    }

    &.btn_lgnout {
      border: 1px solid var(--color_main);
      background-color: #fff;
      color: var(--color_main);
      line-height: 23px !important;
    }
  }
}

.line {
  height: 1px;
  background: #EBECED;
  width: 100%
}

.link_article {
  margin: 14px 0;

  .title {
    color: #333;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-weight: bold;
  }

  .more {
    color: #999;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;

    &:hover {
      color: var(--color_main);
    }
  }

  .article_item {
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .hot_tag {
      display: inline-block;
      width: 30px;
      min-width: 30px;
      height: 16px;
      border-radius: 3px;
      background: #feebed;
      color: #ed544d;
      font-family: 'Microsoft YaHei';
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
      text-align: center;
    }

    .article_title {
      color: #666;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-weight: 400;
      cursor: pointer;
      margin-left: 5px;

      &:hover {
        color: var(--color_main);
      }
    }
  }
}

.link_item {
  width: 48px;
  margin-bottom: 20px;
  cursor: pointer;

  &:hover {
    p {
      color: var(--color_main);
    }
  }


  .info_image {
    width: 28px;
    height: 28px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  p {
    margin-top: 10px;
    color: #333;
    font-family: 'Microsoft YaHei';
    font-size: 12px;
    font-weight: 400;

    &.small {
      font-size: 10px;
      white-space: nowrap;
    }
  }
}

.main_banner_item_wrap {
  width: 600px;
  height: 457px;
  overflow: hidden;
  position: relative;
}

.banner_img_show {
  position: absolute;
  top: 0;
  left: 50%;
  width: 600px;
  height: 457px;
  transform: translateX(-50%);
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
}

.info_wrap {
  display: flex;
  flex-wrap: wrap;

  justify-content: space-between;

  &.two_width {
    width: 119px;
  }
}
</style>