import { useTabStore, useUserStore } from '../models'

import HomePage from '../pages/home'
import EnquiryPage from '../pages/enquiry'
import DatePage from '../pages/date'
import ProfilePage from '../pages/my'
import CustomTabBar from '../tabbar'

import LoginPage from '../pages/login'

export default function Index() {
  const isLogged = useUserStore.use.isLogged()
  const tabIndex = useTabStore((state) => state.tabIndex)
  const setTabIndex = useTabStore((state) => state.setTabIndex)

  if (!isLogged) {
    setTabIndex(0)
    return <LoginPage />
  }

  return (
    <div>
      {[HomePage, EnquiryPage, DatePage, ProfilePage].map((Content, index) =>
        (tabIndex <= 2 && tabIndex === index) || (tabIndex >= 3 && tabIndex === index + 1) ? (
          <Content key={index} />
        ) : null
      )}
      <CustomTabBar />
    </div>
  )
}
