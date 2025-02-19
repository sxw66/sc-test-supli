<template>
    <div class="goods_list_container">
        <!-- 分类路径 -->
        <div class="level_nav_main">
            <div class="level_item" v-if="catePathName.path.length">
                <!-- 一级分类，显示该部分 -->
                <template v-if="1 === showIndex">
                    <div class="level_nav_item">
                        <a class="level_link">{{ catePathName.path[0] }}</a>
                    </div>
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{ trigger: true, hasChild: cate1.cate.length }">
                                <span class="trigger_name">{{ L['全部分类'] }}</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate1.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="({ categoryName, categoryId, grade, pid }, index) in cate1.cate"
                                        :key="index">
                                        <router-link :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                            {{ categoryName }}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 进入二级分类路径下的页面时，显示该部分 -->
                <template v-else-if="2 === showIndex">
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{ trigger: true, hasChild: cate1.cate.length }">
                                <span class="trigger_name">{{ catePathName.path[0] }}</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate1.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="({ categoryName, categoryId, grade, pid }, index) in cate1.cate"
                                        :key="index">
                                        <router-link :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                            {{ categoryName }}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <i class="level-right"></i>
                    <div class="level_nav_item">
                        <div class="menu_drop">
                            <div :class="{ trigger: true, hasChild: cate2.cate.length }">
                                <span class="trigger_name">{{ catePathName.path[1] }}</span>
                                <i class="menu_drop_arrow"></i>
                            </div>
                            <div class="menu_drop_main" v-if="cate2.cate.length">
                                <ul class="menu_drop_list">
                                    <li v-for="(item2, index) in cate2.cate" :key="index">
                                        <a @click="goCate3(item2)">{{ item2.categoryName }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 进入三级分类路径下的页面时，显示该部分 -->
                <template v-else>
                    <div style="float: left;">
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{ trigger: true, hasChild: cate1.cate.length }">
                                    <span class="trigger_name">{{ catePathName.path[0] }}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate1.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="({ categoryName, categoryId, grade, pid }, index) in cate1.cate"
                                            :key="index">
                                            <router-link
                                                :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                                {{ categoryName }}</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <i class="level-right"></i>
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{ trigger: true, hasChild: cate2.cate.length }">
                                    <span class="trigger_name">{{ catePathName.path[1] }}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate2.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="({ categoryName, categoryId, grade, pid }, index) in cate2.cate"
                                            :key="index">
                                            <router-link
                                                :to="`/goods/list?categoryId=${categoryId}&g=${grade}&pid=${pid}`">
                                                {{ categoryName }}</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <i class="level-right"></i>
                        <div class="level_nav_item">
                            <div class="menu_drop">
                                <div :class="{ trigger: true, hasChild: cate3.cate.length }">
                                    <span class="trigger_name">{{ catePathName.path[2] }}</span>
                                    <i class="menu_drop_arrow"></i>
                                </div>
                                <div class="menu_drop_main" v-if="cate3.cate.length">
                                    <ul class="menu_drop_list">
                                        <li v-for="(item3, index) in cate3.cate" :key="index">
                                            <a @click="goCate3(item3)">{{ item3.categoryName }}</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="level_nav_item" style="margin-left: 10px;">
                    <div class="menu_drop" v-for="(item, index) in attriListTemp" :key="index">
                        <div class="trigger label">
                            <span class="trigger_name">{{ item.name }}:&nbsp;
                                <!-- <font color="var(--color_main)">{{item.value }}</font> -->
                                <p style="font-family: Arial; font-size: 16px;color: var(--color_main);">{{item.value }}</p>
                            </span>
                            <span @click="attriKick(index, item)">
                                <i class="el-icon-close"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="level_item" v-show="keyword">
                <div class="level_nav_item" style="font-size: 13px;">
                    <a class="level_link"><i style="color: var(--color_vice);">"{{ keyword }}" &nbsp;</i>{{ L['搜索结果']
                        }}</a>
                </div>
            </div>
        </div>
        <div class="goods_list_banner">
            <!-- 二级分类或者三级分类的组件 -->
            <GoodsListCate2 :cateItem="cate1.child" :cate2Name="computed0CatePathName" v-if="showIndex === 1">
            </GoodsListCate2>
            <GoodsListCate2 :cateItem="cate2.child" :cate2Name="computedCatePathName" v-if="showIndex === 2">
            </GoodsListCate2>
            <GoodsListCate3 :categoryid="categoryId3" v-if="showIndex === 3" @attriOption="attriOption"
                @brandOption="brandOption" ref="goodsCate3"></GoodsListCate3>
        </div>

        <div class="goods_list clearfix">
            <!-- 筛选区域 -->
            <div class="sld_screen">

                <div class="flex_row_start_center">
                    <a @click="filterSort(0)" :class="{ btn_sort: 0 == indexNum }" class="a_btn">{{ L['综合'] }}</a>
                    <a @click="filterSort(1)" :class="{ btn_sort: 1 == indexNum }" class="a_btn">
                        {{ L['销量'] }}
                        <i class="iconfont iconxiangxia" style="font-size: 12px;"></i>
                    </a>
                    <a @click="filterSort(2)" :class="{ btn_sort: 2 == indexNum }" class="a_btn">
                        {{ L['评论数'] }}
                        <i class="iconfont iconxiangxia" style="font-size: 12px;"></i>
                    </a>
                    <a :class="{ sld_price_jt_down: indexNum == 4, sld_price_jt_up: indexNum == 3 }"
                        class="sld_price_jt a_btn" @click="filterSort(indexNum == 4 ? 3 : 4)">{{ L['价格'] }}</a>
                    <div class="price_section on flex_column_start_center" :class="{ 'price-focus': price_flag }"
                        @mouseenter="price_section('1')" @mouseleave="price_section('0')">
                        <div class="input_box">
                            <input type="number" class="sld_rmb" v-model="lowprice" id="lowprice"
                                @input="priceInput('lowprice', $event)" />
                            <span class="line_o" v-if="lowpriceFlag">R$</span>
                            <span class="line"></span>
                            <input type="number" class="sld_rmb" v-model="highprice" id="highprice"
                                @input="priceInput('highprice', $event)" />
                            <span class="line_t" v-if="lowpriceFlag_o">R$</span>
                        </div>
                        <div class="price-edit">
                            <a class="item1" @click="reset">{{ L['清空'] }}</a>
                            <a class="item2" @click="confirm">{{ L['确定'] }}</a>
                        </div>
                    </div>
                    <div class="goods_type">
                        {{ L['商品类型'] }}:
                        <p style="cursor: pointer;">
                            <!-- <input type="checkbox" :value="isOwnShop" id="isOwn" @input="filterStoreSelf(isOwnShop)" /> -->
                            <!-- <el-checkbox :checked="isOwnShop" @change="filterStoreSelf(isOwnShop)" id="isOwn"></el-checkbox>
                            <label for="isOwn" style="cursor: pointer;">{{ L['仅平台自营'] }}</label> -->
                            <el-checkbox v-model="isOwnShop" :label="L['仅平台自营']" @change="filterStoreSelf(isOwnShop)"
                                class="is_own_checkbox" />
                        </p>
                    </div>
                </div>


                <span class="sld_goods_num">{{ goodsData.page.total }}{{ L['件相关商品'] }}</span>
            </div>

            <!-- 商品列表 -->
            <ul :class="{ sld_goods_list: true, skeleton_sld_goods_list: firstLoading }">
                <li v-for="(goods, index) in firstLoading ? skeletonData.data : goodsData.data" :key="index">
                    <goodsItem :goodsInfo="goods" :openModal="openLoginModal" />
                </li>
            </ul>
            <SldCommonEmpty v-show="isEmpty" />
        </div>

        <!-- 分页 -->
        <div class="flex_row_center_center sld_pagination">
            <el-pagination @current-change="handleCurrentChange" v-model:currentPage="goodsData.page.current"
                :page-size="goodsData.page.pageSize" layout="prev, pager, next, jumper" :total="goodsData.page.total"
                :hide-on-single-page="true">
            </el-pagination>
        </div>

    </div>
</template>
<script>
import {
    getCurrentInstance,
    onMounted,
    reactive,
    computed,
    ref,
    watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import GoodsListCate2 from '@/components/GoodsListCate2'
import GoodsListCate3 from '@/components/GoodsListCate3'
import SldCommonEmpty from '../../components/SldCommonEmpty'
import goodsItem from '@/components/goodsItem';

export default {
    name: 'goodsList',
    components: {
        GoodsListCate2,
        GoodsListCate3,
        SldCommonEmpty,
        goodsItem
    },
    setup () {
        //变量------------------------------
        const firstLoading = ref(true) //是否第一次加载
        const skeletonData = reactive({ data: [] })
        const store = useStore()
        const initSkeletonData = () => {
            for (let i = 0; i < 10; i++) {
                skeletonData.data.push({
                    goodsName: '',
                    goodsImage: '',
                    goodsPrice: '',
                    saleNum: '',
                    activityList: '',
                    isFollowGoods: '',
                    defaultProductId: ''
                })
            }
        }
        initSkeletonData()
        const route = useRoute()
        const router = useRouter()
        const catePath = ref([]) //导航路径
        const showIndex = ref(0) //显示flag
        const catePathName = reactive({ path: [] }) //需要在页面显示的整个分类路径
        const params = reactive({
            //初始化的请求参数
            current: 1
        })
        const { proxy } = getCurrentInstance()
        const L = proxy.$getCurLanguage()
        const goodsData = reactive({ data: [], page: {} })
        const indexNum = ref(0)
        const lowprice = ref(null)
        const lowpriceFlag = ref(true)
        const lowpriceFlag_o = ref(true)
        const price_flag = ref(false);
        const highprice = ref(null)
        const isEmpty = ref(false)
        const keyword = ref(route.query.keyword ?? '') //搜索关键词
        const cate1 = reactive({ cate: {}, child: {} })
        const cate2 = reactive({ cate: {}, child: {} })
        const cate3 = reactive({ cate: {} })
        const categoryId3 = ref(route.query.categoryId ?? '')
        const attriList = ref([])
        const attriListTemp = ref([])
        const scrollTop = ref(null)
        const priceDidSel = ref(false)
        const memberInfo = ref(store.state.memberInfo)//用户信息

        //方法------------------------------
        //初始化数据，进行请求-start
        const getInitData = (params, notRqCate) => {
            window.scrollTo(0, scrollTop.value)
            let searchParams = { ...params }
            proxy.$get('v3/supplier/channel/goods/goodsList', searchParams).then(res => {
                firstLoading.value = false
                if (res.state == 200) {
                    goodsData.data = res.data.list.map(item => {
                        item.saleNum = item.saleNum > 10000 ? (item.saleNum / 10000).toFixed(1) * 1 + 'w' : item.saleNum
                        return item
                    })
                    isEmpty.value = res.data.list.length ? false : true
                    goodsData.page = res.data.pagination
                    showIndex.value = Number(route.query.g)
                    if (route.query.categoryId && route.query.g && route.query.pid && !notRqCate) {
                        let { categoryId, g } = route.query
                        cateForm(categoryId, g)
                    } else {
                        catePathName.path = []
                    }
                }
            })
        }
        //初始化数据，进行请求-end

        //更具分类Id和级别形成分类路径
        const cateForm = (c, g) => {
            if (g == 0) {
                return
            }
            if (g == 3) {
                let pid = route.query.pid
                cateForm(pid, 2)
                return
            }
            let param = {
                categoryId: c,
                grade: g
            }
            let cateId = route.query.categoryId
            proxy.$get('v3/supplier/channel/goods/category/listByPId', param).then(res => {
                if (res.state == 200) {
                    switch (Number(g)) {
                        case 1: {
                            let cdx1 = res.data.findIndex(i => i.categoryId == c)
                            cate1.cate = res.data.filter(i => i.categoryId != c)
                            cate1.child = res.data[cdx1].children
                            catePathName.path[0] = res.data[cdx1].categoryName
                            if (route.query.g == 2 || route.query.g == 3) {
                                cate2.cate = cate1.child.filter(i => i.categoryId != cateId)
                            }
                            break
                        }

                        case 2: {
                            cate2.child = res.data[0].children
                            catePathName.path[1] = res.data[0].categoryName
                            if (route.query.g == 3) {
                                let cdx3 = cate2.child?.findIndex(i => i.categoryId == cateId)
                                cate3.cate = cate2.child.filter(i => i.categoryId != cateId)
                                catePathName.path[2] = cate2.child[cdx3].categoryName
                            }
                            let cate2Pid = res.data[0].pid
                            cateForm(cate2Pid, 1)
                            break
                        }
                    }
                }
            })
        }

        //
        const refreshInfo = () => {
            history.go(0)
        }
        //获取分类Id数组对应的分类名--end

        //去往三级分类
        const goCate3 = item => {
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

        //页数改变的方法-start
        const handlePrevCilickChange = e => {
            params.current = e
            getInitData(params, 'noCate')
        }
        const handleNextCilickChange = e => {
            params.current = e
            getInitData(params, 'noCate')
        }
        const handleCurrentChange = e => {
            params.current = e
            getInitData(params, 'noCate')
        }

        //综合，销量等按钮事件
        const filterSort = index => {
            if (indexNum.value == index) {
                return
            }
            indexNum.value = index
            params.current = 1
            scrollTop.value = document.body.scrollTop || document.documentElement.scrollTop
            router.push({
                path: 'list',
                query: {
                    ...route.query,
                    sort: indexNum.value
                }
            })
        }
        //页数改变的方法-end

        //商品是否自营-start
        const isOwnShop = ref(false)
        const filterStoreSelf = () => {
            params.isSelf = isOwnShop.value ? 1 : 0
            scrollTop.value = document.body.scrollTop || document.documentElement.scrollTop
            getInitData(params, 'noCate')
        }
        //商品是否自营-end

        //价格区间事件-start
        //价格区间确认按钮
        const confirm = () => {
            priceDidSel.value = true
            lowpriceFlag.value = false
            lowpriceFlag_o.value = false

            function setNumber (number) {
                if (number == '') {
                    return 0
                } else {
                    return number
                }
            }
            console.log(lowprice.value, highprice.value, 'ooooo')
            if (lowprice.value && highprice.value) {

                let tmpLow = Math.abs(lowprice.value)
                let tmpHigh = Math.abs(highprice.value)

                let realLow = Math.min(tmpLow, tmpHigh)
                let realHigh = Math.max(tmpLow, tmpHigh)

                lowprice.value = Math.max(realLow, 0.01)
                highprice.value = Math.min(realHigh, 999999)

                params.lowPrice = lowprice.value
                params.highPrice = highprice.value
                params.current = 1
                scrollTop.value = document.body.scrollTop || document.documentElement.scrollTop
                getInitData(params, 'noCate')


            } else if (lowprice.value || highprice.value) {
                let transLow = Math.abs(setNumber(lowprice.value))
                let transHigh = Math.abs(setNumber(highprice.value))

                let realLow = Math.min(transLow, transHigh)
                let realHigh = Math.max(transLow, transHigh)

                lowprice.value = Math.max(realLow, 0.01)
                highprice.value = Math.min(realHigh, 999999)

                params.lowPrice = lowprice.value
                params.highPrice = highprice.value
                params.current = 1
                scrollTop.value = document.body.scrollTop || document.documentElement.scrollTop
                getInitData(params, 'noCate')

            }
        }

        //价格区间清空按钮
        const reset = () => {
            params.highPrice = highprice.value = ''
            params.lowPrice = lowprice.value = ''
            params.current = 1
            if (priceDidSel.value) {
                scrollTop.value =
                    document.body.scrollTop || document.documentElement.scrollTop
                getInitData(params, 'noCate')
            }

            //这是 当 例如 3- 这种情况出现 无法清空，执行
            document.getElementById('lowprice').value = ''
            document.getElementById('highprice').value = ''

            lowpriceFlag.value = true
            lowpriceFlag_o.value = true
        }

        //价格交互输入事件
        const priceInput = (type, e) => {
            if (type == 'lowprice') {
                lowprice.value = e.target.value
                let low = String(e.target.value).split('.')
                if (low[1] && low[1].length >= 2)
                    lowprice.value = Number(e.target.value).toFixed(2)
                if (lowprice.value) {
                    lowpriceFlag.value = false
                } else {
                    lowpriceFlag.value = true
                }
            }

            if (type == 'highprice') {
                highprice.value = e.target.value
                let high = String(e.target.value).split('.')
                if (high[1] && high[1].length >= 2)
                    highprice.value = Number(e.target.value).toFixed(2)

                if (highprice.value) {
                    lowpriceFlag_o.value = false
                } else {
                    lowpriceFlag_o.value = true
                }
            }
        }
        //价格区间事件-end

        //属性选择--start
        const attriOption = (
            attributeName,
            attributeValue,
            attributeId,
            attributeValueId
        ) => {
            //添加属性查询
            attriList.value.push(attributeValueId)
            attriListTemp.value.push({
                name: attributeName,
                value: attributeValue,
                type: 'attr',
                id: attributeId,
                valueId: attributeValueId
            })
            params.attributeInfo = attriList.value.join(',')
            getInitData(params, 'noCate')
        }

        //属性删除事件
        const attriKick = (index, item) => {
            //删除属性查询
            attriListTemp.value.splice(index, 1)
            if (item.type == 'attr') {
                attriList.value = attriList.value.filter(
                    subitem => subitem != item.valueId
                )
                proxy.$refs.goodsCate3.attrSorH(item.id)
                if (attriListTemp.value.length) {
                    params.attributeInfo = attriList.value.join(',')
                    getInitData(params, 'noCate')

                } else {
                    delete params.attributeInfo
                    getInitData(params, 'noCate')

                }
            } else if (item.type == 'brand') {
                delete params.brandIds
                proxy.$refs.goodsCate3.brandSorH()
                getInitData(params, 'noCate')
            }
        }

        //品牌选择事件
        const brandOption = (brandId, brandName) => {
            attriListTemp.value.push({
                name: '品牌',
                value: brandName,
                type: 'brand'
            })
            params.brandIds = brandId
            getInitData(params, 'noCate')
        }
        //属性选择--end

        //监听事件--start
        watch(
            () => route.query.categoryId,
            (nv) => {
                categoryId3.value = nv
                if (nv) {
                    attriList.value = []
                    attriListTemp.value = []
                    lowprice.value = highprice.value = null
                    isOwnShop.value = false
                    params.categoryIds = nv
                    getInitData(params)
                }
            }
        )
        watch(
            () => route.query.keyword,
            (nv) => {
                keyword.value = nv
                if (nv) {
                    params.keyword = keyword.value
                    lowprice.value = highprice.value = null
                    isOwnShop.value = false
                    delete params.highPrice
                    delete params.lowPrice
                    getInitData(params)
                }
            }
        )
        watch(
            () => route.query.sort,
            (nv) => {
                if (nv) {
                    params.sort = route.query.sort
                    indexNum.value = route.query.sort ? route.query.sort : 0
                    getInitData(params)
                }

            }
        )

        //监听事件--end
        router.beforeEach((to, from) => {
            if (to.path == from.path) {
                document.body.scrollTop = scrollTop.value
            }
        })

        // 判断鼠标是否移入价格区间
        const price_section = (type) => {
            if (type == 1) {
                price_flag.value = true
            } else {
                price_flag.value = false
            }
        }
        // 添加计算属性
        const computed0CatePathName = computed(() => {
            return catePathName.path[0] === undefined ? route.query.categoryName : catePathName.path[0]
        });
        // 添加计算属性
        const computedCatePathName = computed(() => {
            return catePathName.path[1] === undefined ? route.query.categoryName : catePathName.path[1]
        });

        onMounted(() => {

            let query = ['categoryId', 'keyword', 'storeId', 'goodsIds', 'brandId', 'sort', 'lowPrice']

            query.forEach(key => {
                if (route.query[key]) {
                    if (key == 'categoryId' || key == 'brandId') {
                        params[`${key}s`] = route.query[key]
                    } else {
                        params[key] = route.query[key]
                    }
                    if (route.query.sort) {
                        indexNum.value = route.query.sort
                    }
                }
            })
            // console.log('route.queryroute.query',route.query.categoryName)
            // console.log('catePathName.path111',catePathName.path[0])
            // console.log('catePathName.2222',catePathName.path[1])
            // console.log('3333333',computedCatePathName.value)
            getInitData(params)
        })

        //返回值
        return {
            refreshInfo,
            goodsData,
            computed0CatePathName,
            computedCatePathName,
            price_section,
            handlePrevCilickChange,
            handleNextCilickChange,
            handleCurrentChange,
            L,
            catePathName,
            catePath,
            showIndex,
            indexNum,
            filterSort,
            filterStoreSelf,
            isOwnShop,
            lowprice,
            highprice,
            confirm,
            reset,
            isEmpty,
            keyword,
            cate1,
            cate2,
            cate3,
            firstLoading,
            skeletonData,
            goCate3,
            categoryId3,
            attriOption,
            attriList,
            attriKick,
            attriListTemp,
            brandOption,
            priceInput,
            lowpriceFlag,
            lowpriceFlag_o,
            price_flag,
            memberInfo,
        }
    }
}
</script>



<style lang="scss">
@import '../../style/goodsList.scss';
</style>
<style lang="scss" scoped>
@import '../../style/base.scss';

.empty_page {
    flex-direction: column;
    padding: 100px;
}

.sld_pagination {
    margin-top: 30px;
    margin-bottom: 30px;
}

/*添加css样式*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

input[type='number'] {
    -moz-appearance: textfield;
}
</style>

<style lang="scss">
.is_own_checkbox {
    .el-checkbox__inner {

        &:hover {
            border-color: var(--color_main);
        }
    }

    .el-checkbox__input {
        &.is-checked {
            .el-checkbox__inner {
                background-color: var(--color_main);
                border-color: var(--color_main)
            }

            &+.el-checkbox__label {
                // color: var(--color_main)
            }
        }

        &.is-focus {
            .el-checkbox__inner {
                border-color: var(--color_main)
            }
        }
    }
}

.el-checkbox .el-checkbox__input+.el-checkbox__label {
    color: #000;
    font-size: 12px;
}
</style>
