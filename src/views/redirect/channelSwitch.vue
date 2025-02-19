<template>
	<div class="channel_switch">

	</div>
</template>

<script>
import { getCurrentInstance, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
	props: {},
	components: {},
	setup () {
		const { proxy } = getCurrentInstance()
		const L = proxy.$getCurLanguage()
		const store = useStore()
		const router = useRouter()

		const checkToken = () => {
			const refreshTokenTmp = sessionStorage.getItem('rfk_tmp')
			if (!refreshTokenTmp) {
				router.replace('/login')
			} else {
				switchLogin()
			}
		}

		const getMemberInfo = () => {
			proxy.$get('v3/supplier/channel/user/getInfo').then(res => {
				if (res.state == 200) {
					let memberInfo = Object.assign({}, store.state.memberInfo, res.data);
					store.commit("updateMemberInfo", memberInfo); //将进货单数据存储到vuex的store中
					router.replace('/')
				} else {
					ElMessage.error(res.msg)
					router.replace('/login')
				}
			})
		}

		const switchLogin = () => {
			const refreshToken = sessionStorage.getItem('rfk_tmp')
			proxy.$post('v3/channelLogin/oauth/switchChannel', {
				refreshToken
			}).then(res => {
				sessionStorage.removeItem('rfk_tmp')
				if (res.state == 200) {
					store.commit('loginUpdate', res.data.data)
					getMemberInfo()
				} else {
					ElMessage.error(res.msg)
					router.replace('/login')
				}
			}).catch(console.log)
		}


		onBeforeMount(() => {
			checkToken()
		})

		return {
			L
		}
	},
}
</script>

<style lang='scss' scoped></style>
