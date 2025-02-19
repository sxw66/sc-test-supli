/*
 * @Author: your name
 * @Date: 2020-12-25 19:22:45
 * @LastEditTime: 2024-09-19 20:23:48
 * @LastEditors: cuihaopeng cuihaopeng@slodon.cn
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/router/index.js
 */
import { createRouter, createWebHistory } from 'vue-router'
import { sldStatEvent, updateStatCommonProperty } from "../utils/stat.js";
import { apiUrl } from '../utils/config'
import diyStyle from '../diyStyle';
// import { useAuth } from '../utils/hooks.js';

const routes = [{
	path: '/',
	name: 'Home',
	component: () => import(/* webpackChunkName: "home" */ '../views/home/Home'),
	children: [
		{
			path: '/',
			name: 'HomeIndex',    //首页
			component: () => import(/* webpackChunkName: "home" */ '../views/home/Index'),
		},
		{
			path: '/topic',
			name: 'Topic',   //专题页
			component: () => import(/* webpackChunkName: "home" */ '../views/home/Topic'),
		}
		,
		{
			path: '/coupon',
			name: 'CouponCenter',   //领劵中心
			component: () => import(/* webpackChunkName: "home" */ '../views/home/couponCenter'),
		}
	],
},
{
	path: '/index',
	redirect: '/',
},
{
	path: '/goods',
	name: 'Goods', //商品模块
	component: () => import(/* webpackChunkName: "home" */ '../views/goods/Header'),
	children: [
		{
			path: 'category',
			name: 'GoodsCategory',//商品分类页面
			component: () => import(/* webpackChunkName: "home" */ '../views/goods/Category'),
		},
		{
			path: 'list',
			name: 'GoodsList',
			component: () => import(/* webpackChunkName: "home" */ '../views/goods/GoodsList'),
		},
		{
			path: '/brand',
			name: 'Brand', //品牌中心
			component: () => import(/* webpackChunkName: "home" */ '../views/goods/Brand')
		},
	]
},
{
	path: '/goods',
	name: 'GoodsDetail',//商品详情页头部
	component: () => import(/* webpackChunkName: "home" */ '../views/goods/GoodsDetailHeader'),
	redirect: '/goods/detail',
	children: [
		{
			path: 'detail',
			name: 'GoodsDetails',//商品详情页
			component: () => import(/* webpackChunkName: "home" */ '../views/goods/GoodsDetail'),
		}
	]
},
{
	path: '/member',
	name: 'Member',
	component: () => import(/* webpackChunkName: "home" */ '../views/member/Common'),
	redirect: '/member/index',
	children: [
		{
			path: '/member/index',
			name: 'MemberIndex',    //个人中心
			component: () => import(/* webpackChunkName: "home" */ '../views/member/Index'),

		},
		{
			path: '/member/collect/:type',
			name: 'MemberCollect',    //我的收藏
			component: () => import(/* webpackChunkName: "home" */ '../views/member/Collect'),

		},
		{
			path: '/member/footprint',
			name: 'MemberFootprint',    //我的足迹
			component: () => import(/* webpackChunkName: "home" */ '../views/member/Footprint'),

		},
		{
			path: '/member/address/list',
			name: 'memberAddressList',    //收货地址列表
			component: () => import(/* webpackChunkName: "home" */ '../views/member/AddressList'),

		},
		{
			path: '/member/order/list',
			name: 'memberOrderList',    //我的订单
			component: () => import('../views/member/order/List'),

		},
		{
			path: '/member/order/refund/apply', //申请退款
			name: 'ApplyRefund',
			component: () => import('../views/member/order/ApplyRefund'),

		}, {
			path: '/member/order/refund/detail', //售后详情
			name: 'RefundDetail',
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/RefundDetail'),

		},
		{
			path: '/member/order/evaluation',
			name: 'MemberOrderEvaluation',    //评价订单列表
			component: () => import('../views/member/order/Evaluation'),

		},
		{
			path: '/member/order/aftersales', //售后列表
			name: 'AfterSalesList',
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/AfterSalesList'),

		},
		{
			path: '/member/order/logistics', //填写物流信息
			name: 'Logistics',
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/Logistics'),

		}, {
			path: '/member/coupon',
			name: 'MemberCoupon',    //我的优惠卷
			component: () => import('../views/member/money/Coupon'),

		},


		{
			path: '/member/account',
			name: 'MemberAccount',    //账号安全
			component: () => import('../views/member/center/Account'),

		},
		{
			path: '/member/phone',
			name: 'MemberPhoneMange',    //手机号管理
			component: () => import('../views/member/center/PhoneMange'),

		},
		{
			path: '/member/email',
			name: 'memberEmailMange',    //邮箱管理
			component: () => import('../views/member/center/EmailMange'),

		},
		{
			path: '/member/pwd/login',
			name: 'MemberLoginPassword',    //登陆密码
			component: () => import('../views/member/center/LoginPassword'),

		},

		{
			path: '/member/info',
			name: 'MemberInfo',    //会员信息
			component: () => import('../views/member/Info'),

		},
		// {
		// 	path: '/member/seller',
		// 	name: 'MemberSeller',    //供应商注册
		// 	component: () => import('../views/member/seller/index'),

		// }
	]
},
{
	path: '/member/order/evaluate',
	name: 'OrderEvaluate',//订单评价
	component: () => import(/* webpackChunkName: "home" */ '../views/member/Header'),
	redirect: '/member/order/evaluate',
	children: [
		{
			path: '/member/order/evaluate',
			name: 'memberOrderEvaluate',    //订单评价
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/Evaluate'),

		},
	]
},
{
	path: '/msg',
	name: 'Msg',
	component: () => import(/* webpackChunkName: "home" */ '../views/msg/Header'),//消息中心公共部分
	redirect: '/msg/list',
	children: [
		{
			path: 'list',
			name: 'MsgList',    //消息列表
			component: () => import(/* webpackChunkName: "home" */ '../views/msg/List'),

		},
		{
			path: 'setting',
			name: 'MsgSetting',    //消息接收设置
			component: () => import(/* webpackChunkName: "home" */ '../views/msg/Setting'),

		},
	]
},
{
	path: '/member/order/detail',
	name: 'OrderDetail',//订单详情
	component: () => import(/* webpackChunkName: "home" */ '../views/member/Header'),
	redirect: '/member/order/detail',
	children: [
		{
			path: '/member/order/detail',
			name: 'memberOrderDetail',    //订单详情
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/detail'),

		},
	]
},
{
	path: '/member/order/evaluate',
	name: 'OrderEvaluate',//订单评价
	component: () => import(/* webpackChunkName: "home" */ '../views/member/Header'),
	redirect: '/member/order/evaluate',
	children: [
		{
			path: '/member/order/evaluate',
			name: 'memberOrderEvaluate',    //订单评价
			component: () => import(/* webpackChunkName: "home" */ '../views/member/order/Evaluate'),

		},
	]
},
// {
// 	path: '/login',
// 	name: 'login',//用户登录页面
// 	component: () => import(/* webpackChunkName: "home" */ '../views/member/login/Index'),
// },
// {
// 	path: '/register',
// 	name: 'register',//用户注册页面
// 	component: () => import(/* webpackChunkName: "home" */ '../views/member/login/Register'),
// },
{
	path: '/pwd/forget',
	name: 'ForgetPassword',//用户找回密码页面
	component: () => import(/* webpackChunkName: "home" */ '../views/member/login/ForgetPassword'),
},

{
	path: '/agreement',
	name: 'agreement',//用户注册协议页面
	component: () => import(/* webpackChunkName: "home" */ '../views/member/login/Agreement'),
},
{
	path: '/bindMobile',
	name: 'bindMobile',//用户注册协议页面
	component: () => import(/* webpackChunkName: "home" */ '../views/member/login/bindMobile'),
},

{
	path: '/buy',
	name: 'Buy',//下单页入口
	component: () => import(/* webpackChunkName: "home" */ '../views/buy/Header'),
	children: [
		{
			path: 'confirm',
			name: 'BuyConfirmOrder',//下单页面
			component: () => import('../views/buy/ConfirmOrder'),

		},
		{
			path: 'pay',
			name: 'Pay',//支付页面
			component: () => import('../views/buy/pay'),

		},
	]
},
{
	path: '/article',
	name: 'article',//文章页面
	component: () => import(/* webpackChunkName: "home" */ '../views/article/article'),
},
{
	path: '/store',
	name: 'store',
	component: () => import(/* webpackChunkName: "home" */ '../views/store/Header'),
	children: [
		{
			path: 'list',
			name: 'StoreList',//供应商列表模块
			component: () => import(/* webpackChunkName: "home" */ '../views/store/storeList'),
		}
	]
}, {
	path: '/store/detail',
	name: 'StoreDetail',//供应商模块
	component: () => import(/* webpackChunkName: "home" */ '../views/store/StoreHeader'),
	redirect: '/store/index',
	children: [
		{
			path: '/store/index',
			name: 'storeIndex',//供应商首页
			component: () => import(/* webpackChunkName: "home" */ '../views/store/Index'),
		},
		{
			path: '/store/goods',
			name: 'storeGoods',//供应商商品列表
			component: () => import(/* webpackChunkName: "home" */ '../views/store/GoodsList'),
		}
	]
}, {
	path: '/cart',
	name: 'Cart', //商品模块
	component: () => import(/* webpackChunkName: "home" */ '../views/cart/Header'),
	children: [
		{
			path: 'index',
			name: 'CartIndex',    //进货单页面
			component: () => import(/* webpackChunkName: "home" */ '../views/cart/CartIndex'),
		},
	]
},

{
	path: '/service',
	name: 'serviceChat',
	component: () => import('../views/service/chatPage'),
},
{
	path: '/redirect/channelSwitch',
	name: 'channelSwitch',
	component: () => import('../views/redirect/channelSwitch')
},
{
	path: '/404',
	name: 'errorPath',
	component: () => import('../views/404')
},
{
	path: '/:pathMatch(.*)',
	redirect: "/404"
}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

const setStyleBefore = diyStyle.getDiyStyleOnce()

// const { checkToken } = useAuth()
router.beforeEach(async (to, from, next) => {
	await setStyleBefore()
	// checkToken(to, next)
	next()
})

router.afterEach((to, from) => {
	let url = apiUrl.substring(0, apiUrl.length - 1);
	//商品详情页、供应商的页面需要单独统计，但是需要把pageUrl和referrerPageUrl先存进去
	let specialPages = [
		'/goods/detail',//商品详情页
		'/store/goods',//供应商首页
	];
	let statPvFlag = true;
	for (let i in specialPages) {
		if (specialPages[i].indexOf(to.path) > -1) {
			statPvFlag = false;
			break;
		}
	}

	if (!statPvFlag) {
		//不需要pv类型的统计
		updateStatCommonProperty({ pageUrl: url + to.path, referrerPageUrl: url + from.path });
	} else {
		setTimeout(() => {
			sldStatEvent({ behaviorType: 'pv', pageUrl: url + to.path, referrerPageUrl: url + from.path });
		}, 3000)
	}
})

export default router
