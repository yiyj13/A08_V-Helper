import Taro, { useRouter } from '@tarojs/taro'
import clsx from 'clsx'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { useState } from 'react'
import { Image } from '@tarojs/components'
import { Comment, Follow, HeartFill1 } from '@nutui/icons-react-taro'
import { Button, Skeleton } from '@nutui/nutui-react-taro'

import { FocusableTextArea } from '../../../components/focusabletextarea'

import {
  getArticleByID,
  getReplys,
  postReply,
  Reply,
  followArticle,
  unfollowArticle,
  deleteReply,
  deleteArticle,
} from '../../../api'
import { useVaccines, useUserFollowing, useUserPublic, useArticles } from '../../../api/hooks'
import { getCreateTime } from '../../../utils'
import { getUserID } from '../../../models'

export default function Index() {
  const router = useRouter()
  const articleID = parseInt(router.params.id || '0')

  const { data: article } = useSWR([articleID, 'getArticleByID'], ([id]) => getArticleByID(id), {
    revalidateIfStale: false,
  })

  const {
    data: replies,
    isLoading,
    mutate,
  } = useSWR(article ? [articleID, 'getReplys'] : null, ([id]) => getReplys(id))

  const hasReplies = replies && replies?.length > 0

  const { id2name } = useVaccines()

  const { data: author } = useUserPublic(Number(article?.userId))

  const editable = article?.userId === getUserID()

  const { mutate: mutateCommunity } = useArticles()

  const handleDeleteArticle = async () => {
    await deleteArticle(articleID)
    mutateCommunity()
    Taro.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1000,
    })
    setTimeout(() => Taro.navigateBack(), 1000)
  }

  if (isLoading || !article) return <Skeletons />

  return (
    <div className='pb-20'>
      <header className='flex justify-between items-center px-8 py-4 bg-white shadow-sm'>
        <div className='flex items-center gap-4'>
          <Image className='w-12 h-12 rounded-full bg-slate-100' src={author?.avatar ?? ''} mode='aspectFill' />
          <div>
            <div className='text-xl font-bold'>{author?.userName || 'Username'}</div>
            <div className='text-sm text-gray-500'>{article && getCreateTime(article.CreatedAt)}</div>
          </div>
        </div>
        {editable && (
          <Button fill='none' size='small' type='danger' onClick={handleDeleteArticle}>
            删除帖子
          </Button>
        )}
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
          {/* <div className='flex items-center gap-1'> */}
          {/* <Follow size={8}></Follow> */}
          {/* <dd className='text-sm text-gray-500'>0</dd> */}
          {/* </div> */}

          <div className='flex items-center gap-1'>
            <Comment size={8}></Comment>
            <dd className='text-sm text-gray-500'>{replies?.length}</dd>
          </div>
        </div>

        <FollowButton article_id={article.ID} />
      </section>

      <div className='flex flex-col'>
        {hasReplies ? (
          replies.map((comment, index) => <CommentBlock key={index} index={index} mutate={mutate} {...comment} />)
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

const CommentBlock = (props: Partial<Reply> & { index: number; mutate: any }) => {
  const { data: author } = useUserPublic(Number(props.userId))
  const editable = props.userId === Number(getUserID())
  const handleDeleteClick = async () => {
    if (!editable) return
    await deleteReply(Number(props.ID))
    props.mutate()
  }

  return (
    <section className='mt-2 px-8 py-4 bg-white shadow-sm'>
      <div className='flex justify-between items-start'>
        <div className='flex items-center gap-4'>
          <Image className='w-12 h-12 rounded-full bg-slate-100' src={author?.avatar ?? ''} mode='aspectFill' />
          <div className='flex flex-col'>
            <div className='text-sm font-bold'>{author?.userName ?? ''}</div>
            <div className='text-sm text-gray-500'>{getCreateTime(props.UpdatedAt)}</div>
          </div>
        </div>

        {/* show which floor */}
        <div className='flex items-center gap-4'>
          {editable && (
            <a className='text-sm text-brand underline' onClick={handleDeleteClick}>
              删除
            </a>
          )}
          <div className='text-sm text-brand'>#{props.index + 1}</div>
        </div>
      </div>
      <div className='mt-4 text-sm text-gray-500'>{props.content || 'placeholder'}</div>
    </section>
  )
}

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

const FollowButton = (props: { article_id: number }) => {
  const { checkArticleFollowed: isArticleFollowed, mutate } = useUserFollowing()
  const handleFollowClick = async () => {
    await followArticle(props.article_id)
    mutate()
  }
  const handleUnfollowClick = async () => {
    await unfollowArticle(props.article_id)
    mutate()
  }
  const following = isArticleFollowed(props.article_id)
  return following ? (
    <HeartFill1 className='text-brand' size={16} onClick={handleUnfollowClick}></HeartFill1>
  ) : (
    <Follow className='text-brand' size={16} onClick={handleFollowClick}></Follow>
  )
}
