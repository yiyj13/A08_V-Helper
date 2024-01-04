import { Skeleton } from '@nutui/nutui-react-taro'
import { ArrowDown } from '@nutui/icons-react-taro'
import { useReachBottom } from '@tarojs/taro'
import clsx from 'clsx'

import { Article, useVaccines, useArticles } from '../../api/'
import { ArticlePreview } from '../../components/articlepreview'
import { ActiveRefreshIcon } from '../../components/activerefresh'
import { NetworkError } from '../../components/errors'
import { EmptyView } from '../../components/empty'
import { useCommunityStore } from '../../models'

export default function Index() {
  return (
    <>
      <Header />
      <Community />
    </>
  )
}

// TODO: virtualList optimization
export function Community() {
  const { data, isLoading, size, setSize, error, PAGESIZE } = useArticles()

  const articles: Article[] = data ? [].concat(...data) : []

  const isEmpty = data?.[0]?.length === 0
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGESIZE)

  const loadMore = () => setSize(size + 1)
  const shouldLoadMore = !isLoading && !isReachingEnd

  useReachBottom(() => shouldLoadMore && loadMore())

  return (
    <main className='px-8 pb-32 mt-4'>
      <div className='flex flex-col'>
        {error ? <NetworkError /> : isEmpty ? <EmptyView text='来发布一篇帖子吧' /> : null}
        {articles?.map((article) => (
          <ArticlePreview key={article.ID} {...article} />
        ))}
        {isLoadingMore && !error && <Skeletons />}
      </div>
    </main>
  )
}

const Skeletons = () => (
  <div className='animate-delayed-show flex flex-col gap-16'>
    <Skeleton animated avatar rows={2}></Skeleton>
    <Skeleton animated avatar rows={4}></Skeleton>
    <Skeleton animated avatar rows={3}></Skeleton>
    <Skeleton animated avatar rows={1}></Skeleton>
  </div>
)

const Header = () => {
  const { data } = useVaccines()
  const filter = useCommunityStore.use.vaccineId()
  const expand = useCommunityStore.use.expandVaccineFilter()
  const toggleFilter = useCommunityStore.use.toggleFilter()
  const toggleExpand = useCommunityStore.use.toggleExpandFilter()

  const { mutate } = useArticles()

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
              <div className='flex items-center gap-x-4'>
                <a className='flex items-center space-x-2'>
                  <span className='text-2xl font-bold'>疫苗社区</span>
                </a>
                <ActiveRefreshIcon onClick={() => mutate(undefined)} />
              </div>
              <div className='flex items-center' onClick={toggleExpand}>
                <span className='pr-2 py-2 text-sm rounded-md'>
                  {filter ? '#' + data?.find((v) => v.ID === filter)?.name : '筛选'}
                </span>
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
          {data?.map((vaccine, index) => (
            <li
              key={index}
              className={clsx(
                'flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full',
                'transition-colors',
                {
                  'bg-slate-100 text-brand': filter === vaccine.ID,
                }
              )}
              onClick={() => toggleFilter(vaccine.ID)}
            >
              {'#' + vaccine.name}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
