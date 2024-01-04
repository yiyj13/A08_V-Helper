import { Follow, HeartFill1 } from '@nutui/icons-react-taro'
import clsx from 'clsx'

import { followVaccine, unfollowVaccine } from '../../api/methods'
import { useUserFollowing, useVaccines } from '../../api/hooks'

export default function Header(props: { activeId: number; vaccine_id: number; setActiveId: (id: number) => any }) {
  const titles = ['疫苗介绍', '注意事项', '目标病症', '大家讨论']
  const { id2name } = useVaccines()

  return (
    <header className='h-28 shadow-sm'>
      <nav id='foo' className='fixed z-20 w-full backdrop-blur-md bg-gradient-to-b from-white to-white/80'>
        <div className='m-auto px-6 md:px-12'>
          <div className='flex flex-wrap items-center justify-between gap-6 py-3'>
            <div className='flex w-full items-center justify-between'>
              <a className='flex items-center space-x-2'>
                <span className='text-2xl font-bold'>{id2name(props.vaccine_id)}</span>
              </a>
              <FollowButton vaccine_id={props.vaccine_id} />
            </div>
          </div>
        </div>
        <ul className='flex items-center px-4 gap-4 overflow-x-scroll whitespace-nowrap transition-all h-12'>
          {titles?.map((title, index) => (
            <li
              key={index}
              className={clsx(
                'flex items-center justify-center px-2 py-2 text-sm font-medium rounded-full',
                'transition-colors',
                {
                  'bg-slate-100 text-brand': props.activeId === index,
                }
              )}
              onClick={() => props.setActiveId(index)}
            >
              {title}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

const FollowButton = (props: { vaccine_id: number }) => {
  const { checkVaccineFollowed: isVaccineFollowed, mutate } = useUserFollowing()
  const handleFollowClick = async () => {
    await followVaccine(props.vaccine_id)
    mutate()
  }
  const handleUnfollowClick = async () => {
    await unfollowVaccine(props.vaccine_id)
    mutate()
  }
  const following = isVaccineFollowed(props.vaccine_id)
  return following ? (
    <HeartFill1 className='text-brand' size={16} onClick={handleUnfollowClick}></HeartFill1>
  ) : (
    <Follow className='text-brand' size={16} onClick={handleFollowClick}></Follow>
  )
}
