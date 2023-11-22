import { Map } from '@tarojs/components'
import { useEffect } from 'react'
import { Loading, SearchBar } from '@nutui/nutui-react-taro'
import { useDeviceStore } from '../../models'

export default function MapPage() {
  const location = useDeviceStore.use.location()
  const updateLocation = useDeviceStore.use.updateLocation()

  // TODO: error handling
  useEffect(() => {
    location || updateLocation()
  })

  if (!location) {
    return <Loading className='h-screen w-screen'>Fetching location...</Loading>
  }

  return (
    <div className='h-screen'>
      <Map className='w-full h-full' scale={15} longitude={location.longitude} latitude={location.latitude}>
        <div
          id='map-cover'
          className='w-full h-1/2 bg-white absolute bottom-0 rounded-2xl'
          style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}
        >
          <SearchBar placeholder='search' shape='round' className='rounded-3xl' />
        </div>
      </Map>
    </div>
  )
}
