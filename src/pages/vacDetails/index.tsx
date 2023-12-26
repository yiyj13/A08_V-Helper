import { useState } from 'react'
import { useRouter } from 'taro-hooks'
import { ScrollView, Text } from '@tarojs/components'
import { Loading } from '@nutui/nutui-react-taro'
import clsx from 'clsx'

import Header from './header'
import DiscussionBlock from './discussion'
import { useVaccines } from '../../api'

export default function Index() {
  const [route] = useRouter()
  const { id } = route.params

  const [tabIdx, setTabIdx] = useState(0)

  const { data } = useVaccines()
  const vaccine = data?.find((v) => v.ID === parseInt(id))

  const activeId = 'detailTab' + tabIdx

  if (!vaccine) return <Loading className='w-screen h-screen'></Loading>

  return (
    <div className='flex h-screen w-screen flex-col'>
      <Header activeId={tabIdx} vaccine_id={vaccine.ID} setActiveId={setTabIdx} />
      <ScrollView style={{ height: 'calc(100vh - 7rem)' }} scrollY scrollWithAnimation scrollIntoView={activeId}>
        <DetailBlock
          id='detailTab0'
          title='疫苗介绍'
          paragraph={vaccine?.description}
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
        <DetailBlock id='detailTab3' title='大家讨论' activeId={activeId}></DetailBlock>
        <DiscussionBlock vaccine_id={vaccine.ID} />
      </ScrollView>
    </div>
  )
}

function DetailBlock(props: { id: string; title: string; paragraph?: string; activeId: string }) {
  return (
    <div id={props.id} className='p-4'>
      <header
        className={clsx('my-2 text-xl font-bold transition-colors', {
          'text-brand': props.id === props.activeId,
        })}
      >
        {props.title}
      </header>
      {props.paragraph ? (
        <div className='px-2'>
          <Text userSelect className='text-base'>
            {props.paragraph}
          </Text>
        </div>
      ) : null}
    </div>
  )
}
