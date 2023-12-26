import useSWR from 'swr'
import { useCallback } from 'react'

import { getProfiles } from '..'

export function useProfiles() {
  const { data, ...rest } = useSWR('getProfiles', getProfiles, {
    revalidateIfStale: false,
  })

  const id2name = useCallback(
    (id?: number) => data?.find((v) => v.ID === id)?.fullName,
    [data]
  )

  const selectByID = useCallback(
    (id?: number) => data?.find((v) => v.ID === id),
    [data]
  )

  return {
    ...rest,
    data,
    id2name,
    selectByID,
  }
}
