import { Text } from '@tarojs/components'
import { RectRight } from '@nutui/icons-react-taro'

import InjectSVG from '../../assets/home/injection.svg'

import { VaccineRecord } from '../../api/methods'

export type VacCalendarData = {
  date: string
  record: VaccineRecord
  expireDate: boolean
}

type VacCalendarItemProps = {
  key: number
  record: VaccineRecord
}

export function MergeItems(raw: VaccineRecord[]) {
  const vacCalendar = raw?.map((record) => ({
    date: record.vaccinationDate,
    record,
    expireDate: false,
  })) as VacCalendarData[]

  const expireCalendar = raw?.map((record) => ({
    date: record.nextVaccinationDate,
    record,
    expireDate: true,
  })) as VacCalendarData[]

  return [...vacCalendar, ...expireCalendar]
}

export function VacCalendarItem({ key, record }: VacCalendarItemProps) {
  return (
    <li
      key={key}
      className='flex h-16 animate-fade-in flex-row items-center justify-between rounded-2xl bg-slate-100 px-4 transition-all active:scale-105 active:shadow-md'
    >
      <div className='flex flex-row items-center gap-x-2'>
        <div className='h-10 w-10 rounded-full bg-brand p-2'>
          <img src={InjectSVG} className='h-full w-full invert' />
        </div>
        <div className='flex flex-col'>
          <Text className='font-semibold text-brand'>
            {record.profileId} {record.vaccine.name} 接种
          </Text>
          <Text className='text-sm text-gray-500'>{record.vaccinationDate}</Text>
        </div>
      </div>
      <RectRight color='gray' />
    </li>
  )
}

export function VacCalendarItemExpire({ key, record }: VacCalendarItemProps) {
  return (
    <li
      key={key}
      className='flex h-16 animate-fade-in flex-row items-center justify-between rounded-2xl bg-gray-100 px-4 transition-all active:scale-105 active:shadow-md'
    >
      <div className='flex flex-row items-center gap-x-2'>
        <div className='h-10 w-10 rounded-full bg-gray-200 p-2'>
          <img src={InjectSVG} className='h-full w-full' />
        </div>
        <div className='flex flex-col'>
          <Text className='font-semibold'>
            {record.profileId} {record.vaccine.name} 过期
          </Text>
          <Text className='text-sm text-gray-500'>{record.nextVaccinationDate}</Text>
        </div>
      </div>
      <RectRight color='gray' />
    </li>
  )
}


