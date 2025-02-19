<!--
 * @Author: zjf
 * @Date: 2021-01-11 15:56:16
 * @LastEditTime: 2021-01-09 22:22:11
 * @LastEditors: zjf
 * @Description: 公共的空页面
 * 可以设置空页面的总宽、总高、空图片距离顶部的高度，提示的内容
-->
<template>
    <div class="sld_common_empty flex_column_start_center"
        :style="{ width: totalWidth ? (totalWidth + 'px') : '1210px', height: totalHeight ? (totalHeight + 'px') : '500px', paddingTop: paddingTop ? (paddingTop + 'px') : '120px' }">
        <img class="empty_img" src="../assets/common_empty.png" />
        <p style="text-align: center;">{{ tip ? tip : L['暂时没有数据～'] }}</p>
    </div>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
    name: "SldCommonEmpty",
    props: ['totalWidth', 'totalHeight', 'paddingTop', 'tip'],
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        return { L };
    },
};
</script>

