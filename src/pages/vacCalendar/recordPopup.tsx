import Taro from '@tarojs/taro'
import { ReactNode, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import { Image, PageContainer, ScrollView } from '@tarojs/components'
import { Date as DateIcon, Clock, Checked, Order, Edit, Del2, Link as ImageIcon } from '@nutui/icons-react-taro'

import InjectSVG from '../../assets/home/injection.svg'

import { useRecordPopup } from '../../models'
import { useProfiles, useVaccineRecordList, deleteVaccineRecord, putVaccineRecord, useVaccines } from '../../api'
import { dayjs } from '../../utils'

export default function RecordPopup() {
  const recordID = useRecordPopup.use.recordId()
  const isShow = useRecordPopup.use.isShow()
  const hide = useRecordPopup.use.hide()

  const { data: allRecords, mutate: refresh } = useVaccineRecordList()

  const { id2name } = useVaccines()

  const record = useMemo(() => {
    if (!recordID) return undefined
    return allRecords?.find((r) => r.ID === recordID)
  }, [recordID, allRecords])

  const handleDelete = async () => {
    if (!recordID) return
    await deleteVaccineRecord(recordID)
    refresh()
    hide()
  }

  const handleComplete = async () => {
    if (!recordID || record?.isCompleted) return
    await putVaccineRecord(recordID, { ...record, isCompleted: true, vaccinationDate: dayjs().format('YYYY-MM-DD') })
    refresh()
  }

  const handleEdit = () => {
    Taro.navigateTo({ url: `/pages/record/index?id=` + recordID })
  }

  useEffect(() => {
    if (!record) hide()
  }, [record, hide])

  return (
    <PageContainer
      round
      show={isShow}
      overlayStyle='background-color:rgba(225,225,225,0);backdrop-filter:blur(2px);'
      position='bottom'
      onLeave={hide}
    >
      <ScrollView scrollY className='h-screen'>
        <div className='flex flex-col justify-center px-4 pt-2 pb-8'>
          <Nav />

          <Header profileId={record?.profileId} vaccineName={id2name(record?.vaccineId)} />
          <GrayCard text={record?.vaccinationType || '类型'} />

          <DividerLine />

          <SubHeader icon={<DateIcon />} text='日期' />
          <div className='flex justify-between gap-x-2'>
            <GrayCard title='接种日期' text={record?.vaccinationDate} />
            <GrayCard title='失效日期' text={record?.nextVaccinationDate} />
          </div>
          <CompeleteCard onClick={handleComplete} isCompleted={record?.isCompleted} />

          <DividerLine />

          {record?.isCompleted === false && (
            <>
              <SubHeader icon={<Clock />} text='提醒' />
              <GrayCard title='提前提醒' text={record?.reminder ? '失效' + record.remindBefore + '前' : '未设置'} />
              <DividerLine />
            </>
          )}

          <SubHeader icon={<Order />} text='备注' />
          <GrayCard text={record?.note || '暂无备注'} />

          <DividerLine />

          {record?.voucher && record?.voucher !== '' && (
            <>
              <SubHeader icon={<ImageIcon />} text='凭证' />
              <GrayCard
                node={
                  <Image
                    src={record.voucher}
                    mode='aspectFit'
                    className='w-full h-32'
                    onClick={() => Taro.previewImage({ urls: [record.voucher] })}
                  />
                }
              />
              <DividerLine />
            </>
          )}

          <div className='flex justify-between gap-x-2'>
            <GrayCardAction icon={<Edit size={16} />} text='编辑' onClick={handleEdit} />
            <GrayCardAction icon={<Del2 size={16} />} text='删除' onClick={handleDelete} />
          </div>
        </div>
      </ScrollView>
    </PageContainer>
  )
}

const Nav = () => {
  const hide = useRecordPopup.use.hide()
  return (
    <header className='flex flex-row items-center justify-between w-full py-2'>
      <h1 className='text-xl font-bold'>记录详情</h1>
      <h1 className='text-brand' onClick={hide}>
        返回
      </h1>
    </header>
  )
}

const Header = (props: { profileId?: number; vaccineName?: string }) => {
  const { id2name } = useProfiles()

  return (
    <div className='flex flex-row mt-4 items-center gap-x-2'>
      <div className='h-16 w-16 rounded-full bg-brand p-2'>
        <img src={InjectSVG} className='h-full w-full invert' />
      </div>
      <div className='flex flex-col'>
        <text className='text-sm text-gray-500 font-sans font-semibold'>{id2name(props.profileId)}</text>
        <text className='text-2xl text-brand font-semibold'>{props.vaccineName}</text>
      </div>
    </div>
  )
}

const DividerLine = () => {
  return <div className='h-px w-full bg-gray-100 my-4'></div>
}

function SubHeader(props: { icon?: ReactNode; text?: string }) {
  return (
    <header className='flex flex-row items-center'>
      {props.icon}
      <text className='ml-2 text-lg font-semibold'>{props.text}</text>
    </header>
  )
}

function GrayCard(props: { title?: string; text?: string; node?: ReactNode }) {
  return (
    <div className='flex flex-col w-full bg-gray-100 rounded-2xl mt-2 px-4 py-2'>
      <text className='text-sm text-gray-500'>{props.title}</text>
      <text className='self-center text-base text-black font-bold font-sans'>{props.text}</text>
      {props.node}
    </div>
  )
}

function GrayCardAction(props: { icon?: ReactNode; text?: string; onClick?: () => void }) {
  return (
    <div className='flex flex-col w-full bg-gray-100 rounded-2xl mt-2 px-4 py-2' onClick={props.onClick}>
      <div className='flex justify-center items-center gap-x-2 text-brand'>
        {props.icon}
        <text className='self-center text-base font-bold font-sans'>{props.text}</text>
      </div>
    </div>
  )
}

function CompeleteCard(props: { isCompleted?: boolean; onClick?: () => void }) {
  return (
    <div className='flex justify-between gap-x-2' onClick={props.onClick}>
      <div
        className={clsx(
          'flex w-full justify-center items-center gap-x-2 rounded-2xl mt-2 px-4 py-2',
          'transition-colors duration-500',
          {
            'text-white bg-brand': props.isCompleted === false,
            'text-black bg-gray-100': typeof props.isCompleted === 'undefined' || props.isCompleted,
          }
        )}
      >
        {props.isCompleted ? null : <Checked />}
        <text className='self-center text-base font-bold font-sans'>
          {props.isCompleted ? '已完成接种' : '标记为已接种'}
        </text>
      </div>
    </div>
  )
}
