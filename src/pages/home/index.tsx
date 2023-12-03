import { Image, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'

import VacPNG from '../../assets/home/vac.png'
import DoctorPNG from '../../assets/home/doctor.png'
import TemperaturePNG from '../../assets/home/temp.png'
import { MiniCalendar } from '../vacCalendar/miniCalendar'
import { useTabStore } from '../../models'

import './index.css'

export default function HomePage() {
  const setTabIndex = useTabStore((state) => state.setTabIndex)
  return (
    <div className='flex h-screen flex-col'>
      <div className='grid_'>
        <BigButton text='疫苗查询' src={VacPNG} onClick={() => Taro.navigateTo({ url: '/pages/enquiry/index' })} />
        <BigButton text='接种记录' src={VacPNG} onClick={() => Taro.navigateTo({ url: '/pages/record/index' })} />
        <BigButton text='预约提醒' src={DoctorPNG} onClick={() => setTabIndex(3)} />
        <BigButton
          text='体温记录'
          src={TemperaturePNG}
          onClick={() => Taro.navigateTo({ url: '/pages/temper/index' })}
        />
      </div>
      <MiniCalendar />
    </div>
  )
}

interface IBigButton {
  text: string
  src: string
  onClick?: () => any
}
function BigButton({ text, src, onClick }: IBigButton) {
  return (
    <Button className='grid-btn ' type='primary' onClick={onClick}>
      <Image src={src} className='grid-btn-image' />
      <Text className='grid-btn-title'>{text}</Text>
    </Button>
  )
}
