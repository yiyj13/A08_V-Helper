import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { Skeleton } from '@nutui/nutui-react-taro'
import { Ask } from '@nutui/icons-react-taro'
import useSWR from 'swr'
import dayjs from 'dayjs'

import { getVaccineRecordList } from '../../api/methods'
import { MergeItems, VacCalendarItemExpire, VacCalendarItem } from './vacCalendarItem'
import { NetworkError } from '../../components/errors'
import { PullDownRefresh } from '../../components/pulldownrefresh'
import RecordPopup from './recordPopup'

export function MiniCalendar() {
  const { data, isLoading, error, mutate } = useSWR('getVaccineRecordList', getVaccineRecordList)
  const isEmpty = !data || (data && data.length === 0)

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
          <PullDownRefresh onRefresh={mutate}>
            {isLoading ? (
              <Skeleton animated rows={3} visible={!isLoading} />
            ) : error ? (
              <NetworkError />
            ) : isEmpty ? (
              <EmptyNotice />
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
          </PullDownRefresh>
          <div className='h-32'></div>
        </div>
      </div>
      <RecordPopup />
    </>
  )
}

const EmptyNotice = () => {
  // an material style gray card with a little bit of shadow, with text "提示：疫苗日历暂无数据，可以通过添加疫苗记录来生成日历"
  return (
    <div className='flex flex-col p-4 m-4 h-full justify-center rounded-2xl bg-gray-100'>
      <div className='flex flex-row gap-x-2 text-brand items-center'>
        <Ask />
        <Text className='text-lg font-bold'>提示</Text>
      </div>
      <div className='text-sm text-gray-500 mt-2'>
        疫苗日历暂无数据，可通过
        <text className='text-sm underline text-brand' onClick={() => Taro.navigateTo({ url: '/pages/record/index' })}>
          填写接种记录
        </text>
        表单来生成日历
      </div>
    </div>
  )
}
