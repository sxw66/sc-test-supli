<template>
    <div>
        <div class="goods_list_cate3 clearfix">
            <template v-if="categoryid">
                <div class="sld_goods_recommend" v-if="recomData.data != undefined && recomData.data.length">
                    <h3 class="fl">{{ L['热门推荐'] }}</h3>
                    <ul class="fl">
                        <li class="fl"
                            v-for="({ goodsName, goodsImage, goodsPrice, defaultProductId }, index) in recomData.data"
                            :key="index">
                            <router-link target="_blank" :to="`/goods/detail?productId=${defaultProductId}`"
                                class="sld_img">
                                <!-- <img :src="goodsImage" :alt="goodsName"> -->
                                <coverImage :src="goodsImage" width="100" height="100"></coverImage>
                            </router-link>
                            <div class="sld_hot_goods">
                                <div class="sld_h32_hide">
                                    <router-link target="_blank" :to="`/goods/detail?productId=${defaultProductId}`"
                                        class="sld_goods_name">
                                        {{ goodsName }}
                                    </router-link>
                                </div>
                                <p class="sld_goods_price">R$<em>{{ $formatMoneyNum(goodsPrice || 0) }}</em></p>
                                <router-link target="_blank" :to="`/goods/detail?productId=${defaultProductId}`"
                                    class="btn">
                                    {{ L['立即购买'] }}
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="sld_brand sld_show clearfix"
                    v-if="brandData.data.brandList != undefined && brandData.data.brandList.length && brandFlag">
                    <p class="sld_gleft">{{ L['品牌'] }}</p>
                    <ul class="sld_gright">
                        <li class="sld_brand_item" v-for="(item, index) in brandData.data.brandList" :key="index"
                            :title="item.brandName">
                            <a @click="brandOption(item.brandId, item.brandName)">
                                <span :style="`background-image:url('` + item.image + `');`"></span>
                                <!-- <img :src="item.image"> -->
                            </a>
                        </li>
                    </ul>
                </div>
                <ul class="sld_cat sld_show"
                    v-if="brandData.data.categoryList != undefined && brandData.data.categoryList.length">
                    <div class="clearfix sld_cat_item">
                        <p class="sld_gleft">{{ L['分类'] }}</p>
                        <ul class="sld_gright">
                            <li v-for="(item, index) in brandData.data.categoryList" :key="index">
                                <router-link :to="`/goods/list?categoryId=${item.categoryId}&g=3&pid=${pid}`">
                                    {{ item.categoryName }}
                                </router-link>
                            </li>
                        </ul>
                    </div>

                </ul>
                <ul class="sld_cat sld_show"
                    v-if="brandData.data.attributeList != undefined && brandData.data.attributeList.length">
                    <template
                        v-for="({ attributeName, attributeValueList, attributeId, isShow }, index) in brandData.data.attributeList"
                        :key="index">
                        <div v-if="isShow"
                            :class="{ clearfix: true, sld_cat_item: true, sld_cat_item_open: isOpen, sld_cat_item_hide: !isOpen }"
                            :key="attributeId">
                            <div>
                                <p class="sld_gleft">{{ attributeName }}</p>
                                <ul class="sld_gright">
                                    <li v-for="(item, aindex) in attributeValueList" :key="aindex">
                                        <a
                                            @click="attri(attributeName, item.attributeValue, attributeId, item.valueId)">
                                            {{ item.attributeValue }}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </ul>
                <a :class="{ sld_more_bo: true, on: showFlag }" @click="showMore"
                    v-if="brandData.data.attributeList != undefined && brandData.data.attributeList.length > 1 && brandData.unshowNum">
                    <span style="cursor: pointer;">{{ showFlag ? L['收起'] : L['更多选项'] }}</span> <i class="iconfont"></i>
                </a>
            </template>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router'
import { useStore } from 'vuex';
export default {
    name: 'GoodsListCate3',
    props: ['categoryid'],
    setup (props, { emit }) {
        const { proxy } = getCurrentInstance()
        const L = proxy.$getCurLanguage()
        
        const brandData = reactive({ data: [], unshowNum: 0 })
        const showFlag = ref(false)
        const recomData = reactive({ data: [] })
        const isOpen = ref(false)
        const route = useRoute()
        const pid = ref(route.query.pid)
        const params = reactive({
            categoryId: props.categoryid
        })
        const brandFlag = ref(true)
        watch(() => props.categoryid, (nv, ov) => {
            if (nv != ov) {
                params.categoryId = nv
                getInitData(params)
            }
        })
        const getInitData = (params) => {
            proxy.$get('v3/supplier/channel/goods/category/screenList', params).then(res => {
                if (res.state == 200) {
                    brandData.data = res.data;
                    brandData.unshowNum = res.data.attributeList?.length > 2 ? res.data.attributeList.length - 2 : 0;
                    brandData.data.attributeList.map(item => {
                        item.isShow = true
                    })
                }
            })
            // let recomm = {
            //     queryType: 'hot',
            //     categoryId3: props.categoryid
            // }
            // proxy.$get('v3/supplier/channel/goods/recommendList', recomm).then(res => {
            //     if (res.state === 200) {
            //         recomData.data = res.data.list
            //     }
            // })
        }
        const attri = (attributeName, attributeValue, attributeId, attributeValueId) => {
            attrSorH(attributeId)
            emit('attriOption', attributeName, attributeValue, attributeId, attributeValueId)
        }
        const brandOption = (brandId, brandName) => {
            brandSorH()
            emit('brandOption', brandId, brandName)
        }
        const showMore = () => {
            isOpen.value = !isOpen.value
            showFlag.value = !showFlag.value
        }

        const brandSorH = () => {
            brandFlag.value = !brandFlag.value
        }

        const attrSorH = (attributeId) => {
            let item = brandData.data.attributeList.find(item => item.attributeId == attributeId)
            item.isShow = !item.isShow
            let num = 0;
            brandData.data.attributeList.forEach(item => {
                if (item.isShow) {
                    num++;
                }
            })
            brandData.unshowNum = num > 2 ? num - 2 : 0;
        }
        onMounted(() => {
            getInitData(params)
        })

        return { brandData, recomData, L, showMore, showFlag, isOpen, attri, brandOption, brandFlag, brandSorH, attrSorH, pid, }
    }
}
</script>

