<template>
  <div class="goods_sort">
    <div class="boxbg" style="z-index:2; position: relative;">
      <div class="class_ification_wrap clearfix">
        <!-- 一级分类 -->
        <ul :class="{
          fl: true,
          class_ification: true,
          fixed: isTop,
          bottomFixed: isBottom
        }">
          <li v-for="(item, index) in navList.data" :key="index"
            :class="index === indexNum ? 'on cat_item' : 'cat_item'">
            <div @click="toTop(item.categoryId, index)">
              {{ item.categoryName }}
            </div>
          </li>
        </ul>
        <ul class="class_detail">
          <li :class="['detail_item', cateStyle]">
            <div class="detail_title">{{ childCate.categoryName }}</div>
            <div class="cat_wrap_dd">
              <div class="cat_dd_item" v-for="(item2, cateIndex) in childCate.data" :key="cateIndex"
                v-show="childCate.data && childCate.data.length">
                <div class="fl cat_left" :style="{ color: color, cursor: 'pointer' }" @click="toGoodsList(item2)">
                  {{ item2.categoryName }} >
                </div>
                <div class="cat_add_right">
                  <span v-for="(item3, index) in item2.children" @click="toGoodsList(item3)" style="cursor:pointer;"
                    :key="index">{{ item3.categoryName }}</span>
                </div>
              </div>
              <div class="detail_none flex_row_center_center" v-if="!(childCate.data && childCate.data.length) && !firstLoading
          ">
                <img :src="noneUrl" style="width: 100px;margin-bottom: 15px;" />
                <p>{{ L['暂无数据'] }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'GoodsCategory',
  components: {},
  setup () {
    const firstLoading = ref(true) //是否第一次加载
    const noneUrl = require('@/assets/common_empty.png')
    let indexNum = ref(0)
    const { proxy } = getCurrentInstance()
    const router = useRouter()
    const L = proxy.$getCurLanguage()
    const navList = reactive({ data: {} })
    const isTop = ref(false)
    const isBottom = ref(false)
    const srollOrTap = ref('')
    const getInitData = (index, params) => {
      proxy
        .$get('v3/supplier/channel/goods/category/topCategory', params)
        .then(res => {
          firstLoading.value = false
          if (res.state == 200) {
            navList.data = res.data
            getChild(navList.data[0].categoryId, index)
          }
        })
    }
    const childCate = reactive({
      categoryName: '',
      data: []
    })

    const cateStyle = ref('item_style1')

    const getChild = (categoryId1, index) => {
      proxy
        .$get('v3/supplier/channel/goods/category/bottomCategory', { categoryId1 })
        .then(res => {
          childCate.data = res.data
          childCate.categoryName = navList.data[index].categoryName
        })
    }

    const toGoodsList = item => {
      let { pid, grade, categoryId } = item

      let newWin = router.resolve({
        path: 'list',
        query: {
          categoryId,
          g: grade,
          pid
        }
      })
      window.open(newWin.href, '_blank')
    }

    const handleScroll = () => {
      var height = 150
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop > height) {
        isTop.value = true
        isBottom.value = false
      } else {
        isTop.value = false
      }

      let bottom = document.getElementsByClassName('footer_service_wrap')[0]
        .offsetTop
      let ul = document.getElementsByClassName('class_ification')[0]
        .offsetHeight
      if (ul + scrollTop + 45 >= bottom) {
        isTop.value = false
        isBottom.value = true
      }
    }
    window.addEventListener('scroll', handleScroll)

    const toTop = (categoryId, index) => {
      srollOrTap.value = 'tap'
      indexNum.value = index

      getChild(categoryId, index)
      let odd = (index + 1) % 9
      cateStyle.value = `item_style${odd}`

    }


    onMounted(() => {
      getInitData(0, {})
    })
    return {
      navList,
      noneUrl,
      indexNum,
      toGoodsList,
      L,
      firstLoading,
      isTop,
      toTop,
      isBottom,
      childCate,
      cateStyle
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/category.scss';
@import '@/style/base.scss';

.detail_none {
  flex-direction: column;
  margin-top: 7px;
  width: inherit;
  height: 200px;
}

.detail_none p {
  padding: 7px;
}
</style>
