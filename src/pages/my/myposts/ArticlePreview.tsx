import Taro from '@tarojs/taro'
import { Button, Swipe } from '@nutui/nutui-react-taro'
import { SwipeInstance } from '@nutui/nutui-react-taro/dist/types/packages/swipe/swipe.taro'
import clsx from 'clsx'
import { memo, useRef } from 'react'
import useSWR from 'swr'

import { getCreateTime, dayjs } from '../../../utils'
import { Article, deleteArticle, getMyArticles, getReplys } from '../../../api'
import { useVaccines } from '../../../api/hooks'

export const ArticlePreview = memo((props: Article) => {
  const { id2name } = useVaccines()

  const { mutate } = useSWR('getMyArticles', getMyArticles)

  const handleClick = () => Taro.navigateTo({ url: '/pages/community/articlepage/index?id=' + props.ID })

  const handleRemove = async () => {
    await deleteArticle(props.ID)
    mutate()
  }
  const closeRef = useRef<SwipeInstance>(null)

  return (
    <Swipe
      ref={closeRef}
      className='rounded-lg shadow-md mb-4'
      rightAction={
        <Button type='danger' shape='square'>
          删除
        </Button>
      }
      onActionClick={() => {
        if (closeRef.current) {
          closeRef.current.close()
          handleRemove()
        }
      }}
    >
      <a
        className={clsx('relative block overflow-hidden p-4 sm:p-6 lg:p-8', 'transition-all active:shadow-2xl')}
        onClick={handleClick}
      >
        <>
          <span className='via-teal absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand to-green-200'></span>

          <div className='flex justify-between'>
            <dl className='flex items-center gap-2'>
              <img
                alt='Paul Clapton'
                src='https://avatars.githubusercontent.com/u/69092274?v=4'
                className='h-8 w-8 rounded-full object-cover shadow-sm'
              />

              <div className='flex flex-col'>
                <dt className='text-sm font-medium text-gray-600'>{props.userName || 'PlaceHolder'}</dt>
                <dd className='text-xs text-gray-500'>{props.CreatedAt && getCreateTime(props.CreatedAt)}</dd>
              </div>
            </dl>
          </div>

          <h3 className='mt-2 text-sm font-semibold text-gray-900'>{props.title}</h3>

          <div className='mt-4 flex items-center justify-end'>
            <label className='text-xs font-medium text-brand'>
              {props.isBind ? '#' + id2name(props.vaccineId) : null}
            </label>
          </div>

          <LatestReply articleId={props.ID} />
        </>
      </a>
    </Swipe>
  )
})

const LatestReply = ({ articleId }) => {
  const { data: replies } = useSWR(articleId ? [articleId, 'getReplys'] : null, ([id]) => getReplys(id))

  const latestReply = replies?.sort((a, b) => dayjs(b.CreatedAt).unix() - dayjs(a.CreatedAt).unix())[0]

  if (!latestReply) return <div className='text-gray-500 text-sm mt-2'>暂无回复</div>

  return (
    <div className='bg-white shadow-md rounded-lg mt-2 p-4'>
      <div className='font-semibold text-brand mb-2'>最近回复</div>
      <div className='border-b border-gray-300 mb-2'></div>
      <div className='text-gray-700'>
        <div className='font-medium text-sm'>{latestReply.userName}</div>
        <div className='text-sm text-gray-500 mb-2'>{dayjs(latestReply.CreatedAt).format('MMMM D, YYYY')}</div>
        <p className='text-sm'>{latestReply.content}</p>
      </div>
    </div>
  )
}
