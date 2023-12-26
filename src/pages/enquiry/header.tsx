import { ArrowDown } from '@nutui/icons-react-taro'
import clsx from 'clsx'

import { useProfiles } from '../../api/'
import { useEnquiryStore } from '../../models'

export const Header = () => {
  const { data } = useProfiles()
  const filter = useEnquiryStore.use.filter()
  const expand = useEnquiryStore.use.expandProfileFilter()
  const toggleFilter = useEnquiryStore.use.toggleProfileFilter()
  const toggleExpand = useEnquiryStore.use.toggleExpandFilter()

  return (
    <header
      className={clsx('transition-all', {
        'h-16': !expand,
        'h-28': expand,
      })}
    >
      <nav id='foo' className='fixed z-20 w-full backdrop-blur-md bg-gradient-to-b from-white to-white/80'>
        <div className='m-auto px-6'>
          <div className='flex flex-wrap items-center justify-between gap-6 py-3'>
            <div className='flex w-full justify-between'>
              <a className='flex items-center space-x-2'>
                <span className='text-2xl font-bold'>疫苗查询</span>
              </a>
              <div className='flex items-center' onClick={toggleExpand}>
                <span className='pr-2 py-2 text-sm rounded-md'>查询方法</span>
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
          <li
            className={clsx(
              'flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full',
              'transition-colors',
              {
                'bg-slate-100 text-brand': filter === 'following',
              }
            )}
            onClick={() => toggleFilter('following')}
          >
            收藏
          </li>

          {data?.map((member, index) => {
            return (
              <li
                key={index}
                className={clsx(
                  'flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full',
                  'transition-colors',
                  {
                    'bg-slate-100 text-brand': filter === member.ID,
                  }
                )}
                onClick={() => toggleFilter(member.ID)}
              >
                {member.fullName}的疫苗
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
