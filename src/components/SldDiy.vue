<template>
  <div class="sld_diy">

    <div v-if="swpierData">

      <div v-if="swpierData.json_data && swpierData.json_data.type == 'main_banner'" class="main_banner_1">
        <CategorySort v-if="source == 'home'"></CategorySort>
        <el-carousel height="457px" arrow="never" class="main_banner">
          <el-carousel-item v-for="(item_banner, index_banner) in swpierData.json_data.data" :key="index_banner">
            <a href="javascript:void(0)" @click="diyNavTo(item_banner)">
              <div :style="`background-image:url(${item_banner.imgUrl})`"></div>
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>


      <MainBanner2 v-if="swpierData.json_data && swpierData.json_data.type == 'main_banner_2'"
        :tpl_info="swpierData.json_data">
      </MainBanner2>

      <MainBanner3 v-if="swpierData.json_data && swpierData.json_data.type == 'main_banner_3'"
        :tpl_info="swpierData.json_data">
      </MainBanner3>

    </div>

    <div class="main_background flex_row_center_center"
      v-if="bigBackground && bigBackground.json && bigBackground.json.type == 'main_background'">
      <div :style="{ backgroundImage: `url(${bigBackground.json.data.imgUrl})` }" class="main_background_image"></div>
    </div>

    <div class="pc_main_diy">
      <FloorNav ref="FloorNavRef" :nav_info="main_nav"></FloorNav>
      <div v-for="(item, index) in decorateData.data" v-bind:key="index">
        <!-- adv_01 start-->
        <div class="adv_01_wrap" :id="item.id" v-if="item.json_data && item.json_data.type == 'adv_01'"
          :class="{ adv_01_wrap_full: item.json_data.full_screen && item.json_data.full_screen == 1 }"
          :style="{ height: item.json_data.data.height + 'px', paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <a href="javascript:void(0)" @click="diyNavTo(item.json_data.data)">
            <img class="adv_01_img" v-bind:src="item.json_data.data.imgUrl" />
          </a>
        </div>
        <!-- adv_01 end-->

        <!-- adv_02 start-->
        <div class="adv_02_part" :id="item.id" v-if="item.json_data && item.json_data.type == 'adv_02'"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_02_left" @click="diyNavTo(item.json_data.left.data)">
            <a href="javascript:void(0)" v-if="item.json_data.left.data.imgUrl != undefined">
              <img v-bind:src="item.json_data.left.data.imgUrl" />
            </a>
          </div>
          <div class="adv_02_center">
            <span class="split_h"></span>
            <div class="goods_item clearfix"
              v-for="(item_center, index_center) in item.json_data.center.data.goods_data" v-bind:key="index_center"
              @click="goGoodsDetail(item_center)">
              <a target="_blank" href="javascript:void(0)" v-if="item_center.productId || item_center.defaultProductId">
                <div class="left">
                  <img v-bind:src="item_center.mainImage" />
                </div>
                <div class="right">
                  <p class="goods_name">{{ item_center.goodsName }}</p>
                  <p class="buy_num">{{ item_center.actualSales * 1 + item_center.virtualSales * 1 }}{{ L['人购买'] }}
                  </p>
                  <div class="price">
                    <span class="unit">R$</span>
                    <span class="integer">{{ $formatMoneyNum(item_center.goodsPrice || 0) }}</span>
                  </div>
                  <a class="buy" href="javascript:void(0)">{{ L['立即抢购'] }}</a>
                </div>
              </a>
              <div class="flex_row_center_center" style="height:100%" v-else>
                <span class="iconfont icongerenzhongxinguanzhushangpin"
                  style="font-size:40px;color:rgb(229, 230, 222);"></span>
              </div>
            </div>
            <span class="split_v"></span>
          </div>
          <div class="adv_02_right">
            <span class="right_img_item" v-for="(item_right, index_right) in item.json_data.right.data"
              v-bind:key="index_right" @click="diyNavTo(item_right)">
              <a href="javascript:void(0)">
                <img v-bind:src="item_right.imgUrl" />
              </a>
            </span>
          </div>
        </div>
        <!-- adv_02 end-->

        <!-- adv_04 start-->
        <div class="w_sld_react_1210 adv_04_wrap" :id="item.id" v-if="item.json_data && item.json_data.type == 'adv_04'"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="floor_title">
            <h2>
              <!-- <font v-bind:style="{ backgroundColor: item.json_data.title_info.title_color }">&nbsp;</font> -->
              <p v-bind:style="{ backgroundColor: item.json_data.title_info.title_color }">&nbsp;</p>
              <span v-bind:style="{ color: item.json_data.title_info.title_color }">{{
      item.json_data.title_info.title_name
    }}</span>
              <!-- <font v-bind:style="{ backgroundColor: item.json_data.title_info.title_color }">&nbsp;</font> -->
              <p v-bind:style="{ backgroundColor: item.json_data.title_info.title_color }">&nbsp;</p>
            </h2>
          </div>
          <div class="floor_goods">
            <div class="item" v-for="(item_main, index_main) in item.json_data.data.goods_data" v-bind:key="index_main">
              <div class="wrap" @click="goGoodsDetail(item_main)">
                <a href="javascript:void(0)" class="example_text">
                  <img v-bind:src="item_main.mainImage" />
                </a>
                <p class="title">
                  <a href="javascript:void(0)" title>{{ item_main.goodsName }}</a>
                </p>
                <p class="price">
                  <span>
                    {{ L['R$'] }}
                    <span class="money_number">{{ $formatMoneyNum(item_main.goodsPrice || 0) }}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_04 end-->

        <!-- adv_05 start-->
        <div class="w_sld_react_1210 adv_05_wrap" :id="item.id" v-if="item.json_data && item.json_data.type == 'adv_05'"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="floor">
            <div class="floor_layout">
              <div>
                <div class="floor_title">
                  <h2>
                    <span class="main_title">{{ item.json_data.title_info.title.initialValue }}</span>
                    <span class="sub_title">{{
      item.json_data.title_info &&
      item.json_data.title_info.sub_title.initialValue
    }}</span>
                  </h2>
                  <div class="right_action" v-if="item.json_data.title_info.link_type">
                    <a @click="diyNavTo(item.json_data.title_info)">
                      {{ L['查看更多'] }}
                      <i>&gt;&gt;</i>
                    </a>
                  </div>
                </div>

                <div class="floor_content">
                  <div class="floor_left">
                    <div class="floor_bg_img">
                      <a class="ad_img example_text" href="javascript:void(0)"
                        @click="diyNavTo(item.json_data.left.data)">
                        <img v-bind:src="item.json_data.left.data.imgUrl" />
                      </a>
                    </div>
                    <div class="floor_words">
                      <div class="floor_words_top_title">
                        <!-- <font></font> -->
                        <p style="font-family: Arial;"></p>
                        <span>{{ item.json_data.left.cat_data.title_info.title_name }}</span>
                        <!-- <font></font> -->
                        <p style="font-family: Arial;"></p>
                      </div>
                      <ul>
                        <li v-for="(item_left_cat, index_left_cat) in item.json_data.left.cat_data.cat_datas"
                          v-bind:key="index_left_cat">
                          <a href="javascript:void(0)" :title="item_left_cat.categoryName"
                            @click="goGoodsListByCatId(item_left_cat.categoryId)">{{ item_left_cat.categoryName }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="floor_right" style="border-color: var(--color_main);">
                    <div class="floor_right_main">
                      <div class="floor_content">
                        <div class="big_item item" v-if="item.json_data.center.data.goods_data.length">
                          <div class="wrap" @click="goGoodsDetail(item.json_data.center.data.goods_data[0])">
                            <div class="left_pic">
                              <a href="javascript:void(0)" class="ad_img example_text">
                                <img v-bind:src="item.json_data.center.data.goods_data[0].mainImage"
                                  alt="item.json_data.center.data.goods_data[0].goodsName" />
                              </a>
                            </div>
                            <div class="right_info">
                              <p class="title">
                                <a href="javascript:void(0)"
                                  :title="item.json_data.center.data.goods_data[0].goodsName">{{
                                    item.json_data.center.data.goods_data[0].goodsName
                                  }}</a>
                              </p>
                              <p class="price">
                                {{ L['R$'] }}
                                <span class="money_number">{{
                                  $formatMoneyNum(item.json_data.center.data.goods_data[0].goodsPrice || 0)
                                }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="item" v-if="item.json_data.center.data.goods_data.length > 1">
                          <div class="wrap" @click="goGoodsDetail(item.json_data.center.data.goods_data[1])">
                            <a class="ad_img" href="javascript:void(0)">
                              <img v-bind:src="item.json_data.center.data.goods_data[1].mainImage"
                                alt="item.json_data.center.data.goods_data[1].goodsName" />
                            </a>
                            <p class="title">
                              <a href="javascript:void(0)"
                                :title="item.json_data.center.data.goods_data[1].goodsName">{{
                                  item.json_data.center.data.goods_data[1].goodsName
                                }}</a>
                            </p>
                            <p class="price">
                              {{ L['R$'] }}
                              <span class="money_number">{{ $formatMoneyNum(item.json_data.center.data.goods_data[1].goodsPrice || 0)
                                }}</span>
                            </p>
                          </div>
                        </div>
                        <template
                          v-for="(item_center_bottom, index_center_bottom) in item.json_data.center.data.goods_data">
                          <div class="item bottom_item" :key="index_center_bottom" v-if="index_center_bottom > 1"
                            @click="goGoodsDetail(item_center_bottom)">
                            <div class="wrap">
                              <a href="javascript:void(0)" class="ad_img example_text">
                                <img v-bind:src="item_center_bottom.mainImage" alt="item_center_bottom.goodsName" />
                              </a>
                              <p class="title">
                                <a href="javascript:void(0)" :title="item_center_bottom.goodsName">{{
                                  item_center_bottom.goodsName
                                }}</a>
                              </p>
                              <p class="price">
                                {{ L['R$'] }}
                                <span class="money_number">{{ $formatMoneyNum(item_center_bottom.goodsPrice|| 0) }}</span>
                              </p>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="floor_right_new">
                      <div class="floor_right_new_top_title">
                        <!-- <font style="background: #fc585a"></font> -->
                        <p style="font-family: Arial; background: #fc585a;"></p>
                        <span style="color: #fc585a">{{ item.json_data.right.title_info.title_name }}</span>
                        <!-- <font style="background: #fc585a"></font> -->
                        <p style="font-family: Arial; background: #fc585a;"></p>
                      </div>
                      <div class="floor_content">
                        <div class="item"
                          v-for="(item_right_goods, index_right_goods) in item.json_data.right.data.goods_data"
                          v-bind:key="index_right_goods">
                          <div class="wrap" @click="goGoodsDetail(item_right_goods)">
                            <div class="left_pic">
                              <a href="javascript:void(0)" class="ad_img example_text">
                                <img v-bind:src="item_right_goods.mainImage" alt="item_right_goods.goodsName" />
                              </a>
                            </div>
                            <div class="right_info">
                              <p class="title">
                                <a href="javascript:void(0)" :title="item_right_goods.goodsName">{{
                                  item_right_goods.goodsName
                                }}</a>
                              </p>
                              <p class="price">
                                {{ L['R$'] }}
                                <span class="money_number">{{ $formatMoneyNum(item_right_goods.goodsPrice || 0) }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_05 end-->

        <!-- adv_06 start-->
        <div v-if="item.json_data && item.json_data.type == 'adv_06'" class="adv_06 com_1210_center" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_06_wrap">
            <div class="item" v-for="(item_child, index_child) in item.json_data.data" v-bind:key="index_child">
              <a href="javascript:void(0)" @click="diyNavTo(item_child)">
                <img v-bind:src="item_child.imgUrl" />
              </a>
            </div>
          </div>
        </div>
        <!-- adv_06 end-->

        <!-- adv_07 start-->
        <div class="w_sld_react_1210 adv_07" v-if="item.json_data && item.json_data.type == 'adv_07'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class=" adv_07_wrap">
            <div class="item" v-for="(item_child, index_child) in item.json_data.data" :key="index_child">
              <a href="javascript:void(0);" @click="diyNavTo(item_child)" v-if="item_child.imgUrl">
                <img :src="item_child.imgUrl">
              </a>
              <a class="show_tip" href="javascript:void(0);" v-else>
                <span>{{ L['此处添加【403*高度不限】图片'] }}</span>
              </a>
            </div>
          </div>
        </div>
        <!-- adv_07 end-->

        <!-- adv_08 start-->
        <div class="w_sld_react_1210 adv_08 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_08'"
          :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_08_wrap">
            <div class="item" v-for="(item_main, index_main) in item.json_data.data" v-bind:key="index_main"
              @click="diyNavTo(item_main)">
              <a href="javascript:void(0)">
                <img v-bind:src="item_main.imgUrl" />
              </a>
            </div>
          </div>
        </div>
        <!-- adv_08 end-->

        <!-- adv_09 start-->
        <div class="adv_09 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_09'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_09_wrap">
            <div class="item left">
              <div class="top_title"
                v-bind:style="{ backgroundColor: item.json_data.left.title_info.title_bg_color, color: item.json_data.left.title_info.title_color }">
                {{ item.json_data.left.title_info.title_name }}
              </div>

              <div class="main_con">
                <a class="first show_tip" href v-for="(item_left, index_left) in item.json_data.left.data"
                  v-bind:key="index_left" @click="diyNavTo(item_left)">
                  <img v-bind:src="item_left.imgUrl" />
                </a>
              </div>
            </div>
            <div class="item center">
              <div class="top_title"
                v-bind:style="{ backgroundColor: item.json_data.center.title_info.title_bg_color, color: item.json_data.center.title_info.title_color }">
                {{ item.json_data.center.title_info.title_name }}
              </div>
              <div class="main_con">
                <a class="show_tip" href v-for="(item_center, index_center) in item.json_data.center.data"
                  v-bind:key="index_center" @click="diyNavTo(item_center)">
                  <img v-bind:src="item_center.imgUrl" />
                </a>
              </div>
            </div>
            <div class="item right">
              <div class="top_title"
                v-bind:style="{ backgroundColor: item.json_data.right.title_info.title_bg_color, color: item.json_data.right.title_info.title_color }">
                {{ item.json_data.right.title_info.title_name }}
              </div>
              <div class="main_con">
                <a class="show_tip" href v-for="(item_right, index_right) in item.json_data.right.data"
                  v-bind:key="index_right" @click="diyNavTo(item_right)">
                  <img v-bind:src="item_right.imgUrl" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_09 end-->

        <!-- adv_10 start-->
        <div class="adv_10 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_10'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_10_wrap">
            <div class="row_one" v-for="(item_one, index_one) in item.json_data.row_one.data" v-bind:key="index_one">
              <a href="javascript:void(0)" @click="diyNavTo(item_one)">
                <img v-bind:src="item_one.imgUrl" />
              </a>
            </div>
            <div class="row_four">
              <a href="javascript:void(0)" v-for="(item_four, index_four) in item.json_data.row_four.data"
                v-bind:key="index_four" @click="diyNavTo(item_four)">
                <img v-bind:src="item_four.imgUrl" />
              </a>
            </div>
            <div class="row_five">
              <a href="javascript:void(0)" v-for="(item_five, index_five) in item.json_data.row_five.data"
                v-bind:key="index_five" @click="diyNavTo(item_five)">
                <img v-bind:src="item_five.imgUrl" />
              </a>
            </div>
          </div>
        </div>
        <!-- adv_10 end-->

        <!-- adv_11 start-->
        <div class="adv_11 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_11'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_11_wrap">
            <div class="item row_left">
              <a href="javascript:void(0)" v-for="(item_left, index_left) in item.json_data.row_left.data"
                v-bind:key="index_left" v-bind:class="{ lb_margin: index_left % 2 == 1 }" @click="diyNavTo(item_left)">
                <img v-bind:src="item_left.imgUrl" />
              </a>
            </div>
            <div class="item row_right">
              <div class="top">
                <a href="javascript:void(0)" v-if="item.json_data.row_right.top.data[0] != undefined"
                  @click="diyNavTo(item.json_data.row_right.top.data[0])">
                  <img v-bind:src="item.json_data.row_right.top.data[0].imgUrl" />
                </a>
              </div>
              <div class="bottom">
                <a href="javascript:void(0)" v-if="item.json_data.row_right.bottom.data[0] != undefined"
                  @click="diyNavTo(item.json_data.row_right.bottom.data[0])">
                  <img v-bind:src="item.json_data.row_right.bottom.data[0].imgUrl" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_11 end-->

        <!-- adv_12 start-->
        <div class="adv_12 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_12'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_12_wrap">
            <div class="item left clear_padding">
              <a class="l_img" href="javascript:void(0)" @click="diyNavTo(item.json_data.left.data[0])">
                <img v-bind:src="item.json_data.left.data[0].imgUrl" />
              </a>
            </div>
            <div class="item center">
              <a v-for="(item_center, index_center) in item.json_data.center.data" v-bind:key="index_center"
                v-bind:class="{ l_b_margin: index_center % 2 == 1 }" @click="diyNavTo(item_center)">
                <img v-bind:src="item_center.imgUrl" />
              </a>
            </div>
            <div class="item right">
              <div class="title_wrap" @click="diyNavTo(item.json_data.right.title_info)">
                <a class="title" href="javascript:void(0)">{{ item.json_data.right.title_info.title.initialValue }}</a>
                <span> 》</span>
                <a href="javascript:void(0)" class="subtitle">{{
      item.json_data.right.title_info.sub_title.initialValue
    }}</a>
              </div>
              <div class="img_top">
                <a href="javascript:void(0)" @click="diyNavTo(item.json_data.right.top.data[0])">
                  <img v-bind:src="item.json_data.right.top.data[0].imgUrl" />
                </a>
              </div>
              <div class="img_bottom">
                <a class="l_img" href="javascript:void(0)"
                  v-for="(item_right_bottom, index_right_bottom) in item.json_data.right.bottom.data"
                  v-bind:key="index_right_bottom" @click="diyNavTo(item_right_bottom)">
                  <img v-bind:src="item_right_bottom.imgUrl" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_12 end-->

        <!-- adv_13 start-->
        <div class="w_sld_react_1210 adv_13 com_1210_center" v-if="item.json_data && item.json_data.type == 'adv_13'"
          :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_13_wrap">
            <div class="item right" @click="diyNavTo(item.json_data.left.title_info)">
              <div class="title_wrap">
                <a class="title" href="javascript:void(0)">{{ item.json_data.left.title_info.title.initialValue }}</a>
                <span> 》</span>
                <a class="subtitle" href="javascript:void(0)">{{
      item.json_data.left.title_info.sub_title.initialValue
    }}</a>
              </div>
              <div class="img_top">
                <a class href="javascript:void(0)" @click="diyNavTo(item.json_data.left.top.data[0])">
                  <img v-bind:src="item.json_data.left.top.data[0].imgUrl" />
                </a>
              </div>
              <div class="img_bottom">
                <a class href="javascript:void(0)"
                  v-for="(item_left_bottom, index_left_bottom) in item.json_data.left.bottom.data"
                  v-bind:key="index_left_bottom" v-bind:class="{ l_b_margin: index_left_bottom % 2 == 0 }"
                  @click="diyNavTo(item_left_bottom)">
                  <img v-bind:src="item_left_bottom.imgUrl" />
                </a>
              </div>
            </div>
            <div class="item right">
              <div class="title_wrap" @click="diyNavTo(item.json_data.center.title_info)">
                <a class="title" href="javascript:void(0)">{{ item.json_data.center.title_info.title.initialValue }}</a>
                <span> 》</span>
                <a class="subtitle" href="javascript:void(0)">{{
      item.json_data.center.title_info.sub_title.initialValue
    }}</a>
              </div>
              <div class="img_top">
                <a href="javascript:void(0)" @click="diyNavTo(item.json_data.center.top.data[0])">
                  <img v-bind:src="item.json_data.center.top.data[0].imgUrl" />
                </a>
              </div>
              <div class="img_bottom">
                <a class="l_img" href="javascript:void(0)"
                  v-for="(item_center_bottom, index_center_bottom) in item.json_data.center.bottom.data"
                  v-bind:key="index_center_bottom" @click="diyNavTo(item_center_bottom)">
                  <img v-bind:src="item_center_bottom.imgUrl" />
                </a>
              </div>
            </div>
            <div class="item left clear_padding">
              <a class="l_img" href="javascript:void(0)" @click="diyNavTo(item.json_data.right.data[0])">
                <img :src="item.json_data.right.data[0].imgUrl" />
              </a>
            </div>
          </div>
        </div>
        <!-- adv_13 end-->

        <!-- adv_19 start-->
        <div class="w_sld_react_1210 adv_19" v-if="item.json_data && item.json_data.type == 'adv_19'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_19_wrap">
            <div v-for="(items, index) in item.json_data.data" :key="index" class="item left">
              <div class="top_title" :style="{ backgroundColor: items.top.title_info.title_bg_color }">
                <div class="l_title" :style="{ color: items.top.title_info.title_color }">
                  {{ items.top.title_info.title_name ? items.top.title_info.title_name : L['添加标题'] }}
                </div>
                <div class="r_title">
                  <ul>
                    <li v-for="(val, key) in items.center.right" :key="key" :class="{ sel_tab: key == items.cur_tab }"
                      @mouseover="adv19Tab(item.dataId, index, key, items)">
                      <span class="con">
                        {{ val.title_info.title_name ? val.title_info.title_name : L['添加内容'] }}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="center">
                <div class="l_center">
                  <a href="javascript:;" @click="diyNavTo(items.center.left.data[0])">
                    <img v-if="items.center.left.data[0].imgUrl" :src="items.center.left.data[0].imgUrl" />
                    <span v-else>{{ L['此处添加【186*340】图片'] }}</span>
                  </a>
                </div>
                <div class="r_center">
                  <div class="tabs_panel">
                    <div v-for="(val, key) in items.center.right[items.cur_tab].data" :key="key" class="item">
                      <div class="title_wrap">
                        <a class="main_title" href="javascript:;" @click="diyNavTo(val)">
                          {{ val.main_title ? val.main_title : L['图片标题'] }}
                        </a>
                        <a class="sub_title" href="javascript:;" @click="diyNavTo(val)">
                          {{ val.sub_title ? val.sub_title : L['图片子标题'] }}
                        </a>
                      </div>

                      <div class="bottom_img">
                        <a class="sld_com_no_img" href="javascript:;" @click="diyNavTo(val)">
                          <img v-if="val.imgUrl" :src="val.imgUrl" />
                          <span v-else>{{ L['此处添加【172*106】图片'] }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bottom">
                <a v-for="(val, key) in items.bottom.data" :key="key" class="sld_com_no_img" href="javascript:;"
                  @click="diyNavTo(val)">
                  <img v-if="val.imgUrl" :src="val.imgUrl" />
                  <span v-else>{{ L['此处添加【187*120】图片'] }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_19 end-->

        <!-- adv_20 start-->
        <div class="w_sld_react_1210 adv_20" v-if="item.json_data && item.json_data.type == 'adv_20'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_20_wrap flex_column_start_center">
            <div class="flex_row_around_center adv_20_wrap_row" v-for="(val, key) in item.json_data.data" :key="key">
              <div v-for="(child, child_key) in val" :key="child_key"
                class="flex_column_center_center adv_20_wrap_item">
                <div class="flex_row_center_center  adv_20_wrap_item_img" style="border-radius: 0px;"
                  @click="diyNavTo(child)">
                  <img :src="child.imgUrl" />
                </div>
                <span class="main_title" @click="diyNavTo(child)">{{ child.main_title }}</span>
                <span class="sub_title" @click="diyNavTo(child)">{{ child.sub_title }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_20 end-->

        <!-- adv_21 start-->
        <div class="w_sld_react_1210 adv_21" v-if="item.json_data && item.json_data.type == 'adv_21'" :id="item.id"
          :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
          <div class="adv_21_wrap flex_row_start_start">
            <div class="flex_column_start_start adv_21_wrap_item" v-for="(val1, key1) in item.json_data.data"
              :key="key1">
              <div class="flex_row_between_center title_part" @click="diyNavTo(val1.top_title)">
                <span class="title">{{ val1.top_title.title.initialValue }}</span>
                <a class="view_more">{{ val1.top_title.sub_title.initialValue }}&gt;</a>
              </div>
              <div class="flex_column_start_start detail">

                <div class="flex_row_start_start item" v-for="(val2, key2) in val1.detail" :key="key2">
                  <div class="item_left" @click="diyNavTo(val2.left)">
                    {{ val2.left.title.initialValue }}
                  </div>
                  <div class="flex_row_start_center item_right">
                    <span class="item_right_con" v-for="(val3, key3) in val2.right" :key="key3" @click="diyNavTo(val3)">
                      {{ val3.title.initialValue }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- adv_21 end-->

        <!-- hot_area start -->
        <div v-if="item.json_data && item.json_data.type == 'hot_area'" :id="item.id">
          <hotArea :tpl_info="item.json_data"></hotArea>
        </div>
        <!-- hot_area end -->

        <!-- adv_25 start-->
        <div :id="item.id" v-if="item.json_data && item.json_data.type == 'adv_25'">
          <div class="w_sld_react_1210 adv_25_wrap" id="adv_25_wrap_id"
            :style="{ paddingTop: item.json_data.padding_top + 'px', paddingBottom: item.json_data.padding_bottom + 'px', backgroundColor: item.json_data.bg_color }">
            <!-- 标题图片-start -->
            <div id="adv_25_wrap_top">
              <div class="floor_title" v-if="item.json_data.title_info && item.json_data.title_info.title_img">
                <div>
                  <img :src="item.json_data.title_info.title_img" alt="">
                </div>
              </div>
              <!-- 标题图片-end -->
              <div class="floor_tab_wrapper" id="floor_tab_wrapper_id">
                <div :style="{ top: adv_25_tab_fixed_height + 'px' }"
                  :class="{ 'floor_tab_wrapper_fixed': adv_25_tab_fixed, 'floor_tab_wrapper_fixed_one': adv_25_tab_fixed && adv_25_tab_fixed_height > 0 }">
                  <!-- tab栏-start -->
                  <div style="width: 1210px;margin: 0 auto;">
                    <MultipleTabs :currentId="adv_25_index" :swiper_list="item.json_data.data"
                      v-if="item.json_data.data" @changeTab="changeTab"></MultipleTabs>
                  </div>
                  <!-- tab栏-end -->
                </div>
                <div v-if="adv_25_tab_fixed" style="width: 100%;height:60px;"></div>
              </div>
            </div>
            <div class="floor_goods">
              <!-- 商品内容-start -->
              <div class="item" v-for="(item_main, index_main) in adv_25_info" v-bind:key="index_main">
                <div class="wrap" @click="goGoodsDetail(item_main)">
                  <a href="javascript:void(0)" class="example_text">
                    <img v-bind:src="item_main.goodsImage" />
                  </a>
                  <p class="title">
                    <a href="javascript:void(0)" title>{{ item_main.goodsName }}</a>
                  </p>
                  <p class="price">
                    <span>
                      {{ L['R$'] }}
                      <span class="money_number">{{ $formatMoneyNum(item_main.goodsPrice || 0) }}</span>
                    </span>
                  </p>
                </div>
              </div>
              <!-- 商品内容-end -->
              <div v-if="loading" style="width: 100%;text-align:center;">
                <img style="width: 40px;height:40px" src="@/assets/loading_more.gif" alt="">
              </div>
              <div v-if="adv_25_info.length == 0 && !loading">
                <SldCommonEmpty totalWidth="1200" totalHeight="350" v-if="adv_25_info.length == 0" />
              </div>
            </div>
            <!-- 标题图片-end -->
          </div>
        </div>

        <!-- adv_25 end-->
        <!-- adv_26 start -->
        <div class="w_sld_react_1210 adv_26_recommended" v-if="item.json_data && item.json_data.type == 'adv_26'"
          :id="item.id">
          <div class="l_center" @click="diyNavTo(item.json_data.img_data)">
            <a href="javascript:;">
              <img v-if="item.json_data.img_data.imgUrl" :src="item.json_data.img_data.imgUrl" />
              <span v-else>{{ L['此处添加【190*260】图片'] }}</span>
            </a>
          </div>
          <div class="adv_26_recommended_box">
            <RecommendGoodsForYou :goodsInfo="item.json_data.data.goods_data"></RecommendGoodsForYou>
          </div>
        </div>
        <!-- adv_26 end -->
        <!-- adv_27 start -->
        <div class="w_sld_react_1210 adv_27_warp"
          v-if="item.json_data && item.json_data.type == 'adv_27' && adv_27_info.length > 0" :id="item.id">
          <!-- adv_27 left start -->
          <div class="adv_27_warp_box adv_27_warp_Car">
            <div class="adv_27_warp_box_title"
              :style="{ background: item.json_data.left.background.initialValue ? `linear-gradient(0deg, #FFFFFF, ${item.json_data.left.background.initialValue})` : 'linear-gradient(0deg, #FFFFFF, #FFE9E9);' }">
              <div class="adv_27_title"
                :style="{ color: item.json_data.left.title_color.initialValue ? item.json_data.left.title_color.initialValue : '#333333' }">
                {{ item.json_data.left.title.initialValue ? item.json_data.left.title.initialValue : '栏目标题' }}</div>
              <i class="iconfont iconyoujiantou adv_27_icon" @click="diyNavTo(item.json_data.left)"></i>
            </div>
            <el-carousel indicator-position="none" :interval="6000" arrow="always" type="card" height="147px"
              @change="carouselChange($event, item.json_data.num)">
              <!-- carouselList -->
              <el-carousel-item
                v-for="(it, ind) in item.json_data.left.data.goods_ids.length > 0 ? item.json_data.left.data.goods_data : carouselList"
                :key="ind">
                <router-link :to="`/goods/detail?productId=${it.productId}`" target="_blank"
                  v-if="item.json_data.left.data.goods_ids.length > 0">
                  <div class="carousel_img">
                    <img :src="it.mainImage" alt="">
                  </div>
                </router-link>
                <div class="carousel_img" v-else>
                  <div class="carousel_img_carouse">
                    <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;"></i>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="adv_27_warp_box_shop_cont">
              <!-- carouselIndex.value -->
              <div class="adv_27_warp_box_shop_title">{{
      item.json_data.left.data.goods_ids.length > 0 ?
        item.json_data.left.data.goods_data[carouselIndex[item.json_data.num]].goodsName : '商品标题商品标题'
    }}</div>
              <div class="adv_27_warp_box_shop_price" v-if="item.json_data.left.data.goods_ids.length > 0 && item.json_data.left.data.goods_data[carouselIndex[item.json_data.num]].goodsPrice > 0"><span>R$</span><span>{{
        item.json_data.left.data.goods_ids.length > 0 ?
          $formatMoneyNum(item.json_data.left.data.goods_data[carouselIndex[item.json_data.num]].goodsPrice) : ''
      }}</span></div>
            </div>
          </div>
          <!-- adv_27 left end -->
          <!-- adv_27 left_center start -->
          <div class="adv_27_warp_box">
            <div class="adv_27_warp_box_title"
              :style="{ background: item.json_data.left_center.background.initialValue ? `linear-gradient(0deg, #FFFFFF, ${item.json_data.left_center.background.initialValue})` : 'linear-gradient(0deg, #FFFFFF, #FFE9E9);' }">
              <div class="adv_27_title"
                :style="{ color: item.json_data.left_center.title_color.initialValue ? item.json_data.left_center.title_color.initialValue : '#333333' }">
                {{ item.json_data.left_center.title.initialValue ? item.json_data.left_center.title.initialValue :
      '栏目标题'
                }}
              </div>
              <i class="iconfont iconyoujiantou adv_27_icon" @click="diyNavTo(item.json_data.left_center)"></i>
            </div>
            <div class="adv_27_warp_box_goods">

              <div class="adv_27_warp_item"
                v-for="(it, ind) in item.json_data.left_center.data.goods_ids.length > 0 ? item.json_data.left_center.data.goods_data[adv_27_info[item.json_data.num].left_center_num] : 4"
                :key="ind">
                <router-link class="flex_column_center_center" :to="`/goods/detail?productId=${it.productId}`"
                  target="_blank"
                  v-if="item.json_data.left_center && item.json_data.left_center.data.goods_ids.length > 0">
                  <div class="adv_27_warp_item_img"
                    :class="{ 'adv_27_warp_item_img_one': item.json_data.left_center && item.json_data.left_center.data.goods_ids.length == 0 }">
                    <img :src="it.mainImage" alt="" v-if="it.mainImage">
                    <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                  </div>
                  <div class="adv_27_warp_item_title">{{ it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
                </router-link>
                <div class="adv_27_warp_item_img"
                  :class="{ 'adv_27_warp_item_img_one': item.json_data.left_center && item.json_data.left_center.data.goods_ids.length == 0 }"
                  v-if="item.json_data.left_center && item.json_data.left_center.data.goods_ids.length == 0">
                  <img :src="it.mainImage" alt="" v-if="it.mainImage">
                  <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                </div>
                <div class="adv_27_warp_item_title"
                  v-if="item.json_data.left_center && item.json_data.left_center.data.goods_ids.length == 0">{{
      it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
              </div>
            </div>
          </div>
          <!-- adv_27 left_center end -->
          <!-- adv_27 right_center start -->
          <div class="adv_27_warp_box">
            <div class="adv_27_warp_box_title"
              :style="{ background: item.json_data.right_center.background.initialValue ? `linear-gradient(0deg, #FFFFFF, ${item.json_data.right_center.background.initialValue})` : 'linear-gradient(0deg, #FFFFFF, #FFE9E9);' }">
              <div class="adv_27_title"
                :style="{ color: item.json_data.right_center.title_color.initialValue ? item.json_data.right_center.title_color.initialValue : '#333333' }">
                {{ item.json_data.right_center.title.initialValue ? item.json_data.right_center.title.initialValue :
      '栏目标题' }}
              </div>
              <i class="iconfont iconyoujiantou adv_27_icon" @click="diyNavTo(item.json_data.right_center)"></i>
            </div>
            <div class="adv_27_warp_box_goods">
              <div class="adv_27_warp_item"
                v-for="(it, ind) in item.json_data.right_center.data.goods_ids.length > 0 ? item.json_data.right_center.data.goods_data[adv_27_info[item.json_data.num].right_center_num] : 4"
                :key="ind">
                <router-link class="flex_column_center_center" :to="`/goods/detail?productId=${it.productId}`"
                  target="_blank"
                  v-if="item.json_data.right_center && item.json_data.right_center.data.goods_ids.length > 0">
                  <div class="adv_27_warp_item_img"
                    :class="{ 'adv_27_warp_item_img_one': item.json_data.right_center && item.json_data.right_center.data.goods_ids.length == 0 }">
                    <img :src="it.mainImage" alt="" v-if="it.mainImage">
                    <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                  </div>
                  <div class="adv_27_warp_item_title">{{ it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
                </router-link>
                <div class="adv_27_warp_item_img"
                  :class="{ 'adv_27_warp_item_img_one': item.json_data.right_center && item.json_data.right_center.data.goods_ids.length == 0 }"
                  v-if="item.json_data.right_center && item.json_data.right_center.data.goods_ids.length == 0">
                  <img :src="it.mainImage" alt="" v-if="it.mainImage">
                  <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                </div>
                <div class="adv_27_warp_item_title"
                  v-if="item.json_data.right_center && item.json_data.right_center.data.goods_ids.length == 0">{{
      it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
              </div>
            </div>
          </div>
          <!-- adv_27 right_center end -->
          <!-- adv_27 right start -->
          <div class="adv_27_warp_box">
            <div class="adv_27_warp_box_title"
              :style="{ background: item.json_data.right.background.initialValue ? `linear-gradient(0deg, #FFFFFF, ${item.json_data.right.background.initialValue})` : 'linear-gradient(0deg, #FFFFFF, #FFE9E9);' }">
              <div class="adv_27_title"
                :style="{ color: item.json_data.right.title_color.initialValue ? item.json_data.right.title_color.initialValue : '#333333' }">
                {{ item.json_data.right.title.initialValue ? item.json_data.right.title.initialValue : '栏目标题' }}</div>
              <i class="iconfont iconyoujiantou adv_27_icon" @click="diyNavTo(item.json_data.right)"></i>
            </div>
            <div class="adv_27_warp_box_goods">
              <div class="adv_27_warp_item"
                v-for="(it, ind) in item.json_data.right.data.goods_ids.length > 0 ? item.json_data.right.data.goods_data[adv_27_info[item.json_data.num].right_num] : 4"
                :key="ind">
                <router-link class="flex_column_center_center" :to="`/goods/detail?productId=${it.productId}`"
                  target="_blank" v-if="item.json_data.right && item.json_data.right.data.goods_ids.length > 0">
                  <div class="adv_27_warp_item_img"
                    :class="{ 'adv_27_warp_item_img_one': item.json_data.right && item.json_data.right.data.goods_ids.length == 0 }">
                    <img :src="it.mainImage" alt="" v-if="it.mainImage">
                    <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                  </div>
                  <div class="adv_27_warp_item_title">{{ it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
                </router-link>

                <div class="adv_27_warp_item_img"
                  :class="{ 'adv_27_warp_item_img_one': item.json_data.right && item.json_data.right.data.goods_ids.length == 0 }"
                  v-if="item.json_data.right && item.json_data.right.data.goods_ids.length == 0">
                  <img :src="it.mainImage" alt="" v-if="it.mainImage">
                  <i class="iconfont iconshangpin-" style="font-size: 34px;color: #D2D2D2;" v-else></i>
                </div>
                <div class="adv_27_warp_item_title"
                  v-if="item.json_data.right && item.json_data.right.data.goods_ids.length == 0">{{
                  it.goodsName ? it.goodsName : '商品标题商品标题' }}</div>
              </div>
            </div>
          </div>
          <!-- adv_27 right end -->
        </div>
        <!-- adv_27 end -->
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrentInstance, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import hotArea from '@/components/hotArea'
import RecommendGoodsForYou from '@/components/recommendGoodsForYou'
import MainBanner2 from './MainBanner2.vue';
import MainBanner3 from './MainBanner3.vue';
import FloorNav from '@/components/FloorNav'
import MultipleTabs from './MultipleTabs.vue'
import SldCommonEmpty from '@/components/SldCommonEmpty';
import CategorySort from './CategorySort.vue'

export default {
  name: "SldDiy",
  props: {
    decorateData: Object,//装修的数据
    source: String,//来源，home:平台首页  store:供应商装修
  },
  components: {
    hotArea,
    MainBanner2,
    MainBanner3,
    MultipleTabs,
    SldCommonEmpty,
    RecommendGoodsForYou,
    FloorNav,
    CategorySort
  },
  setup (props) {
    const route = useRoute()
    const { proxy } = getCurrentInstance();
    const L = proxy.$getCurLanguage();
    const marginLeft = ref(0)
    const carouselIndex = ref([])
    const carouselList = ref([1, 2, 3, 4, 5])
    const diyNavTo = (val) => {
      if (route.query.vid) {
        val.storeId = route.query.vid
      }
      proxy.$diyNavTo(val)
    }
    const goGoodsDetail = (val) => {
      proxy.$goGoodsDetail(val.productId || val.defaultProductId)
    }
    const goGoodsListByCatId = (val) => {
      proxy.$goGoodsListByCatId(val)
    }
    //adv_19楼层tab切换事件
    const adv19Tab = (dataId, index, key, items) => {
      items.cur_tab = key
    }

    const params = ref({ pageSize: 30, current: 1 })

    // adv26轮播
    const carouselChange = (e, num) => {
      carouselIndex.value[num] = e
    }

    // adv27 start
    const adv_27_info = ref([])
    const adv_27_type = ref(false)
    // adv27 end


    // adv25 end
    const adv_25_info = ref([])
    const adv_25_index = ref(0)
    const adv_25_scrollTop = ref(0)
    const adv_25_total = ref(0)
    const adv_25_tab_fixed = ref(false)
    const adv_25_tab_fixed_height = ref(0)
    const showGoods = ref(false)
    const adv_25_scrollType = ref(false)
    const adv_25_scrollTypeList = ref(false)
    const loading = ref(false)

    const swpierData = computed(() => {
      let type = ['main_banner', 'main_banner_2', 'main_banner_3']
      let { decorateData } = props
      let target = decorateData.data.find(item => {
        return type.includes(item.json_data.type)
      })
      return target
    })

    const bigBackground = computed(() => {
      return props.decorateData.data.find(item => item.json?.type == 'main_background')
    })

    const main_nav = computed(() => {
      let { decorateData } = props
      let target = decorateData.data.find(item => item.json?.type == 'main_nav')
      let hasNavList = decorateData.data.filter(i => i.nav).map(j => ({ id: j.id, ...j.nav }))
      if (target && target.json) {
        target.json.nav_data = hasNavList
      }
      return target
    })

    // 获取tab下的商品
    const getList = (index) => {
      let decorateDataInfo = props.decorateData
      decorateDataInfo.data.map(item => {
        if (item.json_data && item.json_data.type == 'adv_25') {
          // showGoods为true是条件查找 false为固定商品
          if (item.json_data.data[index].qc.showGoods) {
            loading.value = true
            showGoods.value = true
            proxy.$get('v3/supplier/channel/goods/goodsList', { ...item.json_data.data[index].qc, ...params.value }).then(res => {
              if (res.state == 200) {
                let total_one = res.data.pagination.total / res.data.pagination.pageSize

                params.value.current = res.data.pagination.current
                adv_25_total.value = res.data.pagination.total
                if (res.data.pagination.current == 1) {
                  adv_25_info.value = res.data.list
                } else {
                  adv_25_info.value = [...adv_25_info.value, ...res.data.list]
                }
                // 条件查询的话增加滚动事件
                if (!adv_25_scrollType.value) {
                  window.removeEventListener('scroll', handleScroll, true)
                  window.addEventListener('scroll', handleScroll, true)
                  adv_25_scrollType.value = true
                }
                // 当请求完时判断是否是全部数据
                if (res.data.pagination.current >= total_one) {
                  adv_25_scrollTypeList.value = true
                } else {
                  adv_25_scrollTypeList.value = false
                }
                // loading
                loading.value = false
              } else {
                loading.value = false
                adv_25_info.value = []
                adv_25_scrollTypeList.value = true
              }
            })
          } else {
            // 固定商品直接赋值
            adv_25_info.value = item.json_data.data[index].info
            showGoods.value = false
            if (!adv_25_scrollType.value) {
              window.removeEventListener('scroll', handleScroll, true)
              window.addEventListener('scroll', handleScroll, true)
              adv_25_scrollType.value = true
            }
          }

        }
        if (item.json_data && item.json_data.type == 'adv_27') {
          adv_27_type.value = true
          item.json_data.num = adv_27_info.value.length
          carouselIndex.value.push(0)
          adv_27_info.value.push({
            left_center: item.json_data.left_center.data.goods_data.length - 1,
            left_center_num: 0,
            right_center: item.json_data.right_center.data.goods_data.length - 1,
            right_center_num: 0,
            right: item.json_data.right.data.goods_data.length - 1,
            right_num: 0,
          })
        }
      })
      if (adv_27_type.value) {
        adv_27_goods_setTime()
      }
    }

    //滚动事件
    const handleScroll = () => {
      // 获取滚动高度
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      adv_25_scrollTop.value = scrollTop
      // 标题图片和tab栏
      let floor_tab_wrapper_id = scrollTop > 600 ? document.getElementById('adv_25_wrap_top').getBoundingClientRect().top + scrollTop - 57 + document.getElementById('adv_25_wrap_top')?.offsetHeight : document.getElementById('adv_25_wrap_top').getBoundingClientRect().top + scrollTop + document.getElementById('adv_25_wrap_top')?.offsetHeight
      // 当滚动距离大于标题图片和tab栏的位置时 tab栏固定定位
      if (scrollTop > floor_tab_wrapper_id) {
        adv_25_tab_fixed.value = true
        adv_25_tab_fixed_height.value = scrollTop > 600 ? 57 : 0
      } else {
        adv_25_tab_fixed.value = false
        adv_25_tab_fixed_height.value = scrollTop > 600 ? 57 : 0
      }
      // 为条件查找时滚动到一定高度请求数据
      if (showGoods.value) {
        let offsetTop = Number(document.getElementById('adv_25_wrap_id')?.offsetTop) - Number(document.getElementById('adv_25_wrap_top')?.offsetHeight) + Number(document.getElementById('adv_25_wrap_id')?.offsetHeight) - 930
        if (scrollTop >= offsetTop && !adv_25_scrollTypeList.value) {
          adv_25_scrollTypeList.value = true
          params.value.current = params.value.current + 1
          getList(adv_25_index.value)
        }
      }

    }

    // 多tab切换事件
    const changeTab = (index) => {
      if (index != adv_25_index.value) {
        adv_25_index.value = index
        params.value = { pageSize: 30, current: 1 }
        getList(adv_25_index.value)
      }
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let floor_tab_wrapper_id = adv_25_scrollTop.value > 600 ? document.getElementById('floor_tab_wrapper_id').getBoundingClientRect().top + scrollTop - 57 : document.getElementById('floor_tab_wrapper_id').getBoundingClientRect().top + scrollTop
      window.scrollTo({ top: floor_tab_wrapper_id })
    }
    // adv25 end

    // adv27 start
    const adv_27_goods_setInterval = ref(null)
    const adv_27_goods_setTime = () => {
      adv_27_goods_setInterval.value = setInterval(() => {
        adv_27_info.value.forEach(item => {
          if (item.left_center) {
            if (item.left_center > item.left_center_num) {
              item.left_center_num += 1
            } else {
              item.left_center_num = 0
            }
          }
          if (item.right_center) {
            if (item.right_center > item.right_center_num) {
              item.right_center_num += 1
            } else {
              item.right_center_num = 0
            }
          }
          if (item.right) {
            if (item.right > item.right_num) {
              item.right_num += 1
            } else {
              item.right_num = 0
            }
          }
        })
      }, 5000)
    }
    // adv27 end



    onMounted(() => {
      window.removeEventListener('scroll', handleScroll, true)
      getList(0)
    })


    // 卸载handleScroll事件
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll, true)
      if (adv_27_goods_setInterval.value != null) {
        clearInterval(adv_27_goods_setInterval.value)
        adv_27_goods_setInterval.value = null
      }
    })


    return { main_nav, swpierData, bigBackground, L, goGoodsDetail, diyNavTo, adv19Tab, goGoodsListByCatId, marginLeft, changeTab, getList, adv_25_info, adv_25_index, adv_25_total, adv_25_scrollType, adv_25_scrollTypeList, showGoods, adv_25_tab_fixed, adv_25_tab_fixed_height, adv_25_scrollTop, loading, carouselChange, carouselIndex, carouselList, adv_27_info, adv_27_goods_setInterval, adv_27_goods_setTime, adv_27_type, };
  },
};
</script>
<style lang="scss">
.adv_27_warp_Car {
  overflow: hidden;

  .el-carousel--card {
    // width: 480px !important;
    // position: relative;
    // left: -92px;
  }

  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 120px;
    margin: 0;
    text-align: center;
  }

  .el-carousel__item {
    opacity: 0.2;
  }

  .el-carousel__item.is-active {
    opacity: 1;
  }

  .el-carousel__item:nth-child(2n) {
    display: flex;
    // align-items: center;
    // justify-content: center;
    height: 142px;
  }

  .el-carousel__item:nth-child(2n + 1) {
    height: 142px;
  }

  .el-carousel__indicators--outside {
    display: none !important;
  }

  .carousel_img {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    img {
      width: 147px;
      height: 147px;
    }

    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: 120px;
      margin: 0;
      text-align: center;
    }

    .el-carousel__item {
      .carousel_img {
        position: relative;

        &::before {
          content: '';
          width: 147px;
          height: 147px;
          position: absolute;
          left: 0;
          top: 0;
          background: rgba($color: #fff, $alpha: 0.7);
        }
      }
    }

    .el-carousel__item.is-active {
      opacity: 1;

      .carousel_img {
        position: relative;

        &::before {
          content: '';
          width: 147px;
          height: 147px;
          position: absolute;
          left: 0;
          top: 0;
          background: transparent;
        }
      }
    }

    .el-carousel__item:nth-child(2n) {
      display: flex;
      // align-items: center;
      // justify-content: center;
      height: 142px;
    }

    .el-carousel__item:nth-child(2n + 1) {
      height: 142px;
    }

    .el-carousel__indicators--outside {
      display: none !important;
    }

    .carousel_img {
      width: 100%;
      display: flex;
      background: #EEEEEE;
      align-items: center;
      justify-content: center;
    }
  }

  .el-carousel__arrow {
    width: 26px;
    height: 35px;
    line-height: 35px;
    border-radius: 0;
    background-color: rgba(0, 0, 0, .15);
    font-size: 13px !important;

    &:hover {
      background-color: rgba(0, 0, 0, .4);
    }
  }

  .el-carousel__arrow--right {
    // right: 93px;
    right: 0;

    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    padding-left: 5px;

    .el-icon-arrow-right {
      font-weight: bold;
    }
  }

  .el-carousel__arrow--left {
    // left: 92px;
    left: 0;
    border-top-right-radius: 18px;
    border-bottom-right-radius: 18px;
    padding-right: 5px;

    .el-icon-arrow-left {
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../style/mixins.scss";
@import "../style/decorate.scss";

.sld_diy {

  position: relative;
  z-index: 9;

  .main_banner_1 {
    position: relative;

    #category_sort {
      display: block;
      top: 0px !important;
      left: calc((100% - 1210px)/2);
    }
  }


  .banner_area {
    position: relative;

  }

  .pc_main_diy {
    position: relative;

  }



  .main_background {
    width: 100%;
    overflow-x: hidden;
    z-index: -1;
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0;
    margin: 0px;
    height: 100%;


    .main_background_image {
      width: 100%;
      background-repeat: no-repeat;
      background-position: 50% 0;
      height: 100%;
    }


  }

  .el-carousel {
    width: 100%;
    margin: 0 auto;
  }

  background: #f8f8f8;

  .main_banner {
    .el-carousel__item {
      /* width: 1920px;
              /*图片宽度*/
      /* position: absolute;
              left: 50%;
              margin-left: -960px; */
      /* 图片宽度的一半 */
      display: flex;
      justify-content: center;
      align-items: center;

      div {
        background-position: center center;
        width: 1920px;
        height: 457px;
        position: absolute;
        left: 50%;
        top: 0;
        margin-left: -960px;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }


  .main_banner {
    width: 100%;
    height: 457px;
    position: relative;
    overflow: hidden;
    margin: 0 auto;

    .nav-menu {
      position: absolute;
      left: 50%;
      margin-left: -600px;
      top: -3px;
      width: 187px;
      height: 457px;
      z-index: 9;
      background-color: rgba(0, 0, 0, 0.6);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;

      .menu-wrap {
        .menu-item {
          height: 39px;
          line-height: 39px;
          margin: 5px 0;
          position: relative;

          .first_cat {
            width: 125px;
            display: block;
            font-size: 16px;
            color: #ffffff;
            padding-left: 30px;
            text-overflow: ellipsis;
            overflow: hidden;
            position: relative;

            .nav-menu {
              position: absolute;
              left: 50%;
              margin-left: -600px;
              top: -3px;
              width: 187px;
              height: 457px;
              z-index: 9;
              background-color: rgba(0, 0, 0, 0.6);
              -webkit-box-sizing: border-box;
              box-sizing: border-box;

              .menu-wrap {
                .menu-item {
                  height: 39px;
                  line-height: 39px;
                  margin: 5px 0;

                  .first_cat {
                    width: 125px;
                    display: block;
                    font-size: 16px;
                    color: #ffffff;
                    padding-left: 30px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    position: relative;

                    &:after {
                      position: absolute;
                      right: 0px;
                      top: 12.5px;
                      content: " ";
                      width: 7px !important;
                      height: 14px !important;
                      @include bgImg(7px, 14px, "/imgs/arrow_right.png");
                    }
                  }

                  &:hover {
                    background-color: var(--color_main);

                    .children {
                      display: inline-block;
                    }
                  }

                  .children {
                    display: none;
                    width: 1013px;
                    height: 417px;
                    background-color: #fff;
                    position: absolute;
                    top: 0;
                    left: 187px;
                    padding: 20px 0;

                    .fore-dl {
                      width: 100%;
                      clear: both;
                      overflow: hidden;
                    }

                    dt {
                      position: relative;
                      float: left;
                      width: 152px;
                      padding: 8px 30px 0 0;
                      text-align: right;
                      font-weight: 700;
                      line-height: 2em;
                      overflow: hidden;
                      white-space: nowrap;

                      i {
                        position: absolute;
                        top: 11px;
                        right: 18px;
                        width: 4px;
                        height: 14px;
                        font: 400 9px/14px consolas;
                      }

                      .second {
                        color: #333;
                        font-size: 14px;
                        width: 140px;
                        overflow: hidden;
                        display: inline-block;
                        line-height: 18px;
                        text-overflow: ellipsis;
                      }
                    }

                    dd {
                      border-top: none;
                      border-bottom: 1px dashed #dddddd;
                      width: 790px;
                      padding: 6px 0;
                      float: left;
                      line-height: 16px;
                      margin-left: 15px;
                    }

                    .third {
                      float: left;
                      padding: 0 8px;
                      margin: 4px 0;
                      line-height: 16px;
                      height: 16px;
                      border-right: 1px solid #e0e0e0;
                      white-space: nowrap;
                      color: #999;
                      font-size: 13px;
                    }

                    .children_item {
                      display: flex;
                      flex-direction: row;
                      justify-content: flex-start;
                      align-items: flex-start;
                      flex-wrap: wrap;
                      height: 30px;

                      .li_wrap {
                        height: 30px;
                        line-height: 30px;
                        flex: 1;
                        padding-left: 23px;

                        a {
                          line-height: 30px;
                          height: 30px;
                          color: #999999;
                        }
                      }

                      a {
                        color: var(--color_main);
                        font-size: 14px;
                      }

                      img {
                        width: 42px;
                        height: 35px;
                        vertical-align: middle;
                        margin-right: 15px;
                      }
                    }
                  }
                }
              }
            }
          }

          &:hover {
            background-color: var(--color_main);

            .children {
              display: inline-block;
            }
          }

          .children {
            display: none;
            width: 1013px;
            height: 417px;
            background-color: #fff;
            position: absolute;
            top: 0;
            left: 187px;
            padding: 20px 0;

            .fore-dl {
              width: 100%;
              clear: both;
              overflow: hidden;
            }

            dt {
              position: relative;
              float: left;
              width: 152px;
              padding: 8px 30px 0 0;
              text-align: right;
              font-weight: 700;
              line-height: 2em;
              overflow: hidden;
              white-space: nowrap;

              i {
                position: absolute;
                top: 11px;
                right: 18px;
                width: 4px;
                height: 14px;
                font: 400 9px/14px consolas;
              }

              .second {
                color: #333;
                font-size: 14px;
                width: 140px;
                overflow: hidden;
                display: inline-block;
                line-height: 18px;
                text-overflow: ellipsis;
              }
            }

            dd {
              border-top: none;
              border-bottom: 1px dashed #dddddd;
              width: 790px;
              padding: 6px 0;
              float: left;
              line-height: 16px;
              margin-left: 15px;
            }

            .third {
              float: left;
              padding: 0 8px;
              margin: 4px 0;
              line-height: 16px;
              height: 16px;
              border-right: 1px solid #e0e0e0;
              white-space: nowrap;
              color: #999;
              font-size: 13px;
            }

            .children_item {
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: flex-start;
              flex-wrap: wrap;
              height: 30px;

              .li_wrap {
                height: 30px;
                line-height: 30px;
                flex: 1;
                padding-left: 23px;

                a {
                  line-height: 30px;
                  height: 30px;
                  color: #999999;
                }
              }

              a {
                color: var(--color_main);
                font-size: 14px;
              }

              img {
                width: 42px;
                height: 35px;
                vertical-align: middle;
                margin-right: 15px;
              }
            }
          }
        }
      }
    }

    .swiper-container {
      width: 100%;
      height: 100%;
      position: absolute;

      .swiper-slide {
        a {
          display: inline-block;
          width: 100%;
          height: 100%;

          img {
            width: 1920px;
            height: 100%;
            margin-left: -960px;
            left: 50%;
            position: relative;
            overflow: hidden;
          }
        }
      }
    }
  }

  .main_diy {
    margin-top: 10px;
  }

  .product-box {
    background-color: $colorJ;
    padding: 30px 0 50px;

    h2 {
      font-size: $fontF;
      height: 21px;
      line-height: 21px;
      color: var(--color_main);
      margin-bottom: 20px;
    }

    .wrapper {
      display: flex;

      .banner-left {
        margin-right: 16px;

        img {
          width: 224px;
          height: 619px;
        }
      }

      .list-box {
        .list {
          @include flex();
          width: 986px;
          margin-bottom: 14px;

          &:last-child {
            margin-bottom: 0;
          }

          .item {
            width: 236px;
            height: 302px;
            background-color: $colorG;
            text-align: center;

            span {
              display: inline-block;
              width: 67px;
              height: 24px;
              font-size: 14px;
              line-height: 24px;
              color: $colorG;

              &.new-pro {
                background-color: #7ecf68;
              }

              &.kill-pro {
                background-color: #e82626;
              }
            }

            .item-img {
              img {
                width: 100%;
                height: 195px;
              }
            }

            .item-info {
              h3 {
                font-size: 14px;
                color: var(--color_main);
                line-height: 14px;
                font-weight: bold;
              }

              p {
                color: $colorD;
                line-height: 13px;
                margin: 6px auto 13px;
              }

              .price {
                color: #f20a0a;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;

                &:after {
                  @include bgImg(22px, 22px, "/imgs/icon-cart-hover.png");
                  content: " ";
                  margin-left: 5px;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>