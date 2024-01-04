import { useRouter } from 'taro-hooks'
import { Cell } from '@nutui/nutui-react-taro'
import { useState, useEffect } from 'react'

import api from '../../../api'

export default function () {
  const [route] = useRouter()
  const clinicName = route.params.clinicName
  const [phoneNumber, setPhoneNumber] = useState("TODO")
  const [vaccineList, setVaccineList] = useState(["TODO"])
  const [clinicAddress, setClinicAddress] = useState("TODO")
  useEffect(() => {
    const fetchClinicInfo = async () => {
      api
      .get('/api/clinics/clinicName/' + clinicName)
      .then((res) => {
        setVaccineList(res.data.vaccineList.split(';'))
        setPhoneNumber(res.data.phoneNumber)
        setClinicAddress(res.data.address)
      })
    }
    fetchClinicInfo()
  }, [clinicName])
  return (
    <div className='flex flex-col h-screen items-center'>
      <div className='flex flex-col h-full w-11/12 m-5 rounded-2xl std-box-shadow'>
        <header className='flex justify-between items-center px-2 h-14'>
          <h1 className='text-2xl font-semibold'>{clinicName}</h1>
        </header>
        <div className='m-2'>
          <Cell.Group
            title={<div className='text-base text-black font-semibold'>详细信息</div>}
            divider={true}
          >
            <Cell
              title="电话"
              extra={phoneNumber}
            />
            <Cell
              title="地址"
              extra={clinicAddress}
            />
          </Cell.Group>
        </div>
        <div className='m-2'>
          <Cell.Group
            title={<div className='text-base text-black font-semibold'>疫苗列表</div>}
            divider={true}
          >
            {vaccineList.map((item) => {
              return (
                <Cell
                  title={item}
                />
              )
            })}
          </Cell.Group>
        </div>
      </div>
    </div>
  )
}