<template>
	<div>
		<!-- 商品放大镜效果 start-->
		<div class="goods_main_picture" @mousemove="move($event)" @mouseleave="out($event)" @mouseenter="enter($event)">
			<div class="preview-box" ref="previewBox">
				<div class="imageBorder" :class="{ default_image: true, skeleton_default_image: firstLoading, }"
					:style="{ backgroundImage: 'url(' + defaultImage + ')' }">
					<video v-if="currentDefaultImage == -1 && videoInfo" controls playsinline="playsinline"
						class="imageBorder default_image" :poster="defaultImage" autoplay ref="video">
						<source :src="videoInfo" type="video/mp4" />
					</video>
				</div>
				<div class="v_btn" v-if="currentDefaultImage != -1 && videoInfo">
					<img src="@/assets/goods/playV.png" alt="" @click="playV">
				</div>
				<!-- 遮罩 start-->
				<div class="mask" ref="maskBox" v-show="maskShow"></div>
				<!-- 遮罩 end -->
				<!-- 底部放大镜icon图标 start -->
				<div class="magnifier_icon flex_row_center_center" v-show="!maskShow">
					<i class="iconfont iconsousuo"></i>
				</div>
				<!-- 底部放大镜icon图标 end -->
			</div>
			<!-- 右侧的放大后的图片 start -->
			<div class="goods_picture_big" ref="zoomBox" v-show="maskShow">
				<div class="default_image_big" :style="{ backgroundImage: 'url(' + defaultImage + ')' }" ref="pictureBig"></div>
			</div>
			<!-- 右侧的放大后的图片 end -->
		</div>
		<!-- 商品放大镜效果 end -->
		<!-- 商品图片列表 start -->
		<div :class="{ goods_picture_con: true, flex_row_between_center: true, skeleton_goods_picture_con: firstLoading, }"
			v-if="(firstLoading ? true : info.goodsPics.length > 0)">
			<i class="iconfont iconziyuan2 left_arrow" :class="{ no_left_arrow: currentDefaultImage == 0 }"
				@click="switchDefaultImage('left')"></i>
			<div class="show_box">
				<ul class="goods_picture_list flex_row_start_center" ref="goodsPictureList">
					<li v-for="(ImgItem, ImgIndex) in (firstLoading ? [''] : info.goodsPics)" :key="ImgIndex" class="goods_img"
						:class="{ goods_img_active: currentDefaultImage == (firstLoading ? -1 : ImgIndex), }"
						@click="selectDefaultImage(ImgItem, ImgIndex)" @mouseover="selectDefaultImage(ImgItem, ImgIndex)">
						<div class="goods_image" :style="{ backgroundImage: 'url(' + ImgItem + ')' }"></div>
					</li>
				</ul>
			</div>
			<i class="iconfont iconziyuan11 right_arrow"
				:class="{ no_left_arrow: currentDefaultImage == info && info.goodsPics.length - 1, }"
				@click="switchDefaultImage('right')"></i>
		</div>
		<!-- 商品图片列表 end -->

	</div>
</template>

