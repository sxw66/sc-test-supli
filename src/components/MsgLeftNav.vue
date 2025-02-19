<!--
 * @Author: zjf
 * @Date: 2021-01-06 09:31:05
 * @LastEditTime: 2021-01-07 13:51:36
 * @LastEditors: ljp
 * @Description: In User Settings Edit
 * @FilePath: /java-pc/src/components/MsgLeftNav.vue
-->
<!--消息中心左侧公共导航 @zjf-2021-01-05-->
<template>
    <div class="sld_msg_left_nav">
        <div v-for="(item, index) in noticeList.data" :key="index" class="msg_menu">
            <router-link :to="{ path: item.path, query: { curTplTypeCode: item.tplTypeCode } }" class="menu"
                @click="nav(item.code)" :class="{ active: curNav == item.code }">
                <i class="iconfont iconxiaoxiliebiao" v-if="item.code == 1"></i>
                <i class="iconfont iconxitongxiaoxi" v-if="item.code == 2"></i>
                <i class="iconfont icondingdan" v-if="item.code == 3" style="margin-left: 2px;"></i>
                <i class="iconfont iconjiaoyixiaoxi" v-if="item.code == 4"></i>
                <i class="iconfont icontuikuantuihuoxiaoxi" v-if="item.code == 5"></i>
                <i class="iconfont iconjieshoushezhi" v-if="item.code == 6"></i>
                {{ item.msgName }}
            </router-link>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, watchEffect } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from "vue-router";

export default {
    name: 'MsgLeftNav',
    components: {},
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        const noticeList = reactive({ data: [] }); //消息类型列表
        const curNav = ref(1); //当前选中的nav
        const router = useRouter();
        onMounted(() => {
            proxy.$getUserInfo();
        });
        //监听路由的实时变化
        watchEffect(() => {
            let tmpPath = router.currentRoute.value.fullPath;
            if (tmpPath == '/msg/list?curTplTypeCode=msg_all') {
                curNav.value = 1;
            } else if (tmpPath == '/msg/list?curTplTypeCode=system_news') {
                curNav.value = 2;
            } else if (tmpPath == '/msg/list?curTplTypeCode=order_news') {
                curNav.value = 3;
            } else if (tmpPath == '/msg/list?curTplTypeCode=appointment_news') {
                curNav.value = 4
            } else if (tmpPath == '/msg/list?curTplTypeCode=after_sale_news') {
                curNav.value = 5;
            } else if (tmpPath == '/msg/setting') {
                curNav.value = 6;
            }
        })
        //获取消息类型列表
        const getMsgType = () => {
            proxy.$get('v3/supplier/channel/userMsg/msgListNum').then((res) => {
                if (res.state == 200) {
                    let result = res.data;
                    noticeList.data = [
                        {
                            code: 1,
                            msgName: L['消息列表'],
                            tplTypeCode: "msg_all",
                            path: '/msg/list'
                        }
                    ]
                    result.map((noticeItem, noticeIndex) => {
                        noticeItem.code = noticeIndex + 2;
                        noticeItem.path = '/msg/list';
                        noticeList.data.push(noticeItem);
                    })
                    noticeList.data.push({
                        code: noticeList.data.length + 1,
                        msgName: L['接收设置'],
                        path: '/msg/setting'
                    })

                } else {
                    ElMessage.error(res.msg);
                }
            })
        };
        getMsgType();
        const nav = (code) => {
            curNav.value = code;
        };
        return {
            L,
            noticeList,
            nav,
            curNav
        };
    }
}
</script>

<style lang="scss" scoped>
.sld_msg_left_nav {
    background-color: #fff;
    color: #666;
    font-size: 12px;
    border: 1px solid #EBEBEB;
    border-top: 1px solid #fff;
    margin-top: -2px;
    padding-bottom: 100px;
    font-family: MicrosoftYaHei;
    width: 180px;
    float: left;
    margin-bottom: 20px;
    height: 550px;

    .msg_menu {
        height: 52px;
        line-height: 52px;
        background-color: #fff;

        a {
            display: inline-block;
            height: 100%;
            width: 100%;
            color: #666666;
            font-size: 16px;
            padding-left: 20px;
            border-left: 2px solid transparent;
        }

        i {
            color: #888888;
            font-size: 20px;
            margin-right: 10px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
        }
    }

    .active {
        background-color: #EEEEEE;
        border-left: 2px solid var(--color_main) !important;

    }
}
</style>