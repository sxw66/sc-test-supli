// 售后商品信息组件 @ljp-2021/1/4
<template>
    <!-- 退款商品信息 start -->
    <div class="sld_refund_goods flex_row_between_start">
        <div class="refund_goods_left flex_row_start_start">
            <div class="refund_goods_img" :style="{backgroundImage:'url(' + refundOrderDetail.productImage + ')'}"></div>
            <div class="refund_goods_des">
                <p>{{refundOrderDetail.goodsName}}</p>
                <p>{{refundOrderDetail.specValues}}</p>
            </div>
        </div>
        <div class="refund_goods_num">*{{refundOrderDetail.currNum || refundOrderDetail.productNum}}</div>
    </div>
    <!-- 退款商品信息 end -->
</template>

<script>
export default {
    props:{
        refundOrderDetail:{
            type:Object,
            value:{}
        }
    },
    setup(){
       
    }
}
</script>

<style lang="scss">
.sld_refund_goods{
    padding: 20px;
    .refund_goods_left{
        .refund_goods_img{
            width: 100px;
            height: 100px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
        .refund_goods_des{
            margin-left: 20px;
            p:nth-child(1){
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                line-height: 18px;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;      
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                width: 444px;
                margin-top: 8px;
                margin-bottom: 20px;
            }
            p:nth-chid(2){
                width: 444px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #999999;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                margin-top: 19px;
            }
        }
    }
    .refund_goods_num{
        width: 100px;
        text-align: center;
        line-height: 100px;
        font-size: 12px;
    }
}
</style>