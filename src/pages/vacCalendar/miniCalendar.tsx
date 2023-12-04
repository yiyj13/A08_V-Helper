import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { useRequest } from 'taro-hooks'
import { Skeleton } from '@nutui/nutui-react-taro'
import dayjs from 'dayjs'

import { getVaccineRecordList } from '../../api/methods'
import { MergeItems, VacCalendarItemExpire, VacCalendarItem } from './vacCalendarItem'
import { NetworkError } from "../../components/errors"

export function MiniCalendar() {
  const { data, loading, error, refresh } = useRequest(getVaccineRecordList, {
    cacheKey: 'vacCalendar',
    staleTime: 5000,
  })

  return (
    <>
      <div className='mx-8 mt-4 flex flex-row items-center justify-between'>
        <Text className='text-2xl font-bold'>疫苗日历</Text>
        <Text
          className='rounded-xl p-2 text-base text-brand active:bg-slate-100'
          onClick={() => Taro.navigateTo({ url: '/pages/vacCalendar/index' })}
        >
          更多
        </Text>
      </div>

      <div className='mx-2 mt-2 flex h-full flex-col overflow-y-scroll'>
        <div className='mx-4 w-auto rounded-2xl'>
          {loading ? (
            <Skeleton animated rows={3} visible={!loading} />
          ) : error ? (
            <NetworkError refresh={refresh} />
          ) : (
            <ol className='mt-2 space-y-4 text-sm leading-6'>
              {data &&
                MergeItems(data)
                  .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
                  .filter((item) => dayjs(item.date).isAfter(dayjs()))
                  .slice(0, 3)
                  .map((item) => {
                    if (item.expireDate) {
                      return <VacCalendarItemExpire key={dayjs(item.date).valueOf()} record={item.record} />
                    } else {
                      return <VacCalendarItem key={dayjs(item.date).valueOf()} record={item.record} />
                    }
                  })}
            </ol>
          )}
          <div className='h-32'></div>
        </div>
      </div>
    </>
  )
}
