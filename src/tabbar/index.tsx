import { Tabbar, Button } from '@nutui/nutui-react-taro'
import { Home, Location2, Uploader, Date, My } from '@nutui/icons-react-taro'
import { useEffect } from 'react'

import './index.css'

import { useTabStore } from '../models'
import ButtonActionSheet, { useActionStore, useActionReset } from './actionsheet'

function CustomTabBar() {
  const setTabIndex = useTabStore((state) => state.setTabIndex)
  const tabIndex = useTabStore((state) => state.tabIndex)

  const setIsVisible = useActionStore((state) => state.setActionVisible)
  useEffect(useActionReset, [])

  return (
    <>
      <Tabbar className='customtabbar' fixed safeArea onSwitch={(index) => setTabIndex(index)} value={tabIndex}>
        <Tabbar.Item title='首页' icon={<Home width={18} height={18} />} />
        <Tabbar.Item title='地图' icon={<Location2 width={18} height={18} />} />
        <Button
          className='add-btn'
          icon={<Uploader width={18} height={18} />}
          type='primary'
          onClick={() => setIsVisible(true)}
        />
        <Tabbar.Item title='日程' icon={<Date width={18} height={18} />} />
        <Tabbar.Item title='我的' icon={<My width={18} height={18} />} />
      </Tabbar>
      <ButtonActionSheet />
    </>
  )
}

export default CustomTabBar
