import useSWR from 'swr'
import { useCallback } from 'react'
import { getVaccineList } from '../methods'

export function useVaccines() {
  const { data, ...rest } = useSWR('getVaccineList', getVaccineList, {
    revalidateIfStale: false,
  })
  const name2id = useCallback((name?: string) => data?.find((v) => v.name === name)?.ID, [data])

  const id2name = useCallback((id?: number) => data?.find((v) => v.ID === id)?.name ?? '', [data])

  return {
    ...rest,
    data,
    name2id,
    id2name,
  }
}
