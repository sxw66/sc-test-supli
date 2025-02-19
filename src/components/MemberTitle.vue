// 个人中心路由切换顶部导航面包屑 @ljp-2021/2/13
<template>
    <div class="member_title_breadcrumb">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="line-height: 40px;font-size: 10px;"
            >
            <el-breadcrumb-item :to="{path:'/index'}" replace>{{L['首页']}}</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/member/index'}" replace>{{L['个人中心']}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="!memberPath">{{memberTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item v-else :to="{path:memberPath}" replace>{{memberTitle}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{memberTitleS}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
import {getCurrentInstance} from "vue"
export default {
    name:'MemberTitle',
    components:{
    },
    props:["memberTitle","memberPath","memberTitleS"],
    setup(){
        const {proxy} = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        return {
            L
        }
    }
}
</script>
<style lang="scss">
.member_title_breadcrumb{
    padding-left: 10px;
    background: $colorK;
    .el-breadcrumb__item{
        height: 46px;
        line-height: 46px;
        font-size: 12px;
    }
    .el-breadcrumb__inner {
        color:#666666!important;
        font-weight: 700!important;
    }
    .is-link{
        color: #666666!important;
        font-weight: 400!important;
        &:hover{
            color: #333333!important;
            font-weight: 700!important;
        }
    }
}

</style>
