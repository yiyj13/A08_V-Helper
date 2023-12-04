export function NetworkError({ refresh }: { refresh?: () => void; }) {
  return (
    <section className='flex h-full w-auto flex-col items-center justify-center'>
      <text className='text-center text-2xl font-bold'>加载失败</text>
      {refresh ? (
        <a
          className='rounded-xl p-2 text-sm text-brand transition-all active:scale-110 active:bg-slate-100'
          onClick={refresh}
        >
          点击重试
        </a>
      ) : (
        <a className='text-sm text-gray-500' onClick={refresh}>
          请检查网络
        </a>
      )}
    </section>
  );
}

