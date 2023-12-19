import { useRouter } from 'taro-hooks'
import { Cell } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'

import api from '../../../api'

export default function () {
  const [route] = useRouter()
  const clinicName = route.params.clinicName
  const [phoneNumber, setPhoneNumber] = useState("114514")
  const [vaccineList, setVaccineList] = useState([""])
  useEffect(() => {
    const fetchClinicInfo = async () => {
      api
      .get('/api/clinics/clinicName/' + clinicName)
      .then((res) => {
        setVaccineList(res.data.vaccineList.split(';'))
        setPhoneNumber(res.data.phoneNumber)
      })
    }
    fetchClinicInfo()
  }, [clinicName])
  return (
    <div>
      <h1>{clinicName}</h1>
      <div>
        {vaccineList.map((item) => {
          return (
            <Cell
              title={item}
            />
          )
        })}
      </div>
      <div>联系电话：{phoneNumber}</div>
    </div>
  )
}