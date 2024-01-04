import clsx from 'clsx'
import { Text } from '@tarojs/components'
import { RectRight } from '@nutui/icons-react-taro'

import InjectSVG from '../../assets/home/injection.svg'

import { dayjs } from '../../utils'
import { VaccinationRecord } from '../../api/methods'
import { useProfiles, useVaccineRecordList, useVaccines } from '../../api/hooks'
import { useRecordPopup } from '../../models'

export type VacCalendarData = {
  date: string
  record: VaccinationRecord
  expireDate: boolean
}

type VacCalendarItemProps = {
  key: number
  record: VaccinationRecord
  hideOverlook?: boolean
}

export function MergeItems(raw: VaccinationRecord[]) {
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

export function VacCalendarItem({ key, record, hideOverlook = false }: VacCalendarItemProps) {
  const { id2name } = useProfiles()
  const showPopup = useRecordPopup.use.show()

  const { id2name: getVacname } = useVaccines()

  const overlook = record.isCompleted
  const needWarning = !record.isCompleted && dayjs(record.vaccinationDate).isBefore(dayjs())
  const timeError = record.isCompleted && dayjs(record.vaccinationDate).isAfter(dayjs())

  if (hideOverlook && overlook) return null

  return (
    <li
      key={key}
      className={clsx(
        'flex h-16 flex-row items-center justify-between rounded-2xl bg-slate-100 px-4 transition-all active:scale-105 active:shadow-md',
        {
          'animate-fade-in': !overlook,
          'opacity-60 filter saturate-50': overlook,
          'ring-2 ring-brand': needWarning,
        }
      )}
      onClick={() => showPopup(record.ID)}
    >
      <div className='flex flex-row items-center gap-x-2'>
        <div className='h-10 w-10 rounded-full bg-brand p-2'>
          <img src={InjectSVG} className='h-full w-full invert' />
        </div>
        <div className='flex flex-col'>
          <Text className='font-semibold text-brand truncate'>
            {id2name(record.profileId)} {getVacname(record.vaccineId)} {record.isCompleted ? '已接种' : '未接种'}
          </Text>
          <Text className={clsx('text-xs', { 'text-red-500': timeError, 'text-gray-500': !timeError })}>
            接种：{record.vaccinationDate}
          </Text>
        </div>
      </div>
      <RectRight color='gray' />
    </li>
  )
}

export function VacCalendarItemExpire({ key, record, hideOverlook = false }: VacCalendarItemProps) {
  const { id2name } = useProfiles()
  const showPopup = useRecordPopup.use.show()
  const { getVaccineState } = useVaccineRecordList()
  const state = getVaccineState(record.profileId, record.vaccineId)

  const { id2name: getVacname } = useVaccines()

  if (record.isCompleted === false) return null
  const currentDate = dayjs()
  const overlook = state.inEffect && currentDate.isAfter(dayjs(record.nextVaccinationDate))
  const needHighlight = !state.inEffect && currentDate.isAfter(dayjs(record.nextVaccinationDate))

  if (hideOverlook && overlook) return null

  return (
    <li
      key={key}
      className={clsx(
        'flex h-16 flex-row items-center justify-between rounded-2xl bg-gray-100 px-4 transition-all active:scale-105 active:shadow-md',
        {
          'animate-fade-in': !overlook,
          'ring-2 ring-gray-500': needHighlight,
          'opacity-40': overlook,
        }
      )}
      onClick={() => showPopup(record.ID)}
    >
      <div className='flex flex-row items-center gap-x-2'>
        <div className='h-10 w-10 rounded-full bg-gray-200 p-2'>
          <img src={InjectSVG} className='h-full w-full' />
        </div>
        <div className='flex flex-col'>
          <Text className='font-semibold truncate'>
            {id2name(record.profileId)} {getVacname(record.vaccineId)}{' '}
            {overlook ? '已补种' : needHighlight ? '已过期' : '未过期'}
          </Text>
          <Text className='text-xs text-gray-500'>过期：{record.nextVaccinationDate}</Text>
        </div>
      </div>
      <RectRight color='gray' />
    </li>
  )
}
