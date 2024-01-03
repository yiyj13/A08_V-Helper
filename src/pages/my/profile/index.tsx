import clsx from 'clsx'
import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
import {  Button } from '@nutui/nutui-react-taro'
import { useEffect, useMemo, useState } from 'react'

import { updateUserInfo, useUserPublic } from '../../../api'
import { PICTURE_BASE_URL } from '../../../api/config'
import { getUserID } from '../../../models'
import { uploadImage } from '../../../api/imageUploader'
import { dayjs } from '../../../utils'
import InputCustom from '../../../components/titleinput'

export default function Index() {
  const { data, mutate, isLoading } = useUserPublic(getUserID())

  const [tempUrl, setTempUrl] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const previewUrl = (tempUrl !== '' ? tempUrl : data?.avatar) ?? ''

  const cloudpath = useMemo(() => `user/${dayjs().unix()}`, [])
  const isAvartarChanged = tempUrl !== ''
  const isUsernameChanged = username !== data?.userName
  const isSubmitDisabled = isLoading || (!isAvartarChanged && !isUsernameChanged)

  useEffect(() => {
    if (data) setUsername(data?.userName)
  }, [data])

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        setTempUrl(res.tempFilePaths[0])
      },
    })
  }

  const handleSUbmit = async () => {
    if (isAvartarChanged) {
      console.log('tempUrl', JSON.stringify(tempUrl, null, 2))
      await uploadImage(tempUrl, cloudpath)
    }
    await updateUserInfo({
      avatar: isAvartarChanged ? `${PICTURE_BASE_URL}/${cloudpath}` : data?.avatar,
      userName: username,
    })

    mutate()

    Taro.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 1000,
    })

    setTimeout(Taro.navigateBack, 1000)
  }

  const handleReset = () => {
    setTempUrl('')
    setUsername(data?.userName ?? '')
  }

  return (
    <div className='flex h-screen flex-col items-center'>
      <header className='flex px-6 mt-4 w-full h-16 text-2xl font-bold'>编辑信息</header>
      <div
        className={clsx(
          'flex flex-col bg-white items-center justify-between w-4/5',
          'border border-gray-100',
          'rounded-xl shadow-md',
          'relative overflow-hidden'
        )}
      >
        <span className='via-teal absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-brand to-green-200'></span>
        <div className='flex flex-col items-center my-8'>
          <Image
            src={previewUrl}
            className='h-32 w-32 rounded-full object-cover bg-slate-100 shadow-sm ring-1 ring-brand'
            onClick={handleChooseImage}
            mode='aspectFill'
          />
          <p className='mt-1 text-gray-500'>点击编辑头像</p>
        </div>
        <InputCustom
          label='用户名'
          onInput={(n) => {
            setUsername(n.detail.value.slice(0, 18))
          }}
          value={username}
        ></InputCustom>
        <div className='my-8 flex gap-x-4'>
          <Button type='default' onClick={handleReset}>
            重置
          </Button>
          <Button
            disabled={isSubmitDisabled}
            type='primary'
            fill={isSubmitDisabled ? 'none' : 'solid'}
            onClick={handleSUbmit}
          >
            提交
          </Button>
        </div>
      </div>
    </div>
  )
}
