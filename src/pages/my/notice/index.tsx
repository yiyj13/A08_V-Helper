import { Checkbox } from '@nutui/nutui-react-taro';

export default function Index () {
  return (
    <div className=' h-screen flex flex-col items-center'>
      <div className='h-full w-11/12 m-4 flex flex-col'>
        
        <div className="m-4 flex flex-row-reverse">
          <div className='p-2'>
            <Checkbox
              labelPosition="left" label="开启消息通知"
              defaultChecked={true}
            />
          </div>
        </div>
        
        <div>列表</div>
      
      </div>
    </div>
  )
}