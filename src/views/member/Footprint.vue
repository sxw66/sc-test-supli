<template>
  <div class="sld_look_log clearfix">
    <!-- 路径导航 -->
    <div class="log_banner clearfix">
      <MemberTitle :memberTitle="L['我的足迹']"></MemberTitle>
      <button class="log_option" @click="logClear" v-show="looklog.log.length">
        {{ L['清空'] }}
      </button>
    </div>

    <!-- 足迹 -->
    <div class="sld_footprint">
      <div class="block">
        <el-timeline>
          <el-timeline-item :timestamp="time" placement="top" color="var(--color_vice)"
            v-for="({ productLookLogList, time }, index) in looklog.log" :key="index">
            <ul class="sld_foot_goods clearfix">
              <li v-for="({
        goodsImage,
        productPrice,
        productId,
        isFollowProduct
      },
        index) in productLookLogList" :key="index">
                <div class="img">
                  <router-link :to="`/goods/detail?sourcePath=/footprint&productId=${productId}`" target="_blank">
                    <img :src="goodsImage" alt="" /></router-link>
                </div>
                <p class="sld_foot_price">
                  <span class="fl">{{ L['R$'] }}{{ $formatMoneyNum(productPrice || 0) }}</span>
                  <a style="cursor: pointer;">
                    <span class="fr" @click="follow(productId, true)" v-if="!isFollowProduct">{{ L['收藏'] }}</span>
                    <span class="fr" @click="follow(productId, false)" v-else>{{
        L['已收藏']
      }}</span>
                  </a>
                </p>
              </li>
            </ul>
          </el-timeline-item>
        </el-timeline>
      </div>
      <SldCommonEmpty v-show="!looklog.log.length" totalWidth="1000" :tip="L['暂无足迹']" totalHeight="680"
        paddingTop="250" />
      <!-- 分页 -->
      <div class="flex_row_center_center sld_pagination">
        <el-pagination @current-change="handleCurrentChange" v-model:currentPage="looklog.page.current"
          :page-size="looklog.page.pageSize" layout="prev, pager, next, jumper" :total="looklog.page.total"
          :hide-on-single-page="true">
        </el-pagination>
      </div>
    </div>


  </div>
</template>
<script>
import { ElTimeline, ElTimelineItem, ElMessage } from 'element-plus'
import { getCurrentInstance, onMounted, reactive, computed } from 'vue'
import MemberTitle from '../../components/MemberTitle'
import SldCommonEmpty from '../../components/SldCommonEmpty'
import { useStore } from 'vuex'

export default {
  name: 'Footprint',
  components: {
    ElTimeline,
    ElTimelineItem,
    MemberTitle,
    SldCommonEmpty,
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const looklog = reactive({ log: [], page: {} })
    const L = proxy.$getCurLanguage()
    
    const page = reactive({
      current: 1
    })
    const getInitData = () => {
      proxy.$get('v3/supplier/channel/productLookLog/list', page).then(res => {
        if (res.state == 200) {
          looklog.log = res.data.list
          looklog.page = res.data.pagination
        }
      })
    }

    const follow = (productId, logic) => {
      //关注商品
      let params = {
        isCollect: logic,
        productId: productId
      }
      proxy
        .$post('v3/supplier/channel/followProduct/update', params)
        .then(res => {
          if (res.state == 200) {
            getInitData()
          } else {
            ElMessage.error(res.msg)
          }
        })
        .catch(err => {
          ElMessage.error(err)
        })
    }

    const handlePrevCilickChange = e => {
      //分页前一页操作
      page.current = e
      getInitData()
    }
    const handleNextCilickChange = e => {
      //分页前一页操作
      page.current = e
      getInitData()
    }
    const handleCurrentChange = e => {
      //分页点击操作
      page.current = e
      getInitData()
    }

    const logClear = () => {
      proxy
        .$confirm(L['确定要清空吗?'], L['提示'], {
          confirmButtonText: L['确定'],
          cancelButtonText: L['取消'],
          type: 'warning',
          confirmButtonClass: 'confirm-button-class'
        })
        .then(() => {
          proxy.$get('v3/supplier/channel/productLookLog/empty').then(res => {
            if (res.state == 200) {
              getInitData()
              ElMessage(res.msg)
            }
          })
        })
    }
    onMounted(() => {
      getInitData()
    })

    return {
      L,
      looklog,
      handlePrevCilickChange,
      handleNextCilickChange,
      handleCurrentChange,
      follow,
      logClear,
    }
  }
}
</script>
<style lang="scss">
.confirm-button-class {
  color: #fff;
  background-color: var(--color_main) !important;
  border-color: var(--color_main) !important;
}

@import '../../style/member/footprint.scss';
@import '../../style/base.scss';
</style>
