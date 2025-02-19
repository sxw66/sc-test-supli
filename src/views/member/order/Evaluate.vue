<!--
 * @Author: wangwei
 * @Date: 2021-01-04 14:37:27
 * @LastEditTime: 2022-08-08 21:54:18
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/views/member/order/Evaluate.vue
-->
<template>
  <div class="sld_order_evaluate">
    <div class="title">
      <p>{{ L['评价订单'] }}</p>
      <div class="order_info">
        <span class="order_sn">{{ L['订单：'] }}{{ order_info.data.orderSn }}</span>
        <span class="time">{{ order_info.data.createTime }}</span>
      </div>
    </div>
    <div class="store_item" v-for="(storeItem, index) in order_info.data.childOrderList" :key="index">
      <!-- <div class="store_info flex_row_start_center">
        <div class="store_info_left flex_row_start_center">
          <div class="image">
            <img :src="store_info.data.storeLogoUrl" alt />
          </div>
          <div class="rate">
            <span class="store_name">{{ store_info.data.storeName }}</span>
            <div class="con flex_row_between_center">
              <div class="flex_column_center_center">
                <span>{{ L['综合'] }}</span>
                <span>{{ store_info.data.comprehensiveScore }}</span>
              </div>
              <div class="flex_column_center_center">
                <span>{{ L['商品'] }}</span>
                <span>{{ store_info.data.descriptionScore }}</span>
              </div>
              <div class="flex_column_center_center">
                <span>{{ L['服务'] }}</span>
                <span>{{ store_info.data.serviceScore }}</span>
              </div>
              <div class="flex_column_center_center">
                <span>{{ L['物流'] }}</span>
                <span>{{ store_info.data.deliverScore }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="store_info_right flex">
          <div class="item">
            <span>{{ L['描述相符'] }}</span>
            <div @mousemove="handleRate($event, 'description', storeItem)" id="description">
              <el-rate v-model="storeItem.description"
                @change="changeRate($event, 'description', 'olddescription', index)" :colors="rateColors"></el-rate>
            </div>
          </div>
          <div class="item">
            <span>{{ L['服务态度'] }}</span>
            <div @mousemove="handleRate($event, 'serviceAttitude', storeItem)" id="serviceAttitude">
              <el-rate v-model="storeItem.serviceAttitude"
                @change="changeRate($event, 'serviceAttitude', 'oldserviceAttitude', index)"
                :colors="rateColors"></el-rate>
            </div>
          </div>
          <div class="item">
            <span>{{ L['发货速度'] }}</span>
            <div @mousemove="handleRate($event, 'expressSpeed', storeItem)" id="expressSpeed">
              <el-rate v-model="storeItem.expressSpeed" @change="changeRate($event, 'expressSpeed', 'oldexpressSpeed', index)
        " :colors="rateColors"></el-rate>
            </div>
          </div>
        </div>
      </div> -->
      <div v-for="(goodItem, goodsIndex) in storeItem.orderProductList" :key="goodsIndex"
        class="shop_info flex_row_start_center">
        <div class="good_info flex_column_center_center">
          <div class="image flex_row_center_center">
            <div class="imageBack" :style="{ backgroundImage: 'url(' + goodItem.productImage + ')' }"></div>
          </div>
          <div class="name">{{ goodItem.goodsName }}</div>
          <div class="name">{{ goodItem.specValues }}</div>
          <span class="price">{{ L[''] }}R${{ $formatMoneyNum(goodItem.productShowPrice || 0) }}</span>
        </div>
        <div class="right">
          <div class="shop_rate flex_row_start_center">
            <span class="text">{{ L['商品评分'] }}</span>
            <div @mousemove="handleRate($event, 'score', goodItem, goodsIndex)" :id="`score${goodsIndex}`">
              <el-rate v-model="goodItem.score" @change="changeRate(
        $event,
        'score',
        'oldscore',
        index,
        'goods',
        goodsIndex
      )
        " :colors="rateColors"></el-rate>
            </div>
          </div>
          <div class="remark">
            <p>{{ L['评价晒单'] }}</p>
            <el-input class="textarea" rows="5" resize="none" size="medium" type="textarea" :placeholder="L['请输入内容']"
              v-model="goodItem.content" maxlength="200"></el-input>
          </div>
          <div class="picture">
            <p>{{ L['晒图'] }}</p>
            <div class="picture_wrap">
              <ul class="picture_list">
                <li class="picture_item" v-for="(img, imgIdx) in goodItem.imgShowList" :key="imgIdx">
                  <span class="close_icon"><img src="@/assets/order/close.png" alt=""
                      @click="delImg(goodItem, imgIdx)" /></span>
                  <div class="img_item" :style="{ backgroundImage: 'url(' + img + ')' }"></div>
                </li>
              </ul>
              <label :class="{ pic_btn: true, disable: indexNum }" :for="`image${index}`" @click="open(goodItem, index)"
                v-if="goodItem.imgShowList.length < 5">
                <img src="@/assets/order/pic_model.png" alt="" />
                <span class="countDown">{{ goodItem.imgList.length }}/5</span>
              </label>
              <input :id="`image${index}`" class="filepath" @change="selectPic($event, goodItem, index)" type="file"
                name="image" size="1" accept="image/gif,image/jpeg,image/gif,image/png" :ref="`image${index}`" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submit flex_row_center_center">
      <div class="btn" @click="publishEvaluate">{{ L['发表评价'] }}</div>
    </div>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref, onMounted, watch, computed } from 'vue'
