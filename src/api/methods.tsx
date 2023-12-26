import Taro from '@tarojs/taro'
import api from './http'
import { getUserID } from '../models'

export type GinBase = {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string
}

export type Userinfo = GinBase & {
  openId: string
  userName: string
  avatar: string
  followingArticles: Article[]
  followingVaccines: Vaccine[]
}

export type UserFollowing = Pick<Userinfo, 'followingArticles' | 'followingVaccines'>

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
  isCompleted: boolean
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

export async function Login(): Promise<Userinfo> {
  const responseLogin = await Taro.login()
  const response = await api.get('/api/users/login', { code: responseLogin.code })
  return response.data as Userinfo
}

export async function getUserInfo(): Promise<Userinfo> {
  const response = await api.get('/api/users/' + getUserID())
  return response.data as Userinfo
}

export async function updateUserInfo(data: Partial<Userinfo>): Promise<Userinfo> {
  const response = await api.put('/api/users/' + getUserID(), data)
  return response.data
}

export async function getUserFollowing(): Promise<UserFollowing> {
  const response = await api.get('/api/users/' + getUserID() + '/following')
  return response.data as UserFollowing
}

export async function followVaccine(vaccineId: number): Promise<string> {
  const response = await api.get('/api/users/addfollowingVaccine/' + getUserID(), {
    vaccine_id: vaccineId,
  })
  return response.data
}

export async function unfollowVaccine(vaccineId: number): Promise<string> {
  const response = await api.get('/api/users/removefollowingVaccine/' + getUserID(), {
    vaccine_id: vaccineId,
  })
  return response.data
}

export async function followArticle(articleId: number): Promise<string> {
  const response = await api.get('/api/users/addfollowingArticle/' + getUserID(), {
    article_id: articleId,
  })
  return response.data
}

export async function unfollowArticle(articleId: number): Promise<string> {
  const response = await api.get('/api/users/removefollowingArticle/' + getUserID(), {
    article_id: articleId,
  })
  return response.data
}

export async function getVaccineList(): Promise<Vaccine[]> {
  const response = await api.get('/api/vaccines')
  return response.data
}

export async function getVaccineRecordList(): Promise<VaccinationRecord[]> {
  const response = await api.get('/api/vaccination-records/user/' + getUserID())
  return response.data
}

export async function postVaccineRecord(data: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
  const response = await api.post('/api/vaccination-records', data)
  return response.data
}

export async function deleteVaccineRecord(id: number): Promise<string> {
  const response = await api.delete('/api/vaccination-records/' + id)
  return response.data
}

export async function putVaccineRecord(id: number, data: Partial<VaccinationRecord>): Promise<VaccinationRecord> {
  const response = await api.put('/api/vaccination-records/' + id, data)
  return response.data
}

export async function getProfiles(): Promise<Profile[]> {
  const response = await api.get('/api/profiles/user/' + getUserID())
  return response.data
}

export async function postProfile(data: Partial<Profile>): Promise<Profile> {
  const response = await api.post('/api/profiles', {
    ...data,
    userId: getUserID(),
  })
  return response.data
}

export async function putProfile(id: number, data: Partial<Profile>): Promise<Profile> {
  const response = await api.put('/api/profiles/' + id, data)
  return response.data
}

export async function deleteProfile(id: number): Promise<Profile> {
  const response = await api.delete('/api/profiles/' + id)
  return response.data
}

export async function getTemperatureRecordList(): Promise<TemperatureRecord[]> {
  const response = await api.get('/api/temperature-records/user/' + getUserID())
  return response.data
}

export async function postTemperatureRecord(data: Partial<TemperatureRecord>): Promise<TemperatureRecord> {
  const response = await api.post('/api/temperature-records', data)
  return response.data
}

export async function putTemperatureRecord(id: number, data: Partial<TemperatureRecord>): Promise<TemperatureRecord> {
  const response = await api.put('/api/temperature-records/' + id, data)
  return response.data
}

export async function deleteTemperatureRecord(id: number): Promise<string> {
  const response = await api.delete('/api/temperature-records/' + id)
  return response.data
}

export async function getTopArticlesWithVaccine(
  vaccineid: number
): Promise<Article[]> {
  const response = await api.get('/api/articles', {
    page: 1,
    size: 2,
    isBind: true,
    vaccineID: vaccineid,
  })
  return response.data
}

export async function postArticle(
  title: string, // 标题
  content: string, // 内容
  vaccineid?: number // 疫苗id (可选)
): Promise<Article> {
  const response = await api.post('/api/articles', {
    title,
    content,
    vaccineid,
    isbind: vaccineid ? true : false,
    userId: getUserID(),
  })
  return response.data
}

export async function getMyArticles(): Promise<Article[]> {
  const response = await api.get('/api/articles/user/' + getUserID())
  return response.data
}

export async function deleteArticle(id: number): Promise<string> {
  const response = await api.delete('/api/articles/' + id)
  return response.data
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
