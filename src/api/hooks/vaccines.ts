import useSWR from 'swr'

import { getVaccineList, Vaccine } from '../methods'

// TODO: maintain 'followed', 'order', 'history', 'expired' states
export function useVaccines() {
  const { data: raw, ...rest } = useSWR('getVaccineList', getVaccineList, {
    revalidateIfStale: false,
  })
  const data = raw as Pick<Vaccine, 'name' | 'ID'>[]

  function name2id(name?: string) {
    return data?.find((v) => v.name === name)?.ID
  }

  function id2name(id?: number) {
    return data?.find((v) => v.ID === id)?.name
  }

  return {
    ...rest,
    data,
    name2id,
    id2name,
  }
}
