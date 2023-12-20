/* TODO: 
    1. feat: show the detail of the record: HOW?
    2. feat: filtering the record by record type manually
*/

import { useState, useEffect } from 'react'
import { Tabs } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

import api from '../../api'

import { Profile, VaccinationRecord, TemperatureRecord } from '../../api/methods'

export default function RecordHistory() {
  const [vaccinationRecordList, setVaccinationRecordList] = useState<VaccinationRecord[]>([])
  const [temperRecordList, setTemperRecordList] = useState<TemperatureRecord[]>([])

  const [tab1value, setTab1value] = useState('0')

  useEffect(() => {
    const router = Taro.getCurrentInstance().router

    const fetchData = async () => {
      if (router && router.params && router.params.id !== undefined) {
        try {
          const vacRes = await api.get('/api/vaccination-records/profile/' + router.params.id)
          const sortedVacRes = vacRes.data.sort(
            (a, b) => new Date(a.vaccinationDate).getTime() - new Date(b.vaccinationDate).getTime()
          )
          setVaccinationRecordList(sortedVacRes as VaccinationRecord[])
          const tempRes = await api.get('/api/temperature-records/profile/' + router.params.id)
          const sortedTempRes = tempRes.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setTemperRecordList(sortedTempRes as TemperatureRecord[])
        } catch (error) {
          console.error('Error fetching member information:', error)
          Taro.showToast({ title: '获取成员信息失败', icon: 'error' })
        }
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Tabs
        value={tab1value}
        onChange={(value: string) => {
          setTab1value(value)
        }}
      >
        <Tabs.TabPane title='接种档案'>
          {vaccinationRecordList.map((item, index) => (
            <VaccineItemRender data={item} key={index} />
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane title='体温档案'>
          {temperRecordList.map((item, index) => (
            <TemperItemRender data={item} key={index} />
          ))}
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

const VaccineItemRender = ({ data }: { data: VaccinationRecord }) => {
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

  // const handleReadDocument = (recordData: VaccinationRecord) => {
  //   Taro.navigateTo({
  //     url: `/pages/record/index?id=` + recordData.ID, // 修改record的跳转逻辑
  //   })
  // }
  return (
    <div
      className='border border-gray-300 p-2 rounded-md'
      style={{ borderRadius: '8px', marginLeft: '6px', marginRight: '6px' }}
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
        {/* <Eye className='cursor-pointer' onClick={() => handleReadDocument(data)} style={{ marginRight: '10px' }} /> */}
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          接种疫苗 <b className='text-black font-bold'>{data.vaccine.name}</b>
        </div>
        <div className='text-gray-500'>
          接种类型 <b className='text-black font-bold'>{data.vaccinationType}</b>
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

const TemperItemRender = ({ data }: { data: TemperatureRecord }) => {
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

  // const handleReadDocument = (recordData: TemperatureRecord) => {
  //   Taro.navigateTo({
  //     url: `/pages/temper/index?id=` + recordData.ID, // 修改record的跳转逻辑
  //   })
  // }
  let colorClass = ''

  if (data.temperature > 38) {
    colorClass = 'text-red-500' // 红色
  } else if (data.temperature > 37) {
    colorClass = 'text-orange-500' // 橙色
  } else {
    colorClass = 'text-black' // 默认颜色
  }

  return (
    <div
      className='border border-gray-300 p-2 rounded-md'
      style={{ borderRadius: '8px', marginLeft: '6px', marginRight: '6px' }}
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
        {/* <Eye className='cursor-pointer' onClick={() => handleReadDocument(data)} style={{ marginRight: '10px' }} /> */}
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          测温时间 <b className='text-black font-bold'>{data.date}</b>
        </div>
        <div className='text-gray-500'>
          体温值 <b className={`text-black font-bold ${colorClass}`}>{data.temperature.toFixed(1)}</b>
        </div>
      </div>
    </div>
  )
}
