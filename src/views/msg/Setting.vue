// 消息接收设置
<template>
  <div class="sld_setting">
    <div class="sld_setting_title">{{ L['接收设置'] }}</div>
    <div class="setting_list">
      <div class="setting_pre" v-for="(settingItem, settingIndex) in settingList.data" :key="settingIndex">
        <div class="list_title">{{ settingItem.tplName }}</div>
        <div class="list">
          <div class="list_pre" v-for="(preItem, preIndex) in settingItem.userTplList" :key="preIndex">
            <p class="list_pre_title">{{ preItem.tplName }}</p>
            <div class="list_pre_option flex_row_center_center">
              <span class="receive" :class="{ active: preItem.isReceive }"
                @click="modifySetting(preItem.tplCode, preItem.isReceive)">{{ L['接收'] }}</span>
              <span class="receive" :class="{ no_receive: !preItem.isReceive }"
                @click="modifySetting(preItem.tplCode, preItem.isReceive)">{{ L['不接收'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
export default {
  setup () {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const settingList = reactive({ data: {} })
    onMounted(() => {
      getMesList()
    })
    //获取消息设置列表
    const getMesList = () => {
      proxy.$get('v3/supplier/channel/msg/setting/list').then(res => {
        if (res.state == 200) {
          settingList.data = res.data
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    //接收设置开关修改
    const modifySetting = (tplCode, isReceive) => {
      let params = {
        tplCode,
        isReceive: isReceive == 0 ? 1 : 0
      }
      proxy.$post('v3/supplier/channel/msg/setting/isReceive', params).then(res => {
        if (res.state == 200) {
          getMesList()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
    return {
      settingList,
      modifySetting,
      L
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/base.scss';
@import '../../style/msgSetting.scss';
</style>
