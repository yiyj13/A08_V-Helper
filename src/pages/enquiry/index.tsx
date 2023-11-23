import { Loading } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'

import api from '../../api'

type TVaccine = {
  id: number
  name: string
  type: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

export default function VaccineEnquiry() {
  const [vaccineList, setVaccineList] = useState<TVaccine[] | null>()

  useEffect(() => {
    api.request({ url: '/api/vaccines' }).then((res) => {
      setVaccineList(res.data.data)
    })
  }, [])

  if (!vaccineList) {
    return <Loading className='h-screen w-screen' />
  }

  return (
    <div className='flex flex-col p-5'>
      <div>
        {vaccineList.map((vaccineName) => (
          <div className='flex flex-col p-5 mt-4 rounded-xl border-t-gray-50' key={vaccineName.id}>
            {vaccineName.name}
          </div>
        ))}
      </div>
    </div>
  )
}
