/*
 * @Author: your name
 * @Date: 2021-01-08 21:09:07
 * @LastEditTime: 2021-01-15 11:36:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/store/index.js
 */
import Vuex from 'vuex';
import { getLocalStorageObject, getLocalStorageStr } from '../utils/common';
import { updateStatCommonProperty } from '../utils/stat';

export default Vuex.createStore({
	state: {
		loginFlag: getLocalStorageStr('loginFlag') ? true : false,
		memberInfo: getLocalStorageObject('memberInfo'),//用户信息
		cartListData: getLocalStorageObject('cartListData'), //进货单信息
		openScreenInfo: getLocalStorageObject('openScreenInfo'), //进货单信息
		configInfo: getLocalStorageObject('configInfo'), //系统配置信息
		chatBaseInfo: getLocalStorageObject('chatBaseInfo') ? getLocalStorageObject('chatBaseInfo') : {},//聊天的基本信息，包含会员id、头像、供应商id、头像
		memberConfig: {},
		x_diyStyle: getLocalStorageObject('x_diyStyle') || {},
		tokenInfo: getLocalStorageObject('tokenInfo'),
		curLang: getLocalStorageStr('curLang') || 'pt',
		BigPictureUrl:'',
		// 存储时间戳
		timestamp: null,
		// 当前登录状态
		// 0 未登录
		// 1 登录弹框
		// 2 注册弹框
		// 3 忘记密码弹框
		loginState: 0,
	},

	getters: {
		accessToken (state) {
			return state.tokenInfo?.access_token
		},
		refreshToken (state) {
			return state.tokenInfo?.refresh_token
		},
		 // 获取登录状态
		getLoginState(state) {
		    return state.loginState;
		}
	},

	mutations: {
		// 更新登录状态
		updateLoginState(state, loginStatus) {
			state.loginState = loginStatus;
		},
		// 用于设置时间戳
		setTimestamp(state, timestamp) {
		   state.timestamp = timestamp;
		},
		// 鼠标移入更新商品详情设置封面图 URL
		// 【ID1000128】切换商品主图查看大图显示
		setMainImageUrl(state,url) {
		   state.BigPictureUrl = url;
		},
		//更新用户信息
		updateMemberInfo (state, payload) {
			state.memberInfo = payload;
			if (payload.userId != undefined && payload.userId) {
				state.loginFlag = true;
				updateStatCommonProperty({ userId: payload.userId });//登录成功需要更新统计里面的会员id
			} else {
				state.loginFlag = false;
			}
			localStorage.setItem('memberInfo', JSON.stringify(state.memberInfo));
			localStorage.setItem('loginFlag', state.loginFlag)
		},
		//更新进货单信息
		updateCartListData (state, payload) {
			if (payload != undefined) {
				state.cartListData = payload;
			} else {
				state.cartListData = {};
			}
			localStorage.setItem('cartListData', JSON.stringify(state.cartListData));
		},
		//更新开屏图信息
		updateOpenScreenInfo (state, payload) {
			state.openScreenInfo = payload;
			localStorage.setItem('openScreenInfo', JSON.stringify(state.openScreenInfo));
		},
		//更新系统配置信息
		updateConfigInfo (state, payload) {
			state.configInfo = payload;
			localStorage.setItem('configInfo', JSON.stringify(state.configInfo));
		},
		//清空vuex里所有数据
		clearAllData (state) {
			state.memberInfo = {};
			state.loginFlag = false;
			state.chatBaseInfo = {}
			state.loginState = 0;
			state.timestamp = null;
			state.tokenInfo = {};
			localStorage.removeItem('memberInfo')
			localStorage.removeItem('loginFlag')
			localStorage.removeItem('chatBaseInfo')
			localStorage.removeItem('addressId')
			localStorage.removeItem('tokenInfo')
			updateStatCommonProperty({ userId: 0 });//退出登录需要将会员id置为0
		},
		//保存聊天的会员id、会员头像，供应商id、供应商头像
		saveChatBaseInfo (state, payload) {
			state.chatBaseInfo = payload
			//缓存聊天的基本信息
			localStorage.setItem('chatBaseInfo', JSON.stringify(state.chatBaseInfo))
		},

		clearCartStorage (state) {
			state.cartListData = {}
			localStorage.removeItem('cartListData')
			sessionStorage.clear()
		},

		saveDiyStyle (state, payload) {
			state.x_diyStyle = payload
			localStorage.setItem('x_diyStyle', JSON.stringify(state.x_diyStyle))
		},

		saveMemberConfig (state, payload) {
			let { memberConfig } = state
			state.memberConfig = Object.assign({}, memberConfig, payload)
		},

		loginUpdate (state, payload) {
			state.tokenInfo = Object.assign({}, state.tokenInfo, payload)
			state.tokenInfo.time = new Date().getTime().toString()
			localStorage.setItem('tokenInfo', JSON.stringify(state.tokenInfo))
		}

	},

	actions: {

	}
})
