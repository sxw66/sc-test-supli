<template>
    <div class="sld_super_top">
        <div class="sld_member_top_zoom clearfix">
            <div class="container flex_row_start_center">
                <div class="title" @click="gotoMember">会员首页</div>
                <div class="desc"><span>更快</span>·<span>更好</span>·<span>更省钱</span></div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useRouter } from "vue-router";
export default {
    name: 'MemberTop',
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        const router = useRouter();

        const gotoMember = () => {
            router.push('/member/index');
        };

        return { L, gotoMember };
    }
}
</script>

<style lang="scss" scoped>
.sld_super_top {
    .sld_member_top_zoom {
        width: 100%;
        height: 64px;
        background-color: #FFFFFF;
        margin-bottom: 10px;

        .container {
            height: 64px;
            width: 1210px;
            margin: 0 auto;
            padding-left: 0px;
            padding-right: 0px;

            .title {
                color: #C39D59;
                font-size: 24px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                margin-right: 45px;
                cursor: pointer;
            }

            .desc {
                color: #333333;
                font-size: 14px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                margin-top: 5px;

                span {
                    margin-left: 12px;
                    margin-right: 12px;
                }
            }
        }
    }
}
</style>