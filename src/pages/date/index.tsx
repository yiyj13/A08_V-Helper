import { CalendarCard } from '@nutui/nutui-react-taro'
import { RectRight } from '@nutui/icons-react-taro'
import { Text } from '@tarojs/components'
import { useState } from 'react'

type ScheduleType = 'vaccine' | 'medicine' | 'temperature' | 'other'

type TSchedule = {
  name: string
  title: string
  date: Date
  type: ScheduleType
}

const schedules: TSchedule[] = [
  {
    name: 'self',
    title: '打疫苗',
    date: (() => {
      let date = new Date()
      date.setDate(date.getDate() + 2)
      return date
    })(),
    type: 'vaccine',
  },
  {
    name: 'self',
    title: '打疫苗1',
    date: new Date(),
    type: 'vaccine',
  },
  {
    name: 'self',
    title: '打疫苗2',
    date: new Date(),
    type: 'vaccine',
  },
  {
    name: 'son',
    title: '吃药',
    date: new Date(),
    type: 'medicine',
  },
  {
    name: 'daughter',
    title: '测体温',
    date: new Date(),
    type: 'temperature',
  },
]

export default function DatePage() {
  const [date, setDate] = useState(new Date())

  const getColor = (type: ScheduleType) => {
    switch (type) {
      case 'vaccine':
        return 'red'
      case 'medicine':
        return 'green'
      case 'temperature':
        return 'orange'
      case 'other':
        return 'gray'
    }
  }

  const renderDayTop = (day) =>
    schedules.find(
      (schedule) =>
        schedule.date.getFullYear() === day.year &&
        schedule.date.getMonth() === day.month - 1 &&
        schedule.date.getDate() === day.date
    )
      ? '●'
      : null

  return (
    <div className='flex flex-col p-4 pb-32'>
      <CalendarCard
        renderDayTop={renderDayTop}
        type='single'
        defaultValue={date}
        onChange={(value) => {
          if (value instanceof Date) {
            setDate(value)
          }
        }}
      />
      <section className='mt-4'>
        <h2 className='text-xl font-bold leading-6 text-gray-900'>
          日程：{date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'}
        </h2>

        <ol className='mt-4 space-y-1 text-sm leading-6'>
          {schedules.map((schedule, index) => {
            if (schedule.date.getDate() !== date.getDate()) {
              return null
            }
            return (
              <li className='flex flex-row p-2 justify-between items-center active:bg-gray-100 rounded-2xl' key={index}>
                <div className='flex flex-row items-center'>
                  <div className='w-4 h-4 mr-4 rounded-full' style={{ backgroundColor: getColor(schedule.type) }}></div>
                  <div className='flex flex-col'>
                    <Text >
                      {schedule.name} {schedule.title}
                    </Text>
                    <Text className='text-sm text-gray-500'>{schedule.date.toLocaleTimeString()}</Text>
                  </div>
                </div>
                <RectRight />
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
