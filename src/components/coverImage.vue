<template>
    <div :style="`background-image:url(${src});height:${height}px;width:${width}px`" class="coverImage"></div>
</template>

<script>
    export default {
        props: ['src', 'width', 'height']
    }
</script>

<style scoped>
    .coverImage {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>