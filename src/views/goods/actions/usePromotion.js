import { onUnmounted, ref, unref, computed } from "vue"
import { getCurLanguage } from '@/utils/common'
import { get } from '@/utils/request'
const L = getCurLanguage()


const formatPreTime = time => {
	let op = new Date(time)
	let year = op.getFullYear()
	let month = op.getMonth() + 1
	let day = op.getDate()
	let hour = op.getHours()
	let minute = op.getMinutes()
	let part1 = [year, month, day]
		.map(i => (i.toString().length < 2 ? `0${i}` : i))
		.join('-')
	let part2 = [hour, minute]
		.map(i => (i.toString().length < 2 ? `0${i}` : i))
		.join(':')
	return part1 + ' ' + part2
}


const promotionBannerInstance = ref()
const promotionInfo = ref({})
const promotionType = ref(0)

const promotionShowPrice = computed(() => {
	if ((unref(promotionType) == 102 && unref(promotionInfo).state == 1) || unref(promotionInfo).state == 2) {
		return unref(promotionInfo).showPrice
	}
	return 0
})

const promotionShowPriceBefore = computed(() => {
	if ((unref(promotionType) == 105 && unref(promotionInfo).state == 0) || unref(promotionInfo).state == 1) {
		return unref(promotionInfo).showPrice
	}
	return 0
})


const promotionInfoApi = {
	102: 'v3/supplier/channel/spell/detail',
	103: 'v3/supplier/channel/preSell/detail',
	104: 'v3/supplier/channel/seckill/detail',
	105: 'v3/supplier/channel/ladder/group/detail'
}

//信息处理---拼团
const promotion_pin = () => {
	unref(promotionInfo).promotionName = L['拼团']
	unref(promotionInfo).showPrice = unref(promotionInfo).spellPrice
	unref(promotionInfo).showStock = unref(promotionInfo).spellStock


	let now = new Date()
	let startTime = new Date(unref(promotionInfo).startTime)
	if (now < startTime) {
		let countTime = (startTime.getTime() - now.getTime()) / 1000
		unref(promotionBannerInstance).startCountDownFull(countTime)
	} else {
		let countTime = unref(promotionInfo).distanceEndTime
		unref(promotionBannerInstance).startCountDownFull(countTime)
	}
}


//信息处理---预售
const promotion_presale = () => {
	unref(promotionInfo).promotionName = L['预售']
	unref(promotionInfo).showPrice = unref(promotionInfo).presellPrice
	unref(promotionInfo).showStock = unref(promotionInfo).presellStock
	let preStartDate = new Date(unref(promotionInfo).startTime)
	let preEndDate = new Date(unref(promotionInfo).endTime)
	let countTime = 0
	let now = new Date()
	unref(promotionInfo).endTime = formatPreTime(new Date(unref(promotionInfo).endTime))
	unref(promotionInfo).startTime = formatPreTime(new Date(unref(promotionInfo).startTime))
	if (now > preStartDate && now < preEndDate) {
		unref(promotionInfo).state = 2 //活动进行中
		countTime = unref(promotionInfo).distanceEndTime
		unref(promotionBannerInstance).startCountDownFull(countTime)
	} else if (now < preStartDate) {
		unref(promotionInfo).state = 1 //活动未开始
		countTime = (new Date(unref(promotionInfo).startTime).getTime() - now.getTime()) / 1000
		unref(promotionBannerInstance).startCountDownFull(countTime)
	} else if (now > preEndDate) {
		unref(promotionInfo).state = 3 //活动已结束
	}
}

//信息处理---秒杀
const promotion_seckill = () => {
	unref(promotionInfo).promotionName = L['秒杀']
	unref(promotionInfo).showPrice = unref(promotionInfo).seckillPrice
	unref(promotionInfo).showStock = unref(promotionInfo).seckillStock


	let countTime = 0
	if (unref(promotionInfo).state == 1 || unref(promotionInfo).state == 2) {
		countTime = unref(promotionInfo).distanceEndTime
		unref(promotionBannerInstance).startCountDownFull(countTime)
	}
}

//信息处理---阶梯团
const promotion_ladder = () => {
	unref(promotionInfo).promotionName = L['阶梯']
	unref(promotionInfo).showPrice = unref(promotionInfo).currentPrice
	unref(promotionInfo).showStock = unref(promotionInfo).ladderStock

	let now = new Date()
	let countTime = 0
	let startTime = new Date(unref(promotionInfo).startTime)
	if (now < startTime) {
		countTime = (startTime.getTime() - now.getTime()) / 1000
		unref(promotionBannerInstance).startCountDownFull(countTime)
		unref(promotionInfo).state = 1
	} else {
		countTime = unref(promotionInfo).distanceEndTime
		unref(promotionBannerInstance).startCountDownFull(countTime)
		unref(promotionInfo).state = 2
	}
}

//信息处理--综合
const getPromotionInfo = (params) => {
	promotionType.value = params.promotionType
	const instance = get(promotionInfoApi[params.promotionType], params).then(res => {
		if (res.state == 200) {
			promotionInfo.value = res.data
			switch (params.promotionType) {
				case 102: {
					promotion_pin()
					break
				}
				case 103: {
					promotion_presale()
					break
				}
				case 104: {
					promotion_seckill()
					break
				}
				case 105: {
					promotion_ladder()
					break
				}
			}
		}
		return res
	})

	return instance
}



export const usePromotion = () => {

	const registerBanner = (_instance) => {
		promotionBannerInstance.value = _instance
	}

	onUnmounted(() => {
		promotionBannerInstance.value = null
	})

	return [registerBanner, { getPromotionInfo, promotionInfo, promotionShowPrice, promotionShowPriceBefore }]

}





