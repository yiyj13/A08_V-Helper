import { ScreenLittle } from '@nutui/icons-react-taro'
import { View, ScrollView, ViewProps } from '@tarojs/components'
import { useState } from 'react'

type ComboBoxProps = ViewProps & {
  title: string
  options: string[]
  onSelect?: (option: string) => void
}

const ComboBox = ({ title, options, onSelect }: ComboBoxProps) => {
  const [selectedOption, setSelectedOption] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const toggleComboBox = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <View className='relative' id='comboBox'>
      <View
        className={
          'border text-gray-500 bg-white border-gray-300 p-2 rounded-md' + ' ' + (isOpen ? 'ring-2 ring-brand' : '')
        }
        onClick={toggleComboBox}
      >
        <View className='flex flex-row justify-between items-center'>
          {selectedOption || title}
          <ScreenLittle size={16} />
        </View>
      </View>

      {isOpen && (
        <ScrollView scrollY className='absolute bg-white z-20 mt-1 h-64 ring-2 ring-gray-300 rounded-md shadow-lg'>
          <View className='absolute mt-0 w-full'>
            {options.map((option) => (
              <View key={option} className='p-2 active:bg-slate-100 text-gray-500' onClick={() => handleOptionClick(option)}>
                {option}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default ComboBox
