import { Tabbar, Button } from '@nutui/nutui-react-taro'
import { Home, Search, Find, Uploader, My } from '@nutui/icons-react-taro'

import './index.css'

import { useTabStore } from '../models'
import ButtonActionSheet from './actionsheet'

function CustomTabBar() {
  const setTabIndex = useTabStore((state) => state.setTabIndex)
  const tabIndex = useTabStore((state) => state.tabIndex)

  const setIsVisible = useTabStore((state) => state.setActionVisible)

  return (
    <>
      <Tabbar className='customtabbar' fixed safeArea onSwitch={(index) => setTabIndex(index)} value={tabIndex}>
        <Tabbar.Item title='首页' icon={<Home width={18} height={18} />} />
        <Tabbar.Item title='查询' icon={<Search width={18} height={18} />} />
        <Button
          className='add-btn'
          icon={<Uploader width={18} height={18} />}
          type='primary'
          onClick={() => setIsVisible(true)}
        />
        <Tabbar.Item title='社区' icon={<Find width={18} height={18} />} />
        <Tabbar.Item title='我的' icon={<My width={18} height={18} />} />
      </Tabbar>
      <ButtonActionSheet />
    </>
  )
}

export default CustomTabBar
