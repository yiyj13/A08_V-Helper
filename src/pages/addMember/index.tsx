/* TODO: 
    1. CSS style for the menu and the buttons
*/

import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { useState, useEffect, useMemo } from 'react'
import { Input, Checkbox, Picker, Button, DatePicker, TextArea } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'

import { useProfiles, postProfile, putProfile } from '../../api'
import { deleteProfile, Profile } from '../../api/methods'
import { getUserID } from '../../models'
import { dayjs } from '../../utils'
import { uploadImage } from '../../api/imageUploader'
import { FormCell as Cell, HeaderNecessary, HeaderOptional } from '../../components/formcell'
import { PICTURE_BASE_URL } from '../../api/config'

export default function AddMember() {
  const router = useMemo(() => Taro.getCurrentInstance().router, [])
  const withParams = router?.params?.id !== undefined

  const relationshipOptions: PickerOption[] = [
    { value: 0, text: '本人' },
    { value: 1, text: '父亲' },
    { value: 2, text: '母亲' },
    { value: 3, text: '儿子' },
    { value: 4, text: '女儿' },
    { value: 5, text: '配偶' },
    { value: 6, text: '其他' },
  ]

  const [member, setMember] = useState<Partial<Profile>>({
    fullName: '',
    relationship: '',
    gender: '',
    dateOfBirth: '',
    avatar: '',
    note: '',
  })

  const [nameValue, setNameValue] = useState('')
  const onNameChange = (value: string) => {
    setMember({
      ...member,
      fullName: value,
    })
    setNameValue(value)
  }
  const [relationVisible, setRelationVisible] = useState(false)
  const [relationDesc, setRelationDesc] = useState('')
  const confirmRelation = (options: PickerOption[], _values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setRelationDesc(description)
    setMember({
      ...member,
      relationship: description,
    })
  }

  const [checkbox1, setCheckbox1] = useState(false)
  const [checkbox2, setCheckbox2] = useState(false)
  // TODO: the following two functions to be combined into onGenderChange
  const onMaleChange = (value: boolean) => {
    if (value === false) {
      setCheckbox1(false)
      setCheckbox2(true)
      setMember({
        ...member,
        gender: '女',
      })
    } else {
      setCheckbox1(true)
      setCheckbox2(false)
      setMember({
        ...member,
        gender: '男',
      })
    }
  }

  const onFemaleChange = (value: boolean) => {
    if (value === false) {
      setCheckbox1(true)
      setCheckbox2(false)
      setMember({
        ...member,
        gender: '男',
      })
    } else {
      setCheckbox1(false)
      setCheckbox2(true)
      setMember({
        ...member,
        gender: '女',
      })
    }
  }

  const startDate = new Date(1900, 0, 1)
  const endDate = new Date(2023, 11, 1)
  const [dateVisible, setDateVisible] = useState(false)
  const [dateDesc, setDateDesc] = useState('')
  const confirmDate = (values: (string | number)[], _options: PickerOption[]) => {
    const date = values.slice(0, 3).join('-')
    setDateDesc(`${date}`)
    setMember({
      ...member,
      dateOfBirth: date,
    })
  }


  const [noteValue, setNoteValue] = useState('')
  const onNoteChange = (value: string) => {
    setMember({
      ...member,
      note: value,
    })
    setNoteValue(value)
  }

  const { selectByID, mutate: refreshProfileCache } = useProfiles()

  useEffect(() => {
    const fetchData = async () => {
      if (router && router.params && router.params.id !== undefined) {
        try {
          const result = selectByID(Number(router.params.id))
          if (result === undefined) {
            // TODO: handle 404
            return
          }
          setMember(result)
          setNameValue(result.fullName || '')
          setRelationDesc(result.relationship || '')
          if (result.gender === '男') {
            setCheckbox1(true)
            setCheckbox2(false)
          } else if (result.gender === '女') {
            setCheckbox1(false)
            setCheckbox2(true)
          }
          setDateDesc(result.dateOfBirth || '')
        } catch (error) {
          console.error('Error fetching member information:', error)
          Taro.showToast({ title: '获取成员信息失败', icon: 'error' })
        }
      }
    }
    fetchData()
  }, [router, selectByID])

  const handleSubmission = async () => {
    if (router && router.params && router.params.id) {
      const { id } = router.params
      if (id) {
        try {
          await uploadImageBeforeSubmit()
          await putProfile(Number(id), member)
          refreshProfileCache()
          Taro.showToast({ title: '提交成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        } catch (error) {
          Taro.showToast({ title: '提交失败', icon: 'error' })
        }
      }
    } else {
      if (member && member.fullName && member.relationship && member.gender && member.dateOfBirth) {
        try {
          await uploadImageBeforeSubmit()
          const res = await postProfile(member)
          setMember({
            ...member,
            ID: res.ID,
          })
          refreshProfileCache()
          Taro.showToast({ title: '提交成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        } catch (error) {
          Taro.showToast({ title: '提交失败', icon: 'error' })
        }
      } else {
        Taro.showToast({ title: '请填写完整记录', icon: 'error' })
      }
    }
  }

  const handleReset = () => {
    setMember({
      ...member,
      fullName: '',
      relationship: '',
      gender: '',
      dateOfBirth: '',
      avatar: '',
      note: '',
    })
    setNameValue('')
    setRelationDesc('')
    setCheckbox1(false)
    setCheckbox2(false)
    setDateDesc('')
    setDateVisible(false)
    setNoteValue('')
    setTempUrl('')
    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  const handleDelete = async () => {
    await deleteProfile(Number(router?.params.id))
    Taro.showToast({ title: '删除成功', icon: 'success' })
    refreshProfileCache()
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const [tempUrl, setTempUrl] = useState('')
  const previewUrl = (tempUrl !== '' ? tempUrl : member?.avatar) ?? ''

  const cloudpath = useMemo(() => `member/${getUserID()}/${dayjs().unix()}`, [])

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        setTempUrl(res.tempFilePaths[0])
        setMember((prev) => ({ ...prev, avatar: `${PICTURE_BASE_URL}/${cloudpath}` }))
      },
    })
  }
  const uploadImageBeforeSubmit = async () => {
    if (member.avatar !== undefined && member.avatar !== '' && tempUrl !== '') {
      await uploadImage(tempUrl, cloudpath)
    }
  }

  return (
    <div className='px-4 flex flex-col gap-y-1 animate-delayed-show'>
      <HeaderNecessary />

      <Cell title='成员姓名' style={{ borderRadius: '8px' }}>
        <Input
          type='text'
          className='rounded-md'
          placeholder='请输入成员姓名'
          value={nameValue}
          onChange={(value) => onNameChange(value)}
          // className='border border-gray-200 rounded p-1'
        />
      </Cell>

      <Cell title='性别' className='col-span-full flex justify-center'>
        <div className='flex'>
          <Checkbox title='男' value={0} className='mr-2' checked={checkbox1} onChange={(value) => onMaleChange(value)}>
            男
          </Checkbox>
          <Checkbox
            title='女'
            value={1}
            className='ml-2'
            checked={checkbox2}
            onChange={(value) => onFemaleChange(value)}
          >
            女
          </Checkbox>
        </div>
      </Cell>

      <Cell
        title='与本人关系'
        description={relationDesc}
        onClick={() => setRelationVisible(!relationVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='与本人关系'
        visible={relationVisible}
        options={relationshipOptions}
        onConfirm={(list, values) => confirmRelation(list, values)}
        onClose={() => setRelationVisible(false)}
      />
      <Cell
        title='出生日期'
        description={dateDesc}
        onClick={() => setDateVisible(true)}
        style={{ textAlign: 'center' }}
      />
      <DatePicker
        title='出生日期'
        defaultValue={new Date(Date.now())}
        startDate={startDate}
        endDate={endDate}
        visible={dateVisible}
        type='date'
        onClose={() => setDateVisible(false)}
        onConfirm={(options, values) => confirmDate(values, options)}
      />

      <HeaderOptional />
      <Cell title='头像'>
        <div className='flex justify-center'>
          <Image
            src={previewUrl}
            mode='aspectFit'
            className='w-16 h-16 rounded-full bg-white ring-2 ring-brand'
            onClick={handleChooseImage}
          />
        </div>
      </Cell>
      <Cell title='备注' className='col-span-full px-8' style={{ borderRadius: '8px' }}>
        <TextArea
          className='rounded-md'
          placeholder='请输入备注'
          value={noteValue}
          autoSize
          onChange={(value) => onNoteChange(value)}
        />
      </Cell>
      <div className='col-span-full flex justify-center mt-4'>
        <Button className='submit_btm' formType='submit' type='primary' onClick={handleSubmission}>
          提交
        </Button>
        <div style={{ marginLeft: '16px' }}>
          {withParams ? (
            <Button type='danger' fill='outline' onClick={handleDelete}>
              删除
            </Button>
          ) : (
            <Button id='reset_btm' formType='reset' onClick={handleReset}>
              重置
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
