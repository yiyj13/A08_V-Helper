import { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { Elevator, Loading } from '@nutui/nutui-react-taro'

import { useVaccines } from '../../api'

type TElevatorItem = {
  name: string
  id: number
}

type TElevatorGroup = {
  title: string
  list: TElevatorItem[]
}

export default function VaccineEnquiry() {
  const { data: vaccineList, isLoading } = useVaccines()

  const getRenderList = (
    data: {
      name: string
      ID: number
    }[]
  ) => {
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

  const renderlist = useMemo(() => vaccineList && getRenderList(vaccineList), [vaccineList])

  const onItemClick = (_key: string, item: TElevatorItem) => {
    Taro.navigateTo({ url: '/pages/vacDetails/index?id=' + item.id })
  }

  return (
    <>
      {isLoading ? (
        <Loading className='h-screen w-screen' />
      ) : (
        <div className='flex flex-col p-2 h-without-tab'>
          <Elevator list={renderlist} height='100%' onItemClick={onItemClick}></Elevator>
        </div>
      )}
    </>
  )
}
