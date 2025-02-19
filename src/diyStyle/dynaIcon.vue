<template>
     <section class="dyna_group" :class="{ ovfl: mode == 'image' }">
          <div class="dyna_img" :style="{ width: width + 'px', height: height + 'px' }" v-if="mode == 'image'">
               <img :src="dynaSrc" :style="styleSet">
          </div>
          <span class="iconfont" :class="iconSrc" :style="styleSet" v-if="mode == 'iconfont'"></span>
     </section>
</template>

<script>
import { useStore } from 'vuex';
import { ref, watch } from 'vue'
export default {
     props: {
          width: {
               type: [Number, String],
          },
          height: {
               type: [Number, String],
          },
          src: {
               type: String,
               default: ''
          },
          color: String,
          icon: String,
          mode: {
               type: String,
               default: 'image'
          }
     },
     setup (props) {
          const store = useStore()
          const { x_diyStyle } = store.state
          const colorSet = ref(x_diyStyle[props.color] || props.color)
          const dynaSrc = ref('')
          const iconSrc = ref(props.icon)
          const styleSet = ref(colorSet.value ? `filter:drop-shadow(${colorSet.value} ${Number(props.width) + 20}px 0);transform:translateX(${-(Number(props.width) + 20)}px)` : '')

          if (props.mode == 'iconfont') {
               styleSet.value = `color:${colorSet.value}`
          }

          if (props.mode == 'image') {
               dynaSrc.value = props.src.indexOf('data:image/png;base64') > -1 ? props.src : require('../assets/' + props.src)
          }

          watch(() => props.src, () => {
               dynaSrc.value = props.src.indexOf('data:image/png;base64') > -1 ? props.src : require('../assets/' + props.src)
          })

          watch(() => props.icon, (nv) => {
               iconSrc.value = nv
          })

          watch(() => props.color, (nv) => {
               colorSet.value = x_diyStyle[nv] || nv
               styleSet.value = `filter:drop-shadow(${colorSet.value} ${Number(props.width) + 20}px 0);transform:translateX(${-(Number(props.width) + 20)}px)`
               if (props.mode == 'iconfont') {
                    styleSet.value = `color:${colorSet.value}`
               }
          })


          return { dynaSrc, colorSet, styleSet, iconSrc }
     }
}
</script>

<style lang="scss" scoped>
.dyna_group {

     display: flex;
     align-items: center;
     justify-content: center;
     line-height: 1 !important;

     &.ovfl {
          overflow: hidden;
     }

     img {
          width: 99% !important;
          height: 99% !important;
     }
}
</style>