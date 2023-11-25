import { Tabbar, Button } from '@nutui/nutui-react-taro'
import { Home, Location2, Uploader, Date, My } from '@nutui/icons-react-taro'
import { useActionSheet } from 'taro-hooks'

import './index.css'

import { useTabStore } from '../models'

function CustomTabBar() {
  const setTabIndex = useTabStore((state) => state.setTabIndex)
  const tabIndex = useTabStore((state) => state.tabIndex)

  const { show } = useActionSheet()

  // Method 2:
  // const setTabIndex = useTabStore.use.setTabIndex();
  // const tabIndex = useTabStore.use.tabIndex();

  const handleChangeOption = () => {
    show({
      itemList: ['免疫接种', '预约提醒', '我要发帖', '体温测量'],
    })
  }

  return (
    <Tabbar className='customtabbar z-50' fixed safeArea onSwitch={(index) => setTabIndex(index)} value={tabIndex}>
      <Tabbar.Item title='首页' icon={<Home width={18} height={18} />} />
      <Tabbar.Item title='地图' icon={<Location2 width={18} height={18} />} />
      <Button
        className='add-btn'
        icon={<Uploader width={18} height={18} />}
        type='primary'
        onClick={handleChangeOption}
      />
      <Tabbar.Item title='日程' icon={<Date width={18} height={18} />} />
      <Tabbar.Item title='我的' icon={<My width={18} height={18} />} />
    </Tabbar>
  )
}

export default CustomTabBar
