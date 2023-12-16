import _dayjs from 'dayjs'

// convert ISO to 'yyyy-MM-ddTHH:mm:ss'
const IOSDateFormats = (date: string) => {
  return date.replace(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.\d+Z/, '$1')
}

export const dayjs = (date?: _dayjs.ConfigType, format?: _dayjs.OptionType, locale?: string, strict?: boolean) => {
  const _date = typeof date === 'string' ? IOSDateFormats(date) : date
  return _dayjs(_date, format, locale, strict)
}
