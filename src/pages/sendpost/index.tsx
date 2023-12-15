import { Button, Divider, Uploader } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { useRouter } from 'taro-hooks'
import useSWRMutation from 'swr/mutation'
import clsx from 'clsx'

import ComboBox from '../../components/combobox'
import TextAreaCustom from './maintextarea'
import InputCustom from './titleinput'

import { postArticle, useVaccines } from '../../api'

export default function Index() {
  const [route, { back }] = useRouter()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState('')
  const [vaccineName, setVaccineName] = useState<string | undefined>(route.params.vacName)

  const { data: vaccines, isLoading, name2id } = useVaccines()
  const { trigger } = useSWRMutation('postArticle', () =>
    postArticle(title, content, name2id(vaccineName))
  )

  const handleSubmit = () => {
    trigger()
      .then(back)
      .catch((e) => console.log(e))
  }

  return (
    <div className='flex h-screen w-screen flex-col'>
      <div
        className={clsx('mx-4 my-6', {
          'animate-pulse duration-100': isLoading,
        })}
      >
        <ComboBox
          title={isLoading ? '加载中' : '选择疫苗标签'}
          options={vaccines ? vaccines.map((v) => v.name) : []}
          defaultValue={vaccineName}
          onSelect={(option) => setVaccineName(option)}
        />
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
