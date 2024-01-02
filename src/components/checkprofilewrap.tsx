import Taro from '@tarojs/taro'
import { useProfiles } from '../api'

export function CheckProfileWrap(props: { children: React.ReactNode }) {
  const { data } = useProfiles()

  if (data?.length !== 0) {
    return <>{props.children}</>
  }

  return (
    <section className='flex h-screen w-auto flex-col items-center justify-center'>
      <text className='text-center text-2xl font-bold'>您还没有添加成员哦</text>
      <a
        className='rounded-xl p-2 text-sm text-brand transition-all active:scale-110 active:bg-slate-100'
        onClick={() => Taro.navigateTo({ url: '/pages/addMember/index' })}
      >
        点击此处添加
      </a>
    </section>
  )
}
