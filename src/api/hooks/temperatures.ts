import useSWR from 'swr'

import { getTemperatureRecordList } from '..'

export function useTemperatureList() {
  const { data, ...rest } = useSWR('getTemperatureRecordList', getTemperatureRecordList, {
    revalidateIfStale: false,
  })

  return {
    ...rest,
    data,
  }
}
