<template>
	<div class="goods_comments">
		<div class="goods_comments_top">
			<div class="goods_comments_left">
				<div class="comments_title flex_row_between_center">
					<div class="comments_tips">{{ L['评分'] }}:</div>
					<el-rate disabled :colors="colors" score-template="{score}" v-model="comment_info.avgScore">
					</el-rate>
				</div>
				<div class="good_comment flex_row_center_center">
					<span>{{ L['好评率'] }}:</span>
					<span>{{ $formatMoneyNum(comment_info.highPercent || 0) }}</span>
				</div>
			</div>
			<div class="goods_comments_nav">
				<div class="comments_nav_pre" :class="{ comments_nav_pre_active: evaluationType == '' }"
					@click="getEvaluation('')">
					{{ L['全部'] }}({{
						comment_info.commentsCount
					}})
				</div>
				<div class="comments_nav_pre" :class="{
							comments_nav_pre_active: evaluationType == 'hasPic',
						}" @click="getEvaluation('hasPic')">
					{{ L['有图'] }}({{ comment_info.hasPicCount }})
				</div>
				<div class="comments_nav_pre" :class="{
						comments_nav_pre_active: evaluationType == 'high',
					}" @click="getEvaluation('high')">
					{{ L['好评'] }}({{ comment_info.highCount }})
				</div>
				<div class="comments_nav_pre" :class="{
						comments_nav_pre_active: evaluationType == 'middle',
					}" @click="getEvaluation('middle')">
					{{ L['中评'] }}({{ comment_info.middleCount }})
				</div>
				<div class="comments_nav_pre" :class="{
						comments_nav_pre_active: evaluationType == 'low',
					}" @click="getEvaluation('low')">
					{{ L['差评'] }}({{ comment_info.lowCount }})
				</div>
			</div>
		</div>
		<div class="goods_comments_list" v-if="comments_list.length > 0">
			<div class="goods_comments_pre flex_row_start_start" v-for="(comItem, goodsCommentsItemIndex) in comments_list"
				:key="goodsCommentsItemIndex">
				<div class="goods_comments_avatar" :style="{
						backgroundImage: 'url(' + comItem.memberAvatar + ')',
					}"></div>
				<div class="list_des">
					<div class="list_top flex_row_between_start">
						<div class="list_left">
							<div class="list_top_tile flex_row_center_center">
								<div class="list_top_tips">
									{{ comItem.memberName }}
								</div>
								<el-rate v-model="comItem.score" disabled text-color="#ff9900" allow-half="true" :colors="colors">
								</el-rate>
							</div>
							<div class="spec">
								{{ comItem.specValues }}
							</div>
						</div>
						<div class="list_top_right">
							{{ comItem.createTime }}
						</div>
					</div>
					<div class="list_pre">
						<p class="CommentContent">{{ comItem.content }}</p>
						<div class="list_pre_img_list flex_row_start_center" v-if="comItem.images.length">
							<div class="imgCon1" v-for="(commentsImgItem, commentsImgIndex) in comItem.images"
								:key="commentsImgIndex">

								<el-image :src="commentsImgItem" :preview-src-list="[commentsImgItem]" class="list_pre_img"
									fit="contain"></el-image>
							</div>
						</div>
						<p v-if="comItem.replyContent" class="replyContent">
							<span class="seller">{{ L['商家回复:'] }}</span>
							<span class="contentRe">{{ comItem.replyContent
								}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="flex_row_end_center sld_pagination sld_page_bottom">
			<el-pagination @current-change="currentChange" v-model:currentPage="comments_pagination.current"
				:page-size="comments_pagination.pageSize" layout="prev, pager, next, jumper" :total="comments_pagination.total"
				:hide-on-single-page="true">
			</el-pagination>
		</div>
		<div v-if="comments_list.length == 0" class="flex_column_center_center empty_data">
			<SldCommonEmpty :tip="L['该商品暂无评论~']" totalWidth="934px" />
		</div>
	</div>
</template>
<script>
import { defineComponent, ref, getCurrentInstance, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getCurLanguage } from '@/utils/common'
import SldCommonEmpty from '@/components/SldCommonEmpty'
import { useStore } from 'vuex'

export default defineComponent({

	components: {
		SldCommonEmpty
	},

	props: {
		productId: Number,
		storeInfo: Object
	},

	setup (props, { emit }) {

		const { proxy } = getCurrentInstance()
		
		const evaluationType = ref('')
		const evaluationCurrent = ref(1)
		const comments_list = ref([])
		const comments_pagination = ref({})
		const comment_info = ref({})
		const score = ref(0) //好评率
		const colors = ref(Array(3).fill('var(--color_main)'))//星星颜色
		const L = getCurLanguage()
		const getEvaluation = (type = '') => {
			evaluationType.value = type;
			let params = {
				productId: props.productId,
				current: evaluationCurrent.value,
				pageSize: 5,
				type: evaluationType.value,
			};
			proxy.$get("v3/supplier/channel/goods/comment", params).then((res) => {
				if (res.state == 200) {
					let result = res.data;

					Object.keys(result).forEach(key => {
						if (key == 'list') {
							comments_list.value = result[key] ?? []
						} else if (key == 'pagination') {
							comments_pagination.value = result[key]
						} else {
							comment_info.value[key] = result[key]
						}
					})
					comments_list.value.map((commentsItem) => {
						commentsItem.memberName = commentsItem.memberName.slice(0, 1) + '***' + commentsItem.memberName.slice(commentsItem.memberName.length - 1, commentsItem.memberName.length);
					})
					emit('getCommentCount', comment_info.value.commentsCount)
				} else {
					ElMessage.error(res.msg);
				}
			});
		};


		const currentChange = (e) => {
			evaluationCurrent.value = e
			getEvaluation()
		}

		watch(() => props.productId, () => {
			getEvaluation()
		})

		return {
			evaluationType,
			getEvaluation,
			comments_list,
			comments_pagination,
			comment_info,
			colors,
			score,
			currentChange,
			L,
		}
	}
})
</script>
<style lang="scss"></style>
