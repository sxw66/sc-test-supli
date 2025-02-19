<template>
    <div class="sld_member_top">
        <div class="sld_member_top_zoom clearfix">
            <div class="container">
                <dl class="fl sld_left_part">
                    <dt class="sld-user-logo sld_img_center">
                        <router-link tag="a" :to="`/index`" class="flex_row_start_center">
                            <img :src="configInfo.supplier_main_user_center_logo" alt />
                        </router-link>
                    </dt>
                    <dd>
                        <router-link tag="a" :to="`/member/index`" :class="{ cur_tag_active: curTag == 1 }">
                            {{ L['个人中心'] }}
                        </router-link>
                    </dd>
                    <dd>
                        <a href="javascript:void(0)" :class="{ account_tag: true, cur_tag_active: curTag == 2 }">{{
                            L['账户管理'] }}
                            <span class="iconfont iconziyuan11-copy account_arrow"></span>
                            <div class="account_popup" :class="{'pt': curLang !== 'zh'}">
                                <div class="content">
                                    <router-link to="/member/info" class="content_item">
                                        <span>{{ L['会员信息'] }}</span>
                                    </router-link>
                                    <router-link to="/member/account" class="content_item">
                                        <span>{{ L['账号安全'] }}</span>
                                    </router-link>
                                    <router-link to="/member/phone" class="content_item">
                                        <span>{{ L['手机号管理'] }}</span>
                                    </router-link>
                                    <router-link to="/member/email" class="content_item">
                                        <span>{{ L['邮箱管理'] }}</span>
                                    </router-link>
                                    <router-link to="/member/pwd/login" class="content_item">
                                        <span>{{ L['登录密码'] }}</span>
                                    </router-link>

                                    <router-link to="/member/pwd/reset" v-if="memberInfo.data.hasPayPassword == 1"
                                        class="content_item">
                                        <span>{{ L['重置密码'] }}</span>
                                    </router-link>
                                    <router-link to="/member/address/list" class="content_item">
                                        <span>{{ L['收货地址'] }}</span>
                                    </router-link>
                                </div>
                            </div>
                        </a>
                    </dd>
                    <dd>
                        <router-link tag="a" :to="`/msg/list?curTplTypeCode=msg_all`"
                            :class="{ cur_tag_active: curTag == 3 }">
                            {{ L['消息'] }}
                            <span class="msg_num" v-if="memberInfo.data.msgNum > 0">{{ memberInfo.data.msgNum > 99 ?
                            '99+'
                            : memberInfo.data.msgNum }}</span>
                        </router-link>
                    </dd>
                </dl>
                <div class="fr">
                    <div class="sld_search_part fl">
                        <input v-model="keyword" type="text" class="text" :placeholder="L['请输入关键词']" autocomplete="off "
                            style="color:rgb(153,153,153);" @focus="inputFocus" ref="searchInput">
                        <input type="submit" :value="L['搜索']" class="button" @click="search" />
                    </div>
                    <div class="fl sld_cart_part">
                        <dl>
                            <dt class="ld first_dt center_text item-box-center" >
                                <span class="iconfont icongouwuche"></span>
                                <router-link target="_blank" :to="`/cart/index`" class="new_cla" >
                                    {{ L['我的进货单'] }}
                                </router-link>
                                <!-- 没有商品显示0 -->
                                <div class="addcart_goods_num">{{ cartData.data.availableCartNum ?
                            cartData.data.availableCartNum : 0 }}</div>
                            </dt>
                            <dd class="cart_more_view">
                                <cart-model></cart-model>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, getCurrentInstance, watchEffect, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import CartModel from '@/components/CartModel';

