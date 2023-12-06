// NOTE:
// we may migrate 'taro-hooks/useRequest' to 'swr' in the future
// ( Data fetching state management library )

import { ScrollView } from '@tarojs/components'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useRequest } from 'taro-hooks'

import { getVaccineRecordList } from '../../api/methods'

import { MergeItems, VacCalendarItemExpire, VacCalendarItem } from './vacCalendarItem'
import { NetworkError } from '../../components/errors'

// TODO: implement interaction of date picker and scroll view
export default function Index() {
  const [selectedDate, setSelectedDate] = useState<string>('')

  const { data, error } = useRequest(getVaccineRecordList, { cacheKey: 'vacCalendar', staleTime: 5000 })

  const mergedItems = useMemo(
    () => (data ? MergeItems(data).sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()) : null),
    [data]
  )

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    // TODO
  }

  const handleScroll = (e: any) => {
    const newScrollPosition = e.currentTarget.scrollTop

    const scheduleIndex = Math.floor(newScrollPosition / 86)

    const newDate = mergedItems ? mergedItems[scheduleIndex].date : null

    if (newDate) {
      handleDateChange(newDate)
    }
  }

  if (error) {
    return (
      <div className='h-screen'>
        <NetworkError />
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-12 p-4 bg-gray-200 flex flex-row items-center'>
        <input
          type='date'
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className='w-full p-2 border border-gray-300'
        />
      </div>

      <div className='flex-1'>
        <ScrollView scrollY style={{ height: 'calc(100vh - 48px)' }} onScroll={handleScroll}>
          <div className='relative h-[200vh]'>
            <ol className='mt-2 mx-4 space-y-4 text-sm leading-6'>
              {mergedItems?.map((item) => {
                if (item.expireDate) {
                  return <VacCalendarItemExpire key={dayjs(item.date).valueOf()} record={item.record} />
                } else {
                  return <VacCalendarItem key={dayjs(item.date).valueOf()} record={item.record} />
                }
              })}
            </ol>
          </div>
        </ScrollView>
      </div>
    </div>
  )
}
