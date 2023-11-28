import { Elevator, Loading } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

import api from '../../api'

type TVaccine = {
  ID: number
  name: string
  type: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

type TElevatorItem = {
  name: string
  id: number
}

type TElevatorGroup = {
  title: string
  list: TElevatorItem[]
}

export default function VaccineEnquiry() {
  const [vaccineList, setVaccineList] = useState<TVaccine[] | null>()

  useEffect(() => {
    api.request({ url: '/api/vaccines' }).then((res) => {
      const result = res.data as TVaccine[]
      setVaccineList(result)
    })
  }, [])

  if (!vaccineList) {
    return <Loading className='h-screen w-screen' />
  }

  const getRenderList = (data: TVaccine[]) => {
    const list: TElevatorGroup[] = []
    data.forEach((item) => {
      const firstChar = item.name.charAt(0)
      const index = list.findIndex((group) => group.title === firstChar)
      if (index === -1) {
        list.push({
          title: firstChar,
          list: [
            {
              name: item.name,
              id: item.ID,
            },
          ],
        })
      } else {
        list[index].list.push({
          name: item.name,
          id: item.ID,
        })
      }
    })
    list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }

  const onItemClick = (_key: string, item: TElevatorItem) => {
    Taro.navigateTo({ url: '/pages/vacDetails/index?id=' + item.id })
  }

  return (
    <div className='flex flex-col p-2'>
      <Elevator list={getRenderList(vaccineList)} height='auto' onItemClick={onItemClick}></Elevator>
    </div>
  )
}
