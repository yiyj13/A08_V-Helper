import Taro from '@tarojs/taro'
import { Button, Swipe } from '@nutui/nutui-react-taro'
import { SwipeInstance } from '@nutui/nutui-react-taro/dist/types/packages/swipe/swipe.taro'
import clsx from 'clsx'
import { memo, useRef } from 'react'
import { getCreateTime } from '../../../utils'
import { Article, unfollowArticle } from '../../../api'
import { useVaccines, useUserFollowing, useUserPublic } from '../../../api/hooks'

export const ArticlePreview = memo((props: Article) => {
  const { id2name } = useVaccines()

  const { mutate } = useUserFollowing()

  const handleClick = () => Taro.navigateTo({ url: '/pages/community/articlepage/index?id=' + props.ID })

  const handleRemove = async () => {
    await unfollowArticle(props.ID)
    mutate()
  }
  const closeRef = useRef<SwipeInstance>(null)

  const {data: author} = useUserPublic(Number(props.userId))

  return (
    <Swipe
      ref={closeRef}
      className='rounded-lg shadow-md mb-4'
      rightAction={
        <Button type='primary' shape='square'>
          移除
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
        className={clsx(
          'relative block overflow-hidden p-4 sm:p-6 lg:p-8',
          'transition-all active:shadow-2xl'
        )}
        onClick={handleClick}
      >
        <>
          <span className='via-teal absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-brand to-green-200'></span>

          <div className='flex justify-between'>
            <dl className='flex items-center gap-2'>
              <img
                alt='Paul Clapton'
                src={author?.avatar}
                className='h-8 w-8 rounded-full object-cover bg-slate-100 shadow-sm'
              />

              <div className='flex flex-col'>
                <dt className='text-sm font-medium text-gray-600'>{author?.userName || '匿名用户'}</dt>
                <dd className='text-xs text-gray-500'>{props.CreatedAt && getCreateTime(props.CreatedAt)}</dd>
              </div>
            </dl>
          </div>

          <h3 className='mt-2 text-sm font-semibold text-gray-900'>{props.title}</h3>

          <div className='mt-2 flex'>
            <p className='max-w-[40ch] text-xs text-gray-500'>{props.content}</p>
          </div>

          <div className='mt-4 flex items-center justify-end'>
            <label className='text-xs font-medium text-brand'>
              {props.isBind ? '#' + id2name(props.vaccineId) : null}
            </label>
          </div>
        </>
      </a>
    </Swipe>
  )
})
