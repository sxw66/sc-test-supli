// 推荐商品列表组件(进货单下面的推荐商品) @ljp-2021/1/4
<template>
    <div class="sld_recommend_list">
        <div class="hot_recommend" v-if="hotRecommendList.data && hotRecommendList.data.length > 0">
            <h2>{{ L['热门推荐'] }}</h2>
            <div class="hot_recommend_list flex_row_start_center">
                <div class="hot_recommend_pre flex_column_between_start"
                    v-for="(hotRecListItem, hotRecListIndex) in hotRecommendList.data" :key="hotRecListIndex"
                    @click="goGoodsDetail(hotRecListItem.defaultProductId)">
                    <div class="recommend_pre_top">
                        <div class="hot_recommend_pre_img"
                            :style="{ backgroundImage: 'url(' + hotRecListItem.goodsImage + ')' }"></div>
                        <div class="hot_recommend_pre_price">
                            <span>R${{ $formatMoneyNum(hotRecListItem.goodsPrice || 0) }}&nbsp;&nbsp;</span>
                            <span v-if="hotRecListItem.marketPrice">R${{ $formatMoneyNum(hotRecListItem.marketPrice || 0) }}</span>
                        </div>
                        <div class="hot_recommend_pre_name">{{ hotRecListItem.goodsName }}</div>
                        <div class="hot_recommend_pre_brief">{{ hotRecListItem.goodsBrief }}</div>
                    </div>
                    <div class="recommend_pre_bottom">
                        <div class="hot_recommend_pre_sale">{{ L['已售'] }}<span>{{ hotRecListItem.saleNum }}</span></div>
                        <router-link target="_blank" :to="`/store/index?vid=${hotRecListItem.storeId}`"
                            class="hot_recommend_pre_store" @click.stop>
                            {{ hotRecListItem.storeName }} >
                        </router-link>
                        <div class="hot_recommend_pre_activity">
                            <span class="recommend_activity_pre"
                                v-for="(activityItem, activityIndex) in hotRecListItem.activityList"
                                :key="activityIndex">{{
            activityItem.promotionName }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from 'vuex';
export default {
    name: 'RecommendList',
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        const hotRecommendList = reactive({ data: [] }); //热门推荐商品列表
        //获取热门推荐商品列表
        const getHotRecommendList = () => {
            // let params = {
            //     queryType: 'cart',
            //     pageSize: 8,
            //     current: 1
            // };
            // proxy.$get("v3/supplier/channel/goods/recommendList", params).then((res) => {
            //     if (res.state == 200) {
            //         hotRecommendList.data = res.data.list;
            //     } else {
            //         ElMessage.error(res.msg);
            //     }
            // });
        };
        getHotRecommendList();
        //去商品详情页
        const goGoodsDetail = (productId) => {
            proxy.$goGoodsDetail(productId);
        };
        
        return {
            hotRecommendList,
            L,
            goGoodsDetail,
        }
    }
}
</script>

<style lang="scss" scoped>
// 推荐商品 start
.hot_recommend {
    width: 1200px;
    margin: 0 auto;

    h2 {
        font-size: 26px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
        line-height: 74px;
        border-bottom: 1px solid #DDDDDD;
    }

    .hot_recommend_list {
        padding-top: 20px;
        flex-wrap: wrap;

        .hot_recommend_pre {
            width: 285px;
            height: 488px;
            background: #FFFFFF;
            border-radius: 2px;
            margin-right: 20px;
            margin-bottom: 20px;
            cursor: pointer;

            &:nth-child(4n) {
                margin-right: 0;
            }
        }

        .recommend_pre_top {
            .hot_recommend_pre_img {
                width: 285px;
                height: 285px;
                border-radius: 2px;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }

            .hot_recommend_pre_price {
                margin: 15px 0;

                span {
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: var(--color_main);

                    &:nth-child(2) {
                        font-size: 12px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        text-decoration: line-through;
                        color: #999999;
                    }
                }
            }

            .hot_recommend_pre_name {
                width: 264px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                line-height: 18px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .hot_recommend_pre_brief {
                width: 264px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin: 14px 0 15px;
            }
        }

        .recommend_pre_bottom {
            .hot_recommend_pre_sale {
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #999999;

                span {
                    color: var(--color_main);
                }
            }

            .hot_recommend_pre_store {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
                line-height: 18px;
                margin: 15px 0;
                display: block;
            }

            .hot_recommend_pre_activity {
                .recommend_activity_pre {
                    min-width: 60px;
                    height: 20px;
                    border: 1px solid var(--color_main);
                    border-radius: 3px;
                    font-size: 12px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: var(--color_main);
                    text-align: center;
                    display: inline-block;
                    line-height: 17px;
                    padding: 0 10px;
                }
            }
        }
    }
}

// 推荐商品 end</style>