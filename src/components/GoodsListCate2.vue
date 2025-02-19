<template>
    <div class="goods_list_cate2">
        <div class="sld_brand_cat">
            <div class="sld_cat_item">
                <b>{{ L['筛选结果'] }}</b>"<em>{{ cate2Name }}</em>"
            </div>
            <div class="sld_cat_item clearfix">
                <p class="sld_gleft">{{ L['包含分类'] }}</p>
                <ul class="sld_gright" v-if="cateItem.length">
                    <li v-for="(item, index) in cateItem" :key="index">
                        <a @click="toCate3(item)">{{ item.categoryName }}</a>
                    </li>
                </ul>
                <ul class="sld_gright no_category" v-else>
                    <div>{{ L['暂无分类'] }}</div>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router'
export default {
    name: 'GoodsListCate2',
    props: ['cateItem', 'cate2Name'],
    setup () {
        const { proxy } = getCurrentInstance()
        const router = useRouter()
        const L = proxy.$getCurLanguage()
        //去往三级分类所在的商品列表页面
        const toCate3 = (item) => {
            let { categoryId, grade, pid } = item
            router.push({
                path: 'list',
                query: {
                    categoryId,
                    g: grade,
                    pid
                }
            })
        }

        onMounted(() => {
        })

        return { L, toCate3 }
    }
}
</script>
<style lang="scss">
.clearfix {
    display: block;
    zoom: 1;
}

ul,
ol,
li {
    list-style: none;
}

a:visited {
    text-decoration: none;
}

.goods_list_cate2 {
    width: 1200px;
    margin: 0 auto;
    margin-top: 20px;
    padding-left: 0px;
    padding-right: 0px;
    font-family: "microsoft yahei";

    .sld_brand_cat {
        margin-bottom: 17px;
        border: 1px solid #D7D7D7;

        .sld_cat_item {
            position: relative;
            display: flex;
            border-bottom: 1px solid #CBCBCB;
            padding-right: 150px;

            li {
                float: left;
                margin-right: 40px;
                line-height: 23px;
            }

            &:nth-child(1) {
                line-height: 40px;
                background-color: #F6F6F6;
                padding-left: 17px;
                font-size: 14px;
                color: #666;
                border-bottom: 1px solid #D7D7D7;

                em {
                    color: var(--color_main);
                    font-weight: 600;
                    font-style: normal;
                }
            }

            &:nth-child(2) {
                border: none;
                min-height: 43px;
            }

            .sld_gleft {
                position: relative;
                top: 0;
                left: 0;
                bottom: 0;
                width: 120px;
                padding: 12px 0 0 17px;
                background-color: #f9f9f9;
            }

            .sld_gright {
                margin: 10px 0 10px 20px;
                background-color: #fff;

                &.no_category {
                    display: flex;
                    justify-content: center;
                    width: 100%;

                    div {
                        color: #999;
                    }
                }

                a {
                    color: #666;
                    text-decoration: none;
                    cursor: pointer;

                    &:hover {
                        color: var(--color_main);
                    }
                }
            }
        }
    }

}
</style>