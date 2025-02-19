<template>
  <div class="brand_center clearfix">
    <div class="bottom_line"></div>
    <div class="brand_list clearfix">
      <p class="title_ch">{{ L['品牌中心'] }}</p>
      <!-- <p class="title_en">
                <span>B</span>
                <span>R</span>
                <span>A</span>
                <span>N</span>
                <span>D</span>
                <span></span>
                <span>C</span>
                <span>E</span>
                <span>N</span>
                <span>T</span>
                <span>E</span>
                <span>R</span>
            </p>
            <div class="line"></div> -->
      <div class="brand_container">
        <div v-for="({ goodsBrandInfoList }, index) in brandList.list" :key="index">
          <div class="brand_item_list">
            <div v-for="(item, index) in goodsBrandInfoList" :key="index" @click="toshopList(item.brandId)"
              class="brand_item">
              <div class="img">
                <img :src="item.imageUrl" alt />
              </div>
              <div class="bottom_name">{{ item.brandName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex_row_center_center sld_pagination">
      <el-pagination @current-change="handleCurrentChange" v-model:currentPage="brandList.page.current"
        :page-size="brandList.page.pageSize" layout="prev, pager, next, jumper" :total="brandList.page.total"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive } from 'vue'
import { ElPagination } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  name: 'Brand',
  components: {
    ElPagination
  },
  setup () {
    const router = useRouter()
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const brandList = reactive({ list: [], page: { current: 1 } })
    const page = reactive({
      current: 1,
      pageSize: 20
    })
    const getInitData = () => {
      proxy.$get('v3/supplier/channel/goods/goodsBrandList', page).then(res => {
        if (res.state == 200) {
          brandList.list = res.data.list
          brandList.page = res.data.pagination
        }
      })
    }

    const handleNextCilickChange = e => {
      page.current = e
      getInitData()
    }
    const handleCurrentChange = e => {
      page.current = e
      getInitData()
    }

    const handlePrevCilickChange = e => {
      page.current = e
      getInitData()
    }

    const toshopList = brandId => {
      router.push({
        path: '/goods/list',
        query: {
          brandId: brandId
        }
      })
    }
    onMounted(() => {
      getInitData()
    })

    return {
      brandList,
      handleNextCilickChange,
      handleCurrentChange,
      handlePrevCilickChange,
      toshopList,
      L
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix {
  zoom: 1;
  display: block;
}

.brand_list {
  // min-height: 800px;
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;

  .title_ch {
    color: #333333;
    font-size: 28px;
    font-family: Inter-Medium, Inter;
    font-weight: 500;
    margin-bottom: 52px;
  }

  .title_en {
    margin-top: 20px;
    font-size: 16px;
    color: #bbbbbb;

    span {
      width: 25px;
      display: inline-block;
    }
  }

  .line {
    width: 1165px;
    margin: 0 auto;
    height: 2px;
    background-color: rgba(0, 0, 0, 0.05);
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .brand_container {
    width: 1200px;
    margin: 0 auto;

    .brand_item {
      float: left;
      width: 175px;
      height: 106px;
      border: 1px solid rgba(238, 238, 238, 1);
      /* border-radius: 6px; */
      margin-left: 22px;
      margin-bottom: 40px;
      cursor: pointer;

      .img {
        width: 175px;
        height: 78px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
          max-width: 153px;
          max-height: 54px;
          -webkit-transition: -webkit-transform 0.5s;
          transition: -webkit-transform 0.5s;
          -moz-transition: transform 0.5s, -moz-transform 0.5s;
          transition: transform 0.5s;
          transition: transform 0.5s, -webkit-transform 0.5s,
            -moz-transform 0.5s;
        }
      }

      .bottom_name {
        width: 175px;
        height: 28px;
        /* border-radius: 0 0 6px 6px; */
        color: #333333;
        background-color: #f2f2f2;
        font-size: 12px;
        font-weight: 400;
        font-family: Inter-Regular, Inter;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .brand_item:hover {
      box-shadow: 0px 5px 20px 0px rgba(137, 137, 137, 0.15);
      border: 1px solid rgba(238, 238, 238, 1);

      .bottom_name {
        color: #e1251b;
      }

      .img {
        img {
          -webkit-transform: scale(1.1);
          -ms-transform: scale(1.1);
          -o-transform: scale(1.1);
          -moz-transform: scale(1.1);
          transform: scale(1.1);
        }
      }
    }
  }
}

::-webkit-scrollbar {
  scrollbar-width: none;
  display: none;
}
</style>
