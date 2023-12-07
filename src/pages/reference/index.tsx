import { useState } from 'react'
import clsx from 'clsx'
import data1 from './data1.json'
import data2 from './data2.json'

type ChildVaccine = {
  age: string
  vaccine: string
  dose: string
}

export default function App() {
  const [tabValue, setTabValue] = useState<number>(0)
  const dataClassOne = data1 as ChildVaccine[]
  const dataClassTwo = data2 as ChildVaccine[]

  return (
    <>
      <div className='px-2 mt-32 pb-10'>
        {(tabValue === 0 ? dataClassOne : dataClassTwo).map((item, index) => {
          return <ChildrenVaccineItem item={item} key={index} />
        })}
      </div>
      <div className={clsx('fixed top-0 h-30 w-full backdrop-blur-md z-10', 'bg-gradient-to-b from-white to-white/70')}>
        <header className='flex justify-between items-center px-4 h-14'>
          <h1 className='text-xl font-semibold'>儿童疫苗接种参考</h1>
        </header>
        <Tab titles={['一类疫苗', '二类疫苗']} value={tabValue} setValue={setTabValue} />
      </div>
    </>
  )
}

function ChildrenVaccineItem({ item }: { item: ChildVaccine }) {
  return (
    <>
      <div className='ps-2 my-2 first:mt-0'>
        <h3 className='text-xs font-medium uppercase text-gray-500'>{item.age}</h3>
      </div>
      <div className='flex gap-x-3'>
        <div className='relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200'>
          <div className='relative z-10 w-7 h-7 flex justify-center items-center'>
            <div className='w-2 h-2 rounded-full bg-gray-200'></div>
          </div>
        </div>
        <div
          className={clsx(
            'grow pt-2 px-4 pb-4 mr-4 rounded-2xl bg-slate-100',
            'active:scale-105 active:shadow-md transition'
          )}
        >
          <h3 className='flex gap-x-1.5 font-semibold'>{item.vaccine}</h3>
          <p className='mt-1 text-sm text-gray-600'>Description of ChildrenVaccineItem</p>
          <span
            className={clsx(
              'mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-full border text-brand border-brand',
              item.dose === '1' ? 'hidden' : 'visible'
            )}
          >
            第{item.dose}剂
          </span>
        </div>
      </div>
    </>
  )
}

interface TabProps {
  titles: string[]
  value: number
  setValue: (index: number) => void
}
function Tab({ titles: tabs, value, setValue }: TabProps) {
  return (
    <div className='flex flex-row p-2'>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`${
            index === value ? 'border-b-2 border-solid border-b-brand text-brand' : 'text-gray-700'
          } py-2 px-1 mx-2 text-sm focus:outline-none transition ease-in-out delay-150`}
          onClick={() => setValue(index)}
        >
          {tab}
        </div>
      ))}
    </div>
  )
}
