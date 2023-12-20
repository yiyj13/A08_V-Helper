import { useMemo } from 'react'

import { useVaccineRecordList } from '../../api'

import { MergeItems, VacCalendarItemExpire, VacCalendarItem } from './vacCalendarItem'
import { NetworkError } from '../../components/errors'
import RecordPopup from './recordPopup'
import { Header } from './header'
import { useCalendarStore } from '../../models'
import { dayjs } from '../../utils'

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
export function VacCalendarScrollView() {
  const { data, error } = useVaccineRecordList()

  const mergedItems = useMemo(
    () => (data ? MergeItems(data).sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()) : null),
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
                return <VacCalendarItemExpire key={item.record.ID} record={item.record} />
              } else {
                return <VacCalendarItem key={-item.record.ID} record={item.record} />
              }
            })}
        </ol>
      </div>
    </div>
  )
}
