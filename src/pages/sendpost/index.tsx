import { Button, Divider, Uploader } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { useRouter } from 'taro-hooks'
import ComboBox from '../../components/combobox'
import TextAreaCustom from './maintextarea'
import InputCustom from './titleinput'

export default function Index() {
  const [params, { back }] = useRouter()
  const [title, setTitle] = useState<string>(params.vacName || '')
  const [content, setContent] = useState('')

  const vaccines = [
    '狂犬病疫苗',
    '流感疫苗',
    '水痘疫苗',
    '麻疹疫苗',
    '百白破疫苗',
    '脊灰疫苗',
    '乙肝疫苗',
    '卡介苗',
  ]

  const handleSubmit = () => {
    // TODO: put post
    back()
  }

  return (
    <div className='flex h-screen w-screen flex-col'>
      <div className='mx-4 my-6'>
        <ComboBox title='选择疫苗标签' options={vaccines} onSelect={(option) => {}} />
      </div>
      <section className='flex h-full w-full flex-col rounded-3xl bg-slate-100 p-4'>
        <InputCustom label='帖子标题' value={title} onInput={(val) => setTitle(val.detail.value)} />
        <TextAreaCustom label='正文' value={content} onInput={(val) => setContent(val.detail.value)} />
        <Divider />
        <div className='flex flex-row w-auto my-6 items-end justify-between p-2'>
          <Uploader
            // TODO: 连接图床
            url=''
            autoUpload={false}
            className='mx-4 bg-gray-100 w-min overflow-hidden rounded-2xl ring-2 ring-brand/50'
            maxCount={1}
          />
          <Button fill='outline' size='normal' type='primary' onClick={handleSubmit}>
            发布
          </Button>
        </div>
      </section>
    </div>
  )
}
