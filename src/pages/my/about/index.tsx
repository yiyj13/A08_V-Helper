import { RectRight, Tips } from '@nutui/icons-react-taro'
import { Image } from '@tarojs/components'
import Logo from '../../../assets/about/logo.png'

export default function Index() {
  return (
    <div className='flex flex-col h-screen items-center'>
      <div className='flex flex-col h-full w-11/12 m-5 rounded-2xl std-box-shadow'>
        
        <div className='m-4 flex flex-col'>
          <div className='flex flex-col items-center p-2'>
            <Image src={Logo} style='width: 100px; height: 100px;' />
          </div>
          <div className='p-2 flex flex-col items-center'>
            <p className='text-lg'>V-helper</p>
          </div>
          <div className='p-2 flex flex-col items-center'>
            <p>版本 1.0</p>
          </div>
        </div>

        <div className='flex flex-col m-4'>
          <ActionFlexColItem icon={<Tips size={24} className='brand-color' />} text='更新日志' />
          <ActionFlexColItem icon={<Tips size={24} className='brand-color' />} text='隐私政策' />
        </div>

        <div className='h-full m-4 flex flex-col-reverse'>
          <div className='flex flex-col p-2 justify-evenly items-center text-slate-400'>
            <p>开发者：杨朗 易郁杰 刘博非 唐子涵</p>
            <p>联系方式：vaxhelper1024@google.com</p>
          </div>
        </div>
        
      </div>
    </div>
  )
}

interface IActionItem {
  icon: React.ReactNode
  text: string
  onClick?: () => any
}

function ActionFlexColItem(props: IActionItem) {
  const { icon, text, onClick } = props
  return (
    <div
      className='flex flex-row p-4 justify-between items-center h-14 active:bg-gray-100 rounded-xl'
      onClick={onClick}
    >

      <div className='flex flex-row items-center'>
        {icon}
        <p className='ml-4'>{text}</p>
      </div>
      
      <RectRight color='gray' />
    
    </div>
  )
}
