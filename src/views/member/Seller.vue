<template>
  <div class="member_info_container">
    <MemberTitle :memberTitle="L['供应商注册']"></MemberTitle>
    <div>
      
    </div>
  </div>
</template>
<script>
import { ElInput, ElButton, ElMessage } from 'element-plus'
import { getCurrentInstance, ref, onMounted, watch } from 'vue'
import MemberTitle from '../../components/MemberTitle'
import { apiUrl } from '../../utils/config'
import { useStore } from 'vuex';
import axios from 'axios'
export default {
  name: 'MemberInfo',
  components: {
    ElInput,
    ElButton,
    MemberTitle
  },
  setup () {
    const store = useStore()
    const { proxy } = getCurrentInstance()
    const L = proxy.$getCurLanguage()
    const userNameInput = ref('') //会员名
    const userNickNameInput = ref('') //会员名称
    const userTrueName = ref('') //会员姓名
    const avatar = ref('') //用户头像
    const tempSrc = ref('')
    const sex = ref(0) //性别
    const yearArr = ref(
      Array.from({ length: 80 }, (v, k) => k).map(
        item => new Date().getFullYear() - item
      )
    ) //生成年份数组-80年间隔
    const year = ref('') //当前年份
    const monthArr = ref(
      ref(Array.from({ length: 12 }, (v, k) => k).map(item => 12 - item))
    ) //生成当月的月数
    const month = ref('') //当前月分
    let d = new Date(year.value, month.value, 0).getDate() //生成设置月分的当月天数
    const dayArr = ref(
      Array.from({ length: d }, (v, k) => k).map(item => item + 1)
    ) //生成当月天数数组
    const day = ref('') //当前天

    const changepic = e => {
      //上传头像
      let newsrc = getObjectURL(e.target.files[0])
      let data = new FormData()
      data.append('file', e.target.files[0])
      data.append('source', 'headImg')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + store.getters.accessToken
        }
      }
      let url = apiUrl + 'v3/oss/channel/upload'
      if (e.target.files[0].size < Math.pow(1024, 2) * 4) {
        tempSrc.value = newsrc
        axios.post(url, data, config).then(res => {
          if (res.status === 200) {
            ElMessage.success(L['上传图片成功'])
            tempSrc.value = res.data.data.url
            avatar.value = res.data.data.path
          } else {
            ElMessage.warning(L['上传图片失败'])
          }
        })
      } else {
        ElMessage.warning(L['图像应小于4MB'])
        tempSrc.value = avatar.value
      }
    }
    const getObjectURL = file => {
      //createObjectURL在前端显示更换后的头像
      var url = null
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }

    const getInitData = () => {
      //初始化数据
      proxy.$get('v3/supplier/channel/user/memberInfo').then(res => {
        if (res.state == 200) {
          sex.value = res.data.gender
          userNameInput.value = res.data.userName
          userNickNameInput.value = res.data.userNickName
          tempSrc.value = res.data.userAvatar
          userTrueName.value = res.data.userTrueName
          if (res.data.userBirthday) {
            year.value = res.data.userBirthday.split('-')[0]
            month.value = parseInt(res.data.userBirthday.split('-')[1])
            day.value = parseInt(res.data.userBirthday.split('-')[2])
          }

        }
      })
    }

    const memberInfoSave = () => {
      //保存
      // let params = new FormData()

      if (!avatar.value) {
        avatar.value = tempSrc.value
      }

      let birthday = [year.value, month.value, day.value]
        .map(item => (item.toString().length < 2 ? '0' + item : item))
        .join('-')
      let params = {
        gender: sex.value,
        userAvatar: avatar.value,
        userBirthday: birthday,
        userName: userNameInput.value
      }

      let reg = /[`~!@¥#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;

      if (userTrueName.value && reg.test(userTrueName.value)) {
        ElMessage.warning('真实姓名包含特殊字符，请重新输入')
        return
      }



      if (userTrueName.value != undefined && userTrueName.value != null) {
        params.userTrueName = userTrueName.value.trim()
      }
      if (userNickNameInput.value != undefined && userNickNameInput.value != null) {
        params.userNickName = userNickNameInput.value.trim()
      }

      proxy.$post('v3/supplier/channel/user/updateInfo', params).then(res => {
        if (res.state == 200) {
          ElMessage.success(res.msg)
          getInitData()
        } else {
          ElMessage.warning(res.msg)
        }
      })
    }

    watch(year, () => {
      //监听设置的年，如果是现在的年份，则月和天不会超过今天的年月日
      let time = new Date()
      if (year.value == time.getFullYear()) {
        dayArr.value = dayArr.value.filter(item => item <= time.getDate())
        monthArr.value = monthArr.value.filter(
          item => item <= time.getMonth() + 1
        )
      } else {
        dayArr.value = Array.from({ length: d }, (v, k) => k).map(
          item => item + 1
        ) //生成当月天数数组
        monthArr.value = Array.from({ length: 12 }, (v, k) => k).map(
          item => 12 - item
        ) //生成当月的月数
      }
    })

    watch(month, () => {
      let time = new Date()
      d = new Date(year.value, month.value, 0).getDate()
      dayArr.value = Array.from({ length: d }, (v, k) => k).map(
        item => item + 1
      ) //生成当月天数数组
      if (
        year.value == time.getFullYear() &&
        month.value == time.getMonth() + 1
      ) {
        dayArr.value = dayArr.value.filter(item => item <= time.getDate())
      } else {
        dayArr.value = Array.from({ length: d }, (v, k) => k).map(
          item => item + 1
        ) //生成当月天数数组
      }
    })

    onMounted(() => {
      getInitData()
    })
    return {
      L,
      userNameInput,
      userNickNameInput,
      sex,
      yearArr,
      year,
      monthArr,
      month,
      dayArr,
      day,
      avatar,
      memberInfoSave,
      changepic,
      tempSrc,
      userTrueName
    }
  }
}
</script>
<style lang="scss">
@import '../../style/member/info.scss';

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