export default {
    name: 'MemberTop',
    components: { CartModel },
    setup () {
        const { proxy } = getCurrentInstance();
        const L = proxy.$getCurLanguage();
        const keyword = ref('');
        const curTag = ref(1);//当前选中的tag，1为首页，2为账户管理，3为消息
        const router = useRouter();
        const store = useStore();
        const cartData = reactive({ data: {} }); //获取vux的store中的进货单数据
        const memberInfo = reactive({ data: {} }); //个人信息
        const configInfo = ref(store.state.configInfo)
        const curLang = localStorage.getItem('curLang') ? localStorage.getItem('curLang') : 'pt'; //默认中文
        onMounted(() => {
            if (store.state.loginFlag) { //已登录，重新获取进货单数据
                proxy.$getLoginCartListData();
                cartData.data = store.state.cartListData;
            } else {
                cartData.data = store.state.cartListData;
            }
            memberInfo.data = store.state.memberInfo;
        })
        //搜索事件
        const search = () => {
            proxy.$refs.searchInput.style.color = 'rgb(153,153,153)'
            if (keyword.value) {
                router.push({ path: `/goods/list`, query: { keyword: keyword.value } });
            }
        }

        const inputFocus = () => {
            proxy.$refs.searchInput.style.color = '#333'
        }


        watchEffect(() => {
            let tmpRoute = router.currentRoute.value;
            if (tmpRoute.fullPath.indexOf('/msg/') > -1) {
                curTag.value = 3;
            }
            cartData.data = store.state.cartListData;
            memberInfo.data = store.state.memberInfo;

            //获取进货单数量
            if (store.state.loginFlag) {
                proxy.$get("v3/supplier/channel/cart/cartNum").then((res) => {
                    if (res.state == 200) {
                        cartData.data.availableCartNum = res.data ? res.data : 0;
                    }
                });
            }

        });
        return {
            keyword, search, L, cartData, curTag, memberInfo, configInfo,
            inputFocus, curLang,
        };
    }
}
</script>

