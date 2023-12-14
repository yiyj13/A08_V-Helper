import { PullToRefresh, PullToRefreshProps } from '@nutui/nutui-react-taro'
import { Refresh2 } from '@nutui/icons-react-taro'
import CheckSVG from '../assets/community/check.svg'

type Props = Partial<Omit<PullToRefreshProps, 'canReleaseText' | 'refreshingText' | 'completeText' | 'pullingText'>>

export const PullDownRefresh = (props: Props) => {
  return (
    <PullToRefresh
      {...props}
      canReleaseText={<Refresh2 />}
      refreshingText={<Refresh2 className='animate-spin' />}
      completeText={<img src={CheckSVG} className='w-6 h-6' />}
      pullingText={<></>}
    ></PullToRefresh>
  )
}
