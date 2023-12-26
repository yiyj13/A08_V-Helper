import Taro from '@tarojs/taro'
import clsx from 'clsx'
import React from 'react'

import { initialVaccineState, useUserFollowing, useVaccineRecordList, Vaccine } from '../../api'

import { useEnquiryStore } from '../../models'

type Props = Partial<Vaccine>

const VaccineItem: React.FC<Props> = (props) => {
  const { checkVaccineFollowed: isVaccineFollowed } = useUserFollowing()
  const isCollected = isVaccineFollowed(props.ID)
  const filter = useEnquiryStore.use.filter()
  const { getVaccineState } = useVaccineRecordList()
  const state = typeof filter === 'number' ? getVaccineState(filter, props.ID) : initialVaccineState

  const handleItemClick = () => {
    Taro.navigateTo({ url: '/pages/vacDetails/index?id=' + props.ID })
  }

  if (filter === 'following' && !isCollected) {
    return null
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden flex h-16 items-center p-2 rounded-md bg-gray-100',
        'active: scale-105 active:shadow-lg transition-all'
      )}
      onClick={handleItemClick}
    >
      <span
        className={clsx('absolute inset-x-0 bottom-0 h-1', {
          'bg-gradient-to-r from-brand to-green-200': state.inEffect,
          'bg-gradient-to-r from-brand to-red-200': state.inoculated && !state.inEffect,
          'bg-gradient-to-r from-brand to-gray-200': state.planning,
        })}
      ></span>

      <div>
        <div className='flex items-center'>
          <h2
            className={clsx('text-sm font-semibold truncate transition-colors', {
              'text-brand': isCollected && typeof filter !== 'number',
            })}
          >
            {props.name}
          </h2>
          <div className='absolute right-0 w-1/3 h-14 bg-gradient-to-r from-transparent to-gray-100'></div>
        </div>
        <div
          className={clsx('absolute text-[10px] right-1 bottom-2 px-1.5 py-0.5 rounded-full', {
            'bg-slate-200 text-brand': state.inEffect,
            'bg-red-100 text-red-400': state.inoculated && !state.inEffect,
            'bg-gray-200 text-gray-500': state.planning,
          })}
        >
          {state.inEffect ? '生效' : state.inoculated && !state.inEffect ? '过期' : state.planning ? '计划' : ''}
        </div>
      </div>
    </div>
  )
}

export default VaccineItem
