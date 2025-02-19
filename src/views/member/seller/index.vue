<template>
  <div class="member_info_container">
    <MemberTitle :memberTitle="L['供应商注册']"></MemberTitle>
    <div>
      <Protocol v-if="step === 1" @clickNext="clickNext"></Protocol>

    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref, onMounted } from 'vue'
import MemberTitle from '../../../components/MemberTitle'
import Protocol from './Protocol.vue';

export default {
  name: 'MemberInfo',
  components: {
    MemberTitle,
    Protocol
  },
  setup () {
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const step = ref(1) // 1：协议页；  2：信息页；  3：已提交； 

    const clickNext = () => {
      step.value = 2;
    }

    onMounted(() => {})
    return {
      L,
      step,
      clickNext
    }
  }
}
</script>
<style lang="scss">
@import '../../../style/member/info.scss';

.el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 302px;
}

.el-radio-button__inner,
.el-radio-group {
  display: flex;
}
</style>
