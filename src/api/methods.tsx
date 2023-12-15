import Taro from '@tarojs/taro'
import api from './index'

export type GinBase = {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string
}

export type Vaccine = GinBase & {
  name: string
  description: string
  targetDisease: number
  sideEffects: string
  precautions: string
  validPeriod: number
  type: string
}

export type Post = GinBase & {
  title: string
  content: string
  creatorName: string
}

export type Reply = GinBase & {
  articleId: number
  content: string
  userName: string
  userId: number
}

export type VaccinationRecord = GinBase & {
  profileId: number
  vaccineId: number
  vaccine: Vaccine
  vaccinationDate: string
  voucher: string
  vaccinationLocation: string
  reminder: boolean
  remindDate: string
  nextVaccinationDate: string
  note: string
}

export type TemperatureRecord = GinBase & {
  profileId: number
  date: string // 测温时间
  temperature: number // 体温值
  note: string // 备注
}

// TODO: to be merged into VaccinationRecord
export type RecordData = GinBase & {
  profileId: number // 接种人
  vaccineId: number // 疫苗名称
  type: string // 接种类型
  vaccinationDate: string // 接种时间
  reminder: boolean // 接种提醒
  nextVaccinationDate: string // 下次接种时间
  remindDate: string // 提醒时间
  voucher: string // 接种凭证
  note: string // 备注
}

export type Profile = GinBase & {
  avatar: string // 头像
  relationship: string // 与本人关系
  fullName: string // 成员姓名
  gender: string // 性别
  dateOfBirth: string // 出生日期
  note: string // 备注
}

export async function getToken(): Promise<string> {
  const responseLogin = await Taro.login()
  const response = await api.get('/api/users/login', { code: responseLogin.code })
  return response.data.openId
}

export async function getVaccineList(): Promise<Vaccine[]> {
  const response = await api.get('/api/vaccines')
  return response.data
}

export async function getVaccineRecordList(): Promise<VaccinationRecord[]> {
  const response = await api.get('/api/vaccination-records')
  return response.data
}

export async function postVaccineRecord(data: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
  const response = await api.post('/api/vaccination-records', data)
  return response.data
}
