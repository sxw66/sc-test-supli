<!-- 供应商商品列表 @zjf-2020-12-30 -->
<template>
  <div class="sld_store_goods_list clearfix" :class="{ skeleton_sld_store_goods_list: firstLoading }">
    <!-- 左侧分类 start -->
    <div class="left_cat_wrap" v-show="firstLoading ? true : storeData.cat.length">
      <template v-for="(item, index) in firstLoading
    ? skeletonData.category
    : storeData.cat" :key="index">
        <dl :class="{
    store_cat_item: true,
    on: !(item.openFlag != undefined && !item.openFlag)
  }">
          <dt class="grade_one_cat">
            <router-link :to="`/store/goods?vid=${vid}&categoryId=${item.innerLabelId}`">
              {{ item.innerLabelName }}
            </router-link>
            <i v-if="item.children.length" class="more" @click="toggleOpenFlag(index)"></i>
          </dt>
          <dd v-if="item.children.length &&
    !(item.openFlag != undefined && !item.openFlag)
    ">
            <router-link v-for="(item_child, index_child) in item.children" :key="index_child" :to="`/store/goods?vid=${vid}&categoryId=${item_child.innerLabelId}`
    ">
              {{ item_child.innerLabelName }}
            </router-link>
          </dd>
        </dl>
      </template>
    </div>
    <!-- 左侧分类 end -->

    <!-- 右侧商品 start -->
    <div :class="{
    right_goods_wrap: true,
    fr: storeData.cat.length,
    no_cate_goods_wrap: !storeData.cat.length
  }">
      <div class="store_goods_search_nav">
        <span :class="{ active: sort == 0 }" @click="handleSort(0)">{{
    L['综合']
  }}</span>
        <!--0:默认/综合；1、销量从高到底；3、价格从低到高；4、价格从高到低；5、人气从高到低-->

        <span @click="handleSort(1)" :class="{ active: sort == 1 }">{{ L['销量'] }}
          <i :class="{ iconfont: true, up: true }"></i>
        </span>

        <span @click="handleSort(sort == 4 ? 3 : 4)" :class="{ active: sort == 3 || sort == 4 }">{{ L['价格'] }}
          <i v-if="sort != 3" :class="{ iconfont: true }"></i>
          <i v-if="sort == 3" class="iconfont"></i>
        </span>

        <span @click="handleSort(5)" :class="{ active: sort == 5 }">{{ L['人气'] }}
          <i :class="{ iconfont: true }"></i>
        </span>

        <div class="sld_store_goods_total_num">
          {{ L['共'] }}{{ storeData.goods.pagination.total
          }}{{ L['件相关商品'] }}
        </div>
      </div>
      <ul class="sld_store_goods_list_wrap">
        <li v-for="(item, index) in firstLoading
    ? skeletonData.goods
    : storeData.goods.list" :key="index">
          <div class="sld_goods_img">
            <router-link target="_blank" :to="`/goods/detail?productId=${item.defaultProductId}`">
              <img :src="item.goodsImage" style="display: block;" />
            </router-link>
          </div>
          <p class="clearfix">
            <span class="sld_goods_price fl">R$<em>{{ $formatMoneyNum(item.goodsPrice) }}</em></span>
            <span class="fr">{{ L['成交量'] }} <em>{{ item.saleNum }}</em></span>
          </p>
          <div class="sld_goods_name_wrap">
            <router-link target="_blank" :to="`/goods/detail?productId=${item.defaultProductId}`"
              :title="item.goodsName" class="sld_goods_name">
              <span>{{ item.goodsName }}</span>
            </router-link>
          </div>
          <div class="promotion_tag">
            <template v-if="item.activityList && item.activityList.length">
              <div style="display: flex;">
                <div v-for="(item_activity, index_activity) in item.activityList" :key="index_activity">
                  <span class="promotion_tag_text">{{
    item_activity.promotionName
  }}</span>
                </div>
              </div>
            </template>
            <button class="sld_collect_wrap fr flex_row_center_center" :class="{ collect_active: item.isFollowGoods }"
              @click="collect(item.defaultProductId, item.isFollowGoods)">
              <dynaIcon src="goods/collection.png" width="20" height="20" color="--color_main"
                v-if="item.isFollowGoods">
              </dynaIcon>
              <img src="@/assets/goods/no_collection.png" alt="" v-else style="width:20px;height:20px;" />
              {{ L['收藏'] }}
            </button>
          </div>
        </li>
      </ul>
      <!-- 分页 start -->
      <div class="flex_row_center_center sld_pagination">
        <el-pagination @current-change="handleCurrentChange" currentPage="currentPage"
          :page-size="storeData.goods.pagination.pageSize" layout="prev, pager, next, jumper"
          :total="storeData.goods.pagination.total" :hide-on-single-page="true">
        </el-pagination>
      </div>
      <!-- 分页 end -->
    </div>


    <!-- 空页面 start-->
    <SldCommonEmpty v-if="!firstLoading && !storeData.goods.list.length" totalWidth="979" totalHeight="700"
      paddingTop="200" />
    <!-- 空页面 end-->
  </div>
