import clsx from 'clsx'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { useState } from 'react'
import { useRouter } from '@tarojs/taro'
import { Follow, Comment } from '@nutui/icons-react-taro'
import { Button, Skeleton } from '@nutui/nutui-react-taro'

import { FocusableTextArea } from '../../../components/focusabletextarea'

import { getArticleByID, getReplys, useVaccines, postReply, Reply } from '../../../api'
import { getCreateTime } from '../../../utils'

export default function Index() {
  const router = useRouter()
  const articleID = parseInt(router.params.id || '0')

  const { data: article } = useSWR([articleID, 'getArticleByID'], ([id]) => getArticleByID(id))

  const {
    data: replies,
    isLoading,
    mutate,
  } = useSWR(article ? [articleID, 'getReplys'] : null, ([id]) => getReplys(id))

  const hasReplies = replies && replies?.length > 0

  const { id2name } = useVaccines()

  if (isLoading || !article) return <Skeletons />

  return (
    <div className='pb-20'>
      <header className='flex justify-between items-center px-8 py-4 bg-white shadow-sm'>
        <div className='flex items-center gap-4'>
          <img className='w-12 h-12 rounded-full' src='https://avatars.githubusercontent.com/u/69092274?v=4' />
          <div>
            <div className='text-xl font-bold'>{article?.userName || 'Username'}</div>
            <div className='text-sm text-gray-500'>{article && getCreateTime(article.CreatedAt)}</div>
          </div>
        </div>
      </header>

      <section className='px-8 py-4 bg-white shadow-sm'>
        <label className='bg-slate-100 text-brand text-base'>
          {article?.isBind ? '#' + id2name(article?.vaccineId) : ''}
        </label>
        <h1 className='text-2xl font-bold'>{article?.title || 'Title'}</h1>
        <div className='mt-4 text-sm text-gray-500'>{article?.content || 'Content'}</div>
      </section>

      <section className='px-8 py-4 bg-white shadow-sm flex justify-between'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Follow size={8}></Follow>
            {/* TODO: follow number */}
            <dd className='text-sm text-gray-500'>0</dd>
          </div>

          <div className='flex items-center gap-1'>
            <Comment size={8}></Comment>
            <dd className='text-sm text-gray-500'>{replies?.length}</dd>
          </div>
        </div>

        <Follow className='text-brand' size={16}></Follow>
      </section>

      <div className='flex flex-col-reverse'>
        {hasReplies ? (
          replies.map((comment, index) => <CommentBlock key={index} index={index} {...comment} />)
        ) : (
          <div className='flex justify-center items-center h-20 text-gray-500'>暂无回复</div>
        )}
      </div>

      <BottomBar article_id={article?.ID} onSubmit={mutate} />
    </div>
  )
}

const Skeletons = () => (
  <div className='flex flex-col gap-y-12 p-4 px-8 h-screen overflow-hidden'>
    <Skeleton animated avatar rows={2}></Skeleton>
    <Skeleton animated className='scale-y-150' rows={2}></Skeleton>
    <Skeleton animated className='mt-20' rows={3}></Skeleton>
    <Skeleton animated rows={5}></Skeleton>
  </div>
)

const CommentBlock = (props: Partial<Reply> & { index: number }) => (
  <section className='mt-2 px-8 py-4 bg-white shadow-sm'>
    <div className='flex justify-between items-start'>
      <div className='flex items-center gap-4'>
        <img className='w-12 h-12 rounded-full' src='https://avatars.githubusercontent.com/u/69092274?v=4' />
        <div className='flex flex-col'>
          <div className='text-sm font-bold'>{props.userName || 'Username'}</div>
          <div className='text-sm text-gray-500'>{getCreateTime(props.UpdatedAt)}</div>
        </div>
      </div>

      {/* show which floor */}
      <div className='text-sm text-brand'>#{props.index + 1}</div>
    </div>
    <div className='mt-4 text-sm text-gray-500'>{props.content || 'placeholder'}</div>
  </section>
)

const BottomBar = (props: { article_id: number; onSubmit: any }) => {
  const [replyContent, setContent] = useState('')
  const { trigger, isMutating } = useSWRMutation([props.article_id, replyContent, 'postReply'], ([id, content]) =>
    postReply(id, content)
  )
  return (
    <div
      className={clsx('fixed bottom-0 w-full shadow-sm', 'backdrop-blur-md bg-gradient-to-b from-white to-white/30')}
    >
      <div className='flex items-start justify-between gap-x-4 px-4 pb-8 pt-4'>
        <FocusableTextArea
          baseClass='flex-grow bg-gray-100 px-2 py-1 rounded-2xl'
          focusClass='ring-2 ring-brand h-20 transition-all'
          placeholder='发表你的看法...'
          autoHeight
          value={replyContent}
          onInput={(e) => setContent(e.detail.value)}
        />
        <Button
          type='primary'
          size='small'
          disabled={isMutating}
          onClick={() =>
            trigger().then(() => {
              setContent('')
              props.onSubmit()
            })
          }
        >
          发送
        </Button>
      </div>
    </div>
  )
}
