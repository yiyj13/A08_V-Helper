import useSWR from 'swr'

import { getTemperatureRecordList, useProfiles } from '..'

export function useTemperatureList() {
  const { data: profiles } = useProfiles()

  // automactically call getTemperatureRecordList when profiles changes
  const { data, ...rest } = useSWR([profiles, 'getTemperatureRecordList'], getTemperatureRecordList, {
    revalidateIfStale: false,
  })

  return {
    ...rest,
    data,
  }
}
