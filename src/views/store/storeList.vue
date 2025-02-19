<template>
  <div>
    <div class="sld_store_list">
      <img class="store_list_banner" src="../../assets/store_list_banner.png" />
      <div class="clearfix seller_list_search">
        <a :class="0 === indexNum ? 'fl on' : 'fl'" @click="filterSort(0)">{{ L['默认'] }}
        </a>
        <a :class="1 === indexNum ? 'fl on' : 'fl'" @click="filterSort(1)">{{ L['销量'] }}
        </a>
        <a :class="2 === indexNum ? 'fl on' : 'fl'" @click="filterSort(2)">{{ L['人气'] }}
        </a>
        <input type="text" name="sellerName" :placeholder="L['请输入搜索内容']" v-model="keyWord"
          @keyup.enter="search_store(keyWord)" />
        <button @click="search_store(keyWord)">{{ L['搜索'] }}</button>
      </div>
      <div class="seller_list">
        <div class="fav_list fav_list_box">
          <div v-for="(item, index) in initData.data" :key="index">
            <StoreItem :item="item" :ItemIndex="index" :skeleton="firstLoading">
            </StoreItem>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 start -->
    <div class="flex_row_center_center sld_pagination">
      <el-pagination @current-change="handleCurrentChange" v-model:currentPage="pageData.current"
        :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.total"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
    <!-- 分页 end -->

    <!-- 空页面 start-->
    <SldCommonEmpty v-if="!firstLoading && !initData.data.length" />
    <!-- 空页面 end-->
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import StoreItem from './StoreItem'
import SldCommonEmpty from '../../components/SldCommonEmpty'

export default {
  components: {
    StoreItem,
    SldCommonEmpty
  },
  setup () {
    const firstLoading = ref(true) //是否第一次加载
    const initData = reactive({ data: [] })
    const pageData = reactive({
      current: 1,
      pageSize: 10,
      total: null
    })
    const params = reactive({
      current: pageData.current,
      pageSize: 10
    })
    const indexNum = ref(0)
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    //初始化数据
    const getInitData = params => {
      proxy.$get('v3/supplier/channel/store/list', params).then(res => {
        firstLoading.value = false
        if (res.state === 200) {
          initData.data = res.data.list
          pageData.current = res.data.pagination.current
          pageData.pageSize = res.data.pagination.pageSize
          pageData.total = res.data.pagination.total

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
      })
    }
    const filterSort = index => {
      //根据三种分类进行请求传参
      indexNum.value = index
      params.sort = index
      getInitData(params)
    }

    //分页切换
    const handlePrevCilickChange = e => {
      params.current = e
      getInitData(params)
    }
    const handleNextCilickChange = e => {
      params.current = e
      getInitData(params)
    }
    const handleCurrentChange = e => {
      params.current = e
      getInitData(params)
    }

    //供应商搜索
    const keyWord = ref('')
    const search_store = keyWord => {
      params.keyword = keyWord
      getInitData(params)
    }
    onMounted(() => {
      getInitData(params)
    })
    return {
      initData,
      filterSort,
      indexNum,
      pageData,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      L,
      keyWord,
      search_store,
      firstLoading
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/storeList.scss';
@import '../../style/base.scss';

.sld_pagination {
  width: 580px;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
