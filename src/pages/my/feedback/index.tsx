import { Button } from '@nutui/nutui-react-taro'

export default function() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col h-full w-11/12 m-4 rounded-2xl std-box-shadow">
        <div className='overflow-auto rounded-2xl m-4 rounded-2xl std-box-shadow'>
          <input type='text' placeholder='标题' className='p-4'/>
        </div>
        <div className='overflow-auto h-[60vh] rounded-2xl m-4 rounded-2xl std-box-shadow'>
          <textarea placeholder='内容' maxLength={1000} className='p-4'></textarea>
        </div>
        <div className='flex flex-row justify-evenly m-4'>
          <Button type='primary' className='w-2/6'>提交</Button>
          <Button className='w-2/6'>取消</Button>
        </div>
      </div>
    </div>
  )
}