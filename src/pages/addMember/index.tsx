/* TODO: 
    1. Coordinate with the backend APIs (implemented)
    2. Add a ComboBox component to replace the Picker component
    3. CSS style for the menu and the buttons
*/

import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Input, Cell, Checkbox, Picker, Uploader, Button, DatePicker, TextArea } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'

// import {ComboBox} from 'src/components/combobox';
import api from '../../api'
import { MemberData } from '../../api/methods'

export default function AddMember() {
  const relationshipOptions: PickerOption[] = [
    { value: 0, text: '本人' },
    { value: 1, text: '父亲' },
    { value: 2, text: '母亲' },
    { value: 3, text: '儿子' },
    { value: 4, text: '女儿' },
    { value: 5, text: '配偶' },
    { value: 6, text: '其他' },
  ]

  const [member, setMember] = useState<Partial<MemberData>>({
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
  // the following two functions to be combined into onGenderChange
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

  useEffect(() => {
    const router = Taro.getCurrentInstance().router

    const fetchData = async () => {
      if (router && router.params && router.params.id !== undefined) {
        try {
          const res = await api.get('/api/profiles/' + router.params.id)
          const result = res.data as MemberData
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
  }, [])

  const handleSubmission = async () => {
    console.log('member:', member) // for debug
    const router = Taro.getCurrentInstance().router

    if (router && router.params && router.params.id) {
      console.log('id:', router.params) // for debug
      const { id } = router.params
      if (id) {
        try {
          const res = await api.request({ url: `/api/profiles/${id}`, method: 'PUT', data: member })
          console.log(res.data) // for debug
          Taro.showToast({ title: '提交成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        } catch (error) {
          console.log('Error submitting vaccination record:', error)
          Taro.showToast({ title: '提交失败', icon: 'error' })
        }
      }
    } else {
      if (member && member.fullName && member.relationship && member.gender && member.dateOfBirth) {
        try {
          const res = await api.post('/api/profiles', member)
          console.log(res.data) // for debug
          setMember({
            ...member,
            ID: res.data.id,
          })
          Taro.showToast({ title: '提交成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        } catch (error) {
          console.log('Error submitting vaccination record:', error)
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
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      note: '',
    })
    setNameValue('')
    setRelationDesc('')
    setCheckbox1(false)
    setCheckbox2(false)
    setDateDesc('')
    setDateVisible(false)
    setNoteValue('')
    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  return (
    <>
      <Cell title='成员姓名' style={{ borderRadius: '8px' }}>
        <Input
          type='text'
          placeholder='请输入成员姓名'
          value={nameValue}
          onChange={(value) => onNameChange(value)}
          // className='border border-gray-200 rounded p-1'
        />
      </Cell>

      <Cell title='性别' className='col-span-full flex justify-center'>
        <Checkbox title='男' value={0} className='mr-2' checked={checkbox1} onChange={(value) => onMaleChange(value)}>
          男
        </Checkbox>
        <Checkbox title='女' value={1} className='ml-2' checked={checkbox2} onChange={(value) => onFemaleChange(value)}>
          女
        </Checkbox>
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
        startDate={startDate}
        endDate={endDate}
        visible={dateVisible}
        type='date'
        onClose={() => setDateVisible(false)}
        onConfirm={(options, values) => confirmDate(values, options)}
      />
      <div className='flex-content col-span-full'>
        头像
        <Uploader url='https://img.yzcdn.cn/vant/cat.jpeg' />
      </div>
      <Cell title='TextArea' className='col-span-full px-8' style={{ borderRadius: '8px' }}>
        <TextArea placeholder='请输入备注' value={noteValue} onChange={(value) => onNoteChange(value)} />
      </Cell>
      <div className='col-span-full flex justify-center mt-4'>
        <Button className='submit_btm' formType='submit' type='primary' onClick={handleSubmission}>
          提交
        </Button>
        <div style={{ marginLeft: '16px' }}>
          <Button className='reset_btm' formType='reset' onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
    </>
  )
}
