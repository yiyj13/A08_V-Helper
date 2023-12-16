/* TODO: 
    1. feat: allow editing the record
    2. feat: show the detail of the record
    3. feat: filtering the record by date automatically
    4. feat: filtering the record by record type manually
*/

import { useState, useEffect } from 'react'
import { Tabs } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
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
              {profileInfo.relationship}
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

  const handleEditRecord = (recordData: TemperatureRecord) => {
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
          体温值 <b className='text-black font-bold'>{data.temperature}</b>
        </div>
      </div>
    </div>
  )
}
