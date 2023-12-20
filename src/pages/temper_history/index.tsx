/* TODO: 
    1. feat: filtering the record by profile manually
*/

import { useState, useEffect } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'

import api from '../../api'

import { Profile, TemperatureRecord } from '../../api/methods'

export default function TemperHistory() {
  const [temperRecordList, setTemperRecordList] = useState<TemperatureRecord[]>([])

  useDidShow(() => {
    api.request({ url: '/api/temperature-records' }).then((res) => {
      const result = res.data as TemperatureRecord[]
      result.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      setTemperRecordList(result)
    })
  })

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/temper/index' })
  }

  return (
    <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
      {temperRecordList.map((item, index) => (
        <ItemRender data={item} key={index} />
      ))}
      <Button
        type='primary'
        onClick={handleAddRecord}
        style={{ width: '90%', position: 'fixed', bottom: '10px', marginLeft: '5%', marginRight: '5%', zIndex: 999 }}
      >
        新增记录
      </Button>
    </div>
  )
}

const ItemRender = ({ data }: { data: TemperatureRecord }) => {
  const [profileInfo, setProfileInfo] = useState<Profile>({} as Profile)

  const getProfileInfo = (profileId: number) => {
    api.request({ url: '/api/profiles/' + profileId }).then((res) => {
      const result = res.data as Profile
      setProfileInfo(result)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      await getProfileInfo(data.profileId)
    }
    fetchData()
  }, [])

  const handleEditRecord = (recordData: TemperatureRecord) => {
    Taro.navigateTo({
      url: `/pages/temper/index?id=` + recordData.ID,
    })
  }

  return (
    <div
      className='border border-gray-300 p-4 rounded-md'
      style={{ borderRadius: '8px', marginLeft: '10px', marginRight: '10px' }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <IconFont className='text-2xl mr-2' name={profileInfo.avatar} style={{ width: '40px', height: '40px' }} />
          <div className='flex justify-between mt-2'>
            <div className='font-bold' style={{ color: '#4796A1' }}>
              {profileInfo.relationship}
            </div>
            <div className='font-bold ml-2'>{profileInfo.fullName}</div>
          </div>
        </div>
        <Edit className='cursor-pointer' onClick={() => handleEditRecord(data)} />
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          测温时间 <b className='text-black font-bold'>{data.date}</b>
        </div>
        <div className='text-gray-500'>
          体温值 <b className='text-black font-bold'>{data.temperature.toFixed(1)}</b>
        </div>
      </div>
    </div>
  )
}
