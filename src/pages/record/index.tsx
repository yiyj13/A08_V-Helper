/* TODO: 
    1. CSS style for the menu and the buttons
*/

import Taro from '@tarojs/taro'
import { useState, useMemo, useEffect } from 'react'
import { Cell, Switch, Picker, Button, DatePicker, TextArea, Input, Popover } from '@nutui/nutui-react-taro'
import { PickerOption } from '@nutui/nutui-react-taro/dist/types/packages/picker/types'
import { Image } from '@tarojs/components'

import { VaccinationRecord, postVaccineRecord, putVaccineRecord, postMessage } from '../../api'
import { useProfiles, useVaccines, useVaccineRecordList } from '../../api/hooks'
import { pushWXSubscription } from '../../api/subscribe'
import { dayjs } from '../../utils'
import { PICTURE_BASE_URL } from '../../api/config'
import { getUserID } from '../../models'
import { uploadImage } from '../../api/imageUploader'

export default function VaccineRecord() {
  const router = useMemo(() => Taro.getCurrentInstance().router, [])

  const [record, setRecord] = useState<Partial<VaccinationRecord>>({
    reminder: false,
  })

  const { id2name } = useVaccines()

  const { data: allRecords, mutate: refreshRecordCache } = useVaccineRecordList()

  const { data: profiles, selectByID } = useProfiles()
  const MemberData = useMemo(
    () => (profiles ? [profiles.map((item) => ({ value: item.ID, text: item.relationship }))] : []),
    [profiles]
  )

  useEffect(() => {
    const fetchData = async () => {
      if (router?.params.id === undefined) return

      try {
        const result = allRecords?.find((item) => item.ID === Number(router.params.id))
        if (!result) {
          // TODO: handle 404
          return
        }
        const relation = MemberData[0].find((item) => item.value === result.profileId)
        setIdDesc(relation ? relation.text : '')
        setNameDesc(id2name(result.vaccineId))
        setTypeDesc(result.vaccinationType)
        setDateDesc(result.vaccinationDate)
        setValidDesc(result.valid)
        setRemindSwitch(result.reminder)
        if (result.reminder) {
          setRemindVisible(true)
          setRemindValue(result.remindBefore.slice(0, -1))
          setRemindUnit(result.remindBefore.slice(-1))
        }
        setNoteValue(result.note)
        setRecord(result)
      } catch (error) {
        console.error('Error fetching member information:', error)
        Taro.showToast({ title: '获取信息失败', icon: 'error' })
      }
    }
    fetchData()
  }, [MemberData, router, allRecords, id2name])

  const { data: vaccines } = useVaccines()
  const VaccineData = vaccines ? [vaccines.map((item) => ({ value: item.ID, text: item.name }))] : []

  const TypeData = [
    [
      { value: 0, text: '免疫接种第一针' },
      { value: 1, text: '免疫接种第二针' },
      { value: 2, text: '免疫接种第三针' },
      { value: 3, text: '免疫接种第四针' },
      { value: 4, text: '常规接种' },
      { value: 5, text: '加强针剂' },
      { value: 6, text: '补种疫苗' },
    ],
  ]

  const ValidData = [
    [
      { value: 0, text: '3月' },
      { value: 1, text: '6月' },
      { value: 2, text: '9月' },
      { value: 3, text: '1年' },
      { value: 4, text: '2年' },
      { value: 5, text: '3年' },
      { value: 6, text: '4年' },
      { value: 7, text: '5年' },
      { value: 8, text: '6年' },
      { value: 9, text: '7年' },
      { value: 10, text: '8年' },
      { value: 11, text: '9年' },
      { value: 12, text: '10年' },
      { value: 13, text: '终身' },
    ],
  ]

  const [idVisible, setIdVisible] = useState(false)
  const [idDesc, setIdDesc] = useState('')
  const confirmID = (options: PickerOption[], values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setIdDesc(description)
    setRecord({
      ...record,
      profileId: values[0] as number,
    })
  }

  const [nameVisible, setNameVisible] = useState(false)
  const [nameDesc, setNameDesc] = useState('')
  const confirmName = (options: PickerOption[], values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setNameDesc(description)
    setRecord({
      ...record,
      vaccineId: values[0] as number,
    })
  }

  const [typeVisible, setTypeVisible] = useState(false)
  const [typeDesc, setTypeDesc] = useState('')
  const confirmType = (options: PickerOption[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setTypeDesc(description)
    setRecord({
      ...record,
      vaccinationType: description,
    })
  }

  const startDate = new Date(2000, 0, 1)
  const endDate = new Date(2025, 11, 30)
  const todayDate = new Date(Date.now()).toISOString().replace('T', ' ').slice(0, 10)
  const [dateVisible, setDateVisible] = useState(false)
  const [dateDesc, setDateDesc] = useState(todayDate)
  const confirmDate = (values: (string | number)[], _options: PickerOption[]) => {
    const date = values.slice(0, 3).join('-')
    setDateDesc(`${date}`)
    setRecord({
      ...record,
      vaccinationDate: date,
    })
  }

  const [validVisible, setValidVisible] = useState(false)
  const [validDesc, setValidDesc] = useState('')

  const padZero = (value: number) => {
    return value < 10 ? `0${value}` : value.toString()
  }

  const addDays = (dateString: string | undefined, days: string) => {
    if (dateString === undefined) {
      return 'Error' // for debug
    } else {
      const dateArray = dateString.split('-')
      const year = parseInt(dateArray[0], 10)
      const month = parseInt(dateArray[1], 10)
      const day = parseInt(dateArray[2], 10)
      if (days.slice(-1) === '月') {
        const addMonth = parseInt(days.slice(0, -1), 10)
        const newMonth = month + addMonth
        if (newMonth <= 12) {
          return `${year}-${padZero(newMonth)}-${padZero(day)}`
        } else {
          const newYear = year + 1
          const correctedMonth = newMonth - 12
          return `${newYear}-${padZero(correctedMonth)}-${padZero(day)}`
        }
      } else if (days.slice(-1) === '年') {
        const addYear = parseInt(days.slice(0, -1), 10)
        const newYear = year + addYear
        return `${newYear}-${padZero(month)}-${padZero(day)}`
      } else if (days.slice(-1) === '终') {
        return '终身有效'
      } else {
        return 'Error' // for debug
      }
    }
  }

  const confirmValid = (options: PickerOption[], _values: (string | number)[]) => {
    let description = ''
    options.forEach((option: any) => {
      description += option.text
    })
    setValidDesc(description)
    setRecord({
      ...record,
      valid: description,
    })
  }

  const remindDisabled = router?.params.id !== undefined
  const [remindSwitch, setRemindSwitch] = useState(false)
  const [remindVisible, setRemindVisible] = useState(false)
  const [remindValue, setRemindValue] = useState('')
  const [remindUnit, setRemindUnit] = useState('单位')
  const [unitVisible, setUnitVisible] = useState(false)
  const itemList = [
    {
      key: '日',
      name: '日',
    },
    {
      key: '周',
      name: '周',
    },
    {
      key: '月',
      name: '月',
    },
  ]
  const onSwitchChange = (value: boolean) => {
    setRemindSwitch(value)
    setRecord({
      ...record,
      reminder: value,
    })
    setRemindVisible(value)
  }

  const [noteValue, setNoteValue] = useState('')
  const onNoteChange = (value: string) => {
    setRecord({
      ...record,
      note: value,
    })
    setNoteValue(value)
  }

  const subtractDays = (dateString: string | undefined, days: string) => {
    if (record.reminder === false || dateString === undefined || days === undefined) {
      return ' '
    } else {
      const dateArray = dateString.split('-')
      const year = parseInt(dateArray[0], 10)
      const month = parseInt(dateArray[1], 10)
      const day = parseInt(dateArray[2], 10)

      if (days.slice(-1) === '日') {
        const subtractDay = parseInt(days.slice(0, -1), 10)
        const newDay = day - subtractDay

        if (newDay > 0) {
          return `${year}-${month}-${newDay}`
        } else {
          const newMonth = month - 1
          const daysInPreviousMonth = new Date(year, newMonth, 0).getDate()
          const correctedDay = daysInPreviousMonth + newDay
          return `${year}-${newMonth}-${correctedDay}`
        }
      } else if (days.slice(-1) === '周') {
        const subtractWeek = parseInt(days.slice(0, -1), 10)
        const newDay = day - subtractWeek * 7

        if (newDay > 0) {
          return `${year}-${month}-${newDay}`
        } else {
          const newMonth = month - 1
          const daysInPreviousMonth = new Date(year, newMonth, 0).getDate()
          const correctedDay = daysInPreviousMonth + newDay
          return `${year}-${newMonth}-${correctedDay}`
        }
      } else if (days.slice(-1) === '月') {
        const subtractMonth = parseInt(days.slice(0, -1), 10)
        const newMonth = month - subtractMonth

        if (newMonth > 0) {
          return `${year}-${newMonth}-${day}`
        } else {
          const newYear = year - 1
          const correctedMonth = 12 + newMonth
          return `${newYear}-${correctedMonth}-${day}`
        }
      } else {
        return ' '
      }
    }
  }

  const handleSubmission = async () => {
    record.valid = validDesc
    record.vaccinationDate = dateDesc

    if (router && router.params && router.params.id) {
      const { id } = router.params
      if (id) {
        try {
          const nextVaccinationDate = addDays(record.vaccinationDate, validDesc)
          const remindTime = subtractDays(nextVaccinationDate, remindValue + remindUnit).concat(' 10:00')
          await uploadImageBeforeSubmit()
          await putVaccineRecord(Number(id), {
            ...record,
            nextVaccinationDate: nextVaccinationDate,
            remindTime: remindTime,
            remindBefore: remindValue + remindUnit,
          })
          refreshRecordCache()
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
      if (
        record &&
        record.profileId !== undefined &&
        record.profileId >= 0 &&
        record.vaccineId !== undefined &&
        record.vaccineId >= 0 &&
        record.vaccinationType !== undefined &&
        record.vaccinationType !== '' &&
        record.vaccinationDate !== undefined &&
        record.vaccinationDate !== '' &&
        record.valid !== undefined &&
        record.valid !== ''
      ) {
        const nextVaccinationDate = addDays(record.vaccinationDate, validDesc)
        const remindTime = subtractDays(record.vaccinationDate, remindValue + remindUnit).concat(' 10:00')
        try {
          if (record.reminder) {
            await pushWXSubscription()
            await postMessage({
              comment: `${selectByID(record.profileId)?.fullName}的${id2name(record.vaccineId)}`,
              vaxNum: (() => {
                const type = TypeData[0].find((item) => item.text === record.vaccinationType)?.value
                if (type === undefined || type > 3) {
                  return 1
                } else {
                  return type + 1
                }
              })(),
              sendTime: (() => {
                return dayjs(remindTime).format('YYYY-MM-DD HH:mm')
              })(),
              sent: false,
            })
          }
          await uploadImageBeforeSubmit()
          await postVaccineRecord({
            ...record,
            nextVaccinationDate: nextVaccinationDate,
            remindTime: remindTime,
            remindBefore: remindValue + remindUnit,
          })
          refreshRecordCache()
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
    setRecord({
      vaccinationDate: '',
      vaccinationType: '',
      reminder: false,
      remindTime: '',
      nextVaccinationDate: '',
      voucher: '',
      note: '',
      valid: '',
      remindBefore: '',
    })

    setIdDesc('')
    setNameDesc('')
    setTypeDesc('')
    setDateDesc('')
    setValidDesc('')
    setRemindValue('')
    setRemindUnit('')
    setNoteValue('')
    setRemindSwitch(false)

    setIdVisible(false)
    setNameVisible(false)
    setTypeVisible(false)
    setDateVisible(false)
    setValidVisible(false)
    setRemindVisible(false)

    Taro.showToast({ title: '重置成功', icon: 'success' })
  }

  const [voucherUrl, setVoucherUrl] = useState<string>('')
  const cloudpath = useMemo(() => `voucher/${getUserID()}/${dayjs().unix()}`, [])
  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        setVoucherUrl(res.tempFilePaths[0])
        setRecord((prev) => ({ ...prev, voucher: `${PICTURE_BASE_URL}/${cloudpath}` }))
      },
    })
  }
  const uploadImageBeforeSubmit = async () => {
    if (record.voucher !== undefined && record.voucher !== '' && voucherUrl !== '') {
      await uploadImage(voucherUrl, cloudpath)
    }
  }
  const previewUrl = (voucherUrl !== '' ? voucherUrl : record.voucher) ?? ''

  return (
    <>
      <Cell
        title='接种人'
        description={idDesc}
        onClick={() => setIdVisible(!idVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='接种人'
        // @ts-ignore
        value={[record.profileId]}
        visible={idVisible}
        options={MemberData}
        onConfirm={(list, values) => confirmID(list, values)}
        onClose={() => setIdVisible(false)}
      />
      <Cell
        title='疫苗名称'
        description={nameDesc}
        onClick={() => setNameVisible(!nameVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='疫苗名称'
        // @ts-ignore
        value={[record.vaccineId]}
        visible={nameVisible}
        options={VaccineData}
        onConfirm={(list, values) => confirmName(list, values)}
        onClose={() => setNameVisible(false)}
      />
      <Cell
        title='接种类型'
        description={typeDesc}
        onClick={() => setTypeVisible(!typeVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='接种类型'
        value={[TypeData[0].findIndex((item) => item.text === record.vaccinationType)]}
        visible={typeVisible}
        options={TypeData}
        onConfirm={(list) => confirmType(list)}
        onClose={() => setTypeVisible(false)}
      />
      <Cell
        title='接种时间'
        description={dateDesc}
        onClick={() => setDateVisible(true)}
        style={{ textAlign: 'center' }}
      />
      <DatePicker
        title='接种时间'
        startDate={startDate}
        endDate={endDate}
        defaultValue={dayjs().toDate()}
        visible={dateVisible}
        type='date'
        onClose={() => setDateVisible(false)}
        onConfirm={(options, values) => confirmDate(values, options)}
      />
      <Cell
        title='有效期限'
        description={validDesc}
        onClick={() => setValidVisible(!validVisible)}
        style={{ textAlign: 'center' }}
      />
      <Picker
        title='有效期限'
        value={[ValidData[0].findIndex((item) => item.text === record.valid)]}
        visible={validVisible}
        options={ValidData}
        onConfirm={(list, values) => confirmValid(list, values)}
        onClose={() => setValidVisible(false)}
      />
      <div className='col-span-full flex-content flex items-center mt-2 mb-2'>
        <span className='text-sm ml-2' style={{ height: '30px' }}>
          接种提醒
        </span>
        <Switch
          disabled={remindDisabled}
          defaultChecked={record.reminder}
          className=' ml-2'
          checked={remindSwitch}
          onChange={(value) => onSwitchChange(value)}
        />
        {remindVisible && !remindDisabled && (
          <div className=' flex items-center'>
            <Input
              type='number'
              placeholder='请输入数字'
              disabled={remindDisabled}
              maxLength={2}
              value={remindValue}
              onChange={(value) => setRemindValue(value)}
            />
            <Popover
              visible={unitVisible}
              list={itemList}
              location='bottom-start'
              onClick={() => {
                unitVisible ? setUnitVisible(false) : setUnitVisible(true)
              }}
              onSelect={(item) => {
                setRemindUnit(item.name)
                setUnitVisible(false)
              }}
            >
              <Button type='primary'>{remindUnit}</Button>
            </Popover>
            <span className='text-sm mr-2'>前提醒</span>
          </div>
        )}
      </div>

      <div className='col-span-full flex-content items-center'>
        <span className='ml-2 text-sm'>接种凭证</span>
        <Image
          src={previewUrl}
          mode='aspectFill'
          className='m-2 h-20 w-20 ring-brand ring-2 bg-slate-100 rounded-xl'
          onClick={handleChooseImage}
        />
      </div>
      <Cell title='TextArea' className='col-span-full px-8' style={{ borderRadius: '8px' }}>
        <TextArea placeholder='请输入备注' value={noteValue} autoSize onChange={(value) => onNoteChange(value)} />
      </Cell>
      <div className='col-span-full flex justify-center mt-4'>
        <Button id='submit_btm' formType='submit' type='primary' onClick={handleSubmission}>
          提交
        </Button>
        <div style={{ marginLeft: '16px' }}>
          <Button id='reset_btm' formType='reset' onClick={handleReset}>
            重置
          </Button>
        </div>
      </div>
    </>
  )
}
