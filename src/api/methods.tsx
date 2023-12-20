import Taro from '@tarojs/taro'
import api from './http'

export type GinBase = {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string
}

export type User = GinBase & {
  OpenID: string
  UserName: string
  Avatar: string
}

export type Vaccine = GinBase & {
  name: string
  description: string
  targetDisease: string
  sideEffects: string
  precautions: string
  validPeriod: number
  type: string
}

export type Article = GinBase & {
  title: string
  content: string
  userName: string
  userId: string
  isBind: boolean
  vaccineId: number
}

export type Reply = GinBase & {
  articleId: number
  content: string
  userName: string
  userId: number
}

export type ArticleFull = Article & {
  replies: Reply[]
}

export type VaccinationRecord = GinBase & {
  profileId: number
  vaccineId: number
  vaccinationType: string
  vaccine: Vaccine
  vaccinationDate: string
  voucher: string
  vaccinationLocation: string
  reminder: boolean
  remindTime: string
  valid: string // 有效期 6月 1年
  remindBefore: string // 提前多久提醒 2天 1周 
  nextVaccinationDate: string
  note: string
}

export type TemperatureRecord = GinBase & {
  profileId: number
  date: string // 测温时间
  temperature: number // 体温值
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

export async function getVaccineByID(id: string): Promise<Vaccine> {
  const response = await api.get('/api/vaccines/' + id)
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

export async function getProfiles(): Promise<Profile[]> {
  const response = await api.get('/api/profiles')
  return response.data
}

export async function getArticles(
  page: number, // 页码
  size: number, // 每页大小
  vaccineid?: number // 疫苗id (可选)
): Promise<Article[]> {
  const response = await api.get('/api/articles', { page, size, vaccineid })
  return response.data
}

export async function postArticle(
  title: string, // 标题
  content: string, // 内容
  vaccineid?: number
): // 疫苗id (可选)
Promise<Article> {
  const response = await api.post('/api/articles', { title, content, vaccineid, isbind: vaccineid ? true : false })
  return response.data
}

export async function getArticleFullByID(id?: string): Promise<ArticleFull> {
  if (!id) return Promise.reject('id is empty')
  const article = (await api.get('/api/articles/' + id)).data
  const replies = (await api.get('/api/replys', { articleId: id })).data
  return { ...article, replies }
}

export async function getArticleByID(id: number): Promise<Article> {
  const response = await api.get('/api/articles/' + id)
  return response.data
}

export async function getReplys(articleId: number): Promise<Reply[]> {
  const response = await api.get('/api/replys', { articleId })
  return response.data
}

export async function postReply(articleId: number, content: string): Promise<Reply> {
  const response = await api.post('/api/replys', { articleId, content })
  return response.data
}
