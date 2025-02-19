<template>
	<loginModel />
	<router-view />
</template>

<script>
import { onMounted, watch } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { title } from '@/utils/config'
import { useSystemSetting } from './utils/hooks';
import loginModel from '../src/components/LoginModel/index.vue'; // 登录弹框
import defaultImg from './assets/common_top_logo.png';
import defaultBgImg from './assets/login_bg.png';
import defaultForgetBg from './assets/forget_pwd_bg.png';
import defaultMemberTop from './assets/member/top_logo.png';
export default {
	name: 'App',
	components: {
	  loginModel,
	},
	setup () {
		const store = useStore()
		const route = useRoute()
		// const defaultImg = require('./assets/common_top_logo.png')
		// const defaultBgImg = require('./assets/login_bg.png')
		// const defaultForgetBg = require('./assets/forget_pwd_bg.png')
		// const defaultMemberTop = require('./assets/member/top_logo.png')
		// 获取系统配置信息
		const getSystemConfigInfo = async () => {
			let settingList = [
				"supplier_main_site_logo", "supplier_main_user_center_logo",
				"supplier_main_user_logon_bg",
				"supplier_pc_home_bottom_adv", "supplier_main_user_forget_password_bg",
				"basic_site_name", "basic_site_icp",
				"basic_site_copyright", "basic_site_technical_support",
				"platform_customer_service_name", "platform_customer_service_logo",
				"supplier_pc_browser_icon"
			]
			const result = await useSystemSetting.getSystemSetting(settingList)
			//下列字段如果没有值则使用默认的图片
			result.supplier_main_site_logo = result.supplier_main_site_logo || defaultImg
			result.supplier_main_user_logon_bg = result.supplier_main_user_logon_bg || defaultBgImg
			result.supplier_main_user_center_logo = result.supplier_main_user_center_logo || defaultMemberTop
			result.supplier_main_user_forget_password_bg = result.supplier_main_user_forget_password_bg || defaultForgetBg

			//监听路由, 商品详情使用商品名做title,其余都是basic_site_name做title
			watch(() => route.name, (nv) => {
				if (nv !== 'GoodsDetail') {
					if (result.basic_site_name) {
						document.title = result.basic_site_name
					} else {
						document.title = title
					}
				}
			}, { immediate: true })
			store.commit('updateConfigInfo', result);
			var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
			link.type = 'image/x-icon';
			link.rel = 'shortcut icon';
			link.href = result.supplier_pc_browser_icon ? result.supplier_pc_browser_icon : location.origin + '/favicon.ico';
			document.getElementsByTagName('head')[0].appendChild(link);
		};

		onMounted(() => {
			getSystemConfigInfo()
		})
		return{
			store,		
		}
	}

}
</script>

<style lang="scss">
@import "./style/reset.scss";
@import "./style/base.scss";

//放大镜位置
.mouse-cover-canvas {
	position: absolute;
	top: 173px !important;
	left: 740px !important;
}

// .el-checkbox {
// 	.el-checkbox__input {

// 		&.is-checked,
// 		&.is-indeterminate {
// 			.el-checkbox__inner {
// 				border-color: var(--color_main);
// 				background-color: var(--color_main);
// 			}
// 		}

// 		&.is-focus {
// 			.el-checkbox__inner {
// 				border-color: var(--color_main);
// 			}
// 		}

// 		.el-checkbox__inner {
// 			&:hover {
// 				border-color: var(--color_main);
// 			}
// 		}

// 		&+.el-checkbox__label {
// 			color: var(--color_main);
// 		}
// 	}
// }
</style>
