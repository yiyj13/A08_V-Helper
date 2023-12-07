import { useState, useEffect } from 'react'
import { useRouter } from 'taro-hooks'
import { ScrollView, Text } from '@tarojs/components'
import { Follow, Uploader } from '@nutui/icons-react-taro'
import { Loading } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import clsx from 'clsx'
import api from '../../api'

import Tab from './tab'

type Vaccine = {
  id: string
  name: string
  description: string
  targetDisease: string
  sideEffects: string
  precautions: string
}

export default function Index() {
  const [vaccine, setVaccine] = useState<Vaccine>()
  const [route] = useRouter()
  const { id } = route.params

  const [tabIdx, setTabIdx] = useState(0)

  useEffect(() => {
    api.request({ url: '/api/vaccines/' + id }).then((res) => {
      const result = res.data as Vaccine
      setVaccine(result)
    })
  }, [id])

  if (!vaccine) return <Loading className='w-screen h-screen'></Loading>

  const tabs = ['疫苗介绍', '注意事项', '目标病症', '大家讨论']
  const activeId = 'detailTab' + tabIdx

  return (
    <div className='flex h-screen w-screen flex-col'>
      <div className='flex py-8 w-full flex-row items-center justify-between'>
        <label className='ml-4 text-2xl font-bold'>{vaccine.name}</label>
        <div className='mr-4 flex flex-row'>
          <Follow className='text-brand' width={20} height={20} />
        </div>
      </div>
      <div className='flex h-full w-full flex-col rounded-3xl bg-slate-100'>
        <Tab titles={tabs} value={tabIdx} setValue={setTabIdx} />
        <ScrollView className='self-center h-[72vh]' scrollY scrollWithAnimation scrollIntoView={activeId}>
          <DetailBlock
            id='detailTab0'
            title='疫苗介绍'
            paragraph={vaccine.description}
            activeId={activeId}
          ></DetailBlock>
          <DetailBlock
            id='detailTab1'
            title='注意事项'
            paragraph={vaccine.precautions + '\n' + vaccine.sideEffects}
            activeId={activeId}
          ></DetailBlock>
          <DetailBlock
            id='detailTab2'
            title='目标病症'
            paragraph={vaccine.targetDisease}
            activeId={activeId}
          ></DetailBlock>
          <DetailBlock id='detailTab3' title='大家讨论' paragraph='暂无' activeId={activeId}></DetailBlock>
          <div
            className={clsx('flex justify-center items-center rounded-2xl mx-4 py-2 bg-slate-200', 'active:scale-105')}
            onClick={() => Taro.navigateTo({ url: '/pages/sendpost/index' })}
          >
            <Uploader className='text-brand'></Uploader>
          </div>
        </ScrollView>
      </div>
    </div>
  )
}

const LOREM =
  'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.'

type BlockProps = {
  id: string
  title: string
  paragraph: string
  activeId: string
}
function DetailBlock(props: BlockProps) {
  return (
    <div id={props.id} className='p-4'>
      <header
        className={clsx('my-2 text-xl font-bold transition-colors', {
          'text-brand': props.id === props.activeId,
        })}
      >
        {props.title}
      </header>
      <Text className='text-base'>{props.paragraph !== '' ? props.paragraph : LOREM}</Text>
    </div>
  )
}
