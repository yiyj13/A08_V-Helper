import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
import { Button, Swipe } from '@nutui/nutui-react-taro'
import { ButtonType } from '@nutui/nutui-react-taro/dist/types/packages/button/button.taro'
import { SwipeInstance } from '@nutui/nutui-react-taro/dist/types/packages/swipe/swipe.taro'
import { memo, useRef } from 'react'
import useSWR from 'swr'

import { getCreateTime, dayjs } from '../utils'
import { Article, getReplys } from '../api'
import { useUserPublic, useVaccines } from '../api/hooks'

type ArticlePreviewProps = Article & {
  swipeAction?: (ID: number) => Promise<any>
  showReply?: boolean
  type?: ButtonType
  buttonText?: string
}

export const ArticlePreview = memo((props: ArticlePreviewProps) => {
  const { id2name } = useVaccines()
  const handleClick = () => Taro.navigateTo({ url: '/pages/community/articlepage/index?id=' + props.ID })
  const closeRef = useRef<SwipeInstance>(null)
  const { data: author } = useUserPublic(Number(props.userId))

  return (
    <Swipe
      ref={closeRef}
      disabled={props.swipeAction === undefined}
      className='rounded-lg border border-gray-100 border-b-0 shadow-md mb-4 transition-all active:shadow-xl active:scale-105'
      rightAction={
        <Button type={props.type} shape='square'>
          {props.buttonText}
        </Button>
      }
      onActionClick={() => {
        if (closeRef.current && props.swipeAction) {
          closeRef.current.close()
          props.swipeAction(props.ID)
        }
      }}
    >
      <a className='relative block overflow-hidden p-4 sm:p-6 lg:p-8' onClick={handleClick}>
        <span className='via-teal absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand to-green-200'></span>

        <div className='flex justify-between'>
          <dl className='flex items-center gap-2'>
            <Image
              src={author?.avatar ?? ''}
              className='h-8 w-8 rounded-full object-cover bg-slate-100 shadow-sm'
              mode='aspectFill'
            />

            <div className='flex flex-col'>
              <dt className='text-sm font-medium text-gray-600'>{author?.userName || '匿名用户'}</dt>
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

        {props.showReply && <LatestReply articleId={props.ID} />}
      </a>
    </Swipe>
  )
})

const LatestReply = ({ articleId }) => {
  const { data: replies } = useSWR(articleId ? [articleId, 'getReplys'] : null, ([id]) => getReplys(id))

  const latestReply = replies?.sort((a, b) => dayjs(b.CreatedAt).unix() - dayjs(a.CreatedAt).unix())[0]

  if (!latestReply) return <div className='text-gray-500 text-sm mt-2'>暂无回复</div>

  return (
    <div className='bg-white shadow-md border border-gray-100 rounded-lg mt-2 p-4'>
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
