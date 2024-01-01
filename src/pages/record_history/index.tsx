import clsx from 'clsx'
import { useState, useMemo } from 'react'
import { Button, Menu } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

import { useProfiles, useVaccineRecordList, useVaccines } from '../../api'

import { VaccinationRecord } from '../../api/methods'
import { dayjs } from '../../utils'
import { useCalendarStore } from '../../models'
import { Header } from '../../components/calendarheader'

export default function RecordHistory() {
  const { data: recordList } = useVaccineRecordList()
  const vaccinationRecordList = useMemo(() => {
    if (!recordList) return []
    const result = recordList as VaccinationRecord[]
    return result
      .filter((r) => r.isCompleted)
      .sort((a, b) => dayjs(b.vaccinationDate).unix() - dayjs(a.vaccinationDate).unix())
  }, [recordList])

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/record/index' })
  }

  const menuValue = useCalendarStore.use.profileId()

  return (
    <>
      <Header title='接种记录' />
      <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
        {vaccinationRecordList
          ?.filter((item) => (menuValue !== undefined ? item.profileId === menuValue : true))
          .map((item, index) => (
            <ItemRender data={item} key={index} />
          ))}
        <Button
          type='primary'
          onClick={handleAddRecord}
          style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 999 }}
          className='font-semibold'
        >
          + 新增记录
        </Button>
      </div>
    </>
  )
}

const ItemRender = ({ data }: { data: VaccinationRecord }) => {
  const { selectByID } = useProfiles()
  const profileInfo = selectByID(data.profileId)
  const { id2name } = useVaccines()

  const handleEditRecord = (recordData: VaccinationRecord) => {
    Taro.navigateTo({
      url: `/pages/record/index?id=` + recordData.ID,
    })
  }

  const expired = dayjs().isAfter(dayjs(data.nextVaccinationDate))

  return (
    <div
      className='relative overflow-hidden rounded-lg border border-gray-100 p-4 shadow-md mx-4 my-2 active:scale-105 active:shadow-xl transition-all'
      onClick={() => handleEditRecord(data)}
    >
      <span
        className={clsx('absolute inset-x-0 bottom-0 h-1', 'bg-gradient-to-r from-brand to-green-200', {
          'bg-gradient-to-r from-brand to-red-200': expired,
        })}
      ></span>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <IconFont className='text-2xl mr-2' name={profileInfo?.avatar} style={{ width: '40px', height: '40px' }} />
          <div className='flex justify-between mt-2'>
            <div className='font-bold' style={{ color: '#4796A1' }}>
              {profileInfo?.relationship}
            </div>
            <div className='font-bold ml-2'>{profileInfo?.fullName}</div>
          </div>
        </div>
        <div className='flex items-center justify-center space-x-1'>
          <div className='h-1 w-1 rounded-full bg-black'></div>
          <div className='h-1 w-1 rounded-full bg-black'></div>
          <div className='h-1 w-1 rounded-full bg-black'></div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2 mt-4 text-xs'>
        <div className='text-gray-500 truncate'>
          接种疫苗 <b className='text-black font-bold '>{id2name(data.vaccineId)}</b>
        </div>
        <div className='text-gray-500 truncate'>
          接种类型 <b className='text-black font-bold'>{data.vaccinationType}</b>
        </div>
        <div className='text-gray-500 truncate'>
          接种日期 <b className='text-black font-bold'>{data.vaccinationDate}</b>
        </div>
        <div className='text-gray-500 truncate'>
          到期时间{' '}
          <b className={clsx('text-black font-bold', { 'text-red-400': expired })}>{data.nextVaccinationDate}</b>
        </div>
      </div>
    </div>
  )
}
