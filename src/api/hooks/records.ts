import useSWR from 'swr'
import { useMemo, useCallback } from 'react'
import { dayjs } from '../../utils'

import { VaccinationRecord, getVaccineRecordList, useProfiles } from '..'

type VaccineState = {
  planning: boolean
  inEffect: boolean
  inoculated: boolean
}

export const initialVaccineState: VaccineState = {
  planning: false,
  inEffect: false,
  inoculated: false,
}

export function useVaccineRecordList() {
  const {data: profiles} = useProfiles()

  // automactically call getVaccineRecordList when profiles changes
  const { data, ...rest } = useSWR([profiles, 'getVaccineRecordList'], getVaccineRecordList, {
    revalidateIfStale: false,
  })

  const _states = useMemo(() => {
    const computedSet = new Set()
    return data
      ?.map((record) => {
        if (computedSet.has(`${record.profileId}-${record.vaccineId}`)) return null
        const s = _computeVaccineState(data, record.profileId, record.vaccineId)
        computedSet.add(`${record.profileId}-${record.vaccineId}`)
        return {
          profileId: record.profileId,
          vaccineId: record.vaccineId,
          ...s,
        }
      })
      .filter((s) => s !== null) as (VaccineState & { profileId: number; vaccineId: number })[]
  }, [data])

  const getVaccineState = useCallback(
    (profileId?: number, vaccineId?: number): VaccineState => {
      return _states?.find((s) => s.profileId === profileId && s.vaccineId === vaccineId) ?? initialVaccineState
    },
    [_states]
  )

  return {
    ...rest,
    data,
    getVaccineState,
  }
}

const _computeVaccineState = (data?: VaccinationRecord[], profileId?: number, vaccineId?: number): VaccineState => {
  const recordsForProfile = profileId ? data?.filter((record) => record.profileId === profileId) : []
  if (!recordsForProfile || recordsForProfile.length === 0) return initialVaccineState

  const records = vaccineId ? recordsForProfile.filter((record) => record.vaccineId === vaccineId) : []
  if (records.length === 0) return initialVaccineState

  let planning = false,
    inEffect = false,
    inoculated = false
  const currentDate = dayjs()

  records.forEach((record) => {
    const vaccinationDate = dayjs(record.vaccinationDate)
    const nextVaccinationDate = record.nextVaccinationDate ? dayjs(record.nextVaccinationDate) : null

    if (!record.isCompleted) {
      planning = true
    }
    if (
      record.isCompleted &&
      !vaccinationDate.isAfter(currentDate) &&
      (!nextVaccinationDate || nextVaccinationDate.isAfter(currentDate))
    ) {
      inEffect = true
    }
    if (
      record.isCompleted
      // || (nextVaccinationDate && nextVaccinationDate.isBefore(currentDate))
    ) {
      inoculated = true
    }
  })

  return { planning, inEffect, inoculated }
}
