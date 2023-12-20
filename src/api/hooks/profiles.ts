import useSWR from 'swr'

import { getProfiles } from '..'

export function useProfiles() {
  const { data, ...rest } = useSWR('getProfiles', getProfiles, {
    revalidateIfStale: false,
  })

  function id2name(id?: number) {
    return data?.find((v) => v.ID === id)?.fullName
  }

  return {
    ...rest,
    data,
    id2name,
  }
}
