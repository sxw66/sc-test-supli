<!-- 头部登陆注册导航栏 -->
<template>
  <div class="header_wrap">
    <div class="header">
      <div class="header_left">
        <ul>
          <li :style="curLang == 'en' ? 'padding: 0 10px;':''">
            <div class="has_more li_item">
                  {{ curShowLang }}
               <div class="li_item_more">
                <a href="javascript:void(0)" class="li_item_more_item"
                    @click.stop="changeLanguage(item.type)" v-for="(item,index) in lanList" :key="index">{{ item.name }}</a>
                </div>
            </div>                                         
          </li>
        </ul>
        <span :class="['hello', curLang != 'zh' ? 'pt' : '' ]">{{ L['您好，欢迎来到'] }}</span>
        <span class="hello two">{{ configInfo.basic_site_name }}</span>
      </div>
      <div class="header_right"></div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getCurrentInstance ,ref } from "vue";
export default {
  name: "TopChangeLanguage",
  setup () {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const L = proxy.$getCurLanguage();
    const memberInfo = store.state.memberInfo;
    const loginFlag = store.state.loginFlag;
    const router = useRouter();
    const configInfo = store.state.configInfo
    const curShowLang = ref(
      localStorage.getItem('curLang') == 'en' ? L['英文'] : 
      localStorage.getItem('curLang') == 'spa' ? L['西班牙'] :  
      localStorage.getItem('curLang') == 'zh' ? L['中文'] :
      L['葡萄牙']
    )
    const curLang = localStorage.getItem('curLang') ? localStorage.getItem('curLang') : 'pt'; //默认葡语
    const lanList = ref([
        {
            name:L['中文'],
            type:'zh'
        },
        {
            name:L['葡萄牙'],
            type:'pt'
        },
        {
            name:L['英文'],
            type:'en'
        },
        {
            name:L['西班牙'],
            type:'spa'
        }
    ])
    const changeLanguage = (lang) => {
      if(lang == 'zh' || lang == 'en'||lang == 'pt'||lang == 'spa'){
        localStorage.setItem('curLang',lang);
        window.location.reload();
      } else {
        curShowLang.value = lanList.value.find(item => item.type == lang).name;
      }
    }
    return { L, memberInfo, loginFlag, configInfo, lanList, curLang, curShowLang, changeLanguage};
  }
};
</script>

<style lang="scss" scoped>
.header_wrap {
  width: 100%;
  height: 33px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;

  .header {
    width: 1210px;
    height: 33px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header_left {
      height: 100%;
      font-size: 12px;
      color: #999;
      line-height: 36px;
      display: flex;

      .hello {
        color: #999;
        &.pt {
          margin-right: 4px;
          flex-shrink: 0;
        }
        &.two {
          margin-right: 0;
        }
      }

      .h1 {
        margin: 0 5px;
        cursor: pointer;

        &:hover {
          color: var(--color_main);
        }
      }
    }
    ul {
        height: 100%;
        display: flex;
        align-items: center;
        margin-right: 10px;

        .personal_center {
          width: 121px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        li {
          float: left;
          text-align: center;
          border-right: 1px solid #ddd;
          padding: 0 10px;
          height: 12px;

          .lan_flag{
            width: 24px;
            height: 16px;
            margin-right: 6px;
            vertical-align: middle;
            position: relative;
            bottom: 2px;
          }

          .li_item {
            position: relative;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            color: #999;
            height: 33px;

            &:hover {
              color: $colorMain;

              &.has_more {
                &:before {
                  border-top-color: $colorMain;
                }
              }

              .li_item_more {
                display: block;
              }
            }

            &.has_more {
              padding-right: 12px;

              &:before,
              &:after {
                position: absolute;
                right: -2px;
                display: block;
                width: 0;
                height: 0;
                content: " ";
                border: 4px solid transparent;
                border-radius: 2px;
              }

              &:before {
                top: 3px;
                border-top: 5px solid #888;
              }

              &:after {
                top: 1px;
                border-top: 5px solid #f7f7f7;
              }
            }

            .li_item_more {
              position: absolute;
              width: 80px;
              padding: 5px 3px;
              left: 50%;
              transform: translateX(-50%);
              top: 21px;
              background: #fff;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
              z-index: 999;
              display: none;

              &:before,
              &:after {
                position: absolute;
                top: -11px;
                left: 50%;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
                display: block;
                content: " ";
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-bottom: 6px solid #dedede;
              }

              &:after {
                top: -10px;
                border-bottom: 6px solid #fff;
              }

              .li_item_more_item {
                display: block;
                text-align: center;
                color: #999;
                line-height: 12px;
                padding: 8px 0;

                &:hover {
                  color: $colorMain;
                }
              }
            }
          }

          &:last-child {
            border-right-width: 0;
            padding-right: 0;
          }
        }
      }
    .header_right {
      height: 100%;

      ul {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        .personal_center {
          width: 121px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        li {
          float: left;
          text-align: center;
          border-right: 1px solid #ddd;
          padding: 0 10px;
          height: 12px;

          .li_item {
            position: relative;
            cursor: pointer;
            font-size: 12px;
            line-height: 12px;
            color: #999;
            height: 33px;

            &:hover {
              color: var(--color_main);

              &.has_more {
                &:before {
                  border-top-color: var(--color_main);
                }
              }

              .li_item_more {
                display: block;
              }
            }

            &.has_more {
              padding-right: 12px;

              &:before,
              &:after {
                position: absolute;
                right: -2px;
                display: block;
                width: 0;
                height: 0;
                content: " ";
                border: 4px solid transparent;
                border-radius: 2px;
              }

              &:before {
                top: 3px;
                border-top: 5px solid #888;
              }

              &:after {
                top: 1px;
                border-top: 5px solid #f7f7f7;
              }
            }

            .li_item_more {
              position: absolute;
              width: 80px;
              padding: 5px 3px;
              left: 50%;
              transform: translateX(-50%);
              top: 21px;
              background: #fff;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
              z-index: 999;
              display: none;

              &:before,
              &:after {
                position: absolute;
                top: -11px;
                left: 50%;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
                display: block;
                content: " ";
                width: 0;
                height: 0;
                border: 5px solid transparent;
                border-bottom: 6px solid #dedede;
              }

              &:after {
                top: -10px;
                border-bottom: 6px solid #fff;
              }

              .li_item_more_item {
                display: block;
                text-align: center;
                color: #999;
                line-height: 12px;
                padding: 8px 0;

                &:hover {
                  color: var(--color_main);
                }
              }
            }
          }

          &:last-child {
            border-right-width: 0;
            padding-right: 0;
          }
        }
      }
    }
  }
}
.has_tit {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
}
</style>