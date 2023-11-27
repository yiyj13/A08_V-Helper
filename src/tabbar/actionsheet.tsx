import { ActionSheet } from '@nutui/nutui-react-taro'
import { useRouter } from 'taro-hooks'
import { create } from 'zustand'

export default function ButtonActionSheet() {
  const [isVisible, setIsVisible] = useActionStore((state) => [state.actionVisible, state.setActionVisible])

  const [, { navigate }] = useRouter()

  const navDual = (url: string) => () => navigate(url).finally(setIsVisible(false))

  return (
    <ActionSheet
      visible={isVisible}
      onSelect={(item, index) => {
        console.log(index)
      }}
      onCancel={() => setIsVisible(false)}
    >
      <div style={{ textAlign: 'left', padding: '10px 20px' }}>免疫接种</div>
      <div style={{ textAlign: 'left', padding: '10px 20px' }}>预约提醒</div>
      <div style={{ textAlign: 'left', padding: '10px 20px' }} onClick={navDual('/pages/sendpost/index')}>
        我要发帖
      </div>
      <div style={{ textAlign: 'left', padding: '10px 20px' }}>体温测量</div>
    </ActionSheet>
  )
}

interface IActionStore {
  actionVisible: boolean
  setActionVisible: (visible: boolean) => void
}
export const useActionStore = create<IActionStore>()((set) => ({
  actionVisible: false,
  setActionVisible: (visible: boolean) => set((_state) => ({ actionVisible: visible })),
}))

export function useActionReset() {
  useActionStore.setState({ actionVisible: false })
}
