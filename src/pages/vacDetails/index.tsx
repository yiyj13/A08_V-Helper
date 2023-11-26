import { useState, useEffect } from 'react'
import { useRouter } from 'taro-hooks'
import { Follow } from '@nutui/icons-react-taro'
import { Loading } from '@nutui/nutui-react-taro'
import api from '../../api'

import Tab from './tab'

type Vaccine = {
  id: string
  name: string
  description: string
  targetDisease: string
  sideEffects: string
  precautions: string
}

export default function Index() {
  const [vaccine, setVaccine] = useState<Vaccine>()
  const [route] = useRouter()
  const { id } = route.params

  const [tabIdx, setTabIdx] = useState(0)

  useEffect(() => {
    api.request({ url: '/api/vaccines/' + id }).then((res) => {
      const result = res.data as Vaccine
      setVaccine(result)
    })
  }, [id])

  if (!vaccine) return <Loading className='w-screen h-screen'></Loading>

  const tabs = ['疫苗介绍', '注意事项', '病症处理', '大家讨论']

  return (
    <div className='flex h-screen w-screen flex-col'>
      <div className='flex h-32 w-full flex-row items-center justify-between'>
        <label className='ml-4 text-2xl font-bold'>{vaccine.name}</label>
        <div className='mr-4 flex flex-row'>
          <Follow className='text-brand' width={20} height={20} />
        </div>
      </div>
      <div className='flex h-full w-full flex-col rounded-3xl bg-slate-100'>
        <Tab titles={tabs} value={tabIdx} setValue={setTabIdx} />
        <div className='h-full w-full px-4'></div>
      </div>
    </div>
  )
}
