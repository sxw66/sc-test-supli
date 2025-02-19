<!-- 文章页面左侧栏 -->
<template>
  <div class="left_wrap">
    <div class="article_left">
      <div class="nch_module nch_module_style01">
        <div class="title">
          <h3>{{ L['文章分类'] }}</h3>
        </div>
        <div class="article_content">
          <ul class="nch_sidebar_article_class">
            <li v-for="(item, index) in data.allCategory" :key="item.categoryId"
              :class="data.curindex == index ? 'tabcolor' : ''">
              <router-link :to="{ path: 'article', query: { categoryId: item.categoryId } }" replace>
                <a @click="getArticalDetail(item.categoryName, index, item.categoryId)">{{ item.categoryName }}></a>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="nch_module nch_module_style02">
        <div class="title">
          <h3>{{ L['最新文章'] }}</h3>
        </div>
        <div class="article_content">
          <ul class="nch_sidebar_article_list">
            <li v-for="(item, index) in data.cate" :key="index" @click="toDetail(item.articleId, index)">
              <div class="sortes">
                <i></i>
                <a :class="data.articleIndex == index ? 'help_name_other' : 'help_name'">{{ item.title }}</a>
              </div>
              <p class="help_time">
                <span>{{ item.createTime }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import qs from "qs";
import { reactive, getCurrentInstance, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
export default {
  props: ['categoryId'],
  setup (props, { emit }) {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const route = useRoute()
    const data = reactive({
      curindex: 0,
      cate: '',
      allCategory: '',
      articleIndex: -1
    })

    //获取文章分类数据
    const getArticalList = () => {
      const params1 = {}
      params1.cateSize = 100
      proxy.$get('v3/supplier/channel/article/helpList', params1).then(res => {
        if (res.state === 200) {
          data.allCategory = res.data
          if (!route.query.categoryId && !route.query.articleId) {
            //获取服务中心数据
            if (res.data.length > 0) {
              emit(
                'getArticalDetail',
                res.data[0].categoryName,
                res.data[0].categoryId,
                true
              )
            }
          } else {
            for (let i = 0; i < data.allCategory.length; i++) {
              if (data.allCategory[i].categoryId == route.query.categoryId) {
                data.curindex = i
                emit('settitle', data.allCategory[i].categoryName)
              } else {
                let idx = data.allCategory[i].articleList.findIndex(
                  x => x.articleId == route.query.articleId
                )
                if (idx > -1) {
                  data.curindex = i
                  emit('settitle', data.allCategory[i].categoryName)
                }
              }
            }
          }
        }
      })
    }

    // 文章详情
    const toDetail = (articleId, index) => {
      emit('seeDetail', articleId)
      data.articleIndex = index
    }

    // 通过Id获取文章详情
    const getArticalDetail = (categoryName, index, categoryId) => {
      data.curindex = index
      data.articleIndex = -1
      emit('getArticalDetail', categoryName, categoryId)
    }

    //获取文章列表
    const getList = () => {
      const params = {}
      params.size = 6
      proxy.$get('v3/supplier/channel/article/articleList', params).then(res => {
        if (res.state == 200) {
          data.cate = res.data
        }
      })
    }

    onMounted(() => {
      getList()
      getArticalList()
    })

    //vue3 路由守卫
    onBeforeRouteUpdate(() => {
      getArticalList()
    })

    return { data, getArticalList, toDetail, getArticalDetail, L }
  }
}
</script>

<style lang="scss" scoped>
.sortes {
  display: flex;
}

.left_wrap {
  width: 244px;
  min-height: 700px;

  .nch_module {
    margin-bottom: 10px;
    max-height: 400px;
    background-color: #fff;

    .title {
      background-color: #efefef;
      height: 34px;
      color: #333333;
      font-size: 14px;
      text-align: center;

      h3 {
        color: #333;
        margin: 0;
        font-weight: 600;
        font: normal 14px/34px 'microsoft yahei';
      }
    }
  }

  .nch_module_style01 {
    border-top: solid 3px var(--color_main);
  }

  .nch_module_style02 {
    border-top: solid 4px var(--color_main);
  }

  .nch_sidebar_article_class {
    width: 244px;
    padding: 12px 0 19px;
    overflow: hidden;
    text-overflow: ellipsis;

    .tabcolor {
      background-color: var(--color_main);

      a {
        color: white !important;
      }
    }

    li {
      width: 50%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      vertical-align: top;
      letter-spacing: normal;
      word-spacing: normal;
      display: inline-block;

      &:nth-child(2n-1) {
        width: 121px;
        border-right: dotted 1px #d7d7d7;
      }

      &:hover {
        background: var(--color_main_bg);

        a {
          color: #fff;
        }
      }

      a {
        line-height: 36px;
        font-size: 13px;
        color: #666666;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 4px;
      }
    }
  }

  .nch_sidebar_article_list {
    padding: 4px 0px;
    min-height: 400px;

    li {
      margin: 15px 0;
      padding: 4px 9px;
      cursor: pointer;

      div {
        padding: 3px 0;

        i {
          vertical-align: middle;
          display: inline-block;
          width: 6px;
          height: 6px;
          margin-right: 10px;
          border-radius: 3px;
          background-color: #d3d3d3;
          margin-top: 4px;
        }

        a:link,
        a:visited {
          color: #333333;
          text-decoration: none;
        }

        .help_name {
          width: 200px;
          color: #333333;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow: hidden;
        }

        .help_name_other {
          width: 200px;
          color: #ffa200;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          word-break: break-all;
          display: -webkit-box;
        }
      }

      .help_time {
        color: #999999;
        font-size: 12px;
        padding-left: 20px;
      }
    }
  }
}
</style>