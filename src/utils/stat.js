//封装的关于统计的方法
import { post } from './request'
import { base64Encode } from './common.js'
import { gdKey, gdSecurityCode } from './config.js'
import AMapLoader from '@amap/amap-jsapi-loader';

/**
 * 初始化统计
 * @params showDebug Boolean 是否开启统计日志，默认false 不开启
 * @zjf-2021-06-27
 */
export function initStat (showDebug = false, initStatCommonProperty) {
	const sldStatCommonProperty = localStorage.getItem('sldStatCommonProperty')
	const combineProperty = sldStatCommonProperty ? { ...initStatCommonProperty, ...JSON.parse(sldStatCommonProperty) } : initStatCommonProperty
	localStorage.sldStatShowDebug = showDebug;
	//获取udid
	let uuid = ''
	if (sldStatCommonProperty && JSON.parse(sldStatCommonProperty).uuid) {
		uuid = JSON.parse(sldStatCommonProperty).uuid
	} else {
		uuid = getUUID();
	}

	initStatCommonProperty = {
		...combineProperty,
		uuid: uuid,
	}
	updateStatCommonProperty(initStatCommonProperty)
}

/**
 * 设置/更新统计的公共属性
 * @params data Object 要更新的属性数据
 * @zjf-2021-06-27
 */
export function updateStatCommonProperty (data) {
	let target = {};
	const value = localStorage.getItem('sldStatCommonProperty');
	if (value) {
		target = JSON.parse(value);
	}
	target = {
		...target,
		...data
	}; //更新或者新增统计的公共属性
	localStorage.sldStatCommonProperty = JSON.stringify(target);
}

/**
 * 同步获取指定key对应的内容
 * @params key 指定的缓存key
 * @zjf-2021-06-27
 */
export function getStatStorage (key) {
	let target = {};
	const value = localStorage.getItem(key);
	if (value) {
		target = JSON.parse(value);
	}
	return target;
}

/**
 * 获取uuid
 * 如：1624819897644-1389918-0ed8161319cedb-22991203
 * Math.random().toString(16).replace('.', '')：0～1的随机数以十六进制显示，并去掉小数点，如：0.f03fb618bf531，并去掉小数点
 * @zjf-2021-06-27
 */
export function getUUID () {
	return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') +
		'-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
}

/**
 * 获取地理位置信息,各个终端分别获取
 * @zjf-2021-06-27
 */
export async function getLocation () {
	let locationData = {
		cityCode: '', //城市编码
		cityName: '', //城市名称
		location: '', //经纬度，英文逗号分隔
		provinceCode: '', //	省份编码
		provinceName: '', //	省份名称
	};

	locationData = await getH5Location(locationData);

	return locationData;
}

/**
 * 获取H5的地理位置
 * @zjf-2021-06-28
 */
export function getH5Location (locationData) {

	//自2021年12月02日升级，升级之后所申请的 key 必须配备安全密钥 一起使用
	//配置安全密钥的固定写法
	window._AMapSecurityConfig = {
		securityJsCode: gdSecurityCode,
	}
	return new Promise(func => {
		//普通h5获取定位
		AMapLoader.load({
			"key": gdKey,              // 申请好的Web端开发者Key，首次调用 load 时必填
			"plugins": ['AMap.Geolocation'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
		}).then((AMap) => {
			let geolocation = new AMap.Geolocation({
				enableHighAccuracy: false, //是否使用高精度定位，默认:true
				timeout: 10000, //超过5秒后停止定位，默认：无穷大
			});
			geolocation.getCityInfo((status, result) => { //只能获取当前用户所在城市和城市的经纬度
				if (status == "complete") {
					locationData.provinceName = result.province.substring(0, 2)
					locationData.location = result.center.join(',');
					locationData.citycode = result.citycode;
					locationData.cityName = result.city
					func(locationData);
				} else {
					console.info('获取地理位置信息出错，出错信息为：', result);
					func(locationData);
				}
			})
		}).catch(e => {
			console.log(e);
		})
	})
}

/**
 * 获取浏览器信息
 * @zjf-2021-06-27
 */
export function getSystemInfo () {

}

/**
 * 统计事件
 * @params params Object 参数
 * @zjf-2021-06-27
 */
export async function sldStatEvent (data) {
	//将data和公共属性合并得到最终要发送的数据
	let sldStatCommonProperty = getStatStorage('sldStatCommonProperty');

	let targetParams = {
		...sldStatCommonProperty,
		...data
	};
	//没有位置信息
	//获取位置信息
	if (!targetParams.location) {
		//获取位置信息
		let location = await getLocation();
		targetParams = {
			...targetParams,
			...location
		};
		updateStatCommonProperty(location)
	}
	//日志开启的话需要打印数据
	const sldStatShowDebug = localStorage.getItem('sldStatShowDebug');
	if (sldStatShowDebug == 'true') {
		console.info('统计传输数据: ', targetParams);
	}
	//发送请求
	post("v3/statistics/front/member/behavior/save", { u: base64Encode(JSON.stringify(targetParams)) }).then();
}
