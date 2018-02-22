import React from 'react'
import {Select, MenuItem} from 'material-ui'
import { underlineFocusStyle, inputStyle, selectedItemStyle } from 'style/common/materialStyles'

const FormMultiSelect = ({input, label, meta: { touched, error }, value, options, onChange}) => (
  <Select
    {...input}
    underlineStyle={underlineFocusStyle}
    selectedMenuItemStyle={selectedItemStyle}
    menuItemStyle={inputStyle}
    multiple
    hintText={label}
    value={input.value}
    onChange={onChange || input.onChange}
  >
    {options.map(option =>
      <MenuItem
        key={option.value}
        insetChildren
        checked={input.value && input.value.includes(option.value)}
        value={option.value}
        primaryText={option.label}
      />
    )}
  </Select>
)

export default FormMultiSelect
