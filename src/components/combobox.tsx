import { ScreenLittle } from '@nutui/icons-react-taro'
import { View, ScrollView, ViewProps } from '@tarojs/components'
import clsx from 'clsx'
import { useState } from 'react'

type ComboBoxProps = ViewProps & {
  title: string
  options: string[]
  onSelect?: (option: string) => void
  defaultValue?: string
}

const ComboBox = ({ title, options, onSelect, defaultValue }: ComboBoxProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue || '')
  const [isOpen, setIsOpen] = useState(false)

  const toggleComboBox = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    onSelect && onSelect(option)
    setIsOpen(false)
  }

  return (
    <View className='relative' id='comboBox'>
      <View
        className={clsx('border text-gray-500 bg-white border-gray-100 p-2 rounded-md transition-all', {
          'ring-2 ring-brand': isOpen,
        })}
        onClick={toggleComboBox}
      >
        <View className='flex flex-row justify-between items-center'>
          {selectedOption || title}
          <ScreenLittle size={16} />
        </View>
      </View>

      {/* {isOpen && ( */}
      <ScrollView
        scrollY
        className={clsx('absolute bg-white mt-2 h-64 border border-gray-100 rounded-md shadow-lg transition-all', {
          '-z-10 -translate-y-2 opacity-0': !isOpen,
          'z-20': isOpen
        })}
      >
        <View className='absolute mt-0 w-full'>
          {options.map((option) => (
            <View
              key={option}
              className='p-2 active:bg-slate-100'
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </View>
          ))}
        </View>
      </ScrollView>
      {/* )} */}
    </View>
  )
}

export default ComboBox
