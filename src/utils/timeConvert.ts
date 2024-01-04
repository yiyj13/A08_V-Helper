import { dayjs } from './dayjs'

export const getCreateTime = (time?: string) => {
  let now = dayjs()
  let articleTime = dayjs(time)

  return now.diff(articleTime, 'day') === 0
    ? articleTime.format('HH:mm')
    : now.diff(articleTime, 'week') === 0
    ? articleTime.format('ddd HH:mm')
    : articleTime.format('YYYY-MM-DD HH:mm')
}
