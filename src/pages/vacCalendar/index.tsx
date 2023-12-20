import { useMemo } from 'react'
import dayjs from 'dayjs'

import { useVaccineRecordList } from '../../api'

import { MergeItems, VacCalendarItemExpire, VacCalendarItem } from './vacCalendarItem'
import { NetworkError } from '../../components/errors'
import RecordPopup from './recordPopup'
import { Header } from './header'
import { useCalendarStore } from '../../models'

export default function Index() {
  return (
    <>
      <Header />
      <VacCalendarScrollView />
      <RecordPopup />
    </>
  )
}

// TODO: implement interaction of date picker and scroll view
// FIXME: if the date field of a record is in the far future, 
// new items will be generated every time the page is refreshed
export function VacCalendarScrollView() {
  const { data, error } = useVaccineRecordList()

  const mergedItems = useMemo(
    () => (data ? MergeItems(data).sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()) : null),
    [data]
  )

  const profileIdFilter = useCalendarStore.use.profileId()

  if (error) {
    return (
      <div className='h-screen'>
        <NetworkError />
      </div>
    )
  }

  return (
    <div className='flex-1'>
      <div className='relative h-[100vh]'>
        <ol className='mt-4 mx-4 space-y-4 text-sm leading-6 pb-8'>
          {mergedItems
            ?.filter((item) => (profileIdFilter ? item.record.profileId === profileIdFilter : true))
            .map((item) => {
              if (item.expireDate) {
                return <VacCalendarItemExpire key={dayjs(item.date).valueOf()} record={item.record} />
              } else {
                return <VacCalendarItem key={dayjs(item.date).valueOf()} record={item.record} />
              }
            })}
        </ol>
      </div>
    </div>
  )
}
