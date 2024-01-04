import Taro from '@tarojs/taro'
import { ActionSheet, Divider } from '@nutui/nutui-react-taro'
import { useTabStore } from '../models'

export default function ButtonActionSheet() {
  const isVisible = useTabStore.use.actionVisible()
  const setIsVisible = useTabStore.use.setActionVisible()

  const navDual = (url: string) => () => {
    setIsVisible(false)
    Taro.navigateTo({ url })
  }

  return (
    <ActionSheet
      visible={isVisible}
      onSelect={(_item, index) => {
        console.log(index)
      }}
      onCancel={() => setIsVisible(false)}
    >
      <div className='px-4 py-3 font-medium' onClick={navDual('/pages/record/index')}>
        +免疫接种
      </div>
      <Divider />
      <div className='px-4 py-3 font-medium' onClick={navDual('/pages/temper/index')}>
        +体温测量
      </div>
      <Divider />
      <div className='px-4 py-3 font-medium' onClick={navDual('/pages/sendpost/index')}>
        +我要发帖
      </div>
    </ActionSheet>
  )
}
