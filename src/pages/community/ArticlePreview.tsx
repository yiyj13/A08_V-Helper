import Taro from '@tarojs/taro'
import clsx from 'clsx'
import { memo } from 'react'
import { Follow, Comment } from '@nutui/icons-react-taro'
import { useVaccines, Article } from '../../api/'
import { getCreateTime } from '../../utils'

export type ArticlePreviewProps = Partial<Article>

{/* TODO: abbreviate the content */}
export const ArticlePreview = memo((props: ArticlePreviewProps) => {
  const { id2name } = useVaccines()

  const handleClick = () => Taro.navigateTo({ url: '/pages/community/articlepage/index?id=' + props.ID })

  return (
    <a
      className={clsx(
        'relative block overflow-hidden rounded-lg border border-gray-100 p-4 shadow-md sm:p-6 lg:p-8',
        'transition-all active:scale-105 active:shadow-2xl'
      )}
      onClick={handleClick}
    >
      <>
        <span className='via-teal absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-brand to-green-200'></span>

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

          <div className='flex items-center justify-center space-x-1'>
            <div className='h-1 w-1 rounded-full bg-black'></div>
            <div className='h-1 w-1 rounded-full bg-black'></div>
            <div className='h-1 w-1 rounded-full bg-black'></div>
          </div>
        </div>

        <h3 className='mt-2 text-sm font-semibold text-gray-900'>{props.title}</h3>

        <div className='mt-2 flex'>
          <p className='max-w-[40ch] text-xs text-gray-500'>{props.content}</p>
        </div>

        <div className='mt-4 flex items-center justify-between'>
          <dl className='flex gap-4'>
            <div className='flex items-center gap-1'>
              <Follow size={8}></Follow>
              <dd className='text-xs text-gray-500'>114</dd>
            </div>
            <div className='flex items-center gap-1'>
              <Comment size={8}></Comment>
              <dd className='text-xs text-gray-500'>514</dd>
            </div>
          </dl>

          <label className='text-xs font-medium text-brand'>{id2name(props.vaccineId)}</label>
        </div>
      </>
    </a>
  )
})