<script>
import { ref,computed, onMounted, getCurrentInstance, watchEffect } from 'vue'
import { useStore } from 'vuex';
export default {
	props: {
		firstLoading: Boolean,
		info: Object,
		videoInfo: Object
	},
	setup (props) {
		const { proxy } = getCurrentInstance();
		const zoom = ref(10); //缩放级别 min: 2 max:10
		const pictureBig = ref(null); //大图的信息
		const maskBox = ref(null); //遮罩盒子的信息
		const maskShow = ref(false); //遮罩是否显示
		const previewBox = ref(null); // 左侧主图元素信息
		const zoomBox = ref(null); //左侧主图的父元素的信息
		const defaultImage = ref(""); //默认主图路径
		const currentDefaultImage = ref("0"); //默认主图显示第一张
		const goodsPictureList = ref(null); //商品图片列表
		// 获取 Vuex store 实例
		const store = useStore();
		//鼠标移动
		const move = (e) => {
			if (currentDefaultImage.value == -1) {
				return
			}

			//主图父元素的信息 宽，高
			let previewsBox = previewBox.value;
			let previewBoxWidth = previewsBox.offsetWidth;
			let previewBoxHeight = previewsBox.offsetHeight;
			//主图父元素距离顶部的距离
			let previewsBoxLeft = offset(previewsBox).left;
			let previewsBoxTop = offset(previewsBox).top;

			// 遮罩盒子的信息宽，高
			let masksBox = maskBox.value;
			let maskBoxWidth = masksBox.offsetWidth;
			let maskBoxHeight = masksBox.offsetHeight;
			//鼠标距离屏幕距离
			let moveX = e.clientX;
			let moveY = e.clientY;

			//获取左侧大图父元素的信息
			let zoomsBox = zoomBox.value;
			let zoomBoxWidth = zoomsBox.offsetWidth;
			let zoomBoxHeight = zoomsBox.offsetHeight;

			// 获取大图元素的信息宽，高
			let pictureBigBox = pictureBig.value;
			let pictureBigWidth = pictureBigBox.offsetWidth;
			let pictureBigHeight = pictureBigBox.offsetHeight;

			//获取滚动条的高度
			let scroll = document.documentElement.scrollTop || document.body.scrollTop;

			//主图距离父元素的left及top值
			let left = moveX - previewsBoxLeft - maskBoxWidth / 2;
			let top;
			if (scroll > 0) {
				top = moveY - previewsBoxTop + scroll - maskBoxHeight / 2;
			} else {
				top = moveY - previewsBoxTop - maskBoxHeight / 2;
			}

			//移动限制最大宽度，及最大高度
			let maxWidth = previewBoxWidth - maskBoxWidth;
			let maxHeight = previewBoxHeight - maskBoxHeight;

			left = left < 0 ? 0 : left > maxWidth ? maxWidth : left;
			top = top < 0 ? 0 : top > maxHeight ? maxHeight : top;

			//比列
			let parcentX = left / maxWidth;
			let parcentY = top / maxHeight;

			//遮罩层的定位值
			maskBox.value.style.left = left + "px";
			maskBox.value.style.top = top + "px";

			//图片的定位置
			// zoomBox.value.style.left = left - maxWidth / 3 + "px";
			// zoomBox.value.style.top = top - maxHeight / 3 + "px";

			//大图元素的定位值
			pictureBig.value.style.left =
				parcentX * (zoomBoxWidth - pictureBigWidth) + "px";
			pictureBig.value.style.top =
				parcentY * (zoomBoxHeight - pictureBigHeight) + "px";
			pictureBig.value.style.width =
				(previewBoxWidth / maskBoxWidth) * zoomBoxWidth + "px";
			pictureBig.value.style.height =
				(previewBoxHeight / maskBoxHeight) * zoomBoxHeight + "px";
		};

		//鼠标移出
		const out = () => {
			maskShow.value = false;
			window.removeEventListener("touchmove", handleScroll, { passive: false });
			window.removeEventListener("wheel", handleScroll, { passive: false });
		};

		//鼠标移入
		const enter = () => {
			if (currentDefaultImage.value == -1) {
				return
			}
			maskShow.value = true;
			window.addEventListener('touchmove', handleScroll, { passive: false });
			window.addEventListener('wheel', handleScroll, { passive: false });
		};

		const handleScroll = (e) => {
			if (e.deltaY > 0 && zoom.value < 10) {
				// 背景图缩小 -- 效果放大
				zoom.value++;
				pictureBig.value.style.transform = 'scale(' + zoom.value / 10 + ')';
			} else if (e.deltaY < 0 && zoom.value > 2) {
				// 背景图放大 -- 效果缩小
				zoom.value--;
				pictureBig.value.style.transform = 'scale(' + zoom.value / 10 + ')';
			}
			event.preventDefault();
		};

		//选择商品主图
		const selectDefaultImage = (goodsImgItem, goodsImgIndex) => {
			defaultImage.value = goodsImgItem;
			currentDefaultImage.value = goodsImgIndex;
		};

		//切换商品主图
		const switchDefaultImage = (type) => {
			let defaultImagelength = props.info.goodsPics.length;
			if (type == "left") {
				currentDefaultImage.value--;
				if (currentDefaultImage.value <= 0) {
					currentDefaultImage.value = 0;
				}
				defaultImage.value =
					props.info.goodsPics[currentDefaultImage.value];
			} else {
				currentDefaultImage.value++;
				if (currentDefaultImage.value >= defaultImagelength) {
					currentDefaultImage.value = defaultImagelength - 1;
				}
				defaultImage.value =
					props.info.goodsPics[currentDefaultImage.value];
			}
			goodsPictureListsLeft();
		};
		//图片列表的left移动的距离
		const goodsPictureListsLeft = () => {
			//获取 goods_picture_list 的元素
			let goodsPictureLists = goodsPictureList.value;
			//列表默认显示5张图片
			if (
				props.info.goodsPics.length > 5 &&
				currentDefaultImage.value >= 0
			) {
				/* 分析找规律：
					如果有8张图片，点击右键 最大可以向左移动的距离为 8 - 5既3张图，left移动的距离为 3 * - 66px; currentDefaultImage.value从0开始的
					其中：66px为每一个元素需要每次移动的距离 为图片的宽度与图片之间的间距的和
					currentDefaultImage.value == 4；goodsPictureLists.style.left = 0；
					currentDefaultImage.value == 5；goodsPictureLists.style.left = (5-4) (1) * -66px；
					currentDefaultImage.value == 6；goodsPictureLists.style.left = (5-2) (2) * -66px；
					currentDefaultImage.value == 7；goodsPictureLists.style.left = (5-3) (2) * -66px；
					 点击左键，最大可以向右移动的距离为 8 - 5 即3张
					 currentDefaultImage.value == 0；goodsPictureLists.style.left = 0；
					 currentDefaultImage.value == 1； goodsPictureLists.style.left = -66px；
					 currentDefaultImage.value == 2; goodsPictureLists.style.left = 2 * -66px；
					 currentDefaultImage.value == 3; goodsPictureLists.style.left = 3 * -66px；
				*/
				if (currentDefaultImage.value > 4) {
					goodsPictureLists.style.left =
						(currentDefaultImage.value - 4) * -66 + "px";
				}
				if (
					currentDefaultImage.value <
					props.info.goodsPics.length - 4
				) {
					goodsPictureLists.style.left = currentDefaultImage.value * -66 + "px";
				}
			}
		};

		//获取元素距离父元素的顶部及左边的距离
		const offset = (el) => {
			let top = el.offsetTop;
			let left = el.offsetLeft;
			if (el.offsetParent) {
				el = el.offsetParent;
				top += el.offsetTop;
				left += el.offsetLeft;
			}
			return {
				left: left,
				top: top,
			};
		};

		// 点击播放视频
		const playV = () => {
			currentDefaultImage.value = -1
			defaultImage.value = "";
			maskShow.value = false
			videoEnd()
		}

		//视频播放结束时触发
		const videoEnd = () => {
			proxy.$nextTick(() => {
				proxy.$refs.video.onended = () => {
					currentDefaultImage.value = 0;
					defaultImage.value = props.info.goodsPics[0];
				}
			})

		}

		watchEffect(() => {
			if (props.info) {
				defaultImage.value = props.info.goodsPics[0];
			}
			// fix 鼠标悬停在指定区域，主图会显示成空白
			if(store.state.timestamp && store.state.BigPictureUrl){
				defaultImage.value = store.state.BigPictureUrl
			   console.log('鼠标移入了图片规格--------------',store.state.BigPictureUrl)
			}
		})



	
		onMounted(() => {})

		return {
			playV,
			switchDefaultImage,
			selectDefaultImage,
			enter,
			out,
			move,
			defaultImage,
			currentDefaultImage,
			pictureBig,
			zoomBox,
			previewBox,
			maskShow,
			maskBox,
			goodsPictureList
		}
	}
}
</script>
