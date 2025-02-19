//自行diy的checkBox,用element的类名，
//因为变量为数值时，el-checkbox的v-model无效，checked有效但无法响应式变化
export function CheckBox (props) {
  return (
    <div className={props.checked ? 'el-checkbox is-checked' : 'el-checkbox'} style={{ cursor: props.disabled ? 'not-allowed' : 'pointer' }}>
      <div className={props.checked ? 'el-checkbox__input is-checked' : 'el-checkbox__input'}>
        <span className="el-checkbox__inner"></span>
      </div>
    </div>
  )
}
