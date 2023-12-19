import { useState } from 'react'

import { Map as TaroMap } from '@tarojs/components'
import { useEffect } from 'react'
import { Loading, Cell, Menu } from '@nutui/nutui-react-taro'
import { useDeviceStore } from '../../models'
import PositionIconPath from "../../assets/map/position.png"
import FocusPositionIconPath from "../../assets/map/focusPosition.png"

import api from '../../api'

export default function MapPage() {
  const location = useDeviceStore.use.location()
  const updateLocation = useDeviceStore.use.updateLocation()
  const iconWidth = 40
  const iconHeight = 40
  // 使用定位总是只能定位到海淀区政府，暂时用清华大学坐标替代
  const [originLatitude, setOriginLatitude] = useState(40.0011)
  const [originLongitude, setOriginLongitude] = useState(116.3265)
  const [foucusVaccine, setFocusVaccine] = useState('无')
  const focusLocation = {
    id: 1,
    title: "目标地点",
    latitude: originLatitude,
    longitude: originLongitude,
    distance: 0,
    iconPath: FocusPositionIconPath,
    width: iconWidth,
    height: iconHeight
  }
  const [markers, setMarkers] = useState([focusLocation])
  var myPositionID = 1

  // 获取当前位置
  // TODO: error handling
  useEffect(() => {
    location || updateLocation()
  })

  if (!location) {
    return <Loading className='h-screen w-screen'>Fetching location...</Loading>
  }

  // 向腾讯地图API请求附近的疫苗接种点，并更新 markers
  const getMarkers = async (searchValue: string) => {
    const response = await api.get('/api/clinics/vaccineName/' + searchValue)
    // 解析
    const clinicInfo = response.data[0].clinicInfo.split(';').map((item: string) => item.split(','))
    const clinicMarkers = clinicInfo.map((item, index) => {
      return {
        id: index + 2,
        title: item[0],
        latitude: parseFloat(item[1]),
        longitude: parseFloat(item[2]),
        distance: Math.trunc(2 * 6378 * 1000 * Math.asin(Math.sqrt(Math.pow(Math.sin((Math.PI / 180) * (parseFloat(item[1]) - originLatitude) / 2), 2) + Math.cos((Math.PI / 180) * parseFloat(item[1])) * Math.cos((Math.PI / 180) * originLatitude) * Math.pow(Math.sin((Math.PI / 180) * (parseFloat(item[2]) - originLongitude) / 2), 2)))),
        iconPath: PositionIconPath,
        width: iconWidth,
        height: iconHeight
      }
    })
    setMarkers([focusLocation, ...clinicMarkers])
  }

  const vaccineList = [
    '无',
    '狂犬疫苗',
    'HPV疫苗',
  ]

  const vaccineOptions = vaccineList.map((item) => {
    return {text: item, value: item}
  })

  return (
    <div className='h-screen'>
      <div className='h-2/4'>
        <TaroMap
          className='w-full h-full'
          scale={15}
          longitude={originLongitude}
          latitude={originLatitude}
          // longitude={location.longitude}
          // latitude={location.latitude}
          markers={markers}
        />
      </div>
      <Menu>
        <Menu.Item
          options={vaccineOptions}
          value={foucusVaccine}
          columns={2}
          onChange={(v) => {
            setFocusVaccine(v.value)
            // 向后端请求疫苗接种点
            // 更新 markers
            getMarkers(v.value)
          }}
        />
      </Menu>
      <div className='h-2/4 overflow-auto'>
        <div>
          {markers.map((item, index) => {
            if (item.id != myPositionID) {
              return (
                <Cell
                  key={index}
                  title={item.title}
                  description={item.distance + " m"}
                  onClick={() => {
                    const updatedMarkers = [...markers]
                    setMarkers(updatedMarkers)
                    setOriginLatitude(item.latitude)
                    setOriginLongitude(item.longitude)
                  }}
                />
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
    </div>
  )
}
