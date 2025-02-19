import { defineComponent } from "vue";
import './MiniCompo.scss'
import remindIcon from '@/assets/buy/remind.png'
import { ElDialog } from 'element-plus'
import { getCurLanguage } from '@/utils/common'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
export const RestrictMessage = defineComponent({
  props: {
    show: Boolean
  },
  setup (props) {
    return () => (
      <div className="restrict_message flex_row_start_center" v-show={props.show}>
        <div className="flex_row_start_center">
          <img src={remindIcon} width="12" height="15"></img>
          <span style={{ marginLeft: '9px' }} className="message">当前收货地址不支持配送，请修改收货地址。</span>
        </div>
      </div>
    )
  }
})


export const DisabledProductModal = defineComponent({

  props: {
    type: Number,
    show: Boolean,
    title: String,
    goodsList: {
      type: Array,
      default: () => []
    },
    state: Number,
    mode: {
      type: String,
      default: 'confirmOrder'
    }
  },

  components: {
    ElDialog
  },

  setup (props, { emit, slots }) {
    const router = useRouter()
    const L = getCurLanguage()

    const returnLastPage = () => {
      emit('update:show', false)

      if (props.state != 8) {
        router.back(1)
      }
    }

    const closed = () => {
      emit('update:show', false)

    }

    return () => (
      <ElDialog title={props.title} modelValue={props.show} customClass="out_store_width"
        lockScroll={false} onClosed={closed} width={600}>
        <div>
          <div className="disabled_product_dialog">
            {
              props.goodsList.map((goodsItem, goodsIndex) => (
                <div key={goodsIndex} className="good_item flex_row_start_center">
                  <div className="goods_img_con">
                    <img src={goodsItem.goodsImage} alt />
                  </div>
                  <div className="good_info">
                    <span className="good_name overflow_ellipsis">{goodsItem.goodsName}</span>
                    <div className="spec_num flex_row_between_center">
                      <span className="good_spec">{goodsItem.specValues}</span>
                    </div>
                    <span className="good_num">*{goodsItem.buyNum}</span>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="footer flex_row_center_center">
            {
              props.mode == 'confirmOrder' && <ElButton onClick={returnLastPage}>{L['返回']}</ElButton>
            }

            {slots.footer?.()}
          </div>
        </div>
      </ElDialog>
    )
  }
})