/* TODO: 
    1. feat: show the detail of the record: HOW?
    2. feat: filtering the record by record type manually
*/

import { useState, useMemo } from 'react'
import { Tabs } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'

import { useVaccineRecordList, useTemperatureList, useVaccines } from '../../api'
import { dayjs } from '../../utils'

import { VaccinationRecord, TemperatureRecord } from '../../api/methods'

export default function RecordHistory() {
  const [tab1value, setTab1value] = useState('0')
  const router = Taro.getCurrentInstance().router
  const profileId = parseInt(router?.params.id as string)

  const { data: recordList } = useVaccineRecordList()
  const { data: allTempers } = useTemperatureList()

  const vaccinationRecordList = useMemo(() => {
    if (!recordList) return []
    const result = recordList as VaccinationRecord[]
    return result
      .filter((r) => r.profileId === profileId && r.isCompleted)
      .sort((a, b) => dayjs(b.vaccinationDate).unix() - dayjs(a.vaccinationDate).unix())
  }, [recordList, profileId])

  const temperRecordList = useMemo(() => {
    if (!allTempers) return []
    const result = allTempers as TemperatureRecord[]
    return result.filter((r) => r.profileId === profileId).sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix())
  }, [allTempers, profileId])

  return (
    <>
      <Tabs
        tabStyle={{
          backgroundColor: '#ffffff',
        }}
        value={tab1value}
        onChange={(value: string) => {
          setTab1value(value)
        }}
        // @ts-ignore
        activeType='card'
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
  const { id2name } = useVaccines()

  return (
    <div className='bg-gray-100 p-3 rounded-xl mt-2'>
      <div className='grid grid-cols-2 gap-2 mt-2'>
        <div className='flex flex-col text-gray-500'>
          接种疫苗 <b className='text-black font-bold truncate'>{id2name(data.vaccineId)}</b>
        </div>
        <div className='flex flex-col text-gray-500'>
          接种类型 <b className='text-black font-bold truncate'>{data.vaccinationType}</b>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2 mt-2'>
        <div className='flex flex-col text-gray-500'>
          接种日期 <b className='text-black font-bold truncate'>{data.vaccinationDate}</b>
        </div>
        <div className='flex flex-col text-gray-500'>
          到期时间 <b className='text-black font-bold truncate'>{data.nextVaccinationDate}</b>
        </div>
      </div>
    </div>
  )
}

const TemperItemRender = ({ data }: { data: TemperatureRecord }) => {
  let colorClass = ''

  if (data.temperature > 38) {
    colorClass = 'text-red-500' // 红色
  } else if (data.temperature > 37) {
    colorClass = 'text-orange-500' // 橙色
  } else {
    colorClass = 'text-black' // 默认颜色
  }

  return (
    <div className='bg-gray-100 p-3 rounded-xl mt-2'>
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
