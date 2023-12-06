/* TODO: 
    1. Replace VirtualList with ElevatorList
    2. Navigate with the MemberData to fill in the form if the user clicks on the member
*/

import { useState } from 'react'
import { VirtualList, Button } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'

import api from '../../api'

import { Profile } from '../../api/methods'

export default function Member() {
  const [memberDataList, setMemberDataList] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useDidShow(() => {
    api.request({ url: '/api/profiles' }).then((res) => {
      const result = res.data as Profile[]
      setMemberDataList(result)
    })
  })

  // tobefixed: 不必用到virtuallist
  const onScroll = () => {
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      // api.request({ url: '/api/profiles' }).then((res) => {
      //   const result = res.data as MemberData[]
      //   setMemberDataList(result)
      // })
      setIsLoading(false)
    }, 30)
  }

  const handleAddMember = () => {
    Taro.navigateTo({ url: '/pages/addMember/index' })
  }

  const handleEditMember = (memberData: Profile) => {
    Taro.navigateTo({
      // url: `/pages/addMember/index?avatar=${memberData.avatar}&relationship=${memberData.relationship}&name=${memberData.name}&gender=${memberData.gender}&birthday=${memberData.birthday}`,
      url: `/pages/addMember/index?id=` + memberData.ID,
    })
  }

  const itemRender = (data: Profile, dataIndex: number) => {
    return (
      <div
        key={dataIndex}
        className='border border-gray-300 p-4 rounded-md'
        style={{ borderRadius: '8px', marginLeft: '10px', marginRight: '10px' }}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <IconFont className='text-2xl mr-2' name={data.avatar} style={{ width: '60px', height: '60px' }} />
            <div>
              <span className='font-bold' style={{ color: '#4796A1' }}>
                {data.relationship}
              </span>
              <span className='font-bold text-lg'>{data.fullName}</span>
            </div>
          </div>
          <Edit className='cursor-pointer' onClick={() => handleEditMember(data)} />
        </div>
        <div className='flex justify-between mt-2'>
          <div className='text-gray-500'>
            性别 <b className='text-black font-bold'>{data.gender}</b>
          </div>
          <div className='text-gray-500'>
            出生日期 <b className='text-black font-bold'>{data.dateOfBirth}</b>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '80%', position: 'relative' }}>
      <VirtualList itemHeight={130} list={memberDataList} itemRender={itemRender} onScroll={onScroll} />
      <Button
        type='primary'
        onClick={handleAddMember}
        style={{ width: '90%', position: 'absolute', bottom: '10px', marginLeft: '5%', marginRight: '5%' }}
      >
        新增成员
      </Button>
    </div>
  )
}
