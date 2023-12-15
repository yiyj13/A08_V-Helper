import { useState } from 'react'
import { Skeleton } from '@nutui/nutui-react-taro'
import { ArrowDown } from '@nutui/icons-react-taro'
import useSWRInfinite from 'swr/infinite'
import { useReachBottom } from '@tarojs/taro'
import clsx from 'clsx'

import { ArticlePreview } from './ArticlePreview'
import api, { Article, useVaccines } from '../../api/'
import { PullDownRefresh } from '../../components/pulldownrefresh'
import { NetworkError } from '../../components/errors'

const PAGESIZE = 5

// TODO: virtualList optimization
export default function Community() {
  const { data, isLoading, size, setSize, error } = useSWRInfinite(
    (index) => `/api/articles?page=${index + 1}&size=${PAGESIZE}`,
    (url) => api.get(url).then((res) => res.data)
  )

  const articles: Article[] = data ? [].concat(...data) : []

  const isEmpty = data?.[0]?.length === 0
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGESIZE)

  const loadMore = () => setSize(size + 1)
  const shouldLoadMore = !isLoading && !isReachingEnd

  useReachBottom(() => shouldLoadMore && loadMore())

  return (
    <div>
      <Header />
      <PullDownRefresh onRefresh={() => setSize(1)}>
        <main className='px-8 pb-32 mt-4'>
          <div className='flex flex-col gap-6'>
            {error && <NetworkError></NetworkError>}
            {articles?.map((article, index) => (
              <ArticlePreview key={index} {...article} />
            ))}
            {isLoadingMore && !error && <Skeletons />}
          </div>
        </main>
      </PullDownRefresh>
    </div>
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

const Header = () => {
  const { data } = useVaccines()
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [filter, setFilter] = useState<number | undefined>(undefined)

  return (
    <header
      className={clsx('transition-all', {
        'h-20': !showFilter,
        'h-32': showFilter,
      })}
    >
      <nav
        id='foo'
        className={clsx('fixed z-20 w-full bg-white shadow-md shadow-gray-600/5 md:relative md:bg-transparent', {})}
      >
        <div className='m-auto px-6 md:px-12'>
          <div className='flex flex-wrap items-center justify-between gap-6 py-3'>
            <div className='flex w-full justify-between'>
              <a className='flex items-center space-x-2'>
                <span className='text-2xl font-bold'>疫苗社区</span>
              </a>
              <div className='flex items-center' onClick={() => setShowFilter((s) => !s)}>
                <span className='pr-2 py-2 text-sm rounded-md'>筛选</span>
                <ArrowDown
                  size={10}
                  className={clsx('transition-all transform', {
                    'rotate-180': showFilter,
                  })}
                />
              </div>
            </div>
          </div>
        </div>
        <ul
          className={clsx('flex items-center px-4 gap-4 overflow-x-scroll whitespace-nowrap transition-all', {
            'h-0 scale-y-0': !showFilter,
            'h-12': showFilter,
          })}
        >
          {data?.map((vaccine, index) => (
            <li
              key={index}
              className={clsx('flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full', {
                'bg-slate-100 text-brand': filter === vaccine.ID,
              })}
              onClick={() => setFilter((f) => (f === vaccine.ID ? undefined : vaccine.ID))}
            >
              {vaccine.name}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
