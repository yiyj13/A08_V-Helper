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

export type VaccineRecord = GinBase & {
  profileId: number
  vaccineId: number
  vaccine: Vaccine
  vaccinationDate: string
  voucher: string
  vaccinationLocation: string
  reminder: boolean
  nextVaccinationDate: string
  note: string
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

export async function getVaccineRecordList(): Promise<VaccineRecord[]> {
  const response = await api.get('/api/vaccination-records')
  return response.data
}

export async function postVaccineRecord(data: Partial<VaccineRecord>): Promise<VaccineRecord> {
  const response = await api.post('/api/vaccination-records', data)
  return response.data
}
