import clsx from 'clsx'
import useSWRMutation from 'swr/mutation'
import { useTabStore, useUserStore } from '../../models'
import { Login } from '../../api/methods'

export default function Index() {
  const setUserInfo = useUserStore.use.setUserInfo()

  const { error, trigger, isMutating } = useSWRMutation('getToken', Login)

  const setTabIndex = useTabStore.use.setTabIndex()

  const handleLogin = () => trigger().then((res) => {
    setTabIndex(0)
    setUserInfo(res)
  })

  return (
    <>
      <Alert show={!!error}></Alert>
      <div className='grid place-items-center h-screen w-3/5 m-auto'>
        <div className='text-3xl font-bold'>V-Helper</div>
        <a
          className={clsx(
            'group inline-block rounded-full p-[2px]',
            'bg-gradient-to-r from-brand/80 via-teal-500 to-cyan-500',
            {
              'animate-pulse': isMutating,
            }
          )}
          onClick={handleLogin}
        >
          <span className='block rounded-full bg-white px-8 py-3 text-sm font-medium'>微信一键登录</span>
        </a>
      </div>
    </>
  )
}

function Alert({ show }) {
  return (
    <div className={clsx('fixed w-auto inset-0 max-w-5xl px-4 md:px-8', { hidden: !show })}>
      <div className='flex justify-between p-4 rounded-md bg-red-50 border border-red-300'>
        <div className='flex gap-3 sm:items-center'>
          <p className='text-red-600 sm:text-sm'>微信一键登录失败</p>
        </div>
      </div>
    </div>
  )
}
