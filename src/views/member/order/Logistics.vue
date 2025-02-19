// 填写物流页面
<template>
  <div class="sld_logistics_bill">
    <MemberTitle :memberTitle="L['用户发货']" style="padding-left:20px"></MemberTitle>
    <div class="logistics_goods">
      <div class="logistics_goods_title flex_row_center_center">
        <p>{{ L['商品名称'] }}</p>
        <p>{{ L['购买数量'] }}</p>
      </div>
      <div class="logistics_goods_con flex_row_start_center">
        <div class="logistics_goods_des flex_row_start_center">
          <div class="logistics_goods_img" :style="{
      backgroundImage: 'url(' + refundDetail.data.productImage + ')'
    }"></div>
          <div class="logistics_goods_name">
            {{ refundDetail.data.goodsName }}
          </div>
        </div>
        <div class="logistics_goods_num">{{ refundDetail.data.returnNum }}</div>
      </div>
    </div>
    <div class="logistics_info">
      <div class="info_type flex_row_start_center margin_bottom20">
        <div class="info_pre">{{ L['服务类型'] }}:</div>
        <div class="info_type_con">
          <span>{{ L['发货'] }}</span>
          <dynaIcon src="buy/corner_icon.png" width="15" height="14" color="--color_main" class="img"></dynaIcon>
        </div>
      </div>
      <div class="info_com margin_bottom20 flex_row_start_center">
        <div class="info_pre">{{ L['物流公司'] }}：</div>
        <el-select-v2 v-model="curLogicsCompany" filterable :options="options" :placeholder="L['请选择']"
          style="width: 200px;" :no-data-text="L['暂无数据']" />
      </div>
      <div class="info_bill margin_bottom20 flex_row_start_center">
        <div class="info_pre">{{ L['物流单号'] }}：</div>
        <el-input :placeholder="L['请输入物流单号']" class="info_bill_input" v-model="logisticsBill" maxlength="20"
          style="width: 200px;">
        </el-input>
      </div>
      <div class="info_address margin_bottom20 flex_row_start_center">
        <div class="info_pre">{{ L['退货地址：'] }}</div>
        <div class="address">
          {{ refundDetail.data.storeContactName }}&nbsp;{{
      refundDetail.data.storeTelphone
    }}&nbsp; {{ refundDetail.data.storeAreaInfo }}&nbsp;{{ refundDetail.data.storeAddress }}
        </div>
      </div>
    </div>
    <div class="info_submit" @click="infoSubmit">{{ L['提交'] }}</div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MemberTitle from '../../../components/MemberTitle'

export default {
  components: {
    MemberTitle
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()
    const L = proxy.$getCurLanguage()
    const afsSn = ref('') //售后单号
    const refundDetail = reactive({ data: {} }) //退款详情
    const LogisticsCompany = reactive({ data: [] }) //物流公司
    const curLogicsCompany = ref('') //当前物流公司名称
    const curLogicsCompanyId = ref('') //物流公司id
    const logisticsBill = ref('') //物流单号
    const options = ref([])
    onMounted(() => {
      afsSn.value = route.query.afsSn
      getRefundOrderDetail()
      getLogisticsCompany()
    })
    //获取售后订单详情
    const getRefundOrderDetail = () => {
      let params = {
        afsSn: afsSn.value
      }
      proxy.$get('v3/supplier/channel/after/sale/detail', params).then(res => {
        if (res.state == 200) {
          refundDetail.data = res.data
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    //获取物流公司
    const getLogisticsCompany = () => {
      proxy
        .$get('v3/system/common/expressList', { pageSize: 1000 })
        .then(res => {
          if (res.state == 200) {
            LogisticsCompany.data = res.data.list
            options.value = LogisticsCompany.data.map(item => {
              return {
                value: item.expressId,
                label: item.expressName
              }
            })
          } else {
            ElMessage.error(res.msg)
          }
        })
    }
    //选择物流公司
    const changeExpressId = e => {
      curLogicsCompanyId.value = e
    }
    //提交物流信息
    const infoSubmit = () => {
      if (curLogicsCompany.value == '') {
        ElMessage(L['请选择物流公司!'])
        return
      }
      if (logisticsBill.value == '') {
        ElMessage(L['请输入物流单号！'])
        return
      }
      let reg = /^[0-9a-zA-Z]{1,20}$/g
      if (!reg.test(logisticsBill.value)) {
        ElMessage(L['请输入正确的物流单号！'])
        return
      }
      let params = {
        afsSn: afsSn.value,
        expressId: curLogicsCompany.value, //物流公司id
        logisticsNumber: logisticsBill.value //快递单号
      }
      proxy
        .$post('v3/supplier/channel/after/sale/deliverGoods', params)
        .then(res => {
          if (res.state == 200) {
            ElMessage.success(res.msg)
            router.go(-1)
          } else {
            ElMessage.error(res.msg)
          }
        })
    }

    watch(logisticsBill, () => {
      logisticsBill.value = logisticsBill.value.replace(/[^0-9a-zA-Z]*$/g, '')
    })

    return {
      L,
      refundDetail,
      LogisticsCompany,
      curLogicsCompany,
      infoSubmit,
      changeExpressId,
      curLogicsCompanyId,
      logisticsBill,
      options
    }
  }
}
</script>

<style lang="scss">
.el-select-v2__wrapper.is-focused {
  border-color: var(--color_main);
}

.info_com {
  .el-select-v2__placeholder {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sld_logistics_bill {
  .el-input__inner {
    font-size: 14px;
  }
}
</style>

<style lang="scss" scoped>
@import '../../../style/base.scss';
@import '../../../style/logistics.scss';

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
