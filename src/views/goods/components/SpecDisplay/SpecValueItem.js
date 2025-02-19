import { computed, defineComponent, toRefs, ref } from "vue"
import { ElMessage } from 'element-plus'
import { getCurLanguage } from "@/utils/common"
import { useStore } from 'vuex'

export const SpecValueItem = defineComponent({
    props: {
        specValue: Object
    },
    setup (props) {
        const store = useStore()
        const { image = '', specValue = {} } = toRefs(props.specValue)

        // checkState : 1-选中，2-可选，3-禁用
        const specValclass = computed(() => {
            let className = 'specval_pre'
            let checkStateClass = {
                1: 'specval_pre_active',
                3: 'specval_pre_disabled'
            }
            return `${className} ${checkStateClass[props.specValue.checkState] ?? ''}`
        })

        const specValueImage = computed(() => ({
            backgroundImage: `url(${image.value})`
        }))
        
        // 监听鼠标进入事件
        const handleMouseEnter = (event) => {
            // 删除当前元素同级的所有 specval_pre_active 类
            const siblings = event.target.parentElement.children
            for (let sibling of siblings) {
                sibling.classList.remove('specval_pre_active')
            }
            // 添加当前元素的 specval_pre_active 类
            event.target.classList.add('specval_pre_active')
            // 更新 store 中的图片
            store.commit('setMainImageUrl', image.value)
            // 存入时间戳让watchEffect触发
            store.commit('setTimestamp', Date.now())
        }
        return () => (
            <div className={`${specValclass.value} cursor_pointer`}
             onmouseenter={(e) => handleMouseEnter(e)}
            >
                {image.value ? <div className="specval_pre_image" style={specValueImage.value} title={specValue.value}></div> :
                    <span class="specval_pre_text" title={specValue.value}>{specValue.value}</span>
                }
            </div>
        )
    }
})



export const SpecCheckIcon = defineComponent({
    props: {
        checkState: Number,
        disabled: Boolean
    },
    setup (props) {
        const className = computed(() => {
            let checkStateClass = {
                1: 'iconduihao1',
                2: 'iconyuanquan1',
                3: 'iconyuanquan1'
            }

            return `iconfont ${checkStateClass[props.checkState]}`
        })
        return () => (
            <i className={`${className.value} check_icon`} style={{ opacity: props.disabled ? '0.5' : '1' }}></i>
        )
    }
})


export const SpecItemEdit = defineComponent({
    props: {
        specValue: Object,
        minBuyNum: Number,
        editNum: Number,
        from: String
    },
    setup (props, { emit }) {
        const L = getCurLanguage()
        const currentSpecNum = ref(props.editNum)
        const isDis = computed(() => {
            let { checkState, productStock } = props.specValue

            let extraBool = props.from == 'spec' ? checkState != 1 : false

            return extraBool || productStock == 0
        })

        const disReduceStyle = computed(() => {
            let min = currentSpecNum.value <= props.minBuyNum
            return {
                opacity: (min) ? '0.5' : '1'
            }
        })

        const disAddStyle = computed(() => {
            // eslint-disable-next-line
            let maxBuyNum = MAX_PRODUCT_STOCK
            let max = currentSpecNum.value >= maxBuyNum
            return {
                opacity: (max) ? '0.5' : '1'
            }
        })


        //改变数量按钮样式（规格）
        const editNumSpec = (type, e) => {
            let { takeOffNum } = props.specValue
            takeOffNum = takeOffNum ?? 1
            // eslint-disable-next-line
            let maxBuyNum = MAX_PRODUCT_STOCK
            let { minBuyNum } = props
            switch (type) {
                case 'reduce': {
                    if (currentSpecNum.value <= minBuyNum) {
                        return
                    } else {
                        currentSpecNum.value -= takeOffNum
                    }
                    break
                }
                case 'edit': {
                    let { value } = e.target
                    if ((!/^[1-9]\d*$/.test(value) && value)) {
                        currentSpecNum.value = minBuyNum
                    } else if (value > maxBuyNum) {
                        currentSpecNum.value = maxBuyNum;
                        ElMessage(L['超过购买限制']);
                    } else {
                        currentSpecNum.value = value
                    }
                    break
                }
                case 'add': {

                    currentSpecNum.value += takeOffNum
                    if (currentSpecNum.value > maxBuyNum) {
                        currentSpecNum.value = maxBuyNum;
                        ElMessage(L['超过购买限制']);
                    }
                    break;
                }
                case 'blur': {
                    if (currentSpecNum.value <= minBuyNum) {
                        currentSpecNum.value = minBuyNum
                        return;
                    }
                    break;
                }
            }
            //对已选清单的对应的规格进行数量同步
            emit('update:editNum', currentSpecNum.value)
        };

        return () => (
            <div className="quantity_inventory_multi">
                <div class="flex_column_start_center">
                    <div class="quantity_edit flex_row_start_center">
                        <span onClick={() => editNumSpec('reduce')} style={disReduceStyle.value}>-</span>
                        <input
                            type="number"
                            value={currentSpecNum.value}
                            onInput={(e) => editNumSpec('edit', e)}
                            onBlur={() => editNumSpec('blur')}
                        />
                        <span onClick={() => editNumSpec('add')} style={disAddStyle.value}>+</span>
                        {
                            isDis.value && (<div class="disable_mask"></div>)
                        }

                    </div>
                </div>
            </div>
        )
    }
})



