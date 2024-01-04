import { CellProps } from '@nutui/nutui-react-taro'
import { clsx } from 'clsx'

type Props = Partial<CellProps>

export function FormCell(props: Props) {
  const Empty = typeof props.description === 'string' && props.description.length === 0
  return (
    <div className='flex flex-col w-full bg-gray-100 rounded-2xl mt-2 px-4 py-2' onClick={props.onClick}>
      <text className='text-sm text-gray-500'>{props.title}</text>
      <text
        className={clsx('self-center text-base font-bold font-sans truncate', {
          'text-gray-500': Empty,
          'text-black': !Empty,
        })}
      >
        {!Empty ? props.description : '未填写'}
      </text>
      {props.children ? <div className='m-2'>{props.children}</div> : null}
    </div>
  )
}

export const HeaderNecessary = () => (
  <header className='flex flex-row items-center'>
    <text className='ml-2 text-lg font-semibold'>必填项目</text>
  </header>
)

export const HeaderOptional = () => (
  <header className='flex flex-row items-center'>
    <text className='ml-2 text-lg font-semibold'>选填项目</text>
  </header>
)