</template>
<script>
import { ref, reactive, getCurrentInstance, watchEffect, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import SldCommonEmpty from '../../components/SldCommonEmpty'

export default {
  name: 'StoreGoodsList',
  components: {
    SldCommonEmpty
  },
  setup () {
    const firstLoading = ref(true) //是否第一次加载
    const store = useStore()
    const router = useRoute()

    const storeData = reactive({ cat: [], goods: { list: [], pagination: {} } }) //供应商数据，cat：供应商分类，goods：供应商商品列表
    const vid = router.query.vid
    const currentPage = ref(1) //分页——当前页
    const sort = ref(0) //0:默认/综合；1、销量从高到底；3、价格从低到高；4、价格从高到低；5、人气从高到低
    const categoryId = ref(
      router.query.categoryId != undefined ? router.query.categoryId : ''
    ) //分类id
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const keyword = ref(
      router.query.keyword != undefined && router.query.keyword
        ? router.query.keyword
        : ''
    ) //搜索关键词
    const skeletonData = reactive({ category: [], goods: [] })
    const initSkeletonData = () => {
      for (let i = 0; i < 5; i++) {
        skeletonData.category.push({
          innerLabelId: '',
          innerLabelName: '',
          openFlag: true,
          children: [
            { innerLabelId: '', innerLabelName: '0' },
            { innerLabelId: '', innerLabelName: '0' },
            { innerLabelId: '', innerLabelName: '0' }
          ]
        })
      }
      for (let i = 0; i < 8; i++) {
        skeletonData.goods.push({
          defaultProductId: '',
          goodsImage: '',
          goodsPrice: '',
          saleNum: '',
          activityList: [],
          isFollowGoods: false
        })
      }
    }
    //获取供应商分类数据
    const getStoreCatData = () => {
      proxy
        .$get('v3/supplier/channel/store/storeCategory', { storeId: vid })
        .then(res => {
          if (res.state == 200) {
            storeData.cat = res.data
          }
        })
    }
    //获取供应商商品列表
    const getStoreGoodsList = () => {
      let param = {}
      param.storeId = vid
      param.current = currentPage.value
      param.sort = sort.value
      if (categoryId.value) {
        param.storeInnerLabelId = categoryId.value
      }
      if (keyword.value) {
        param.keyword = keyword.value
      }
      proxy.$get('v3/supplier/channel/goods/goodsList', param).then(res => {
        firstLoading.value = false
        if (res.state == 200) {
          storeData.goods = res.data
        }
      })
    }
    const toggleOpenFlag = key => {
      storeData.cat[key].openFlag =
        storeData.cat[key].openFlag != undefined
          ? !storeData.cat[key].openFlag
          : false
    }
    //分页切换/前往指定页面
    const handleCurrentChange = val => {
      currentPage.value = val
      getStoreGoodsList()
    }
    //分页——前一页事件
    const handlePrevCilickChange = val => {
      currentPage.value = val.value
      getStoreGoodsList()
    }
    //分页——下一页事件
    const handleNextCilickChange = val => {
      currentPage.value = val.value
      getStoreGoodsList()
    }
    //综合、销量、价格、人气排序
    const handleSort = val => {
      if (val == 3 || val == 4) {
        sort.value = val
      } else {
        if (sort.value == val) {
          return
        } else {
          sort.value = val
        }
      }
    }
    //左侧分类点击事件(包含一级、二级)
    const handleCat = id => {
      categoryId.value = id
      keyword.value = ''
      getStoreGoodsList()
    }
    watchEffect(() => {
      if (router.query.categoryId != undefined && router.query.categoryId) {
        categoryId.value = router.query.categoryId
      } else {
        categoryId.value = ''
      }
      if (router.query.keyword || router.query.keywordStore) {
        keyword.value = router.query.keyword || router.query.keywordStore
      } else {
        keyword.value = ''
      }
      getStoreGoodsList()
    })
    //收藏功能
    const collect = (defaultProductId, isFollowGoods) => {
      if (store.state.loginFlag) {
        //收藏功能
        let params = {
          productId: defaultProductId,
          isCollect: !isFollowGoods
        }
        proxy.$post('v3/supplier/channel/followProduct/update', params).then(res => {
          if (res.state == 200) {
            ElMessage.success(res.msg)
            storeData.goods.list.map(storeGoodsItem => {
              if (storeGoodsItem.defaultProductId == defaultProductId) {
                storeGoodsItem.isFollowGoods = !storeGoodsItem.isFollowGoods
              }
            })
          } else {
            ElMessage.error(res.msg)
          }
        })
      }
    }



    const refreshInfo = () => {
      history.go(0)
    }

    onMounted(() => {
      initSkeletonData()
      getStoreCatData()
      getStoreGoodsList()
    })

    return {
      refreshInfo,
      L,
      storeData,
      toggleOpenFlag,
      currentPage,
      handleCurrentChange,
      handlePrevCilickChange,
      handleNextCilickChange,
      sort,
      vid,
      handleSort,
      handleCat,
      collect,
      firstLoading,
      skeletonData,
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/store/goodsList.scss';

.el-pager li.active {
  color: var(--color_main);
  cursor: default;
}

.el-pager li:hover {
  color: var(--color_main);
}

.sld_pagination {
  margin: 20px 0 20px 0;
}

.store_goods_search_nav {
  cursor: pointer;
}
</style>
