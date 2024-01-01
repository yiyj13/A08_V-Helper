import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
import clsx from 'clsx'
import { Follow, People, RectRight, Comment } from '@nutui/icons-react-taro'
import { getUserID, useUserStore } from '../../models'

import { useUserPublic } from '../../api'

export default function ProfilePage() {
  const removeToken = useUserStore.use.removeUserInfo()

  const handleLogout = () => {
    removeToken()
  }

  return (
    <div className='flex flex-col items-center h-without-tab'>
      <div className='flex flex-col h-full w-full'>
        <h2 className='text-2xl font-bold ml-6 my-4'>我的账户</h2>
        <ProfileCard />

        <div className='flex flex-col shadow-sm'>
          <ActionFlexColItem
            icon={<People size={18} className='brand-color' />}
            text='成员档案'
            onClick={() => Taro.navigateTo({ url: '/pages/member/index' })}
          />
          <ActionFlexColItem
            icon={<Follow size={18} className='brand-color' />}
            text='收藏记录'
            onClick={() => Taro.navigateTo({ url: '/pages/my/follow/index' })}
          />
          <ActionFlexColItem
            icon={<Comment size={18} className='brand-color' />}
            text='社区回复'
            onClick={() => Taro.navigateTo({ url: '/pages/my/myposts/index' })}
          />
          <ActionFlexColItem
            icon={<RectRight size={18} className='text-red-600' />}
            text='退出登录'
            textClass='text-red-600'
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  )
}

function ProfileCard() {
  const { data } = useUserPublic(getUserID())

  const handleClick = () => Taro.navigateTo({ url: '/pages/my/profile/index' })

  return (
    <div
      className='flex px-6 py-2 items-center justify-between active:bg-gray-100 border-b border-gray-200'
      onClick={handleClick}
    >
      <div className='flex flex-row'>
        <div className='mr-4 flex-shrink-0'>
          <Image
            src={data?.avatar ?? ''}
            className='h-16 w-16 rounded-full object-cover bg-slate-100 shadow-sm'
            mode='aspectFill'
          />
        </div>
        <div>
          <h4 className='text-lg font-bold'>{data?.userName || '匿名'}</h4>
          <p className='mt-1 text-gray-500'>{`ID: ${getUserID()}`}</p>
        </div>
      </div>
      <RectRight />
    </div>
  )
}

interface IActionItem {
  icon: React.ReactNode
  text: string
  textClass?: string
  onClick?: () => any
}

function ActionFlexColItem(props: IActionItem) {
  const { icon, text, onClick, textClass } = props
  return (
    <div
      className='flex flex-row bg-white px-8 py-4 justify-between items-center active:bg-gray-100 border-b border-gray-200'
      onClick={onClick}
    >
      <div className='flex flex-row items-center'>
        {icon}
        <p className={clsx('ml-4 text-sm', textClass)}>{text}</p>
      </div>
      {/* <RectRight size={12} color='gray' /> */}
    </div>
  )
}
