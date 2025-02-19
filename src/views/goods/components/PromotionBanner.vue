<template>
	<!-- 促销活动信息 -->
	<section>
		<!-- 预售 -->
		<div :class="{ act_banner: true, pre_not: promotionInfo.state == 1, pre_do: promotionInfo.state == 2 }"
			v-if="promotionType == 103 && promotionInfo.state != 3">
			<div class="title">
				{{ promotionInfo.type == 1 ? L['定金预售'] : L['全款预售'] }}
			</div>
			<div class="time_title">
				{{ promotionInfo.state == 1 ? L['距离开始剩余：'] : L['距离结束剩余：'] }}
			</div>
			<div class="time">
				<div class="time">
					<span v-if="time.day" class="countDown0">{{ time.day }}{{ L['天'] }}</span>
					<span class="countDown1 countDown1_presel">{{ time.hours
						}}</span>
					<span class="countDown2 ">:</span>
					<span class="countDown1 countDown1_presel">{{ time.minutes
						}}</span>
					<span class="countDown2">:</span>
					<span class="countDown1 countDown1_presel">{{ time.seconds
						}}</span>
				</div>
			</div>
			<div class="desc" v-show="promotionInfo.type == 1">
				<span>
					{{ L['预售定金R$'] }}
					{{ $formatMoneyNum(promotionInfo.firstMoney || 0) }}
				</span>
				<span v-if="promotionInfo.firstExpand > 0">
					,{{ L['可抵R$'] }}
					{{ $formatMoneyNum(promotionInfo.firstExpand || 0) }}
				</span>
			</div>
		</div>
		<!-- 拼团 -->
		<div :class="{
				act_banner: true,
				pin_not: promotionInfo.state == 0,
				pin_do: promotionInfo.state == 1
			}" v-if="promotionType == 102">
			<div class="title">{{ L['拼团'] }}</div>
			<div class="time_title">
				{{
				promotionInfo.state == 0
					? L['距离开始剩余：']
					: L['距离结束剩余：']
			}}
			</div>
			<div class="time">
				<span v-if="time.day" class="countDown0">{{ time.day }}{{
				L['天']
			}}</span>
				<span class="countDown1 countDown1_act">{{ time.hours }}</span>
				<span class="countDown2">:</span>
				<span class="countDown1 countDown1_act">{{ time.minutes }}</span>
				<span class="countDown2">:</span>
				<span class="countDown1 countDown1_act">{{ time.seconds }}</span>
			</div>
			<div class="desc">
				<div class="pintuan_left_num">
					<img src="@/assets/activity/pintuan.png" />
					<span>{{ promotionInfo.requiredNum }}{{
				L['人团']
			}}</span>
				</div>
				<div class="group_return_regiment" v-if="promotionInfo.leaderPrice != 0">
					{{ L[' 团长优惠价R$'] }}{{ $formatMoneyNum(promotionInfo.leaderPrice || 0) }}
				</div>
			</div>
		</div>
		<!-- 秒杀 -->
		<div :class="{
				act_banner: true,
				sec_not: promotionInfo.state == 1,
				sec_do: promotionInfo.state == 2
			}" v-if="promotionType == 104">
			<div class="title">{{ L['秒杀'] }}</div>
			<div class="time_title">
				{{
				promotionInfo.state == 1
					? L['距离开始剩余：']
					: L['距离结束剩余：']
			}}
			</div>
			<div class="time">
				<span v-if="time.day" class="countDown0">{{ time.day }}{{
				L['天']
			}}</span>
				<span class="countDown1 countDown1_seck">{{ time.hours }}</span>
				<span class="countDown2">:</span>
				<span class="countDown1 countDown1_seck">{{ time.minutes
					}}</span>
				<span class="countDown2">:</span>
				<span class="countDown1 countDown1_seck">{{ time.seconds
					}}</span>
			</div>
			<div class="desc">
				<div class="SorC_remind" @click="sorcRemind" v-show="promotionInfo.state == 1">
					<dynaIcon width="20" height="20" src="activity/clock.png" v-if="!promotionInfo.isRemind"
						color="--color_seckill_main">
					</dynaIcon>
					<img src="@/assets/activity/clock_grey.png" alt="" v-if="promotionInfo.isRemind" />
					<div :class="{ remind_on: !promotionInfo.isRemind, remind_off: promotionInfo.isRemind }">
						{{ promotionInfo.isRemind ? L['取消提醒'] : L['提醒我'] }}
					</div>
				</div>
			</div>
		</div>
		<!-- 阶梯团 -->
		<div :class="{
				act_banner: true,
				ladder_not: promotionInfo.state == 1,
				ladder_do: promotionInfo.state == 2
			}" v-if="promotionType == 105">
			<div class="title">{{ L['阶梯团'] }}</div>
			<div class="time_title">
				{{ promotionInfo.state == 1 ? L['距离开始剩余：'] : L['距离结束剩余：'] }}
			</div>
			<div class="time">
				<span v-if="time.day" class="countDown0">{{ time.day }}{{
				L['天']
			}}</span>
				<span class="countDown1">{{ time.hours }}</span>
				<span class="countDown2">:</span>
				<span class="countDown1">{{ time.minutes }}</span>
				<span class="countDown2">:</span>
				<span class="countDown1">{{ time.seconds }}</span>
			</div>
			<div class="desc"></div>
		</div>
	</section>
	<!-- 促销活动信息end -->
</template>

