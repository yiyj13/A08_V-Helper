import Taro from '@tarojs/taro'
import { resetUser } from '../models'
import { decrypt, encrypt, checkEncryptionNecessity } from './encryption'

// status code interceptor
const I_statuscode = function (chain: any) {
  const requestParams = chain.requestParams
  return chain.proceed(requestParams).then((res: any) => {
    // check status code
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res
    } else if (res.statusCode === 401) {
      // meet 401, reset user and redirect to index page (re-login)
      resetUser()
      Taro.showToast({
        title: '登录状态过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
      Taro.reLaunch({
        url: '/pages/index'
      })
    } else {
      // other status code, reject
      return Promise.reject(res)
    }
  })
}

// encryption interceptor
const I_encryption = function (chain: any) {
  const requestParams = chain.requestParams
  const needEncrypt = checkEncryptionNecessity(requestParams.url)
  if (needEncrypt && requestParams.data) {
    requestParams.data = {
      data: encrypt(JSON.stringify(requestParams.data))
    }
  }
  return chain.proceed(requestParams).then((res: any) => {
    if (needEncrypt && res.data.data) {
      res.data = JSON.parse(decrypt(res.data.data))
    }
    return res
  })
}

const __interceptors = [I_statuscode, I_encryption]
if (process.env.NODE_ENV === 'development') {
  __interceptors.push(Taro.interceptors.logInterceptor)
}
export const interceptors = __interceptors
