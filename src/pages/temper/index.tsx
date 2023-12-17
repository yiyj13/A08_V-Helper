/* TODO:
    1. Add a ComboBox component to replace the Picker component
    2. CSS style for the text and the buttons
    3. Coordinate with the backend APIs (to be implemented)
    4. Gradient color for the slider 
*/

import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { Picker, Range, DatePicker, Cell, Button, TextArea } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'

import api from '../../api'
import { TemperatureRecord, getProfiles } from '../../api/methods'

export default function TemperRecord() {
  const { data: profiles } = useSWR('getProfiles', getProfiles)

  const MemberData = useMemo(
    () => (profiles ? profiles.map((item) => ({ value: item.ID, text: item.relationship })) : []),
    [profiles]
  )
  const router = Taro.getCurrentInstance().router

  useEffect(() => {
    const fetchData = async () => {
      if (router && router.params && router.params.id !== undefined) {
        try {
          const res = await api.get('/api/temperature-records/' + router.params.id)
          const result = res.data as TemperatureRecord
          console.log('memberData', MemberData)
          console.log('result', result)
          const relation = MemberData.find((item) => item.value === result.profileId)
          setIdDesc(relation ? relation.text : '')
          setDateDesc(result.date)
          setNoteValue(result.note)
          updateTemperature(result.temperature)
          setTempRecord(result)
        } catch (error) {
          console.error('Error fetching member information:', error)
          Taro.showToast({ title: '获取信息失败', icon: 'error' })
        }
      }
    }
    fetchData()
  }, [MemberData])

  const [tempRecord, setTempRecord] = useState<Partial<TemperatureRecord>>({
    date: '',
    temperature: 36.2,
    note: '',
  })

  const updateTemperature = (value: number) => {
    const newTemperRecord = {
      ...tempRecord,
      temperature: value,
    }
    setTempRecord(newTemperRecord)
  }

  const [idVisible, setIdVisible] = useState(false)
  const [idDesc, setIdDesc] = useState('')
  const confirmId = (options: PickerOption[], values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setIdDesc(description)
    const newTemperRecord = {
      ...tempRecord,
      profileId: values[0] as number,
    }
    setTempRecord(newTemperRecord)
  }

  const startDate = new Date(2020, 0, 1)
  const endDate = new Date(2050, 11, 30)
  const [dateShow, setDateShow] = useState(false)
  const [dateDesc, setDateDesc] = useState(new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 16))
  const confirmDate = (values: (string | number)[], _options: PickerOption[]) => {
    const date = values.slice(0, 3).join('-')
    const time = values.slice(3).join(':')
    setDateDesc(`${date} ${time}`)
    const newTemperRecord = {
      ...tempRecord,
      date: `${date} ${time}`,
    }
    setTempRecord(newTemperRecord)
  }

  const [noteValue, setNoteValue] = useState('')
  const onNoteChange = (value: string) => {
    const newTemperRecord = {
      ...tempRecord,
      note: value,
    }
    setTempRecord(newTemperRecord)
    setNoteValue(value)
  }

  const handleSubmission = async () => {
    console.log('temperature:', tempRecord) // for debug
    if (router && router.params && router.params.id) {
      console.log('id:', router.params) // for debug
      const { id } = router.params
      if (id) {
        try {
          const res = await api.request({ url: `/api/temperature-records/${id}`, method: 'PUT', data: tempRecord })
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
      else{
        Taro.showToast({ title: 'ID not found!', icon: 'error' })
      }
    } else {
      if (tempRecord && tempRecord.profileId !== undefined && tempRecord.profileId >= 0) {
        try {
          const res = await api.request({ url: '/api/temperature-records', method: 'POST', data: tempRecord })
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
  }

  const handleReset = () => {
    const newTemperRecord = {
      ...tempRecord,
      date: '',
      temperature: 36.2,
      note: '',
    }
    setTempRecord(newTemperRecord)
    setIdDesc('')
    setDateDesc('')
    setIdVisible(false) // 关闭 Picker
    setDateShow(false) // 关闭 DatePicker
    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  return (
    <>
      <Cell
        title='测温成员'
        description={idDesc}
        onClick={() => setIdVisible(!idVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='测温成员'
        visible={idVisible}
        options={MemberData}
        onConfirm={(list, values) => confirmId(list, values)}
        onClose={() => setIdVisible(false)}
      />
      <Cell title='测温时间' description={dateDesc} onClick={() => setDateShow(true)} style={{ textAlign: 'center' }} />
      <DatePicker
        title='测温时间'
        startDate={startDate}
        endDate={endDate}
        visible={dateShow}
        type='datetime'
        onClose={() => setDateShow(false)}
        onConfirm={(options, values) => confirmDate(values, options)}
      />

      {/* <View id='temper_slider' style={{ textAlign: 'center' }}>
                <Text id="temper_val"> 体温: {temperature.val} ℃</Text>
                <Slider step={0.1} value={temperature.val} showValue min={34} max={42} onChanging={(value) => updateTemperature(value)} />
            </View> */}
      <>
        <Cell.Group divider={false}>
          <Cell className='temper_val_display' style={{ textAlign: 'center', padding: '10px,18px' }}>
            <Text id='temper_val'>{tempRecord.temperature?.toFixed(1)} ℃</Text>
          </Cell>
          <Cell className='slider' style={{ padding: '20px,18px' }}>
            <Range
              defaultValue={36.2}
              value={tempRecord.temperature}
              maxDescription={42.0}
              minDescription={34.0}
              max={42.0}
              min={34.0}
              step={0.1}
              currentDescription={null}
              marks={{
                35.0: 35.0,
                36.0: 36.0,
                37.0: 37.0,
                38.0: 38.0,
                39.0: 39.0,
                40.0: 40.0,
                41.0: 41.0,
              }}
              onChange={(val) => {
                if (typeof val === 'number') {
                  updateTemperature(parseFloat(val.toFixed(1)))
                }
              }}
            />
          </Cell>
        </Cell.Group>
      </>
      <Cell title='TextArea' className='col-span-full px-8' style={{ borderRadius: '8px' }}>
        <TextArea placeholder='请输入备注' value={noteValue} autoSize onChange={(value) => onNoteChange(value)} />
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
