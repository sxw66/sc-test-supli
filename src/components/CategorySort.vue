<template>
    <div id="category_sort">
        <ul class="menu_wrap">
            <!-- 一级分类 start-->
            <li class="menu_item" v-for="(item1, firstIndex) in cateData.data" v-bind:key="firstIndex"
                style="position:static;" @mouseover="selectTab(firstIndex, item1.categoryId)">
                <a class="first_cat" @click.stop="toGoodsList(item1)">
                    {{ item1.categoryName }}</a>
                <div class="children" @click.stop="void (0)">
                    <!-- 二级分类 start-->
                    <div v-if="cateDataFirst.data.length > 0">
                        <dl class="fore_dl" v-for="(item2, index) in cateDataFirst.data" v-bind:key="index">
                            <dt>
                                <a class="second" @click.stop="toGoodsList(item2)">
                                    {{ item2.categoryName }}</a>
                                <i class="iconfont iconziyuan11"></i>

                            </dt>
                            <dd>
                                <!-- 三级分类 start-->
                                <a class="third" @click.stop="toGoodsList(item3)"
                                    v-for="(item3, thirdIndex) in item2.children" v-bind:key="thirdIndex">{{
                item3.categoryName }}</a>
                            </dd>
                        </dl>

                    </div>
                    <SldCommonEmpty v-else totalWidth="900" totalHeight="300" style="color:#666" />
                    <!-- 二级分类 end-->
                </div>

            </li>
            <!-- 一级分类 end-->
        </ul>
    </div>
</template>
<script>
import { getCurrentInstance, reactive, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SldCommonEmpty from './SldCommonEmpty'
export default {
    name: 'CategorySort',
    components: {
        SldCommonEmpty
    },
    setup () {
        const router = useRouter()
        const { proxy } = getCurrentInstance()
        const L = proxy.$getCurLanguage()
        const cateData = reactive({ data: [] })
        const cateShow = ref(false)
        const cateDataFirst = reactive({ data: [] })

        const cateCache = reactive({ data: [] })

        const getInitData = () => {
            proxy.$get('v3/supplier/channel/goods/category/topCategory').then(res => {
                if (res.state == 200) {
                    cateData.data = res.data.slice(0, 12)
                }
            })
        }

        const selectTab = (index, categoryId) => {
            // cateShow.value = true
            cateDataFirst.data = []
            let params = {
                categoryId1: categoryId
            }
            let index1 = cateCache.data.findIndex(item => item.categoryId == categoryId)
            if (index1 > -1) {
                cateDataFirst.data = cateCache.data[index1].list
            } else {
                getSortChild(index, params)
            }

        }

        const getSortChild = (index, params) => {
            proxy.$get('v3/supplier/channel/goods/category/bottomCategory', params).then(res => {
                if (res.state == 200) {
                    let index1 = cateCache.data.findIndex(item => item.categoryId == params.categoryId1)
                    if (index1 > -1) {
                        cateDataFirst.data = cateCache.data[index1].list
                    } else {
                        cateDataFirst.data = res.data
                        cateCache.data.push({ categoryId: params.categoryId1, list: res.data })
                    }
                }
            })
        }


        const toGoodsList = (item) => {
            let newWin = router.resolve({
                path: '/goods/list',
                query: {
                    categoryId: item.categoryId,
                    g: item.grade,
                    pid: item.pid
                }
            })
            window.open(newWin.href, '_blank');
        }

        onMounted(() => {
            getInitData(0, {})
        })
        return { L, cateData, cateDataFirst, selectTab, cateShow, toGoodsList }
    }
}
</script>
<style lang="scss" scoped>
.index {
    background: #f8f8f8;
    padding-bottom: 10px;
}

ul,
ol,
li {
    list-style: none;
}

a,
a:visited,
a:link {
    text-decoration: none;
    color: #666;
}


#category_sort {
    display: none;
    font-size: 12px;
    position: absolute;
    left: 0px;
    top: 43px;
    width: 200px;
    height: 459PX;
    z-index: 9;

    background-color: rgba(0, 0, 0, 0.6);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

    .menu_wrap {


        .menu_item {
            height: 38px;
            line-height: 38px;
            position: relative;
            border-left: 3px solid transparent;

            .first_cat {
                width: 192px;
                display: block;
                font-size: 14px;
                font-family: 'microsoft yahei';
                color: #ffffff;
                padding: 0 10px 0 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                position: relative;
                letter-spacing: normal;
                white-space: nowrap;
                cursor: pointer;

                &:hover {
                    color: var(--color_main);
                }
            }

            &:hover {
                background: #393939;
                border-left-color: #F69913;

                .children {
                    display: inline-block;
                    -webkit-animation: showMore .2s ease-in-out;
                    animation: showMore .2s ease-in-out;

                    @-webkit-keyframes showMore {
                        0% {
                            opacity: 0;
                        }

                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes showMore {
                        0% {
                            opacity: 0;
                        }

                        to {
                            opacity: 1;
                        }
                    }
                }
            }

            .children {
                display: none;
                width: 1000px;
                height: 458px;
                background-color: #fff;
                position: absolute;
                top: 1px;
                left: 200px;
                padding: 10px 0;
                overflow: hidden;
                box-shadow: 0px 5px 10px 0px rgba(153, 153, 153, 0.15);
                line-height: 18px;

                .fore_dl {
                    width: 100%;
                    clear: both;
                    overflow: hidden;
                    margin-bottom: 10px;

                }

                dt {
                    position: relative;
                    float: left;
                    width: 84px;
                    font-weight: 700;
                    overflow: hidden;
                    white-space: nowrap;
                    margin-left: 38px;
                    padding-top: 7px;


                    i {
                        position: absolute;
                        top: 8px;
                        right: 0px;
                        width: 14px;
                        height: 14px;
                        font: 400 9px/14px consolas;
                        color: #333;
                    }

                    .second {
                        font-size: 14px;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #333333;
                        overflow: hidden;
                        display: inline-block;
                        text-align: right;
                        width: 64px;
                        text-overflow: ellipsis;
                        letter-spacing: normal;
                        cursor: pointer;

                        &:hover {
                            color: var(--color_main);
                        }
                    }
                }

                dd {
                    border-top: none;
                    width: 790px;
                    padding: 4px 0;
                    float: left;
                    line-height: 16px;
                    margin-left: 15px;
                    min-height: 32px;
                }

                .third {
                    float: left;
                    padding: 0 12px;
                    margin: 3px 0;
                    line-height: 16px;
                    white-space: nowrap;
                    letter-spacing: normal;
                    cursor: pointer;
                    font-size: 13px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #636363;

                    &:hover {
                        color: var(--color_main);
                    }


                }


            }
        }
    }
}
</style>