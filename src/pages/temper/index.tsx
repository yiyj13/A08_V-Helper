/* TODO:
    1. Gradient color for the slider 
*/

import { useState, useMemo, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Text } from '@tarojs/components'
import { Cell as NutCell, Picker, Range, DatePicker, Button, TextArea, InputNumber } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'

import { TemperatureRecord, postTemperatureRecord, putTemperatureRecord, deleteTemperatureRecord } from '../../api'
import { useProfiles, useTemperatureList } from '../../api/hooks'

import { CheckProfileWrap } from '../../components/checkprofilewrap'
import { FormCell as Cell, HeaderNecessary, HeaderOptional } from '../../components/formcell'
import useThrottle from '../../utils/useThrottle'

export default function Index() {
  return (
    <CheckProfileWrap>
      <TemperRecord />
    </CheckProfileWrap>
  )
}

export function TemperRecord() {
  const { data: profiles } = useProfiles()

  const MemberData = useMemo(
    () => (profiles ? profiles.map((item) => ({ value: item.ID, text: item.fullName })) : []),
    [profiles]
  )
  const { data: allTemperatures, mutate: refreshTemperatureCache } = useTemperatureList()

  const router = useMemo(() => Taro.getCurrentInstance().router, [])
  const withParams = router?.params?.id !== undefined

  useEffect(() => {
    const fetchData = async () => {
      if (router && router.params && router.params.id !== undefined) {
        try {
          const result = allTemperatures?.find((item) => item.ID === Number(router?.params.id))
          if (!result) {
            // TODO: handle 404
            return
          }
          const relation = MemberData.find((item) => item.value === result.profileId)
          setIdDesc(relation ? relation.text : '')
          setDateDesc(result.date)
          setNoteValue(result.note)
          setTempRecord(result)
        } catch (error) {
          console.error('Error fetching member information:', error)
          Taro.showToast({ title: '获取信息失败', icon: 'error' })
        }
      }
    }
    fetchData()
  }, [MemberData, allTemperatures, router])

  const [tempRecord, setTempRecord] = useState<Partial<TemperatureRecord>>({
    date: new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 16),
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
  const endDate = new Date(2030, 11, 31)
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
    setTempRecord({
      ...tempRecord,
      date: dateDesc,
      note: noteValue,
    })
    if (typeof tempRecord.temperature !== 'undefined' && typeof tempRecord.temperature === 'string') {
      tempRecord.temperature = parseFloat(tempRecord.temperature)
    }
    if (router && router.params && router.params.id) {
      const { id } = router.params
      if (id) {
        try {
          await putTemperatureRecord(Number(id), tempRecord)
          refreshTemperatureCache()
          Taro.showToast({ title: '提交成功', icon: 'success' })
          setTimeout(() => {
            Taro.navigateBack()
          }, 1000)
        } catch (error) {
          Taro.showToast({ title: '提交失败', icon: 'error' })
        }
      } else {
        Taro.showToast({ title: 'ID not found!', icon: 'error' })
      }
    } else {
      if (tempRecord && tempRecord.profileId !== undefined && tempRecord.profileId >= 0) {
        try {
          await postTemperatureRecord(tempRecord)
          refreshTemperatureCache()
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
    const newTemperRecord = {
      ...tempRecord,
      date: new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 16),
      temperature: 36.2,
      note: '',
    }
    setTempRecord(newTemperRecord)
    setIdDesc('')
    setDateDesc(new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 16))
    setIdVisible(false) // 关闭 Picker
    setDateShow(false) // 关闭 DatePicker
    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  const handleDelete = async () => {
    await deleteTemperatureRecord(Number(router?.params.id))
    Taro.showToast({ title: '删除成功', icon: 'success' })
    refreshTemperatureCache()
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const { actionDisabled, throttle } = useThrottle()

  return (
    <div className='px-4 flex flex-col gap-y-1 animate-delayed-show'>
      <HeaderNecessary />
      <Cell
        title='测温成员'
        description={idDesc}
        onClick={() => setIdVisible(!idVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='测温成员'
        // @ts-ignore
        value={withParams ? [tempRecord.profileId] : undefined}
        visible={idVisible}
        options={MemberData}
        onConfirm={(list, values) => confirmId(list, values)}
        onClose={() => setIdVisible(false)}
      />
      <Cell title='测温时间' description={dateDesc} onClick={() => setDateShow(true)} style={{ textAlign: 'center' }} />
      <DatePicker
        title='测温时间'
        value={new Date(Date.now())}
        startDate={startDate}
        endDate={endDate}
        visible={dateShow}
        type='datetime'
        onClose={() => setDateShow(false)}
        onConfirm={(options, values) => confirmDate(values, options)}
      />
      <Cell title='体温数值'>
        <NutCell.Group divider={false} className='flex justify-center'>
          <NutCell className='flex-2 justify-center text-center'>
            <InputNumber
              defaultValue={36.2}
              value={tempRecord.temperature}
              step='0.1'
              digits='1'
              onChange={updateTemperature}
            />
            <Text id='temper_unit'>℃</Text>
          </NutCell>
          <NutCell className='flex-3 justify-center text-center'>
            <Range
              className='justify-center'
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
          </NutCell>
        </NutCell.Group>
      </Cell>
      <HeaderOptional />
      <Cell title='备注' className='col-span-full px-8' style={{ borderRadius: '8px' }}>
        <TextArea className='rounded-md' placeholder='请输入备注' value={noteValue} autoSize onChange={(value) => onNoteChange(value)} />
      </Cell>
      <div className='col-span-full flex justify-center mt-4'>
        <Button className='submit_btm' formType='submit' type='primary' onClick={throttle(handleSubmission)} disabled={actionDisabled}>
          提交
        </Button>
        <div style={{ marginLeft: '16px' }}>
          {withParams ? (
            <Button type='danger' fill='outline' onClick={throttle(handleDelete)} disabled={actionDisabled}>
              删除
            </Button>
          ) : (
            <Button id='reset_btm' formType='reset' onClick={throttle(handleReset)} disabled={actionDisabled}>
              重置
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
