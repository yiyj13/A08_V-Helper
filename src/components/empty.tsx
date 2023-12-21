export function EmptyView({
  refresh: onclick,
  text = '这里暂时什么都没有',
}: {
  refresh?: () => void
  text?: string
}) {
  return (
    <section className='flex h-full w-auto flex-col items-center justify-center'>
      <text className='text-center text-2xl font-bold'>空空如也~</text>
      {onclick ? (
        <a
          className='rounded-xl p-2 text-sm text-brand transition-all active:scale-110 active:bg-slate-100'
          onClick={onclick}
        >
          点击刷新
        </a>
      ) : (
        <a className='text-sm text-gray-500' onClick={onclick}>
          {text}
        </a>
      )}
    </section>
  )
}
