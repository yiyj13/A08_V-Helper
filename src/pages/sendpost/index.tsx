import { Button, Divider, Uploader } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { useRouter } from 'taro-hooks'
import { useSWRConfig } from 'swr'
import clsx from 'clsx'
import Taro from '@tarojs/taro'

import ComboBox from '../../components/combobox'
import TextAreaCustom from '../../components/maintextarea'
import InputCustom from '../../components/titleinput'

import { postArticle, useVaccines } from '../../api'

export default function Index() {
  const [route, { back }] = useRouter()
  const vaccineID = Number(route.params.vaccineID)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState('')
  const { data: vaccines, isLoading, id2name, name2id } = useVaccines()

  const [vaccineName, setVaccineName] = useState<string | undefined>(id2name(vaccineID))
  const { mutate } = useSWRConfig()

  const handleSubmit = async () => {
    await postArticle(title, content, name2id(vaccineName))
    mutate([vaccineID, 'getTopArticlesWithVaccine'])
    Taro.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    })
    setTimeout(() => back(), 1000)
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
