import { Avatar, Button } from '@nutui/nutui-react-taro'
import { Follow, Notice, People, RectRight, Comment, Ask, Tips } from '@nutui/icons-react-taro'
import { useUserStore } from '../../models'
import Taro from '@tarojs/taro'

export default function ProfilePage() {
  const removeToken = useUserStore.use.removeToken()

  const handleLogout = () => {
    removeToken()
  }

  return (
    <div className='flex flex-col items-center h-without-tab'>
      <div className='flex flex-col h-full w-11/12 m-5 rounded-2xl std-box-shadow'>
        <ProfileCard />

        <div className='flex flex-row justify-between ml-4 mr-4'>
          <ActionFlexRowItem
            icon={<People size={24} className='brand-color' />}
            text='成员档案'
            onClick={() => Taro.navigateTo({ url: '/pages/member/index' })}
          />
          <ActionFlexRowItem icon={<Follow size={24} className='brand-color' />} text='收藏记录' />
          <ActionFlexRowItem icon={<Comment size={24} className='brand-color' />} text='社区回复' />
        </div>

        <div className='flex flex-col m-4'>
          <ActionFlexColItem icon={<Notice size={24} className='brand-color' />} text='消息设置' onClick={() => Taro.navigateTo({ url: '/pages/my/notice/index' })} />
          <ActionFlexColItem icon={<Ask size={24} className='brand-color' />} text='反馈' onClick={() => Taro.navigateTo({ url: '/pages/my/feedback/index' })} />
          <ActionFlexColItem icon={<Tips size={24} className='brand-color' />} text='关于' onClick={() => Taro.navigateTo({ url: '/pages/my/about/index' })} />
        </div>

        <div className='flex flex-col-reverse h-full p-8 m-auto'>
          <Button fill='outline' type='danger' onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProfileCard() {
  return (
    <div className='flex p-4 m-4 items-center justify-between active:bg-gray-100 rounded-2xl'>
      <div className='flex flex-row'>
        <div className='mr-4 flex-shrink-0'>
          <Avatar size='64' />
        </div>
        <div>
          <h4 className='text-lg font-bold'>Username</h4>
          <p className='mt-1 text-gray-500'>ID: 88888888</p>
        </div>
      </div>
      <RectRight />
    </div>
  )
}

interface IActionItem {
  icon: React.ReactNode
  text: string
  onClick?: () => any
}

function ActionFlexColItem(props: IActionItem) {
  const { icon, text, onClick } = props
  return (
    <div
      className='flex flex-row pl-4 pr-4 justify-between items-center h-14 active:bg-gray-100 rounded-xl'
      onClick={onClick}
    >
      <div className='flex flex-row items-center'>
        {icon}
        <p className='ml-4'>{text}</p>
      </div>
      <RectRight color='gray' />
    </div>
  )
}

function ActionFlexRowItem(props: IActionItem) {
  const { icon, text, onClick } = props
  return (
    <div className='flex flex-col items-center p-4 active:bg-gray-100 rounded-2xl' onClick={onClick}>
      {icon}
      <p className='mt-2'>{text}</p>
    </div>
  )
}
