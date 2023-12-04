/* TODO: 
    1. Coordinate with the backend APIs (implemented)
    2. Add a ComboBox component to replace the Picker component
    3. CSS style for the menu and the buttons
*/

import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { Input, Cell, Checkbox, Picker, Uploader, Button, DatePicker } from '@nutui/nutui-react-taro'
import { TextArea } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'

// import {ComboBox} from 'src/components/combobox';
import api from '../../api'

type MemberData = {
  name: string // 成员姓名
  relationship: number // 与本人关系
  gender: number // 性别，男0女1
  birthday: string // 出生日期
  avatar: string // 头像
  note: string // 备注
}

export default function addMember() {
  const MemberData = [
    [
      { value: 0, text: '本人' },
      { value: 1, text: '父亲' },
      { value: 2, text: '母亲' },
      { value: 3, text: '儿子' },
      { value: 4, text: '女儿' },
      { value: 5, text: '配偶' },
      { value: 6, text: '其他' },
    ],
  ]

  const [member, setMember] = useState<MemberData>({
    name: '',
    relationship: -1,
    gender: -1,
    birthday: '',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    note: '',
  })

  useEffect(() => {
    console.log('member:', member)
  }, [member])

  const [nameValue, setNameValue] = useState('')
  const onNameChange = (value: string) => {
    setMember({
      ...member,
      name: value,
    })
    setNameValue(value)
  }
  const [relationVisible, setRelationVisible] = useState(false)
  const [relationDesc, setRelationDesc] = useState('')
  const confirmRelation = (options: PickerOption[], values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setRelationDesc(description)
    setMember({
      ...member,
      relationship: values[0] as number,
    })
  }

  const onGenderChange = (value: number) => {
    setMember({
      ...member,
      gender: value,
    })
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
      birthday: date,
    })
  }

  const onNoteChange = (value: string) => {
    setMember({
      ...member,
      note: value,
    })
  }

  const handleSubmission = async () => {
    console.log('member:', member) // for debug
    if (member && member.name && member.relationship >= 0 && member.gender) {
      try {
        const res = await api.request({ url: '/api/vaccination-records', method: 'POST', data: member })
        console.log(res.data) // for debug
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

  const handleReset = () => {
    setMember({
      name: '',
      relationship: -1,
      gender: -1,
      birthday: '',
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      note: '',
    })
    setRelationDesc('')
    setDateDesc('')

    setDateVisible(false)
    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  return (
    <>
      <Cell.Group className='col-span-full'>
        <Cell title='成员姓名' style={{ borderRadius: '8px' }}>
          <Input
            type='text'
            placeholder='请输入成员姓名'
            value={nameValue}
            onChange={(value) => onNameChange(value)}
            className='border border-gray-200 rounded p-1'
          />
        </Cell>
      </Cell.Group>

      <Cell.Group className='col-span-full'>
        <Cell title='性别' style={{ textAlign: 'center' }}>
          <Checkbox.Group className='flex' onChange={(value) => onGenderChange(value[0] === '0' ? 0 : 1)}>
            <Checkbox title='男' value={0} className='mr-2'>
              男
            </Checkbox>
            <Checkbox title='女' value={1}>
              女
            </Checkbox>
          </Checkbox.Group>
        </Cell>
      </Cell.Group>

      <Cell
        title='与本人关系'
        description={relationDesc}
        onClick={() => setRelationVisible(!relationVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='与本人关系'
        visible={relationVisible}
        options={MemberData}
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
        <TextArea placeholder='请输入备注' autoSize onChange={(value) => onNoteChange(value)} />
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
