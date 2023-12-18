import Taro from '@tarojs/taro'

import { useState } from 'react'

import { Map as TaroMap } from '@tarojs/components'
import { useEffect } from 'react'
import { Loading, SearchBar, Button, Cell, Menu } from '@nutui/nutui-react-taro'
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
  const [searchValue, setSearchValue] = useState('')
  const [foucusVaccine, setFocusVaccine] = useState('全部疫苗')
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
  var lastClickedID = 1

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
    const clinicName = clinicInfo.map(item => item[0])
    setMarkers(clinicInfo.map((item, index) => {
      return {
        id: index + 2,
        title: item[0],
        latitude: parseFloat(item[1]),
        longitude: parseFloat(item[2]),
        distance: 0,
        iconPath: PositionIconPath,
        width: iconWidth,
        height: iconHeight
      }
    }))
    
    // const searchResult = response.data.map(item => {
    //   return {
    //     id: parseInt(item.id),
    //     title: item.name,
    //     latitude: item.latitude,
    //     longitude: item.longitude,
    //     distance: item.distance,
    //     iconPath: PositionIconPath,
    //     width: iconWidth,
    //     height: iconHeight
    //   }
    // })

    // const mapServiceURL = "https://apis.map.qq.com/ws/place/v1/search"
    // const params = new URLSearchParams();
    // params.append('key', 'UBDBZ-OVCCL-AG2P4-EUKGA-OTBAV-CAFX3');
    // params.append('keyword', searchValue);
    // params.append('boundary', `nearby(${originLatitude},${originLongitude},1000,1)`);
    // const getMarkersURL = `${mapServiceURL}?${params.toString()}`

    // Taro.request({
    //   url: getMarkersURL,
    //   method: 'GET',
    //   success: (res) => {
    //     const searchResult = res.data.data.map(item => {
    //       return {
    //         id: parseInt(item.id),
    //         title: item.title,
    //         latitude: item.location.lat,
    //         longitude: item.location.lng,
    //         distance: item._distance,
    //         iconPath: PositionIconPath,
    //         width: iconWidth,
    //         height: iconHeight
    //       }
    //     })
    //     setMarkers([...searchResult])
    //   },
    //   fail: (err) => {
    //     console.error('Request failed:', err)
    //   }
    // })
  }

  const vaccineList = [
    '全部疫苗',
    '乙肝疫苗',
    '狂犬疫苗'
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
      {/* <SearchBar
          placeholder='按下回车进行搜索'
          shape='round'
          className='rounded-3xl'
          onSearch={(value) => getMarkers(value)}
          onChange={(value) => setSearchValue(value)}
          right={
            <Button type='primary' onClick={() => getMarkers(searchValue)}>搜索</Button>
          }
      /> */}
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
            if (item.id != lastClickedID) {
              return (
                <Cell
                  key={index}
                  title={item.title}
                  description={item.distance + " m"}
                  onClick={() => {
                    console.log("click")
                    const updatedMarkers = [...markers]
                    for (let i = 0; i < markers.length; i++) {
                      if (markers[i].id != item.id) {
                        updatedMarkers[i].iconPath = PositionIconPath
                      } else {
                        updatedMarkers[i].iconPath = FocusPositionIconPath
                      }
                    }
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
