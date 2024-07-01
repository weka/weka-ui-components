import React from 'react'
import { components, MenuListProps } from 'react-select'

import './menuList.scss'

function MenuList({ children, ...props }: MenuListProps) {
  return (
    <components.MenuList {...props}>
      <div className='list-wrapper'>{children}</div>
    </components.MenuList>
  )
}

export default MenuList
