import { Checkbox } from '@nutui/nutui-react-taro';
import { useEffect, useState } from 'react'
import { Loading } from '@nutui/nutui-react-taro'

import api from '../../../api'

export default function Index () {
  const [showNotice, setShowNotice] = useState<boolean>(true)
  
  const handleShowNotice = (state) => {
    setShowNotice(state)
  }

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='flex flex-col h-11/12 w-11/12 m-4 rounded-2xl std-box-shadow'>
        
        <div className="flex flex-row-reverse m-4">
          <div className='p-2'>
            <Checkbox
              labelPosition="left"
              label="开启消息通知"
              defaultChecked={true}
              onChange={handleShowNotice}
            />
          </div>
        </div>

        {showNotice && <NoticeList />}
        {/* <NoticeList /> */}

      </div>
    </div>
  )
}

type TNoticeItem = {
  profile: string;
  vaccine: string;
  type: string;
  date: string;
}

function ListItem(props: TNoticeItem) {
  return (
    <div className='flex flex-row justify-evenly items-center m-2 p-2 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-400 text-white'>

        <div className='text-lg'>{props.profile}</div>
        
        <div className='flex flex-col'>
          <div className='text-lg'>{props.vaccine}</div>
          <div className='text-sm'>{props.type}</div>
        </div>
        
        <div className='text-sm'>{props.date}</div>

    </div>
  )
}

function NoticeList() {
  const [noticeList, setNoticeList] = useState<TNoticeItem[] | null>()
  useEffect(() => {
    api.request({ url: '/api/notices' }).then((res) => {
      const result = res.data as TNoticeItem[]
      setNoticeList(result)
    })
  }, [])

  if (!noticeList) {
    return <Loading className='h-screen w-screen' />
  }

  return (
    <div className='flex flex-col h-[75vh] overflow-auto m-4'>
      {noticeList.map((item, index) => (
        <ListItem
          key={index}
          profile={item.profile}
          vaccine={item.vaccine}
          type={item.type}
          date={item.date}
        />
      ))}
    </div>
  )
}