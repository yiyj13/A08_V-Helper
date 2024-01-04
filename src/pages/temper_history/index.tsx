import clsx from 'clsx'
import { useMemo } from 'react'
import { Button } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

import { useTemperatureList, useProfiles } from '../../api'

import { TemperatureRecord } from '../../api/methods'
import { dayjs } from '../../utils'
import { Header } from '../../components/calendarheader'
import { useCalendarStore } from '../../models'

export default function TemperHistory() {
  const { data: allTempers } = useTemperatureList()
  const menuValue = useCalendarStore.use.profileId()

  const temperRecordList = useMemo(() => {
    if (!allTempers) return []
    const result = allTempers as TemperatureRecord[]
    return result.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
  }, [allTempers])

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/temper/index' })
  }

  return (
    <>
      <Header title='体温记录' />
      <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
        {temperRecordList
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

interface TemperatureRecordProps {
  data: TemperatureRecord
}

const ItemRender: React.FC<TemperatureRecordProps> = ({ data }) => {
  const { selectByID } = useProfiles()
  const profileInfo = selectByID(data.profileId)

  const handleEditRecord = (recordData: TemperatureRecord) => {
    Taro.navigateTo({
      url: `/pages/temper/index?id=${recordData.ID}`,
    })
  }

  const getColorClass = (temperature: number) => {
    if (temperature > 38) return 'text-red-500' // Red
    if (temperature > 37) return 'text-orange-500' // Orange
    return 'text-brand' // Default color
  }

  return (
    <div
      className='relative overflow-hidden rounded-lg border border-gray-100 p-4 shadow-md mx-4 my-2 active:scale-105 active:shadow-xl transition-all'
      onClick={() => handleEditRecord(data)}
    >
      <span
        className={clsx('absolute inset-x-0 bottom-0 h-1', {
          'bg-gradient-to-r from-brand to-red-200': data.temperature > 38,
          'bg-gradient-to-r from-brand to-orange-200': data.temperature > 37 && data.temperature <= 38,
        })}
      ></span>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <IconFont
            className='text-2xl mr-2 rounded-full border bg-white'
            name={profileInfo?.avatar}
            style={{ width: '40px', height: '40px' }}
          />
          <div className='flex flex-col'>
            <div className='flex w-full justify-between'>
              <div className='flex gap-x-2'>
                <span className='font-bold text-gray-500'>{profileInfo?.relationship}</span>
                <span className='font-bold'>{profileInfo?.fullName}</span>
                <div className='text-gray-500 text-sm'>
                  <b className={`text-base font-bold font-sans ${getColorClass(data.temperature)}`}>
                    {data.temperature.toFixed(1) + ' ℃'}
                  </b>
                </div>
              </div>
            </div>
            <div className='text-gray-500 text-xs'>
              测温时间 <b className='text-xs font-semibold text-black font-sans'>{data.date}</b>
            </div>
          </div>
        </div>
        <div className='absolute top-4 right-4 flex items-center justify-center space-x-1'>
          <div className='h-1 w-1 rounded-full bg-black'></div>
          <div className='h-1 w-1 rounded-full bg-black'></div>
          <div className='h-1 w-1 rounded-full bg-black'></div>
        </div>
      </div>
    </div>
  )
}
