import { Button, Divider } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import { useRouter } from 'taro-hooks'
import { useSWRConfig } from 'swr'
import clsx from 'clsx'
import Taro from '@tarojs/taro'

import ComboBox from '../../components/combobox'
import TextAreaCustom from '../../components/maintextarea'
import InputCustom from '../../components/titleinput'

import { postArticle, useVaccines, useArticles } from '../../api'
import { ThrottleWrap } from '../../utils/useThrottle'

export default function Index() {
  const [route, { back }] = useRouter()
  const vaccineID = Number(route.params.vaccineID)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState('')
  const { data: vaccines, isLoading, id2name, name2id } = useVaccines()

  const [vaccineName, setVaccineName] = useState<string | undefined>(id2name(vaccineID))
  const { mutate: mutateCommunity } = useArticles()
  const { mutate } = useSWRConfig()

  const handleSubmit = async () => {
    if (!validate(title, content)) return
    await postArticle(title, content, name2id(vaccineName))
    mutate([vaccineID, 'getTopArticlesWithVaccine'])
    mutateCommunity()
    Taro.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1000,
    })
    setTimeout(() => back(), 1000)
  }

  return (
    <div className='flex w-screen flex-col'>
      <header className='text-2xl font-bold m-4'>发表帖子</header>
      <section className='relative flex flex-col h-full m-4 rounded-xl shadow-md border-t border-gray-100 p-4 overflow-hidden'>
        <span className='via-teal absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-brand to-green-200'></span>
        <div
          className={clsx('my-4', {
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
        <InputCustom label='帖子标题' value={title} maxlength={25} onInput={(val) => setTitle(val.detail.value)} />
        <div className='flex flex-col h-72'>
          <TextAreaCustom
            label='正文'
            value={content}
            maxlength={150}
            onInput={(val) => setContent(val.detail.value.substring(0, 150))}
          />
        </div>
        <Divider />
        <div className='flex flex-row w-auto my-4 items-center justify-between p-2'>
          <ThrottleWrap>
            <Button fill='outline' size='normal' type='primary' onClick={handleSubmit}>
              发布
            </Button>
          </ThrottleWrap>
          {/* // input length: now/full */}
          <a className='text-gray-500 font-mono'>
            {`${content.length}/150`}
          </a>
        </div>
      </section>
    </div>
  )
}

const validate = (title: string, content: string) => {
  if (!title || title.length === 0 || title.length > 25) {
    Taro.showToast({
      title: '请输入合法标题(1-25字)',
      icon: 'none',
      duration: 1000,
    })
    return false
  }
  if (!content || content.length < 10 || content.length > 1000) {
    Taro.showToast({
      title: '请输入正文(10-1000字)',
      icon: 'none',
      duration: 1000,
    })
    return false
  }
  return true
}
