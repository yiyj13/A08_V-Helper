import { Uploader, MoreX } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import clsx from 'clsx'
import useSWR from 'swr'

import { getTopArticlesWithVaccine } from '../../api'
import { ArticlePreview } from '../../components/articlepreview'
import { useCommunityStore, useTabStore } from '../../models'

export default function DiscussionBlock(props: { vaccine_id: number }) {
  const { data } = useSWR([props.vaccine_id, 'getTopArticlesWithVaccine'], ([vaccine_id]) =>
    getTopArticlesWithVaccine(vaccine_id)
  )

  const isEmpty = !data || data.length === 0

  return (
    <>
      <div className='px-4'>
        {isEmpty ? (
          <div className='flex flex-col items-center justify-center my-4'>
            <div className='text-2xl font-bold'>暂无讨论</div>
            <div className='text-gray-500'>快来发帖吧</div>
          </div>
        ) : (
          data?.map((article, index) => {
            return <ArticlePreview {...article} key={index} />
          })
        )}
      </div>
      <div className='py-6 flex justify-between'>
        <ActionSendPost vaccine_id={props.vaccine_id} />
        {isEmpty ? null : <ActionViewMore vaccine_id={props.vaccine_id} />}
      </div>
    </>
  )
}

const ActionSendPost = (props: { vaccine_id: number }) => {
  const handleSendPost = () => Taro.navigateTo({ url: '/pages/sendpost/index?vaccineID=' + props.vaccine_id })

  return <ActionButton onClick={handleSendPost} text='发帖' icon={<Uploader size={16} />} />
}

const ActionViewMore = (props: { vaccine_id: number }) => {
  const setTabIndexToCommunity = useTabStore((state) => () => {
    state.setTabIndex(3)
  })

  const setCommunityFilterToVaccine = useCommunityStore((state) => () => {
    state.setFilter(props.vaccine_id)
  })

  const handleViewMore = () => {
    setTabIndexToCommunity()
    setCommunityFilterToVaccine()
    Taro.reLaunch({ url: '/pages/index' })
  }

  return <ActionButton onClick={handleViewMore} text='更多' icon={<MoreX size={16} />} />
}

function ActionButton(props: { onClick: () => any; icon?: React.ReactNode; text: string }) {
  return (
    <div
      className={clsx(
        'flex-grow flex gap-x-2 font-semibold justify-center text-brand items-center rounded-2xl mx-4 py-2 bg-gray-100',
        'active:scale-105'
      )}
      onClick={props.onClick}
    >
      {props.icon}
      {props.text}
    </div>
  )
}
