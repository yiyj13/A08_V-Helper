import { useState } from 'react'
import Taro from '@tarojs/taro'

import { Map as TaroMap, CoverView } from '@tarojs/components'
import { useEffect } from 'react'
import { Loading, Cell, Menu, Button } from '@nutui/nutui-react-taro'
import { MoreS, Find } from '@nutui/icons-react-taro'
import { useDeviceStore } from '../../models'
import PositionIconPath from "../../assets/map/position.png"
import CurrentPositionIconPath from "../../assets/map/focusPosition.png"

import api from '../../api'
import './index.css'

export default function MapPage() {
  const location = useDeviceStore.use.location()
  const updateLocation = useDeviceStore.use.updateLocation()
  const iconWidthNormal = 40
  const iconHeightNormal = 40
  const iconWidthFocus = 60
  const iconHeightFocus = 60
  const myLatitude = 40.0011
  const myLongitude = 116.3265
  const myPositionID = 1
  const currentPosition = {
    id: 1,
    title: "当前位置",
    latitude: myLatitude,
    longitude: myLongitude,
    distance: 0,
    iconPath: CurrentPositionIconPath,
    width: iconWidthNormal,
    height: iconHeightNormal
  }
  // 使用定位总是只能定位到海淀区，暂时用清华大学坐标替代
  const [centralLatitude, setCentralLatitude] = useState(myLatitude)
  const [centralLongitude, setCentralLongitude] = useState(myLongitude)
  const [focusVaccine, setFocusVaccine] = useState('无')
  const [markers, setMarkers] = useState([currentPosition])
  const [focusMarkerID, setFocusMarkerID] = useState(1)

  // 获取当前位置
  // TODO: error handling
  useEffect(() => {
    location || updateLocation()
  })

  if (!location) {
    return <Loading className='h-screen w-screen'>Fetching location...</Loading>
  }

  // 请求附近的疫苗接种点，并更新 markers
  const getMarkers = async (searchValue: string) => {
    const response = await api.get('/api/clinics/vaccineName/' + searchValue)

    const clinicPostion = response.data
    const clinicMarkers = clinicPostion.map((item, index) => {
      return {
        id: index + 2,
        title: item.clinicName,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        distance: Math.trunc(2 * 6378 * 1000 * Math.asin(Math.sqrt(Math.pow(Math.sin((Math.PI / 180) * (parseFloat(item.latitude) - centralLatitude) / 2), 2) + Math.cos((Math.PI / 180) * parseFloat(item.latitude)) * Math.cos((Math.PI / 180) * centralLatitude) * Math.pow(Math.sin((Math.PI / 180) * (parseFloat(item.longitude) - centralLongitude) / 2), 2)))),
        iconPath: PositionIconPath,
        width: iconWidthNormal,
        height: iconHeightNormal
      }
    })
    setMarkers([currentPosition, ...clinicMarkers])
  }

  const vaccineList = [
    '无',
    '狂犬疫苗',
    'HPV疫苗',
    '流感疫苗',
    '常规疫苗'
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
          longitude={centralLongitude}
          latitude={centralLatitude}
          markers={markers}
          includePoints={markers}
          onMarkerTap={(e) => {
            e.detail.markerId
            const tappedMarker = markers.find((item) => item.id == e.detail.markerId)
            if (tappedMarker) {
              setCentralLatitude(tappedMarker.latitude)
              setCentralLongitude(tappedMarker.longitude)
              Taro.navigateTo({ url: `/pages/map/clinic/index?clinicName=${tappedMarker.title}` })
            }
          }}
        >
          <CoverView className='location-button'>
            <Button
              fill="solid"
              type="primary"
              icon={<Find/>}
              style={{ margin: 5, width: 40, height: 40, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              onClick={() => {
                setCentralLatitude(myLatitude)
                setCentralLongitude(myLongitude)
              }}
            />
          </CoverView>
        </TaroMap>
      </div>
      <div className='flex flex-row'>
        <div className='grow'>
          <Menu>
            <Menu.Item
              options={vaccineOptions}
              value={focusVaccine}
              columns={2}
              onChange={(v) => {
                setFocusVaccine(v.value)
                if (v.value != '无') {
                  getMarkers(v.value)
                } else {
                  setMarkers([currentPosition])
                }
              }}
            />
          </Menu>
        </div>
      </div>
      <div className='h-2/4 overflow-auto'>
        <div>
          {markers
            .sort((a, b) => a.distance - b.distance)
            .map((item, index) => {
              if (item.id != myPositionID) {
                return (
                  <Cell
                    key={index}
                    title={item.title}
                    description={item.distance > 1000 ? `${(item.distance / 1000).toFixed(1)} km` : `${item.distance} m`}
                    onClick={() => {
                      setCentralLatitude(item.latitude)
                      setCentralLongitude(item.longitude)
                      const lastFocusMarker = markers.find((item) => item.id == focusMarkerID)
                      if (lastFocusMarker) {
                        lastFocusMarker.width = iconWidthNormal
                        lastFocusMarker.height = iconHeightNormal
                      }
                      setFocusMarkerID(item.id)
                      item.width = iconWidthFocus
                      item.height = iconHeightFocus
                      setMarkers([...markers])
                    }}
                    extra={<MoreS onClick={() => {Taro.navigateTo({ url: `/pages/map/clinic/index?clinicName=${item.title}` })}}/>}
                  />
                )
              } else {
                return null
              }
            })
          }
        </div>
      </div>
    </div>
  )
}
