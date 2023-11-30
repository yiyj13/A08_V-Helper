/* TODO: 
    1. Coordinate with the backend APIs (implemented) to get the MemberData
    2. Navigate with the MemberData to fill in the form if the user clicks on the member
*/

import React, { useState, useEffect, useCallback } from 'react'
import { VirtualList, Button } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

type MemberData = {
  avatar: string // 头像
  relationship: string // 与本人关系
  name: string // 成员姓名
  gender: string // 性别
  birthday: string // 出生日期
}

export default function member() {
  const [memberDataList, setMemberDataList] = useState<MemberData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getData = useCallback(() => {
    const data = [
      {
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        relationship: '本人',
        name: '张三',
        gender: '男',
        birthday: '1990/11/01',
      },
      {
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        relationship: '母亲',
        name: '王二',
        gender: '女',
        birthday: '1970/11/01',
      },
    ]
    setMemberDataList((list) => [...list, ...data])
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  const itemRender = (data: MemberData, dataIndex: number) => {
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
              <span className='font-bold text-lg'>{data.name}</span>
            </div>
          </div>
          {/* 问题：如何在跳转链接时把该成员的现有数据一起带过去 */}
          <Edit className='cursor-pointer' onClick={() => Taro.navigateTo({ url: '/pages/addMember/index' })} />
        </div>
        <div className='flex justify-between mt-2'>
          <div className='text-gray-500'>
            性别 <b className='text-black font-bold'>{data.gender}</b>
          </div>
          <div className='text-gray-500'>
            出生日期 <b className='text-black font-bold'>{data.birthday}</b>
          </div>
        </div>
      </div>
    )
  }

  const onScroll = () => {
    if (isLoading) return
    setIsLoading(true)
    setTimeout(() => {
      getData()
      setIsLoading(false)
    }, 30)
  }

  const handleAddMember = () => {
    Taro.navigateTo({ url: '/pages/addMember/index' })
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