<style lang="scss" scoped>
.sld_member_top {
    .sld_member_top_zoom {
        width: 100%;
        height: 64px;
        background-color: var(--color_main);
        margin-bottom: 10px;

        .container {
            height: 64px;
            width: 1210px;
            margin: 0 auto;
            padding-left: 0px;
            padding-right: 0px;

            &:after,
            &:before {
                display: table;
                content: " ";
            }

            .fl {
                float: left;
            }

            .fr {
                float: right;
            }
        }

        .sld_left_part {
            color: #fff;

            dt {
                float: left;
                width: 127px;
                height: 60px;
                margin: 10px 35px 10px 0px;

                img {
                    cursor: pointer;
                }

                &.sld_img_center {
                    position: relative;
                    width: 120px;
                    height: 44px;
                    overflow: hidden;

                    a {
                        width: 100%;
                        height: 100%;
                    }

                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            }

            dd {
                position: relative;
                float: left;

                a {
                    display: block;
                    line-height: 64px;
                    color: rgba(255, 255, 255, .8);
                    margin: 0 25px;
                    font-size: 15px;

                    &.router-link-active {
                        &::after {
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            content: '';
                            width: 0;
                            height: 0;
                            transform: translateX(-50%);
                            border-width: 6px;
                            border-style: solid;
                            border-color: transparent transparent #fff transparent;
                        }
                    }

                    .msg_num {
                        display: block;
                        position: absolute;
                        background: #ffffff;
                        color: var(--color_price);
                        min-width: 20px;
                        height: 20px;
                        border-radius: 10px;
                        right: 5px;
                        top: 10px;
                        line-height: 20px;
                        text-align: center;
                    }

                    &.cur_tag_active {
                        &::after {
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            content: '';
                            width: 0;
                            height: 0;
                            transform: translateX(-50%);
                            border-width: 6px;
                            border-style: solid;
                            border-color: transparent transparent #fff transparent;
                        }
                    }

                    .account_arrow {
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 10px;
                        margin-left: 2px;
                        display: inline-block;
                    }

                    &:hover {
                        .account_arrow {
                            transform: rotate(180deg);
                            transition: transform 0.2s ease-in 0s, -webkit-transform 0.2s ease-in 0s;
                        }
                    }
                }

                .account_tag:hover {
                    .account_popup {
                        display: block;
                        opacity: 1;
                        -webkit-animation: showPopUp .4s ease-in-out;
                        animation: showPopUp .4s ease-in-out;

                        @-webkit-keyframes showPopUp {
                            0% {
                                opacity: 0
                            }

                            to {
                                opacity: 1
                            }
                        }

                        @keyframes showPopUp {
                            0% {
                                opacity: 0
                            }

                            to {
                                opacity: 1
                            }
                        }

                    }
                }

                .account_popup {
                    display: none;
                    opacity: 0;
                    top: 40px;
                    left: 50%;
                    margin-left: -50px;
                    padding: 15px 0;
                    width: 100px;
                    position: absolute;
                    z-index: 11;
                    
                    &::before {
                        z-index: 1;
                        top: 10px;
                        margin-left: -5px;
                        width: 10px;
                        height: 10px;
                        box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
                        background-color: #fff;
                    }

                    &::after,
                    &::before {
                        content: '';
                        position: absolute;
                        left: 50%;
                        -webkit-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }

                    .content {
                        padding: 10px 0 10px 23px;
                        overflow: hidden;
                        box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
                        background-color: #fff;

                        .content_item {
                            float: left;
                            width: 80px;
                            color: #333;
                            -webkit-transition: all .4s ease;
                            transition: all .4s ease;
                            height: 30px;
                            line-height: 30px;
                            font-size: 12px;
                            margin: 0;

                            &:hover {
                                color: var(--color_main);
                            }
                        }
                    }
                    &.pt {
                        width: 160px;
                        margin-left: -80px;
                        .content {
                            padding: 10px;
                            .content_item {
                                float: unset;
                                display: -webkit-box;
                                overflow: hidden;
                                width: 100%;
                                height: auto;
                                line-height: 28px;
                                text-overflow: ellipsis;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                word-break: break-all;
                            }
                        }
                    }
                }
            }
        }

        .sld_cart_part {
            float: right;
            position: relative;
            z-index: 99;
            width: 150px;
            height: 40px;
            margin-top: 16px;
            margin-right: 3px;
            margin-bottom: 0px;
            .item-box-center{
              display: flex;
              align-items: center;
            }

            dd {
                top: 32px;
                position: absolute;
                right: 0;
                width: 355px;
                border: 1px solid #E3E3E3;
                background: #fff;
                z-index: 3;
            }

            dl {
                dd {
                    .incart_goods {
                        dl {
                            padding-top: 8px;
                        }

                        dd {
                            &.mcart_price {
                                position: static;

                                em {
                                    margin-right: 6px;
                                    width: auto;
                                    color: #666;

                                    &:nth-child(1) {
                                        display: block;
                                        font-weight: 600;
                                    }

                                    &:nth-child(2) {
                                        display: block;
                                        text-align: right;
                                        margin-top: 6px;
                                    }
                                }
                            }
                        }
                    }
                }

                .addcart_goods_num {
                    font: 11px/16px Verdana;
                    color: #FFF;
                    background: var(--color_price);
                    text-align: center;
                    display: inline-block;
                    height: 16px;
                    min-width: 16px;
                    border: none 0;
                    border-radius: 8px;
                    margin-left: 10px;
                    position: absolute;
                    right: 0;
                }

                .iconfont {
                    margin: 0 13px 0 12px;
                    color: var(--color_main);
                    font-size: 17px;
                    font-weight: 600;
                    vertical-align: top;
                }
            }

            dt {
                position: absolute;
                z-index: 3;
                width: 165px;
                height: 38px;
                border: 1px solid #E3E3E3;
                background-color: #FFF;
                cursor: pointer;
                font-weight: 400;
                line-height: 30px;
            }

            .first_dt {
                width: 150px;
                height: 32px;

                a {
                    color: #666666;
                    font-size: 14px;
                    line-height: 30px;
                }
            }

            .cart_more_view {
                display: none;

                .empty_cart {
                    width: 100%;
                    position: relative;

                    .empty_cart_line {
                        position: absolute;
                        width: 163px;
                        right: 0;
                        height: 2px;
                        top: -2px;
                        z-index: 999;
                        background: #fff;
                    }

                    .empty_cart_txt {
                        padding: 10px;
                        color: #999;
                    }
                }
            }

            &:hover .cart_more_view {
                display: inline-block;
            }

            .ld {
                position: relative;
                zoom: 1;
            }
        }

        .sld_search_part {
            width: 260px;
            height: 32px;
            background-color: #fff;
            margin-top: 16px;
            margin-right: 20px;

            input {
                height: 30px;
                border: none;
                outline: none;
                background-color: #fff;

                &.text {
                    width: 202px;
                    line-height: 30px;
                    padding-left: 10px;
                }

                &.button {
                    width: 58px;
                    height: 32px;
                    color: #666666;
                    font-size: 14px;
                    cursor: pointer;
                    padding: 0 15px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
    }
}
.new_cla {
    width: 100px;
    display: inline-block;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>