import { useState, PropsWithChildren } from 'react'
import { useTabStore, useUserStore } from '../models'

import HomePage from '../pages/home'
import MapPage from '../pages/map'
import DatePage from '../pages/date'
import ProfilePage from '../pages/my'
import CustomTabBar from '../tabbar'

import LoginPage from '../pages/login'

export default function Index() {
  const isLogged = useUserStore.use.isLogged()

  if (!isLogged) return <LoginPage />

  return (
    <div>
      {[HomePage, MapPage, DatePage, ProfilePage].map((Content, index) => (
        <LazyLoadTab tabIndex={index > 1 ? index + 1 : index} key={index}>
          <Content />
        </LazyLoadTab>
      ))}
      <CustomTabBar />
    </div>
  )
}

function LazyLoadTab(props: PropsWithChildren<{ tabIndex: number }>) {
  const tabIndex = useTabStore((state) => state.tabIndex)
  const [loaded, setLoaded] = useState(false)

  if (props.tabIndex != tabIndex && !loaded) {
    return null
  } else if (!loaded) {
    setLoaded(true)
  }

  return <div style={{ display: tabIndex === props.tabIndex ? 'block' : 'none' }}>{props.children}</div>
}
