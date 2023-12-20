import { Skeleton } from '@nutui/nutui-react-taro'
import { ArrowDown } from '@nutui/icons-react-taro'
import clsx from 'clsx'
import { useState } from 'react'

import { ArticlePreview } from './ArticlePreview'
import { useUserFollowing, useVaccines } from '../../../api/'
import { NetworkError } from '../../../components/errors'
import { EmptyView } from '../../../components/empty'

export default function FollowingPosts() {
  const { data, isLoading, error } = useUserFollowing()
  const articles = data?.followingArticles
  const vaccines = articles?.reduce((acc, article) => {
    if (!acc.some((id) => id === article.vaccineId)) {
      acc.push(article.vaccineId)
    }
    return acc
  }, [] as number[])

  const [filter, setFilter] = useState<number | undefined>(undefined)
  const articlesRender = articles?.filter((article) => !filter || article.vaccineId === filter)
  const isEmpty = articlesRender?.length === 0

  return (
    <>
      <Header vaccineIds={vaccines} filter={filter} setFilter={setFilter} />
      <main className='pb-32 mt-4 px-4'>
        <div className='flex flex-col'>
          {error && <NetworkError></NetworkError>}
          {isEmpty && <EmptyView text='去社区看一看大家的讨论吧'></EmptyView>}
          {articlesRender?.map((article, index) => (
            <ArticlePreview key={index} {...article} />
          ))}
          {isLoading && !error && <Skeletons />}
        </div>
      </main>
    </>
  )
}

const Skeletons = () => (
  <div className='flex flex-col gap-16'>
    <Skeleton animated avatar rows={2}></Skeleton>
    <Skeleton animated avatar rows={4}></Skeleton>
    <Skeleton animated avatar rows={3}></Skeleton>
    <Skeleton animated avatar rows={1}></Skeleton>
  </div>
)

const Header = ({ vaccineIds, filter, setFilter }: { vaccineIds?: number[]; filter?: number; setFilter: any }) => {
  const { id2name } = useVaccines()
  const [expand, setExpand] = useState(false)
  const toggleFilter = (id: number | undefined) => {
    if (id === filter) {
      setFilter(undefined)
    } else {
      setFilter(id)
    }
  }
  const toggleExpand = () => setExpand(!expand)

  return (
    <header
      className={clsx('transition-all', {
        'h-20': !expand,
        'h-32': expand,
      })}
    >
      <nav id='foo' className={clsx('fixed z-20 w-full bg-white md:relative md:bg-transparent', {})}>
        <div className='m-auto px-6 md:px-12'>
          <div className='flex flex-wrap items-center justify-between gap-6 py-3'>
            <div className='flex w-full justify-between'>
              <a className='flex items-center space-x-2'>
                <span className='text-2xl font-bold'>帖子收藏</span>
              </a>
              <div className='flex items-center' onClick={toggleExpand}>
                <span className='pr-2 py-2 text-sm rounded-md'>筛选</span>
                <ArrowDown
                  size={10}
                  className={clsx('transition-all transform', {
                    'rotate-180': expand,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        <ul
          className={clsx('flex items-center px-4 gap-4 overflow-x-scroll whitespace-nowrap transition-all', {
            'h-0 scale-y-0': !expand,
            'h-12': expand,
          })}
        >
          {vaccineIds?.map((id, index) => {
            const name = id2name(id)
            if (name === undefined) return null
            return (
              <li
                key={index}
                className={clsx(
                  'flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full',
                  'transition-colors',
                  {
                    'bg-slate-100 text-brand': filter === id,
                  }
                )}
                onClick={() => toggleFilter(id)}
              >
                {'#' + name}
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
