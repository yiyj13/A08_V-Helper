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

export default Tab
