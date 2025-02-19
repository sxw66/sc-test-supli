<!-- 文章右部分 -->
<template>
    <div class="right_wrap">
        <!-- 分类列表显示 -->
        <div class="nch_article_con" v-if="!showContent">
            <div class="title_bar">
                <h3>{{ title }}</h3>
            </div>
            <!-- 分类显示 -->
            <ul class="nch_article_list">
                <li v-for="(item, index) in cate" :key="index">
                    <i></i>
                    <a @click="getContent(item.articleId)" style="cursor: pointer;">{{ item.title }}</a>
                    <time></time>
                </li>
            </ul>
        </div>
        <!-- 文章内容显示 -->
        <div v-if="showContent">
            <h2 v-html="data.articeContent.title" class="article_title"></h2>
            <p v-html="data.articeContent.createTime" class="article_time"></p>
            <div class="article_content ql-container">
                <div class="ql-editor" v-html="data.articeContent.content"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, getCurrentInstance, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
export default {
    props: ["cate", "title"],
    setup () {
        const route = useRoute()
        const { proxy } = getCurrentInstance();
        const data = reactive({
            articeContent: {},
        });
        const showContent = ref(false)          //单独声明showContent以便引用

        //通过articleId获取文章详情
        const getContent = (articleId) => {
            const params = {
                articleId: articleId
            };
            proxy.$get('v3/supplier/channel/article/articleDetail', params).then(res => {
                if (res.state === 200) {
                    if (res.data.outUrl) {
                        window.open(res.data.outUrl, '_blank')
                        return
                    }
                    if (res.data.content) {
                        res.data.content = proxy.$quillEscapeToHtml(res.data.content);
                    }
                    data.articeContent = res.data;
                    showContent.value = true;
                }
            })
        };

        onMounted(() => {
            if (route.query.articleId) {
                getContent(route.query.articleId);
            }
        })

        watchEffect(() => {
            if (route.query.articleId) {
                getContent(route.query.articleId);
            }
        })

        return { data, getContent, showContent }
    }


}
</script>

<style lang="scss" scoped>
@import "../../style/vendors.css";

.right_wrap {
    flex: 1;
    background: #fff;
    margin-left: 15px;

    .nch_article_con {
        display: block;
        padding: 19px 50px;
        margin: 0 auto 10px;
        overflow: hidden;

        .title_bar {
            border-bottom: solid 1px #e6e6e6;
            padding-bottom: 15px;
            margin-bottom: 15px;

            h3 {
                font: normal 18px/20px "microsoft yahei";
            }
        }

        .nch_article_list li {
            line-height: 20px;
            display: block;
            height: 30px;
            padding: 5px 0;

            i {
                background: #555555;
                vertical-align: middle;
                display: inline-block;
                width: 3px;
                height: 3px;
                margin-right: 10px;

            }

            a {
                color: #666;
                word-break: break-all;
            }
        }
    }

    .article_title {
        text-align: center;
        font-size: 24px;
        line-height: 24px;
        margin-top: 20px;
    }

    .article_time {
        font-size: 16px;
        text-align: center;
        line-height: 40px;
        color: #666;
        margin-bottom: 20px;
    }

    .article_content {
        padding: 0 20px;
        word-break: break-all;

        .ql-editor {
            padding: 0;
        }
    }
}
</style>
<style lang="scss">
.right_wrap {
    .article_content {
        img {
            max-width: 900px;
        }

        a {
            display: inline-block;
            margin: 5px auto;
            color: #0000FF;
            text-decoration: underline;
        }

        table {
            border-collapse: collapse;
            padding: 0;
        }

        td,
        th {
            border: 1px solid #DDD;
            padding: 5px 10px;
        }

        ol,
        ul {
            padding-left: 10px;
        }

        ol li,
        ul li {
            list-style: unset;
        }
    }
}
</style>