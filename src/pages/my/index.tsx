import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Avatar, Button } from '@nutui/nutui-react-taro'
import { Follow, Notice, People, RectRight, Comment, Ask, Tips } from '@nutui/icons-react-taro'
import { getUserID, useUserStore } from '../../models'

import { Userinfo, getUserInfo, updateUserInfo } from '../../api/methods'

import useSWR from 'swr'

export default function ProfilePage() {
  const removeToken = useUserStore.use.removeUserInfo()

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
          <ActionFlexRowItem
            icon={<Follow size={24} className='brand-color' />}
            text='收藏记录'
            onClick={() => Taro.navigateTo({ url: '/pages/my/follow/index' })}
          />
          <ActionFlexRowItem
            icon={<Comment size={24} className='brand-color' />}
            text='社区回复'
            onClick={() => Taro.navigateTo({ url: '/pages/my/myposts/index' })}
          />
        </div>

        <div className='flex flex-col m-4'>
          <ActionFlexColItem
            icon={<Notice size={24} className='brand-color' />}
            text='消息设置'
            onClick={() => Taro.navigateTo({ url: '/pages/my/notice/index' })}
          />
          <ActionFlexColItem
            icon={<Ask size={24} className='brand-color' />}
            text='反馈'
            onClick={() => Taro.navigateTo({ url: '/pages/my/feedback/index' })}
          />
          <ActionFlexColItem
            icon={<Tips size={24} className='brand-color' />}
            text='关于'
            onClick={() => Taro.navigateTo({ url: '/pages/my/about/index' })}
          />
          {/* <ActionFlexColItem icon={<Tips size={24} className='brand-color' />} text='参考' onClick={() => Taro.navigateTo({ url: '/pages/reference/index' })} /> */}
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
  const [userInfo, setUserInfo] = useState<Partial<Userinfo>>()
  useEffect(() => {
    const handleUserAvatar = async () => {
      try {
        const res = await Taro.getUserProfile({
          desc: '用于完善用户资料',
        })
        setUserInfo({
          ...userInfo,
          avatar: res.userInfo.avatarUrl,
          userName: res.userInfo.nickName,
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    handleUserAvatar()
  }, [])

  return (
    <div className='flex p-4 m-4 items-center justify-between active:bg-gray-100 rounded-2xl'>
      <div className='flex flex-row'>
        <div className='mr-4 flex-shrink-0'>
          <Avatar size='64' src={userInfo?.avatar} />
        </div>
        <div>
          <h4 className='text-lg font-bold'>{userInfo ? userInfo.userName : 'Username:'}</h4>
          <p className='mt-1 text-gray-500'>{userInfo ? `ID: ${getUserID()}` : 'ID: '}</p>
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
