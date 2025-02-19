import { get, post } from './request'
import { onMounted, ref, computed, unref } from 'vue'
import store from '../store'
// import { ElMessageBox } from 'element-plus'

//集中处理的获取系统配置的hook
const useSettingFunc = () => {

	let funcSet = []
	let argsSet = []
	let requestCount = 0
	let timer = null

	const execSystemSetting = () => {
		get("v3/system/common/getSettings", { names: argsSet.toString() }).then(res => {
			let obj = {}
			for (let i in argsSet) {
				obj[argsSet[i]] = res.data[i]
			}
			funcSet.forEach(({ resolve }) => {
				resolve(obj)
			})
		}).catch(() => {
			funcSet.forEach(({ reject }) => {
				reject({})
			})
		}).finally(() => {
			argsSet = []
			funcSet = []
		})
	}

	const getSystemSetting = (args) => {
		argsSet = Array.from(new Set([...argsSet, ...args]))
		clearTimeout(timer)
		return new Promise((resolve, reject) => {
			funcSet = funcSet.concat({ resolve, reject })
			timer = setTimeout(() => {
				if (requestCount === 1) {
					execSystemSetting()
				} else if (requestCount > 1) {
					execSystemSetting()
				}
				requestCount = 0
			}, 100)
			requestCount++;
		})
	}

	return {
		getSystemSetting
	}
}
export const useSystemSetting = useSettingFunc()




//使用图形验证码
export const useImageCode = () => {
	const showCodeImg = ref('')
	const imgCode = ref('')
	const imgCodeKey = ref('')

	//获取图形验证码
	const getImgCode = () => {
		get('v3/captcha/common/getCaptcha', {}).then(res => {
			if (res.state == 200) {
				showCodeImg.value = 'data:image/png;base64,' + res.data.captcha
				imgCodeKey.value = res.data.key
			}
		})
	}
	onMounted(getImgCode)
	return { showCodeImg, imgCode, getImgCode, imgCodeKey }
}



export const useLadderPrice = (rawString, initalNum) => {

	const number = ref(initalNum)

	const ladderPriceArr = computed(() => {
		if (rawString) {
			let arr = rawString.split(",")
			return arr.map(a => a.split('-'))
		} else {
			return []
		}
	})

	const ladderCurrent = computed(() => {
		let index = 0
		unref(ladderPriceArr).forEach((ar, indx) => {
			if (number.value >= Number(ar[0])) {
				index = indx
			}
		});
		return index
	})


	const setNumber = (_number) => {
		number.value = _number
	}


	const getCurrentLadderPrice = () => {
		if (unref(ladderPriceArr).length) {
			return unref(ladderPriceArr)[unref(ladderCurrent)][1]
		} else {
			return 0
		}
	}

	return {
		ladderPriceArr,
		ladderCurrent,
		setNumber,
		getCurrentLadderPrice
	}
}


//身份验证（登录页，供应商token转换，首页，供应商首页 不校验）
export const useAuth = () => {
	const exclude = ['login', 'register','channelSwitch', 'ForgetPassword', 'HomeIndex', 'Home', 'storeIndex']
	const isUnCheckPath = (to) => exclude.includes(to.name)
	const checkToken = (to, next) => {
		const { accessToken } = store.getters

		if (isUnCheckPath(to)) {
			next()
			return
		}
		if (!accessToken) {
			next({ name: "login", replace: true });
			return
		}
		next()
	}

	return { checkToken }

}



//用于校验订单
export const useOrderCheck = () => {
	let checkParams = {}
	const checkLoading = ref(false)

	const requireModal = (state) => {
		let stateset = [7, 4, 3, 2, 1, 6]
		return stateset.includes(state)
	}

	const setCheckInfo = (param) => {
		checkParams = param
	}
	const orderCheck = async () => {
		checkLoading.value = true
		const res = await post('v3/supplier/channel/orderOperate/check', checkParams, 'json')
		if (res.state == 200 || res.state == 267) {
			return Promise.resolve(res)
		} else {

			// ElMessageBox({
			// 	title: '提示',
			// 	message: res.msg,
			// 	showCancelButton: false,
			// 	confirmButtonText: '确定',
			// 	type: 'warning',
			// 	confirmButtonClass: 'messageBox_custom_button_confirm',
			// 	cancelButtonClass: 'messageBox_custom_button_cancel',
			// })

			return Promise.reject(res.msg)
		}
	}

	return {
		checkLoading,
		setCheckInfo,
		orderCheck,
		requireModal
	}
}
/**
 * 验证码倒计时
 * @param initailCount 初始化时间
 * @returns 
 */
export const countDown = (initailCount) => {
	const countTime = ref(0);
	const countTimeEmail = ref(0);
  
	let timer = null;
	let timerEmail = null;
	const tmpFunction = ref();
	const tmpFunctionEmail = ref();
  
	const timeCount = () => {
	  if (countTime.value == 0) {
		tmpFunction.value && tmpFunction.value();
		clearTimeout(Number(timer));
		timer = null;
	  } else {
		countTime.value--;
		timer = setTimeout(timeCount, 1000);
	  }
	};
  
	const timeCountEmail = () => {
	  if (countTimeEmail.value == 0) {
		tmpFunctionEmail.value && tmpFunctionEmail.value();
		clearTimeout(Number(timerEmail));
		timerEmail = null;
	  } else {
		countTimeEmail.value--;
		timerEmail = setTimeout(timeCountEmail, 1000);
	  }
	};
  
	const startDown = (callback) => {
	  tmpFunction.value = callback;
	  countTime.value = initailCount || 60;
	  timeCount();
	};
	
	const startDownEmail = (callback) => {
	  tmpFunctionEmail.value = callback;
	  countTimeEmail.value = initailCount || 60;
	  timeCountEmail();
	};
  
	const setCount = (count) => {
	  countTime.value = count;
	};
	
	const setCountEmail = (count) => {
	  countTimeEmail.value = count;
	};
  
	return {
	  startDown,
	  setCount,
	  countTime,
	  startDownEmail,
	  setCountEmail,
	  countTimeEmail,
	};
  }








