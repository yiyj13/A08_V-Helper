import clsx from 'clsx'
import { Refresh2 as RefreshIcon } from '@nutui/icons-react-taro'
import { useState } from 'react'

type Props = {
  onClick: any
}

export const ActiveRefreshIcon = (props: Props) => {
  const { onClick } = props
  const [refreshing, setRefreshing] = useState(false)

  return (
    <div
      className={clsx(
        'w-min h-full flex-shrink flex items-center justify-center',
        refreshing && 'animate-spin'
      )}
      onClick={() => {
        if (refreshing) return
        setRefreshing(true)
        onClick()
        setTimeout(() => setRefreshing(false), 1000)
      }}
    >
      <RefreshIcon />
    </div>
  )
}
