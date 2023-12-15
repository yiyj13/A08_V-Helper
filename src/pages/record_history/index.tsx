/* TODO: 
    1. fix the bug of the profileInfo
*/

import { useState, useEffect } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro, { useDidShow } from '@tarojs/taro'

import api from '../../api'

import { Profile, VaccinationRecord } from '../../api/methods'

export default function RecordHistory() {
  const [vaccinationRecordList, setVaccinationRecordList] = useState<VaccinationRecord[]>([])

  useDidShow(() => {
    api.request({ url: '/api/vaccination-records' }).then((res) => {
      const result = res.data as VaccinationRecord[]
      setVaccinationRecordList(result)
    })
  })

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/record/index' })
  }

  return (
    <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
      {vaccinationRecordList.map((item, index) => (
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

const ItemRender = ({ data }: { data: VaccinationRecord }) => {
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

  const handleEditRecord = (recordData: VaccinationRecord) => {
    Taro.navigateTo({
      url: `/pages/record/index?id=` + recordData.ID, // 修改record的跳转逻辑
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
              {data.profileId}
            </div>
            <div className='font-bold ml-2'>{profileInfo.fullName}</div>
          </div>
        </div>
        <Edit className='cursor-pointer' onClick={() => handleEditRecord(data)} />
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          接种疫苗 <b className='text-black font-bold'>{data.vaccine.name}</b>
        </div>
        <div className='text-gray-500'>
          接种类型 <b className='text-black font-bold'>{data.vaccine.type}</b>
        </div>
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          接种日期 <b className='text-black font-bold'>{data.vaccinationDate}</b>
        </div>
        <div className='text-gray-500'>
          到期时间 <b className='text-black font-bold'>{data.nextVaccinationDate}</b>
        </div>
      </div>
    </div>
  )
}