<script>
import { getCurrentInstance, watch, reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
export default {
	props: {
		promotionInfo: Object,
		promotionType: Number
	},
	components: {},
	setup (props, { emit }) {
		const instance = getCurrentInstance()
		const { proxy } = instance
		const L = proxy.$getCurLanguage()
		const seckillisRemind = ref(false)

		

		let secInt
		let countDownPromise

		const time = reactive({
			minutes: '00',
			hours: '00',
			seconds: '00'
		})

		const resetTimeString = () => {
			Object.keys(time).forEach(k => time[k] = '00')
		}

		const execCountDown = (countTime) => {

			let _countTime = countTime

			if (countDownPromise) return countDownPromise

			countDownPromise = new Promise(resolve => {
				secInt = setInterval(() => {
					if (_countTime == 0) {
						resolve()
						resetTimeString()
						clearInterval(secInt)
					} else {
						_countTime--
						let day = parseInt(_countTime / 60 / 60 / 24)
						let hours = parseInt((_countTime / 60 / 60) % 24)
						let minutes = parseInt((_countTime / 60) % 60)
						let seconds = parseInt(_countTime % 60)
						if (day) {
							time.day = day
						}
						time.hours = hours > 9 ? hours : '0' + hours
						time.minutes = minutes > 9 ? minutes : '0' + minutes
						time.seconds = seconds > 9 ? seconds : '0' + seconds
					}
				}, 1000)
			})

			countDownPromise.finally(() => {
				countDownPromise = null
			})

			return countDownPromise
		}


		const startCountDownFull = (countTime) => {
			execCountDown(countTime).then(() => {
				emit('refresh')
			})
		}


		// 促销活动信息


		const sorcRemind = () => {
			let param = {
				stageProductId: props.promotionInfo.stageProductId
			}

			proxy.$post('v3/supplier/channel/seckill/isRemind', param).then(res => {
				if (res.state == 200) {
					ElMessage.success(res.msg)
					seckillisRemind.value = !seckillisRemind.value
				}
			})
		}



		emit('register', {
			startCountDownFull
		})

		watch(() => props.promotionInfo, () => {
			seckillisRemind.value = props.promotionInfo.isRemind
		})



		return {
			L,
			sorcRemind,
			seckillisRemind,
			time,
		}
	},
}
</script>

<style lang='scss' scoped>
.act_banner {
	width: 630px;
	height: 50px;
	background-position: center center;
	padding-left: 18px;
	padding-right: 20px;
	display: flex;
	align-items: center;
	position: relative;

	&.pre_not {
		background: url(~@/assets/activity/pre_not_open.png) 100% 100%;
	}

	&.pre_do {
		background: url(~@/assets/activity/pre_do_open.png) 100% 100%;
		background-color: var(--color_presell_main);
	}

	&.pin_not {
		background: url(~@/assets/activity/pin_not_open.png) 100% 100%;
	}

	&.pin_do {
		background: url(~@/assets/activity/pin_do_open.png) 100% 100%;
		background-color: var(--color_spell_main);
	}

	&.sec_not {
		background: url(~@/assets/activity/pre_do_open.png) 100% 100%;
		background-color: var(--color_seckill_main);
	}

	&.sec_do {
		background: url(~@/assets/activity/pre_do_open.png) 100% 100%;
		background-color: var(--color_seckill_main);
	}

	&.ladder_not {
		background: url(~@/assets/activity/ladder_not_open.png) 100% 100%;
	}

	&.ladder_do {
		background: url(~@/assets/activity/pre_do_open.png) 100% 100%;
		background-color: var(--color_ladder_main);
	}
}

.pintuan_left_num {
	min-width: 96px;
	height: 25px;
	border-radius: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1px solid #ffffff;
	box-sizing: border-box;
	margin-right: 13px;

	img {
		width: 20px;
		height: 17px;
		margin-right: 4px;
	}
}

.group_return_regiment {
	padding: 0 12px;
	box-sizing: border-box;
	height: 25px;
	background: rgba(255, 255, 255, 1);
	border-radius: 0 15px 0 15px;
	font-size: 13px;
	font-family: PingFang SC;
	font-weight: 400;
	color: rgba(233, 17, 30, 1);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: -12px;
}

.SorC_remind {
	padding: 0 10px;
	height: 25px;
	background: #ffffff;
	border-radius: 11px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	img {
		width: 20px;
		height: 20px;
		margin-right: 3px;
	}

	.remind_on {
		color: var(--color_seckill_main);
		font-size: 13px;
		letter-spacing: 1px;
		font-weight: bold;
		font-family: Microsoft YaHei;
	}

	.remind_off {
		color: #dbdbdb;
		font-size: 13px;
		letter-spacing: 1px;
		font-weight: bold;
		font-family: Microsoft YaHei;
	}
}

.countDown0 {
	font-size: 14px;
	font-family: PingFang SC;
	font-weight: 700;
	color: #ffffff;
}

.countDown1 {
	// width: 20px;
	// height: 18px;
	padding: 2px 3px;
	background: #ffffff;
	border-radius: 50%;
	font-size: 13px;
	font-family: PingFang SC;
	font-weight: 500;
	color: #f12826;
	text-align: center;
	line-height: 18px;
	margin-left: 5px;
}

.countDown1 {
	color: var(--color_ladder_main);
}

.countDown1_presel {
	color: var(--color_presell_main);
}

.countDown1_seck {
	color: var(--color_seckill_main);
}

.countDown1_act {
	color: var(--color_spell_main);
}

.countDown2 {
	font-size: 13px;
	color: #fff;
	margin-left: 5px;
}

.title {
	font-size: 20px;
	font-family: HelloFont WenYiHei;
	font-weight: bold;
	font-style: italic;
	color: #ffffff;
}

.time_title {
	font-size: 14px;
	margin-left: 20px;
	color: #fff;
}

.desc {
	font-size: 14px;
	color: #fff;
	position: absolute;
	right: 20px;
	display: flex;
}
</style>