import { ElRate, ElInput, ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
import axios from 'axios'
import { apiUrl } from '../../../utils/config'
export default {
  name: 'OrderEvaluate',
  components: {
    ElRate,
    ElInput
  },
  setup () {
    const order_info = reactive({ data: {} })
    const store_info = reactive({ data: {} })
    const route = useRoute()
    const evating = ref(false)
    const router = useRouter()
    const order_sn = ref('')
    const inputIndex = ref(0)
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    // const rateColors = Array(3).fill('var(--color_vice)')
    const rateColors = ref(['#FF821C', '#FF821C', '#FF821C']) 
    const store = useStore()
    

    //获取订单详情
    const getOrderInfo = () => {
      proxy
        .$post('v3/supplier/channel/orderInfo/detail', {
          orderSn: order_sn.value
        })
        .then(res => {
          if (res.state == 200) {
            order_info.data = res.data
            getStoreInfo(order_info.data.childOrderList[0].supplierStoreId)
            order_info.data.childOrderList.map(storeItem => {
              storeItem.description = 5
              storeItem.serviceAttitude = 5
              storeItem.expressSpeed = 5
              storeItem.orderProductList.map(goodItem => {
                goodItem.score = 5
                goodItem.content = ''
                goodItem.imgList = []
                goodItem.imgShowList = []
              })
            })
          } else {
            ElMessage(res.msg)
          }
        })
    }
    //获取供应商详情
    const getStoreInfo = storeId => {
      proxy
        .$get('v3/supplier/channel/store/detail', {
          storeId
        })
        .then(res => {
          if (res.state == 200) {
            store_info.data = res.data
          } else {
            ElMessage(res.msg)
          }
        })
        .catch(() => {
          //异常处理
        })
    }

    //发表评价
    const publishEvaluate = () => {
      if (evating.value) {
        return
      }
      evating.value = true
      let goodsCommentInfoList = []
      order_info.data.childOrderList[0].orderProductList.map(item => {
        let product = {}
        product.content = item.content
        product.goodsId = item.goodsId
        product.orderProductId = item.orderProductId
        product.productId = item.productId
        product.image = item.imgList.join(',')
        product.score = item.score
        goodsCommentInfoList.push(product)
      })
      let param = {
        description: order_info.data.childOrderList[0].description,
        deliverSpeed: order_info.data.childOrderList[0].expressSpeed,
        serviceAttitude: order_info.data.childOrderList[0].serviceAttitude,
        orderSn: order_sn.value,
        goodsCommentInfoList: goodsCommentInfoList
      }
      proxy
        .$post(
          'v3/supplier/channel/orderComment/addOrderComment',
          param,
          'application/json'
        )
        .then(res => {
          if (res.state == 200) {
            ElMessage.success(L['评价成功'])
            setTimeout(() => {
              router.push('/member/order/evaluation')
            }, 2000)
          } else {
            ElMessage(res.msg)
            evating.value = false
          }
        })
        .catch(() => {
          evating.value = false
        })
    }

    const open = (goodsItem, index) => {
      inputIndex.value = index
      if (goodsItem.imgList.length > 4) {
        proxy.$refs[`image${index}`].disabled = 'disabled'
        return
      } else {
        proxy.$refs[`image${index}`].disabled = ''
      }
    }

    //通过点击事件处理无法选择0星
    const changeRate = (e, key, oldkey, index, type, goodsIndex) => {
      if (type == 'goods') {
        if (
          order_info.data.childOrderList[index].orderProductList[
          goodsIndex
          ][oldkey] &&
          order_info.data.childOrderList[index].orderProductList[
          goodsIndex
          ][oldkey] ==
          order_info.data.childOrderList[index].orderProductList[
          goodsIndex
          ][key]
        ) {
          order_info.data.childOrderList[index].orderProductList[
            goodsIndex
          ][key] = 0
        }
        order_info.data.childOrderList[index].orderProductList[
          goodsIndex
        ][oldkey] =
          order_info.data.childOrderList[index].orderProductList[
          goodsIndex
          ][key]
      } else {
        if (
          order_info.data.childOrderList[index][oldkey] &&
          order_info.data.childOrderList[index][oldkey] ==
          order_info.data.childOrderList[index][key]
        ) {
          order_info.data.childOrderList[index][key] = 0
        }
        order_info.data.childOrderList[index][oldkey] =
          order_info.data.childOrderList[index][key]
      }
    }

    //针对el-rate 的组件的从初始的满星不能选到0星的问题做外部处理
    const handleRate = (e, arg, reactObj, index) => {
      if (arg == 'score') {
        let goodsScore = document.getElementById(`score${index}`)
        let { offsetLeft } = goodsScore
        let { clientX } = e
        let moveX = clientX - offsetLeft
        if (moveX < 0) {
          reactObj.score = 0
        }
      } else {
        let score = document.getElementById(arg)
        let { offsetLeft } = score
        let { clientX } = e
        let moveX = clientX - offsetLeft

        if (moveX < 0) {
          reactObj[arg] = 0
        }
      }
    }

    //晒图(选择图片)
    const selectPic = (e, goodsItem) => {
      if (goodsItem.imgList.length > 4) {
        return
      } else {
        let data = new FormData()
        data.append('file', e.target.files[0])
        data.append('source', 'evaluate')
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + store.getters.accessToken
          }
        }
        let url = apiUrl + 'v3/oss/channel/upload'
        axios.post(url, data, config).then(res => {
          proxy.$refs[`image${inputIndex.value}`].value = ''
          if (res.status === 200) {
            goodsItem.imgList.push(res.data.data.path)
            goodsItem.imgShowList.push(res.data.data.url)
          } else {
            ElMessage.warning(L['上传图片失败'])
          }
        })
      }
    }

    //晒图(删除图片)
    const delImg = (goodItem, index) => {
      goodItem.imgList.splice(index, 1)
      goodItem.imgShowList.splice(index, 1)
    }

    watch(() => { })

    onMounted(() => {
      order_sn.value = route.query.orderSn
      getOrderInfo()
    })
    return {
      order_info,
      store_info,
      publishEvaluate,
      selectPic,
      delImg,
      open,
      handleRate,
      changeRate,
      L,
      rateColors,
    }
  }
}
</script>

<style lang="scss">
@import '../../../style/member/orderEvaluate.scss';

.el-input__inner:focus {
  border-color: var(--color_main);
  outline: 0;
}

.disable {
  pointer-events: none;
}

.imageBack {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 203px;
  height: 203px;
}
</style>
