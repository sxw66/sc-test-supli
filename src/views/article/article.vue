<!-- 文章总页面 -->
<template>
    <div>
        <CheckLogin />
        <NavTopBar />
        <SldHomeTopSearch />
        <NavCatHeader />
        <div class="article_line"></div>
        <div class="headPath">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:40px;margin-bottom:5px">
                <el-breadcrumb-item :to="{ path: '/' }">{{ L['首页'] }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ L['文章'] }}</el-breadcrumb-item>
                <el-breadcrumb-item v-if="data.categoryId">{{ data.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="article_wrap">
            <div class="nav">
                <div class="article_container">
                    <template v-if="!data.categoryId && data.cate.length == 0 && !data.show">
                        <SldCommonEmpty totalWidth="1200" :tip="L['暂无文章数据']" />
                    </template>
                    <template v-else>
                        <ArticleLeft @seeDetail="seeDetail" @settitle="setTitle" @getArticalDetail="getArticalDetail">
                        </ArticleLeft>
                        <ArticleRight ref="mychild" :cate="data.cate" :title="data.title"></ArticleRight>
                    </template>
                </div>
            </div>
        </div>
        <FooterService />
        <FooterLink />
    </div>
</template>
<script>
import NavTopBar from "../../components/NavTopBar";
import SldHomeTopSearch from "../../components/SldHomeTopSearch";
import NavCatHeader from "../../components/NavCatHeader";
import FooterService from "../../components/FooterService";
import FooterLink from "../../components/FooterLink";
import { ElBreadcrumb, ElBreadcrumbItem } from "element-plus";
import ArticleLeft from "./articleLeft.vue";
import ArticleRight from "./articleRight.vue";
import { getCurrentInstance, reactive, ref, onMounted, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import SldCommonEmpty from '@/components/SldCommonEmpty';
export default {
    name: 'article',
    components: {
        NavTopBar,
        ElBreadcrumb,
        ElBreadcrumbItem,
        SldHomeTopSearch,
        NavCatHeader,
        FooterService,
        FooterLink,
        ArticleLeft,
        ArticleRight,
        SldCommonEmpty,
    },
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        const route = useRoute();
        const mychild = ref(null)                //获取dom的ref,名字同名
        const data = reactive({                  //基本数据
            cate: "",
            allCategory: "",
            title: "",
            categoryId: route.query.categoryId,
            show: false,
        });

        //通过articleId获取文章详情
        const seeDetail = (articleId) => {
            mychild.value.getContent(articleId);
        };

        //设置文章标题
        const setTitle = (val) => {
            data.title = val;
        };

        //通过categoryId获取文章列表
        const getArticalDetail = (title, categoryId, state) => {
            const params = {};
            params.size = 10000;
            params.categoryId = categoryId
            proxy.$get("v3/supplier/channel/article/articleList", params).then(res => {
                if (res.state == 200) {
                    data.cate = res.data;
                    data.title = title;
                    mychild.value.showContent = false;
                    if (state) {
                        data.show = true;
                    } else {
                        data.show = false;
                    }
                }
            });
        };

        //文章列表初始化
        const getInfo = () => {
            const params = {};
            params.size = 10000;
            params.categoryId = route.query.categoryId
            proxy.$get("v3/supplier/channel/article/articleList", params).then(res => {
                if (res.state == 200) {
                    data.cate = res.data;
                }
            });
        };

        onMounted(() => {
            getInfo();
        });

        watchEffect(() => {
            data.categoryId = route.query.categoryId;
        });

        return { data, mychild, seeDetail, setTitle, getArticalDetail, L }

    }
}
</script>

<style lang="scss" scoped>
.article_line {
    border-top: 2px solid var(--color_main);
}

.headPath {
    width: 1200px;
    margin: 0 auto;
}

.article_wrap {
    background-image: url("../../assets/article/bg.png");
    padding-top: 10px;
    padding-bottom: 50px;
    height: 100%;

    background-repeat: no-repeat;
    background-position: top top;
    background-size: cover;
}

.nav {

    width: 1200px;
    margin: 0 auto;

    .article_container {
        display: flex;
    }
}

.sld_common_empty {
    padding-top: 160px !important;
    background-color: #FFFFFF;
}
</style>