import { useState, useMemo } from 'react'
import { Button, Menu } from '@nutui/nutui-react-taro'
import { IconFont, Edit } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

import { useProfiles, useVaccineRecordList, useVaccines } from '../../api'

import { VaccinationRecord } from '../../api/methods'
import { dayjs } from '../../utils'

export default function RecordHistory() {
  const { data: profiles } = useProfiles()
  const { data: recordList } = useVaccineRecordList()
  const vaccinationRecordList = useMemo(() => {
    if (!recordList) return []
    const result = recordList as VaccinationRecord[]
    return result
      .filter((r) => r.isCompleted)
      .sort((a, b) => dayjs(b.vaccinationDate).unix() - dayjs(a.vaccinationDate).unix())
  }, [recordList])

  const handleAddRecord = () => {
    Taro.navigateTo({ url: '/pages/record/index' })
  }

  const [menuValue, setMenuValue] = useState<number>(0)

  const MemberDataList = useMemo(() => {
    const dataList = profiles ? profiles.map((item) => ({ value: item.ID, text: item.relationship })) : []
    dataList.unshift({ value: 0, text: '所有成员' })
    return dataList
  }, [profiles])

  return (
    <div style={{ height: '100%', position: 'relative', paddingBottom: '70px' }}>
      <Menu>
        <Menu.Item
          options={MemberDataList}
          defaultValue={0}
          value={menuValue}
          onChange={(v) => {
            setMenuValue(v.value)
          }}
        />
      </Menu>
      {vaccinationRecordList
        ?.filter((item) => (menuValue !== 0 ? item.profileId === menuValue : true))
        .map((item, index) => (
          <ItemRender data={item} key={index} />
        ))}
      <Button
        type='primary'
        onClick={handleAddRecord}
        style={{ width: '90%', position: 'fixed', bottom: '10px', marginLeft: '5%', marginRight: '5%', zIndex: 999 }}
      >
        新增记录
      </Button>
    </div>
  )
}

const ItemRender = ({ data }: { data: VaccinationRecord }) => {
  const { selectByID } = useProfiles()
  const profileInfo = selectByID(data.profileId)
  const { id2name } = useVaccines()

  const handleEditRecord = (recordData: VaccinationRecord) => {
    Taro.navigateTo({
      url: `/pages/record/index?id=` + recordData.ID,
    })
  }

  return (
    <div
      className='border border-gray-300 p-4 rounded-md'
      style={{ borderRadius: '8px', marginLeft: '10px', marginRight: '10px' }}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <IconFont className='text-2xl mr-2' name={profileInfo?.avatar} style={{ width: '40px', height: '40px' }} />
          <div className='flex justify-between mt-2'>
            <div className='font-bold' style={{ color: '#4796A1' }}>
              {profileInfo?.relationship}
            </div>
            <div className='font-bold ml-2'>{profileInfo?.fullName}</div>
          </div>
        </div>
        <Edit className='cursor-pointer' onClick={() => handleEditRecord(data)} />
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          接种疫苗 <b className='text-black font-bold'>{id2name(data.vaccineId)}</b>
        </div>
        <div className='text-gray-500'>
          接种类型 <b className='text-black font-bold'>{data.vaccinationType}</b>
        </div>
      </div>
      <div className='flex justify-between mt-2'>
        <div className='text-gray-500'>
          接种日期 <b className='text-black font-bold'>{data.vaccinationDate}</b>
        </div>
        <div className='text-gray-500'>
          到期时间 <b className='text-black font-bold'>{data.nextVaccinationDate}</b>
        </div>
      </div>
    </div>
  )
}