<style lang="scss">
.clearfix {
    display: block;
    zoom: 1;

    &:after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
}

ul,
ol,
li {
    list-style: none;
}

.fr {
    float: right;
}

.fl {
    float: left;
}

a,
a:visited {
    color: #333333;
}

.sld_goods_recommend {
    width: 100%;
    height: 150px;
    margin-bottom: 30px;
    background-color: #F1F1F1;
    overflow: hidden;
    display: flex;

    h3 {
        width: 40px;
        height: 170px;
        background-color: var(--color_main);
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        line-height: 40px;
        writing-mode: vertical-lr;
        text-align: center;
        letter-spacing: 10px;
        font-family: MicrosoftYaHei-Bold;
    }

    ul {
        display: flex;
        padding: 14px 0 20px 11px;
    }

    li {
        width: 276px;
        height: 120px;
        background-color: #fff;
        margin-right: 12px;

        a.btn {
            margin-top: 7px;
            color: #333333;
            display: block;
            width: 72px;
            height: 25px;
            border-radius: 2px;
            text-align: center;
            line-height: 25px;
            font-size: 12px;
            color: #fff;
            cursor: pointer;
            background-color: var(--color_main);
        }
    }

    .sld_img {
        float: left;
        height: 100px;
        margin-top: 11px;
        margin-left: 11px;
        width: 100px;

        img {
            width: 100px;
            height: 100px;
        }
    }

    .sld_hot_goods {
        float: left;
        width: 144px;
        box-sizing: border-box;
        padding: 12px;
    }

    .sld_h32_hide {
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sld_goods_price {
        color: var(--color_price);
        font-size: 15px;
        font-weight: bold;
        margin-top: 6px;

        em {
            font-style: normal;
        }
    }

    .sld_goods_name {
        font-size: 12px;
        color: #666;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }


}

.goods_list_cate3 {
    position: relative;
    margin-bottom: 43px;
    color: #606060;
    font-size: 12px;
    font-family: MicrosoftYaHei !important;

    .sld_brand {
        position: relative;
        border: 1px solid #D7D7D7;

        .sld_gleft {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 120px;
            padding: 12px 0 0 17px;
            background-color: #f9f9f9;
        }

        .sld_gright {
            overflow: hidden;
            width: 850px;
            /* border: 1px solid #E1E1E1; */
            border-bottom: none;
            border-right: none;
            float: left;
            margin: 10px 0 10px 144px;
            background-color: #fff;
        }

        .sld_brand_item {
            margin-right: 10px;
            margin-bottom: 5px;
            padding: 5px;
            cursor: pointer;

            span {
                display: inline-block;
                width: 102px;
                height: 36px;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
            }
        }

        ul li {
            float: left;
            width: 112px;
            height: 48px;
            border: 1px solid #e1e1e1;
        }

        li:hover {
            border: 1px solid var(--color_main);
        }

        li img {
            width: 100%;
            height: 100%;
            border: 0;
        }
    }

    .sld_cat {
        border: 1px solid #CBCBCB;
        border-bottom: none;
        margin-top: -1px;

        .sld_cat_item {
            position: relative;
            border-bottom: 1px solid #CBCBCB;
            padding-right: 150px;

            .sld_gleft {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                width: 120px;
                padding: 14px 0 0 17px;
                background-color: #f9f9f9;
            }

            .sld_gright {
                float: left;
                margin: 10px 0 10px 144px;
                background-color: #fff;
            }

            li a {
                color: #666;
                cursor: pointer;

                &:hover {
                    color: var(--color_main)
                }
            }

            li {
                float: left;
                margin-right: 40px;
                line-height: 23px;
            }
        }

        .sld_cat_item_open:not(:nth-child(1)):not(:nth-child(2)) {
            display: block;
        }

        .sld_cat_item_hide:not(:nth-child(1)):not(:nth-child(2)) {
            display: none;
        }

    }

    .sld_more_bo {
        position: absolute;
        bottom: -23px;
        left: 50%;
        width: 120px;
        height: 24px;
        line-height: 24px;
        color: #666;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
        text-align: center;
        background-color: #fff;
        border: 1px solid #D7D7D7;
        border-top: none;

        i {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            transition: all .3s;
        }

        &:hover {

            color: var(--color_main);
            text-decoration: none;

        }
    }

    .sld_more_bo.on {

        i {
            -webkit-transform: rotate(-180deg);
            -moz-transform: rotate(-180deg);
            -ms-transform: rotate(-180deg);
            -o-transform: rotate(-180deg);
            transform: rotate(-180deg);
        }

    }

}
</style>