import useSWR from 'swr'
import { useMemo } from 'react'
import { dayjs } from '../../utils'

import { getVaccineRecordList, getVaccineRecordWithProfile, VaccinationRecord } from '..'

export function useVaccineRecordList() {
  const { data, ...rest } = useSWR('getVaccineRecordList', getVaccineRecordList, {
    revalidateIfStale: false,
  })

  return {
    ...rest,
    data,
  }
}

type VaccineState = {
  planning: boolean
  inEffect: boolean
  inoculated: boolean
}

export function useVaccineRecordForPerson(profileID?: number) {
  const { data, ...rest } = useSWR<VaccinationRecord[]>(
    profileID ? [profileID, 'getVaccineRecordWithProfile'] : null,
    ([id]) => getVaccineRecordWithProfile(id),
    {
      revalidateIfStale: false,
    }
  )

  // TODO: performance?
  const getVaccineState = useMemo<(vacID?: number) => VaccineState>(
    () => (vacID?: number) => {
      if (!data || data.length === 0) return { planning: false, inEffect: false, inoculated: false }

      const records = vacID ? data.filter((record) => record.vaccineId === vacID) : []
      if (records.length === 0) return { planning: false, inEffect: false, inoculated: false }

      let planning = false,
        inEffect = false,
        inoculated = false
      const currentDate = dayjs()

      records.forEach((record) => {
        const vaccinationDate = dayjs(record.vaccinationDate)
        const nextVaccinationDate = record.nextVaccinationDate ? dayjs(record.nextVaccinationDate) : null

        if (vaccinationDate.isAfter(currentDate)) {
          planning = true
        }
        if (
          vaccinationDate.isBefore(currentDate) &&
          (!nextVaccinationDate || nextVaccinationDate.isAfter(currentDate))
        ) {
          inEffect = true
        }
        if (record.isCompleted || (nextVaccinationDate && nextVaccinationDate.isBefore(currentDate))) {
          inoculated = true
        }
      })

      return { planning, inEffect, inoculated }
    },
    [data]
  )

  return {
    ...rest,
    data,
    getVaccineState,
  }
}
